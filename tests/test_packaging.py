"""Exercise the installed distribution, including its Node helper and real page assets."""
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile
import zipfile

import pytest


ROOT = Path(__file__).resolve().parents[1]


@pytest.mark.skipif(not shutil.which("node"), reason="installed manifest validation needs Node")
def test_sdist_wheel_installs_page_assets_and_manifest_validator(tmp_path):
    pytest.importorskip("setuptools")
    pytest.importorskip("wheel")
    source = tmp_path / "source"
    source.mkdir()
    for name in ("pyproject.toml", "setup.py", "MANIFEST.in", "README.md", "LICENSE"):
        shutil.copy2(ROOT / name, source / name)
    shutil.copytree(ROOT / "megawob", source / "megawob", ignore=shutil.ignore_patterns("__pycache__"))
    # Keep this build small while using the actual base site, templates, and tasks.
    # The installed tools must resolve their recorder and HTML from the wheel.
    for name in ("kit", "tasks", "templates", "sites/base"):
        shutil.copytree(ROOT / "html" / name, source / "html" / name)
    for name in ("play.html", "scenarios.json"):
        shutil.copy2(ROOT / "html" / name, source / "html" / name)

    env = {key: value for key, value in os.environ.items()
           if key != "PYTHONPATH" and not key.startswith("MEGAWOB_")}

    def run(*args, cwd=tmp_path, run_env=env):
        result = subprocess.run([sys.executable, *args], cwd=cwd, env=run_env,
                                capture_output=True, text=True, timeout=120)
        assert result.returncode == 0, result.stdout + result.stderr
        return result.stdout

    dist = tmp_path / "dist"
    dist.mkdir()
    run("-c", "from setuptools.build_meta import build_sdist; build_sdist('../dist')", cwd=source)
    sdist = next(dist.glob("*.tar.gz"))
    unpacked = tmp_path / "unpacked"
    with tarfile.open(sdist) as archive:
        assert any(name.endswith("/megawob/widgetdefs.mjs") for name in archive.getnames())
        options = {"filter": "data"} if hasattr(tarfile, "data_filter") else {}
        archive.extractall(unpacked, **options)
    wheel_source = next(unpacked.iterdir())
    run("-c", "from setuptools.build_meta import build_wheel; build_wheel('../../dist')", cwd=wheel_source)
    wheel = next(dist.glob("*.whl"))
    shipped = ("megawob/widgetdefs.mjs", "megawob/gallery_input.js", "megawob/html/play.html", "megawob/html/scenarios.json",
               "megawob/html/kit/env.js", "megawob/html/tasks/set-slider/logic.js",
               "megawob/html/templates/set-slider/base.js", "megawob/html/sites/base/manifest.json")
    with zipfile.ZipFile(wheel) as archive:
        assert set(shipped) <= set(archive.namelist())

    installed = tmp_path / "installed"
    run("-m", "pip", "install", "--no-deps", "--no-compile", "--target", str(installed), str(wheel))
    installed_env = {**env, "PYTHONPATH": str(installed)}
    run("-c", "from pathlib import Path; from megawob import catalog, manifests; "
        f"assert catalog.HTML == Path({str(installed / 'megawob' / 'html')!r}); "
        "assert manifests.RECORDER.is_file(); "
        "defs = manifests.load_defs(['base']); "
        "assert len(manifests.registered('base', defs['base'])[0]) > 0", run_env=installed_env)
    output = run("-m", "megawob.manifests", "--site", "base", run_env=installed_env)
    assert "1 sites, 0 with a manifest" in output
    run("-m", "megawob.lint", "--site", "base", "--rule", "manifest-drift", "--no-ruff",
        run_env=installed_env)
