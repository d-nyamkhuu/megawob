# Contributing to MegaWoB

Start with [AGENTS.md](AGENTS.md). It covers the three layers, the rules every page follows and where to read
next. The terms are defined in the [glossary](docs/glossary.md). Every command is in [docs/checks.md](docs/checks.md).

## Before you open a pull request

Run what CI runs (`.github/workflows/ci.yml`); all of it must pass:

```bash
pip install -e '.[browsergym]' && pip install -e '.[check,dev]' && playwright install chromium
ruff check megawob tests baselines server tools   # Python lint
python -m pytest -q tests                         # Python tests
node --test tests/kit/*.test.mjs                  # kit unit tests (Node 22+)
python -m megawob.lint --no-ruff                  # static contract lint of every page
python -m megawob.check --site base --viewports 1024x640 --seeds 1   # the checker, as CI runs it
```

A change is done when:

- **Checker.** It passes on what you touched with 100% oracle success at every training viewport. For example,
  run `python -m megawob.check --task <task> --seeds 20` or `--site <site> --seeds 20`. The checker samples the
  randomization parameters and sweeps every value.
- **smoke_gym.** `python server/smoke_gym.py <task>` passes for the affected tasks: with and without `--plain`, in
  binary and shaped reward.
- **Screenshots.** You looked at them (`--screens DIR`): nothing clipped or cramped, in light and dark themes, with a
  side panel, a popup and a wrong start.
- **Existing episodes.** They are unchanged, unless changing them is the point. Compare golden snapshots before and
  after ([kit guide](html/kit/README.md#testing-a-kit-change)).
- **Counts.** Any number written in a doc comes from `python -m megawob.catalog`.

## Add a task

1. Write `html/tasks/<task>/logic.js`: `env.task({...})` with the [task contract](html/kit/README.md#the-contract).
   No DOM here.
   - The header's first sentence is a one-line summary; `docs/tasks.md` shows it in its task table.
   - The header also lists the scenarios, the spec and model shape, the plan targets, and the MiniWoB++
     counterparts with any deviations from them.
   - Read the MiniWoB++ source of the tasks it covers (as data) for their semantics.
2. Add a base widget `html/sites/base/widgets/<task>.js` that supports every scenario, and list it in
   `html/sites/base/manifest.json`. The [worked example](html/kit/README.md#worked-example-a-task-and-a-widget) is the
   smallest complete pair. Python finds both by glob: there is no registry to edit.
3. Run `python -m megawob.scenarios --site base`. It refreshes `html/scenarios.json`, which also records the
   task's start modes, judgment modes, hooks and whether its plan drags; these decide which task names it gets.
4. Add the task name to `server/smoke_client.py`, a row to the error table in
   [docs/architecture.md](docs/architecture.md#tasks), and the task to its category in the README "Tasks" list and in
   `CATEGORIES` in `megawob/gallery.py` (the gallery's tabs; `tests/test_gallery.py` checks it). Then run
   `python -m megawob.describe --markdown docs/tasks.md`.
5. Check it: `python -m megawob.check --task <task> --seeds 20`, `python server/smoke_gym.py <task>` (binary and with
   `MEGAWOB_REWARD=shaped`), and `python -m megawob.lint`.

## Add a scenario

1. In the task's `logic.js`, add the name to `scenarios`. Handle it in `sample`, `init`, `error`, `instruction`,
   `plan` and `solve`, and update the header.
   - Draw new content from forked rng streams, so existing scenarios keep their episodes.
   - A scenario used only for evaluation goes in `heldoutScenarios`.
   - A big task keeps one file per scenario ([kit guide, "Add a scenario"](html/kit/README.md#add-a-scenario)).
2. Add the scenario to the base widget's `scenarios` list and render it. Other widgets keep the scenarios they
   declare; the checker fails a widget asked for a scenario it lacks.
3. Run `python -m megawob.scenarios` (add `--site base` to be quick) and `python -m megawob.describe --markdown
   docs/tasks.md`.
4. Check the task as above. Designs for the new scenario are added as in [Add a design](#add-a-design-a-design--site).

## Add a widget

1. Write `html/sites/<site>/widgets/<task>.js` and add a manifest entry (`python -m megawob.manifests --fix`).
2. Make it differ in mechanics, not only in colours: snap or free movement, a handle or the whole item, a live or
   ghost preview, a readout or none, a different control type.
3. Run `python -m megawob.scenarios --site <site>`. Every scenario the widget declares must pass the checker.

## Add a site

A full site has its own frame and a widget for every task. Follow [docs/site-checklist.md](docs/site-checklist.md).

1. Create `html/sites/<site>/` with `manifest.json`, `site.js`, `site.css` and `widgets/`.
2. In `site.js`, `frame(ctx)` must:
   - honour `ctx.display` (where the instruction goes) and `ctx.finish` (no end control);
   - vary the end control's placement and label;
   - add inert decoys and filler.

   `overlay(ctx)` draws all five popup kinds.
3. A design's own always-on obstruction (a welcome tour, a chat bubble) is declared as
   `initialOverlay: {kind, p?, at?}` in `site.js` and drawn by `overlay(ctx)` when `ctx.initial` is true. The kit
   schedules it, the oracle dismisses it, and `popups=off` suppresses it. Never draw it in `frame()`. If the task
   should wait while it is up, add `pauseOnOverlay: true`.
4. Done when `python -m megawob.check --site <site>` passes and its row of `--matrix` is full.

## Add a design (a `design-*` site)

`tools/sitegen` does this with Codex agents: `python tools/sitegen/sitegen.py new <task> <scenario>` draws a
reviewed design image, then builds the site until the checker passes ([its README](tools/sitegen/README.md)). Look
at the result and run the checks of step 4 below before you open a pull request.

By hand: a design is one site `html/sites/design-<task>-<scenario>-<NN>/` with one widget named `design`, built
from one design image. Take the next free `NN`.

1. **Copy the files** of an existing design of the same scenario: `manifest.json`, `site.js`, `site.css` and
   `widgets/<task>.js`. The manifest must match the widget files (`python -m megawob.manifests --fix`).
2. **Write the widget** as a design on a template in `html/templates/<task>/`:

   ```js
   env.widget({task, site, name: 'design', split, scenarios: ['<scenario>'],
     template: '<task>/<name>', design: {/* tokens and the parts it replaces */}});
   ```

   - Set tokens, and replace only the parts the image draws differently. Never copy a whole widget.
   - Keep the rng draws of any part you replace.
   - If the template lacks a token or part you need, add it there with a default that keeps every existing design
     unchanged, then golden-compare the sites built on it ([templates guide](html/templates/README.md)).
3. **Write the frame.** `site.js` and `site.css` give the frame (instruction placement, end control, decoys,
   popups) and the look. Assets go in `assets/`, with a note on where they came from.
4. **Check it.** Run `python -m megawob.scenarios --site <site>`, `python -m megawob.check --site <site> --seeds 20`
   and `python -m megawob.lint --site <site>`, and look at the screenshots (`--screens DIR`).

New designs default to the `train` split. To reserve a new design for evaluation, set `split: 'heldout'` in its
definitions and manifest. Never move an existing design between splits
([held-out split](docs/architecture.md#held-out-split)).

## Writing docs

Each topic has one home; link to it instead of repeating it.

| Topic | Home |
|---|---|
| terms and task names | [docs/glossary.md](docs/glossary.md) |
| environment variables | [docs/configuration.md](docs/configuration.md) |
| randomization parameters and eval perturbations | [docs/randomization.md](docs/randomization.md) |
| commands and tools | [docs/checks.md](docs/checks.md) |
| design and rationale | [docs/architecture.md](docs/architecture.md) |
| the contract, the kit, golden snapshots | [html/kit/README.md](html/kit/README.md) and the `env.js` header |
| recipes | this file |

When you write:

- **Keep it short.** One idea per sentence. Use a list or a table instead of a chain of `;` or a long run of
  inline code. Keep paragraphs short, and table cells to a sentence or two.
- **One name per concept**, as in the glossary. Say "randomization parameter" (the code says knob), "end control",
  "finish by message", and "held-out" (`heldout` in code).
- **No project history.** It belongs in [CHANGELOG.md](CHANGELOG.md).
- **No hand-typed counts.** Take numbers from `python -m megawob.catalog`, and prefer "over 2,900" to an exact
  count that will go stale.
- **Fence languages.** Give every code fence a language (`text` for trees).
