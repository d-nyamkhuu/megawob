# Glossary

The terms the MegaWoB docs and code use. Where a term has a standard meaning in reinforcement learning or in MiniWoB++,
MegaWoB uses it in that sense. Names in `code` are the ones in the API, file names and URLs.

## The pieces of a page

| Term | Meaning |
|---|---|
| **task** | One kind of job, such as setting a slider or replying to an email (`html/tasks/<task>/logic.js`). It samples the episode, grades the result and plans the oracle. Its id (verb-object, as in MiniWoB++) is the same everywhere: folder, `--task`, `browsergym/miniwob.set-slider`. |
| **model** | The task's own record of the page state (a slider's value, the emails' flags). The widget updates it; the task grades it. Not to be confused with the AI model being trained. |
| **scenario** | A sub-case of a task, such as `use-email/attachment` or `set-slider/range`. Each one has its own sampling and instruction. MiniWoB++ would make each scenario a separate task name; MegaWoB samples one per episode. |
| **site** | A page design (`html/sites/<site>/site.js`). It sets the frame around the task: theme, header, where the instruction appears, end control, decoy controls and popups. |
| **widget** | How one site draws one task's interactive part, plus `locate()`, which tells the oracle where each target is on screen (`html/sites/<site>/widgets/<task>.js`). A site can have several widgets for one task; the base site has seven slider widgets. |
| **frame** | The UI a site draws around the stage: header, navigation, instruction panel, end control (`site.frame(ctx)`). |
| **stage** | The part of the page the widget draws into. |
| **end control** | The button that ends an episode (Submit, Save, Done, ...). Finish-by-message episodes have none: the agent ends them with a message. |
| **UI primitives** | Headless helpers in the kit (`env.ui`: draggable, slider, sortable, calendar, ...). They own the input mechanics; the widget owns every pixel. Called primitives, never widgets. |
| **kit** | The shared runtime every page loads (`html/kit/`): seeded RNG, scoring, the oracle runner, randomization parameters, content banks and the UI primitives. |
| **template** | Shared widget or site code with named parts (`html/templates/`). A design-* site usually overrides a few parts of a template rather than writing a widget from scratch. |
| **content bank** | Seeded lists of names, products, places, texts and so on (`html/kit/content/`) that tasks draw from. |
| **trait** | A task-defined fact about a widget's controls that the task needs for sampling or planning, declared by the widget (`traits: { controls: 'wheel+value' }` on a colour widget). `trait-tests` checks traits that no base widget declares. |

## Sites

| Term | Meaning |
|---|---|
| **`base`** | The plain site that supports every scenario of every task. |
| **design** | A page design built from one design image (a model-generated picture of an imagined application, never a screenshot of a real product). |
| **`design-<task>-<scenario>-NN`** | A single-design site: one design for one task scenario, numbered from 01. |
| **`mock-checkout`, `mock-inbox`, `mock-settings`** | Frozen eval-only sites of made-up apps. They are never used for training. |
| **`trait-tests`** | A checker-only site that re-registers base widgets with extra traits. It is never trained on or evaluated. |

## Episodes and rewards

| Term | Meaning |
|---|---|
| **episode** | One run of a task from reset to the end control, a finish message, a task-side ending (a wrong final choice, a timeout), a violation or the step limit. As in RL. |
| **seed** | The integer that fixes everything random in an episode: the site and widget a task name picks, the scenario, the randomization parameters, the content and the start state. The same seed always gives the same episode. As in RL. |
| **randomization parameters** | Per-episode factors drawn from the seed, as in domain randomization: where the instruction appears, the start state, popups, difficulty and more ([randomization.md](randomization.md)). Each is a URL param, a reset option and a `MEGAWOB_<NAME>` variable ([configuration.md](configuration.md)). The code calls them knobs. |
| **start state** | How the page starts: `off` (clearly off target), `partial`, `wrong`, `solved`, or `scene` (the design image's unsolved mid-task screen, for tasks that support it). |
| **finish by message** | An episode with no end control: the agent ends it with `send_msg_to_user`. The code calls this finish mode (`ctx.finish`). In any episode the agent may end with a message instead of the end control. |
| **judgment episode** | An episode where doing what the instruction says is wrong: the goal is ambiguous, impossible or needs confirmation, and the agent should ask, report or stop (`judgment`). |
| **oracle** | The scripted policy that solves every episode from the page state. The checker runs it on every widget, so every episode is known to be solvable. As in RL and imitation learning. |
| **checker** | `python -m megawob.check`: runs the oracle on widgets at every training viewport and fails on anything that keeps it from solving an episode ([checks.md](checks.md)). |
| **binary reward** | 1 on success, else 0, at the end. MiniWoB++'s reward. |
| **dense reward** | The graded score at the end of the episode. |
| **shaped reward** | The change in progress after each step, plus a success bonus. |
| **error** and **tolerance** | A task grades its result in task units (pixels, degrees, CIEDE2000 colour difference, IoU, edit distance, Kendall tau, subgoals). Success means the error is within the tolerance. |
| **undeclared input** | Input a task does not allow, such as a wheel event on a page without scrolling. By default it is swallowed and reported; with `undeclaredInput=void` it ends the episode with reward 0. |

## Splits and evaluation

| Term | Meaning |
|---|---|
| **split** | Every widget is in one of three splits: `train`, `heldout` (frozen designs and the mock sites, used only for evaluation through `<task>.heldout`) or `test` (`trait-tests`, a checker fixture that never produces a task). Written "held-out" in prose. |
| **eval perturbation** | One factor set to values training never uses: held-out instructions or content, out-of-range parameters, more popups, other viewports and so on. Task name `<task>.eval-<name>` (`set-slider.eval-popups`); the list is in [randomization.md](randomization.md#eval-perturbations). |
| **instruction split / content split** | The train and held-out halves of the instruction templates (`instructionSplit`) and of the content banks (`contentSplit`). |
| **ood** | Out of distribution: parameter values outside the training range (`.eval-ood`). |
| **golden snapshot** | A recording of episodes for fixed seeds (`python -m megawob.golden`). Comparing two snapshots shows whether a change altered any episode. "Golden" means only this. |

## Task names

| Name | Episodes from |
|---|---|
| `set-slider` | training widgets |
| `set-slider.heldout` | held-out widgets only |
| `set-slider.<site>` | one site, any split (`set-slider.base`, `use-email.mock-inbox`) |
| `set-slider.eval-<name>` | training widgets with one [eval perturbation](randomization.md#eval-perturbations) |

How a name picks its episode (`catalog.pick`):

1. The seed draws a scenario uniformly from the task's scenarios.
2. It then draws a site whose widgets support that scenario.
3. It then draws one of that site's widgets.

Two consequences:

- With thousands of `design-*` sites, a plain task name almost never draws `base`. Use `<task>.base` for it.
- `.heldout` is registered only when held-out widgets exist, and some eval perturbations only for tasks with the
  matching feature ([tasks.md](tasks.md#eval-perturbations)).
