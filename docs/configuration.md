# Configuration: MEGAWOB_* environment variables

Every environment variable MegaWoB reads. Set them before the env starts, for example
`MEGAWOB_REWARD=shaped python train.py`, or with `docker run -e MEGAWOB_REWARD=shaped ...` for the OpenEnv server.

- **Precedence.** A variable you set beats the preset's value, which beats the default.
- **Bad values** fail on first use, with an error that names the variable.
- **Per env.** To configure one env in code instead, see [For code](#for-code) at the end.

## Run mode

| Variable | Values (default first) | Effect |
|---|---|---|
| `MEGAWOB_REWARD` | `binary` \| `dense` \| `shaped` | reward the task returns (MiniWoB's 0/1, graded score at the end, per-step progress plus a success bonus) |
| `MEGAWOB_SHAPING`, `MEGAWOB_SUCCESS_BONUS` | `1.0` each | weights of the shaped reward |
| `MEGAWOB_EFFICIENCY` | `0` (off) to `1` | scales the success reward down for wasted actions ([below](#efficiency)) |
| `MEGAWOB_PRESET` | `default` \| `small` | `small`: a curriculum for small models: shaped reward, mostly easy and medium difficulty, more partial starts, lighter popups, no judgment episodes, instruction noise or split drags |
| `MEGAWOB_INTERFACE` | `both` \| `pixel` \| `dom` | `pixel`: coordinate actions and the screenshot only; `dom`: element actions, DOM and accessibility tree, no screenshot, drags in one action |
| `MEGAWOB_REUSE` | `1` \| `0` | reset reuses the open page and browser (about half the reset time; `tests/test_reuse_parity.py` checks the episodes match); `0` relaunches per reset |
| `MEGAWOB_STEP_MS` | `1000` | task time per action in `clock=step` (page param `stepms`); weights allowed (`500:.5,1000:.5`) |
| `MEGAWOB_CLOCK` | `step` \| `action` \| `real` | how task time moves ([below](#clock-modes)) |
| `MEGAWOB_TIMESCALE` | `1` | wall-clock slowdown in `clock=real` (0.25 = four times slower) |
| `MEGAWOB_VIEWPORTS` | five training sizes | comma list of `WxH` sampled per episode (ignored when the env is created with a viewport, as OpenEnv does) |
| `MEGAWOB_DEVICE_SCALE` | `1` | device scale factor of the screenshot, sampled per episode (`check.py --dsf`; page param `deviceScale`) |

## Randomization parameters

Sampled per episode from the seed. What each value does, with screenshots, is in [randomization.md](randomization.md).

- **Values.** A value is one option (`cookie`) or weights (`off:.6,solved:.4`).
- **Other ways to set one.** Each parameter is also a page URL param and an option of the JavaScript
  `window.__env.reset()` API, under the name in the Param column. Python interfaces use the routes
  in [For code](#for-code).
- **Recorded as.** The episode record (`info["task_info"]["megawob"]["episode"]`) stores each one under the short name
  in the last column.
- **Not every task** uses every parameter: judgment, report facts, silent failures and answer-in need a task feature
  ([tasks.md](tasks.md#eval-perturbations)).

| Variable | Param | Values (default first) | Effect | Recorded as |
|---|---|---|---|---|
| `MEGAWOB_INSTRUCTION_DISPLAY` | `instructionDisplay` | `hidden` (default) \| `header` \| `panel` \| `toast`, or weights like `hidden:.5,header:.5` | where the instruction shows (`hidden`: only in the goal text) | `instr` |
| `MEGAWOB_FINISH_BY_MESSAGE` | `finishByMessage` | `0:.8,1:.2` | `1`: no end control, the agent ends the episode with `send_msg_to_user` | `finish` |
| `MEGAWOB_START_STATE` | `startState` | `off:.6,partial:.15,wrong:.15,solved:.1` | how the page starts; `scene` (the design's mid-task screen) is eval-only | `start` |
| `MEGAWOB_POPUPS` | `popups` | `off:.7,cookie,toast,chat,promo,banner` (.06 each) | a popup over the page, at the 0th-3rd action | `perturb` |
| `MEGAWOB_DIFFICULTY` | `difficulty` | `normal` \| `easy` \| `medium` | easier rungs of a task (`normal` is the task as designed) | `level` |
| `MEGAWOB_COMPOSITION` | `composition` | `train` \| `heldout` | which task combinations and step orders composite tasks draw | `compose` |
| `MEGAWOB_UNDECLARED_INPUT` | `undeclaredInput` | `reject` \| `void` | undeclared input is swallowed and reported, or ends the episode with reward 0 | `stray` |
| `MEGAWOB_JUDGMENT` | `judgment` | `off:.92,ambiguous,impossible,confirm` | judgment episodes: the agent should ask, report or stop | `judge` |
| `MEGAWOB_INSTRUCTION_NOISE` | `instructionNoise` | `off:.85,terse,typo,chatter,mixed` | the instruction as people type it | `messy` |
| `MEGAWOB_DRAG_STEPS` | `dragSteps` | `atomic:.85,split:.15` | `split`: press, move and release are separate actions | `drag` |
| `MEGAWOB_PAGE_FAULTS` | `pageFaults` | `off:.9,miss,revert,clear,hang,shift` | one page fault per episode | `fault` |
| `MEGAWOB_REPORT_FACTS` | `reportFacts` | `off:.95,on:.05` | end with a message stating facts read off the page | `report` |
| `MEGAWOB_SILENT_FAILURES` | `silentFailures` | `off:.96,on:.04` | the page saves a believably wrong version of a change | `silent` |
| `MEGAWOB_INTERRUPTIONS` | `interruptions` | `off:.95,cancel:.025,switch:.025` | the user interrupts: stop and report, or a new goal | `preempt` |
| `MEGAWOB_SAFETY_HAZARDS` | `safetyHazards` | `off:.95,on:.05`, or a hazard kind | a safety hazard over the page; taking the bait ends the episode with reward 0 | `safety` |
| `MEGAWOB_REPLY_FORMAT` | `replyFormat` | `auto` \| `structured` \| `free` | how the ending message is graded | `reply` |
| `MEGAWOB_ANSWER_IN` | `answerIn` | `field:.95,reply:.05` | the answer goes in a field on the page, or in the ending message | `answer` |
| `MEGAWOB_CURSOR_LAG` | `cursorLag` | unset \| `1` | the drawn cursor lags one action (a page option, not randomized) | – |

Two more params have no variable: `instructionSplit` and `contentSplit` (`train` \| `heldout`, fixed to `train`
in training; the `.eval-instructions` and `.eval-content` task names set them), recorded as `isplit` and `csplit`.

## Screenshots and screen transforms (OpenEnv server)

| Variable | Values (default first) | Effect |
|---|---|---|
| `MEGAWOB_SCREENSHOT` | `1` (`0` with `MEGAWOB_INTERFACE=dom`) \| `0` | put an encoded frame in `observation.metadata["megawob_screenshot"]` |
| `MEGAWOB_SCREENSHOT_FORMAT` | `png` \| `jpeg` \| `webp` | encoding |
| `MEGAWOB_SCREENSHOT_QUALITY` | `90` | jpeg / webp quality |
| `MEGAWOB_SCREENSHOT_WIDTH` | `0` (keep) | downscale before encoding; coordinates stay screenshot px |
| `MEGAWOB_REMOTE_DESKTOP` | `off` \| `citrix` \| `rdp` \| `vnc` \| `lowres` \| `mixed`, or weights | seeded remote-desktop transform of the agent's screenshot (`megawob/screen.py`) |

## Paths

| Variable | Default | Effect |
|---|---|---|
| `MEGAWOB_HTML` | `megawob/html` (a built wheel), else `html/` next to the package | pages directory; `megawob.catalog` raises an error naming it when none is found |
| `MEGAWOB_URL` | unset (`file://` to the pages) | serve pages over HTTP from this base URL |

## Clock modes

Task time is what timed tasks (things that move, load or expire) run on.

- **`step`** (default): each agent action is `MEGAWOB_STEP_MS` of task time, so how long the model thinks never
  matters.
- **`action`**: like `step`, and every CSS animation and transition is also paused and advanced per action, with the
  text caret hidden. The screenshot then depends only on the actions taken. A vendor library's `setTimeout` still
  follows wall time, and a few edge pixels may differ slightly between runs.
- **`real`**: task time follows the wall clock, for people playing a page. `MEGAWOB_TIMESCALE` slows it down.

## Efficiency

With `MEGAWOB_EFFICIENCY=w` (at most 1), a successful episode's reward is multiplied by
`1 - w * min(1, extra / 40)`, where `extra = max(0, agent_steps - oracle_steps - 2)`.

- The agent gets two free actions (to read, scroll or hover), then pays the same cost for each wasted action on
  every task.
- `oracle_steps` comes from the oracle replaying the same episode (seed, scenario, parameters, viewport, device scale)
  in a separate browser context, so popups, faults or an easier start count for both. Both counts are env steps.
- In shaped mode only the success bonus is scaled. If the replay fails, nothing is scaled.
- `info["task_info"]["megawob"]` reports `agent_steps`, `oracle_steps` and `efficiency`.

## For code

### BrowserGym (Python)

Pass task settings through `gym.make(..., task_kwargs=...)`. Use `knobs` for randomization parameters, with the
names in the Param column; `reward` and `scenario` are separate task kwargs:

```python
import gymnasium as gym
import megawob.tasks

env = gym.make(
    "browsergym/miniwob.set-slider.base",
    headless=True,
    task_kwargs={"reward": "shaped", "knobs": {"popups": "cookie", "startState": "off"}},
)
try:
    obs, info = env.reset(seed=0)
    print(info["task_info"]["megawob"]["episode"])
finally:
    env.close()
```

These task kwargs apply to every reset of this env; to change them, create another env.
Do not pass page parameters such as `popups` directly to Python `env.reset()`.

For randomization parameters, the order from highest to lowest priority is:

1. Explicit `task_kwargs["knobs"]`.
2. The task name's eval perturbation.
3. Environment variable.
4. Preset.
5. Default.

An explicit `task_kwargs["reward"]` overrides the configured reward.
DOM-only mode forces atomic drags even if `dragSteps` requests split drags.

`catalog.config()` reads the process environment on first use and caches it; set environment variables before
importing `megawob.tasks`. For an independent configuration, pass `task_kwargs["config"]` built with
`catalog.Config.from_env({...})`. An explicit mapping replaces the process environment rather than merging it:

```python
from megawob import catalog

config = catalog.Config.from_env({"MEGAWOB_PRESET": "small", "MEGAWOB_POPUPS": "cookie"})
# Use task_kwargs={"config": config} in gym.make(...).
```

### OpenEnv (Python client, settings on the server)

Set `MEGAWOB_*` variables on the server container, before the image name:

```bash
docker run --rm -p 8000:8000 --shm-size=1g \
  -e MEGAWOB_REWARD=shaped -e MEGAWOB_POPUPS=cookie \
  ghcr.io/d-nyamkhuu/megawob
```

Then the client selects the task and seed with `await env.reset(task_name="set-slider.base", seed=0)`.
The pinned client does not expose MegaWoB's `knobs` or `config` task kwargs; setting environment variables in the
client process does not change a remote server. Restart the container with different variables to change these
settings. A task name such as `set-slider.eval-popups` overrides the corresponding configured parameter.
See the [runnable client example](../README.md#openenv-server) for installation and connection setup.

### Page API (JavaScript)

On an already loaded `html/play.html` page, run this in the browser's developer console:

```js
window.__env.reset(0, undefined, {popups: 'cookie', startState: 'off'});
```

The arguments are seed, optional scenario, and page parameters. This resets the current task and widget; it does
not select a different site. Explicit reset options override the URL parameters; omitted options fall back to the
URL, not the previous reset. To open a page with those settings instead, use a URL such as:

```text
html/play.html?task=set-slider&site=base&seed=0&popups=cookie&startState=off
```

The page API controls the episode inside the browser. The Python harness chooses the returned reward mode;
`MEGAWOB_*` process variables are not read by a page opened directly in a browser.
