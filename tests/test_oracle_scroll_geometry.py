"""Browser regressions for counted oracle scrolling and the runtime lint's offset guard."""
import pytest

from megawob import catalog, driver, lint

pytest.importorskip("playwright.sync_api")


@pytest.fixture(scope="module")
def page():
    with driver.browser() as browser:
        context = driver.new_context(browser, (1024, 640))
        yield context.new_page()
        context.close()


@pytest.mark.parametrize("axis", ["scrollLeft", "scrollTop"])
def test_runtime_lint_detects_scroll_offsets_without_dom_mutations(page, axis):
    page.set_content('<div id="pane" style="width:80px;height:80px;overflow:auto">'
                     '<div style="width:400px;height:400px"></div></div>')
    page.evaluate("""(axis) => {
      window.__env = {oracle() { document.querySelector('#pane')[axis] = 32; return {type: 'wait'}; }};
    }""", axis)
    page.evaluate(lint._OBSERVE)
    result = page.evaluate("() => __lint.step()")
    assert result["count"] == 1
    assert "scroll" in result["mutations"][0]
    assert "32" in result["mutations"][0]


def test_runtime_lint_checks_net_scroll_changes(page):
    page.set_content('<div id="pane" style="width:80px;height:80px;overflow:auto">'
                     '<div style="width:400px;height:400px"></div></div>')
    page.evaluate("""() => {
      window.__env = {oracle() {
        const pane = document.querySelector('#pane');
        pane.scrollTop = 32; pane.scrollTop = 0;
        return {type: 'wait'};
      }};
    }""")
    page.evaluate(lint._OBSERVE)
    assert page.evaluate("() => __lint.step().count") == 0


def test_clipped_email_folder_uses_separate_horizontal_wheel(page):
    widget = next(s for s in catalog.widgets(site="design-use-email-undo-01") if s.task == "use-email")
    driver.boot(page, widget, 0, startState="off", popups="off", judgment="off", finishByMessage="0")
    page.evaluate("""() => {
      const folder = __env.spec.folders.at(-1);
      __env.taskDef.plan = () => ({click: {folder}});
      window.folderTarget = folder;
    }""")
    page.evaluate(lint._OBSERVE)
    before = page.evaluate("() => document.querySelector('.am-side').scrollLeft")
    # Both direct lookup and oracle planning must be read-only, including offsets invisible to MutationObserver.
    page.evaluate("() => __env.widgetDef.locate({folder: window.folderTarget})")
    first = page.evaluate("() => __lint.step()")
    assert first["count"] == 0
    assert page.evaluate("() => document.querySelector('.am-side').scrollLeft") == before
    assert first["action"]["type"] == "wheel"
    assert first["action"]["dx"] > 0
    assert first["action"]["dy"] == 0
    driver.act(page, first["action"], 4)
    assert page.evaluate("() => document.querySelector('.am-side').scrollLeft") > before
    second = page.evaluate("() => __lint.step()")
    assert second["count"] == 0
    assert second["action"]["type"] == "click"
    driver.act(page, second["action"], 4)
    assert page.evaluate("() => __env.model.view === window.folderTarget")


@pytest.mark.parametrize("site,seed,knobs", [
    ("design-use-email-move-04", 2001, {"startState": "wrong"}),
    ("design-use-email-move-04", 3006, {"interruptions": "switch"}),
    ("design-use-email-move-04", 3009, {"reportFacts": "on", "interruptions": "switch", "pageFaults": "hang"}),
    ("design-use-email-move-04", 3010, {"reportFacts": "on", "replyFormat": "free", "instructionDisplay": "panel"}),
    ("design-use-email-move-03", 2001, {"startState": "wrong"}),
    ("design-use-email-move-03", 3010, {"reportFacts": "on", "replyFormat": "free", "instructionDisplay": "panel"}),
    ("design-use-email-archive-03", 2001, {"startState": "wrong"}),
    ("design-use-email-archive-03", 3006, {"interruptions": "switch"}),
    ("design-use-email-archive-03", 3010, {"reportFacts": "on", "replyFormat": "free"}),
])
def test_email_design_recovery_controls_and_layout(page, site, seed, knobs):
    widget = next(s for s in catalog.widgets(site=site) if s.task == "use-email")
    driver.boot(page, widget, seed, **knobs)
    status, _ = driver.run_oracle(page, 4)
    assert status["success"], status
    assert not status["score"]["violations"]
