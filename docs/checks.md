# Checks and tools

Every command that checks MegaWoB or helps you build it, run from the repo root. The ones CI runs, and what a
pull request needs, are in [CONTRIBUTING.md](../CONTRIBUTING.md). Environment variables are in
[configuration.md](configuration.md).

## Setup

```bash
./install.sh                         # everything below, plus Chromium
pip install -e '.[browsergym]'       # BrowserGym (browsergym-core and browsergym-miniwob 0.14.3)
pip install -e '.[check]'            # Playwright 1.58 over BrowserGym's 1.44 pin (pip warns; see below)
playwright install chromium
pip install -e '.[dev]'              # pytest and ruff
```

- **Why two installs.** BrowserGym pins Playwright 1.44, whose Chromium 125 deadlocks. The `check` extra installs
  1.58 on top. One `pip install` cannot resolve both, so pip prints a warning, which you can ignore.
- **Other extras.** `baselines` adds the LLM harness, and `serve` adds the PyPI parts of the OpenEnv server. OpenEnv's
  client is `openenv-browsergym_env`; its pinned commit is in `server/Dockerfile`.
- **The pages.** They live in `html/` (about 360 MB). A built wheel copies them to `megawob/html` (about 250 MB,
  too big for PyPI), so install from a checkout or with `pip install git+...`. `MEGAWOB_HTML` points at another
  copy.
- **Without installing.** Run from the repo root with `PYTHONPATH=$PWD`.
- **Node 22+** is needed for the kit unit tests, the contract lint and `tools/sitegen`.

## The checks

| Command | What it checks | Time |
|---|---|---|
| `python -m megawob.check --site <site>` | the oracle solves every widget of a site at every training viewport, with the randomization parameters sampled and swept | minutes |
| `python -m megawob.check --task <task> --seeds 25` | one task on every site | minutes to hours |
| `python -m megawob.lint` | static contract lint of every page, then `ruff check` | ~30 s |
| `python -m megawob.lint --runtime --site <site>` | also follows the oracle: `locate()` that changes the DOM, off-screen points, links or forms that navigate | minutes |
| `node --test tests/kit/*.test.mjs` | kit unit tests, no browser | ~1 min |
| `python -m pytest -q tests` | Python unit tests | ~1 min |
| `python server/smoke_gym.py <task>` | the oracle through BrowserGym action strings, every scenario | minutes |
| `python -m megawob.audit --site base --seeds 6` | no-op, random and half-done endings must not pass | minutes |
| `python -m megawob.hackcheck --task <task>` | scripted cheats against message endings (hedges, page dumps, sprays) stay at or below 5% | minutes |
| `python -m megawob.golden capture DIR` and `compare BEFORE AFTER` | whether a change altered any episode ([kit guide](../html/kit/README.md#testing-a-kit-change)) | ~6 min |
| `python -m megawob.precision --site base --seeds 6` | the oracle with pointer noise: tasks too precise for a pixel policy ([baselines](../baselines/README.md#precision-probe)) | minutes |

### Checker

`python -m megawob.check` runs the oracle on widgets and fails on anything that keeps it from solving an episode.
With no arguments it checks every widget of every site, which takes many hours.

| Flag | Effect |
|---|---|
| `--site <site>`, `--sites 'design-*'` | one site, or a pattern of sites |
| `--task <task>`, `--widget <name>` | narrow the run |
| `--seeds N` | seeds per widget and viewport |
| `--viewports 1024x640 1280x720` | viewports to run (default: the five training viewports) |
| `--dsf 1 1.5 2` | device scale factors |
| `--screens DIR` | save screenshots to look at |
| `--fail-fast` | stop at the first failure (quick screens) |
| `--lint` | also run the static lint on the sites; lint errors fail the run |
| `--matrix` | print the task x site coverage matrix (very wide with design-* sites) |
| `--jobs N` | cells in parallel (default: half the CPUs, at most 8); `--jobs 1` is sequential |
| `--frame-limit` | keep Chromium's frame-rate limit: up to ~35% less CPU on typing-heavy sites |
| `--plain-only` | only the parameter-mix episodes, without the per-scenario runs and parameter sweeps |
| `--first SEED ...` | run these seeds first in each cell (to reproduce a failure quickly) |
| `--headed`, `--steps N` | show the browser; mouse moves per drag |
| `--index` | write `html/index.html` and exit |

`--seed` and `--viewport` are accepted as short forms of `--seeds` and `--viewports`.

### Lint

`python -m megawob.lint [--site 'design-use-*'] [--verbose]` loads every `site.js` and widget file in a Node
recorder (`megawob/widgetdefs.mjs`) and checks what the checker cannot see, because the checker reads `__env` and
not the page:

- a widget that shows the task's `error()` or `tolerance()` verdict on the page;
- a page button that calls `__env.reset`;
- `<a href="#">` links that change the page URL (BrowserGym then ends the episode with reward 0);
- a `locate()` that changes the DOM;
- a task that defines its own copy of an `env.util` helper (`util-copy`).

It also enforces the template pattern:

- every design-* widget is a design on a template;
- every design-* `site.js` is a design on a site template, except the frozen list in
  `html/sites/STANDALONE_SITE_JS.txt` (shrink that list, never grow it);
- `site` names match their directory;
- each manifest matches its widget files. `python -m megawob.manifests [--fix]` checks, or rewrites, the manifests.

The rules and the allow comment (`// megawob-lint: allow <rule> reason`) are listed in the `megawob/lint.py`
docstring. A full run ends with `ruff check`; `--no-ruff` skips it.

### smoke_gym.py

`server/smoke_gym.py` plays the oracle through BrowserGym action strings, every scenario of the widget the seed
picks (the checker covers every widget).

```bash
python server/smoke_gym.py [task ...] [--seeds 0 1]   # with randomization parameters
python server/smoke_gym.py --plain                    # without them: classic MiniWoB-like episodes
python server/smoke_gym.py set-slider --set startState=wrong
MEGAWOB_REWARD=shaped python server/smoke_gym.py      # shaped returns must be 2.0 (1.0 for solved starts)
```

It needs BrowserGym and gymnasium. If your Python lacks them, run it in the Docker image with your working tree
mounted over the image's copy (`/opt/megawob`). The mount brings in your current code, so rebuild only when the
Dockerfile or its dependencies change. `$U` runs the container as you, so files it writes (such as
`__pycache__`) stay yours:

```bash
docker build -f server/Dockerfile -t megawob .        # once, a few minutes
U="-u $(id -u):$(id -g) -e HOME=/tmp"
docker run --rm --shm-size=1g $U -v "$PWD":/opt/megawob --entrypoint python megawob \
  /opt/megawob/server/smoke_gym.py set-slider use-email --seeds 0 1
```

The image has no pytest. To run `tests/test_reuse_parity.py` in it, install pytest on the host with
`pip install --target /tmp/pt pytest` and mount it:

```bash
docker run --rm --shm-size=1g $U -v "$PWD":/opt/megawob -v /tmp/pt:/pt -w /opt/megawob \
  -e PYTHONPATH=/opt/megawob:/pt --entrypoint python megawob -m pytest -q tests/test_reuse_parity.py
```

### OpenEnv server

```bash
docker run --rm -p 8000:8000 --shm-size=1g megawob    # every site on :8000
python server/smoke_client.py http://localhost:8000    # every task through the OpenEnv client
```

## Generated files

Rerun these after the change named:

| Command | Writes | Rerun after |
|---|---|---|
| `python -m megawob.scenarios [--site 'design-*'] [--check]` | `html/scenarios.json`: each widget's scenarios, and each task's start modes, judgment modes, hooks and drags | changing a widget's or task's scenarios, `startModes`, `judgeModes` or hooks (the checker fails stale entries) |
| `python -m megawob.describe --markdown docs/tasks.md` | `docs/tasks.md` | changing a task's header, scenarios or instructions |
| `python -m megawob.manifests --fix` | `sites/*/manifest.json` | adding or renaming widgets |
| `python -m megawob.catalog` | nothing: prints the counts | take every number in a doc from here |

## Looking at pages

```bash
python -m megawob.gallery --serve                     # every task x scenario x site on :8765
python -m megawob.gallery --player-check --site base  # where the viewer's oracle differs from the real one
```

- The gallery lets you play an episode, shows the reward of each of your actions, and can let the oracle play.
- Its oracle sends synthetic DOM events (`megawob/gallery_input.js`), not browser input: CSS `:hover` does not
  follow them, and code that checks `event.isTrusted` ignores them. Use it to look, never as proof that a widget
  passes.
- Over `file://` the gallery cannot reach its iframe. Use `--serve`.
- To open one page directly, and for the URL parameters, see the
  [kit guide](../html/kit/README.md#debugging-a-page).

## Long runs

A full check is every widget at five viewports. The base site alone (128 widgets, 640 cells) takes minutes with
`--jobs 8`. Each job is a process with its own Chromium (~400 MB), so lower `--jobs` when memory is short.

- Wrap long runs in `timeout`, set `PYTHONUNBUFFERED=1` when writing to a log, and keep one log per task, so a hang
  points at its task.
- Do not edit kit or widget files while a run is loading pages. An episode can load a half-written `env.js` and
  wait forever.
- A hung run sits near 0% CPU. To tell stuck from slow, compare the CPU time of its processes over a few minutes
  (`/proc/<pid>/stat` fields 14 and 15).
- When you match processes with `pgrep -f`, use a pattern that cannot match your own command line
  (`megawob[.]check`, not `megawob.check`). Kill by PID, not with `pkill -f`.
- `py-spy dump --pid <pid>` shows where a hung Python run is blocked.

`smoke_gym.py` has no `--jobs`. To run every task in parallel, run one process per task in the Docker image (see
above), with the logs in a mounted directory:

```bash
S=/tmp/megawob-smoke; mkdir -p $S
docker run --rm --shm-size=2g $U -v "$PWD":/opt/megawob -v $S:/logs -w /opt/megawob -e MEGAWOB_REWARD=shaped \
  --entrypoint sh megawob -c '
export PYTHONUNBUFFERED=1 S=/logs
python -c "from megawob import catalog; print(\" \".join(sorted(k + \".base\" for k in catalog.task_names() if \".\" not in k)))" \
  | tr " " "\n" | xargs -P 5 -I{} sh -c "timeout 600 python server/smoke_gym.py {} --seeds 2 3 > $S/{}.log 2>&1; echo \"{} exit=\$?\""'
grep -h "return=" $S/*.log | grep -v " OK "     # failures; exit=124 means that task timed out
```
