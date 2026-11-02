"""Held-out benchmark: whole episodes on unseen designs, for any OpenAI-compatible vision model.

For every task, the first held-out design-* site (megawob/design_splits.py, sorted) runs --episodes episodes from the
reset (plain episodes at 1280x720, seeds 0, 1, 2, ...). The model gets the goal and a screenshot, replies with one JSON
action per turn and keeps the whole rollout in its conversation (baselines/step_probe.py, --from-start), for up to
--horizon actions. The scripted oracle plays the same episodes to the end as the control (no action budget: it shows
each episode can be solved; its action counts are in results.json). Success is the episode ending in success; nothing
else is scored.

    export OPENAI_API_KEY=...                                    # any value for a local server that ignores it
    python baselines/benchmark.py --model gpt-6-luna             # OpenAI, Responses API (the README run)
    python baselines/benchmark.py --api chat --base-url http://localhost:8000/v1 --model Qwen/Qwen3-VL-8B-Instruct
    python baselines/benchmark.py --api chat --base-url https://openrouter.ai/api/v1 --model <vendor/model>
    python baselines/benchmark.py --tasks set-slider fill-form --episodes 1     # a quick smoke run

--api chat speaks Chat Completions (vLLM, SGLang, Ollama, LM Studio, OpenRouter and most other servers); --api
responses speaks OpenAI's Responses API. The model must accept images.

Output (--out, default data/benchmark/<model>-<timestamp>/; rerun with the same --out to resume, finished widgets
are skipped): config.json, records-*.jsonl (one line per episode: every reply, action, score and screenshot path, as
step_probe writes them), shots/, and results.json: per task the site, episodes, model and oracle successes and action
counts, plus totals (the format of docs/results/baseline-heldout.json). The summary table groups tasks as the
README's Tasks table does.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import step_probe  # noqa: E402

from megawob import catalog, driver  # noqa: E402
from megawob.precision import PLAIN  # noqa: E402

# The README's Tasks table, in its order.
GROUPS = {
    "Precise mouse control": ["set-slider", "resize-element", "crop-image", "pick-color", "rotate-object", "draw-shape",
                              "select-text", "reorder-items", "sort-into-bins", "align-layout", "click-point", "pan-map"],
    "Forms": ["type-text", "choose-option", "set-date", "fill-form", "complete-wizard", "complete-goals",
              "change-settings", "transfer-items"],
    "Clicking, reading, reasoning": ["click-control", "read-figure", "find-fact", "solve-puzzle", "handle-text",
                                     "act-in-time", "recall-info", "scroll-page"],
    "Apps": ["use-email", "use-shop", "use-social-feed", "use-desktop-tools", "use-admin-console", "use-bank",
             "use-site-builder", "use-calendar", "use-chat", "use-dev-tools", "use-dispatch", "use-health-records",
             "use-accounting", "use-workflow-editor", "use-form-builder", "use-gov-portal", "use-smart-home", "use-hr",
             "use-legacy-app", "use-course-admin", "use-project-board", "use-spreadsheet", "use-slides", "use-travel",
             "use-data-grid", "use-file-manager", "use-text-editor"],
    "Safety": ["avoid-phishing", "resist-injection", "protect-privacy", "avoid-dark-patterns"],
}


def heldout_widgets(tasks: list[str] | None) -> list:
    """The first held-out design-* widget of each task (sorted by site name)."""
    out = []
    for task in tasks or catalog.tasks():
        ws = sorted((w for w in catalog.widgets(task) if w.split == "heldout" and w.site.startswith("design-")),
                    key=lambda w: (w.site, w.name))
        if not ws:
            print(f"no held-out design for {task}; skipped", file=sys.stderr)
            continue
        out.append(ws[0])
    return out


def load_records(out: Path) -> list[dict]:
    recs = []
    for path in sorted(out.glob("records-*.jsonl")):
        recs += [json.loads(line) for line in path.read_text().splitlines() if line.strip()]
    return recs


def results(records: list[dict], args: argparse.Namespace) -> dict:
    """Per task: episodes run (model rollouts), model and oracle successes and action counts; then totals."""
    tasks: dict[str, dict] = {}
    for r in records:
        if "outcome" not in r:
            continue
        t = tasks.setdefault(r["task"], {"site": r["site"], "episodes": 0, "model_success": 0, "oracle_success": 0,
                                         "oracle_actions": [], "model_actions": []})
        t["episodes"] += 1
        t["model_success"] += r["h_outcome"] == "success"
        t["oracle_success"] += r["oracle_h_outcome"] == "success"
        t["oracle_actions"].append(len(r["oracle_steps"]))
        t["model_actions"].append(r["calls"])
    total = {k: sum(t[k] for t in tasks.values()) for k in ("episodes", "model_success", "oracle_success")}
    problems = [{k: r.get(k) for k in ("task", "site", "seed", "skip", "error", "boot")}
                for r in records if "outcome" not in r and ("skip" in r or "error" in r or "boot" in r)]
    return {"model": args.model, "api": args.api, "base_url": args.base_url,
            "harness": f"baselines/benchmark.py --horizon {args.horizon} --episodes {args.episodes}",
            "split": "the first held-out design-* site per task (megawob/design_splits.py)",
            "tasks": dict(sorted(tasks.items())), "total": total, "not_run": problems}


def table(res: dict) -> str:
    """The README results table: success by task group."""
    tasks = res["tasks"]
    lines = ["| Task group | Tasks | Episodes | Model success | Oracle success |", "|---|---:|---:|---:|---:|"]
    rows = [(g, [t for t in ts if t in tasks]) for g, ts in GROUPS.items()]
    rows.append(("All tasks", list(tasks)))
    for name, ts in rows:
        e = sum(tasks[t]["episodes"] for t in ts)
        if not e:
            continue
        m = sum(tasks[t]["model_success"] for t in ts) / e
        o = sum(tasks[t]["oracle_success"] for t in ts) / e
        b = "**" if name == "All tasks" else ""
        lines.append(" | ".join(["", *(f"{b}{v}{b}" for v in (name, len(ts), e, f"{m:.0%}", f"{o:.0%}")), ""]).strip())
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--model", required=True)
    parser.add_argument("--api", choices=["chat", "responses"], default="responses",
                        help="chat: Chat Completions (most servers); responses: OpenAI's Responses API")
    parser.add_argument("--base-url", default=os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1"))
    parser.add_argument("--effort", help="reasoning effort, for models that take one (default: the model's)")
    parser.add_argument("--tasks", nargs="+", help="only these tasks (default: all)")
    parser.add_argument("--episodes", type=int, default=3, help="episodes per task (seeds 0..N-1)")
    parser.add_argument("--horizon", type=int, default=30, help="action budget per episode for the model")
    parser.add_argument("--images", type=int, default=0,
                        help="screenshots kept in the conversation (0: all; N: the last N)")
    parser.add_argument("--workers", type=int, default=2, help="episodes in parallel (one browser each)")
    parser.add_argument("--timeout", type=float, default=180, help="seconds per model call")
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    unknown = sorted(set(args.tasks or []) - set(catalog.tasks()))
    if unknown:
        sys.exit(f"unknown tasks: {', '.join(unknown)}")

    out = args.out or Path("data/benchmark") / (re.sub(r"[^\w.-]+", "_", args.model) + "-"
                                                 + datetime.now().strftime("%Y%m%d-%H%M%S"))
    (out / "shots").mkdir(parents=True, exist_ok=True)
    widgets = heldout_widgets(args.tasks)
    done = {r["cell"] for r in load_records(out)}
    todo = [w for w in widgets if f"{w.task}/{w.site}/{w.name}" not in done]
    driver.write_json(out / "config.json", {**{k: (str(v) if isinstance(v, Path) else v) for k, v in vars(args).items()},
                                            "out": str(out), "knobs": PLAIN,
                                            "widgets": [f"{w.task}/{w.site}/{w.name}" for w in widgets]})
    print(f"{len(widgets)} tasks, {len(widgets) - len(todo)} already done; running {len(todo)} -> {out}", flush=True)
    if todo:
        # step_probe's whole-episode mode: no oracle prefix, --horizon model actions, the oracle as the control.
        probe = argparse.Namespace(model=args.model, api=args.api, base_url=args.base_url, effort=args.effort,
                                   timeout=args.timeout, states=args.episodes, steps=8,
                                   no_history=False, from_start=True, horizon=args.horizon, images=args.images)
        driver.run_pool(step_probe.run_cells, todo, args.workers, probe, PLAIN, out)
    res = results(load_records(out), args)
    driver.write_json(out / "results.json", res)
    t = res["total"]
    print("\n" + table(res))
    if t["episodes"]:
        print(f"\nmodel {t['model_success']}/{t['episodes']} ({t['model_success'] / t['episodes']:.0%}), "
              f"oracle {t['oracle_success']}/{t['episodes']}; not run: {len(res['not_run'])}; {out / 'results.json'}")


if __name__ == "__main__":
    main()
