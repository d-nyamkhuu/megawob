"""Index of the scenarios each widget supports and the traits of each task (html/scenarios.json), read by catalog.

    python -m megawob.scenarios              # boot every widget once and rewrite html/scenarios.json
    python -m megawob.scenarios --check      # exit 1 if the index differs from what the pages register
    python -m megawob.scenarios --site 'design-set-slider-*'   # refresh some sites only (glob, repeatable)
    python -m megawob.scenarios --site base --task use-spreadsheet   # some tasks only (repeatable)

The page is the source of truth: a widget supports its `scenarios` (all of its task's when it lists none),
intersected with the task's. Python cannot read that without a browser, so this index records it, together
with each task's scenarios and the ones it holds out (task `heldoutScenarios`, which training never forces)
and the traits that decide which task names exist: startModes, judgeModes, the round-2 hooks (facts, silent,
retarget, answered; nofaults for `faults: false`) and whether plan() drags. Run it after adding a site or a task
or changing a widget's scenarios or a task's traits; `megawob.check` fails a widget whose entry is stale, and
catalog.pick() never forces a scenario on a widget that is not indexed.
"""
from __future__ import annotations

import fcntl
import fnmatch
import json
import re
import sys

from . import catalog, driver

# What a page says about a widget and its task (task_entry() turns it into the task's index entry).
READ = """() => {
  const f = __env.taskDef, s = __env.widgetDef, fv = f.scenarios || [];
  const hooks = ['facts', 'silent', 'retarget', 'answered'].filter((h) => typeof f[h] === 'function');
  if (f.faults === false) hooks.push('nofaults');
  return { task: fv, heldout: f.heldoutScenarios || [],
           widget: (s.scenarios || fv).filter((v) => !fv.length || fv.includes(v)),
           startModes: f.startModes || ['off', 'solved'], judgeModes: f.judgeModes || [], hooks };
}"""


def source_drags(task: str) -> bool:
    """True when the task's plan() has drag or path steps, so dragSteps=split changes something. Only the source says
    so (the oracle's actions depend on the seed), so this is read from the task's source files."""
    text = "\n".join(p.read_text(encoding="utf-8") for p in catalog.task_files(task))
    return re.search(r"\b(drag|path)\s*:\s*\[", text) is not None


def task_entry(task: str, got: dict) -> dict:
    """The task's entry of the index, from a page's READ result."""
    return {"scenarios": got["task"], "heldout": got["heldout"], "startModes": got["startModes"],
            "judgeModes": got["judgeModes"], "hooks": sorted(got["hooks"]), "drags": source_drags(task)}


def read_cells(widgets: list[catalog.Widget]) -> list[tuple[catalog.Widget, dict | str]]:
    """Boot each widget and read what its page and task declare: (widget, data), or (widget, error message)."""
    out = []
    with driver.browser() as browser:
        page = browser.new_page(viewport={"width": driver.VIEWPORT[0], "height": driver.VIEWPORT[1]})
        for widget in widgets:
            try:
                driver.boot(page, widget, 0)
                out.append((widget, page.evaluate(READ)))
            except Exception as exc:  # noqa: BLE001
                out.append((widget, f"{type(exc).__name__}: {exc}"))
    return out


def dump(fams: dict, by_widget: dict) -> str:
    """One line per task and per widget, so a refresh diffs cleanly."""
    def block(d):
        return ",\n".join(f"  {json.dumps(k)}: {json.dumps(v)}" for k, v in sorted(d.items()))
    return f'{{"tasks": {{\n{block(fams)}\n}},\n"widgets": {{\n{block(by_widget)}\n}}}}\n'


def main() -> None:
    """Command line: rebuild html/scenarios.json, or --check that it is current."""
    parser = driver.parser(__doc__)
    parser.add_argument("--site", action="append", help="site glob (repeatable); default every site")
    parser.add_argument("--task", action="append", help="task (repeatable); default every task")
    parser.add_argument("--check", action="store_true", help="compare with the index instead of writing it")
    driver.add_jobs(parser)
    args = parser.parse_args()

    widgets = [s for s in catalog.widgets(include_test=True)
             if (not args.site or any(fnmatch.fnmatch(s.site, p) for p in args.site))
             and (not args.task or s.task in args.task)]
    got_all = driver.run_pool(read_cells, widgets, args.jobs)
    # Several agents may refresh their own tasks at once: hold a lock and re-read the index just before
    # merging, so a refresh only replaces the entries it read.
    lock = open(catalog.SCENARIOS_INDEX.with_suffix(".lock"), "w")
    if not args.check:
        fcntl.flock(lock, fcntl.LOCK_EX)
    index = catalog.scenarios_index()
    fams, by_widget = dict(index.get("tasks", {})), dict(index.get("widgets", {}))
    errors, stale = [], []
    for widget, got in got_all:
        if isinstance(got, str):
            errors.append(f"{catalog.widget_key(widget)}: {got}")
            continue
        fam = task_entry(widget.task, got)
        if fams.get(widget.task) != fam:
            stale.append(f"task {widget.task}")
            fams[widget.task] = fam
        if by_widget.get(catalog.widget_key(widget)) != got["widget"]:
            stale.append(catalog.widget_key(widget))
            by_widget[catalog.widget_key(widget)] = got["widget"]
    if not args.site and not args.task:  # drop widgets that no longer exist
        keys = {catalog.widget_key(s) for s in widgets}
        stale += [k for k in by_widget if k not in keys]
        by_widget = {k: v for k, v in by_widget.items() if k in keys}
    for e in errors:
        print(f"boot failed: {e}")
    if args.check:
        for s in sorted(set(stale)):
            print(f"stale: {s}")
        print(f"{len(widgets)} widgets, {len(set(stale))} stale entries, {len(errors)} boot failures")
        sys.exit(1 if stale or errors else 0)
    tmp = catalog.SCENARIOS_INDEX.with_suffix(".json.tmp")  # rename: checkers never read a half-written index
    tmp.write_text(dump(fams, by_widget))
    tmp.replace(catalog.SCENARIOS_INDEX)
    print(f"wrote {catalog.SCENARIOS_INDEX}: {len(by_widget)} widgets, {len(fams)} tasks, "
          f"{len(set(stale))} changed, {len(errors)} boot failures")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
