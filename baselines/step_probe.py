"""Step probe: do the screenshot and the goal carry what a policy needs, and can its actions express the next steps?
Each probe state is a fresh reset plus a random prefix of the oracle's actions. From there a model takes up to
--horizon actions (default 3) in one Responses API conversation: the first turn has the goal, the prefix as its
own earlier actions and the screenshot; each later turn has what its last action did (run, or the error / rejected
input BrowserGym would report; never the reward) and the new screenshot, so it remembers every screenshot and reply
of the rollout. The whole conversation is resent each turn (ChatGPT sign-in allows only store=false, so no
previous_response_id) under one prompt_cache_key, so the repeated prefix is cached. --images N keeps only the last
N screenshots; --no-history drops the prefix (relative goals such as "halve the zoom" then cannot be told apart
from done).
The probe applies every action and reads the change in the env's progress (1 - error / start error, the potential
behind the shaped reward). The oracle's own next --horizon actions from the same state are the control. Several
actions credit steps that only pay off later (opening a source tab, then typing what it shows).

    python baselines/step_probe.py --task set-slider --states 4 --model gpt-6-luna
    python baselines/step_probe.py --site base --states 4 --horizon 5 --workers 4
    python baselines/step_probe.py --task fill-form --horizon 1               # the single-step probe

Any OpenAI-compatible endpoint: --base-url (default OPENAI_BASE_URL, else https://api.openai.com/v1) and the key in
OPENAI_API_KEY; --api chat talks Chat Completions instead of the Responses API. Plain episodes (start off, no
overlays, a submit control, atomic drags) at 1280x720; --set k=v overrides a knob.

Outcome of one action (the model's, the oracle's), against the score before it:
  success   the episode ended and succeeded (the right ending once the task is done)
  better    progress went up
  none      progress unchanged (focusing a field, opening a menu or tab, a miss)
  worse     progress went down
  fail      the episode ended without success (a wrong or early ending, a violation such as a track click)
  invalid   no parsable action, or the page refused it
The rollout's outcome (h_outcome) compares its last score with the state's. Summary per widget and task:
  good@1    the first action succeeds or improves progress, or, where the oracle's own first step does not move
            progress either, it is the oracle's action type on the oracle's target element
  good@H    the rollout ends better than it started (or succeeds); succ@H / fail@H: it ended the episode
  gain      mean progress gained over the rollout; o.gain the oracle's over as many actions
  inval     share of the model's actions that were invalid; target / dist: the first action on the oracle's
            target element, and its median distance in px to the oracle's point
Logs (--out, default data/step-probe/<timestamp>/): config.json (arguments, knobs, widgets) and
records-<pid>.jsonl, one line per state as it finishes: widget, seed, scenario, cut point k of n, goal, prefix
history, score before (error, tau, progress, done, success, end reason), the oracle's actions with the score after
each, and steps: per model action its full reply, parsed action, element hit, outcome, score after, page feedback,
latency and token usage; plus the first action's distance and target match, the rollout's outcome and gain;
skipped states and errors with their reason. shots/<widget>--<i>-state.png is the state, -oracle.png the page after
the oracle's actions, -model<t>.png the page after the model's t-th action. States are seeded from widget and index,
so a rerun with the same arguments probes the same states (the model's answers can differ).
"""
from __future__ import annotations

import base64
import json
import os
import random
import re
import statistics
import sys
import time
import zlib
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from openai import OpenAI

from megawob import catalog, driver
from megawob.driver import VIEWPORT, act, oracle_loop
from megawob.precision import HIT, PLAIN, score

EPS = 1e-6
POINTER = {"click", "dblclick", "tripleclick", "rightclick", "type", "move", "down", "up", "wheel"}
KINDS = POINTER | {"drag", "path", "key", "text", "wait", "finish"}

SYSTEM = """You operate a web page in a browser for a user. Each turn you get the user's task and a screenshot of \
the page ({w}x{h} pixels; x grows to the right, y downwards, (0, 0) is the top-left corner). Reply with the single \
next action that best moves the task forward.

Actions (coordinates are screenshot pixels):
  {{"type": "click", "at": [x, y]}}            also "dblclick", "tripleclick", "rightclick"
  {{"type": "drag", "from": [x, y], "to": [x, y]}}   press, move, release
  {{"type": "path", "points": [[x, y], ...]}}   press at the first point, move through the rest, release
  {{"type": "type", "at": [x, y], "text": "..."}}  click a field, select all its text, type ("" clears it)
  {{"type": "text", "text": "..."}}             type at the current caret / focus (no click, nothing selected)
  {{"type": "key", "key": "Enter"}}             a key or chord, e.g. "Tab", "Control+a"
  {{"type": "wheel", "at": [x, y], "dy": 300}}  scroll at a point (dy > 0 scrolls down)
  {{"type": "move", "at": [x, y]}}              hover
  {{"type": "down", "at": [x, y]}} / {{"type": "up", "at": [x, y]}}   press / release the button separately
  {{"type": "wait"}}
  {{"type": "finish", "message": "..."}}        end the task with a message to the user
click, drag, path, down and up take an optional "modifiers": ["Shift"] (or "Control", "Alt", "Meta").

When the task is complete, end it: use the page's own control for submitting or finishing if it has one, \
otherwise finish with a message. Answer with at most two short sentences of reasoning, then the action as JSON: \
{{"action": {{...}}}}"""

# Same target: the same element, or the same nearest interactive ancestor.
SAME = """([a, b]) => {
  const at = (p) => p && document.elementFromPoint(p[0], p[1]);
  const box = (e) => e && (e.closest('button,a,input,select,textarea,label,[role],[tabindex],[draggable],li,td') || e);
  const ea = at(a), eb = at(b);
  if (!ea || !eb) return false;
  return ea === eb || box(ea) === box(eb);
}"""


def point(a):
    """The action's main point: where it presses or clicks."""
    if not a:
        return None
    return a.get("at") or a.get("from") or (a.get("points") or [None])[0]


def valid(a):
    """A model action driver.act can run, or None. Points must be pairs of numbers."""
    if not isinstance(a, dict) or a.get("type") not in KINDS:
        return None
    pt = lambda p: isinstance(p, (list, tuple)) and len(p) == 2 and all(isinstance(v, (int, float)) for v in p)  # noqa: E731
    k = a["type"]
    if k in POINTER and not pt(a.get("at")):
        return None
    if k == "drag" and not (pt(a.get("from")) and pt(a.get("to"))):
        return None
    if k == "path" and not (isinstance(a.get("points"), list) and len(a["points"]) >= 2 and all(pt(p) for p in a["points"])):
        return None
    if k in ("type", "text") and not isinstance(a.get("text"), str):
        return None
    if k == "key" and not isinstance(a.get("key"), str):
        return None
    if k == "wheel":
        a = {**a, "dy": float(a.get("dy") or 0), "dx": float(a.get("dx") or 0)}
    if a.get("modifiers") is not None and not (isinstance(a["modifiers"], list) and all(isinstance(m, str) for m in a["modifiers"])):
        return None
    return a


def describe(a):
    """An earlier action as the model's own JSON, coordinates rounded (the history a real agent would have)."""
    r = lambda p: [round(p[0]), round(p[1])]  # noqa: E731
    d = {k: v for k, v in a.items() if k in ("type", "text", "key", "dy", "dx", "message", "modifiers") and v not in (None, [])}
    for k in ("at", "from", "to"):
        if a.get(k):
            d[k] = r(a[k])
    if a.get("points"):
        d["points"] = [r(p) for p in a["points"]]
    return json.dumps(d)


def save(stem, kind, png, out):
    """Write a screenshot next to the state's others; returns its path relative to the run directory."""
    path = stem.with_name(f"{stem.name}-{kind}.png")
    path.write_bytes(png)
    return str(path.relative_to(out))


def run(page, a, steps):
    """driver.act, plus the probe's `text` action: type at the caret (BrowserGym's keyboard_type), which driver.act
    lacks because the oracle never types without first selecting the field."""
    if a["type"] != "text":
        return act(page, a, steps)
    page.keyboard.type(a["text"])
    page.evaluate("() => __env.stepClock()")


def outcome(before, after):
    if after["done"]:
        return "success" if after["success"] else "fail"
    d = after["progress"] - before["progress"]
    return "better" if d > EPS else "worse" if d < -EPS else "none"


def last_json(text, need):
    """The last JSON object in text that has the key `need` (models often think aloud before the action)."""
    decoder = json.JSONDecoder()
    found = None
    for m in re.finditer(r"\{", text or ""):
        try:
            obj, _ = decoder.raw_decode(text, m.start())
        except json.JSONDecodeError:
            continue
        if isinstance(obj, dict) and need in obj:
            found = obj
    return found


class Model:
    def __init__(self, args):
        key = os.environ.get("OPENAI_API_KEY")
        if not key:
            sys.exit("set OPENAI_API_KEY (any value for a local server that ignores it)")
        self.client = OpenAI(base_url=args.base_url, api_key=key, timeout=args.timeout, max_retries=3)
        self.model, self.effort, self.api = args.model, args.effort, args.api

    def start(self, goal, history, cache_key, images=0):
        cls = ChatConversation if self.api == "chat" else Conversation
        return cls(self, goal, history, cache_key, images)


class Conversation:
    """One rollout as a Responses API conversation: every turn sends the whole conversation so far (the task, each
    screenshot, the model's own replies and what each action did), since ChatGPT sign-in only allows store=false
    and so no previous_response_id. A fixed prompt_cache_key per rollout keeps the repeated prefix in the prompt
    cache. images > 0 keeps only the last that many screenshots (older ones become a placeholder)."""

    def __init__(self, model, goal, history, cache_key, images):
        self.m, self.key, self.images, self.items = model, cache_key, images, []
        text = f"Task: {goal}"
        if history is not None:
            log = "\n".join(f"{i + 1}. {h}" for i, h in enumerate(history)) or "(none yet)"
            text += f"\n\nYour actions so far:\n{log}"
        self.first = text

    def step(self, png, result=None):
        """Show the current screenshot (after `result`, what the last action did); returns (reply, latency, usage)."""
        text = self.first if not self.items else f"Your last action: {result}."
        self.items.append({"role": "user", "content": [
            {"type": "input_text", "text": text + "\n\nCurrent screenshot:"},
            {"type": "input_image", "image_url": "data:image/png;base64," + base64.b64encode(png).decode()},
            {"type": "input_text", "text": "Next action?"}]})
        if self.images:
            shots = [c for it in self.items if it["role"] == "user" for c in it["content"] if c["type"] == "input_image"]
            for c in shots[:-self.images]:
                c.clear()
                c.update(type="input_text", text="(earlier screenshot omitted)")
        kw = {"reasoning": {"effort": self.m.effort}} if self.m.effort else {}
        t0 = time.monotonic()
        r = self.m.client.responses.create(model=self.m.model, instructions=SYSTEM.format(w=VIEWPORT[0], h=VIEWPORT[1]),
                                           input=self.items, store=False, prompt_cache_key=self.key, **kw)
        reply = r.output_text or ""
        self.items.append({"role": "assistant", "content": reply})
        return reply, round(time.monotonic() - t0, 1), r.usage.model_dump() if r.usage else {}


class ChatConversation(Conversation):
    """The same conversation over the Chat Completions API, which most OpenAI-compatible servers implement (vLLM,
    SGLang, Ollama, LM Studio, OpenRouter, ...): a system message, then user turns with the screenshot as an image_url
    part and the model's replies as assistant turns. No prompt-cache key; servers with prefix caching reuse the
    repeated prefix on their own."""

    def step(self, png, result=None):
        text = self.first if not self.items else f"Your last action: {result}."
        self.items.append({"role": "user", "content": [
            {"type": "text", "text": text + "\n\nCurrent screenshot:"},
            {"type": "image_url", "image_url": {"url": "data:image/png;base64," + base64.b64encode(png).decode()}},
            {"type": "text", "text": "Next action?"}]})
        if self.images:
            shots = [c for it in self.items if it["role"] == "user" for c in it["content"] if c["type"] == "image_url"]
            for c in shots[:-self.images]:
                c.clear()
                c.update(type="text", text="(earlier screenshot omitted)")
        kw = {"reasoning_effort": self.m.effort} if self.m.effort else {}
        system = {"role": "system", "content": SYSTEM.format(w=VIEWPORT[0], h=VIEWPORT[1])}
        t0 = time.monotonic()
        r = self.m.client.chat.completions.create(model=self.m.model, messages=[system, *self.items], **kw)
        reply = r.choices[0].message.content or ""
        self.items.append({"role": "assistant", "content": reply})
        return reply, round(time.monotonic() - t0, 1), r.usage.model_dump() if r.usage else {}


def probe_widget(context, model, widget, states, knobs, steps, out, no_history=False, horizon=1, images=0, from_start=False):
    page, errors, scenarios, boot_error = driver.probe_page(context, widget)  # a click on a link must not leave the page
    tag = f"{widget.task}/{widget.site}/{widget.name}"
    records = []
    if boot_error:
        return [{"cell": tag, "task": widget.task, "boot": boot_error}]

    def at_state(seed, v, k, prefix=None):
        driver.reset(page, seed, v, knobs)

        def send(page, a):
            act(page, a, steps)
            if prefix is not None:
                prefix.append(a)
        oracle_loop(page, steps, cap=k, send=send)
        return page.evaluate("() => __env.status()")

    for i in range(states):
        seed, v = i, scenarios[i % len(scenarios)]
        rec = {"cell": tag, "task": widget.task, "site": widget.site, "widget": widget.name, "seed": seed, "scenario": v}
        try:
            # The clean episode's length, then a random cut point in it (k = n-1: only the ending is left).
            at_state(seed, v, 0)
            n = oracle_loop(page, steps, cap=40).n
            if not page.evaluate("() => __env.status()")["success"]:
                rec["skip"] = "clean oracle fails"
                records.append(rec)
                continue
            k = 0 if from_start else random.Random(zlib.crc32(f"{tag}/{i}".encode())).randrange(n)
            prefix = []
            at_state(seed, v, k, prefix)
            before = score(page)
            png = page.screenshot()
            goal = page.evaluate("() => __env.goal()")
            stem = out / "shots" / f"{tag.replace('/', '--')}--{i}"
            # The control: the oracle's own next `horizon` actions from this state; from the start, its whole
            # episode (the budget is the model's: a long task may take the oracle more than --horizon actions).
            osteps = []

            def send_oracle(page, o):
                act(page, o, steps)
                osteps.append({"action": o, "after": score(page)})
            oracle_loop(page, steps, cap=max(horizon, n) if from_start else horizon, send=send_oracle)
            oracle, oracle_after, oracle_end = osteps[0]["action"], osteps[0]["after"], osteps[-1]["after"]
            rec.update(k=k, n=n, goal=goal, progress=before["progress"], score_before=before, oracle=oracle,
                       oracle_after=oracle_after, oracle_outcome=outcome(before, oracle_after),
                       oracle_steps=osteps, oracle_h_outcome=outcome(before, oracle_end),
                       oracle_gain=oracle_end["progress"] - before["progress"],
                       shot=save(stem, "state", png, out), oracle_shot=save(stem, "oracle", page.screenshot(), out))

            at_state(seed, v, k)
            if abs(score(page)["progress"] - before["progress"]) > EPS:
                rec["skip"] = "state not reproducible"
                records.append(rec)
                continue
            # The model's rollout: up to `horizon` actions, each from a fresh screenshot, with its own actions (and
            # any input the page rejected) appended to the history.
            base = None if no_history else [describe(a) for a in prefix]
            conv = model.start(goal, base, f"step-probe/{tag}/{i}/{time.time_ns()}", images)
            msteps, cur, obs, result = [], before, png, None
            for t in range(horizon):
                reply, latency, usage = conv.step(obs, result)
                parsed = last_json(reply, "action")
                a = valid(parsed and parsed.get("action"))
                st = {"t": t, "reply": reply, "latency_s": latency, "usage": usage,
                      "action": parsed and parsed.get("action")}
                if a is None:
                    st["outcome"] = "invalid"
                    result = "not run: no valid JSON action in your reply"
                else:
                    mp = point(a)
                    st["hit"] = page.evaluate(HIT, mp) if mp else None
                    if t == 0:
                        op = point(oracle)
                        rec["same_type"] = a["type"] == oracle["type"]
                        rec["same_target"] = bool(mp and op and page.evaluate(SAME, [mp, op]))
                        rec["hit"], rec["oracle_hit"] = st["hit"], page.evaluate(HIT, op) if op else None
                        if mp and op:
                            rec["dist"] = round(((mp[0] - op[0]) ** 2 + (mp[1] - op[1]) ** 2) ** 0.5, 1)
                    try:
                        run(page, a, steps)
                    except Exception as exc:  # noqa: BLE001
                        st["act_error"] = str(exc)[:2000]
                    after = score(page)
                    st.update(outcome="invalid" if "act_error" in st else outcome(cur, after), after=after)
                    cur = after
                    fb = page.evaluate("() => __env.inputFeedback()")
                    if fb:
                        st["feedback"] = fb
                    # What the env reports back (as BrowserGym's last_action_error would), never the reward.
                    result = describe(a) + (f", error: {st['act_error'][:200]}" if "act_error" in st
                                            else f", the page rejected input: {fb}" if fb else ", done")
                obs = page.screenshot()
                st["shot"] = save(stem, f"model{t + 1}", obs, out)
                msteps.append(st)
                if cur["done"]:
                    break
            first = msteps[0]
            better = [x["t"] for x in msteps if x["outcome"] in ("success", "better")]
            rec.update(steps=msteps, history=base, action=first["action"], reply=first["reply"],
                       outcome=first["outcome"], model_after=first.get("after"), end_reason=cur["end_reason"],
                       model_end=cur, h_outcome=outcome(before, cur), gain=cur["progress"] - before["progress"],
                       first_better=better[0] if better else None, calls=len(msteps))
            rec["good"] = rec["outcome"] in ("success", "better") or (
                rec["oracle_outcome"] == "none" and rec.get("same_type", False) and rec.get("same_target", False))
            rec["good_h"] = rec["h_outcome"] in ("success", "better")
        except Exception as exc:  # noqa: BLE001
            rec["error"] = str(exc)[:2000]
        records.append(rec)
        print(f"{tag} #{i}: k={rec.get('k')}/{rec.get('n')} oracle {rec.get('oracle_outcome')}/{rec.get('oracle_h_outcome')} "
              f"model {rec.get('outcome', rec.get('skip') or rec.get('error'))}/{rec.get('h_outcome')} "
              f"in {rec.get('calls')} dist={rec.get('dist')}", flush=True)
    if errors:
        records.append({"cell": tag, "task": widget.task, "page_errors": errors[:5]})
    page.close()
    return records


def run_cells(cells, args, knobs, out):
    model = Model(args)
    path = out / f"records-{os.getpid()}.jsonl"

    def probe(context, widget):
        return probe_widget(context, model, widget, args.states, knobs, args.steps, out, args.no_history, args.horizon, args.images,
                           args.from_start)

    def save(widget, recs, secs):
        for r in recs:
            driver.append_jsonl(path, r)

    return driver.run_cells(cells, probe, viewport=VIEWPORT, after=save)


def summary(records):
    """Per widget and per task: step-1 good rate, then over the horizon: good, success and fail rates, the mean
    progress gain against the oracle's over the same number of actions, invalid steps, and the first action's share
    on the oracle's target and median distance to its point."""
    by = defaultdict(list)
    for r in records:
        if "outcome" in r:
            by[r["cell"]].append(r)
            by["task " + r["task"]].append(r)
    mean = lambda xs: statistics.mean(xs) if xs else float("nan")  # noqa: E731
    print(f"\n{'cell':<52} {'n':>3} {'good@1':>6} {'good@H':>6} {'succ@H':>6} {'fail@H':>6} {'gain':>5} "
          f"{'o.gain':>6} {'inval':>5} {'target':>6} {'dist':>5}")
    for cell in sorted(by, key=lambda c: (c.startswith("task "), c)):
        rs = by[cell]
        steps = [x for r in rs for x in r["steps"]]
        d = [r["dist"] for r in rs if r.get("dist") is not None]
        print(f"{cell:<52} {len(rs):>3} {mean([r['good'] for r in rs]):>6.0%} {mean([r['good_h'] for r in rs]):>6.0%} "
              f"{mean([r['h_outcome'] == 'success' for r in rs]):>6.0%} {mean([r['h_outcome'] == 'fail' for r in rs]):>6.0%} "
              f"{mean([r['gain'] for r in rs]):>5.2f} {mean([r['oracle_gain'] for r in rs]):>6.2f} "
              f"{mean([x['outcome'] == 'invalid' for x in steps]):>5.0%} {mean([r.get('same_target', False) for r in rs]):>6.0%} "
              f"{statistics.median(d) if d else float('nan'):>5.0f}")
    rs = [r for r in records if "outcome" in r]
    if rs:
        print(f"\n{len(rs)} states, {sum(r['calls'] for r in rs)} model calls; good@1 {mean([r['good'] for r in rs]):.0%}, "
              f"good@H {mean([r['good_h'] for r in rs]):.0%}, success@H {mean([r['h_outcome'] == 'success' for r in rs]):.0%}; "
              f"skipped {sum('skip' in r for r in records)}, errors {sum('error' in r for r in records)}")


def main():
    parser = driver.parser(__doc__)
    driver.add_select(parser, site="base", widget=True)
    parser.add_argument("--states", type=int, default=4, help="probe states per widget")
    parser.add_argument("--max-cells", type=int, help="stop after this many widgets (live tests)")
    parser.add_argument("--set", action="append", default=[], metavar="K=V", help="override a randomization parameter")
    parser.add_argument("--model", default="gpt-6-luna")
    parser.add_argument("--effort", default=None, help="reasoning effort (default: the model's)")
    parser.add_argument("--base-url", default=os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1"))
    parser.add_argument("--api", choices=["responses", "chat"], default="responses",
                        help="responses (OpenAI's Responses API) or chat (Chat Completions, for most other servers)")
    parser.add_argument("--timeout", type=float, default=180)
    parser.add_argument("--no-history", action="store_true",
                        help="screenshot and goal only; by default the model also gets the oracle prefix as its earlier actions")
    parser.add_argument("--from-start", action="store_true",
                        help="start every state at the reset (no oracle prefix): with a long --horizon, a whole episode")
    parser.add_argument("--horizon", type=int, default=3,
                        help="model actions per state (each from a fresh screenshot); the oracle gets as many")
    parser.add_argument("--images", type=int, default=0,
                        help="screenshots kept in the conversation (0: all; 1: only the current one)")
    parser.add_argument("--workers", type=int, default=2)
    driver.add_steps(parser)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    knobs = {**PLAIN, **dict(kv.split("=", 1) for kv in args.set)}
    cells = [s for s in catalog.widgets(args.task, args.site) if not args.widget or s.name == args.widget]
    cells = cells[:args.max_cells] if args.max_cells else cells
    if not cells:
        sys.exit("no widgets match")
    out = args.out or Path("data/step-probe") / datetime.now().strftime("%Y%m%d-%H%M%S")
    (out / "shots").mkdir(parents=True, exist_ok=True)
    driver.write_json(out / "config.json", {**vars(args), "out": str(out), "knobs": knobs,
                                            "cells": [f"{s.task}/{s.site}/{s.name}" for s in cells]})
    parts = driver.run_pool(run_cells, cells, args.workers, args, knobs, out)
    summary([r for part in parts for r in part])
    print(f"records: {out}")


if __name__ == "__main__":
    main()
