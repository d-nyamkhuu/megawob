"""megawob: seeded drag and precise-mouse-control tasks, served as drop-in MiniWoB++ tasks for BrowserGym.

`import megawob.tasks` registers them with BrowserGym; `megawob.catalog` has no heavy imports.
"""
from importlib.metadata import PackageNotFoundError, version

try:
    __version__ = version("megawob")  # the version in pyproject.toml, the single source
except PackageNotFoundError:  # running from a checkout that was never installed
    __version__ = "0+unknown"
