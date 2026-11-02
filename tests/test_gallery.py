"""Tests for megawob.gallery's data: the grid's categories and the viewer's parameter list. No browser:
`python -m pytest tests/test_gallery.py`."""
from megawob import catalog, gallery


def test_every_task_has_one_category():
    listed = [t for _, _, ts in gallery.CATEGORIES for t in ts]
    assert sorted(listed) == sorted(set(listed)), "a task is in two categories"
    assert sorted(listed) == sorted(catalog.tasks()), "gallery.CATEGORIES and the tasks differ"


def test_every_viewer_parameter_is_described():
    assert set(gallery.KNOB_INFO) == set(gallery.VIEWER_KNOBS) - {"clock"}
    assert [k["name"] for k in gallery.knob_options()] == list(gallery.KNOB_INFO)
