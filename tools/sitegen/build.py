"""Build a design-* site from an accepted design image: scaffold, build, gate and fix, review, polish.

1. Scaffold `html/sites/design-<task>-<scenario>-<NN>/` from the base site: site.js a design on
   templates/site/base.js, the widget a design on the task's template for the scenario (both `design: {}`), so the
   page boots and passes the checker before the agent changes anything. The site is added to html/scenarios.json.
2. Build: a Codex agent (the builder model) restyles it to the design image (workspace-write sandbox in the site
   folder, approvals denied), with the `render` and `check` tools of render_server.py, and replies with a JSON
   report. The gate (gate.full: files, syntax, lint, megawob.check at every training viewport) decides; failures,
   and a report that is not done, go back to the same thread as fix rounds on the fix model, up to `fix_rounds`
   times.
3. Review: a separate read-only turn (the reviewer model) that did not build the page scores its fidelity (1-5)
   from renders and lists what still differs.
4. Polish: a stronger model in a fresh thread works from that list, then the gate (one fix round) and the review
   run again (its fix round on the fix model too). The polish is kept only if the gate passes and the fidelity did not drop; otherwise the built files
   are restored. Skipped when the review gives 5.

The run record (every turn's report, gate result, timings and token usage, the reviews) goes to
<out>/runs/<site>.json; a KIT_REQUESTS.md the agent writes is moved next to it, so the site folder holds only site
files.
"""
from __future__ import annotations

import json
import re
from collections import Counter
import shutil
import sys
import tempfile
import time
from datetime import datetime
from pathlib import Path

import gate
from agent import Agent, AgentError, unwrap, parse_json
from megawob import catalog, driver

HERE = Path(__file__).resolve().parent
SITES, TEMPLATES = catalog.HTML / "sites", catalog.HTML / "templates"
SCHEMA = json.loads((HERE / "prompts" / "result.schema.json").read_text())
FIX = """The final gate failed. These checks must pass (the lint, then megawob.check at every training viewport with
more seeds than `check()` runs):
{fails}

Reproduce a failure with `render(seed=N, params={...}, play=K)` before editing, fix what it shows, then call
`check()` until it passes. Keep the look you built. Reply with the same JSON report as before."""
POLISH = """This site was built from the design image by another agent and passes every check. Your job is to raise its
fidelity. An independent review of the current page gave it {fidelity} of 5 and lists what still differs from the
design image:
{differences}
Problems in the episode settings (instruction modes, end control, decoys):
{frame}
Close as many of these as you can, the task widget as much as the frame, without breaking what works: the checks
must still pass (call `check()` before you finish). The brief the site was built from follows."""
REVIEW_SCHEMA = {
    "type": "object", "additionalProperties": False, "required": ["fidelity", "differences", "frame_issues"],
    "properties": {"fidelity": {"type": "integer", "minimum": 1, "maximum": 5},
                   "differences": {"type": "array", "items": {"type": "string"}},
                   "frame_issues": {"type": "array", "items": {"type": "string"}}},
}


def task_template(task: str, scenario: str) -> str:
    """The template a new widget for `scenario` is a design on: templates/<task>/base.js when the task has one,
    else the first of its templates that names the scenario (`design: {}` then draws that template's pilot)."""
    if (TEMPLATES / task / "base.js").is_file():
        return "base"
    for path in sorted((TEMPLATES / task).glob("[!_]*.js")):  # _*.js are shared libraries
        if re.search(rf"(?<![\w-]){re.escape(scenario)}(?![\w-])", path.read_text()):
            return path.stem
    raise SystemExit(f"{task}: no widget template names scenario {scenario!r} (html/templates/{task}/)")


def scaffold(site: str, task: str, scenario: str, description: str) -> None:
    """A new site from the base site's frame and its widget for the scenario, as designs on their templates.
    A composite widget loads the widgets it embeds (`uses: [[task, widget], ...]`) from the site's own widgets/."""
    dest, base = SITES / site, SITES / "base"
    (dest / "widgets").mkdir(parents=True)
    (dest / "site.js").write_text(
        "// Design on templates/site/base.js: the base site's frame and overlays, unchanged. Set its tokens and\n"
        "// replace the parts the design draws differently (design: { TITLES, parts: { name: (base, S) => ... } };\n"
        "// the header of the template lists them).\n"
        f"env.site({{ name: {site!r}, template: 'site/base', design: {{}} }});\n")
    shutil.copy2(base / "site.css", dest / "site.css")
    tpl = task_template(task, scenario)
    (dest / "widgets" / f"{task}.js").write_text(
        f"// Design on templates/{task}/{tpl}.js, unchanged. Restyle it in site.css, set the template's tokens and\n"
        "// replace the parts the design draws differently (design: { parts: { name: (base, S) => replacement } };\n"
        "// html/templates/README.md).\n"
        f"env.widget({{\n  task: {task!r},\n  site: {site!r},\n  name: 'design',\n  split: 'train',\n"
        f"  scenarios: [{scenario!r}],\n  template: '{task}/{tpl}',\n  design: {{}},\n}});\n")
    code = (base / "widgets" / f"{task}.js").read_text() if (base / "widgets" / f"{task}.js").is_file() else ""
    base_widgets = json.loads((base / "manifest.json").read_text())["widgets"]
    for sub in sorted(set(re.findall(r"\[\s*'([a-z][a-z-]*)'\s*,\s*'[\w-]+'\s*\]", code))):
        if sub == task or not (base / "widgets" / f"{sub}.js").is_file() or not (catalog.HTML / "tasks" / sub).is_dir():
            continue
        names = [w["name"] for w in base_widgets.get(sub, [])]
        if (TEMPLATES / sub / "base.js").is_file() and names:  # designs by name, as composite sites embed them
            (dest / "widgets" / f"{sub}.js").write_text(
                f"// Designs on templates/{sub}/base.js: the base site's {sub} widgets, unchanged; this composite\n"
                "// site embeds them by name.\n"
                f"for (const name of {names!r}) {{\n"
                f"  env.widget({{ task: {sub!r}, name, template: '{sub}/base', design: {{ widget: name }} }});\n}}\n")
        else:
            shutil.copy2(base / "widgets" / f"{sub}.js", dest / "widgets" / f"{sub}.js")
    driver.write_json(dest / "manifest.json", {"site": site, "split": "train", "description": description,
                                               "widgets": {task: [{"name": "design", "split": "train"}]}})
    gate.index(site)


def file_map(folder: Path) -> str:
    return "\n".join(f"{p.relative_to(folder)}  ({p.stat().st_size} bytes)"
                     for p in sorted(folder.rglob("*")) if p.is_file())


def fill(text: str, **values) -> str:
    """Fill {name} placeholders without str.format (the brief quotes JavaScript and JSON braces)."""
    for k, v in values.items():
        text = text.replace("{" + k + "}", str(v))
    return text


def prompt(d: dict, minutes: int) -> str:
    from PIL import Image
    w, h = Image.open(d["image"]).size
    intent = (f"{d['id']}\nstyle: {d['era']} {d['style']['desc']}\n"
              + "".join(f"{a}: {o}\n" for a, o in d["arrangement"].items())
              + (f"task area: {d['arrange']['text']}\n" if d.get("arrange") else "")
              + f"shows: {d['screen']}\nsample goal: {d['sample']}")
    return fill((HERE / "prompts" / "build.md").read_text(), site=d["site"], task=d["task"], scenario=d["scenario"],
                minutes=minutes, width=w, height=h, intent=intent, file_map=file_map(SITES / d["site"]),
                schema=json.dumps(SCHEMA, indent=1))


def review(reviewer: Agent, d: dict) -> dict | None:
    """An independent look at the built page (prompts/site_review.txt): fidelity 1-5 and what still differs, from
    the design image, the page beside it and the four instruction modes. None if the reviewer gives no answer."""
    from render import Renderer
    with tempfile.TemporaryDirectory(prefix="sitegen-review-") as tmp:
        r = Renderer(d["site"], d["task"], d["scenario"], Path(d["image"]))
        try:
            shots = [Path(tmp) / "design.png", Path(tmp) / "modes.png"]
            r.compare(0)[0].save(shots[0])
            r.compare(3, "modes")[0].save(shots[1])
        finally:
            r.close()
        try:
            return reviewer.ask((HERE / "prompts" / "site_review.txt").read_text(), REVIEW_SCHEMA,
                                images=[d["image"], *shots])
        except AgentError as exc:
            print(f"{d['site']}: review failed: {exc}", flush=True)
            return None


def work(agent: Agent, d: dict, first: str, stage: str, record: dict, minutes: int, fix_rounds: int,
         seeds: int, fix_model: str | None = None) -> bool:
    """One agent thread on the site: the first turn, then gate failures back as fix rounds (on `fix_model` when
    given; the thread keeps its context). True if the gate passed."""
    site, task = d["site"], d["task"]
    server = [sys.executable, str(HERE / "render_server.py"), "--site", site, "--task", task,
              "--scenario", d["scenario"], "--image", d["image"]]
    with agent.session(SITES / site, mcp={"megawob-site": server}) as session:
        turn, model = session.turn(first, images=[d["image"]], seconds=minutes * 60), agent.model
        for rnd in range(fix_rounds + 1):
            try:
                report = parse_json(turn.text, SCHEMA)
            except ValueError as exc:
                report = {"error": str(exc)}
            fails = gate.full(site, task, seeds)
            # The scaffold passes the gate untouched, so an agent that stopped early must not pass with it.
            if not report.get("done"):
                fails.append("your report says done=false (or is missing): finish the remaining differences, "
                             "then report again" + (f"; {report['error']}" if "error" in report else ""))
            calls = Counter(getattr(i, "tool", None) for i in map(unwrap, turn.items)
                            if getattr(i, "type", "") == "mcpToolCall")
            record["turns"].append({"stage": stage if rnd == 0 else f"{stage} fix", "model": model, "status": turn.status,
                                    "seconds": turn.seconds, "tool_calls": dict(calls), "usage": turn.usage,
                                    "report": report, "gate": fails})
            print(f"{site}: {stage} turn {rnd + 1} ({model or 'default model'}) {turn.status} in "
                  f"{turn.seconds:.0f} s, gate {'passed' if not fails else f'{len(fails)} failures'}", flush=True)
            if not fails:
                return True
            if rnd < fix_rounds:
                model = fix_model or agent.model
                turn = session.turn(fill(FIX, fails="\n".join(f"- {f}" for f in fails)), seconds=minutes * 30,
                                    model=model)
    return False


def build(design_path: Path, out: Path, builder: Agent, reviewer: Agent | None = None, polisher: Agent | None = None,
          minutes: int = 60, fix_rounds: int = 2, seeds: int = 5, force: bool = False,
          fix_model: str | None = None) -> dict:
    d = json.loads(design_path.read_text())
    if d.get("status") != "accepted":
        raise SystemExit(f"{design_path}: the design is not accepted (run `sitegen.py design` first)")
    d["image"] = str(design_path.parent / "design.png")
    site = d["site"]
    dest = SITES / site
    if dest.exists():
        if not force:
            raise SystemExit(f"{site} exists; pass --force to rebuild it from scratch")
        shutil.rmtree(dest)
    t0 = time.monotonic()
    scaffold(site, d["task"], d["scenario"], d["id"])
    record = {"site": site, "design": str(design_path), "started": datetime.now().isoformat(timespec="seconds"),
              "builder": builder.model, "fixer": fix_model or builder.model, "reviewer": reviewer and reviewer.model, "polisher": polisher and polisher.model,
              "turns": []}
    passed = work(builder, d, prompt(d, minutes), "build", record, minutes, fix_rounds, seeds, fix_model)
    before = review(reviewer, d) if passed and reviewer else None
    record["review"] = before
    if passed and polisher and (before is None or before["fidelity"] < 5):
        # Polish: a stronger model, in a fresh thread, works from the review's list. The review decides whether it is
        # kept: the gate must pass and the fidelity must not drop; otherwise the built files come back.
        with tempfile.TemporaryDirectory(prefix="sitegen-keep-") as tmp:
            kept = Path(tmp) / site
            shutil.copytree(dest, kept)
            note = fill(POLISH, fidelity=before["fidelity"] if before else "?",
                        differences="\n".join(f"- {x}" for x in (before or {}).get("differences", [])) or "- (none listed)",
                        frame="\n".join(f"- {x}" for x in (before or {}).get("frame_issues", [])) or "- (none)")
            ok = work(polisher, d, note + "\n\n" + prompt(d, minutes), "polish", record, minutes, 1, seeds, fix_model)
            after = review(reviewer, d) if ok and reviewer else None
            keep = ok and (before is None or after is None or after["fidelity"] >= before["fidelity"])
            if not keep:
                shutil.rmtree(dest)
                shutil.copytree(kept, dest)
            record["polish"] = {"kept": keep, "gate_passed": ok, "review": after}
            if keep and after:
                record["review"] = after
            print(f"{site}: polish {'kept' if keep else 'reverted'} (fidelity "
                  f"{before and before['fidelity']} -> {after and after['fidelity']})", flush=True)
    requests = dest / "KIT_REQUESTS.md"
    runs = out / "runs"
    runs.mkdir(parents=True, exist_ok=True)
    if requests.is_file():
        shutil.move(requests, runs / f"{site}.KIT_REQUESTS.md")
    gate.index(site)
    record.update(passed=passed, fidelity=(record["review"] or {}).get("fidelity"),
                  minutes=round((time.monotonic() - t0) / 60, 1))
    driver.write_json(runs / f"{site}.json", record)
    return record
