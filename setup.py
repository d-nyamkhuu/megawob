"""Build hook: a wheel carries the pages (html/) as megawob/html, which megawob.catalog finds next to itself.

The pages live in html/ at the repository root (a checkout, an editable install and the Docker image read them
there), so setuptools cannot list them as package data; build_py copies them into the build tree instead, minus the
generated, gitignored files. Everything else is in pyproject.toml.
"""
import shutil
from pathlib import Path

from setuptools import setup
from setuptools.command.build_py import build_py

GENERATED = ("index.html", "gallery.html", "gallery", "scenarios.lock", "__pycache__")


class BuildPy(build_py):
    def run(self):
        super().run()
        src = Path(__file__).resolve().parent / "html"
        if src.is_dir() and not self.editable_mode:
            dest = Path(self.build_lib) / "megawob" / "html"
            shutil.rmtree(dest, ignore_errors=True)
            shutil.copytree(src, dest, ignore=shutil.ignore_patterns(*GENERATED))


setup(cmdclass={"build_py": BuildPy})
