"""Codex agents through the official Python SDK (`openai-codex`), which drives a local `codex app-server` over
JSON-RPC: typed items, no CLI output parsing.

Three uses, each on an ephemeral thread (nothing is written to the Codex history):

- `image(prompt, refs)`: Codex's built-in image tool draws (or, with reference images, edits) one picture; the
  PNG comes back from the turn's image-generation item.
- `ask(prompt, schema, images)`: one JSON answer, validated here against `schema`. The schema goes in the prompt
  rather than as the turn's output schema: with an output schema, many reasoning-model turns stalled after their
  reasoning item (seen with `codex exec --output-schema`); local validation plus a retry is as strict.
- `Session`: a multi-turn coding agent in one directory (workspace-write sandbox, approvals denied), optionally
  with MCP servers (the site builder's render tools). MCP servers run outside the sandbox.

Every turn has a wall-clock limit; at the limit the turn is interrupted and its result kept.

Sign in once with `codex login` (ChatGPT plan or API key). `CODEX_HOME` selects another Codex home as usual.
"""
from __future__ import annotations

import base64
import json
import os
import tempfile
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path

import jsonschema
from openai_codex import ApprovalMode, Codex, CodexConfig, LocalImageInput, Sandbox, TextInput

# Codex features a scripted agent never needs (subagents, connectors, its own browser or desktop control).
QUIET = ("agents.enabled=false", "features.apps=false", "features.browser_use=false", "features.computer_use=false")


class AgentError(RuntimeError):
    pass


@dataclass
class Turn:
    status: str  # completed | interrupted (time limit) | failed
    text: str
    seconds: float
    usage: dict
    items: list = field(repr=False, default_factory=list)


def _codex(mcp: dict[str, list[str]] | None = None) -> Codex:
    """A Codex runtime; `mcp` maps a server name to its command line (stdio MCP servers, their tools pre-approved:
    with approvals denied, an MCP tool call would otherwise be refused)."""
    overrides = list(QUIET)
    for name, (command, *args) in (mcp or {}).items():
        overrides += [f"mcp_servers.{name}.command={json.dumps(command)}", f"mcp_servers.{name}.args={json.dumps(args)}",
                      f"mcp_servers.{name}.tool_timeout_sec=900", f"mcp_servers.{name}.startup_timeout_sec=60",
                      f'mcp_servers.{name}.default_tools_approval_mode="approve"']
    return Codex(CodexConfig(config_overrides=tuple(overrides), env=dict(os.environ)))


def _inputs(text: str, images=()) -> list:
    return [TextInput(text), *(LocalImageInput(str(Path(p).resolve())) for p in images)]


def _run(thread, inputs: list, seconds: float, model: str | None = None) -> Turn:
    t0 = time.monotonic()
    handle = thread.turn(inputs, model=model)
    timer = threading.Timer(seconds, handle.interrupt)
    timer.start()
    try:
        result = handle.run()
    finally:
        timer.cancel()
    status = getattr(result.status, "value", str(result.status))
    if result.error and status == "failed":
        raise AgentError(f"turn failed: {result.error}")
    usage = result.usage.model_dump(mode="json") if result.usage else {}
    return Turn(status, result.final_response or "", round(time.monotonic() - t0, 1), usage, list(result.items))


def unwrap(item):
    return item.root if hasattr(item, "root") else item


class Agent:
    def __init__(self, model: str | None = None, effort: str | None = None):
        self.model, self.effort = model, effort

    def _config(self) -> dict:
        return {"model_reasoning_effort": self.effort} if self.effort else {}

    def image(self, prompt: str, out: Path, refs=(), seconds: float = 600) -> dict:
        """Draw one image from `prompt` (an edit of `refs` when given) into `out` (PNG)."""
        how = ("Pass the attached image" + ("s" if len(refs) > 1 else "") + " as reference images, so the result "
               "is an edit of " + ("them" if len(refs) > 1 else "it") + "." if refs else "Use no reference images.")
        message = ("Call the image generation tool exactly once, with the text between <<<PROMPT and PROMPT>>> "
                   f"verbatim as its prompt and no transparent background. {how} Do not run commands, do not "
                   "describe the result and do not call the tool again. Then reply DONE.\n<<<PROMPT\n"
                   + prompt.strip() + "\nPROMPT>>>")
        with _codex() as codex, tempfile.TemporaryDirectory(prefix="sitegen-") as cwd:
            thread = codex.thread_start(model=self.model, sandbox=Sandbox.read_only, cwd=cwd, ephemeral=True,
                                        approval_mode=ApprovalMode.deny_all, config=self._config())
            turn = _run(thread, _inputs(message, refs), seconds)
        made = [i for i in map(unwrap, turn.items) if getattr(i, "type", "") == "imageGeneration" and i.result]
        if not made:
            raise AgentError(f"no image ({turn.status}): {turn.text[:300]}")
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(base64.b64decode(made[-1].result))
        if made[-1].saved_path:  # Codex keeps its own copy under $CODEX_HOME/generated_images
            Path(str(made[-1].saved_path)).unlink(missing_ok=True)
        return {"seconds": turn.seconds, "usage": turn.usage, "revised_prompt": made[-1].revised_prompt}

    def ask(self, prompt: str, schema: dict, images=(), seconds: float = 300, tries: int = 2) -> dict:
        """One JSON object matching `schema`, from a read-only turn that sees `images`."""
        prompt = (prompt.rstrip() + "\n\nReply with only one JSON object (no code fence, no other text) that "
                  "validates against this JSON Schema:\n" + json.dumps(schema))
        error = ""
        for _ in range(tries):
            with _codex() as codex, tempfile.TemporaryDirectory(prefix="sitegen-") as cwd:
                thread = codex.thread_start(model=self.model, sandbox=Sandbox.read_only, cwd=cwd, ephemeral=True,
                                            approval_mode=ApprovalMode.deny_all, config=self._config())
                turn = _run(thread, _inputs(prompt, images), seconds)
            try:
                return parse_json(turn.text, schema)
            except ValueError as exc:
                error = f"{turn.status}: {exc}"
        raise AgentError(f"no valid JSON answer: {error}")

    def session(self, cwd: Path, mcp: dict[str, list[str]] | None = None) -> Session:
        return Session(self, Path(cwd), mcp)


class Session:
    """A coding agent working in `cwd` over several turns (the build, then fix rounds), as one thread."""

    def __init__(self, agent: Agent, cwd: Path, mcp: dict[str, list[str]] | None):
        self.agent, self.cwd, self.mcp = agent, cwd, mcp
        self._codex = self._thread = None

    def __enter__(self) -> Session:
        self._codex = _codex(self.mcp).__enter__()
        self._thread = self._codex.thread_start(model=self.agent.model, sandbox=Sandbox.workspace_write,
                                                cwd=str(self.cwd), ephemeral=True,
                                                approval_mode=ApprovalMode.deny_all, config=self.agent._config())
        return self

    def __exit__(self, *exc) -> None:
        self._codex.__exit__(*exc)

    def turn(self, text: str, images=(), seconds: float = 3600, model: str | None = None) -> Turn:
        """One turn; `model` switches the model from this turn on (the thread keeps its context)."""
        return _run(self._thread, _inputs(text, images), seconds, model)


def parse_json(text: str, schema: dict) -> dict:
    """The last JSON object in `text` that validates against `schema` (ValueError if none)."""
    start, end = text.find("{"), text.rfind("}")
    if start < 0:
        raise ValueError(f"no JSON object in {text[-200:]!r}")
    try:
        out = json.loads(text[start:end + 1])
        jsonschema.validate(out, schema)
    except (json.JSONDecodeError, jsonschema.ValidationError) as exc:
        raise ValueError(f"{type(exc).__name__}: {str(exc)[:200]}") from None
    return out
