"""Tests for the structure rules: megawob.manifests (manifest vs widget files, --fix) and the lint rules built on the
definitions megawob/widgetdefs.mjs records (widget-template, site-dir, widget-task, widget-name, widget-load, manifest-drift).
The pure comparisons run on hand-made definitions; the rest build a small html tree in tmp_path and load it through
Node (skipped without node). No browser: `python -m pytest tests/test_manifests.py`."""
import json
import shutil

import pytest

from megawob import catalog, lint, manifests

needs_node = pytest.mark.skipif(not shutil.which("node"), reason="node is needed to record the definitions")


def widget(task="set-slider", site="s", name="a", split="train", **more):
    return {"task": task, "site": site, "name": name, "split": split, "scenarios": None, "template": None,
            "designWidget": None, "line": 3, **more}


def entry(*widgets, file="widgets/set-slider.js"):
    return {"sites": [], "error": None, "files": {file: {"widgets": list(widgets), "error": None}}}


def manifest(widgets):
    return {"site": "s", "split": "train",
            "widgets": {fam: [{"name": n, "split": sp} for n, sp in items] for fam, items in widgets.items()}}


def notes(found):
    return [note for _, _, _, note in found]


# ---------------------------------------------------------------- drift (pure)

def test_a_manifest_that_matches_its_widget_files_has_no_drift():
    e = entry(widget(name="a"), widget(name="b", split="heldout"))
    assert manifests.drift("s", e, manifest({"set-slider": [("a", "train"), ("b", "heldout")]})) == []


def test_a_widget_missing_from_the_manifest_is_drift_and_names_its_file_and_line():
    found = manifests.drift("s", entry(widget(name="a"), widget(name="b")), manifest({"set-slider": [("a", "train")]}))
    assert found == [("s/widgets/set-slider.js", 3, "set-slider", "set-slider/b is registered but not in the manifest")]


def test_a_manifest_widget_no_file_registers_is_drift():
    found = manifests.drift("s", entry(widget(name="a")), manifest({"set-slider": [("a", "train"), ("gone", "train")]}))
    assert notes(found) == ["set-slider/gone is in the manifest but no widget file registers it"]


def test_a_disagreeing_split_or_site_is_drift():
    found = manifests.drift("s", entry(widget(name="a", split="heldout")), {**manifest({"set-slider": [("a", "train")]}),
                                                                          "site": "other"})
    assert len(found) == 2
    assert any("folder name" in n for n in notes(found)) and any("widget file says 'heldout'" in n for n in notes(found))


def test_an_embedded_sub_widget_is_not_registered_and_listing_it_is_drift():
    sub = widget(task="pick-color", site=None, name="wheel", template="pick-color/base", designWidget="wheel")
    e = entry(widget(name="a"), sub, file="widgets/set-slider.js")
    assert manifests.drift("s", e, manifest({"set-slider": [("a", "train")]})) == []
    found = manifests.drift("s", e, manifest({"set-slider": [("a", "train")], "pick-color": [("wheel", "train")]}))
    assert "embedded sub-widget" in notes(found)[0]


def test_a_widget_of_another_site_does_not_count_for_this_one():
    assert manifests.registered("s", entry(widget(site="base")))[0] == []


def test_a_nameless_template_widget_stands_for_the_widgets_its_template_returns():
    ref = widget(name=None, template="set-slider/base", names=[{"name": "classic", "scenarios": None},
                                                               {"name": "arc", "scenarios": None}])
    e = entry(ref)
    assert manifests.drift("s", e, manifest({"set-slider": [("classic", "train"), ("arc", "train")]})) == []
    assert notes(manifests.drift("s", e, manifest({"set-slider": [("classic", "train")]}))) == [
        "set-slider/arc is registered but not in the manifest"]


def test_when_a_template_did_not_run_its_task_is_not_compared_by_name():
    ref = widget(name=None, template="set-slider/base", unresolved="template set-slider/base: boom")
    assert manifests.drift("s", entry(ref), manifest({"set-slider": [("classic", "train")]})) == []


def test_a_site_without_a_manifest_is_drift():
    assert notes(manifests.drift("s", entry(widget()), None)) == ["no manifest.json"]


def test_fixed_keeps_order_and_extra_keys_drops_stale_and_appends_new():
    m = {"site": "s", "split": "heldout", "description": "d", "widgets": {
        "set-slider": [{"name": "b", "split": "train", "expect": {"*": "true"}}, {"name": "gone", "split": "train"}]}}
    e = entry(widget(name="a"), widget(name="b", split="heldout"))
    got = manifests.fixed("s", e, m)
    assert got["split"] == "heldout" and got["description"] == "d"
    assert got["widgets"]["set-slider"] == [{"name": "b", "split": "heldout", "expect": {"*": "true"}},
                                      {"name": "a", "split": "train"}]
    assert manifests.drift("s", e, got) == []


def test_fixed_makes_a_manifest_for_a_site_that_has_none():
    got = manifests.fixed("s", entry(widget(name="a")), None)
    assert got == {"site": "s", "split": "train", "widgets": {"set-slider": [{"name": "a", "split": "train"}]}}


# ---------------------------------------------------------------- the recorder and the lint rules (Node)

@pytest.fixture
def html(tmp_path, monkeypatch):
    """A tiny pages tree (tasks: set-slider, pick-color) the rules read in place of the real one."""
    for fam in ("set-slider", "pick-color"):
        (tmp_path / "tasks" / fam).mkdir(parents=True)
        (tmp_path / "tasks" / fam / "logic.js").write_text("")
    (tmp_path / "templates" / "set-slider").mkdir(parents=True)
    monkeypatch.setattr(catalog, "HTML", tmp_path)
    monkeypatch.setattr(manifests, "SITES", tmp_path / "sites")
    monkeypatch.setattr(lint, "SITES", tmp_path / "sites")
    return tmp_path


def make_site(html, name, widgets, manifest_widgets=None, split="train", site_js=None):
    """widgets: {file: js}; manifest_skins: {task: [name, ...]} (default: none listed)."""
    root = html / "sites" / name
    (root / "widgets").mkdir(parents=True)
    (root / "site.js").write_text(site_js or f"env.site({{ name: '{name}', template: 'site/x', design: {{}} }});")
    for file, js in widgets.items():
        (root / "widgets" / file).write_text(js)
    (root / "manifest.json").write_text(json.dumps({"site": name, "split": split, "widgets": {
        fam: [{"name": n, "split": "train"} for n in names] for fam, names in (manifest_widgets or {}).items()}}))
    return name


def rules(found):
    return sorted((f.rule, f.severity) for f in found)


@needs_node
def test_a_clean_ref_site_has_no_structure_findings(html):
    js = ("env.widget({ task: 'set-slider', site: 'design-a-01', name: 'design', split: 'train', template: 'set-slider/x', "
          "design: {} });")
    make_site(html, "design-a-01", {"set-slider.js": js}, {"set-slider": ["design"]})
    assert lint.lint_structure(["design-a-01"]) == []


@needs_node
def test_a_ref_widget_without_a_template_is_an_error_but_reference_sites_are_exempt(html):
    js = "env.widget({ task: 'set-slider', site: '%s', name: 'a', split: 'train', render() {} });"
    make_site(html, "design-a-01", {"set-slider.js": js % "design-a-01"}, {"set-slider": ["a"]})
    make_site(html, "base", {"set-slider.js": js % "base"}, {"set-slider": ["a"]})
    found = lint.lint_structure(["design-a-01", "base"])
    assert rules(found) == [("widget-template", "error")]
    assert found[0].site == "design-a-01" and found[0].file == "design-a-01/widgets/set-slider.js" and found[0].line == 1


@needs_node
def test_a_widget_or_site_naming_another_directory_is_an_error(html):
    js = "env.widget({ task: 'set-slider', site: 'design-b-01', name: 'a', split: 'train', template: 'set-slider/x' });"
    make_site(html, "design-a-01", {"set-slider.js": js}, {"set-slider": ["a"]}, site_js="env.site({ name: 'design-b-01', template: 'site/x' });")
    found = lint.lint_structure(["design-a-01"])
    # the widget of another site is not this site's widget, so its manifest entry is also drift
    assert rules(found) == [("manifest-drift", "error"), ("site-dir", "error"), ("site-dir", "error")]


@needs_node
def test_widgets_registered_in_a_loop_count_and_embedded_sub_widgets_need_no_manifest_entry(html):
    js = ("env.widget({ task: 'set-slider', site: 'design-a-01', name: 'design', split: 'train', template: 'set-slider/x' });\n"
          "for (const name of ['wheel', 'rgb']) {\n"
          "  env.widget({ task: 'set-slider', name, template: 'set-slider/base', design: { widget: name } });\n}")
    make_site(html, "design-a-01", {"set-slider.js": js}, {"set-slider": ["design"]})
    assert lint.lint_structure(["design-a-01"]) == []
    defs = manifests.load_defs(["design-a-01"])["design-a-01"]
    assert [s["name"] for s in defs["files"]["widgets/set-slider.js"]["widgets"]] == ["design", "wheel", "rgb"]
    assert manifests.drift("design-a-01", defs, manifests.read_manifest("design-a-01")) == []


@needs_node
def test_an_embedded_widget_without_design_widget_declares_no_site(html):
    js = "env.widget({ task: 'set-slider', name: 'a', template: 'set-slider/x', design: {} });"
    make_site(html, "design-a-01", {"set-slider.js": js})
    assert rules(lint.lint_structure(["design-a-01"])) == [("site-dir", "error")]


@needs_node
def test_a_task_file_must_register_its_own_task(html):
    js = "env.widget({ task: 'pick-color', site: 'design-a-01', name: 'a', split: 'train', template: 'pick-color/x' });"
    make_site(html, "design-a-01", {"set-slider.js": js}, {"pick-color": ["a"]})
    assert rules(lint.lint_structure(["design-a-01"])) == [("widget-task", "error")]


@needs_node
def test_manifest_drift_is_a_lint_error_and_fix_removes_it(html):
    js = "env.widget({ task: 'set-slider', site: 'design-a-01', name: 'a', split: 'train', template: 'set-slider/x' });"
    make_site(html, "design-a-01", {"set-slider.js": js}, {"set-slider": ["old"]})
    found = lint.lint_structure(["design-a-01"])
    assert rules(found) == [("manifest-drift", "error")] * 2
    defs = manifests.load_defs(["design-a-01"])["design-a-01"]
    manifests.write("design-a-01", manifests.fixed("design-a-01", defs, manifests.read_manifest("design-a-01")))
    assert lint.lint_structure(["design-a-01"]) == []
    assert json.loads((html / "sites" / "design-a-01" / "manifest.json").read_text())["widgets"] == {
        "set-slider": [{"name": "a", "split": "train"}]}


@needs_node
def test_a_file_that_does_not_load_is_an_error(html):
    make_site(html, "design-a-01", {"set-slider.js": "env.widget({ task: 'set-slider', "})
    assert ("widget-load", "error") in rules(lint.lint_structure(["design-a-01"]))


@needs_node
def test_a_nameless_template_widget_is_resolved_through_its_templates_make(html):
    (html / "templates" / "set-slider" / "base.js").write_text(
        "env.template('set-slider/base', (design, def) => [{ name: 'classic' }, { name: 'arc' }]);")
    js = "env.widget({ task: 'set-slider', site: 'base', template: 'set-slider/base', design: {} });"
    make_site(html, "base", {"set-slider.js": js}, {"set-slider": ["classic", "arc"]})
    assert lint.lint_structure(["base"]) == []
    (html / "sites" / "base" / "manifest.json").write_text(
        json.dumps({"site": "base", "widgets": {"set-slider": [{"name": "classic", "split": "train"}]}}))
    found = lint.lint_structure(["base"])
    assert [f.snippet for f in found] == ["set-slider/arc is registered but not in the manifest"]


@needs_node
def test_a_template_that_fails_to_run_warns_instead_of_failing(html):
    (html / "templates" / "set-slider" / "base.js").write_text(
        "env.template('set-slider/base', () => { throw new Error('boom'); });")
    js = "env.widget({ task: 'set-slider', site: 'base', template: 'set-slider/base', design: {} });"
    make_site(html, "base", {"set-slider.js": js}, {"set-slider": ["classic"]})
    assert rules(lint.lint_structure(["base"])) == [("widget-name", "warn")]


@needs_node
def test_trait_tests_style_derived_widgets_register_under_their_own_site(html):
    site_js = ("const registerWidget = env.widget;\nenv.widget = (d) => registerWidget.call(env, d);\n"
               "env.traitTests = { derive() { throw new Error('needs the base widgets'); } };\n"
               "env.site({ name: 'trait-tests' });")
    make_site(html, "trait-tests", {"set-slider.js": "env.traitTests.derive('set-slider', [{ name: 'x', base: 'classic' }]);"},
              {"set-slider": ["x"]}, split="test", site_js=site_js)
    (html / "sites" / "trait-tests" / "manifest.json").write_text(json.dumps(
        {"site": "trait-tests", "split": "test", "widgets": {"set-slider": [{"name": "x", "split": "test"}]}}))
    assert lint.lint_structure(["trait-tests"]) == []


@needs_node
def test_the_task_filter_keeps_only_that_tasks_findings(html):
    bad = "env.widget({ task: '%s', site: 'design-a-01', name: 'a', split: 'train' });"
    make_site(html, "design-a-01", {"set-slider.js": bad % "set-slider", "pick-color.js": bad % "pick-color"},
              {"set-slider": ["a"], "pick-color": ["a"]})
    assert {f.file for f in lint.lint_structure(["design-a-01"], "pick-color")} == {"design-a-01/widgets/pick-color.js"}


@needs_node
def test_a_ref_site_js_without_a_template_is_an_error_unless_it_is_in_the_frozen_list(html):
    js = "env.widget({ task: 'set-slider', site: '%s', name: 'a', split: 'train', template: 'set-slider/x', design: {} });"
    for name in ("design-a-01", "design-a-02", "base"):
        make_site(html, name, {"set-slider.js": js % name}, {"set-slider": ["a"]}, site_js=f"env.site({{ name: '{name}' }});")
    found = lint.lint_structure(["design-a-01", "design-a-02", "base"])
    assert rules(found) == [("site-template", "error"), ("site-template", "error")]  # reference is exempt
    (html / "sites" / lint.STANDALONE_SITE_JS).write_text("# frozen\ndesign-a-01  # a copy\n")
    found = lint.lint_structure(["design-a-01", "design-a-02", "base"])
    assert [(f.site, f.rule, f.severity) for f in found] == [("design-a-02", "site-template", "error")]
    assert found[0].file == "design-a-02/site.js"


@needs_node
def test_a_listed_site_that_became_a_design_is_only_a_warning(html):
    js = "env.widget({ task: 'set-slider', site: 'design-a-01', name: 'a', split: 'train', template: 'set-slider/x', design: {} });"
    make_site(html, "design-a-01", {"set-slider.js": js}, {"set-slider": ["a"]})  # site.js is a design
    (html / "sites" / lint.STANDALONE_SITE_JS).write_text("design-a-01\n")
    assert rules(lint.lint_structure(["design-a-01"])) == [("site-template", "warn")]


def test_the_frozen_list_may_shrink_but_not_grow_or_name_other_sites(html, monkeypatch):
    make_site(html, "design-a-01", {})
    make_site(html, "design-a-02", {})
    legacy = html / "sites" / lint.STANDALONE_SITE_JS
    monkeypatch.setattr(lint, "STANDALONE_SITE_JS_MAX", 2)
    legacy.write_text("design-a-01\ndesign-a-02\n")
    assert lint.lint_standalone_list() == []
    legacy.write_text("design-a-01\n")
    assert lint.lint_standalone_list() == []
    legacy.write_text("design-a-01\ndesign-a-02\ndesign-a-03\n")
    found = lint.lint_standalone_list()
    assert [f.snippet for f in found] == ["3 sites", "design-a-03"]  # too long, and design-a-03 does not exist
    legacy.unlink()
    assert lint.lint_standalone_list() == [] and lint.standalone_site_js() == []


def test_the_real_frozen_list_is_within_its_cap_and_names_real_sites():
    real = lint.standalone_site_js()
    assert 0 < len(real) <= lint.STANDALONE_SITE_JS_MAX
    assert lint.lint_standalone_list() == []
