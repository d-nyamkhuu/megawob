"""Golden snapshots of episodes, to check that a kit change leaves episodes unchanged.

    python -m megawob.golden capture /tmp/golden/before            # node layer (every widget) + browser layer
    ... change the kit ...
    python -m megawob.golden capture /tmp/golden/after
    python -m megawob.golden compare /tmp/golden/before /tmp/golden/after [--ignore '*.flags']
    python -m megawob.golden capture DIR --tasks set-slider reorder-items   # only the widgets of these tasks, both layers

Two layers, written to <dir>/node.jsonl.gz and <dir>/browser.jsonl.gz:

  node     every widget of every site (test sites included), booted in Node with a stub DOM
           (tests/kit/snapshot.mjs): for each run, the randomization parameters as drawn, spec, model, instruction, inputs,
           the start score and the task's first plan step. About a minute for all ~1,450 widgets; needs `node`.
  browser  the widgets of --browser-sites (default: base, trait-tests and the mock-* sites) in Chromium at one
           viewport: the same per-run record taken from the page, then the oracle trajectory (every action, and
           the score after it) and the final status, plus start and end screenshots (lossless WebP under
           <dir>/shots/; compare treats up to 500 changed pixels by up to 16 levels as rasterization noise).

Runs per widget follow megawob/check.py: --seeds seeds with the checker's knob mix and --seeds more with every knob
weighted (FULL_MIX, so the order of the shared knob stream is covered), one run per scenario, then the
checker's knob sweep (including startState=scene and judge modes where the task lists them), so the judge, level,
split-drag, overlay, lang and route paths are all exercised. Capture the baseline before a change, with the
same arguments as the capture after it. compare exits 1 when anything differs and prints each difference as a
path in the record (spec.items[2].x, traj[4].score.error, shots.end, ...); --ignore takes fnmatch patterns over
those paths for differences a change intends (a removed field). Nothing is committed: keep snapshot directories
outside the repository or under an ignored path.
"""
from __future__ import annotations

import fnmatch
import gzip
import hashlib
import io
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import TYPE_CHECKING, Any

from . import catalog, check, driver

if TYPE_CHECKING:
    from playwright.sync_api import BrowserContext, Page

ROOT = Path(__file__).resolve().parent.parent
SNAPSHOT_JS = ROOT / "tests" / "kit" / "snapshot.mjs"
DEFAULT_BROWSER_SITES = ["base", "trait-tests", "mock-*"]


# Added to the checker's mix for the "full" runs: every knob draws, so a change to the order of the shared
# knobs/<task> stream (route, compose and stray draw nothing under the checker's mix or the training defaults)
# shows up as a difference.
FULL_MIX = {"inputRoute": "pointer:.4,keyboard:.3,wheel:.3", "composition": "train:.5,heldout:.5", "undeclaredInput": "reject:.5,void:.5",
            "judgment": "off:.4,ambiguous:.2,impossible:.2,confirm:.2", "stepms": "500:.3,1000:.7"}


def _knob_config(seeds: int) -> dict:
    return {"seeds": seeds, "knobMix": check.KNOB_MIX, "fullMix": {**check.KNOB_MIX, **FULL_MIX}, "sweep": check.SWEEP,
            "scene": {"startState": "scene"}, "judge": check.JUDGE_SWEEP}


def _cells(patterns: list[str] | None, tasks: list[str] | None = None) -> list[catalog.Widget]:
    out = []
    for s in catalog.widgets(include_test=True):
        if tasks and s.task not in tasks:  # a composite widget counts for the task it is registered under
            continue
        if patterns is None or any(fnmatch.fnmatchcase(s.site, p) for p in patterns):
            out.append(s)
    return sorted(out, key=lambda s: (s.site, s.task, s.name))


def _cell(s: catalog.Widget) -> str:
    return f"{s.task}/{s.site}/{s.name}"


def runs_for(page_info: dict, seeds: int, knobs: dict) -> list[tuple[int, str | None, dict]]:
    """The run list of one widget: the same seeds and knob settings as tests/kit/snapshot.mjs."""
    scenarios, vs = page_info["scenarios"], page_info["scenarios"] or [None]
    runs = [(s, None, knobs["knobMix"]) for s in range(seeds)]
    runs += [(500 + s, None, knobs["fullMix"]) for s in range(seeds)]
    runs += [(1000 + i, v, knobs["knobMix"]) for i, v in enumerate(scenarios)]
    sweep = list(knobs["sweep"])
    if "scene" in (page_info["startModes"] or []):
        sweep += [knobs["scene"]] * 2
    for m in page_info["judgeModes"] or []:
        if m in knobs["judge"]:
            sweep += [knobs["judge"][m]] * 2
    runs += [(2000 + i, vs[i % len(vs)], sweep[i % len(sweep)]) for i in range(max(len(sweep), 2 * len(vs)))]
    return runs


def run_key(seed: int, scenario: str | None, knob_set: dict, knobs: dict) -> str:
    """The run's name in a snapshot: seed, scenario and which knob set it used."""
    # The same key format as snapshot.mjs (JSON.stringify: no spaces).
    k = ("mix" if knob_set is knobs["knobMix"] else "full" if knob_set is knobs["fullMix"]
         else json.dumps(knob_set, separators=(",", ":")))
    return f"{seed}{' ' + scenario if scenario else ''} {k}"


# ---------------------------------------------------------------- node layer

def capture_node(out: Path, cells: list[catalog.Widget], seeds: int, jobs: int) -> None:
    """Write <out>/node.jsonl.gz: the node layer's records of `cells`, split over `jobs` Node processes."""
    if not shutil.which("node"):
        raise SystemExit("node not found: the node layer needs Node.js (or pass --no-node)")
    knobs = _knob_config(seeds)
    jobs = max(1, min(jobs, len(cells)))
    with tempfile.TemporaryDirectory() as tmp:
        procs, parts = [], []
        for j in range(jobs):
            part = Path(tmp) / f"part{j}.jsonl.gz"
            cfg = Path(tmp) / f"cfg{j}.json"
            driver.write_json(cfg, {**knobs, "out": str(part),
                                    "cells": [[s.task, s.site, s.name] for s in cells[j::jobs]]}, indent=None)
            procs.append(subprocess.Popen(["node", str(SNAPSHOT_JS), str(cfg)], cwd=ROOT))
            parts.append(part)
        if any(p.wait() for p in procs):
            raise SystemExit("node snapshot failed")
        # Concatenated gzip members are one valid gzip stream; order the lines by cell for stable files.
        lines = []
        for part in parts:
            with gzip.open(part, "rt", encoding="utf-8") as f:
                lines += f.readlines()
    lines.sort(key=lambda line: json.loads(line)["cell"])
    with gzip.open(out / "node.jsonl.gz", "wt", encoding="utf-8") as f:
        f.writelines(lines)


def _pixel_diff(fa: Path, fb: Path) -> tuple[int, int, tuple] | None:
    """(pixels that differ, largest channel difference, bounding box), or None when a file is missing or the sizes
    differ."""
    from PIL import Image, ImageChops
    if not (fa.exists() and fb.exists()):
        return None
    a, b = Image.open(fa).convert("RGB"), Image.open(fb).convert("RGB")
    if a.size != b.size:
        return None
    d = ImageChops.difference(a, b).convert("L")
    hist = d.histogram()
    top = max((v for v, n in enumerate(hist) if n), default=0)
    return a.size[0] * a.size[1] - hist[0], top, d.getbbox()


# ---------------------------------------------------------------- browser layer

SNAP = """async () => { await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 50))));
  const st = __env.state();
  return { scenario: st.scenario, episode: st.episode, spec: st.spec, model: st.model, instruction: __env.instruction(),
           inputs: __env.inputs() }; }"""
SCORE = """() => { const s = __env.score(); return { error: s.error, tau: s.tau, base: s.base, gate: s.gate,
  progress: s.progress, success: s.success, violations: s.violations }; }"""


# Before a screenshot: let finite CSS animations and transitions finish (a drop highlight fading out), at most 2 s,
# so the frame does not depend on how long the last action took. Infinite ones (spinners) are left running.
SETTLE = """async () => {
  const finite = document.getAnimations().filter((a) => a.playState === 'running'
    && Number.isFinite(a.effect && a.effect.getComputedTiming().endTime));
  await Promise.race([Promise.all(finite.map((a) => a.finished.catch(() => null))), new Promise((r) => setTimeout(r, 2000))]);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }"""


def _shot(page: Page, path: Path) -> str:
    """Save a lossless screenshot of the page; returns the file's name."""
    from PIL import Image
    page.evaluate(SETTLE)
    png = page.screenshot()
    buf = io.BytesIO()
    Image.open(io.BytesIO(png)).convert("RGB").save(buf, "WEBP", lossless=True, quality=50, method=1)
    data = buf.getvalue()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return hashlib.sha256(Image.open(io.BytesIO(data)).tobytes()).hexdigest()


def golden_widget(context: BrowserContext, widget: catalog.Widget, seeds: int, knobs: dict, steps: int,
                shots: Path | None) -> dict:
    """The browser-layer record of one widget: per run the episode, the oracle trajectory, the end status and screenshots."""
    page, errors = driver.new_page(context)
    cell = _cell(widget)
    try:
        driver.boot(page, widget, 0)
    except Exception as exc:  # noqa: BLE001
        page.close()
        return {"cell": cell, "error": f"boot: {exc}"}
    driver.pin_text(page)
    info = page.evaluate("""() => { const f = __env.taskDef, s = __env.widgetDef;
      return { scenarios: (s.scenarios || f.scenarios || []).filter((v) => !f.scenarios || f.scenarios.includes(v)),
               startModes: f.startModes || null, judgeModes: f.judgeModes || null }; }""")
    runs = []
    for i, (seed, scenario, knob_set) in enumerate(runs_for(info, seeds, knobs)):
        key = run_key(seed, scenario, knob_set, knobs)
        rec = {"key": key}
        try:
            rec["start"] = driver.reset(page, seed, scenario, knob_set)
            rec.update(page.evaluate(SNAP))
            # Screenshots for the seed and scenario runs; the sweep runs record state and trajectory only.
            shoot = shots is not None and knob_set is knobs["knobMix"]
            slug = cell.replace("/", "--")
            if shoot:
                rec["shots"] = {"start": _shot(page, shots / slug / f"{i:03d}-start.webp")}
            traj = []

            def send(page, action):
                driver.act(page, action, steps)
                traj.append({"action": action, "score": page.evaluate(SCORE)})
            # Repeated coordinates can still make progress (quantity buttons, scrolling, timed waits).
            # Capture the complete trajectory; the normal action budget already bounds genuine stalls.
            driver.oracle_loop(page, steps, send=send)
            rec["traj"] = traj
            rec["end"] = page.evaluate("() => { const s = __env.status(); return { done: s.done, end_reason: s.end_reason, "
                                       "success: s.success, reward_binary: s.reward_binary, reward_dense: s.reward_dense, "
                                       "progress: s.progress, rejected: s.rejected, score: s.score }; }")
            if shoot:
                rec["shots"]["end"] = _shot(page, shots / slug / f"{i:03d}-end.webp")
        except Exception as exc:  # noqa: BLE001
            rec["error"] = str(exc).splitlines()[0][:500]
        runs.append(rec)
    page.close()
    out = {"cell": cell, "runs": runs}
    if errors:
        out["page_errors"] = errors
    return out


def _browser_cells(work: list[catalog.Widget], opts: tuple) -> list[dict]:
    """golden_skin for each widget of a chunk (opts: seeds, knobs, steps, shots dir, viewport)."""
    seeds, knobs, steps, shots, viewport = opts
    w, h, _ = driver.size(viewport)
    with driver.browser(raster=True) as browser:
        context = driver.new_context(browser, (w, h))
        return [golden_widget(context, widget, seeds, knobs, steps, shots) for widget in work]


def capture_browser(out: Path, cells: list[catalog.Widget], seeds: int, jobs: int, steps: int, viewport: str,
                    shots: bool) -> None:
    """Write <out>/browser.jsonl.gz: the browser layer's records of `cells` at one viewport."""
    knobs = _knob_config(seeds)
    shots_dir = out / "shots" if shots else None
    results = driver.run_pool(_browser_cells, cells, jobs, (seeds, knobs, steps, shots_dir, viewport))
    results.sort(key=lambda r: r["cell"])
    with gzip.open(out / "browser.jsonl.gz", "wt", encoding="utf-8") as f:
        for r in results:
            f.write(json.dumps(r) + "\n")


# ---------------------------------------------------------------- compare

def _load(path: Path) -> dict[str, dict]:
    if not path.exists():
        return {}
    with gzip.open(path, "rt", encoding="utf-8") as f:
        return {(r := json.loads(line))["cell"]: r for line in f}


def _diff(a: Any, b: Any, path: str, out: list, limit: int = 50) -> None:
    """Append the differences between two records as 'path: a -> b' lines to out (at most `limit`)."""
    if len(out) >= limit or a == b:
        return
    if isinstance(a, dict) and isinstance(b, dict):
        for k in list(a) + [k for k in b if k not in a]:
            _diff(a.get(k, "<missing>"), b.get(k, "<missing>"), f"{path}.{k}" if path else str(k), out, limit)
    elif isinstance(a, list) and isinstance(b, list):
        for i in range(max(len(a), len(b))):
            _diff(a[i] if i < len(a) else "<missing>", b[i] if i < len(b) else "<missing>", f"{path}[{i}]", out, limit)
    else:
        out.append((path, a, b))


def _short(v: Any) -> str:
    """A value as short JSON for a difference line."""
    s = json.dumps(v, ensure_ascii=False)
    return s if len(s) <= 120 else s[:117] + "..."


def compare(base: Path, new: Path, ignore: list[str], show: int, noise: tuple[int, int] = (500, 16)) -> int:
    """Print the differences between two snapshot directories; returns the process exit status (1 if any)."""
    total = 0
    noisy = 0
    for layer in ("node", "browser"):
        a, b = _load(base / f"{layer}.jsonl.gz"), _load(new / f"{layer}.jsonl.gz")
        if not a and not b:
            continue
        if not a or not b:
            print(f"{layer}: only in {'new' if b else 'base'}; skipped")
            continue
        changed = []
        for cell in sorted(set(a) | set(b)):
            if cell not in a or cell not in b:
                changed.append((cell, [("cell", "<missing>" if cell not in a else "present",
                                        "<missing>" if cell not in b else "present")]))
                continue
            ra, rb = a[cell], b[cell]
            diffs = []
            if "error" in ra or "error" in rb:
                _diff(ra.get("error"), rb.get("error"), "error", diffs)
            runs_a = {r["key"]: r for r in ra.get("runs", [])}
            runs_b = {r["key"]: r for r in rb.get("runs", [])}
            for key in list(runs_a) + [k for k in runs_b if k not in runs_a]:
                x, y = runs_a.get(key, {}), runs_b.get(key, {})
                d = []
                _diff({k: v for k, v in x.items() if k != "shots"}, {k: v for k, v in y.items() if k != "shots"}, "", d)
                for which in sorted(set(x.get("shots", {})) | set(y.get("shots", {}))):
                    sa, sb = x.get("shots", {}).get(which), y.get("shots", {}).get(which)
                    if sa == sb:
                        continue
                    i = list(runs_a).index(key) if key in runs_a else -1
                    slug = cell.replace("/", "--")
                    fa, fb = base / "shots" / slug / f"{i:03d}-{which}.webp", new / "shots" / slug / f"{i:03d}-{which}.webp"
                    px = _pixel_diff(fa, fb) if sa and sb else None
                    # Rasterization noise (antialiased edges, a canvas stroke from coalesced pointer moves): a few
                    # hundred pixels by a few levels. A visual change moves thousands of pixels by much more.
                    if px and px[0] <= noise[0] and px[1] <= noise[1]:
                        noisy += 1
                        continue
                    d.append((f"shots.{which}", f"{slug}/{i:03d}-{which}.webp",
                              f"{px[0]} px differ (max {px[1]}, box {px[2]})" if px else "missing or resized"))
                d = [x for x in d if not any(fnmatch.fnmatchcase(x[0], p) for p in ignore)]
                diffs += [(f"[{key}] {p}", va, vb) for p, va, vb in d]
            if "page_errors" in ra or "page_errors" in rb:
                d = []
                _diff(ra.get("page_errors"), rb.get("page_errors"), "page_errors", d)
                diffs += d
            if diffs:
                changed.append((cell, diffs))
        print(f"{layer}: {len(set(a) | set(b))} widgets, {len(changed)} differ")
        if noisy:
            print(f"  {noisy} screenshots differ only by noise (<= {noise[0]} px, max delta <= {noise[1]})")
            noisy = 0
        for cell, diffs in changed[:show]:
            print(f"  {cell}: {len(diffs)} differences")
            for p, va, vb in diffs[:8]:
                print(f"    {p}: {_short(va)} -> {_short(vb)}")
        if len(changed) > show:
            print(f"  ... {len(changed) - show} more widgets differ")
        total += len(changed)
    if total:
        print(f"{total} widgets differ")
        return 1
    print("no differences")
    return 0


def main() -> None:
    """Command line: capture snapshots or compare two."""
    parser = driver.parser(__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)
    cap = sub.add_parser("capture", help="write a snapshot directory")
    cap.add_argument("out", type=Path)
    cap.add_argument("--sites", nargs="+", help="node layer: site patterns (fnmatch; default every site)")
    cap.add_argument("--browser-sites", nargs="+", default=DEFAULT_BROWSER_SITES,
                     help="browser layer: site patterns (default: base trait-tests 'mock-*')")
    cap.add_argument("--tasks", nargs="+", metavar="F",
                     help="both layers: only the widgets of these tasks (default every task); compare a filtered "
                          "capture with another capture filtered the same way")
    cap.add_argument("--seeds", type=int, default=4, help="parameter-mix seeds per widget (node layer)")
    cap.add_argument("--browser-seeds", type=int, default=2, help="parameter-mix seeds per widget (browser layer)")
    cap.add_argument("--viewport", default="1280x720")
    driver.add_steps(cap)
    driver.add_jobs(cap)
    cap.add_argument("--no-node", action="store_true")
    cap.add_argument("--no-browser", action="store_true")
    cap.add_argument("--no-shots", action="store_true", help="browser layer without screenshots")
    cmp = sub.add_parser("compare", help="compare two snapshot directories; exit 1 on any difference")
    cmp.add_argument("base", type=Path)
    cmp.add_argument("new", type=Path)
    cmp.add_argument("--ignore", nargs="+", default=[], help="fnmatch patterns over difference paths")
    cmp.add_argument("--show", type=int, default=20, help="widgets to list per layer")
    cmp.add_argument("--noise", type=int, nargs=2, default=[500, 16], metavar=("PX", "DELTA"),
                     help="screenshots differing in at most PX pixels by at most DELTA count as equal (0 0: exact)")
    args = parser.parse_args()

    if args.cmd == "compare":
        sys.exit(compare(args.base, args.new, args.ignore, args.show, tuple(args.noise)))
    args.out.mkdir(parents=True, exist_ok=True)
    if not args.no_node:
        cells = _cells(args.sites, args.tasks)
        print(f"node layer: {len(cells)} widgets")
        capture_node(args.out, cells, args.seeds, args.jobs)
    if not args.no_browser:
        cells = _cells(args.browser_sites, args.tasks)
        print(f"browser layer: {len(cells)} widgets at {args.viewport}")
        capture_browser(args.out, cells, args.browser_seeds, args.jobs, args.steps, args.viewport, not args.no_shots)
    driver.write_json(args.out / "meta.json", vars(args))
    print(f"wrote {args.out}")


if __name__ == "__main__":
    main()
