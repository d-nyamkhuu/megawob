"""Site manifests follow from the widget files: check them, or rewrite them (html/sites/<site>/manifest.json).

    python -m megawob.manifests                    # exit 1 if a manifest differs from what its widget files register
    python -m megawob.manifests --fix              # rewrite the manifests that differ
    python -m megawob.manifests --site 'design-use-*' # some sites only (glob, repeatable)

A manifest lists the widgets that serve a site's tasks: {"site", "split", "description"?, "widgets": {<task>: [{"name",
"split", "expect"?}]}}. The widget files (`env.widget({task, site, name, split, ...})` in sites/<site>/widgets/*.js) are
the source of truth for which widgets exist and their split; the manifest keeps what only it holds (the site's split
and description, a test widget's `expect`). The files are read by loading them in a Node vm recorder
(megawob/widgetdefs.mjs), not by text search, so loops and spreads count. Rules:
  - every widget a file registers for the site is in the manifest, with the same task, name and split;
  - every manifest widget is registered by a file;
  - an embedded sub-widget (a template design with `design: { widget }` and no `site`, as composite sites register the
    widgets of the tasks they embed) is not listed: a manifest entry would make it a task of its own;
  - a widget with a template and no name (the base site's: the template holds several widgets) stands for the widgets
    its template returns.
`--fix` keeps the existing order, `expect` and other keys of an entry that is still right, drops the entries no file
registers and appends the new widgets; megawob.lint reports the same differences as `manifest-drift`.
"""
from __future__ import annotations

import fnmatch
import json
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

from . import catalog, driver

SITES = catalog.HTML / "sites"
RECORDER = Path(__file__).with_name("widgetdefs.mjs")


@dataclass
class Registered:
    """One widget a site's files register."""
    task: str
    name: str
    split: str
    file: str  # relative to html/sites
    line: int


def site_dirs(patterns: list[str] | None = None) -> list[str]:
    """Site folder names matching the glob patterns (all without any)."""
    names = sorted(p.name for p in SITES.iterdir() if p.is_dir())
    if patterns:
        names = [n for n in names if any(fnmatch.fnmatchcase(n, p) for p in patterns)]
    return names


def load_defs(sites: list[str], html: Path | None = None) -> dict[str, dict]:
    """What the files of each site register (widgetdefs.mjs output: {site: {sites, files: {file: {widgets, error}}}})."""
    if not shutil.which("node"):
        sys.exit("node is needed to read the registered definitions (megawob/widgetdefs.mjs)")
    run = subprocess.run(["node", str(RECORDER), str(html or catalog.HTML)], input=json.dumps(sites),
                         capture_output=True, text=True)
    if run.returncode:
        sys.exit(f"widgetdefs.mjs failed:\n{run.stderr[-2000:]}")
    return json.loads(run.stdout)


def registered(site: str, entry: dict) -> tuple[list[Registered], set[str]]:
    """The widgets the files of a site register for it, and the tasks whose widget names could not be resolved
    (a nameless template widget whose template did not run). Embedded sub-widgets (no `site`) are not included."""
    out, unknown = [], set()
    for file, rec in entry["files"].items():
        for d in rec["widgets"]:
            if d["site"] != site or d["task"] is None:  # embedded (no site), or a wrong site (lint: site-dir)
                continue
            where = f"{site}/{file}"
            if d["name"] is None and d.get("names") is not None:
                for n in d["names"]:
                    if n["name"]:
                        out.append(Registered(d["task"], n["name"], d["split"] or "train", where, d["line"]))
            elif d["name"] is None:
                unknown.add(d["task"])
            else:
                out.append(Registered(d["task"], d["name"], d["split"] or "train", where, d["line"]))
    return out, unknown


def read_manifest(site: str) -> dict | None:
    """The site's manifest.json parsed, or None when it has none."""
    path = SITES / site / "manifest.json"
    return json.loads(path.read_text()) if path.is_file() else None


def drift(site: str, entry: dict, manifest: dict | None) -> list[tuple[str, int, str, str]]:
    """(file, line, task, note) per difference between a site's manifest and what its widget files register."""
    regs, unknown = registered(site, entry)
    if manifest is None:
        return [(f"{site}/manifest.json", 0, "", "no manifest.json")] if regs or entry["files"] else []
    out = []
    mf = f"{site}/manifest.json"
    if manifest.get("site", site) != site:
        out.append((mf, 0, "", f"site '{manifest['site']}' is not the folder name '{site}'"))
    if manifest.get("split", "train") not in catalog.SPLITS:
        out.append((mf, 0, "", f"split must be one of {catalog.SPLITS}"))
    listed = {(fam, e.get("name")): e for fam, entries in manifest.get("widgets", {}).items() for e in entries}
    have: dict[tuple[str, str], Registered] = {}
    for r in regs:
        if (r.task, r.name) in have:
            out.append((r.file, r.line, r.task, f"{r.task}/{r.name} is registered twice"))
        have[(r.task, r.name)] = r
    embedded = {(d["task"], d["name"]) for rec in entry["files"].values() for d in rec["widgets"]
                if d["site"] is None and d["name"]}
    for key, r in have.items():
        e = listed.get(key)
        if e is None:
            out.append((r.file, r.line, r.task, f"{r.task}/{r.name} is registered but not in the manifest"))
        elif e.get("split", "train") != r.split:
            out.append((mf, 0, r.task, f"{r.task}/{r.name}: manifest split '{e.get('split', 'train')}' but the "
                                         f"widget file says '{r.split}'"))
    for key in listed:
        if key in have or key[0] in unknown:
            continue
        why = ("an embedded sub-widget (listing it would make it a task of its own)" if key in embedded
               else "no widget file registers it")
        out.append((mf, 0, key[0], f"{key[0]}/{key[1]} is in the manifest but {why}"))
    return out


def fixed(site: str, entry: dict, manifest: dict | None) -> dict:
    """The manifest the files imply: existing entries that are still right keep their place and extra keys."""
    regs, unknown = registered(site, entry)
    manifest = manifest or {"site": site, "split": "train"}
    have = {(r.task, r.name): r for r in regs}
    widgets: dict[str, list[dict]] = {}
    for fam, entries in manifest.get("widgets", {}).items():
        for e in entries:
            key = (fam, e.get("name"))
            if key in have:
                widgets.setdefault(fam, []).append({**e, "split": have[key].split})
            elif fam in unknown:
                widgets.setdefault(fam, []).append(e)
    seen = {(fam, e["name"]) for fam, entries in widgets.items() for e in entries}
    for r in regs:
        if (r.task, r.name) not in seen:
            widgets.setdefault(r.task, []).append({"name": r.name, "split": r.split})
            seen.add((r.task, r.name))
    return {**manifest, "site": site, "widgets": widgets}


def write(site: str, manifest: dict) -> None:
    """Write the site's manifest.json, keeping its indent style."""
    path = SITES / site / "manifest.json"
    indent = 1 if path.is_file() and re.match(r'\{\n \S', path.read_text()) else 2
    driver.write_json(path, manifest, indent=indent)


def main() -> None:
    """Command line: compare manifests with the widget files, optionally rewriting them (--fix)."""
    parser = driver.parser(__doc__)
    parser.add_argument("--site", action="append", help="site glob (repeatable); default every site")
    parser.add_argument("--fix", action="store_true", help="rewrite the manifests that differ")
    args = parser.parse_args()
    sites = site_dirs(args.site)
    defs = load_defs(sites)
    bad = changed = 0
    for site in sites:
        manifest = read_manifest(site)
        found = drift(site, defs[site], manifest)
        if not found:
            continue
        bad += 1
        if args.fix:
            write(site, fixed(site, defs[site], manifest))
            changed += 1
        else:
            for file, _, _, note in found[:5]:
                print(f"{file}: {note}")
            if len(found) > 5:
                print(f"{site}: ... {len(found) - 5} more")
    if args.fix:
        print(f"{len(sites)} sites, {changed} manifests rewritten")
        sys.exit(0)
    print(f"{len(sites)} sites, {bad} with a manifest that differs from its widget files (--fix rewrites them)")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
