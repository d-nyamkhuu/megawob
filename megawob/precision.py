"""Precision probe: how much pointer precision does a task need? The oracle replays each episode with Gaussian noise
added to every pointer coordinate it sends (click / drag / path / wheel / type points; keys and endings untouched),
the way a VLM policy misses by a few pixels. The oracle stays closed-loop: it re-plans from the page after every
action, so a near miss can be corrected on the next step, as an agent that sees the screen would.

    python -m megawob.precision --site base --seeds 6
    python -m megawob.precision --task set-slider --sigmas 8 16 --seeds 20 --out /tmp/precision

Plain episodes (start off, no overlays, a submit control, atomic drags) at 1280x720. Per task x site x widget:
  clean      the oracle without noise (the control; it must succeed)
  ok@s       success with noise sigma s px (per axis) within the checker's action budget
  tight@s    success within 2x the clean action count + 2 (a policy does not get unlimited retries)
  x@s        mean actions of the noisy runs over the clean ones
  fails      the most common end reasons of failed noisy runs: a process rule the miss broke (violation:*), a
             wrong ending, or 'budget' (still out of tolerance when the action budget ran out)
A widget whose tight success at the smallest sigma is below --line (default 80%) is flagged PRECISE: its tolerance
asks for more precision than a pixel policy has. Exit status is 0; the probe measures, it does not gate.

Logs (--out, default data/precision/<timestamp>/): config.json; records-<pid>.jsonl, one line per widget as it
finishes; results.json, everything with the summaries, at the end. Per seed and sigma: success, actions, end reason
and the final score (error, tau, progress). A failed noisy run also keeps its trace (per action: the oracle's
points, the points sent, the element under each sent point, the score after) and an end screenshot in shots/. The
noise is seeded from widget, seed and sigma, so any run replays exactly.
"""
from __future__ import annotations

import os
import random
import statistics
import sys
import zlib
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import TYPE_CHECKING

from . import catalog, driver
from .driver import VIEWPORT, act, oracle_loop

if TYPE_CHECKING:
    from playwright.sync_api import BrowserContext, Page

PLAIN = {**driver.PLAIN, "instructionNoise": "off", "pageLanguage": "en", "difficulty": "normal", "dragSteps": "atomic",
         "instructionDisplay": "header"}
POINT_KEYS = ("at", "from", "to")
# The element under a viewport point: tag, up to three classes and the start of its text.
HIT = """(p) => {
  const e = p && document.elementFromPoint(p[0], p[1]);
  if (!e) return null;
  const cls = typeof e.className === 'string' ? e.className.trim().split(/\\s+/).filter(Boolean).slice(0, 3) : [];
  const text = (e.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 30);
  return e.tagName.toLowerCase() + cls.map((c) => '.' + c).join('') + (text ? ` "${text}"` : '');
}"""


def jitter(action: dict, sigma: float, rng: random.Random) -> dict:
    """The action with every pointer coordinate moved by N(0, sigma) per axis, clamped to the viewport."""
    if not sigma:
        return action
    def j(p):
        return [min(VIEWPORT[0] - 1, max(0, p[0] + rng.gauss(0, sigma))),
                min(VIEWPORT[1] - 1, max(0, p[1] + rng.gauss(0, sigma)))]
    out = dict(action)
    for k in POINT_KEYS:
        if k in out and out[k] is not None:
            out[k] = j(out[k])
    if out.get("points"):
        out["points"] = [j(p) for p in out["points"]]
    return out


def score(page: Page) -> dict:
    """The page's score and episode status, the fields a failure analysis needs."""
    return page.evaluate("""() => { const s = __env.score(), t = __env.status();
      return { error: s.error, tau: s.tau, progress: s.progress, done: t.done, success: t.success,
               end_reason: t.end_reason || null }; }""")


def points(a: dict) -> list[tuple[str, list]]:
    """[(name, point)] of the action's pointer coordinates."""
    out = [(k, a[k]) for k in POINT_KEYS if a.get(k)]
    if a.get("points"):
        out += [("points[0]", a["points"][0]), ("points[-1]", a["points"][-1])]
    return out


def rounded(p: list) -> list[float]:
    """A point rounded to 0.1 px."""
    return [round(p[0], 1), round(p[1], 1)]


def replay(page: Page, sigma: float, rng: random.Random, steps: int) -> tuple[bool, int, str | None, list[dict]]:
    """Follow the oracle with noisy pointer coordinates until the episode ends. Returns (success, actions, why,
    trace): why is the end reason of a failed run (a violation such as violation:track-click, a wrong ending) or
    'budget'; trace has one entry per action: the oracle's points, the points sent, the element under each sent
    point before the action, and the score after it."""
    trace = []

    def send(page, a):
        b = jitter(a, sigma, rng)
        sent = points(b)
        step = {"type": a["type"], "intended": {k: rounded(p) for k, p in points(a)},
                "sent": {k: rounded(p) for k, p in sent},
                "hit": {k: page.evaluate(HIT, p) for k, p in sent}}
        for k in ("text", "key", "dy", "dx", "message"):
            if a.get(k) is not None:
                step[k] = a[k]
        act(page, b, steps)
        step["after"] = score(page)
        trace.append(step)

    n = oracle_loop(page, steps, send=send).n
    st = score(page)
    why = None if st["success"] else (st.get("end_reason") or "budget")
    return bool(st["success"]), n, why, trace


def probe_widget(context: BrowserContext, widget: catalog.Widget, seeds: int, sigmas: list, steps: int,
               out_dir: Path) -> dict:
    """Replay the oracle on each seed at sigma 0 and every noise level; failed noisy runs keep a trace and screenshot."""
    page, errors, scenarios, boot_error = driver.probe_page(context, widget)  # a noisy click on a link must not leave the page
    tag = f"{widget.task}/{widget.site}/{widget.name}"
    out = {"cell": tag, "task": widget.task, "site": widget.site, "widget": widget.name, "runs": [], "errors": errors}
    if boot_error:
        out["boot"] = boot_error
        return out
    for seed in range(seeds):
        v = scenarios[seed % len(scenarios)]
        run = {"seed": seed, "scenario": v}
        try:
            for sigma in [0, *sigmas]:
                driver.reset(page, seed, v, PLAIN)
                rng = random.Random(zlib.crc32(f"{tag}/{seed}/{sigma}".encode()))
                ok, n, why, trace = replay(page, sigma, rng, steps)
                r = run[str(sigma)] = {"success": ok, "actions": n, "why": why, "final": trace[-1]["after"] if trace else None}
                if sigma and not ok:  # failed noisy runs keep their trace and end screenshot
                    r["trace"] = trace
                    shot = out_dir / "shots" / f"{tag.replace('/', '--')}--{seed}--s{sigma}.png"
                    shot.write_bytes(page.screenshot())
                    r["shot"] = str(shot.relative_to(out_dir))
        except Exception as exc:  # noqa: BLE001
            errors.append(f"seed {seed}: {exc}")
            continue
        out["runs"].append(run)
    page.close()
    return out


def run_cells(cells: list[catalog.Widget], seeds: int, sigmas: list, steps: int, out_dir: Path) -> list[dict]:
    """Probe the cells; each finished widget is appended to records-<pid>.jsonl at once (a crash keeps the rest)."""
    records = out_dir / f"records-{os.getpid()}.jsonl"
    return driver.run_cells(cells, lambda context, s: probe_widget(context, s, seeds, sigmas, steps, out_dir),
                            viewport=VIEWPORT, after=lambda s, r, secs: driver.append_jsonl(records, r))


def summarize(r: dict, sigmas: list) -> dict:
    """Rates over the seeds whose clean run succeeded (a failing clean oracle is a checker problem, not precision)."""
    runs = r["runs"]
    good = [x for x in runs if x["0"]["success"]]
    s = {"n": len(runs), "clean": len(good) / len(runs) if runs else 0.0}
    for sg in sigmas:
        k = str(sg)
        if not good:
            s[f"ok@{k}"] = s[f"tight@{k}"] = s[f"x@{k}"] = None
            continue
        s[f"ok@{k}"] = sum(x[k]["success"] for x in good) / len(good)
        s[f"tight@{k}"] = sum(x[k]["success"] and x[k]["actions"] <= 2 * x["0"]["actions"] + 2 for x in good) / len(good)
        s[f"x@{k}"] = statistics.mean(x[k]["actions"] / max(1, x["0"]["actions"]) for x in good)
    s["why"] = Counter(x[str(g)]["why"] for x in good for g in sigmas if x[str(g)]["why"])
    return s


def pct(x: float | None) -> str:
    """A rate as a right-aligned percentage ('-' for None)."""
    return "    -" if x is None else f"{x:>5.0%}"


def main() -> None:
    """Command line: probe the selected widgets with pointer noise and print the table."""
    parser = driver.parser(__doc__)
    driver.add_select(parser, site="base")
    parser.add_argument("--seeds", type=int, default=6)
    parser.add_argument("--sigmas", type=float, nargs="+", default=[8, 16])
    parser.add_argument("--line", type=float, default=0.8, help="flag widgets whose tight success at the smallest sigma is below this")
    driver.add_steps(parser)
    driver.add_jobs(parser)
    parser.add_argument("--out", type=Path, help="results directory (default data/precision/<timestamp>)")
    args = parser.parse_args()
    sigmas = [int(s) if float(s).is_integer() else s for s in args.sigmas]
    cells = catalog.widgets(args.task, args.site)
    if not cells:
        sys.exit("no widgets match")
    out = args.out or Path("data/precision") / datetime.now().strftime("%Y%m%d-%H%M%S")
    (out / "shots").mkdir(parents=True, exist_ok=True)
    driver.write_json(out / "config.json", {**vars(args), "out": str(out), "sigmas": sigmas, "knobs": PLAIN,
                                            "viewport": VIEWPORT})
    results = sorted(driver.run_pool(run_cells, cells, args.jobs, args.seeds, sigmas, args.steps, out),
                     key=lambda r: r["cell"])

    head = "".join(f" {'ok@' + str(s):>6} {'tight@' + str(s):>8} {'x@' + str(s):>6}" for s in sigmas)
    print(f"{'cell':<52} {'n':>3} {'clean':>5}{head}  flags")
    fam = defaultdict(list)
    flagged = 0
    for r in results:
        s = summarize(r, sigmas)
        r["summary"] = s
        fam[r["task"]].append(s)
        flags = []
        if r.get("boot"):
            flags.append(f"boot: {r['boot']}")
        if r["runs"] and s["clean"] < 1:
            flags.append("CLEAN ORACLE FAILS")
        t = s.get(f"tight@{sigmas[0]}")
        if t is not None and t < args.line:
            flags.append("PRECISE")
            flagged += 1
        if s["why"]:
            flags.append("fails: " + ", ".join(f"{k} {v}" for k, v in s["why"].most_common(2)))
        if r["errors"]:
            flags.append(f"{len(r['errors'])} errors: {r['errors'][0][:100]}")
        cols = "".join(f" {pct(s[f'ok@{g}']):>6} {pct(s[f'tight@{g}']):>8} "
                       f"{'     -' if s[f'x@{g}'] is None else format(s[f'x@{g}'], '>5.1f') + 'x'}" for g in sigmas)
        print(f"{r['cell']:<52} {s['n']:>3} {pct(s['clean'])}{cols}  {'; '.join(flags)}")

    print(f"\nPer task (mean over widgets){'':<24}{head}")
    for f in sorted(fam):
        ss = fam[f]
        cols = ""
        for g in sigmas:
            vals = {k: [x[f"{k}@{g}"] for x in ss if x[f"{k}@{g}"] is not None] for k in ("ok", "tight", "x")}
            m = {k: statistics.mean(v) if v else None for k, v in vals.items()}
            cols += f" {pct(m['ok']):>6} {pct(m['tight']):>8} {'     -' if m['x'] is None else format(m['x'], '>5.1f') + 'x'}"
        print(f"{f:<52} {len(ss):>3} {'':>5}{cols}")
    why = sum((r["summary"]["why"] for r in results if "summary" in r), Counter())
    print(f"\n{flagged} of {len(results)} widgets PRECISE (tight@{sigmas[0]} < {args.line:.0%})")
    if why:
        print("Noisy-run failures by end reason: " + ", ".join(f"{k} {v}" for k, v in why.most_common()))
    driver.write_json(out / "results.json", results)
    print(f"results: {out}")


if __name__ == "__main__":
    main()
