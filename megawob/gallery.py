"""Visual gallery: every task by category, with a live viewer to play its episodes by hand and watch the oracle.

    python -m megawob.gallery --serve        # build html/gallery.html + thumbnails, serve html/ on :8765
    python -m megawob.gallery                # build only; open html/gallery.html (over file:// the live
                                             # readouts are off, because the page cannot reach the iframe)
    python -m megawob.gallery --no-shots     # skip the thumbnails (faster)
    python -m megawob.gallery --player-check --site base --seeds 0   # the viewer's oracle vs Playwright's

The grid ("Find a task") has a tile per task, grouped by category (CATEGORIES; the All tab shows the first 4 of
each, the category tabs all of them): a thumbnail of one widget's stage (a training design-* site where the task has
one), the one-line summary, scenario pills and the inputs. The tile opens the episode its thumbnail shows, a pill
its scenario. The search matches task, scenario, MiniWoB task, instruction words or a site name such as
design-use-email-attachment-05 (matching scenarios lead the pills, and a site opens on that site).

The viewer plays the real page (`play.html`) in an iframe, drawn as a browser window under the goal, with everything
else floating around it:

  - top: the episode (task / scenario, site / widget, seed with - and +, restart) and "Press / to jump to any task".
  - left, a tool rail: the oracle's Play and Step, its speed, "Show next action" (marks the oracle's next action on
    the page), the agent viewport (1024x640, 1280x720, 1440x900) and the debug panel, the task clock (real time by
    default; agent steps as the harness runs it; Wait sends a noop), Parameters and Help. The oracle acts from
    whatever state the page is in, so it can finish an episode you started; Play stops when the episode ends, the oracle
    has nothing to do, its action budget is spent or it repeats an action without effect. Its actions are synthetic
    DOM events (megawob/gallery_input.js), not browser input: CSS :hover does not follow them and code that checks
    event.isTrusted ignores them; --player-check lists the cells where they do not do what Playwright's do.
  - one command palette for the randomization parameters (K: each parameter with its one-line description,
    KNOB_INFO, and the value it has; type to pick values). They start at the page's defaults, except
    VIEWER_DEFAULTS (instructionDisplay=hidden: the goal only in the goal text, as in training); a link records only
    what differs, jumping to a task, scenario or site (/), and the
    site / widget.
  - right: a score card (progress ring, status and end reason, binary and dense rewards, shaped return, error and
    tolerance) and a log card with the last 4 actions (Show all for every one). Every action you or the oracle
    take (a click, double click, drag, typed text, a key, a wheel burst) is one row with its progress change and
    task time; click a row for the shaped step reward (MEGAWOB_REWARD=shaped with the default shaping and success
    bonus of 1: progress change, plus 1 on success), the running return and notes: rejected input, a preempt
    notice, violations, a taken hazard and fired faults.
  - bottom: a message box for the finish route (send_msg_to_user, and report_infeasible behind the flag), which
    finish-by-message, judgment, report and answerIn=reply episodes end on. The title above the page is the
    instruction; in tasks whose ending message is graded, the rest of the goal text (the reply format,
    kit/runtime/reply.js) opens from "Reply format" by the message box, with its line breaks.

Help (?) lists the keys, the task and the parameters the episode actually got.

--player-check opens the built gallery in headless Chromium, plays every selected widget x scenario x seed with the
viewer's oracle, runs the same episode with driver.run_oracle (Playwright input), and prints the cells where the two
disagree (exit 1 when any does). It is a fidelity report for the viewer, not a gate on the env.
"""
from __future__ import annotations

import argparse
import fnmatch
import functools
import http.server
import json
import re
import sys
import threading
import webbrowser
from pathlib import Path


from . import catalog, driver
from .describe import header

OUT = catalog.HTML / "gallery.html"
SHOTS = catalog.HTML / "gallery"
INPUT_JS = Path(__file__).with_name("gallery_input.js")

# Randomization parameters the viewer can set (values from the header of html/kit/env.js). Each picker offers the page's
# own default (param omitted), the training mix from catalog.config().knobs when it is a mix, and each single value.
VIEWER_KNOBS = {
    "instructionDisplay": ["header", "panel", "toast", "hidden"],
    "finishByMessage": ["0", "1"],
    "startState": ["off", "partial", "wrong", "scene", "solved"],
    "popups": ["off", "cookie", "toast", "chat", "promo", "banner"],
    "ood": ["0", "1"],
    "recover": ["0", "1"],
    "instructionSplit": ["train", "heldout"],
    "contentSplit": ["train", "heldout"],
    "composition": ["train", "heldout"],
    "undeclaredInput": ["reject", "void"],
    "difficulty": ["easy", "medium", "normal"],
    "judgment": ["off", "ambiguous", "impossible", "confirm"],
    "instructionNoise": ["off", "terse", "typo", "chatter", "mixed"],
    "dragSteps": ["atomic", "split"],
    "clock": ["step", "action", "real"],
    "timescale": ["0.25", "0.5", "1", "2"],
    "pageFaults": ["off", "miss", "revert", "clear", "hang", "shift"],
    "reportFacts": ["off", "on"],
    "interruptions": ["off", "cancel", "switch"],
    "silentFailures": ["off", "on"],
    "safetyHazards": ["off", "on", "inject", "phish", "alert", "permission", "download", "ad", "pii", "oauth", "extension",
               "update", "prize", "support"],
    "cursorLag": ["0", "1"],
}


# The viewer's Parameters palette, in this order: each parameter's group and one-line description. `clock` has its own
# menu in the tool rail.
KNOB_INFO = {
    "instructionDisplay": ("Instruction", "where the page shows the goal (hidden: only in the goal text)"),
    "instructionNoise": ("Instruction", "the goal written tersely, with typos or with chatter"),
    "startState": ("Start & ending", "how far from the goal the page starts"),
    "difficulty": ("Start & ending", "easier levels of the same task"),
    "finishByMessage": ("Start & ending", "on: no end control, the episode ends with a message"),
    "recover": ("Start & ending", "on: a wrong final choice can be undone, at a cost"),
    "judgment": ("Start & ending", "goals that are ambiguous, impossible or need confirmation"),
    "reportFacts": ("Start & ending", "end with a message stating facts read off the page"),
    "popups": ("Page events", "a popup over the page early in the episode"),
    "pageFaults": ("Page events", "the page misbehaves once"),
    "interruptions": ("Page events", "the user cancels or changes the goal mid-episode"),
    "silentFailures": ("Page events", "one change is saved wrong, without an error"),
    "safetyHazards": ("Page events", "a trap over the page; taking it scores 0"),
    "dragSteps": ("Input", "split: press, move and release are separate actions"),
    "undeclaredInput": ("Input", "input the task does not use: rejected, or the episode ends at 0 (void)"),
    "cursorLag": ("Input", "on: the drawn cursor lags one action"),
    "timescale": ("Input", "real-time clock only: task time speed (0.25 = four times slower)"),
    "instructionSplit": ("Evaluation splits", "training or held-out instruction wording"),
    "contentSplit": ("Evaluation splits", "training or held-out names, products and texts"),
    "composition": ("Evaluation splits", "training or held-out goal combinations (composite tasks)"),
    "ood": ("Evaluation splits", "on: parameter values outside the training ranges"),
}


# The viewer's own defaults, where they differ from the page's: the goal only in the goal text, as in training
# (catalog DEFAULT_KNOBS). A link records only the values that differ from these ("default" for the page's own).
VIEWER_DEFAULTS = {"instructionDisplay": "hidden"}


def knob_options() -> list[dict]:
    """The viewer's Parameters palette: each parameter's group, description, options, the viewer's default and, for
    a training mix, the mix."""
    knobs = catalog.config().knobs
    return [{"name": k, "values": vs, "train": knobs.get(k) if ":" in (knobs.get(k) or "") else None,
             "group": KNOB_INFO[k][0], "desc": KNOB_INFO[k][1], "dflt": VIEWER_DEFAULTS.get(k, "")}
            for k in KNOB_INFO for vs in [VIEWER_KNOBS[k]]]


# The grid's categories, in order (README "Tasks"): name, short tab label, tasks. A task not listed goes under Other.
CATEGORIES = [
    ("Precise mouse control", "Mouse", ["set-slider", "resize-element", "crop-image", "pick-color", "rotate-object",
                                        "draw-shape", "select-text", "reorder-items", "sort-into-bins", "align-layout",
                                        "click-point", "pan-map"]),
    ("Forms", "Forms", ["type-text", "choose-option", "set-date", "fill-form", "complete-wizard", "complete-goals",
                        "change-settings", "transfer-items"]),
    ("Clicking, reading, reasoning", "Reading", ["click-control", "read-figure", "find-fact", "solve-puzzle",
                                                 "handle-text", "act-in-time", "recall-info", "scroll-page"]),
    ("Apps", "Apps", ["use-email", "use-shop", "use-social-feed", "use-desktop-tools", "use-admin-console", "use-bank",
                      "use-site-builder", "use-calendar", "use-chat", "use-dev-tools", "use-dispatch",
                      "use-health-records", "use-accounting", "use-workflow-editor", "use-form-builder",
                      "use-gov-portal", "use-smart-home", "use-hr", "use-legacy-app", "use-course-admin",
                      "use-project-board", "use-spreadsheet", "use-slides", "use-travel", "use-data-grid",
                      "use-file-manager", "use-text-editor"]),
    ("Safety", "Safety", ["avoid-phishing", "resist-injection", "protect-privacy", "avoid-dark-patterns"]),
]
THUMB_VIEWPORT = (1024, 640)  # a tile's thumbnail: the widget's stage at this viewport, at least THUMB_MIN of it
THUMB_MIN = (720, 405)


def category(task: str) -> tuple[str, str]:
    """The grid category of a task: (name, tab label)."""
    return next(((name, label) for name, label, ts in CATEGORIES if task in ts), ("Other", "Other"))


def thumb_widget(widgets: list[catalog.Widget]) -> catalog.Widget:
    """The widget a task's tile shows: its first training design-* widget (they vary the most), else the base one."""
    designs = [w for w in widgets if w.site.startswith("design-") and w.split != "heldout"]
    return (designs or [w for w in widgets if w.site == "base"] or widgets)[0]


def shoot_thumb(page, widget: catalog.Widget, scenario: str | None, path: Path) -> None:
    """The widget's stage, widened to THUMB_MIN around it so a small stage is not blown up."""
    driver.boot(page, widget, 0, scenario)
    page.wait_for_timeout(80)
    x, y, w, h = page.evaluate("() => { const r = __env.stage.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }")
    vw, vh = THUMB_VIEWPORT
    cw = min(vw, max(w, THUMB_MIN[0]))
    ch = min(vh, max(h, THUMB_MIN[1], cw * 9 / 16))
    cx = min(max(0, x + w / 2 - cw / 2), vw - cw)
    cy = min(max(0, y + h / 2 - ch / 2), vh - ch)
    page.screenshot(path=str(path), type="jpeg", quality=84, clip={"x": cx, "y": cy, "width": cw, "height": ch})


def site_kind(site: str) -> str:
    """The widget picker's group for a site."""
    return ("base" if site == "base" else "mock" if site.startswith("mock-")
            else "design" if site.startswith("design-") else "other")


def collect(shots: bool) -> dict:
    """The grid and the viewer's data: one entry per task x scenario (the widgets supporting it, from
    html/scenarios.json; widgets it does not index are booted to ask, and the first widget's instruction) and one per
    task (category, one-line summary, inputs, counts, and a thumbnail when `shots`)."""
    SHOTS.mkdir(exist_ok=True)
    entries, tasks = [], []
    with driver.browser() as browser:
        page = browser.new_page(viewport={"width": driver.VIEWPORT[0], "height": driver.VIEWPORT[1]}, device_scale_factor=1)
        thumbs = browser.new_page(viewport={"width": THUMB_VIEWPORT[0], "height": THUMB_VIEWPORT[1]}, device_scale_factor=1)
        for task in catalog.tasks():
            desc, miniwob = header(task)
            fv = list(catalog._task_entry(task).get("scenarios") or [])
            support: dict = {}
            widgets = catalog.widgets(task)
            for widget in widgets:
                sv = catalog.widget_scenarios(widget)
                if sv is None:  # not indexed yet (python -m megawob.scenarios): ask the page
                    driver.boot(page, widget, 0)
                    sv, pv = page.evaluate("() => [__env.widgetDef.scenarios || null, __env.taskDef.scenarios || []]")
                    fv = fv or pv
                    sv = sv or pv
                row = {"site": widget.site, "name": widget.name, "split": widget.split, "kind": site_kind(widget.site)}
                for v in [v for v in (sv or fv) if not fv or v in fv]:
                    support.setdefault(v, []).append(row)
            inputs: list = []
            for v in fv or [None]:
                rows = support.get(v) or [{"site": s.site, "name": s.name, "split": s.split, "kind": site_kind(s.site)}
                                          for s in widgets]
                first = next(s for s in widgets if s.site == rows[0]["site"] and s.name == rows[0]["name"])
                driver.boot(page, first, 0, v)
                instruction, ins, modes = page.evaluate(
                    "() => [__env.instruction(), __env.inputs(), __env.taskDef.startModes || ['off', 'solved']]")
                inputs += [k for k in ins if k not in inputs]
                entries.append({"task": task, "scenario": v, "description": desc, "miniwob": miniwob, "widgets": rows,
                                "instruction": instruction, "inputs": ins, "startModes": modes})
                print(f"{task:<12} {v or '-':<18} {len(rows):>3} widgets  {instruction[:60]}", flush=True)
            # The tile shows, and opens, one widget at its first scenario.
            tw = thumb_widget(widgets)
            tv = (catalog.widget_scenarios(tw) or [None])[0]
            thumb = None
            if shots:
                thumb = f"gallery/{task}.jpg"
                shoot_thumb(thumbs, tw, tv, catalog.HTML / thumb)
            name, label = category(task)
            tasks.append({"task": task, "category": name, "label": label,
                          "summary": re.split(r"(?<=\.)\s", desc, maxsplit=1)[0].rstrip("."),
                          "inputs": inputs, "widgets": len(widgets), "thumb": thumb,
                          "opens": {"scenario": tv, "site": tw.site, "name": tw.name}})
    order = [t for _, _, ts in CATEGORIES for t in ts]
    tasks.sort(key=lambda t: order.index(t["task"]) if t["task"] in order else len(order))
    return {"entries": entries, "tasks": tasks}


def write(data: dict) -> Path:
    """Write gallery.html with collect()'s data and the synthetic input layer embedded; returns its path."""
    page = PAGE.replace("/*DATA*/[]", json.dumps(data["entries"], ensure_ascii=False))
    page = page.replace("/*TASKS*/[]", json.dumps(data["tasks"], ensure_ascii=False))
    page = page.replace("/*KNOBS*/[]", json.dumps(knob_options()))
    OUT.write_text(page.replace("/*INPUT*/", INPUT_JS.read_text(encoding="utf-8")), encoding="utf-8")
    return OUT


class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args: object) -> None:
        pass


def make_server(port: int, quiet: bool = False) -> http.server.ThreadingHTTPServer:
    """An HTTP server for html/ on 127.0.0.1:`port` (0: a free port), not yet serving."""
    handler = functools.partial(_Quiet if quiet else http.server.SimpleHTTPRequestHandler, directory=str(catalog.HTML))
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    return http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)


def serve(port: int, open_browser: bool = True) -> None:
    """Serve html/ on localhost (the gallery page needs HTTP for its live viewer) until interrupted."""
    server = make_server(port)
    url = f"http://127.0.0.1:{server.server_address[1]}/gallery.html"
    print(f"serving {catalog.HTML} at {url}  (Ctrl+C to stop)")
    if open_browser:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


# ------------------------------------------------------------------------------------------------ player check

PLAYER_TIMEOUT_MS = 120_000  # one episode played by the viewer's oracle


def _check_cells(chunk: list, url: str) -> list[dict]:
    """Per (widget, scenario, seed): the viewer's oracle in the gallery page, then driver.run_oracle on the same
    episode."""
    out = []
    with driver.browser() as b:
        gallery = b.new_context(viewport={"width": 1600, "height": 1000}).new_page()
        gallery.goto(url)
        gallery.wait_for_function("() => window.__gallery")
        plain = driver.new_context(b)
        for widget, scenario, seed in chunk:
            cell = {"site": widget.site, "task": widget.task, "widget": widget.name, "scenario": scenario, "seed": seed}
            try:
                res = gallery.evaluate("(a) => __gallery.check(a)", {
                    "task": widget.task, "scenario": scenario, "site": widget.site, "widget": widget.name, "seed": seed,
                    "timeout": PLAYER_TIMEOUT_MS})
            except Exception as exc:  # noqa: BLE001 - a broken cell is a result
                res = {"error": str(exc).splitlines()[0]}
            cell["viewer"] = res
            page, errors = driver.new_page(plain)
            try:
                driver.boot(page, widget, seed, scenario)
                status, n = driver.run_oracle(page, 8)
                cell["oracle"] = {"success": bool(status["success"]), "n": n, "reason": status["end_reason"]}
            except Exception as exc:  # noqa: BLE001
                cell["oracle"] = {"error": str(exc).splitlines()[0]}
            finally:
                page.close()
            out.append(cell)
    return out


def player_check(args: argparse.Namespace) -> int:
    """Play the selected cells with the viewer's oracle and with Playwright's; print where they disagree."""
    if not OUT.exists():
        raise SystemExit(f"{OUT} is missing: build the gallery first (python -m megawob.gallery --no-shots)")
    widgets = [s for s in catalog.widgets(args.task)
             if not args.site or fnmatch.fnmatchcase(s.site, args.site)]
    work = [(s, v, seed) for s in widgets for v in (catalog.widget_scenarios(s) or [None]) for seed in args.seeds]
    if not work:
        raise SystemExit("no widgets selected")
    server = make_server(0, quiet=True)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{server.server_address[1]}/gallery.html"
    print(f"{len(work)} cells ({len(widgets)} widgets) at {url}", file=sys.stderr, flush=True)
    try:
        cells = driver.run_pool(_check_cells, work, args.jobs, url)
    finally:
        server.shutdown()
    bad = []
    for c in cells:
        v, o = c["viewer"], c["oracle"]
        if v.get("error") or o.get("error") or bool(v.get("success")) != bool(o.get("success")):
            bad.append(c)
    both = sum(1 for c in cells if c["viewer"].get("success") and c["oracle"].get("success"))
    print(f"{len(cells)} cells: both solved {both}, disagree {len(bad)}, "
          f"viewer {sum(1 for c in cells if c['viewer'].get('success'))}, "
          f"playwright {sum(1 for c in cells if c['oracle'].get('success'))}")
    for c in bad:
        v, o = c["viewer"], c["oracle"]
        vs = v.get("error") or f"{'ok' if v.get('success') else 'FAIL'} n={v.get('n')} stop={v.get('stop')} {v.get('reason') or ''}"
        os_ = o.get("error") or f"{'ok' if o.get('success') else 'FAIL'} n={o.get('n')} {o.get('reason') or ''}"
        print(f"  {c['site']}/{c['task']}/{c['widget']} {c['scenario'] or '-'} seed {c['seed']}: viewer {vs} | playwright {os_}")
    if args.out:
        driver.write_json(args.out, cells)
    return 1 if bad else 0


def main() -> None:
    """Command line: build the gallery page, optionally serve it or check its player."""
    parser = driver.parser(__doc__)
    parser.add_argument("--no-shots", action="store_true", help="skip screenshots")
    parser.add_argument("--serve", action="store_true", help="serve html/ over HTTP after building")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-open", action="store_true", help="do not open a browser tab when serving")
    parser.add_argument("--no-build", action="store_true", help="serve or check the existing gallery without rebuilding")
    parser.add_argument("--player-check", action="store_true",
                        help="play the selected cells with the viewer's oracle and Playwright's, list disagreements")
    parser.add_argument("--site", help="player check: site name or glob ('design-use-*')")
    parser.add_argument("--task", help="player check: one task")
    parser.add_argument("--seeds", type=int, nargs="+", default=[0], help="player check: seeds")
    parser.add_argument("--out", help="player check: write every cell's result to this JSON file")
    driver.add_jobs(parser)
    args = parser.parse_args()
    if not args.no_build and not args.player_check:
        print(write(collect(shots=not args.no_shots)))
    if args.player_check:
        sys.exit(player_check(args))
    if args.serve:
        serve(args.port, open_browser=not args.no_open)


PAGE = r"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>megawob gallery</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<style>
:root {
  --bg: #f5f6f8; --panel: #ffffff; --ink: #111827; --muted: #6b7280; --line: #e5e7eb;
  --accent: #1f6feb; --ok: #16a34a; --bad: #dc2626; --chip: #eef0f4;
  --vbg: #f5f6f8; --card: #ffffff; --hover: #f2f4f7; --ink2: #374151; --tip: #1f2329;
  --sans: Inter, "Inter var", ui-sans-serif, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --shadow: 0 0 0 1px rgba(16,24,40,.05), 0 2px 4px rgba(16,24,40,.04), 0 10px 28px rgba(16,24,40,.09);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #111317; --panel: #1c1f24; --ink: #eceef1; --muted: #9aa1ab; --line: #2e333a;
          --accent: #5b9dff; --ok: #3fcf7a; --bad: #ff6b6b; --chip: #2a2e34;
          --vbg: #111317; --card: #1c1f24; --hover: #2a2e34; --ink2: #cfd3d9; --tip: #3a3f47;
          --shadow: 0 0 0 1px rgba(255,255,255,.06), 0 10px 28px rgba(0,0,0,.45); }
}
:root[data-theme="dark"] { --bg: #111317; --panel: #1c1f24; --ink: #eceef1; --muted: #9aa1ab; --line: #2e333a;
          --accent: #5b9dff; --ok: #3fcf7a; --bad: #ff6b6b; --chip: #2a2e34;
          --vbg: #111317; --card: #1c1f24; --hover: #2a2e34; --ink2: #cfd3d9; --tip: #3a3f47;
          --shadow: 0 0 0 1px rgba(255,255,255,.06), 0 10px 28px rgba(0,0,0,.45); }
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--bg); color: var(--ink); font: 14px/1.45 var(--sans); -webkit-font-smoothing: antialiased; }
input, select, button { font: inherit; color: inherit; }
/* ---------------------------------------------------------------- the grid: find a task
   A top bar, a "Find a task" search with the categories, then one tile per task (thumbnail, one-line summary,
   scenario pills, inputs), grouped by category. */
.nav { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 28px; height: 60px; padding: 0 48px;
  background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.brand { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 18px; letter-spacing: -.01em; color: var(--ink); text-decoration: none; }
.brand b { width: 30px; height: 30px; border-radius: 8px; background: var(--accent); color: #fff; display: grid; place-items: center;
  font-size: 17px; font-weight: 700; }
.nav nav { display: flex; gap: 6px; align-self: stretch; }
.nav nav a { display: flex; align-items: center; padding: 0 12px; color: var(--muted); text-decoration: none; font-size: 15px;
  font-weight: 500; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.nav nav a:hover { color: var(--ink); }
.nav nav a.on { color: var(--ink); border-bottom-color: var(--accent); }
.nav .counts { margin-left: auto; color: var(--muted); font-size: 14.5px; white-space: nowrap; }
.nav .ibtn { color: var(--ink2); }
.hero { text-align: center; padding: 30px 24px 4px; }
.hero h1 { margin: 0 0 20px; font-size: 42px; font-weight: 700; letter-spacing: -.03em; line-height: 1.1; }
.bigsearch { display: flex; align-items: center; gap: 14px; width: min(640px, 100%); height: 56px; margin: 0 auto; padding: 0 12px 0 20px;
  background: var(--card); border-radius: 14px; box-shadow: var(--shadow); color: var(--muted); }
.bigsearch input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font-size: 17px; color: var(--ink); }
.bigsearch kbd { font-size: 13px; padding: 3px 9px; }
.cats { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin: 20px 0 0; }
.cats button { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 18px; border-radius: 999px; border: 0; cursor: pointer;
  background: var(--card); color: var(--ink); font-size: 15px; font-weight: 500; box-shadow: 0 0 0 1px var(--line); }
.cats button:hover { box-shadow: 0 0 0 1px var(--accent); }
.cats button.on { background: var(--accent); color: #fff; box-shadow: none; }
.cats .ico { width: 18px; height: 18px; }
.matches { text-align: center; color: var(--muted); font-size: 14px; margin-top: 10px; }
.matches:empty { display: none; }
main { max-width: 1680px; margin: 0 auto; padding: 4px 48px 64px; }
.cat { margin-top: 22px; }
.cath { display: flex; align-items: center; gap: 10px; margin: 0 2px 14px; }
.cath .ico { width: 26px; height: 26px; color: var(--accent); stroke-width: 2; }
.cath h2 { margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -.015em; }
.cath .n { color: var(--muted); font-size: 20px; font-weight: 400; }
.cath .viewall { margin-left: auto; display: flex; align-items: center; gap: 6px; color: var(--accent); font-weight: 500; font-size: 15px;
  border: 0; background: none; cursor: pointer; padding: 0; }
.tiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
@media (max-width: 1250px) { .tiles { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 950px) { .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 620px) { .tiles { grid-template-columns: minmax(0, 1fr); } }
.tile { background: var(--card); border-radius: 14px; box-shadow: var(--shadow); padding: 10px 10px 14px; cursor: pointer;
  display: flex; flex-direction: column; transition: box-shadow .15s, transform .15s; min-width: 0; }
.tile:hover, .tile:focus-visible { transform: translateY(-2px); outline: 0;
  box-shadow: 0 0 0 1px rgba(16,24,40,.06), 0 6px 14px rgba(16,24,40,.08), 0 22px 44px rgba(16,24,40,.14); }
.thumb { position: relative; aspect-ratio: 1.9; border-radius: 9px; overflow: hidden; background: var(--hover); }
.thumb img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
.thumb .ph { position: absolute; inset: 0; display: grid; place-items: center; color: var(--muted); }
.thumb .ph .ico { width: 44px; height: 44px; stroke-width: 1.4; opacity: .6; }
.thumb .playov { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scale(.92); display: flex; align-items: center; gap: 8px;
  background: var(--accent); color: #fff; font-weight: 600; font-size: 16px; padding: 10px 22px 10px 18px; border-radius: 999px;
  box-shadow: 0 8px 24px rgba(31,111,235,.35); opacity: 0; transition: opacity .15s, transform .15s; pointer-events: none; }
.tile:hover .playov { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.thumb::after { content: ""; position: absolute; inset: 0; border-radius: 9px; box-shadow: inset 0 0 0 1px rgba(16,24,40,.06); }
.tb { padding: 12px 6px 0; display: flex; flex-direction: column; flex: 1; }
.tb h3 { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -.01em; }
.tb p { margin: 3px 0 0; color: var(--muted); font-size: 14.5px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden; }
.pills { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0 0; }
.pill { border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 8px; padding: 3px 11px; font-size: 13.5px;
  cursor: pointer; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pill:hover { border-color: var(--accent); color: var(--accent); }
.pill.hit { background: color-mix(in srgb, var(--accent) 12%, var(--card)); border-color: color-mix(in srgb, var(--accent) 40%, var(--card)); color: var(--accent); }
.pill.more { color: var(--muted); }
.tfoot { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; margin-top: auto; padding-top: 14px; }
.itag { display: flex; align-items: center; gap: 6px; border: 1px solid var(--line); border-radius: 8px; padding: 3px 10px 3px 8px;
  font-size: 13px; color: var(--ink2); }
.itag .ico { width: 15px; height: 15px; }
.tfoot .wn { margin-left: auto; color: var(--muted); font-size: 13.5px; white-space: nowrap; }
.nomatch { text-align: center; color: var(--muted); padding: 60px 0; font-size: 15px; }
@media (max-width: 900px) { .nav { padding: 0 16px; gap: 14px; } .nav .counts { display: none; } main { padding: 4px 16px 48px; }
  .hero h1 { font-size: 34px; } }

/* ---------------------------------------------------------------- viewer: focus mode
   The page in a browser window in the middle; the rest floats around it: the episode pill and the jump search on
   top, the tool rail on the left, the score card and the action log on the right, the message box at the bottom.
   Parameters, task jumps and widget picks go through one command palette. */
#viewer { position: fixed; inset: 0; z-index: 10; display: none; overflow: hidden;
  background: radial-gradient(1400px 700px at 50% 0%, var(--card), var(--vbg) 70%) var(--vbg);
  --colL: 116px; --colR: 340px; --cardW: 300px; }
#viewer.open { display: block; }
#viewer [hidden] { display: none !important; }
.ico { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
  flex: none; display: block; }
.ico.sm { width: 16px; height: 16px; }
.float { background: var(--card); border-radius: 14px; box-shadow: var(--shadow); }
.ibtn { border: 0; background: none; color: var(--muted); width: 32px; height: 32px; border-radius: 8px; display: grid;
  place-items: center; cursor: pointer; padding: 0; text-decoration: none; flex: none; }
.ibtn:hover { background: var(--hover); color: var(--ink); }
/* top: the episode pill and the jump search */
.vtop { position: absolute; top: 14px; left: var(--colL); right: var(--colR); display: flex; justify-content: center; gap: 10px; z-index: 3; }
.crumbs { display: flex; align-items: center; height: 46px; padding: 0 6px; gap: 0; font-size: 14.5px; font-weight: 500; white-space: nowrap; min-width: 0; }
.crumb { border: 0; background: none; padding: 6px 7px; border-radius: 8px; cursor: pointer; color: var(--ink); font: inherit;
  overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.crumb:hover { background: var(--hover); }
#vwidget { max-width: 300px; }
.dotsep { color: var(--muted); padding: 0 1px; }
.seedl { display: flex; align-items: center; gap: 5px; cursor: text; }
.seedin { width: 3.4ch; border: 0; background: none; font: inherit; color: inherit; padding: 0; outline: 0; -moz-appearance: textfield; }
.seedin::-webkit-inner-spin-button, .seedin::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.crumbs .vsep { width: 1px; height: 24px; background: var(--line); margin: 0 6px 0 4px; }
.searchpill { display: flex; align-items: center; gap: 10px; height: 46px; padding: 0 16px; width: 286px; flex: 0 1 286px; min-width: 0;
  color: var(--muted); cursor: pointer; border: 0; font: inherit; font-size: 14.5px; text-align: left; white-space: nowrap; overflow: hidden; }
.searchpill:hover { color: var(--ink); }
/* the goal, set like a title, and the browser window with the page */
.vgoal { position: absolute; left: var(--colL); right: var(--colR); text-align: center; font-size: 32px; font-weight: 700;
  letter-spacing: -.022em; line-height: 1.22; padding: 0 16px; color: var(--ink); cursor: pointer; display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden; z-index: 1; }
.vgoal.long { font-size: 22px; font-weight: 600; letter-spacing: -.015em; line-height: 1.35; }
.vgoal.full { display: block; z-index: 5; max-height: 60vh; overflow: auto; background: var(--card); border-radius: 14px;
  box-shadow: var(--shadow); padding: 14px 18px; }
.vwin { position: absolute; border-radius: 12px; overflow: hidden; background: var(--card);
  box-shadow: 0 0 0 1px var(--line), 0 2px 6px rgba(16,24,40,.05), 0 22px 60px rgba(16,24,40,.16); }
.chrome { height: 42px; display: flex; align-items: center; gap: 4px; padding: 0 10px 0 16px; border-bottom: 1px solid var(--line); }
.lights { display: flex; gap: 8px; margin-right: 14px; }
.lights i { width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; }
.lights i:nth-child(2) { background: #febc2e; } .lights i:nth-child(3) { background: #28c840; }
.chrome .ibtn { width: 28px; height: 28px; }
.chrome .ibtn[disabled] { opacity: .4; cursor: default; background: none; }
.urlbar { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 12px; margin: 0 6px;
  border-radius: 999px; background: var(--hover); color: var(--muted); font-size: 13px; }
.urlbar span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink); }
.vstage { position: relative; overflow: hidden; background: #fff; }
.frame { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
.frame iframe { border: 0; display: block; }
.frame svg { position: absolute; inset: 0; pointer-events: none; }
/* left: the tool rail, with tooltips and flyout menus */
.vtools { position: absolute; left: 24px; top: 96px; display: flex; flex-direction: column; gap: 10px; padding: 10px 8px; z-index: 3; }
.tool { position: relative; width: 42px; height: 42px; border: 0; border-radius: 10px; background: none; color: var(--ink);
  display: grid; place-items: center; cursor: pointer; padding: 0; }
.tool .ico { width: 24px; height: 24px; stroke-width: 1.9; }
.tool:hover, .tool.open { background: var(--hover); }
.tool.on { background: color-mix(in srgb, var(--accent) 14%, transparent); color: var(--accent); }
.tool.primary { background: var(--accent); color: #fff; }
.tool.primary:hover { filter: brightness(1.08); }
.tool .badge { position: absolute; top: 1px; right: 1px; min-width: 16px; height: 16px; border-radius: 8px; background: var(--accent);
  color: #fff; font-size: 10.5px; font-weight: 700; display: grid; place-items: center; padding: 0 4px; line-height: 1; }
.tool .badge:empty { display: none; }
.tool[data-tip]:hover::after { content: attr(data-tip); position: absolute; left: calc(100% + 14px); top: 50%; transform: translateY(-50%);
  background: var(--tip); color: #fff; font-size: 14px; font-weight: 500; padding: 7px 12px; border-radius: 8px; white-space: nowrap;
  pointer-events: none; z-index: 9; }
.vtools.flying .tool::after { display: none; }
.fly { position: absolute; left: 92px; z-index: 8; width: 270px; padding: 8px; }
.fly h4 { margin: 4px 8px 6px; font-size: 12px; font-weight: 600; color: var(--muted); }
.opt { display: flex; align-items: flex-start; gap: 10px; width: 100%; border: 0; background: none; text-align: left; padding: 7px 8px;
  border-radius: 8px; cursor: pointer; font: inherit; font-size: 14px; color: var(--ink); }
.opt:hover { background: var(--hover); }
.opt .tick { width: 16px; height: 18px; color: var(--accent); display: grid; place-items: center; flex: none; }
.opt small { display: block; color: var(--muted); font-size: 12px; }
.opt kbd { margin-left: auto; }
.fly hr { border: 0; border-top: 1px solid var(--line); margin: 6px 0; }
/* right: the score card and the action log */
.vscore { position: absolute; right: 16px; top: 16px; width: var(--cardW); padding: 14px 16px 12px; z-index: 2; }
.vscore .head { display: flex; gap: 16px; align-items: center; }
.ring { width: 78px; height: 78px; position: relative; flex: none; }
.ring svg { width: 78px; height: 78px; transform: rotate(-90deg); display: block; }
.ring circle { fill: none; stroke-width: 7; }
.ring .track { stroke: var(--hover); }
.ring .val { stroke: var(--accent); stroke-linecap: round; transition: stroke-dashoffset .3s; }
.vscore.ok .ring .val { stroke: var(--ok); } .vscore.bad .ring .val { stroke: var(--bad); }
.ring b { position: absolute; inset: 0; display: grid; place-items: center; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; }
.vscore .state { font-size: 19px; font-weight: 600; line-height: 1.25; letter-spacing: -.01em; }
.vscore.ok .state { color: var(--ok); } .vscore.bad .state { color: var(--bad); }
.vscore .why { font-size: 12px; color: var(--muted); }
.trio { display: flex; gap: 12px; margin-top: 8px; }
.trio div { padding-left: 12px; border-left: 1px solid var(--line); } .trio div:first-child { padding-left: 0; border: 0; }
.trio span { display: block; font-size: 11.5px; color: var(--muted); }
.trio b { font-size: 17px; font-weight: 500; font-variant-numeric: tabular-nums; }
.facts { margin-top: 12px; border-top: 1px solid var(--line); padding-top: 8px; }
.facts div { display: flex; justify-content: space-between; font-size: 13px; padding: 2px 0; color: var(--muted); }
.facts b { color: var(--ink); font-weight: 500; font-variant-numeric: tabular-nums; }
.vlog { position: absolute; right: 16px; bottom: 16px; width: var(--cardW); padding: 12px; z-index: 2; display: flex; flex-direction: column;
  background: color-mix(in srgb, var(--card) 92%, transparent); backdrop-filter: blur(8px); }
.vlog .lh { display: flex; justify-content: space-between; align-items: baseline; padding: 2px 4px 10px; font-weight: 600; font-size: 15px; }
.linkbtn { border: 0; background: none; color: var(--accent); cursor: pointer; font: inherit; font-size: 13.5px; font-weight: 500; padding: 0; }
.lrows { background: var(--vbg); border-radius: 10px; overflow: auto; min-height: 0; }
.lrow { display: grid; grid-template-columns: 18px 1fr auto auto; gap: 2px 8px; align-items: center; padding: 8px 10px;
  border-top: 1px solid var(--line); font-size: 13.5px; cursor: pointer; }
.lrow:first-child, .lrow[hidden] + .lrow { border-top: 0; }
.lrow .n { color: var(--muted); font-variant-numeric: tabular-nums; text-align: center; }
.lrow .act { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lrow .act i { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 7px; vertical-align: 1px; background: var(--muted); }
.lrow.oracle .act i { background: #e64980; } .lrow.you .act i { background: var(--accent); }
.lrow .flag { color: var(--bad); font-weight: 700; margin-left: 4px; }
.lrow .dp { font-weight: 500; font-variant-numeric: tabular-nums; text-align: right; min-width: 40px; }
.lrow .t { color: var(--muted); font-size: 12.5px; font-variant-numeric: tabular-nums; min-width: 38px; text-align: right; }
.lrow .more { grid-column: 2 / 5; color: var(--muted); font-size: 12px; display: none; }
.lrow .more .warn { color: var(--bad); }
.lrow.open .more { display: block; } .lrow.open .act { white-space: normal; word-break: break-word; }
.lrow.end { background: color-mix(in srgb, var(--card) 50%, transparent); }
.lempty { padding: 12px; color: var(--muted); font-size: 13px; }
.pos { color: var(--ok); } .neg { color: var(--bad); }
/* bottom: the message box and the oracle's status */
.vcomposer { position: absolute; bottom: 22px; left: var(--colL); right: var(--colR); margin: 0 auto; width: min(600px, calc(100% - var(--colL) - var(--colR)));
  display: flex; align-items: center; gap: 6px; height: 50px; padding: 0 6px 0 16px; color: var(--muted); z-index: 2; }
.vcomposer input { flex: 1; border: 0; background: none; font: inherit; font-size: 15px; outline: none; min-width: 0; color: var(--ink); margin-left: 6px; }
.sendbtn { display: flex; align-items: center; gap: 8px; background: var(--accent); color: #fff; border: 0; border-radius: 10px; height: 38px;
  padding: 0 20px 0 16px; font: inherit; font-weight: 500; font-size: 15px; cursor: pointer; }
.sendbtn:hover { filter: brightness(1.08); }
.fmtbtn { display: flex; align-items: center; gap: 6px; border: 0; background: none; color: var(--muted); font: inherit; font-size: 13.5px;
  padding: 6px 8px; border-radius: 8px; cursor: pointer; white-space: nowrap; }
.fmtbtn:hover, .fmtbtn.open { background: var(--hover); color: var(--ink); }
.fmtpop { position: absolute; bottom: 84px; left: var(--colL); right: var(--colR); margin: 0 auto; width: min(640px, calc(100vw - 32px));
  z-index: 7; display: flex; flex-direction: column; max-height: calc(100vh - 200px);
  box-shadow: 0 0 0 1px var(--line), 0 24px 60px rgba(16,24,40,.22); }
.fmtpop .ph { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 16px 20px 6px; font-weight: 600; font-size: 15.5px; }
.fmtpop .ph small { color: var(--muted); font-weight: 400; font-size: 12.5px; }
.fmtpop p { margin: 0 20px 10px; color: var(--muted); font-size: 13px; }
.fmtpop pre { margin: 0 12px 12px; padding: 12px 14px; overflow: auto; background: var(--vbg); border-radius: 10px; white-space: pre-wrap;
  word-break: break-word; font: 12.5px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--ink); }
.toast { position: absolute; bottom: 84px; left: var(--colL); right: var(--colR); margin: 0 auto; width: max-content; max-width: 70%;
  background: var(--tip); color: #fff; font-size: 13px; padding: 6px 14px; border-radius: 999px; z-index: 4; }
.toast:empty { display: none; }
/* the command palette (parameters, jump to a task, site / widget) and help */
.scrim { position: absolute; inset: 0; z-index: 6; }
.palette { position: absolute; top: 150px; left: var(--colL); right: var(--colR); margin: 0 auto; width: min(500px, calc(100vw - 32px));
  z-index: 7; padding-bottom: 8px; display: flex; flex-direction: column; max-height: calc(100vh - 190px);
  box-shadow: 0 0 0 1px var(--line), 0 24px 60px rgba(16,24,40,.22); }
.palette .ph { display: flex; justify-content: space-between; align-items: baseline; padding: 16px 20px 10px; font-weight: 600; font-size: 15.5px; }
.palette .ph small { color: var(--muted); font-weight: 400; font-size: 12.5px; }
.psearch { margin: 0 12px 8px; display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 6px 0 12px; border: 1px solid var(--line);
  border-radius: 8px; color: var(--muted); flex: none; }
.psearch input { flex: 1; border: 0; outline: 0; background: none; font: inherit; font-size: 15px; color: var(--ink); min-width: 0; }
.presults { overflow: auto; padding: 0 10px; min-height: 0; }
.pres { display: flex; align-items: center; gap: 14px; padding: 9px 12px; border-radius: 8px; cursor: pointer; }
.pres.on { background: color-mix(in srgb, var(--accent) 16%, var(--card)); }
.pres:hover:not(.on) { background: var(--hover); }
.pres .pi { width: 30px; display: grid; place-items: center; color: var(--ink2); flex: none; }
.pres .pi .ico { width: 24px; height: 24px; stroke-width: 1.6; }
.pres .pb { flex: 1; min-width: 0; }
.pres .pt { font-size: 15px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pres .pt mark { background: none; color: inherit; }
.pres.on .pt mark { color: var(--accent); }
.pres .ps { font-size: 13px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pres .pv { font-size: 13px; color: var(--muted); white-space: nowrap; } .pres .pv.set { color: var(--accent); font-weight: 600; }
.pres .cur { color: var(--accent); flex: none; }
.pres .pk { color: var(--muted); font-size: 12.5px; white-space: nowrap; min-width: 34px; text-align: right; }
.pgroup { padding: 10px 12px 4px; font-size: 11.5px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; }
.pempty { padding: 12px; color: var(--muted); font-size: 13.5px; }
.vhelp { width: min(560px, calc(100vw - 32px)); top: 90px; max-height: calc(100vh - 120px); }
.vhelp .hb { overflow: auto; padding: 0 20px 10px; font-size: 13.5px; }
.vhelp h5 { margin: 14px 0 6px; font-size: 11.5px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; }
.vhelp table { border-collapse: collapse; } .vhelp td { padding: 3px 14px 3px 0; vertical-align: top; }
.vhelp p { color: var(--muted); margin: 10px 0 0; }
.kv { display: grid; grid-template-columns: auto 1fr; gap: 3px 14px; margin: 0; font-size: 13px; }
.kv dt { color: var(--muted); } .kv dd { margin: 0; word-break: break-word; font-variant-numeric: tabular-nums; }
kbd { font: 500 11.5px var(--sans); border: 1px solid var(--line); border-radius: 5px; padding: 1px 5px;
  background: var(--vbg); color: var(--ink2); }
</style>
</head>
<body>
<header class="nav">
  <a class="brand" href="gallery.html"><b>M</b>MegaWoB gallery</a>
  <nav>
    <a class="on" href="gallery.html">Tasks</a>
    <a href="https://github.com/d-nyamkhuu/megawob/blob/main/docs/tasks.md" target="_blank" rel="noopener">Docs</a>
    <a href="https://github.com/d-nyamkhuu/megawob" target="_blank" rel="noopener">GitHub</a>
  </nav>
  <span class="counts" id="count"></span>
  <button class="ibtn" id="themeBtn" title="Light or dark theme"></button>
</header>
<section class="hero">
  <h1>Find a task</h1>
  <label class="bigsearch"><i data-ico="search"></i><input type="search" id="q" autocomplete="off" spellcheck="false"><kbd>/</kbd></label>
  <div class="cats" id="cats"></div>
  <div class="matches" id="matches"></div>
</section>
<main id="list"></main>

<div id="viewer">
  <div class="vtop">
    <div class="crumbs float">
      <button class="ibtn" id="back" title="Back to the grid (Esc)"><i data-ico="arrowLeft"></i></button>
      <button class="crumb" id="vtitle" title="Jump to another task (/)"></button>
      <span class="dotsep">·</span>
      <button class="crumb" id="vwidget" title="Pick a site / widget"></button>
      <span class="dotsep">·</span>
      <label class="crumb seedl" title="Seed: type one, or step with − and +">seed <input class="seedin" type="number" id="seed" min="0" step="1"></label>
      <span class="vsep"></span>
      <button class="ibtn" id="seedPrev" title="Previous seed"><i data-ico="minus"></i></button>
      <button class="ibtn" id="seedNext" title="Next seed"><i data-ico="plus"></i></button>
      <button class="ibtn" id="reload" title="Restart this episode (R)"><i data-ico="restart"></i></button>
    </div>
    <button class="searchpill float" id="jumpBtn" title="Jump to any task, scenario or site (/)"><i data-ico="search"></i>Press / to jump to any task</button>
  </div>

  <div class="vgoal" id="vinstr" title="The goal text (obs[&quot;goal&quot;]); click to show all of it"></div>
  <div class="vwin" id="vwin">
    <div class="chrome">
      <span class="lights"><i></i><i></i><i></i></span>
      <button class="ibtn" disabled tabindex="-1"><i data-ico="chevLeft"></i></button>
      <button class="ibtn" disabled tabindex="-1"><i data-ico="chevRight"></i></button>
      <button class="ibtn" id="reload2" title="Restart this episode (R)"><i data-ico="restart"></i></button>
      <div class="urlbar" title="The page the episode runs"><i data-ico="info" class="sm"></i><span id="vurl"></span></div>
      <a class="ibtn" id="newtab" target="_blank" rel="noopener" title="Open the page on its own, on the real-time clock: outside the viewer nothing steps the task clock after your actions"><i data-ico="external"></i></a>
    </div>
    <div class="vstage" id="stage">
      <div class="frame" id="frame">
        <iframe id="ifr" title="task page"></iframe>
        <svg id="overlay"></svg>
      </div>
    </div>
  </div>

  <div class="vtools float" id="tools">
    <button class="tool primary" id="oplay" data-tip="Oracle: play (P)"><i data-ico="play"></i></button>
    <button class="tool" id="ostep" data-tip="Oracle: one action (O)"><i data-ico="stepForward"></i></button>
    <button class="tool" data-fly="speed" data-tip="Oracle speed"><i data-ico="gauge"></i></button>
    <button class="tool" id="hintBtn" data-tip="Show next action (H)"><i data-ico="target"></i></button>
    <button class="tool" data-fly="viewport" data-tip="Viewport"><i data-ico="monitor"></i></button>
    <button class="tool" data-fly="clock" data-tip="Clock"><i data-ico="clock"></i></button>
    <button class="tool" id="paramsBtn" data-tip="Parameters (K)"><i data-ico="sliders"></i><span class="badge" id="pcount"></span></button>
    <button class="tool" id="helpBtn" data-tip="Help (?)"><i data-ico="help"></i></button>
  </div>
  <div class="fly float" id="fly" hidden></div>

  <div class="vscore float" id="score">
    <div class="head">
      <div class="ring"><svg viewBox="0 0 78 78"><circle class="track" cx="39" cy="39" r="33"/><circle class="val" id="sring" cx="39" cy="39" r="33"/></svg><b id="sprog">–</b></div>
      <div>
        <div class="state" id="sstate">loading</div>
        <div class="why" id="swhy"></div>
        <div class="trio">
          <div title="1 on success, else 0 (MEGAWOB_REWARD=binary)"><span>binary</span><b id="sbin">–</b></div>
          <div title="the graded score at the end (MEGAWOB_REWARD=dense)"><span>dense</span><b id="sdense">–</b></div>
          <div title="shaped return so far: progress change per step plus 1 on success (MEGAWOB_REWARD=shaped, default weights)"><span>shaped</span><b id="sret">–</b></div>
        </div>
      </div>
    </div>
    <div class="facts">
      <div><span>Progress</span><b id="sprog2">–</b></div>
      <div title="the task's graded error and its tolerance"><span>Error</span><b id="serr">–</b></div>
      <div><span>Actions</span><b id="sact">0</b></div>
      <div id="stimeWrap"><span>Task time</span><b id="stime">–</b></div>
    </div>
  </div>

  <div class="vlog float" id="vlog">
    <div class="lh"><span id="lhead">Actions</span><button class="linkbtn" id="lall" title="Show every action (L)"></button></div>
    <div class="lrows" id="lrows"><div class="lempty" id="lempty">Act in the page, or let the oracle play.</div><div id="lbody"></div></div>
  </div>

  <div class="toast" id="ostatus"></div>
  <div class="vcomposer float">
    <i data-ico="message"></i>
    <input type="text" id="msg" placeholder="Message to user..." title="send_msg_to_user(text) ends the episode: needed in finish-by-message, judgment, report-facts and answer-in episodes">
    <button class="fmtbtn" id="fmtBtn" title="The format the goal asks the ending message to use" hidden><i data-ico="doc" class="sm"></i>Reply format</button>
    <button class="ibtn" id="infeasible" title="Report infeasible: report_infeasible(text)"><i data-ico="flag"></i></button>
    <button class="sendbtn" id="send" title="send_msg_to_user(text): __env.finish(text)"><i data-ico="send" class="sm"></i>Send</button>
  </div>

  <div class="fmtpop float" id="fmtpop" hidden>
    <div class="ph"><span>Reply format</span><small>ESC to close</small></div>
    <p>The end of the goal text (obs["goal"]): how a message that ends the episode must be written. It is drawn per
      episode, so its layout and words change with the seed.</p>
    <pre id="fmttext"></pre>
  </div>
  <div class="scrim" id="scrim" hidden></div>
  <div class="palette float" id="palette" hidden>
    <div class="ph"><span id="ptitle">Parameters</span><small>ESC to close</small></div>
    <div class="psearch"><i data-ico="search" class="sm"></i><input id="pq" autocomplete="off" spellcheck="false"><button class="ibtn" id="pclear" title="Clear"><i data-ico="x" class="sm"></i></button></div>
    <div class="presults" id="pres"></div>
  </div>
  <div class="palette vhelp float" id="help" hidden>
    <div class="ph"><span>Help</span><small>ESC to close</small></div>
    <div class="hb">
      <h5>Keys</h5>
      <table>
        <tr><td><kbd>P</kbd></td><td>oracle: play / pause</td></tr>
        <tr><td><kbd>O</kbd></td><td>oracle: one action</td></tr>
        <tr><td><kbd>H</kbd></td><td>show the oracle's next action on the page</td></tr>
        <tr><td><kbd>S</kbd></td><td>wait one step (step clock)</td></tr>
        <tr><td><kbd>R</kbd></td><td>restart the episode</td></tr>
        <tr><td><kbd>K</kbd></td><td>parameters</td></tr>
        <tr><td><kbd>/</kbd></td><td>jump to any task, scenario or site</td></tr>
        <tr><td><kbd>[</kbd> <kbd>]</kbd></td><td>previous / next task x scenario</td></tr>
        <tr><td><kbd>L</kbd></td><td>all actions / the last 4</td></tr>
        <tr><td><kbd>Esc</kbd></td><td>close a popup, then back to the grid</td></tr>
      </table>
      <p>An episode ends on the page's end control, on a message to the user, or on a task-side ending or a violation;
        the score card shows the reason. With the step clock, task time moves one agent step per action, as in training.
        Click an action in the log for its numbers.</p>
      <h5>This task</h5>
      <dl class="kv" id="taskinfo"></dl>
      <h5>This episode's parameters</h5>
      <dl class="kv" id="vep"></dl>
    </div>
  </div>

  <div hidden>
    <select id="ospeed"><option value="watch">watch</option><option value="normal" selected>normal</option><option value="fast">fast</option></select>
    <select id="vp"><option>1024x640</option><option selected>1280x720</option><option>1440x900</option></select>
    <select id="clock"><option value="step">step</option><option value="action">action</option><option value="real" selected>real</option></select>
    <input type="checkbox" id="autostep" checked><input type="checkbox" id="debug"><input type="checkbox" id="hint">
  </div>
</div>

<script>
/*INPUT*/
</script>
<script>
const DATA = /*DATA*/[];
const KNOBS = /*KNOBS*/[];
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const TASKS = /*TASKS*/[];
const CAT_ICON = { 'Precise mouse control': 'mouse', Forms: 'doc', 'Clicking, reading, reasoning': 'book', Apps: 'grid', Safety: 'shield', Other: 'task' };
const INPUT_ICON = { pointer: 'mouse', keyboard: 'keyboard', wheel: 'wheel' };
const CATS = [...new Set(TASKS.map((t) => t.category))];
const LABEL = Object.fromEntries(TASKS.map((t) => [t.category, t.label]));
let cat = null;               // the category tab; null: All
const expanded = new Set();   // tasks whose every scenario pill shows
const PER_CAT = 4;            // tiles per category on the All tab

// ------------------------------------------------------------------ grid
// A query matches a task (name, summary, description, MiniWoB++ names, category) or its scenarios (name,
// instruction) or a site; matching scenarios lead the pills and are highlighted, and a site opens on that site.
function matchTask(t, q) {
  const ws = q.toLowerCase().split(/\s+/).filter(Boolean);
  const all = DATA.map((d, i) => ({ d, i })).filter(({ d }) => d.task === t.task);
  if (!ws.length) return { t, rows: all.map((r) => ({ ...r, hit: false })) };
  const has = (hay) => ws.every((w) => hay.toLowerCase().includes(w));
  const whole = has([t.task, t.summary, all[0].d.description, all[0].d.miniwob, t.category].join(' '));
  const ql = q.toLowerCase();
  const rows = all.map(({ d, i }) => {
    const site = d.widgets.find((w) => w.site.toLowerCase() === ql || (ql.length > 6 && w.site.toLowerCase().includes(ql)));
    return { d, i, site, hit: !!site || has([d.task, d.scenario || 'default', d.instruction].join(' ')) };
  });
  if (!whole && !rows.some((r) => r.hit)) return null;
  return { t, rows: [...rows.filter((r) => r.hit), ...rows.filter((r) => !r.hit)] };
}
const openRow = (r) => open(r.i, r.site ? { site: r.site.site, name: r.site.name } : {});
// A tile opens the episode its thumbnail shows, unless the query matched a scenario or a site: then that one.
function openTile(m) {
  const o = m.t.opens;
  const k = DATA.findIndex((d) => d.task === m.t.task && (d.scenario || null) === (o.scenario || null));
  if (m.rows[0].hit || k < 0) openRow(m.rows[0]); else open(k, { site: o.site, name: o.name });
}

function renderCats() {
  $('cats').innerHTML = [null, ...CATS].map((c) => `<button data-c="${esc(c || '')}" class="${c === cat ? 'on' : ''}">`
    + `${c ? ico(CAT_ICON[c] || 'task') : ''}${esc(c ? LABEL[c] : 'All')}</button>`).join('');
}
function tileHtml(m) {
  const t = m.t;
  const shown = expanded.has(t.task) ? m.rows : m.rows.slice(0, PER_CAT);
  const more = m.rows.length - shown.length;
  const thumb = t.thumb ? `<img loading="lazy" src="${esc(t.thumb)}" alt="">` : `<span class="ph">${ico(CAT_ICON[t.category] || 'task')}</span>`;
  return `<article class="tile" tabindex="0" data-t="${esc(t.task)}">`
    + `<div class="thumb">${thumb}<span class="playov">${ico('play', 'sm')}Play</span></div>`
    + `<div class="tb"><h3>${esc(t.task)}</h3><p title="${esc(t.summary)}">${esc(t.summary)}</p>`
    + `<div class="pills">${shown.map((r, k) => `<button class="pill${r.hit ? ' hit' : ''}" data-k="${k}" title="${esc(r.d.instruction)}">${esc(r.d.scenario || 'default')}</button>`).join('')}`
    + `${more > 0 ? `<button class="pill more" data-more="1">+${more}</button>` : ''}</div>`
    + `<div class="tfoot">${t.inputs.map((k) => `<span class="itag">${ico(INPUT_ICON[k] || 'pointer')}${esc(k)}</span>`).join('')}`
    + `<span class="wn">${t.widgets} widget${t.widgets === 1 ? '' : 's'}</span></div></div></article>`;
}
let shownTiles = new Map();   // task -> its match, for the click handler
function renderList() {
  const q = $('q').value.trim();
  const matches = TASKS.map((t) => matchTask(t, q)).filter(Boolean);
  shownTiles = new Map(matches.map((m) => [m.t.task, m]));
  const cats = (q ? CATS : cat ? [cat] : CATS).filter((c) => !q || !cat || c === cat);
  $('list').innerHTML = cats.map((c) => {
    const ms = matches.filter((m) => m.t.category === c);
    if (!ms.length) return '';
    const cut = !q && !cat && ms.length > PER_CAT;
    return `<section class="cat"><div class="cath">${ico(CAT_ICON[c] || 'task')}<h2>${esc(c)}</h2><span class="n">· ${ms.length}</span>`
      + (cut ? `<button class="viewall" data-c="${esc(c)}">View all ${ms.length} ${ico('arrowRight', 'sm')}</button>` : '') + '</div>'
      + `<div class="tiles">${(cut ? ms.slice(0, PER_CAT) : ms).map(tileHtml).join('')}</div></section>`;
  }).join('') || '<div class="nomatch">No task, scenario or site matches.</div>';
  const n = cats.reduce((a, c) => a + matches.filter((m) => m.t.category === c).length, 0);
  $('matches').textContent = q ? `${n} task${n === 1 ? '' : 's'} match` : '';
}
const sites = new Set(DATA.flatMap((d) => d.widgets.map((w) => w.site)));
$('count').textContent = `${TASKS.length} tasks · ${DATA.length} scenarios · ${sites.size.toLocaleString('en')} sites`;
$('q').placeholder = `Search ${TASKS.length} tasks, ${DATA.length} scenarios or ${sites.size.toLocaleString('en')} sites`;
$('q').addEventListener('input', renderList);
$('q').addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { $('q').value = ''; renderList(); $('q').blur(); }
  if (e.key === 'Enter') { const m = shownTiles.values().next().value; if (m) openTile(m); }
});
$('cats').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  cat = b.dataset.c || null;
  renderCats(); renderList();
});
$('list').addEventListener('click', (e) => {
  const va = e.target.closest('.viewall');
  if (va) { cat = va.dataset.c; renderCats(); renderList(); scrollTo({ top: 0, behavior: 'smooth' }); return; }
  const tile = e.target.closest('.tile');
  if (!tile) return;
  const m = shownTiles.get(tile.dataset.t);
  const pill = e.target.closest('.pill');
  if (pill && pill.dataset.more) { expanded.add(m.t.task); renderList(); return; }
  if (pill) openRow((expanded.has(m.t.task) ? m.rows : m.rows.slice(0, PER_CAT))[+pill.dataset.k]);
  else openTile(m);
});
$('list').addEventListener('keydown', (e) => {
  const tile = e.target.closest('.tile');
  if (tile && e.key === 'Enter' && e.target === tile) openTile(shownTiles.get(tile.dataset.t));
});

// Light or dark: the system's, until the button picks one (kept in this browser).
function applyTheme(t) {
  if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  const dark = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  $('themeBtn').innerHTML = ico(dark ? 'moon' : 'sun');
}
$('themeBtn').onclick = () => {
  const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  const t = dark ? 'light' : 'dark';
  try { localStorage.setItem('megawob-theme', t); } catch (err) { /* private mode */ }
  applyTheme(t);
};

// ------------------------------------------------------------------ viewer
let cur = null;      // { i, widget, seed }
let liveOk = false;  // same-origin access to the iframe's __env
let epoch = 0;       // bumped on every load: stale oracle runs and timers check it

// ------------------------------------------------------------------ icons
const ICONS = {
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  chevLeft: '<path d="M15 6l-6 6 6 6"/>',
  chevRight: '<path d="M9 6l6 6-6 6"/>',
  minus: '<path d="M6 12h12"/>',
  plus: '<path d="M12 6v12M6 12h12"/>',
  restart: '<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r=".6" fill="currentColor"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
  pause: '<path d="M8 5v14M16 5v14" stroke-width="3"/>',
  stepForward: '<path d="M6 5.5l10 6.5-10 6.5z"/><path d="M18.5 5v14"/>',
  gauge: '<path d="M4.2 18a9 9 0 1 1 15.6 0"/><path d="M12 14l4-5"/><circle cx="12" cy="14" r="1.2" fill="currentColor"/>',
  target: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.9.7c0 1.7-2.5 2.1-2.5 3.6"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  message: '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.4A8 8 0 1 1 20 12z"/>',
  send: '<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  text: '<path d="M4 6h16M4 12h11M4 18h14"/>',
  bell: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  pointer: '<path d="M6 3l13 7.5-5.5 1.5L11 18z"/><path d="M13.5 12l5 6"/>',
  fork: '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v1a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V7M12 12v5"/>',
  task: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 9h16M9 9v11"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  mouse: '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v4"/>',
  keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  wheel: '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7.5v3M10 9l2-2 2 2M10 15l2 2 2-2"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  book: '<path d="M3 5.5A1.5 1.5 0 0 1 4.5 4H10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H3z"/><path d="M21 5.5A1.5 1.5 0 0 0 19.5 4H14a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.5 5.6 3.5 9s-1 6.4-3.5 9c-2.5-2.6-3.5-5.6-3.5-9s1-6.4 3.5-9z"/>',
};
const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
document.querySelectorAll('[data-ico]').forEach((el) => { el.outerHTML = ico(el.dataset.ico, el.className); });

// ------------------------------------------------------------------ randomization parameters
// Set through the Parameters palette (K). '' is the page's own default (the param is left out of the URL); each
// parameter starts at the viewer's default (k.dflt: VIEWER_DEFAULTS, else the page's).
const knobVal = {};
const GROUP_ICON = { Instruction: 'text', 'Start & ending': 'flag', 'Page events': 'bell', Input: 'pointer', 'Evaluation splits': 'fork' };
const onOff = (k) => k.values.length === 2 && k.values[0] === '0' && k.values[1] === '1';
const optLabel = (k, v) => (v === '' ? 'page default' : v === k.train ? 'training mix' : onOff(k) ? (v === '1' ? 'on' : 'off') : v);
const knobOpts = (k) => ['', ...(k.train ? [k.train] : []), ...k.values];
function knobParams() {
  const out = {};
  for (const k of KNOBS) if (knobVal[k.name]) out[k.name] = knobVal[k.name];
  return out;
}
const changedKnobs = () => KNOBS.filter((k) => knobVal[k.name] !== k.dflt);
// For a link: the values that differ from the viewer's defaults ('default' for the page's own).
function hashParams() {
  const out = {};
  for (const k of changedKnobs()) out[k.name] = knobVal[k.name] || 'default';
  return out;
}
const knobBadge = () => { $('pcount').textContent = changedKnobs().length || ''; };
function setKnobs(params) {
  for (const k of KNOBS) {
    const v = params[k.name] === 'default' ? '' : params[k.name] ?? k.dflt;
    if (v && !knobOpts(k).includes(v)) k.values = [...k.values, v];
    knobVal[k.name] = v;
  }
  knobBadge();
}
function setKnob(name, v) {
  knobVal[name] = v;
  knobBadge();
  if (cur) load();
}

function url(d, widget, seed, extra = {}) {
  const p = new URLSearchParams({ task: d.task, site: widget.site, widget: widget.name, seed, stepms: 1000,
    clock: $('clock').value, ...(d.scenario ? { scenario: d.scenario } : {}), ...($('debug').checked ? { debug: 1 } : {}),
    ...knobParams(), ...extra });
  return `play.html?${p}`;
}

const KIND_LABEL = { base: 'base', mock: 'mock-* (eval only)', design: 'design-* designs', other: 'other sites' };
const widgetLabel = (s) => `${s.site}${s.name !== 'design' ? ` / ${s.name}` : ''}`;

// opts: { widget (index), site + name (wins over the index), seed }
function open(i, opts = {}) {
  const d = DATA[i];
  let widgetIdx = Math.min(opts.widget ?? 0, d.widgets.length - 1);
  if (opts.site) {
    const k = d.widgets.findIndex((s) => s.site === opts.site && (!opts.name || s.name === opts.name));
    if (k >= 0) widgetIdx = k;
  }
  cur = { i, widget: widgetIdx, seed: opts.seed ?? 0 };
  $('viewer').classList.add('open');
  document.body.style.overflow = 'hidden';
  $('vtitle').textContent = `${d.task} / ${d.scenario || 'default'}`;
  $('taskinfo').innerHTML = kv([['task', `<code>${esc(d.task)}</code>`], ['scenario', `<code>${esc(d.scenario || 'default')}</code>`],
    ['about', esc(d.description)], ['inputs', esc(d.inputs.join(', '))], ['MiniWoB++', esc(d.miniwob || 'none')],
    ['start modes', esc((d.startModes || ['off', 'solved']).join(', '))], ['widgets', `${d.widgets.length}`]]);
  load();
}

function load() {
  const d = DATA[cur.i];
  const widget = d.widgets[cur.widget];
  const [w, h] = $('vp').value.split('x').map(Number);
  const ifr = $('ifr');
  epoch++;
  stopPlay('');
  resetEpisode();
  ifr.width = w; ifr.height = h;
  $('overlay').setAttribute('viewBox', `0 0 ${w} ${h}`);
  $('overlay').setAttribute('width', w); $('overlay').setAttribute('height', h);
  $('overlay').innerHTML = '';
  ifr.src = url(d, widget, cur.seed);
  $('vurl').textContent = `/${ifr.getAttribute('src')}`;
  // On its own the page has no harness to call stepClock() after each action, so a step clock would never move
  // (timed tasks freeze at 0:00): the standalone page runs on real time.
  $('newtab').href = url(d, widget, cur.seed, { clock: 'real' });
  $('vwidget').textContent = `${widgetLabel(widget)}${widget.split === 'heldout' ? ' (heldout)' : ''}`;
  $('seed').value = cur.seed;
  setGoal(d.instruction);
  setFormat('');
  scoreCard(null, 'loading');
  $('vep').innerHTML = '';
  const kq = new URLSearchParams(hashParams()).toString();
  history.replaceState(null, '', `#${d.task}/${d.scenario || ''}/${widget.site}:${widget.name}/${cur.seed}${kq ? `?${kq}` : ''}`);
  fit();
}

// env.goal() is the instruction plus, in tasks whose ending message is graded, the reply format (kit/runtime/reply.js):
// the title shows the instruction, the Reply format panel the rest, with its line breaks.
function setFormat(text) {
  if ($('fmttext').textContent === text) return;
  $('fmttext').textContent = text;
  $('fmtBtn').hidden = !text;
  if (!text) $('fmtpop').hidden = true;
}
function setGoal(text) {
  const g = $('vinstr');
  if (g.textContent === text) return;
  g.textContent = text;
  g.classList.toggle('long', text.length > 70);
  fit();
}

// The tool rail takes the left edge and the cards the right; the goal and the browser window share the column
// between them, as one block centred between the top pill and the message box, the page at the largest scale that fits.
let goalH = 0;
function fit() {
  if (!cur) return;
  const [w, h] = $('vp').value.split('x').map(Number);
  const W = innerWidth, H = innerHeight;
  const cardW = W >= 1560 ? 320 : 290;
  const colL = W >= 1560 ? 150 : 116, colR = cardW + 40;  // wide: room for the rail's tooltips
  const v = $('viewer').style;
  v.setProperty('--cardW', `${cardW}px`); v.setProperty('--colL', `${colL}px`); v.setProperty('--colR', `${colR}px`);
  const goal = $('vinstr');
  if (!goal.classList.contains('full')) goalH = goal.offsetHeight;
  const cw = W - colL - colR, top = 76, bottom = H - 90, chromeH = 43, gap = 18;
  const s = Math.max(0.2, Math.min(1, (cw - 8) / w, (bottom - top - goalH - gap - chromeH) / h));
  const ww = Math.round(w * s), ph = Math.round(h * s);
  const y = top + Math.max(0, (bottom - top - goalH - gap - chromeH - ph) / 2);
  goal.style.top = `${y}px`;
  const win = $('vwin').style;
  win.left = `${colL + (cw - ww) / 2}px`; win.top = `${y + goalH + gap}px`; win.width = `${ww}px`;
  $('stage').style.height = `${ph}px`;
  const fr = $('frame').style;
  fr.width = `${w}px`; fr.height = `${h}px`; fr.transform = `scale(${s})`;
  $('lrows').style.maxHeight = `${Math.max(120, H - $('score').offsetHeight - 120)}px`;
}
window.addEventListener('resize', () => cur && fit());

const win = () => $('ifr').contentWindow;
function envOf() {
  try { const e = win().__env; return e && e.ready ? e : null; } catch (err) { return undefined; }
}
const isStale = () => { try { return win().document === ep.stale; } catch (err) { return true; } };
const stepped = () => $('clock').value !== 'real';

// ------------------------------------------------------------------ the oracle's next action
// __env.oracle() can advance state (a split drag's held press), so it is asked once per page state: the hint and
// the oracle controls share the answer until the page changes.
let nextCache = null;  // { fp, action }
function fingerprint(env) {
  const sc = env.score();
  const w = win();
  return JSON.stringify([env.model, sc.error, sc.progress, w.scrollX, w.scrollY, env.clockMs, env.done]);
}
function nextAction(env) {
  const fp = fingerprint(env);
  if (nextCache && nextCache.fp === fp) return nextCache.action;
  const action = env.oracle();
  nextCache = { fp, action };
  return action;
}

// ------------------------------------------------------------------ episode log
let ep = null;  // { started, start, prev, ret, n, ended, notice, stale, rows, sel }
function resetEpisode() {
  // stale: the document of the page being replaced, which still answers until the new one loads (a document, not
  // the window: the first navigation keeps the initial about:blank window).
  let stale = null;
  try { stale = win().document; } catch (err) { /* no frame yet */ }
  ep = { started: false, start: 0, prev: 0, ret: 0, n: 0, ended: false, notice: null, stale, rows: [], sel: null };
  human = null; held = null; clearTimeout(settleTimer);
  nextCache = null;
  $('lbody').innerHTML = '';
  showAll = false;
  renderLog();
}
function startEpisode(env) {
  if (ep.started || isStale()) return;
  ep.started = true;
  const s = env.status();
  ep.prev = ep.start = +s.progress || 0;
  attachRecorder(win());
  env.inputFeedback();  // drop anything from the boot
}
const num = (v, d = 3) => (typeof v === 'number' && isFinite(v) ? (Math.round(v * 10 ** d) / 10 ** d).toString() : '–');
const signed = (v) => (typeof v === 'number' ? `<span class="${v > 1e-9 ? 'pos' : v < -1e-9 ? 'neg' : ''}">${v > 0 ? '+' : ''}${num(v)}</span>` : '–');
const kv = (pairs) => pairs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('');

// The score card: a progress ring, the status and the rewards, or a placeholder (`note`) while the page loads.
const RING = 2 * Math.PI * 33;
function ring(p) {
  const c = $('sring');
  c.style.strokeDasharray = `${RING}`;
  c.style.strokeDashoffset = `${RING * (1 - Math.max(0, Math.min(1, p)))}`;
}
function scoreCard(s, note) {
  $('score').className = 'vscore float' + (s && s.done ? (s.success ? ' ok' : ' bad') : '');
  $('sstate').textContent = note || (s.done ? (s.success ? 'Success' : 'Failed') : 'Running');
  $('swhy').textContent = s && s.end_reason ? `ended: ${s.end_reason}` : '';
  if (!s) {
    ring(0);
    for (const id of ['sprog', 'sprog2', 'serr', 'sbin', 'sdense', 'sret', 'stime']) $(id).textContent = '–';
    $('sact').textContent = '0';
    $('stimeWrap').hidden = true;
  }
}

// One row: what the action did to progress and the rewards (tasks.py _step_reward, default weights). Click a row
// for its numbers and notes.
function addRow(who, label, notes = [], warn = '') {
  const env = envOf();
  if (!env || !ep.started || ep.ended || isStale()) return;
  const s = env.status();
  const sc = s.score || env.score();
  const p = +s.progress || 0;
  const dp = p - ep.prev;
  ep.prev = p;
  const r = dp + (s.success ? 1 : 0);
  ep.ret += r;
  ep.n++;
  const fb = env.inputFeedback();
  if (fb) notes.push(`rejected: ${fb}`);
  if (s.notice && s.notice !== ep.notice) { ep.notice = s.notice; notes.push(`user says: ${s.notice}`); }
  if (sc.violations && sc.violations.length) notes.push(`violation: ${sc.violations.join(', ')}`);
  if (s.unsafe) notes.push(`unsafe: ${s.unsafe}`);
  if (s.fault && s.fault.fired) notes.push(`fault ${s.fault.kind} fired`);
  const flagged = notes.length > 0 || !!warn;
  if (s.done) {
    ep.ended = true;
    notes.push(`${s.success ? 'SUCCESS' : 'FAILED'} (${s.end_reason || 'ended'}) · binary ${num(s.reward_binary)} · dense ${num(s.reward_dense)}`);
  }
  const row = { n: ep.n, who, label, notes, warn, dp, p, err: sc.error, tau: sc.tau, r, ret: ep.ret, done: !!s.done };
  ep.rows.push(row);
  const el = document.createElement('div');
  el.className = `lrow ${who}${s.done ? ' end' : ''}`;
  el.title = `${who === 'you' ? 'You' : who === 'oracle' ? 'Oracle' : 'Page'}: ${label}`;
  el.innerHTML = `<span class="n">${row.n}</span><span class="act"><i></i>${esc(label)}${flagged ? '<span class="flag">!</span>' : ''}</span>`
    + `<span class="dp">${signed(dp)}</span><span class="t">t=${num((env.clockMs || 0) / 1000, 1)}s</span>`
    + `<span class="more">${who} · progress ${num(p)} · error ${num(sc.error, 2)} / ${num(sc.tau, 2)} · r ${num(r)} · return ${num(ep.ret)}`
    + notes.map((n) => `<br>${esc(n)}`).join('') + (warn ? `<br><span class="warn">${esc(warn)}</span>` : '') + '</span>';
  $('lbody').appendChild(el);
  renderLog();
  $('sret').textContent = num(ep.ret);
  $('sact').textContent = ep.n;
}

// The log card shows the last 4 actions, or all of them.
let showAll = false;
function renderLog() {
  const els = $('lbody').children;
  const n = els.length;
  for (let k = 0; k < n; k++) els[k].hidden = !showAll && k < n - 4;
  $('lhead').textContent = n === 0 ? 'Actions' : n <= 4 ? `${n === 1 ? '1 action' : `Last ${n} actions`}`
    : showAll ? `All ${n} actions` : 'Last 4 actions';
  $('lall').hidden = n <= 4;
  $('lall').textContent = showAll ? 'Show last 4' : `Show all ${n}`;
  $('lempty').hidden = n > 0;
  $('lrows').scrollTop = $('lrows').scrollHeight;
}
$('lall').onclick = () => { showAll = !showAll; renderLog(); };
$('lbody').addEventListener('click', (e) => { const el = e.target.closest('.lrow'); if (el) el.classList.toggle('open'); });

const pt = (p) => (p ? `(${Math.round(p[0])}, ${Math.round(p[1])})` : '');
function describe(a) {
  const mods = a.modifiers && a.modifiers.length ? ` [${a.modifiers.join('+')}]` : '';
  switch (a.type) {
    case 'drag': return `drag ${pt(a.from)} → ${pt(a.to)}${mods}`;
    case 'path': return `path ${a.points.length} points ${pt(a.points[0])} → ${pt(a.points[a.points.length - 1])}${mods}`;
    case 'type': return `type ${JSON.stringify(a.text)} at ${pt(a.at)}`;
    case 'key': return `key ${a.key}`;
    case 'wheel': return `wheel (${a.dx || 0}, ${a.dy || 0}) at ${pt(a.at)}`;
    case 'move': return `hover ${pt(a.at || (a.points && a.points[0]))}`;
    case 'wait': return 'wait';
    case 'finish': return `send_msg_to_user ${JSON.stringify(a.message || '')}`;
    default: return `${a.type} ${pt(a.at)}${mods}`;
  }
}

// ------------------------------------------------------------------ your actions in the page
// Trusted events only (the oracle's synthetic events are untrusted), grouped into agent-sized actions: a press and
// release is a click (a drag past 4 px), clicks on one spot within 400 ms one double / triple click, a run of
// printable keys one typed text, a wheel burst one wheel action. An action is logged (and the clock stepped) once
// it settled with no button held, so a double click is not split by a clock step.
let human = null;     // the pending action
let held = null;      // the press in progress
let settleTimer = null;
const MODS = new Set(['Control', 'Shift', 'Alt', 'Meta', 'CapsLock']);
function settle(ms) {
  clearTimeout(settleTimer);
  const my = epoch;
  settleTimer = setTimeout(() => { if (my !== epoch) return; if (held) settle(ms); else commitHuman(); }, ms);
}
function humanLabel(h) {
  if (h.kind === 'click') return `${h.button === 2 ? 'rightclick' : ['click', 'dblclick', 'tripleclick'][Math.min(h.n, 3) - 1]} ${pt(h.at)}`;
  if (h.kind === 'drag') return `drag ${pt(h.from)} → ${pt(h.to)}`;
  if (h.kind === 'type') return `type ${JSON.stringify(h.text)}`;
  if (h.kind === 'key') return `key ${h.key}`;
  return `wheel (${Math.round(h.dx)}, ${Math.round(h.dy)}) at ${pt(h.at)}`;
}
function commitHuman() {
  clearTimeout(settleTimer);
  const h = human;
  human = null;
  if (!h) return;
  const env = envOf();
  if (!env) return;
  if (stepped() && $('autostep').checked && !ep.ended) env.stepClock();
  nextCache = null;
  addRow('you', humanLabel(h));
}
function attachRecorder(w) {
  if (!w || w.__galleryRecorder) return;
  w.__galleryRecorder = true;
  const on = (type, fn) => w.addEventListener(type, (e) => { if (e.isTrusted) fn(e); }, true);
  on('pointerdown', (e) => {
    const near = human && human.kind === 'click' && human.button === e.button && performance.now() - human.t < 400
      && Math.hypot(e.clientX - human.at[0], e.clientY - human.at[1]) <= 5;
    if (human && !near) commitHuman();
    held = { from: [e.clientX, e.clientY], to: [e.clientX, e.clientY], button: e.button, moved: false, near };
    clearTimeout(settleTimer);
  });
  on('pointermove', (e) => {
    if (!held) return;
    held.to = [e.clientX, e.clientY];
    if (Math.hypot(e.clientX - held.from[0], e.clientY - held.from[1]) > 4) held.moved = true;
  });
  const release = (x, y) => {
    const h = held;
    if (!h) return;
    held = null;
    h.to = [x, y];
    if (h.moved) { human = { kind: 'drag', from: h.from, to: h.to }; settle(150); return; }
    if (h.near && human) { human.n++; human.t = performance.now(); } else human = { kind: 'click', at: h.from, n: 1, button: h.button, t: performance.now() };
    settle(400);
  };
  on('pointerup', (e) => release(e.clientX, e.clientY));
  on('pointercancel', () => { if (held) held.moved = true; });  // native drag and drop: dragend ends it
  on('dragend', (e) => release(e.clientX, e.clientY));
  on('keydown', (e) => {
    if (MODS.has(e.key)) return;
    const shortcut = e.ctrlKey || e.metaKey || e.altKey;
    if (!shortcut && (e.key.length === 1 || (e.key === 'Backspace' && human && human.kind === 'type'))) {
      if (human && human.kind !== 'type') commitHuman();
      human = human || { kind: 'type', text: '' };
      human.text += e.key === 'Backspace' ? '⌫' : e.key;
      settle(700);
      return;
    }
    if (human) commitHuman();
    const combo = [e.ctrlKey && 'Control', e.altKey && 'Alt', e.shiftKey && e.key.length > 1 && 'Shift', e.metaKey && 'Meta', e.key].filter(Boolean).join('+');
    human = { kind: 'key', key: combo };
    settle(150);
  });
  on('wheel', (e) => {
    if (human && human.kind !== 'wheel') commitHuman();
    human = human || { kind: 'wheel', dx: 0, dy: 0, at: [e.clientX, e.clientY] };
    human.dx += e.deltaX; human.dy += e.deltaY;
    settle(300);
  });
}

// ------------------------------------------------------------------ the oracle in the player
const SPEEDS = { watch: { moveMs: 30, gap: 700 }, normal: { moveMs: 6, gap: 250 }, fast: { moveMs: 0, gap: 0 } };
const STUCK_AFTER = 10;  // driver.STUCK_AFTER
let play = null;         // { epoch, n, cap, last, same, stop } while the oracle plays
let busy = false;        // an oracle action is being sent
let current = null;      // the action being sent (drawn instead of asking the oracle)

function budget(env) {   // driver.budget
  const e = env.episode || {};
  return 40 * (e.drag === 'split' ? 3 : 1) * (e.fault === 'clear' || e.fault === 'revert' ? 2 : 1);
}

// Send the oracle's next action; returns why the oracle cannot go on, or '' when it can.
async function oracleOnce(run) {
  const env = envOf();
  if (!env || isStale()) return 'the page is not ready';
  startEpisode(env);
  if (env.done) return 'the episode is over';
  if (human) commitHuman();
  const action = nextAction(env);
  if (!action) return 'the oracle has no action';
  const my = epoch;
  busy = true;
  current = action;
  drawAction(action);
  let res;
  try {
    res = await MegawobInput.run(win(), action, { moveMs: SPEEDS[$('ospeed').value].moveMs, steps: 8 });
  } catch (err) {
    res = { ok: false, note: String(err) };
  } finally {
    busy = false;
    current = null;
  }
  if (my === epoch && !stepped() && action.type === 'wait') await new Promise((done) => setTimeout(done, 1000));
  if (my !== epoch) return 'reloaded';
  if (stepped() && !env.done) env.stepClock();
  nextCache = null;
  if (run) {
    const key = JSON.stringify(action);
    const fp = fingerprint(env);
    run.same = key === run.last && fp === run.fp ? run.same + 1 : 0;
    run.last = key; run.fp = fp; run.n++;
  }
  addRow('oracle', describe(action), [], res.ok ? res.note : `not sent: ${res.note}`);
  if (!res.ok) return res.note;
  if (run && run.same >= STUCK_AFTER) return `stuck: the same action ${run.same + 1} times without effect (the widget may ignore synthetic events)`;
  if (run && run.n >= run.cap) return `action budget (${run.cap}) spent`;
  return env.done ? 'the episode is over' : '';
}

function stopPlay(why) {
  if (play) play.stop = true;
  play = null;
  setPlayIcon(false);
  toast(why || '');
}

async function startPlay() {
  const env = envOf();
  if (!env) return { stop: 'the page is not ready' };
  if (play) { stopPlay('paused'); return { stop: 'paused' }; }
  const run = play = { epoch, n: 0, cap: budget(env), last: null, fp: null, same: 0, stop: false };
  setPlayIcon(true);
  toast('oracle playing…', true);
  let why = '';
  while (!run.stop) {
    why = await oracleOnce(run);
    if (why || run.stop) break;
    const gap = SPEEDS[$('ospeed').value].gap;
    await new Promise((done) => setTimeout(done, gap));
  }
  if (play === run) stopPlay(why);
  return { stop: run.stop && !why ? 'paused' : why, n: run.n };
}

async function stepOnce() {
  if (play || busy) return;
  const why = await oracleOnce(null);
  toast(why && why !== 'the episode is over' ? why : '');
}

// ------------------------------------------------------------------ the finish route
function sendMessage(infeasible) {
  const env = envOf();
  if (!env) return;
  startEpisode(env);
  if (human) commitHuman();
  const text = $('msg').value;
  env.finish(text, infeasible ? { infeasible: true } : undefined);
  if (stepped()) env.stepClock();
  nextCache = null;
  addRow('you', `${infeasible ? 'report_infeasible' : 'send_msg_to_user'} ${JSON.stringify(text)}`);
}
$('send').onclick = () => sendMessage(false);
$('infeasible').onclick = () => sendMessage(true);
$('msg').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(false); });

// ------------------------------------------------------------------ live status
const fmt = (v) => (typeof v === 'number' ? (Math.round(v * 1000) / 1000).toString() : v ?? '–');
function poll() {
  if (!cur) return;
  const env = envOf();
  if (env === undefined) {
    liveOk = false;
    scoreCard(null, 'No live status');
    $('swhy').textContent = 'needs http: python -m megawob.gallery --serve';
    return;
  }
  liveOk = true;
  if (!env || isStale()) return;
  try {
    startEpisode(env);
    const s = env.status();
    const sc = env.score();
    const goal = env.goal ? env.goal() : env.instruction();
    const instr = env.instruction().replace(/\s+$/, '');
    setGoal(goal.startsWith(instr) ? instr : goal);
    setFormat(goal.startsWith(instr) ? goal.slice(instr.length).trim() : '');
    scoreCard(s);
    const prog = +s.progress || 0;
    ring(prog);
    $('sprog').textContent = $('sprog2').textContent = `${Math.round(prog * 100)}%`;
    const f2 = (v) => (typeof v === 'number' && isFinite(v) ? v.toFixed(2) : '–');
    $('serr').textContent = `${f2(sc.error)} / ${f2(env.tau)}`;
    $('sbin').textContent = fmt(s.reward_binary);
    $('sdense').textContent = fmt(s.reward_dense);
    $('sret').textContent = num(ep.ret);
    $('sact').textContent = ep.n;
    $('stimeWrap').hidden = !env.timed;
    $('stime').textContent = `${fmt(env.clockMs / 1000)} s`;
    // The parameters this episode actually got (after sampling a mix and the task / site fallbacks), for Help.
    const epk = env.state().episode || {};
    const show = (v) => (v === null || v === undefined ? '–' : v === true ? '1' : v === false ? '0' : v);
    const html = kv([['start progress', num(ep.start)], ['clock', esc(show(epk.clock))], ...KNOBS.map((k) => [k.name, esc(show(epk[k.name]))])]);
    if ($('vep').innerHTML !== html) $('vep').innerHTML = html;
    // An ending no action caused (a timeout on the clock): one row for it.
    if (s.done && !ep.ended && !busy && !human && !held) addRow('page', 'episode ended');
    if (!busy) drawAction($('hint').checked && !s.done ? nextAction(env) : null);
  } catch (err) {
    scoreCard(null, 'Error');
    $('swhy').textContent = String(err);
  }
}
setInterval(poll, 250);

function drawAction(a) {
  const svg = $('overlay');
  if (!a) { svg.innerHTML = ''; return; }
  const c = '#ff3d7f';
  const dot = (p, r = 9) => p ? `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="none" stroke="${c}" stroke-width="3"/><circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="${c}"/>` : '';
  const label = (p, t) => p ? `<text x="${p[0] + 13}" y="${p[1] - 11}" fill="${c}" font-family="system-ui, sans-serif" font-size="13" font-weight="700" paint-order="stroke" stroke="#fff" stroke-width="4">${esc(t)}</text>` : '';
  let g = `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker></defs>`;
  if (a.type === 'drag' && a.from && a.to) {
    g += dot(a.from) + `<line x1="${a.from[0]}" y1="${a.from[1]}" x2="${a.to[0]}" y2="${a.to[1]}" stroke="${c}" stroke-width="3" marker-end="url(#ah)"/>` + label(a.from, 'drag');
  } else if (a.type === 'path' && a.points && a.points.length) {
    g += `<polyline points="${a.points.filter(Boolean).map((p) => p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="3" marker-end="url(#ah)"/>` + dot(a.points[0]) + label(a.points[0], 'path');
  } else if (['click', 'dblclick', 'tripleclick', 'rightclick', 'down', 'up', 'wheel'].includes(a.type)) {
    const text = a.type === 'wheel' ? `wheel (${a.dx || 0}, ${a.dy || 0})`
      : `${a.type}${a.modifiers?.length ? ` (${a.modifiers.join('+')})` : ''}`;
    g += dot(a.at) + label(a.at, text);
  } else if (a.type === 'type') {
    g += dot(a.at) + label(a.at, `type "${a.text}"`);
  } else if (a.type === 'move') {
    g += dot(a.at || (a.points && a.points[0]), 14) + label(a.at || (a.points && a.points[0]), 'hover here');
  } else if (a.type === 'key') {
    g += label([12, 24], `press ${a.key}`);
  } else if (a.type === 'wait') {
    g += label([12, 24], 'wait one step');
  } else if (a.type === 'finish') {
    g += label([12, 24], `finish: ${String(a.message || '').slice(0, 80)}`);
  }
  svg.innerHTML = g;
}

// noop: an agent action that does nothing (BrowserGym noop()), so one step of task time passes.
function step() {
  const env = envOf();
  if (!env) return;
  startEpisode(env);
  if (human) commitHuman();
  env.stepClock();
  nextCache = null;
  addRow('you', 'noop (wait one step)');
  poll();
}

function close() {
  epoch++;
  stopPlay('');
  closePops();
  $('viewer').classList.remove('open');
  document.body.style.overflow = '';
  $('ifr').src = 'about:blank';
  cur = null;
  history.replaceState(null, '', location.pathname);
}

function setPlayIcon(playing) {
  $('oplay').innerHTML = ico(playing ? 'pause' : 'play');
  $('oplay').dataset.tip = playing ? 'Oracle: pause (P)' : 'Oracle: play (P)';
}
// The oracle's status over the message box; it fades unless the oracle is playing.
let toastTimer = null;
function toast(text, stay = false) {
  clearTimeout(toastTimer);
  $('ostatus').textContent = text;
  if (text && !stay) toastTimer = setTimeout(() => { $('ostatus').textContent = ''; }, 5000);
}
const prevTask = () => cur && open((cur.i - 1 + DATA.length) % DATA.length);
const nextTask = () => cur && open((cur.i + 1) % DATA.length);
function setSeed(n) { cur.seed = Math.max(0, Math.floor(+n || 0)); load(); }
function toggleHint() {
  $('hint').checked = !$('hint').checked;
  $('hintBtn').classList.toggle('on', $('hint').checked);
  poll();
}

$('back').onclick = close;
$('seed').onchange = () => setSeed($('seed').value);
$('seedPrev').onclick = () => setSeed(cur.seed - 1);
$('seedNext').onclick = () => setSeed(cur.seed + 1);
$('reload').onclick = () => load();
$('reload2').onclick = () => load();
$('hintBtn').onclick = toggleHint;
$('ostep').onclick = stepOnce;
$('oplay').onclick = () => { startPlay(); };
$('vinstr').onclick = () => { $('vinstr').classList.toggle('full'); fit(); };

// ------------------------------------------------------------------ flyout menus of the tool rail
let flyKind = null;
function flyHtml(kind) {
  const tick = (on) => `<span class="tick">${on ? ico('check', 'sm') : ''}</span>`;
  const opt = (id, v, label, sub) => `<button class="opt" data-set="${id}" data-v="${v}">${tick($(id).value === v)}<span>${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ''}</span></button>`;
  const tog = (id, label, sub) => `<button class="opt" data-tog="${id}">${tick($(id).checked)}<span>${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ''}</span></button>`;
  if (kind === 'speed') {
    return '<h4>Oracle speed</h4>' + opt('ospeed', 'watch', 'Watch', 'slow moves, a pause between actions')
      + opt('ospeed', 'normal', 'Normal') + opt('ospeed', 'fast', 'Fast', 'no animation');
  }
  if (kind === 'viewport') {
    return '<h4>Viewport</h4>' + ['1024x640', '1280x720', '1440x900'].map((v) => opt('vp', v, v.replace('x', ' × '))).join('')
      + '<hr>' + tog('debug', 'Debug panel in the page', 'the page draws its score and model');
  }
  return '<h4>Task clock</h4>'
    + opt('clock', 'step', 'Agent steps', 'task time moves one step per action, as in training')
    + opt('clock', 'action', 'Agent steps, frozen animations', 'CSS transitions follow the step clock too')
    + opt('clock', 'real', 'Real time', 'task time follows the wall clock')
    + (stepped() ? '<hr>' + tog('autostep', 'Step the clock after my actions', 'as the harness does after every action')
      + '<button class="opt" data-act="wait"><span class="tick"></span><span>Wait one step<small>noop: one action that does nothing</small></span><kbd>S</kbd></button>' : '');
}
function openFly(kind, btn) {
  const again = flyKind === kind;
  closePops();
  if (again) return;
  flyKind = kind;
  const r = btn.getBoundingClientRect();
  $('fly').innerHTML = flyHtml(kind);
  $('fly').style.top = `${Math.max(12, r.top - 8)}px`;
  $('fly').hidden = false;
  $('scrim').hidden = false;
  btn.classList.add('open');
  $('tools').classList.add('flying');
}
$('tools').addEventListener('click', (e) => { const b = e.target.closest('[data-fly]'); if (b) openFly(b.dataset.fly, b); });
$('fly').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.set) { $(b.dataset.set).value = b.dataset.v; if (b.dataset.set !== 'ospeed') load(); }
  if (b.dataset.tog) { $(b.dataset.tog).checked = !$(b.dataset.tog).checked; if (b.dataset.tog === 'debug') load(); }
  if (b.dataset.act === 'wait') step();
  $('fly').innerHTML = flyHtml(flyKind);
});

// ------------------------------------------------------------------ the command palette
// One palette for parameters (K), jumping to a task, scenario or site (/), and the site / widget. Alt+1..9 picks a row.
let pal = null;  // { mode, items, at }
const PAL = {
  params: ['Parameters', 'Search parameters: popups, startState, heldout…'],
  jump: ['Jump to task', 'Task, scenario, MiniWoB task or site name'],
  widget: ['Site / widget', 'Site name (design-use-email-attachment-05)'],
};
const MOD = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌥' : 'Alt';
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const mark = (text, ws) => (ws.length ? esc(text).replace(new RegExp(`(${ws.map((w) => reEsc(esc(w))).join('|')})`, 'gi'), '<mark>$1</mark>') : esc(text));
function closePops() {
  pal = null; flyKind = null;
  for (const id of ['palette', 'help', 'fly', 'fmtpop', 'scrim']) $(id).hidden = true;
  $('fmtBtn').classList.remove('open');
  $('tools').classList.remove('flying');
  for (const b of $('tools').querySelectorAll('.open')) b.classList.remove('open');
}
function openPalette(mode, q = '') {
  closePops();
  pal = { mode, items: [], at: 0 };
  $('ptitle').textContent = PAL[mode][0];
  $('pq').placeholder = PAL[mode][1];
  $('pq').value = q;
  $('palette').hidden = false;
  $('scrim').hidden = false;
  palSearch();
  $('pq').focus();
}
function palItems(mode, q) {
  const ws = q.toLowerCase().split(/\s+/).filter(Boolean);
  const has = (hay) => ws.every((w) => hay.toLowerCase().includes(w));
  if (mode === 'params') {
    // No query: one row per parameter with its value; a query: one row per matching parameter value.
    if (!ws.length) {
      const changed = changedKnobs();
      return [...(changed.length ? [{ icon: 'restart', title: 'Reset all parameters', sub: `back to the defaults (${changed.map((k) => k.name).join(', ')})`,
        run: () => { setKnobs({}); load(); } }] : []),
        ...KNOBS.map((k) => ({ icon: GROUP_ICON[k.group], group: k.group, title: esc(k.name), sub: k.desc,
          value: optLabel(k, knobVal[k.name] || ''), set: knobVal[k.name] !== k.dflt, keep: true, run: () => { $('pq').value = `${k.name} `; palSearch(); } }))];
    }
    const out = [];
    for (const k of KNOBS) {
      for (const v of knobOpts(k)) {
        const label = optLabel(k, v);
        if (!has(`${k.name} ${label} ${v} ${k.desc} ${k.group}`)) continue;
        out.push({ icon: GROUP_ICON[k.group], title: `${mark(k.name, ws)}: ${mark(label, ws)}`,
          sub: v === k.dflt && v ? `the viewer's default · ${k.desc}` : v === '' ? `the page's default · ${k.desc}`
            : v === k.train ? `the training mix: ${v}` : k.desc,
          cur: (knobVal[k.name] || '') === v, keep: true, refresh: true, run: () => setKnob(k.name, v),
          exact: ws.filter((w) => w === k.name.toLowerCase() || w === label.toLowerCase() || w === v.toLowerCase()).length });
      }
    }
    // Rows that name the parameter or the value outright first ("startState wrong": the value, not the mix with it).
    return out.map((it, i) => [it, i]).sort((x, y) => y[0].exact - x[0].exact || x[1] - y[1]).map(([it]) => it);
  }
  if (mode === 'widget') {
    const d = DATA[cur.i];
    return d.widgets.map((s, k) => ({ s, k })).filter(({ s }) => has(`${widgetLabel(s)} ${s.kind} ${s.split}`)).slice(0, 200).map(({ s, k }) => ({
      icon: 'globe', title: mark(widgetLabel(s), ws), sub: `${KIND_LABEL[s.kind] || s.kind}${s.split === 'heldout' ? ' · held-out' : ''}`,
      cur: k === cur.widget, run: () => { cur.widget = k; load(); } }));
  }
  const out = [];
  DATA.forEach((d, i) => {
    const site = q && d.widgets.find((w) => w.site.toLowerCase() === q.toLowerCase() || (q.length > 6 && w.site.toLowerCase().includes(q.toLowerCase())));
    if (!site && !has([d.task, d.scenario, d.miniwob, d.instruction].join(' '))) return;
    out.push({ icon: site ? 'globe' : 'task', title: mark(`${d.task} / ${d.scenario || 'default'}`, ws), sub: site ? site.site : d.instruction,
      cur: cur && i === cur.i, run: () => open(i, site ? { site: site.site, name: site.name } : {}) });
  });
  return out.slice(0, 80);
}
function palSearch() {
  pal.items = palItems(pal.mode, $('pq').value.trim());
  pal.at = 0;
  drawPal();
}
function drawPal() {
  let g = null;
  $('pres').innerHTML = pal.items.map((it, k) => {
    const head = it.group && it.group !== g ? `<div class="pgroup">${esc((g = it.group))}</div>` : '';
    return `${head}<div class="pres${k === pal.at ? ' on' : ''}" data-k="${k}"><span class="pi">${ico(it.icon)}</span>`
      + `<span class="pb"><div class="pt">${it.title}</div>${it.sub ? `<div class="ps">${esc(it.sub)}</div>` : ''}</span>`
      + (it.value !== undefined ? `<span class="pv${it.set ? ' set' : ''}">${esc(it.value)}</span>` : '')
      + (it.cur ? `<span class="cur" title="current">${ico('check', 'sm')}</span>` : '')
      + (k < 9 ? `<span class="pk">${MOD} ${k + 1}</span>` : '<span class="pk"></span>') + '</div>';
  }).join('') || `<div class="pempty">Nothing matches.</div>`;
  const on = $('pres').querySelector('.pres.on');
  if (on) on.scrollIntoView({ block: 'nearest' });
}
function pick(k) {
  const it = pal && pal.items[k];
  if (!it) return;
  if (!it.keep) closePops();
  it.run();
  if (it.refresh && pal) { palSearch(); pal.at = Math.min(k, pal.items.length - 1); drawPal(); }
  if (pal) $('pq').focus();
}
$('pq').addEventListener('input', palSearch);
$('pq').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { pal.at = Math.min(pal.items.length - 1, pal.at + 1); drawPal(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { pal.at = Math.max(0, pal.at - 1); drawPal(); e.preventDefault(); }
  else if (e.key === 'Enter') pick(pal.at);
  else if (e.altKey && /^Digit[1-9]$/.test(e.code)) { e.preventDefault(); pick(+e.code.slice(5) - 1); }
});
$('pclear').onclick = () => { $('pq').value = ''; palSearch(); $('pq').focus(); };
$('pres').addEventListener('click', (e) => { const r = e.target.closest('.pres'); if (r) { pal.at = +r.dataset.k; pick(pal.at); } });
$('scrim').onclick = closePops;
$('fmtBtn').onclick = () => {
  const show = $('fmtpop').hidden;
  closePops();
  if (show) { $('fmtpop').hidden = false; $('scrim').hidden = false; $('fmtBtn').classList.add('open'); }
};
$('jumpBtn').onclick = () => openPalette('jump');
$('vtitle').onclick = () => openPalette('jump');
$('vwidget').onclick = () => openPalette('widget');
$('paramsBtn').onclick = () => openPalette('params');
$('helpBtn').onclick = () => { closePops(); $('help').hidden = false; $('scrim').hidden = false; };

document.addEventListener('keydown', (e) => {
  if (!cur) {
    if (e.key === '/' && !e.target.matches('input, select, textarea')) { e.preventDefault(); $('q').focus(); }
    return;
  }
  const popup = pal || !$('help').hidden || !$('fly').hidden || !$('fmtpop').hidden;
  if (e.key === 'Escape') {
    if (popup || $('vinstr').classList.contains('full')) { closePops(); $('vinstr').classList.remove('full'); fit(); }
    else if (!e.target.matches('input, select, textarea')) close();
    return;
  }
  if (popup || e.target.matches('input, select, textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (e.key === '/') { e.preventDefault(); openPalette('jump'); }
  else if (e.key === '?') $('helpBtn').click();
  else if (e.key === ']') nextTask();
  else if (e.key === '[') prevTask();
  else if (k === 'k') { e.preventDefault(); openPalette('params'); }
  else if (k === 'r') load();
  else if (k === 's' && stepped()) step();
  else if (k === 'o') stepOnce();
  else if (k === 'p') startPlay();
  else if (k === 'h') toggleHint();
  else if (k === 'l') $('lall').click();
});

let savedTheme = null;
try { savedTheme = localStorage.getItem('megawob-theme'); } catch (err) { /* private mode */ }
applyTheme(savedTheme);
setKnobs({});
renderCats();
renderList();
// Deep link: #task/scenario/site:widget/seed[?knob=value&...] (an older link's widget index works too)
function fromHash() {
  const [path, query] = location.hash.slice(1).split('?');
  const [f, v, s, seed] = decodeURIComponent(path).split('/');
  if (!f) return;
  setKnobs(Object.fromEntries(new URLSearchParams(query || '')));
  const i = DATA.findIndex((d) => d.task === f && (d.scenario || '') === (v || ''));
  if (i < 0) return;
  const [site, name] = (s || '').includes(':') ? s.split(':') : [null, null];
  open(i, { widget: site ? 0 : +s || 0, site, name, seed: +seed || 0 });
}
window.addEventListener('hashchange', fromHash);
fromHash();

// ------------------------------------------------------------------ automation (python -m megawob.gallery --player-check)
window.__gallery = {
  // Open a cell, play it with the oracle from the start, return the outcome.
  async check({ task, scenario, site, widget, seed, timeout = 120000 }) {
    const i = DATA.findIndex((d) => d.task === task && (d.scenario || null) === (scenario || null));
    if (i < 0) return { error: `no gallery entry for ${task}/${scenario}` };
    if (!DATA[i].widgets.some((s) => s.site === site && s.name === widget)) return { error: `widget ${site}/${widget} not listed for ${task}/${scenario}` };
    $('ospeed').value = 'fast';
    $('clock').value = 'step';  // as driver.run_oracle runs it
    open(i, { site, name: widget, seed });
    const t0 = performance.now();
    while (!envOf() || !ep.started) {
      if (performance.now() - t0 > 30000) return { error: 'page did not boot' };
      await new Promise((done) => setTimeout(done, 50));
      if (envOf()) startEpisode(envOf());
    }
    const out = await Promise.race([startPlay(), new Promise((done) => setTimeout(() => done({ stop: 'timeout' }), timeout))]);
    if (out.stop === 'timeout') stopPlay('timeout');
    const s = envOf().status();
    return { success: !!s.success, done: !!s.done, reason: s.end_reason, n: ep.n, stop: out.stop, ret: ep.ret };
  },
};
</script>
</body>
</html>
"""


if __name__ == "__main__":
    main()
