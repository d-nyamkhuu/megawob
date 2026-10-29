"""Checker audit: can a task be passed without doing it? Runs per task x site x widget, on plain episodes
(start off, no overlays, a submit control where the site has one):

    python -m megawob.audit --site base --seeds 6
    python -m megawob.audit --task set-slider --site base --seeds 20

Probes (each seed is a fresh reset):
  noop     end the episode at once (submit, or finish 'Done.')             must never succeed
  random   12 random clicks / drags / wheels inside the stage, then end    success rate; > 10% (and 2+ passes) is flagged
  half     the oracle's first half of its actions, then end                 success with error > tau is flagged
  double   the oracle with every action sent twice                          fragile tasks (informational)
  bid      the oracle with drags done element to element (Playwright drag_to, what BrowserGym's
           drag_and_drop(bid, bid) does): lands on element centres          DOM-track feasibility (informational)
Exit status is 1 when a must-never probe succeeded (noop) or random / half crossed its line.
"""
from __future__ import annotations

import random
import sys
from collections.abc import Callable
from typing import TYPE_CHECKING

from . import catalog, driver
from .driver import MAX_ACTIONS, PLAIN, VIEWPORT, act, oracle_loop

if TYPE_CHECKING:
    from playwright.sync_api import BrowserContext, Page

RANDOM_ACTIONS = 12
RANDOM_LINE = 0.10
RANDOM_MIN = 2  # one random_bad pass in a few seeds is chance, not a shortcut


def end(page: Page) -> dict:
    """End the episode the way an agent would: click the submit control, or say it is done."""
    has_submit = page.evaluate("() => !!__env.submitEl && !__env.done")
    if has_submit:
        page.evaluate("() => __env.submit()")
    elif not page.evaluate("() => __env.done"):
        page.evaluate("() => __env.finish('Done.')")
    return {**page.evaluate("() => __env.score()"), **page.evaluate("() => __env.status()")}


def oracle_actions(page: Page, steps: int, transform: Callable | None = None) -> int:
    """Follow the oracle for at most MAX_ACTIONS of its actions, sending what transform(action) gives instead of
    the action itself (a list of actions or of callables(page, steps)); returns how many actions the oracle gave."""
    def send(page, a):
        for b in transform(a) if transform else [a]:
            if page.evaluate("() => __env.done"):
                break
            b(page, steps) if callable(b) else act(page, b, steps)
    return oracle_loop(page, steps, cap=MAX_ACTIONS, send=send).n


def element_drag(a: dict) -> list:
    """A drag done as BrowserGym's drag_and_drop(bid, bid): element under the start to the element under the end."""
    if a["type"] != "drag":
        return [a]

    def run(page, steps):
        ok = page.evaluate("""([f, t]) => {
          for (const [k, p] of [['data-audit-from', f], ['data-audit-to', t]]) {
            document.querySelectorAll('[' + k + ']').forEach((e) => e.removeAttribute(k));
            const el = document.elementFromPoint(p[0], p[1]);
            if (!el) return false;
            el.setAttribute(k, '1');
          }
          return true; }""", [a["from"], a["to"]])
        if ok:
            try:
                page.locator("[data-audit-from]").first.drag_to(page.locator("[data-audit-to]").first, timeout=2000)
            except Exception:  # noqa: BLE001  (element hidden, detached or moved: the route fails)
                pass
        page.evaluate("() => __env.stepClock()")
    return [run]


def random_actions(page: Page, rng: random.Random, steps: int) -> None:
    """Send up to RANDOM_ACTIONS random clicks, drags and wheel turns inside the stage (until the episode ends)."""
    box = page.evaluate("() => { const r = __env.stage.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; }")
    x0, y0 = max(0, box[0]), max(0, box[1])
    x1, y1 = min(VIEWPORT[0] - 1, box[2]), min(VIEWPORT[1] - 1, box[3])
    if x1 <= x0 or y1 <= y0:
        return
    pt = lambda: [rng.uniform(x0, x1), rng.uniform(y0, y1)]  # noqa: E731
    for _ in range(RANDOM_ACTIONS):
        if page.evaluate("() => __env.done"):
            return
        kind = rng.choice(["click", "click", "drag", "drag", "wheel"])
        if kind == "click":
            a = {"type": "click", "at": pt()}
        elif kind == "drag":
            a = {"type": "drag", "from": pt(), "to": pt()}
        else:
            a = {"type": "wheel", "at": pt(), "dx": 0, "dy": rng.choice([-300, 300])}
        act(page, a, steps)


def audit_widget(context: BrowserContext, widget: catalog.Widget, seeds: int, steps: int) -> dict:
    """Run the no-op, random, half-done, doubled and element-drag probes on one widget; counts per probe."""
    page, errors, scenarios, boot_error = driver.probe_page(context, widget)  # links the random probe clicks must not follow
    tag = f"{widget.task}/{widget.site}/{widget.name}"
    out = {"cell": tag, "noop": 0, "random": 0, "half": 0, "half_bad": 0, "double": 0, "bid": 0, "drags": 0,
           "n": 0, "errors": errors}
    if boot_error:
        out["boot"] = boot_error
        return out
    reset = lambda seed, v: driver.reset(page, seed, v, PLAIN)  # noqa: E731
    for seed in range(seeds):
        v = scenarios[seed % len(scenarios)]
        out["n"] += 1
        try:
            reset(seed, v)
            out["noop"] += end(page)["success"]

            reset(seed, v)
            random_actions(page, random.Random(seed), steps)
            out["random"] += end(page)["success"]

            reset(seed, v)
            n = oracle_actions(page, steps)
            reset(seed, v)
            oracle_loop(page, steps, cap=max(0, n - 1) // 2)  # half the work (the last action is the submit / finish)
            s = end(page)
            out["half"] += s["success"]
            out["half_bad"] += s["success"] and s["error"] > s["tau"] + 1e-9

            reset(seed, v)
            oracle_actions(page, steps, lambda a: [a, a] if a["type"] not in ("finish",) else [a])
            out["double"] += end(page)["success"]

            reset(seed, v)
            drags = []
            oracle_actions(page, steps, lambda a: (drags.append(a["type"] == "drag"), element_drag(a))[1])
            ok = end(page)["success"]
            if any(drags):
                out["drags"] += 1
                out["bid"] += ok
        except Exception as exc:  # noqa: BLE001
            errors.append(f"seed {seed}: {exc}")
    page.close()
    return out


def run_cells(cells: list[catalog.Widget], seeds: int, steps: int) -> list[dict]:
    """audit_skin for each widget of a chunk, in one browser."""
    return driver.run_cells(cells, lambda context, s: audit_widget(context, s, seeds, steps), viewport=VIEWPORT)


def main() -> None:
    """Command line: audit the selected widgets and print one row each; exit 1 when a probe passed that must not."""
    parser = driver.parser(__doc__)
    driver.add_select(parser, site="base")
    parser.add_argument("--seeds", type=int, default=6)
    driver.add_steps(parser)
    driver.add_jobs(parser)
    parser.add_argument("--json", help="also write the results here")
    args = parser.parse_args()
    cells = catalog.widgets(args.task, args.site)
    if not cells:
        sys.exit("no widgets match")
    results = driver.run_pool(run_cells, cells, args.jobs, args.seeds, args.steps)
    results.sort(key=lambda r: r["cell"])

    bad = False
    print(f"{'cell':<44} {'n':>3} {'noop':>5} {'random':>7} {'half':>5} {'double':>7} {'bid':>9}  flags")
    for r in results:
        n = max(1, r["n"])
        flags = []
        if r.get("boot"):
            flags.append(f"boot: {r['boot']}")
        if r["noop"]:
            flags.append("NOOP PASSES")
        random_bad = r["random"] >= RANDOM_MIN and r["random"] / n > RANDOM_LINE
        if random_bad:
            flags.append("RANDOM PASSES")
        if r["half_bad"]:
            flags.append("HALF PASSES OFF TOLERANCE")
        if r["errors"]:
            flags.append(f"{len(r['errors'])} errors: {r['errors'][0][:120]}")
        bad |= bool(r["noop"] or random_bad or r["half_bad"])
        bid = f"{r['bid']}/{r['drags']}" if r["drags"] else "-"
        print(f"{r['cell']:<44} {r['n']:>3} {r['noop']:>5} {r['random'] / n:>7.0%} {r['half'] / n:>5.0%} "
              f"{r['double'] / n:>7.0%} {bid:>9}  {'; '.join(flags)}")
    if args.json:
        driver.write_json(args.json, results)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
