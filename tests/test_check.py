"""The checker's command line and defaults (no browser): `python -m pytest tests/test_check.py`."""
from megawob import catalog, check


def test_default_viewports_are_the_five_training_ones(monkeypatch):
    monkeypatch.setenv("MEGAWOB_VIEWPORTS", "800x600")
    catalog.config(refresh=True)  # a trainer's setting must not change what the checker covers
    try:
        args = check.build_parser().parse_args([])
        assert args.viewports == list(catalog.TRAINING_VIEWPORTS)
        assert args.viewports == ["1024x640", "1280x720", "1366x768", "1440x900", "1536x864"]
        assert check.build_parser().parse_args(["--viewports", "800x600"]).viewports == ["800x600"]
    finally:
        monkeypatch.undo()
        catalog.config(refresh=True)


def test_viewports_ignore_the_environment_at_import():
    import os
    import subprocess
    import sys

    code = "from megawob import check\nprint(check.VIEWPORTS)"
    out = subprocess.run([sys.executable, "-c", code], env={**os.environ, "MEGAWOB_VIEWPORTS": "800x600"},
                         capture_output=True, text=True)
    assert out.returncode == 0, out.stderr
    assert eval(out.stdout) == [(1024, 640), (1280, 720), (1366, 768), (1440, 900), (1536, 864)]
