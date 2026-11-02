"""Checker for megawob widgets: run it on your own cells before handing work back.

    python -m megawob.check                      # everything
    python -m megawob.check --site design-reorder-items-grid-01     # one site (what a site agent runs)
    python -m megawob.check --sites failing.txt  # the sites listed in a file, in one run
    python -m megawob.check --sites failing.txt --viewports 1024x640 --seeds 1 --fail-fast   # quick screen first
    python -m megawob.check --task reorder-items --seeds 50 --screens /tmp/shots
    python -m megawob.check --matrix             # coverage matrix only
    python -m megawob.check --index              # write html/index.html (gallery for humans)
    python -m megawob.check --jobs 1             # sequential (default: half the CPUs, at most 8, in parallel)
    python -m megawob.check --site <site> --lint # also run the static contract lint of those sites (megawob.lint)

Per task x site x widget, at every viewport:
  - the page boots without errors, and the manifest matches the widgets the page registers
  - nothing overflows the viewport (no page scroll unless the widget is scrollable), the anchors are fully
    visible and inside the stage, for every seed (the frame layout is sampled per episode)
  - seeds run with a random mix of randomization parameters (instruction display, finish mode, start mode, overlays);
    no seed starts solved unless its start mode is 'solved', and submitting an 'off' start earns 0
  - a sweep forces every knob value at least once (each start mode the task supports, each overlay kind,
    finish mode, heldout instruction/content splits with out-of-range parameters, recoverable mode, each input route
    and the held-out composition split)
  - the round-2 sweep (ROUND2_SWEEP, seeds 3000+) runs each page fault, preempt mode, report, silent failure,
    answerIn=reply and (on sites with hazard()) each safety hazard kind where it applies; the oracle never takes a
    hazard's bait
  - the oracle (through widget.locate) solves every seed, scenario and sweep run, then submits or finishes
  - reset(seed) is deterministic: same state, instruction and pixels (up to rasterization noise)
  - stray input (keyboard / wheel the task does not allow) is rejected: no effect, counted, reported, the
    episode goes on and is still solved; with undeclaredInput=void it ends the episode with reward 0
  - the planted shortcut ends the episode with reward 0
  - test sites (manifest split "test", html/sites/trait-tests) may add "expect": {<scenario>|"*": "<js over spec, model,
    episode>"} to a widget entry: checked after every reset of that scenario (the trait must have taken effect)
and across widgets of one task: start screenshots that are near-duplicates (perceptual hash) are flagged.
"""
from __future__ import annotations

import argparse
import io
import sys
from collections import defaultdict
from pathlib import Path
from typing import TYPE_CHECKING, NamedTuple

from . import catalog, driver
from .driver import PLAIN, act, run_oracle, run_oracle_until_within
from .scenarios import READ as SCENARIOS_READ, task_entry

if TYPE_CHECKING:
    from playwright.sync_api import BrowserContext, Page

# Default: the five training viewports (catalog.TRAINING_VIEWPORTS), 1024x640 up, whatever MEGAWOB_VIEWPORTS says.
VIEWPORTS = [(v["width"], v["height"]) for v in catalog.parse_viewports(catalog.DEFAULT_VIEWPORTS)]
# Randomization parameters for the seed loop (see html/kit/env.js header): every seed samples from these weights.
KNOB_MIX = {
    "instructionDisplay": "header:.4,panel:.2,toast:.15,hidden:.25",
    "finishByMessage": "0:.75,1:.25",
    "startState": "off:.55,partial:.15,wrong:.15,solved:.15",
    "popups": "off:.55,cookie:.09,toast:.09,chat:.09,promo:.09,banner:.09",
    "pageLanguage": "en:.7,de:.05,fr:.05,es:.04,pt:.03,it:.03,nl:.03,pl:.03,ja:.02,zh:.02",
    "difficulty": "easy:.15,medium:.15,normal:.7",
    "instructionNoise": "off:.8,terse:.05,typo:.05,chatter:.05,mixed:.05",
    "dragSteps": "atomic:.8,split:.2",
}
# Forced knob settings; each runs at least once per widget, spread over the scenarios.
SWEEP = [
    {"startState": "partial"}, {"startState": "wrong"}, {"startState": "solved"},
    {"popups": "cookie", "popupAt": 0}, {"popups": "promo", "popupAt": 1}, {"popups": "banner", "popupAt": 0},
    {"popups": "toast", "popupAt": 2}, {"popups": "chat", "popupAt": 0},
    {"finishByMessage": "1", "instructionDisplay": "hidden"}, {"instructionDisplay": "panel"}, {"instructionDisplay": "toast"},
    {"instructionSplit": "heldout", "contentSplit": "heldout", "ood": "1"}, {"recover": "1"}, {"recover": "0"},
    {"inputRoute": "keyboard"}, {"inputRoute": "wheel"}, {"inputRoute": "pointer"}, {"composition": "heldout"},
    {"pageLanguage": "de", "instructionDisplay": "panel"}, {"pageLanguage": "ja", "popups": "cookie", "popupAt": 0},
    {"difficulty": "easy"}, {"difficulty": "medium"}, {"instructionNoise": "mixed"},
    {"dragSteps": "split"}, {"dragSteps": "split", "popups": "toast", "popupAt": 1},
]
# Judge modes run only for tasks that list them (judgeModes), like startState=scene.
JUDGE_SWEEP = {"ambiguous": {"judgment": "ambiguous"}, "impossible": {"judgment": "impossible"},
               "confirm": {"judgment": "confirm"}}
# Each judge mode runs twice: the ending as a structured reply and as free text (knob reply, html/kit/runtime/reply.js).
REPLIES = ({"replyFormat": "structured"}, {"replyFormat": "free"})
# Round-2 knobs (own rng streams), run with their own seeds (3000+) so the runs above stay as they were. Each value
# runs once per widget where it applies: report and silent need the task's facts() / silent(), answerIn=reply its
# answers() / answered() and a widget with answerReply; switch falls back to cancel without retarget(). Every site has
# fault() and hazard() (its own or templates/site/hooks.js), so every fault kind and safety hazard runs everywhere.
# cursorlag (a page option) rides along with one run.
ROUND2_SWEEP = [
    {"pageFaults": "miss", "cursorLag": "1"}, {"pageFaults": "revert"}, {"pageFaults": "clear"}, {"pageFaults": "hang"}, {"pageFaults": "shift"},
    {"interruptions": "cancel"}, {"interruptions": "switch"}, {"reportFacts": "on"}, {"silentFailures": "on"},
    {"reportFacts": "on", "interruptions": "switch", "pageFaults": "hang"},
    {"reportFacts": "on", "replyFormat": "free"}, {"reportFacts": "on", "replyFormat": "structured"}, {"interruptions": "cancel", "replyFormat": "free"},
    {"answerIn": "reply"}, {"answerIn": "reply", "replyFormat": "structured"},
    {"answerIn": "reply", "reportFacts": "on", "interruptions": "switch"},
]
DUP_BITS = 6  # dHash (256 bits) Hamming distance at or below this flags a near-duplicate


def layout_problems(page: Page) -> list[str]:
    """Layout failures of the booted episode: page overflow, anchors outside the viewport or stage, a hidden submit control."""
    return page.evaluate("""() => {
      const out = [];
      const W = innerWidth, H = innerHeight, d = document.documentElement;
      const scroll = __env.episode && __env.episode.scrollable;
      if (d.scrollWidth > W + 1) out.push(`page overflows horizontally: ${d.scrollWidth} > ${W}`);
      if (!scroll && d.scrollHeight > H + 1) out.push(`page overflows: ${d.scrollWidth}x${d.scrollHeight} > ${W}x${H}`);
      const st = __env.stage.getBoundingClientRect();
      // Which element, and for a zero-size one what hides it: the agent fixing the site needs the selector.
      const desc = (e) => e ? e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className.trim()
        ? '.' + e.className.trim().split(/\\s+/).slice(0, 2).join('.') : '') : 'null';
      const why = (el) => {
        let e = el;
        for (; e && e !== document.body; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (cs.display === 'none') return `; ${desc(e)} has display:none`;
          if (cs.visibility === 'hidden') return `; ${desc(e)} has visibility:hidden`;
        }
        for (e = el; e && e !== document.body; e = e.parentElement) {
          const b = e.getBoundingClientRect();
          if (b.width === 0 || b.height === 0) return `; ${desc(e)} has zero size`;
        }
        return '';
      };
      for (const [el] of __env.anchors) {
        const r = el.getBoundingClientRect();
        const who = ` [${desc(el)}${r.width && r.height ? '' : why(el)}]`;
        if (r.left < -1 || r.right > W + 1 || (!scroll && (r.top < -1 || r.bottom > H + 1)))
          out.push(`anchor outside viewport: ${[r.left, r.top, r.right, r.bottom].map(Math.round)}${who}`);
        else if (el !== __env.stage && (r.left < st.left - 1 || r.right > st.right + 1 || (!scroll && (r.top < st.top - 1 || r.bottom > st.bottom + 1))))
          out.push(`anchor outside the stage (size the widget from ctx.size): ${[r.left, r.top, r.right, r.bottom].map(Math.round)} vs stage ${[st.left, st.top, st.right, st.bottom].map(Math.round)}${who}`);
      }
      if (__env.submitEl) {
        const el = __env.submitEl, s = el.getBoundingClientRect();
        if (s.width < 4 || s.height < 4 || s.right > W || s.left < 0 || (!scroll && (s.bottom > H || s.top < 0)))
          out.push(`submit control not visible: ${[s.left, s.top, s.right, s.bottom].map(Math.round)} [${desc(el)}${why(el)}]`);
      }
      return out;
    }""")


def same_pixels(png_a: bytes, png_b: bytes) -> bool:
    """Equal up to rasterization noise: Chromium can anti-alias a gradient edge one level differently after a
    re-layout, so allow a few pixels off by at most 8 levels (any visible change still fails)."""
    if png_a == png_b:
        return True
    try:
        from PIL import Image, ImageChops
    except ImportError:
        return False
    a, b = (Image.open(io.BytesIO(x)).convert("RGB") for x in (png_a, png_b))
    if a.size != b.size:
        return False
    hist = ImageChops.difference(a, b).convert("L").histogram()
    return sum(hist[9:]) == 0 and sum(hist[1:]) <= a.width * a.height // 10000


def dhash(png: bytes) -> int | None:
    """256-bit difference hash of a screenshot (None without Pillow), to flag near-duplicate start screens."""
    try:
        from PIL import Image
    except ImportError:
        return None
    img = Image.open(io.BytesIO(png)).convert("L").resize((17, 16))
    px = img.tobytes()
    bits = 0
    for row in range(16):
        for col in range(16):
            bits = (bits << 1) | (px[row * 17 + col] > px[row * 17 + col + 1])
    return bits


def self_test(page: Page, task: str) -> list[str]:
    """The task's self-test failures: loads kit/selftest.js and tasks/<task>/selftest.js (when there is one)
    into the booted page and runs env.runSelfTest; episodes never load either file."""
    page.add_script_tag(path=str(catalog.HTML / "kit" / "selftest.js"))
    own = catalog.HTML / "tasks" / task / "selftest.js"
    if own.is_file():
        page.add_script_tag(path=str(own))
    return page.evaluate("(f) => env.runSelfTest(f)", task)


def check_widget(context: BrowserContext, widget: catalog.Widget, opts: "Options", manifest_names: set[str]) -> dict:
    """One cell: every check of the module docstring on one widget at the context's viewport. Returns the cell's
    result: {"cell", "widget", "failures", ...}; the phases below append to its failures list."""
    failures: list[str] = []
    page, errors = driver.new_page(context)
    vw = page.viewport_size
    dpr = page.evaluate("() => window.devicePixelRatio")
    tag = f"{widget.task}/{widget.site}/{widget.name}@{vw['width']}x{vw['height']}" + (f"*{dpr:g}" if dpr != 1 else "")
    result = {"cell": tag, "widget": widget, "failures": failures}
    try:
        driver.boot(page, widget, 0)
        driver.pin_text(page)
    except Exception as exc:  # noqa: BLE001
        failures.append(f"boot: {exc}")
        page.close()
        return result

    scenarios = check_registration(page, widget, manifest_names, failures)
    result["scenarios"] = scenarios
    runs, judge_modes = plan_runs(page, opts, scenarios)
    episodes = check_episodes(page, widget, opts, runs, result, failures)
    if opts.fail_fast and (len(failures) >= opts.fail_fast or (opts.first and failures)):
        return close_cell(page, result, episodes, errors)

    check_determinism(page, failures)
    check_negative_controls(page, opts.steps, vw, failures)
    failures += check_judge(page, judge_modes, opts.steps)
    failures += check_split(page)
    return close_cell(page, result, episodes, errors)


def check_registration(page: Page, widget: catalog.Widget, manifest_names: set[str], failures: list[str]) -> list[str]:
    """Phase 1: the manifest matches the registered widgets, the trainer API is there, the task's self-test passes and
    html/scenarios.json is current. Returns the widget's scenarios."""
    registered = set(page.evaluate("(f) => __env.widgetsFor(f)", widget.task))
    if registered != manifest_names:
        failures.append(f"manifest lists {sorted(manifest_names)} but the page registers {sorted(registered)}")
    api = page.evaluate("""() => ['reset', 'score', 'status', 'state', 'oracle', 'events', 'instruction', 'idle', 'submit',
      'advance', 'stepClock', 'tick', 'bootInfo', 'finish', 'inputs', 'dismissOverlay', 'reanchor'].filter((k) => typeof __env[k] !== 'function')""")
    if api:
        failures.append(f"trainer API not callable: {api}")
    failures += [f"selfTest: {f}" for f in self_test(page, widget.task)]
    scenarios = driver.page_scenarios(page)
    got = page.evaluate(SCENARIOS_READ)
    if catalog.widget_scenarios(widget) != got["widget"] or catalog.scenarios_index()["tasks"].get(widget.task) != task_entry(
            widget.task, got):
        failures.append(f"html/scenarios.json is stale for this widget (run python -m megawob.scenarios --site {widget.site})")
    return scenarios


def plan_runs(page: Page, opts: "Options", scenarios: list[str]) -> tuple[list[tuple], list[str]]:
    """Phase 2: the episodes to run, [(seed, scenario, knobs)] in run order, and the task's judge modes. Knob-mix
    seeds, one run per scenario, the knob sweep (seeds 2000+) and the round-2 sweep (seeds 3000+)."""
    runs = [(seed, None, KNOB_MIX) for seed in range(opts.seeds)] + [(1000 + i, v, KNOB_MIX) for i, v in enumerate(scenarios)]
    vs = scenarios or [None]
    # 'scene' is not in KNOB_MIX or the default sweep: force it for tasks that list it (the kit falls back to
    # 'off' for the others), so the reference screen's mid-task state is solved and checked like any start mode.
    sweep = SWEEP + ([{"startState": "scene"}] * 2 if "scene" in (page.evaluate("() => __env.taskDef.startModes") or []) else [])
    judge_modes = [m for m in (page.evaluate("() => __env.taskDef.judgeModes || []") or []) if m in JUDGE_SWEEP]
    sweep += [{**JUDGE_SWEEP[m], **extra} for m in judge_modes for extra in REPLIES]
    runs += [(2000 + i, vs[i % len(vs)], sweep[i % len(sweep)]) for i in range(max(len(sweep), 2 * len(vs)))]
    hooks = page.evaluate("""() => ({ facts: typeof __env.taskDef.facts === 'function',
      silent: typeof __env.taskDef.silent === 'function', faults: __env.taskDef.faults !== false,
      answer: typeof __env.taskDef.answered === 'function' && !!__env.widgetDef.answerReply,
      hazards: typeof __env.siteDef.hazard === 'function' ? (__env.content.HAZARD_KINDS || []) : [] })""")
    round2 = [k for k in ROUND2_SWEEP if (hooks["facts"] or "reportFacts" not in k) and (hooks["silent"] or "silentFailures" not in k)
              and (hooks["faults"] or "pageFaults" not in k) and (hooks["answer"] or "answerIn" not in k)]
    round2 += [{"safetyHazards": kind} for kind in hooks["hazards"]]
    runs += [(3000 + i, vs[i % len(vs)], k) for i, k in enumerate(round2)]
    if opts.plain_only:
        runs = runs[:opts.seeds]
    if opts.first:  # earlier failures first: with --fail-fast a fix that did not work fails in a few episodes
        runs.sort(key=lambda r: r[0] not in opts.first)
    return runs, judge_modes


def check_episodes(page: Page, widget: catalog.Widget, opts: "Options", runs: list[tuple], result: dict,
                   failures: list[str]) -> list[dict]:
    """Phase 3: reset and check each planned episode (layout, start state, knobs honoured), then let the oracle solve
    it. Returns [{"success", "actions"}] of the episodes the oracle ran; seed 0 also fills result["dhash"/"screen"]."""
    episodes = []
    judge_asked, judge_built = set(), set()
    scenarios = result["scenarios"]
    vw = page.viewport_size
    dpr = page.evaluate("() => window.devicePixelRatio")
    init_ov = page.evaluate("() => __env.siteDef.initialOverlay || null")
    layout_seen = set()
    first_left = sum(1 for r in runs if r[0] in opts.first)
    for seed, scenario, knobs in runs:
        if opts.fail_fast and (len(failures) >= opts.fail_fast or (opts.first and not first_left and failures)):
            break  # (with --first: an earlier failure that is still there ends the cell once those have run)
        first_left -= seed in opts.first
        start = driver.reset(page, seed, scenario, knobs)
        ep = page.evaluate("() => __env.episode")
        label = f"seed {seed}" + (f" scenario {scenario}" if scenario else "") + (f" {knobs}" if knobs is not KNOB_MIX else "")
        check_knobs_honoured(page, widget, failures, label, scenario, knobs, ep, init_ov, judge_asked, judge_built)
        check_start_state(failures, label, ep, start)
        for p in layout_problems(page):
            if p not in layout_seen:
                layout_seen.add(p)
                failures.append(f"{label}: {p}")
        if seed == 0:
            png = page.screenshot()
            result["dhash"] = dhash(png)
            if opts.screens:
                path = opts.screens / f"{widget.task}--{widget.site}--{widget.name}--{vw['width']}x{vw['height']}{'' if dpr == 1 else f'x{dpr:g}'}.png"
                path.write_bytes(png)
                result["screen"] = path
        try:
            status, n = run_oracle(page, opts.steps)
        except Exception as exc:  # noqa: BLE001
            failures.append(f"{label}: oracle raised {exc}")
            continue
        if status.get("unsafe"):
            failures.append(f"{label}: the oracle fell for the {status['unsafe']} hazard")
        episodes.append({"success": status["success"], "actions": n})
        if not (status["done"] and status["success"]):
            s = status["score"]
            failures.append(f"{label}: oracle failed (done {status['done']}, error {s['error']:.4g}, "
                            f"tau {s['tau']}, violations {s['violations']}, {n} actions)"
                            + (f"; {status['stuck']}" if status.get("stuck") else ""))

    # A mode in judgeModes that no episode built: on a widget with every task scenario, the task never builds it.
    if judge_asked - judge_built and set(page.evaluate("() => __env.taskDef.scenarios || []")) <= set(scenarios):
        failures += [f"judge={m} is in judgeModes but sample() built no spec.judge in any episode"
                     for m in sorted(judge_asked - judge_built)]
    return episodes


def check_knobs_honoured(page: Page, widget: catalog.Widget, failures: list[str], label: str, scenario: str | None, knobs: dict,
                         ep: dict, init_ov: dict | None, judge_asked: set, judge_built: set) -> None:
    """After a reset: the forced knobs took effect (startState=scene, initial overlay, the widget's expect clauses, report,
    silent, safety, answer, judge) and a built judge spec is well formed. Records the judge modes asked and built."""
    if knobs.get("startState") == "scene" and ep["start"] != "scene":
        failures.append(f"{label}: startState=scene was not honoured (episode start {ep['start']})")
    if init_ov and init_ov.get("p", 1) >= 1 and not init_ov.get("at"):
        shown = page.evaluate("() => __env.state().episode.initialOverlay")
        if not (shown and shown["shown"]):
            failures.append(f"{label}: site.initialOverlay (p=1, at 0) was not shown")
    for var, expr in (widget.expect or {}).items():
        if var in ("*", scenario or page.evaluate("() => __env.spec.scenario")) and not page.evaluate(
                "(e) => { const s = __env.state(); return !!new Function('spec', 'model', 'episode', 'return (' + e + ')')"
                "(s.spec, s.model, s.episode); }", expr):
            failures.append(f"{label}: expect {var}: {expr} is false (trait not applied)")
    for key, param in (("report", "reportFacts"), ("silent", "silentFailures"), ("safety", "safetyHazards")):
        if knobs.get(param) and not ep.get(key) and not ep.get("judge"):
            failures.append(f"{label}: {param}={knobs[param]} was not honoured (episode {key} {ep.get(key)})")
    if knobs.get("answerIn") == "reply" and ep.get("answer") != "reply" and not ep.get("judge") and page.evaluate(
            "() => (__env.taskDef.answers(__env.spec) || []).length > 0"):
        failures.append(f"{label}: answerIn=reply was not honoured for a scenario with answers() "
                        "(sample() must set spec.answerBy)")
    if knobs.get("judgment"):  # a spec that cannot have this judge runs as a normal episode (kit/env.js header)
        judge_asked.add(knobs["judgment"])
        if ep.get("judge") == knobs["judgment"]:
            judge_built.add(knobs["judgment"])
    if ep.get("judge") == "ambiguous" and not page.evaluate(
            "() => { const c = __env.spec.judge.cands; return Array.isArray(c) && c.length >= 2"
            " && c.every((x) => Array.isArray(x) && x.length && x.every((w) => typeof w === 'string' && w.trim())); }"):
        failures.append(f"{label}: judge ambiguous spec.judge.cands must list two or more candidates, each a list of names")
    if ep.get("judge") == "impossible" and not page.evaluate(
            "() => { const w = __env.spec.judge.what; return Array.isArray(w) && w.length"
            " && w.every((x) => typeof x === 'string' && x.trim()); }"):
        # Without it a free-text "Done." could not be told from a refusal (html/kit/runtime/reply.js).
        failures.append(f"{label}: judge impossible spec.judge.what must name what is missing (a list of names)")


def check_start_state(failures: list[str], label: str, ep: dict, start: dict) -> None:
    """The start state matches its start mode: judge stops within tau and unsuccessful, 'solved' within tau, every
    other mode not solved."""
    if ep.get("judge") in ("ambiguous", "impossible"):
        # The page starts as it should stay: within tolerance, but not a success until the right ending.
        if start["success"] or not start["error"] <= start["tau"] + 1e-9:
            failures.append(f"{label}: judge {ep['judge']} start must be within tau and unsuccessful "
                            f"(error {start['error']:.4g}, success {start['success']})")
    elif ep["start"] != "solved" and (start["success"] or start["error"] <= start["tau"]):
        failures.append(f"{label}: starts solved (start mode {ep['start']})")
    if ep["start"] == "solved" and not start["error"] <= start["tau"] + 1e-9:
        failures.append(f"{label}: start mode 'solved' but error {start['error']:.4g} > tau")


def check_determinism(page: Page, failures: list[str]) -> None:
    """Same seed, same episode (state, instruction and pixels). The cursor rests where the last oracle action left
    it, and Chrome sends a synthetic mousemove a few ms after the re-render (a chase board records it as the
    pointer), so both snapshots wait for it."""
    snap = """async () => { await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 50))));
      return [__env.state(), __env.instruction()]; }"""
    driver.reset(page, 7, None, KNOB_MIX)
    a, png_a = page.evaluate(snap), page.screenshot()
    driver.reset(page, 3, None, KNOB_MIX)
    driver.reset(page, 7, None, KNOB_MIX)
    b, png_b = page.evaluate(snap), page.screenshot()
    if a != b:
        keys = [k for k in a[0] if a[0].get(k) != b[0].get(k)] + (["instruction"] if a[1] != b[1] else [])
        failures.append(f"reset(7) is not deterministic (differs: {', '.join(keys)})")
    elif not same_pixels(png_a, png_b):
        failures.append("reset(7) is not deterministic (screenshot differs)")


def check_negative_controls(page: Page, steps: int, vw: dict, failures: list[str]) -> None:
    """Plain episodes (start off, no overlay, a submit control): submitting the start earns nothing, stray input is
    rejected, progress runs 0 to 1, and the planted shortcut ends the episode with reward 0."""
    driver.reset(page, 0, None, PLAIN)
    page.evaluate("() => __env.submit()")
    st = page.evaluate("() => __env.status()")
    if st["reward_binary"] != 0 or st["reward_dense"] > 1e-9:
        failures.append(f"submitting the start state earns reward (dense {st['reward_dense']:.3g})")
    if page.evaluate("() => __env.state().episode.initialOverlay"):
        failures.append("plain episode (popups=off) still has the site's initial overlay")
    failures += check_stray_input(page, steps, vw)
    # Progress: 0 at the start, 1 once solved (the bounded potential for shaped rewards).
    start = driver.reset(page, 0, None, PLAIN)
    if abs(start["progress"]) > 1e-9:
        failures.append(f"progress at start is {start['progress']}, expected 0")
    stop = page.evaluate("() => __env.episode.judge")
    if stop in ("ambiguous", "impossible"):
        # A task-made judge stop case (sample() built spec.judge for this seed): progress stays capped until the
        # judged ending, so let the oracle end the episode and require a judged success.
        st, _ = run_oracle(page, steps)
        if not (st["done"] and st["success"]):
            failures.append(f"plain seed 0 (judge {stop}): the oracle's judged ending is not a success")
    else:
        run_oracle_until_within(page, steps)
        if page.evaluate("() => __env.score().progress") != 1:
            failures.append("progress is not 1 after the oracle solves the task")
    driver.reset(page, 0, None, {"shortcut": "1", "startState": "off", "popups": "off"})
    page.click("#env-shortcut")
    st = page.evaluate("() => __env.status()")
    if st["score"]["base"] != 1 or st["reward_dense"] != 0 or "shortcut" not in st["score"]["violations"]:
        failures.append(f"shortcut not gated: base {st['score']['base']}, violations {st['score']['violations']}")
    if st["progress"] != -1:
        failures.append(f"progress after a violation is {st['progress']}, expected -1")


def close_cell(page: Page, result: dict, episodes: list[dict], errors: list[str]) -> dict:
    """Add the page errors and the oracle's success rate and mean actions to a cell's result, and close its page."""
    result["failures"] += [f"page error: {e}" for e in errors]
    n = len(episodes) or 1
    result["oracle_success"] = sum(e["success"] for e in episodes) / n
    result["mean_actions"] = sum(e["actions"] for e in episodes) / n
    page.close()
    return result


STRAY_KEYS = ["ArrowRight", "Enter", " ", "Tab", "a", "Backspace"]


def check_stray_input(page: Page, steps: int, vw: dict) -> list[str]:
    """Input the task does not allow. Default (undeclaredInput=reject): swallowed with no effect on the model or the
    page, counted and reported, the episode continues and can still be solved. undeclaredInput=void: the episode ends
    with reward 0 and violation 'keyboard' / 'wheel'."""
    failures = []
    snap = "() => JSON.stringify([__env.model, __env.score().error, scrollX, scrollY])"
    for kind in ("keyboard", "wheel"):
        driver.reset(page, 0, None, PLAIN)
        if kind in page.evaluate("() => __env.inputs()"):
            continue
        # Mid-episode, with focus wherever the oracle's first action left it (a button, field or thumb).
        first = page.evaluate("() => __env.oracle()")
        if first and first["type"] != "finish":
            act(page, first, steps)
        if page.evaluate("() => __env.done"):  # the first action ended it (a task-side ending): start over
            driver.reset(page, 0, None, PLAIN)
        if kind == "wheel":  # move first: hovering may legitimately change the model (menus, tooltips)
            page.mouse.move(vw["width"] / 2, vw["height"] / 2)
            page.evaluate("() => __env.idle()")
        before = page.evaluate(snap)
        if kind == "keyboard":
            for key in STRAY_KEYS:
                page.keyboard.press(key)
            want = len(STRAY_KEYS)
        else:
            page.mouse.wheel(0, 120)
            want = 1
        page.evaluate("() => __env.idle()")
        st = page.evaluate("() => __env.status()")
        feedback = page.evaluate("() => __env.inputFeedback()")
        if st["done"] or st["score"]["violations"]:
            failures.append(f"stray {kind} input ended the episode: {st['end_reason']} {st['score']['violations']}")
        elif page.evaluate(snap) != before:
            failures.append(f"stray {kind} input changed the model or the page")
        elif st["rejected"][kind] != want or not feedback:
            failures.append(f"stray {kind} input not counted/reported: {st['rejected']} {feedback!r}")
        else:
            status, _ = run_oracle(page, steps)
            if not status["success"]:
                failures.append(f"oracle failed after stray {kind} input: {status['end_reason']}"
                                + (f"; {status['stuck']}" if status.get("stuck") else ""))
        # undeclaredInput=void: the old rule.
        driver.reset(page, 0, None, {**PLAIN, "undeclaredInput": "void"})
        if kind == "keyboard":
            page.mouse.move(2, vw["height"] - 2)
            page.keyboard.press("ArrowRight")
        else:
            page.mouse.move(vw["width"] / 2, vw["height"] / 2)
            page.mouse.wheel(0, 120)
        st = page.evaluate("() => __env.status()")
        if not st["done"] or st["reward_binary"] != 0 or kind not in st["score"]["violations"]:
            failures.append(f"{kind} not gated with undeclaredInput=void: {st['end_reason']} {st['score']['violations']}")
    return failures


def check_judge(page: Page, modes: list[str], steps: int) -> list[str]:
    """Judge episodes reward only the right ending: a reply with status done (or the submit control) earns nothing,
    and so do asking for the go-ahead before preparing a confirm page, a done reply after preparing it, and acting as
    told on an impossible / ambiguous page; the oracle's ending succeeds (seed loop). Replies are written in the
    episode's drawn format (kit/runtime/reply.js format)."""
    failures = []
    say = "(o) => __env.finish(window.__megawobKit.reply.format(__env, o))"
    for mode in modes:
        for seed in (0, 1):
            knobs = {**PLAIN, "judgment": mode}
            driver.reset(page, seed, None, knobs)
            if page.evaluate("() => __env.episode.judge") != mode:
                continue  # reported by the sweep
            page.evaluate(say, {"status": "done"})
            st = page.evaluate("() => __env.status()")
            if st["success"] or st["reward_dense"] > 0:
                failures.append(f"judge {mode} seed {seed}: a done reply succeeds (reward {st['reward_dense']})")
            if mode == "confirm":
                # Asking before preparing anything is the right ending on the wrong page: no dense reward either.
                driver.reset(page, seed, None, knobs)
                page.evaluate(say, {"status": "confirm"})
                st = page.evaluate("() => __env.status()")
                if st["success"] or st["reward_dense"] > 0:
                    failures.append(f"judge confirm seed {seed}: asking at the start earns reward {st['reward_dense']}")
                # Preparing, then reporting it done, is not asking for the go-ahead.
                driver.reset(page, seed, None, knobs)
                run_oracle_until_within(page, steps)
                page.evaluate(say, {"status": "done"})
                if page.evaluate("() => __env.status().success"):
                    failures.append(f"judge confirm seed {seed}: a done reply after preparing counts as asking")
            driver.reset(page, seed, None, knobs)
            if page.evaluate("() => !!__env.submitEl"):
                if mode == "confirm":
                    run_oracle_until_within(page, steps)
                page.evaluate("() => __env.submit()")
                if page.evaluate("() => __env.status().success"):
                    failures.append(f"judge {mode} seed {seed}: the submit control succeeds")
    return failures


def check_split(page: Page) -> list[str]:
    """dragSteps=split: a press and release far apart inside one action ends the episode (violation atomic-drag)."""
    driver.reset(page, 0, None, {**PLAIN, "dragSteps": "split"})
    first = page.evaluate("() => __env.oracle()")
    if not first or first["type"] != "down":
        return []
    x, y = first["at"]
    page.mouse.move(x, y)
    page.mouse.down()
    page.mouse.move(x + 40, y + 30, steps=4)
    page.mouse.up()
    st = page.evaluate("() => __env.status()")
    if "atomic-drag" not in st["score"]["violations"]:
        return [f"dragSteps=split: an atomic drag was not gated ({st['end_reason']}, {st['score']['violations']})"]
    return []


def coverage_matrix() -> str:
    """The task x site table of how many widgets each site has for each task."""
    fams = catalog.tasks()
    sites = catalog.sites()  # test sites (trait-tests) are not part of the coverage matrix
    counts = defaultdict(int)
    for s in catalog.widgets():
        counts[s.task, s.site] += 1
    width = max([len(f) for f in fams] + [8])
    lines = [" " * width + "  " + "  ".join(f"{s:>12}" for s in sites)]
    for f in fams:
        lines.append(f"{f:<{width}}  " + "  ".join(f"{counts[f, s] or '.':>12}" for s in sites))
    return "\n".join(lines)


def write_index() -> Path:
    """Write html/index.html, the gallery of sites for humans; returns its path."""
    rows = []
    for s in catalog.widgets():
        url = catalog.page_url(s, 0, base="", debug=1)
        rows.append(f'<tr><td>{s.task}</td><td>{s.site}</td><td><a href="{url}">{s.name}</a></td><td>{s.split}</td></tr>')
    html = ("<!doctype html><meta charset=utf-8><title>MegaWoB tasks</title>"
            "<style>body{font:15px system-ui;margin:32px}td,th{padding:4px 14px;text-align:left}</style>"
            "<h1>MegaWoB tasks</h1><p>Generated by <code>python -m megawob.check --index</code>. Seed 0, debug panel on.</p>"
            "<table><tr><th>task</th><th>site</th><th>widget</th><th>split</th></tr>" + "".join(rows) + "</table>")
    out = catalog.HTML / "index.html"
    out.write_text(html)
    return out


def contact_sheet(results: list[dict], path: Path) -> Path | None:
    """One PNG of the cells' seed-0 start screenshots with their names (None without Pillow or screenshots)."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return None
    shots = [r for r in results if r.get("screen")]
    if not shots:
        return None
    tw, th, cols = 320, 200, 4
    sheet = Image.new("RGB", (cols * tw, -(-len(shots) // cols) * (th + 18)), "white")
    draw = ImageDraw.Draw(sheet)
    for i, r in enumerate(shots):
        x, y = (i % cols) * tw, (i // cols) * (th + 18)
        sheet.paste(Image.open(r["screen"]).convert("RGB").resize((tw, th)), (x, y + 18))
        draw.text((x + 4, y + 3), r["cell"], fill="black")
    sheet.save(path)
    return path


class Options(NamedTuple):
    """What a checker run does, the same for every cell."""
    seeds: int
    steps: int  # interpolated mouse moves per drag
    screens: Path | None  # where to save seed-0 start screenshots
    headed: bool
    fail_fast: int = 0  # stop a cell's episodes once it has this many failures (--fail-fast [N]; 0 = off)
    first: frozenset = frozenset()  # run the episodes of these seeds first (--first)
    plain_only: bool = False  # only the knob-mix seeds, no scenario runs or sweeps (--plain-only)
    frame_limit: bool = False  # keep Chromium's frame-rate limit (--frame-limit, driver.browser(fast=False))


def run_cells(work: list[tuple], opts: Options) -> list[dict]:
    """Check (viewport, widget, manifest names) cells in one browser, in order. Each finished cell prints one line to
    stderr (its result and time), so a long run can be watched and a killed one still shows what it checked."""
    def crashed(item, exc):  # one broken widget fails its cell, not the whole run
        vp, widget, _ = item
        return {"cell": f"{widget.task}/{widget.site}/{widget.name}@{vp}", "widget": widget,
                "failures": [f"crashed: {str(exc).splitlines()[0] if str(exc) else repr(exc)}"]}

    def report(item, r, seconds):
        verdict = f"{len(r['failures'])} failures: {r['failures'][0].splitlines()[0][:160]}" if r["failures"] else "ok"
        print(f"cell {r['cell']} {verdict} ({seconds:.0f}s)", file=sys.stderr, flush=True)

    return driver.run_cells(work, lambda context, item: check_widget(context, item[1], opts, item[2]),
                            viewport_of=lambda item: item[0], on_error=crashed, after=report,
                            headed=opts.headed, raster=True, fast=not opts.frame_limit)


def build_parser() -> argparse.ArgumentParser:
    """The command line: which cells (site, task, widget, --sites), how (seeds, viewports, dsf, jobs) and the modes."""
    parser = driver.parser(__doc__)
    driver.add_select(parser)
    parser.add_argument("--widget")
    parser.add_argument("--seeds", type=int, default=20)
    driver.add_steps(parser)
    parser.add_argument("--viewports", nargs="+", default=[f"{w}x{h}" for w, h in VIEWPORTS],
                        help="default: the five training viewports, whatever MEGAWOB_VIEWPORTS says")
    parser.add_argument("--screens", type=Path, help="save seed-0 start screenshots and a contact sheet here")
    parser.add_argument("--matrix", action="store_true", help="print the coverage matrix and exit")
    parser.add_argument("--index", action="store_true", help="write html/index.html and exit")
    parser.add_argument("--headed", action="store_true")
    parser.add_argument("--dsf", type=float, nargs="+", default=[1.0],
                        help="device scale factors; each runs every viewport (e.g. --dsf 1 1.5 2)")
    driver.add_jobs(parser)
    parser.add_argument("--sites", type=Path, metavar="FILE",
                        help="check the sites listed in FILE (whitespace-separated names) in one run")
    parser.add_argument("--fail-fast", type=int, nargs="?", const=1, default=0, metavar="N",
                        help="stop each cell once it has N failures (default 1): a quick pass/fail screen, not a full check")
    parser.add_argument("--first", type=int, nargs="+", default=[], metavar="SEED",
                        help="run the episodes of these seeds (plain or sweep seeds, e.g. 12 2003) first in each cell")
    parser.add_argument("--plain-only", action="store_true",
                        help="only the --seeds parameter-mix episodes: no scenario runs or parameter sweeps (a sweep checked already)")
    parser.add_argument("--frame-limit", action="store_true",
                        help="keep Chromium's frame-rate limit: up to ~35%% less CPU per cell (typing draws a frame per "
                             "key without it), a little more wall time; for CPU-bound parallel runs (fullcheck)")
    parser.add_argument("--lint", action="store_true",
                        help="first run the static contract lint (megawob.lint) over the checked sites; its errors fail")
    return parser


def near_duplicates(results: list[dict]) -> list[str]:
    """Near-duplicate start screens across different widgets of one task (same viewport), as "cell ~ cell"."""
    dups = []
    by_task = defaultdict(list)
    for r in results:
        if r.get("dhash") is not None:
            by_task[r["widget"].task, r["cell"].rsplit("@", 1)[1]].append(r)
    for group in by_task.values():
        for i, a in enumerate(group):
            for b in group[i + 1:]:
                if bin(a["dhash"] ^ b["dhash"]).count("1") <= DUP_BITS:
                    dups.append(f"{a['cell']} ~ {b['cell']}")
    return dups


def print_results(results: list[dict], dups: list[str]) -> None:
    """The result table: one line per cell, its first 12 failures, then the near-duplicate start screens."""
    print(f"{'cell':<52} {'oracle':>7} {'actions':>8}  failures")
    for r in results:
        print(f"{r['cell']:<52} {r.get('oracle_success', 0):>7.0%} {r.get('mean_actions', 0):>8.2f}  {len(r['failures'])}")
        for f in r["failures"][:12]:
            print(f"    - {f}")
        if len(r["failures"]) > 12:
            print(f"    - ... {len(r['failures']) - 12} more")
    for d in dups:
        print(f"near-duplicate start screens: {d}")


def main() -> None:
    """Command line: check the selected cells in parallel and print the table; exit 1 on any failure."""
    args = build_parser().parse_args()

    if args.index:
        print(write_index())
        return
    if args.matrix or not (args.site or args.sites):  # a site check skips the ~1 s full-matrix build
        print(coverage_matrix(), "\n")
    if args.matrix:
        return
    if args.screens:
        args.screens.mkdir(parents=True, exist_ok=True)

    listed = set(args.sites.read_text(encoding="utf-8").split()) if args.sites else None
    cells = [s for s in catalog.widgets(args.task, args.site) if (not args.widget or s.name == args.widget)
             and (listed is None or s.site in listed)]
    if not cells:
        sys.exit("no widgets match")
    lint_errors = 0
    if args.lint:
        from . import lint
        print("contract lint (python -m megawob.lint):")
        lint_errors = lint.report(lint.lint_static(sorted({s.site for s in cells}), args.task))
        print()
    manifest = defaultdict(set)
    for s in catalog.widgets(include_test=True):
        manifest[s.task, s.site].add(s.name)

    sizes = [vp + ("" if d == 1 else f"*{d:g}") for d in args.dsf for vp in args.viewports]
    work = [(vp, widget, manifest[widget.task, widget.site]) for vp in sizes for widget in cells]
    opts = Options(args.seeds, args.steps, args.screens, args.headed, args.fail_fast,
                   frozenset(args.first), args.plain_only, args.frame_limit)
    # Cells are independent: deal them to worker processes, each with its own browser.
    results = driver.run_pool(run_cells, work, args.jobs, opts)

    print_results(results, near_duplicates(results))
    if args.screens:
        sheet = contact_sheet(results, args.screens / "contact-sheet.png")
        if sheet:
            print(f"contact sheet: {sheet}")
    if lint_errors:
        print(f"contract lint: {lint_errors} errors (see above)")
    if any(r["failures"] for r in results) or lint_errors:
        sys.exit(1)
    print("all checks passed")


if __name__ == "__main__":
    main()
