"""Tests for megawob.catalog: the pure sampling, URL and naming helpers, and the Config built from the environment.
No browser: `python -m pytest tests/test_catalog.py`."""
import hashlib
import json
import random
import re
from urllib.parse import parse_qs, urlsplit

import pytest

from megawob import catalog, design_splits
from megawob.catalog import Widget


def widget(task="slider", site="base", name="a", split="train"):
    return Widget(task, site, name, split)


# ---------------------------------------------------------------- pick_weighted, parse_viewports, task_base

def test_pick_weighted_single_option_is_returned_as_is():
    assert catalog.pick_weighted("header", random.Random(0)) == "header"
    assert catalog.pick_weighted(1.5, random.Random(0)) == "1.5"


def test_pick_weighted_follows_the_weights():
    rnd = random.Random(1)
    draws = [catalog.pick_weighted("a:.75,b:.25", rnd) for _ in range(4000)]
    assert set(draws) == {"a", "b"}
    assert 0.70 < draws.count("a") / len(draws) < 0.80


def test_pick_weighted_ignores_zero_weights_and_spaces():
    rnd = random.Random(2)
    assert {catalog.pick_weighted("a:0, b:1 ,c:0", rnd) for _ in range(50)} == {"b"}


def test_pick_weighted_is_deterministic_for_a_seed():
    spec = "x:.2,y:.3,z:.5"
    first = [catalog.pick_weighted(spec, random.Random(7)) for _ in range(5)]
    assert first == [catalog.pick_weighted(spec, random.Random(7)) for _ in range(5)]


def test_parse_viewports():
    assert catalog.parse_viewports("1024x640,1280x720") == [{"width": 1024, "height": 640}, {"width": 1280, "height": 720}]
    assert catalog.parse_viewports("") == []
    assert catalog.parse_viewports("800x600,") == [{"width": 800, "height": 600}]


def test_legacy_site_is_the_frozen_sort_key():
    # pick() orders sites by it, so a seed keeps picking the same widget.
    assert catalog.legacy_site("base") == "reference" and catalog.legacy_site("trait-tests") == "traitlab"
    assert catalog.legacy_site("mock-inbox") == "replica-inbox"
    assert catalog.legacy_site("design-set-slider-multi-08") == "ref-drag-slider-multi-08"
    assert catalog.legacy_site("design-use-email-star-reply-03") == "ref-app-email-star-reply-03"
    assert catalog.legacy_site("design-click-point-axis-01") == "ref-click-point-axis-01"


def test_salt_is_the_frozen_id():
    # Random streams keep their frozen salts (html/kit/runtime/legacy-ids.js), so seeds draw the same episodes.
    assert catalog.salt("set-slider") == "slider"
    assert catalog.salt("fill-form") == "form-fill"
    assert catalog.salt("click-point") == "click-point"  # unchanged id: no entry
    assert set(catalog.LEGACY_IDS) <= set(catalog.tasks())


# ---------------------------------------------------------------- _design_heldout

def test_design_heldout_v1_preserves_the_original_allocation():
    # Pinned before replacing the dynamic rank rule. Adding designs must never change these assignments.
    assert design_splits.VERSION == 1
    assert len(design_splits.HELDOUT_DESIGNS) == 433
    assert len(design_splits.HELDOUT_SITES) == 866
    digest = hashlib.sha256("\n".join(sorted(design_splits.HELDOUT_SITES)).encode()).hexdigest()
    # A frozen allocation (34a10b43...): it must not change as sites are added or renamed.
    assert digest == "db2749ebd48c767fa642b827abca21be5f47e2b7c9344c4c8e1bf680579974f2"
    for group, designs in design_splits.HELDOUT_DESIGNS.items():
        assert group.startswith("design-")
        assert len(set(designs)) == catalog.HELDOUT_DESIGNS_PER_SCENARIO
        for design in designs:
            assert re.fullmatch(r"\d{2}", design)
            assert (catalog.HTML / "sites" / f"{group}-{design}" / "manifest.json").is_file()


def test_design_heldout_is_stable_and_ignores_order():
    names = [f"design-use-shop-coupon-{n:02d}" for n in range(1, 13)]
    assert catalog._design_heldout(names) == catalog._design_heldout(list(reversed(names)))
    held = catalog._design_heldout(names)
    assert "design-use-shop-coupon-04" in held
    # Under the old name ranking, adding design 14 moved design 04 into training.
    assert catalog._design_heldout(names + ["design-use-shop-coupon-14"]) == held
    assert catalog._design_heldout(["design-use-shop-coupon-04"]) == {"design-use-shop-coupon-04"}


def test_design_heldout_leaves_other_sites_alone():
    assert catalog._design_heldout(["base", "mock-mail", "trait-tests", "design-no-number"]) == set()


def test_design_heldout_new_groups_and_designs_default_to_train():
    assert catalog._design_heldout(["design-a-b-01", "design-a-b-02", "design-use-shop-coupon-14"]) == set()


def test_design_heldout_manifest_overrides_and_custom_html_root(tmp_path, monkeypatch):
    names = {
        "design-use-shop-coupon-04": "train",  # frozen heldout even with a train manifest
        "design-use-shop-coupon-14": "train",  # new design remains training
        "design-new-scenario-01": "heldout",  # new groups can explicitly opt into evaluation
        "design-new-scenario-02": "test",
    }
    for name, split in names.items():
        site = tmp_path / "sites" / name
        site.mkdir(parents=True)
        (site / "manifest.json").write_text(json.dumps({"site": name, "split": split}))
    monkeypatch.setattr(catalog, "HTML", tmp_path)
    catalog._manifests.cache_clear()
    try:
        result = catalog._manifests()
        assert {name: data["split"] for name, data in result.items()} == {
            **names, "design-use-shop-coupon-04": "heldout",
        }
    finally:
        catalog._manifests.cache_clear()


# ---------------------------------------------------------------- page_url

def query(url):
    return {k: v[0] for k, v in parse_qs(urlsplit(url).query).items()}


def test_page_url_has_the_widget_seed_and_step_ms():
    url = catalog.page_url(widget("reorder", "portal-98", "x"), 5, base="http://h/")
    assert url.startswith("http://h/play.html?")
    assert query(url) == {"task": "reorder", "site": "portal-98", "widget": "x", "seed": "5",
                          "stepms": catalog.config().step_ms}


def test_page_url_scenario_and_flags():
    url = catalog.page_url(widget(), 1, scenario="thumb", base="b/", start="off", route=None, level="easy")
    q = query(url)
    assert q["scenario"] == "thumb" and q["start"] == "off" and q["level"] == "easy"
    assert "route" not in q  # a None flag is dropped


def test_page_url_stepms_flag_overrides_the_default_in_place():
    url = catalog.page_url(widget(), 1, base="b/", stepms="500:.5,1000:.5", start="off")
    assert list(query(url))[:5] == ["task", "site", "widget", "seed", "stepms"]
    assert query(url)["stepms"] == "500:.5,1000:.5"


def test_page_url_default_base_is_the_html_folder(monkeypatch):
    monkeypatch.delenv("MEGAWOB_URL", raising=False)
    assert catalog.page_url(widget(), 0).startswith(catalog.HTML.resolve().as_uri() + "/play.html?")
    monkeypatch.setenv("MEGAWOB_URL", "http://localhost:9/pages")
    assert catalog.page_url(widget(), 0).startswith("http://localhost:9/pages/play.html?")


# ---------------------------------------------------------------- pick

@pytest.fixture
def world(monkeypatch):
    """Two sites with widgets of one task: site A supports v1 and v2, site B only v2, an unindexed site C."""
    all_widgets = [widget("f", "A", "a1"), widget("f", "A", "a2"), widget("f", "B", "b1"), widget("f", "C", "c1"),
                 widget("f", "H", "h1", split="heldout")]
    index = {"tasks": {"f": {"scenarios": ["v1", "v2", "hv"], "heldout": ["hv"]}},
             "widgets": {"A/f/a1": ["v1", "v2"], "A/f/a2": ["v1"], "B/f/b1": ["v2", "hv"], "H/f/h1": ["v1"]}}

    def fake_widgets(task=None, site=None, split=None, include_test=False):
        return [s for s in all_widgets if (not task or s.task == task) and (not site or s.site == site)
                and (not split or s.split == split)]
    monkeypatch.setattr(catalog, "widgets", fake_widgets)
    monkeypatch.setattr(catalog, "scenarios_index", lambda: index)
    return all_widgets


def test_pick_is_scenario_first_and_never_forces_a_heldout_scenario(world):
    rnd = random.Random(0)
    seen = {}
    for _ in range(600):
        s, v = catalog.pick("f", rnd, split="train")
        seen.setdefault(v, set()).add(s.name)
        assert v != "hv"
        if v is not None:
            assert v in catalog.widget_scenarios(s)
    assert seen["v1"] == {"a1", "a2"} and seen["v2"] == {"a1", "b1"}
    assert seen[None] == {"c1"}  # an unindexed widget gets no forced scenario


def test_pick_gives_each_scenario_the_same_share(world):
    rnd = random.Random(3)
    draws = [catalog.pick("f", rnd, split="train")[1] for _ in range(3000)]
    for v in ("v1", "v2", None):
        assert 0.28 < draws.count(v) / len(draws) < 0.39


def test_pick_restricts_to_a_scenario_and_to_a_site(world):
    rnd = random.Random(4)
    for _ in range(50):
        s, v = catalog.pick("f", rnd, split="train", scenario="v2")
        assert v in ("v2", None) and s.name in ("a1", "b1", "c1")
    s, v = catalog.pick("f", rnd, split="train", site="B")
    assert (s.name, v) == ("b1", "v2")


def test_pick_split_and_errors(world):
    assert catalog.pick("f", random.Random(0), split="heldout")[0].name == "h1"
    with pytest.raises(ValueError):
        catalog.pick("nope", random.Random(0))
    with pytest.raises(ValueError):
        catalog.pick("f", random.Random(0), split="train", site="B", scenario="v1")


def test_pick_is_deterministic_for_a_seed(world):
    a = [catalog.pick("f", random.Random(9), split="train") for _ in range(3)]
    assert a == [catalog.pick("f", random.Random(9), split="train") for _ in range(3)]


# ---------------------------------------------------------------- task traits and task names

@pytest.fixture
def traits(monkeypatch):
    index = {"tasks": {
        "plain": {"scenarios": ["a"], "heldout": []},
        "rich": {"scenarios": ["a"], "heldout": [], "startModes": ["off", "solved", "scene"],
                 "judgeModes": ["ambiguous"], "hooks": ["facts", "answered", "nofaults"], "drags": True},
    }, "widgets": {}}
    monkeypatch.setattr(catalog, "scenarios_index", lambda: index)


def test_traits_default_for_a_task_without_them(traits):
    assert catalog.start_modes("plain") == ("off", "solved")
    assert catalog.judge_modes("plain") == ()
    assert catalog.hooks("plain") == frozenset()
    assert catalog.drags("plain") is False
    assert catalog.start_modes("unknown") == ("off", "solved")


def test_traits_come_from_the_index(traits):
    assert catalog.start_modes("rich") == ("off", "solved", "scene")
    assert catalog.judge_modes("rich") == ("ambiguous",)
    assert catalog.hooks("rich") == {"facts", "answered", "nofaults"}
    assert catalog.drags("rich") is True


def test_eval_axes_are_gated_by_the_traits(traits):
    plain, rich = catalog.eval_perturbations("plain"), catalog.eval_perturbations("rich")
    for axis in ("scene", "judgment", "drag-steps", "report-facts", "silent-failures", "answer-in"):
        assert axis not in plain
    for axis in ("scene", "judgment", "drag-steps", "report-facts", "answer-in"):
        assert axis in rich
    assert "silent-failures" not in rich and "page-faults" not in rich  # no silent() hook; faults: false
    assert "page-faults" in plain
    assert set(plain) <= set(catalog.EVAL_PERTURBATIONS)


def test_every_eval_perturbation_is_described():
    assert list(catalog.EVAL_PERTURBATION_TESTS) == list(catalog.EVAL_PERTURBATIONS)


def test_task_names_filters(monkeypatch, traits):
    s_train, s_held = widget("rich", "base", "m"), widget("rich", "design-x-y-01", "m", split="heldout")
    s_test = widget("plain", "trait-tests", "m", split="test")
    s_only_held = widget("plain", "design-p-q-02", "m", split="heldout")

    def fake_widgets(task=None, site=None, split=None, include_test=False):
        found = [s_train, s_held, s_test, s_only_held]
        return [s for s in found if (not task or s.task == task) and (not site or s.site == site)
                and (not split or s.split == split) and (s.split != "test" or include_test or site == s.site)]
    monkeypatch.setattr(catalog, "widgets", fake_widgets)
    monkeypatch.setattr(catalog, "tasks", lambda: ["plain", "rich"])
    names = catalog.task_names()
    assert names["rich"] == {"task": "rich", "split": "train", "site": None}
    assert names["rich.heldout"]["split"] == "heldout"
    assert names["rich.base"] == {"task": "rich", "split": None, "site": "base"}
    assert "plain" not in names  # no train widget: only held-out ones
    assert "plain.heldout" in names and "plain.design-p-q-02" in names
    assert "plain.trait-tests" not in names and not any("trait-tests" in n for n in names)
    assert not any(n.startswith("plain.eval-") for n in names)  # eval perturbations need a train widget
    assert names["rich.eval-scene"]["perturbation"] == "scene"
    assert {n.split(".eval-")[1] for n in names if n.startswith("rich.eval-")} == set(catalog.eval_perturbations("rich"))


def test_real_catalog_names_match_the_task_traits():
    names = catalog.task_names()
    assert len(names) == len(set(names))
    for task in catalog.tasks():
        axes = {n.split(".eval-")[1] for n in names if n.startswith(task + ".eval-")}
        assert axes == set(catalog.eval_perturbations(task))
        assert ("scene" in axes) == ("scene" in catalog.start_modes(task))
        assert ("judgment" in axes) == bool(catalog.judge_modes(task))
    assert not any("trait-tests" in n for n in names)


# ---------------------------------------------------------------- Config

def test_config_defaults_match_the_module_config(monkeypatch):
    cfg = catalog.Config.from_env({})
    assert cfg.preset == "default" and cfg.reward == "binary" and cfg.shaping == 1.0 and cfg.efficiency == 0
    assert cfg.knobs["startState"] == "off:.6,partial:.15,wrong:.15,solved:.1"
    assert cfg.knobs["instructionSplit"] == "train" and cfg.knobs["inputRoute"] is None and cfg.knobs["clock"] is None
    assert cfg.viewports == catalog.DEFAULT_VIEWPORTS


def test_config_knob_order_is_the_url_order():
    assert list(catalog.Config.from_env({}).knobs)[:6] == ["instructionDisplay", "finishByMessage", "startState", "popups",
                                                               "instructionSplit", "contentSplit"]


def test_config_env_beats_profile_beats_default():
    small = catalog.Config.from_env({"MEGAWOB_PRESET": "small"})
    assert small.reward == "shaped" and small.knobs["judgment"] == "off" and small.knobs["difficulty"].startswith("easy")
    mixed = catalog.Config.from_env({"MEGAWOB_PRESET": "small", "MEGAWOB_DIFFICULTY": "normal", "MEGAWOB_REWARD": "dense"})
    assert mixed.knobs["difficulty"] == "normal" and mixed.reward == "dense" and mixed.knobs["judgment"] == "off"


def test_config_profile_applies_to_every_variable(monkeypatch):
    monkeypatch.setitem(catalog.PRESETS, "probe", {"INPUT_ROUTE": "keyboard", "COMPOSITION": "heldout",
                                                    "UNDECLARED_INPUT": "void", "PAGE_LANGUAGE": "de", "DEVICE_SCALE": "2", "STEP_MS": "500", "VIEWPORTS": "800x600"})
    cfg = catalog.Config.from_env({"MEGAWOB_PRESET": "probe", "MEGAWOB_UNDECLARED_INPUT": "reject"})
    assert (cfg.knobs["inputRoute"], cfg.knobs["composition"], cfg.knobs["pageLanguage"], cfg.knobs["deviceScale"]) == ("keyboard", "heldout", "de", "2")
    assert cfg.knobs["undeclaredInput"] == "reject"  # the variable still wins
    assert cfg.step_ms == "500" and cfg.viewports == "800x600"


def test_config_numbers_and_validation():
    cfg = catalog.Config.from_env({"MEGAWOB_SHAPING": "0.5", "MEGAWOB_SUCCESS_BONUS": "3", "MEGAWOB_EFFICIENCY": "0.25"})
    assert (cfg.shaping, cfg.success_bonus, cfg.efficiency) == (0.5, 3.0, 0.25)
    with pytest.raises(ValueError, match="MEGAWOB_PRESET"):
        catalog.Config.from_env({"MEGAWOB_PRESET": "huge"})
    with pytest.raises(ValueError, match="MEGAWOB_EFFICIENCY"):
        catalog.Config.from_env({"MEGAWOB_EFFICIENCY": "1.5"})


def test_config_reads_the_observation_variables_once():
    cfg = catalog.Config.from_env({})
    assert (cfg.interface, cfg.reuse, cfg.remote_desktop, cfg.screenshot) == ("both", True, "off", True)
    assert (cfg.screenshot_format, cfg.screenshot_quality, cfg.screenshot_width) == ("png", 90, 0)
    dom = catalog.Config.from_env({"MEGAWOB_INTERFACE": "dom", "MEGAWOB_REUSE": "0", "MEGAWOB_REMOTE_DESKTOP": "citrix"})
    assert (dom.interface, dom.reuse, dom.remote_desktop, dom.screenshot) == ("dom", False, "citrix", False)  # no frame on dom
    on = catalog.Config.from_env({"MEGAWOB_INTERFACE": "dom", "MEGAWOB_SCREENSHOT": "1"})
    assert on.screenshot is True
    jpeg = catalog.Config.from_env({"MEGAWOB_SCREENSHOT_FORMAT": "JPEG", "MEGAWOB_SCREENSHOT_QUALITY": "70",
                                    "MEGAWOB_SCREENSHOT_WIDTH": "640"})
    assert (jpeg.screenshot_format, jpeg.screenshot_quality, jpeg.screenshot_width) == ("jpeg", 70, 640)
    with pytest.raises(ValueError, match="MEGAWOB_INTERFACE"):
        catalog.Config.from_env({"MEGAWOB_INTERFACE": "voice"})
    with pytest.raises(ValueError, match="MEGAWOB_SCREENSHOT_FORMAT"):
        catalog.Config.from_env({"MEGAWOB_SCREENSHOT_FORMAT": "gif"})


def test_config_is_frozen():
    cfg = catalog.Config.from_env({})
    with pytest.raises(AttributeError):
        cfg.reward = "dense"
    with pytest.raises(TypeError):
        cfg.knobs["startState"] = "off"


def test_config_errors_name_the_variable():
    for name, value in [("SHAPING", "lots"), ("SUCCESS_BONUS", "x"), ("SCREENSHOT_QUALITY", "high"),
                        ("SCREENSHOT_WIDTH", "1.5"), ("REWARD", "bogus")]:
        with pytest.raises(ValueError, match=f"MEGAWOB_{name}"):
            catalog.Config.from_env({f"MEGAWOB_{name}": value})


def test_importing_the_catalog_reads_no_megawob_variable():
    import os
    import subprocess
    import sys

    env = {**os.environ, "MEGAWOB_REWARD": "bogus", "MEGAWOB_SHAPING": "x", "MEGAWOB_INTERFACE": "voice"}
    code = ("from megawob import catalog\n"
            "try:\n    catalog.config()\nexcept ValueError as e:\n    print('first use:', e)\n"
            "else:\n    raise SystemExit('config() accepted a bad variable')\n")
    out = subprocess.run([sys.executable, "-c", code], env=env, capture_output=True, text=True)
    assert out.returncode == 0, out.stderr
    assert out.stdout.startswith("first use: MEGAWOB_")


def test_config_is_cached_and_refreshable(monkeypatch):
    saved = catalog.config()
    try:
        assert catalog.config() is saved
        monkeypatch.setenv("MEGAWOB_REWARD", "dense")
        assert catalog.config() is saved  # cached: the environment is not read again
        assert catalog.config(refresh=True).reward == "dense"
        catalog.set_config(None)
        assert catalog.config().reward == "dense"
    finally:
        catalog.set_config(saved)
