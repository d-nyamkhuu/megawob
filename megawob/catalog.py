"""Task catalog: discovers tasks and site manifests on disk and builds page URLs.

Pure Python with no BrowserGym or Playwright imports, so the checker and other tools can use it anywhere.

Layout (relative to the html root):
    tasks/<task>/logic.js    [+ the files it lists in files: [...], e.g. scenarios/<scenario>.js]
    sites/<site>/manifest.json   {"site", "split", "widgets": {<task>: [{"name", "split"}, ...]}}
    sites/<site>/widgets/<task>.js

Site split: "train" (default) and "heldout" sites produce tasks (heldout ones only under held-out names); two
designs of each original design-* task scenario have frozen heldout assignments (megawob.design_splits). A
"test" site (html/sites/trait-tests) is a checker fixture: it never produces a task name, a pick() or a gallery
cell, and widgets()/sites() list it only when asked (site=<name> or include_test=True), which is what
`python -m megawob.check --site trait-tests` does.
"""
from __future__ import annotations

import json
import os
import random
import re
from collections.abc import Callable, Mapping
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Any
from types import MappingProxyType
from urllib.parse import urlencode

from . import design_splits

_PKG = Path(__file__).resolve().parent
# $MEGAWOB_HTML, else megawob/html (a built wheel carries the pages there, see setup.py), else html/ at the
# repository root (a checkout or an editable install).
HTML = Path(os.environ.get("MEGAWOB_HTML") or (_PKG / "html" if (_PKG / "html").is_dir() else _PKG.parent / "html"))
if not (HTML / "tasks").is_dir():
    raise FileNotFoundError(f"megawob pages not found at {HTML}: install from a checkout (pip install -e .), "
                            "install a wheel built from one, or set MEGAWOB_HTML to its html/ directory")
# Each task's id before the MegaWoB rename, the salt of its random streams (html/kit/runtime/legacy-ids.js).
_LEGACY_JS = (HTML / "kit" / "runtime" / "legacy-ids.js").read_text(encoding="utf-8")
LEGACY_IDS: dict[str, str] = json.loads(_LEGACY_JS.split("/*JSON*/", 1)[1].split("/*END*/", 1)[0])

# Presets: defaults for a kind of training run. MEGAWOB_PRESET=small (small or weak policies: shaped reward,
# easier levels, more half-done starts, no judge / messy episodes); any MEGAWOB_<NAME> variable still wins.
PRESETS = {
    "default": {},
    "small": {
        "REWARD": "shaped",
        "DIFFICULTY": "easy:.4,medium:.35,normal:.25",
        "START_STATE": "off:.45,partial:.35,wrong:.1,solved:.1",
        "POPUPS": "off:.85,cookie:.03,toast:.03,chat:.03,promo:.03,banner:.03",
        "JUDGMENT": "off",
        "INSTRUCTION_NOISE": "off",
        "DRAG_STEPS": "atomic",
        "PAGE_FAULTS": "off",
        "REPORT_FACTS": "off",
        "INTERRUPTIONS": "off",
        "SILENT_FAILURES": "off",
        "SAFETY_HAZARDS": "off",
        "ANSWER_IN": "field",
    },
}


# The five viewports training samples by default and the checker covers unless --viewports is given.
TRAINING_VIEWPORTS = ("1024x640", "1280x720", "1366x768", "1440x900", "1536x864")
DEFAULT_VIEWPORTS = ",".join(TRAINING_VIEWPORTS)
INTERFACES = ("both", "pixel", "dom")  # MEGAWOB_INTERFACE (megawob.tracks)
REWARD_MODES = ("binary", "dense", "shaped")  # MEGAWOB_REWARD (megawob.tasks)
SCREENSHOT_FORMATS = ("png", "jpeg", "webp")  # MEGAWOB_SCREENSHOT_FORMAT (megawob.serve)

# Randomization parameters for training (see the header of html/kit/env.js); each is a page URL param and, except the two fixed
# split knobs, set by MEGAWOB_<NAME in capitals>. A value is one option or weights "a:.6,b:.4"; None = unset (the
# page decides). Order matters: it is the order of Config.knobs.
KNOB_DEFAULTS: dict[str, str | None] = {
    # Hidden by default: the agent reads the goal from obs["goal"], not from the page. Written as weights so it still
    # takes its draw from the shared stream and every later draw of a seed stays where it was.
    "instructionDisplay": "hidden:1",
    "finishByMessage": "0:.8,1:.2",
    "startState": "off:.6,partial:.15,wrong:.15,solved:.1",
    "popups": "off:.7,cookie:.06,toast:.06,chat:.06,promo:.06,banner:.06",
    "instructionSplit": "train",  # fixed
    "contentSplit": "train",  # fixed
    # Input route where a scenario has several (pointer|keyboard|wheel); unset = each task's own mix. Only the base
    # site honours it, so it stays undocumented until more sites do.
    "inputRoute": None,
    # Composite tasks: train | heldout task combinations / step orders.
    "composition": "train",
    # Input the task does not allow: reject (swallowed, reported in last_action_error) | void (reward 0).
    "undeclaredInput": "reject",
    # Language of the site frame. Only sites built on templates/site/base.js render other languages, so it stays
    # English and undocumented until more sites do (the parameter still works when set).
    "pageLanguage": "en",
    # Screenshot device scale factor (BrowserGym _bgym_scale_factor): screenshots are dsf x the CSS viewport
    # and action coordinates are in screenshot px. Sampled per episode in tasks.py, not a page knob.
    "deviceScale": "1",
    # Difficulty: easy | medium | normal (the task as it always was).
    "difficulty": "normal",
    # Episodes where acting as told is wrong (tasks with judgeModes): ask when ambiguous, report the
    # impossible, stop before an irreversible step. Mostly off.
    "judgment": "off:.92,ambiguous:.025,impossible:.025,confirm:.03",
    # Instruction as people type it: terse, typos, chatter.
    "instructionNoise": "off:.85,terse:.04,typo:.04,chatter:.04,mixed:.03",
    # split: press, move and release are separate actions (closed-loop drags); atomic drag_and_drop then fails.
    "dragSteps": "atomic:.85,split:.15",
    # Task clock: step (stepms of task time per action, independent of model latency) | real (wall time x
    # timescale; timescale < 1 slows the page down for slow policies).
    "clock": None,
    "timescale": None,
    # Round-2 knobs (own rng streams: the rest of an episode is unchanged when they are off). A page fault
    # once per episode: a press that does not register, a change undone, the form reset (each at the 1st-3rd
    # press or change), a busy spinner, a banner that shifts the layout (sites without fault() get miss;
    # tasks with faults: false none).
    "pageFaults": "off:.9,miss:.02,revert:.02,clear:.02,hang:.02,shift:.02",
    # End with a message stating facts read off the page (tasks with facts()).
    "reportFacts": "off:.95,on:.05",
    # The user interrupts after the 1st-3rd change or mid-drag: stop and report, or a new goal (switch needs
    # retarget()).
    "interruptions": "off:.95,cancel:.025,switch:.025",
    # The page saves a believably wrong version of the 1st-3rd improving change (tasks with silent()).
    "silentFailures": "off:.96,on:.04",
    # A safety hazard over the page (prompt injection, phishing, fake alert, ...; sites with hazard()); taking
    # the bait ends the episode with reward 0. on = one of content.HAZARD_KINDS, or name a kind.
    "safetyHazards": "off:.95,on:.05",
    # How the message an episode ends with is graded (html/kit/runtime/reply.js): structured = a reply format
    # drawn per episode (layout, field names, status words), appended to the goal and graded field by field;
    # free = plain text, graded from the same per-episode facts (looser); auto = structured in the tasks
    # that declare reply: true (workflow apps, safety), free text elsewhere. A interruptions=cancel stop is
    # structured unless free.
    "replyFormat": "auto",
    # The answer goes in the ending message instead of a field on the page (tasks with answers() /
    # answered(), widgets with answerReply: true; html/kit/runtime/answer.js): the widget draws no answer field,
    # finish mode.
    "answerIn": "field:.95,reply:.05",
    # Page option, not a randomization parameter: the cursor overlay is drawn one action late.
    "cursorLag": None,
}
_FIXED_KNOBS = ("instructionSplit", "contentSplit")


def _number(env: Mapping[str, str], name: str, default: str, cast: Callable = float) -> Any:
    """MEGAWOB_<name> as a number, else a ValueError that names the variable."""
    raw = env.get(f"MEGAWOB_{name}") or default
    try:
        return cast(raw)
    except ValueError:
        raise ValueError(f"MEGAWOB_{name} must be a number, got {raw!r}") from None


def _choice(env: Mapping[str, str], name: str, default: str, options: tuple[str, ...], lower: bool = False) -> str:
    """MEGAWOB_<name>, one of `options` (a ValueError naming the variable otherwise)."""
    value = env.get(f"MEGAWOB_{name}", default)
    value = value.lower() if lower else value
    if value not in options:
        raise ValueError(f"MEGAWOB_{name} must be one of {options}, got {value!r}")
    return value



def env_name(param: str) -> str:
    """The MEGAWOB_<NAME> variable of a randomization parameter, without the prefix: instructionDisplay ->
    INSTRUCTION_DISPLAY."""
    return re.sub(r"(?<=[a-z])(?=[A-Z])", "_", param).upper()


@dataclass(frozen=True)
class Config:
    """What the MEGAWOB_* variables set for the Python side, read once by Config.from_env(env) (env defaults to
    os.environ) and passed on: tasks take `config=`; config() builds the process-wide one on first use, so a bad
    variable fails there, not at import. Every value is MEGAWOB_<NAME> if set, else the profile's, else the default
    (docs/configuration.md lists the variables)."""
    preset: str  # PRESETS
    reward: str  # binary | dense | shaped (REWARD_MODES)
    shaping: float  # weight of the per-step progress in the shaped reward
    success_bonus: float  # bonus on a successful final step in the shaped reward
    efficiency: float  # 0 = off; weight of the oracle-steps scaling of the success reward
    step_ms: str  # task time per action in clock=step: one value or weights "500:.5,1000:.5" (page param stepms)
    viewports: str  # per-episode viewports, "WxH,WxH" (parse_viewports)
    knobs: Mapping[str, str | None] = field(hash=False)  # KNOB_DEFAULTS, overridden by MEGAWOB_<NAME>
    # Observation side, not page knobs: the track (INTERFACES), page reuse in reset, the screen transform spec
    # (megawob.screen) and the OpenEnv server's encoded screenshot. They ignore the profile.
    interface: str  # INTERFACES: what the agent observes
    reuse: bool  # reset reuses the open page and browser (megawob.reuse)
    remote_desktop: str  # MEGAWOB_REMOTE_DESKTOP: one screen profile or weights "off:.8,citrix:.2"
    screenshot: bool  # put an encoded frame in the OpenEnv observation (default: not on the dom track)
    screenshot_format: str  # SCREENSHOT_FORMATS
    screenshot_quality: int  # jpeg / webp quality
    screenshot_width: int  # downscale before encoding; 0 = keep

    @classmethod
    def from_env(cls, env: Mapping[str, str] | None = None) -> "Config":
        """Read and validate every variable (ValueError naming the variable when one is bad)."""
        env = os.environ if env is None else env
        preset = _choice(env, "PRESET", "default", tuple(PRESETS))
        defaults = PRESETS[preset]

        def setting(name: str, default: str | None) -> str | None:
            return env.get(f"MEGAWOB_{name}") or defaults.get(name, default)

        efficiency = _number(env, "EFFICIENCY", "0")
        if not 0 <= efficiency <= 1:
            raise ValueError(f"MEGAWOB_EFFICIENCY must be in [0, 1], got {efficiency}")
        reward = setting("REWARD", "binary")
        if reward not in REWARD_MODES:
            raise ValueError(f"MEGAWOB_REWARD must be one of {REWARD_MODES}, got {reward!r}")
        interface = _choice(env, "INTERFACE", "both", INTERFACES)
        return cls(
            preset=preset,
            reward=reward,
            shaping=_number(env, "SHAPING", "1.0"),
            success_bonus=_number(env, "SUCCESS_BONUS", "1.0"),
            efficiency=efficiency,
            step_ms=setting("STEP_MS", "1000"),
            viewports=setting("VIEWPORTS", DEFAULT_VIEWPORTS),
            knobs=MappingProxyType({k: v if k in _FIXED_KNOBS else setting(env_name(k), v)
                                    for k, v in KNOB_DEFAULTS.items()}),
            interface=interface,
            reuse=env.get("MEGAWOB_REUSE", "1") != "0",
            remote_desktop=env.get("MEGAWOB_REMOTE_DESKTOP") or "off",
            screenshot=env.get("MEGAWOB_SCREENSHOT", "0" if interface == "dom" else "1") == "1",
            screenshot_format=_choice(env, "SCREENSHOT_FORMAT", "png", SCREENSHOT_FORMATS, lower=True),
            screenshot_quality=_number(env, "SCREENSHOT_QUALITY", "90", int),
            screenshot_width=_number(env, "SCREENSHOT_WIDTH", "0", int),
        )


_config: Config | None = None


def config(refresh: bool = False) -> Config:
    """The process-wide Config, read from the environment on first use and cached; refresh=True reads it again
    (tests that change MEGAWOB_* variables). Importing megawob.catalog reads no MEGAWOB_* value but MEGAWOB_HTML
    and MEGAWOB_URL, so a bad value raises here, on first use."""
    global _config
    if _config is None or refresh:
        _config = Config.from_env()
    return _config


def set_config(cfg: Config | None) -> None:
    """Install `cfg` as the process-wide Config (None: forget it, the next config() reads the environment)."""
    global _config
    _config = cfg


EVAL_VIEWPORTS = "1152x648,1600x900,1680x1050,1920x1080"

# Held-out evaluation axes: task <base>.eval-<axis> overrides these knobs (train-split widgets).
EVAL_PERTURBATIONS = {
    "instructions": {"instructionSplit": "heldout", "instructionDisplay": "hidden:.5,header:.2,panel:.15,toast:.15"},
    "content": {"contentSplit": "heldout"},
    "ood": {"ood": "1"},
    "start-state": {"startState": "partial:.3,wrong:.4,solved:.3"},
    "recover": {"recover": "1"},
    "scene": {"startState": "scene"},  # registered only for tasks whose logic.js lists 'scene' in startModes
    "popups": {"popups": "cookie:.2,toast:.2,chat:.2,promo:.2,banner:.2"},
    "finish-by-message": {"finishByMessage": "1", "instructionDisplay": "hidden"},
    "viewport": {"viewports": EVAL_VIEWPORTS},
    "composition": {"composition": "heldout"},
    "device-scale": {"deviceScale": "1.5:.5,2:.5", "viewports": EVAL_VIEWPORTS},
    "judgment": {"judgment": "ambiguous:.33,impossible:.33,confirm:.34"},  # tasks with judgeModes only
    "instruction-noise": {"instructionNoise": "terse:.25,typo:.25,chatter:.25,mixed:.25", "instructionSplit": "heldout"},
    "drag-steps": {"dragSteps": "split"},  # tasks whose plans drag only
    "difficulty": {"difficulty": "easy:.5,medium:.5"},
    "page-faults": {"pageFaults": "miss:.2,revert:.2,clear:.2,hang:.2,shift:.2"},  # not for tasks with faults: false
    "report-facts": {"reportFacts": "on"},  # tasks with facts() only
    "interruptions": {"interruptions": "cancel:.5,switch:.5"},
    "silent-failures": {"silentFailures": "on"},  # tasks with silent() only
    "safety-hazards": {"safetyHazards": "on"},  # sites without hazard() take templates/site/hooks.js
    "answer-in": {"answerIn": "reply"},  # tasks with answers() only; widgets without answerReply keep their field
    "all": {"instructionSplit": "heldout", "contentSplit": "heldout", "ood": "1", "startState": "partial:.3,wrong:.4,solved:.3",
            "popups": "cookie:.2,toast:.2,chat:.2,promo:.2,banner:.2", "viewports": EVAL_VIEWPORTS,
            "composition": "heldout"},
}

# What each eval perturbation tests, for the docs (describe.py writes the table in docs/tasks.md).
EVAL_PERTURBATION_TESTS = {
    "instructions": "held-out instruction wording, shown in any place on the page",
    "content": "held-out names, products and texts",
    "ood": "parameter values outside the training ranges",
    "start-state": "a page that starts partly done, wrong or already solved",
    "recover": "a wrong choice that can be undone, at a cost, instead of ending the episode",
    "scene": "the design image's own mid-task screen as the start (tasks with a `scene` start mode)",
    "popups": "a popup over the page in every episode",
    "finish-by-message": "no end control: end the episode with a message",
    "viewport": "window sizes training never uses",
    "composition": "held-out combinations and orders of goals (composite tasks)",
    "device-scale": "high-density screens (device scale 1.5 or 2) at eval window sizes",
    "judgment": "goals that are ambiguous, impossible or need confirmation (tasks with `judgeModes`)",
    "instruction-noise": "instructions written tersely, with typos or with chatter",
    "drag-steps": "drags split into separate press, move and release actions (tasks that drag)",
    "difficulty": "the easier levels of the task",
    "page-faults": "a page that misbehaves once: a lost click, a reverted change, a hang, ...",
    "report-facts": "end with a message stating facts read off the page (tasks with `facts()`)",
    "interruptions": "the user cancels the task or changes the goal mid-episode",
    "silent-failures": "a change the page saves wrong without an error (tasks with `silent()`)",
    "safety-hazards": "a trap over the page; taking it scores 0",
    "answer-in": "the answer goes in the ending message instead of a field (tasks with `answered()`)",
    "all": "instructions, content, ood, start-state, popups, composition and viewport together",
}


def pick_weighted(spec: object, rnd: random.Random) -> str:
    """One option of a knob value: 'a' or weights 'a:.6,b:.4' (as the page's knob(), but with a Python rng)."""
    spec = str(spec)
    if ":" not in spec:
        return spec
    parts = [(k.strip(), float(w)) for k, w in (p.split(":") for p in spec.split(",")) if float(w) > 0]
    x = rnd.random() * sum(w for _, w in parts)
    for k, w in parts:
        x -= w
        if x < 0:
            return k
    return parts[-1][0]


def parse_viewports(spec: str) -> list[dict]:
    """'1024x640,1280x720' as [{'width': 1024, 'height': 640}, ...]."""
    return [{"width": int(w), "height": int(h)} for w, h in (v.split("x") for v in spec.split(",") if v)]


def salt(task: str) -> str:
    """The salt of a task's random streams: its frozen id in LEGACY_IDS, else its id."""
    return LEGACY_IDS.get(task, task)


def legacy_site(site: str) -> str:
    """A site's frozen sort key (reference, ref-<frozen task id>-..., replica-*, traitlab). pick() orders sites by it,
    so a seed keeps picking the same widget as sites are added; a site added later sorts the same way."""
    if site in ("base", "trait-tests"):
        return {"base": "reference", "trait-tests": "traitlab"}[site]
    if site.startswith("mock-"):
        return "replica-" + site[len("mock-"):]
    if site.startswith("design-"):
        rest = site[len("design-"):]
        for task in sorted(tasks(), key=len, reverse=True):
            if rest.startswith(task + "-"):
                old = salt(task)
                return f"ref-{old if '-' in old else 'drag-' + old}-{rest[len(task) + 1:]}"
    return site


SPLITS = ("train", "heldout", "test")


@dataclass(frozen=True)
class Widget:
    """One widget of a site: the task it renders, its effective split and, on test sites, its expect clauses."""
    task: str
    site: str
    name: str
    split: str  # effective split: "test" for a test site, else "heldout" if the site or the widget is held out
    # Manifest "expect" (test sites): {<scenario> | "*": "<js expression over spec, model, episode>"}, evaluated by the
    # checker after every reset of that scenario, so a trait the widget silently ignores fails instead of passing.
    expect: dict | None = field(default=None, compare=False, hash=False)


def tasks() -> list[str]:
    """Every task with a logic.js, sorted."""
    return sorted(p.parent.name for p in (HTML / "tasks").glob("*/logic.js"))


def _task_entry(task: str) -> dict:
    return scenarios_index()["tasks"].get(task, {})


def start_modes(task: str) -> tuple[str, ...]:
    """startModes of a task (html/scenarios.json; every task lists them, 'off' and 'solved' by default)."""
    return tuple(_task_entry(task).get("startModes", ("off", "solved")))


def judge_modes(task: str) -> tuple[str, ...]:
    """judgeModes of a task (html/scenarios.json; none by default)."""
    return tuple(_task_entry(task).get("judgeModes", ()))


def hooks(task: str) -> frozenset[str]:
    """Round-2 task hooks (html/scenarios.json): facts, silent, retarget, answered (with answers(), knob answer;
    models hold an `answers` field, so the pair is found by answered), and nofaults for `faults: false`."""
    return frozenset(_task_entry(task).get("hooks", ()))


def task_files(task: str) -> list[Path]:
    """The task's logic.js, then its other files (a big task's files: [...], e.g. scenarios/<scenario>.js), sorted."""
    root = HTML / "tasks" / task
    return [root / "logic.js"] + sorted(p for p in root.rglob("*.js") if p != root / "logic.js")


def drags(task: str) -> bool:
    """True when the task's plan() has drag or path steps (html/scenarios.json), so dragSteps=split changes something."""
    return bool(_task_entry(task).get("drags", False))


def eval_perturbations(task: str) -> list[str]:
    """Eval axes registered for a task: 'scene' only where the task can build a scene start (else it would
    fall back to 'off' and duplicate the base task), 'judge' only with judgeModes, 'drag' only for tasks that drag,
    'report' / 'silent' / 'answer' only with facts() / silent() / answered(), 'fault' unless the task sets
    faults: false."""
    def ok(a: str) -> bool:
        if a in ("report-facts", "silent-failures", "answer-in"):
            return {"report-facts": "facts", "silent-failures": "silent", "answer-in": "answered"}[a] in hooks(task)
        if a == "page-faults":
            return "nofaults" not in hooks(task)
        if a == "scene":
            return "scene" in start_modes(task)
        if a == "judgment":
            return bool(judge_modes(task))
        if a == "drag-steps":
            return drags(task)
        return True
    return [a for a in EVAL_PERTURBATIONS if ok(a)]


# Frozen original design-* design assignments; adding or removing sites cannot move an existing design between
# splits. New sites default to train; explicitly declare heldout/test in their manifests to opt out of training.
# HELDOUT_DESIGNS_PER_SCENARIO describes the original allocation, not a quota to recompute as the catalog grows.
HELDOUT_DESIGNS_PER_SCENARIO = design_splits.DESIGNS_PER_SCENARIO


def _design_heldout(names: list[str]) -> set[str]:
    return set(names).intersection(design_splits.HELDOUT_SITES)


@lru_cache(maxsize=1)
def _manifests() -> dict[str, dict]:
    out = {}
    for path in sorted((HTML / "sites").glob("*/manifest.json")):
        data = json.loads(path.read_text())
        site = data.get("site", path.parent.name)
        if site != path.parent.name:
            raise ValueError(f"{path}: site '{site}' does not match its folder")
        if data.get("split", "train") not in SPLITS:
            raise ValueError(f"{path}: split must be one of {SPLITS}")
        out[site] = data
    for site in _design_heldout(list(out)):
        if out[site].get("split", "train") == "train":
            out[site] = {**out[site], "split": "heldout"}
    return out


def sites(include_test: bool = False) -> list[str]:
    """Site names; the checker-fixture (test) sites only when include_test."""
    return [n for n, d in _manifests().items() if include_test or d.get("split", "train") != "test"]


def widgets(task: str | None = None, site: str | None = None, split: str | None = None,
          include_test: bool = False) -> list[Widget]:
    """The manifests' widgets, filtered by task, site and effective split; test sites only when asked for."""
    found = []
    for name, data in _manifests().items():
        if site and name != site:
            continue
        site_split = data.get("split", "train")
        if site_split == "test" and not (include_test or site == name or split == "test"):
            continue
        for fam, entries in data.get("widgets", {}).items():
            if task and fam != task:
                continue
            for entry in entries:
                eff = ("test" if site_split == "test" else
                       "heldout" if "heldout" in (site_split, entry.get("split", "train")) else "train")
                if split and eff != split:
                    continue
                found.append(Widget(fam, name, entry["name"], eff, entry.get("expect")))
    return found


SCENARIOS_INDEX = HTML / "scenarios.json"  # written by `python -m megawob.scenarios`


@lru_cache(maxsize=1)
def scenarios_index() -> dict:
    """{"tasks": {task: {"scenarios", "heldout", "startModes", "judgeModes", "hooks", "drags"}},
    "widgets": {"site/task/name": [scenario, ...]}}; written by `python -m megawob.scenarios`. A task missing from
    it (or from before a field was added) has no scenarios, the default start modes and no judge modes or hooks."""
    try:
        return json.loads(SCENARIOS_INDEX.read_text())
    except FileNotFoundError:
        return {"tasks": {}, "widgets": {}}


def widget_key(widget: Widget) -> str:
    """'site/task/name', the key of html/scenarios.json entries."""
    return f"{widget.site}/{widget.task}/{widget.name}"


def widget_scenarios(widget: Widget) -> list[str] | None:
    """The scenarios a widget supports (html/scenarios.json), or None when it is not indexed."""
    return scenarios_index()["widgets"].get(widget_key(widget))


def pick(task: str, rng: random.Random, split: str | None = "train", site: str | None = None,
         scenario: str | None = None) -> tuple[Widget, str | None]:
    """(widget, scenario): uniform over the task's scenarios first, then over the sites that support the chosen one,
    then over that site's widgets. Single-scenario sites (every design-* site) would otherwise set the scenario mix, and
    widget-rich sites are not over-weighted. Scenarios come from html/scenarios.json; a task's held-out scenarios
    (heldoutScenarios) are never forced, and widgets missing from the index get no forced scenario (None: the page
    samples one). `scenario` restricts the choice to the widgets that support it."""
    candidates = widgets(task, site, split)
    if not candidates:
        raise ValueError(f"no widgets for task={task} site={site} split={split}")
    held = set(scenarios_index()["tasks"].get(task, {}).get("heldout", []))
    by_scenario: dict[str | None, list[Widget]] = {}
    for s in candidates:
        vs = widget_scenarios(s)
        for v in ([None] if vs is None else [v for v in vs if v not in held] or [None]):
            by_scenario.setdefault(v, []).append(s)
    if scenario is not None:
        pool = by_scenario.get(scenario, []) + by_scenario.get(None, [])
        if not pool:
            raise ValueError(f"no widgets for task={task} site={site} split={split} scenario={scenario}")
    else:
        scenario = rng.choice(sorted(by_scenario, key=lambda v: (v is not None, v or "")))
        pool = by_scenario[scenario]
    by_site: dict[str, list[Widget]] = {}
    for s in pool:
        by_site.setdefault(s.site, []).append(s)
    chosen_site = rng.choice(sorted(by_site, key=legacy_site))
    widget = rng.choice(sorted(by_site[chosen_site], key=lambda s: s.name))
    vs = widget_scenarios(widget)
    return widget, scenario if vs is not None and scenario in vs else None


# Chromium flags for pixel checks (check, golden, hackcheck: driver.browser(raster=True)): whole-tile raster. With partial raster (the default), an
# edge re-rasterized after a re-layout can come out a few levels off (max delta ~17), so reset(7) / golden screenshots
# flaked. Not with --num-raster-threads=1 too: that pair leaves stale tile strips on screen after some resets
# (design-draw-shape-line-03). --disable-smooth-scrolling: a wheel action scrolls at once, so under load the next
# locate() never sees a pane half-scrolled (use-slides drag targets moved by up to 40 px).
RASTER_ARGS = ["--disable-partial-raster", "--disable-smooth-scrolling"]


def base_url() -> str:
    """Where play.html is served. MEGAWOB_URL (http) wins; otherwise the html folder as a file:// URL."""
    url = os.environ.get("MEGAWOB_URL") or HTML.resolve().as_uri()
    return url if url.endswith("/") else url + "/"


def page_url(widget: Widget, seed: int, scenario: str | None = None, base: str | None = None, **flags) -> str:
    """The play.html URL that boots `widget` at `seed` (optionally one scenario), with the randomization parameters in `flags`."""
    query = {"task": widget.task, "site": widget.site, "widget": widget.name, "seed": int(seed), "stepms": config().step_ms}
    flags = dict(flags)
    if flags.get("stepms") is not None:
        query["stepms"] = flags.pop("stepms")
    if scenario:
        query["scenario"] = scenario
    query.update({k: v for k, v in flags.items() if v is not None})
    return (base or base_url()) + "play.html?" + urlencode(query)


def task_names() -> dict[str, dict]:
    """BrowserGym task names (without the 'miniwob.' prefix) and what each one samples from.

    <base>          train split, any site
    <base>.heldout  heldout split, any site (only if some widget is held out)
    <base>.<site>   every widget of one site, regardless of split
    <base>.eval-<axis>   train widgets with one eval perturbation (EVAL_PERTURBATIONS): instr, content, ood, start,
                    recover, scene, perturb, finish, viewport, route, compose, lang, dsf, judge, messy,
                    drag, level, fault, report, preempt, silent, safety, answer, all (scene only for tasks
                    that list 'scene' in startModes, judge only with judgeModes, drag only for tasks that drag,
                    report, silent and answer only with facts() / silent() / answers(), fault unless faults: false;
                    see eval_perturbations())
    Sites with "split": "test" (trait-tests) get no names at all.
    where <base> is task, e.g. set-slider or fill-form.
    """
    names = {}
    for fam in tasks():
        base = fam
        if widgets(fam, split="train"):
            names[base] = {"task": fam, "split": "train", "site": None}
        if widgets(fam, split="heldout"):
            names[f"{base}.heldout"] = {"task": fam, "split": "heldout", "site": None}
        for site in sorted({s.site for s in widgets(fam)}):  # test sites are not listed by widgets() without a site
            names[f"{base}.{site}"] = {"task": fam, "split": None, "site": site}
        if widgets(fam, split="train"):
            for axis in eval_perturbations(fam):
                names[f"{base}.eval-{axis}"] = {"task": fam, "split": "train", "site": None, "perturbation": axis}
    return names


def counts() -> dict[str, int]:
    """Catalog sizes, for docs and release notes: `python -m megawob.catalog` prints them. Test sites are left out."""
    refs = [s for s in sites() if s.startswith("design-")]
    per_scenario: dict[str, int] = {}
    for name in refs:
        key = re.sub(r"-\d+$", "", name)
        per_scenario[key] = per_scenario.get(key, 0) + 1
    all_widgets = widgets()
    out = {
        "tasks": len(tasks()),
        "scenarios": sum(len(d["scenarios"]) for d in scenarios_index()["tasks"].values()),
        "sites": len(sites()),
        "widgets": len(all_widgets),
        "base widgets": sum(1 for s in all_widgets if s.site == "base"),
        "design sites": len(refs),
        "design sites heldout": sum(1 for s in all_widgets if s.site.startswith("design-") and s.split == "heldout"),
        "design task scenarios": len(per_scenario),
        "mock sites": sum(1 for s in sites() if s.startswith("mock-")),
        "trait-tests widgets": len(widgets(site="trait-tests")),
        "task names": len(task_names()),
    }
    for n in sorted(set(per_scenario.values())):
        out[f"design task scenarios with {n} designs"] = sum(1 for v in per_scenario.values() if v == n)
    return out


def main() -> None:
    """Command line (megawob-catalog): print the catalog sizes."""
    for key, value in counts().items():
        print(f"{value:6,}  {key}")


if __name__ == "__main__":
    main()
