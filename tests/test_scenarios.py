"""Tests for megawob.scenarios' pure part: how a page's READ result becomes a task's entry in html/scenarios.json.
No browser: `python -m pytest tests/test_scenarios.py`."""
from megawob import catalog, scenarios


def test_task_entry_from_a_page_read():
    got = {"task": ["a", "b"], "heldout": ["b"], "widget": ["a"], "startModes": ["off", "solved"],
           "judgeModes": ["impossible"], "hooks": ["silent", "facts"]}
    entry = scenarios.task_entry("scroll-page", got)
    assert entry == {"scenarios": ["a", "b"], "heldout": ["b"], "startModes": ["off", "solved"],
                     "judgeModes": ["impossible"], "hooks": ["facts", "silent"], "drags": True}


def test_source_drags_reads_the_plan_steps_of_logic_js(tmp_path, monkeypatch):
    for name, body in {"dragger": "plan() { return [{ drag: [a, b] }]; }", "walker": "plan() { return [{ path: [p] }]; }",
                       "clicker": "plan() { return [{ click: [a] }]; } // no dragging, a path: 'x'"}.items():
        (tmp_path / "tasks" / name).mkdir(parents=True)
        (tmp_path / "tasks" / name / "logic.js").write_text(body)
    monkeypatch.setattr(catalog, "HTML", tmp_path)
    assert scenarios.source_drags("dragger") and scenarios.source_drags("walker")
    assert not scenarios.source_drags("clicker")


def test_the_real_index_entries_are_what_the_pages_would_say():
    """Every task's entry has the shape task_entry() writes (a hand edit, an old index or a task added without
    `python -m megawob.scenarios` fails here)."""
    index = catalog.scenarios_index()["tasks"]
    for task in catalog.tasks():
        entry = index[task]
        assert list(entry) == ["scenarios", "heldout", "startModes", "judgeModes", "hooks", "drags"], task
        assert entry["hooks"] == sorted(entry["hooks"]), task
        assert "off" in entry["startModes"], task
        assert entry["drags"] == scenarios.source_drags(task), task
