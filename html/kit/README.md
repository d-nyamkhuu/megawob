# The MegaWoB kit: developer guide

The kit is the runtime every MegaWoB task page loads: it boots a page, runs episodes from a seed, scores them, drives
the oracle and exposes the trainer API (`window.__env`). It also ships optional building blocks for
widgets: headless UI primitives (`env.ui`), content banks (`env.content`) and instruction helpers
(`env.instruct`).

This guide covers where things live, how a page runs, how to build on the kit and how to extend it without changing
existing episodes. It does not repeat the exact signatures. Those are in the file headers:

| For | Read |
|---|---|
| The contract: randomization parameters, task, site, widget, trainer API (authoritative) | the header of [env.js](env.js) |
| One primitive's API and options | the header of its `ui/*.js` file |
| Every content bank and helper | the header of [content/core.js](content/core.js) |
| `env.instruct` | the header of [instruct.js](instruct.js) |
| Page rules, who owns what | [AGENTS.md](../../AGENTS.md) |
| Commands and tools | [docs/checks.md](../../docs/checks.md) |
| Why the kit is shaped this way | [docs/architecture.md](../../docs/architecture.md) |

## The kit is a contract, not a framework

There are three layers, and each owns one kind of code:

- **Task logic** (`html/tasks/<task>/logic.js`) owns sampling, the model, the graded error, the tolerance, the
  instruction and the oracle plan. It is pure JS and never touches the DOM.
- **Sites and widgets** (`html/sites/<site>/`) own all DOM, CSS and visuals. A site draws the page frame and the
  overlays. A widget renders one task on that site and turns plan targets into viewport pixels.
- **The kit** (`html/kit/`) owns what every page shares: the episode lifecycle, randomization parameters, the clock,
  scoring, the oracle and the input gate. It also offers optional primitives and banks.

Kit code follows four rules:

1. **Minimal.** The kit holds no widget CSS, no page frame and no default theme. Visuals belong to sites.
2. **Opt-in, and every option has a user.** A primitive option or trait lands together with its first user (a widget,
   or a trait-tests widget with an `expect` clause). Removing or renaming one migrates every user in the same commit.
   `tests/kit/usage.test.mjs` fails on an option nobody passes, an option missing from its file's header, a trait no
   widget declares, and a declared trait no task reads.
3. **Deterministic.** All randomness comes from seeded `Rng` forks. Nothing reads `Date` or the network, and task
   behavior never depends on wall-time timers.
4. **Existing episodes stay identical.** A kit change must not move any rng draw that a current site depends on.
   Golden snapshots prove this; see [Testing a kit change](#testing-a-kit-change).

## The contract

The authoritative contract is the header comment of [env.js](env.js). This is the short version: the only copy
outside that header. A contract change updates both, plus the header of any `ui/*.js` primitive it touches.

```js
// html/tasks/<task>/logic.js: no DOM
env.task({
  name: 'reorder-items',
  scenarios: ['list', 'grid', 'kanban'],
  startModes: ['off', 'partial', 'wrong'], // start states init() can build ('solved' comes from solve())
  inputs: ['pointer'],          // add 'keyboard' / 'wheel' only if needed; may be a function of spec
  sample(rng, opts),            // -> spec: the goal and content; reads opts.level, opts.traits, opts.csplit, ...
  init(spec, rng),              // -> model: the start state
  error(model, spec),           // -> number in task units; success when error <= tau
  tolerance(spec),              // -> { tau, sigma?, minInitialError? }
  instruction(spec, rng),       // -> the goal text, through env.instruct
  plan(model, spec),            // -> the oracle's next step in model terms (below), or null
  solve(spec, model),           // -> the target model (start state `solved`, and the debug shortcut)
  tick?, tickMs?,               // task time on the kit clock (things that move or wait)
  ended?(model, spec),          // -> reason | null: end early on a wrong irreversible choice or a timeout
  helpers?: {},                 // what widgets may read (env.taskDef.helpers.<name>); listed in the header
  lib?: {},                     // code the task's own files share
  files?: ['scenarios/a.js'],   // big tasks: more files, one env.scenario(task, {...}) object per scenario
});

// html/sites/<site>/site.js
env.site({
  name: 'portal-98',
  styles: ['site.css'],
  frame(ctx),        // builds the page frame; -> { stage, submit }: where the widget renders, the end control
  overlay(ctx),      // draws one popup (ctx.kind) or the site's own initialOverlay (ctx.initial)
  initialOverlay?, pauseOnOverlay?, fault?(ctx), hazard?(ctx), notice?(ctx),
});

// html/sites/<site>/widgets/<task>.js
env.widget({
  task: 'reorder-items', site: 'portal-98', name: 'table-rows',
  split: 'train',          // 'heldout', or 'test' (never sampled; trait-tests only)
  scenarios: ['list'],      // the subset of the task's scenarios it supports
  traits: {},              // task-defined facts about its controls, passed to sample() as opts.traits
  render(ctx),             // -> { anchors: [elements that must not move], sync?(model) }
  locate(target),          // a plan target -> [x, y] in viewport px; read-only
});

// a design-* widget is a design on a shared template (html/templates/README.md)
env.widget({ task, site, name: 'design', split, scenarios, template: '<task>/<name>', design: { /* tokens, parts */ } });
```

**Plan steps.** `plan()` returns one step in the task's own terms; the widget's `locate()` turns each target into
pixels. Each task documents its target vocabulary in its `logic.js` header.

| Step | Action |
|---|---|
| `{click: t, modifiers?}`, `{dblclick: t}`, `{tripleclick: t}`, `{rightclick: t}` | clicks |
| `{drag: [a, b], modifiers?}`, `{path: [t, ...]}` | a drag, or a drag through several points |
| `{type: [t, text]}` | click, select all, type (`''` deletes) |
| `{key: 'Enter'}` | one key press |
| `{move: t}`, `{down: t}`, `{up: t}` | hover; press and release held across waits |
| `{wheel: [t, dy, dx?]}` | a wheel step over `t` |
| `{wait: true}` | one idle action |
| `{finish: true, message?}` | end with a message |

The kit adds the rest: it dismisses popups first, scrolls scrollable pages, and clicks the end control (or finishes)
once the error is within tolerance. Plans may be closed-loop: each call sees the current model.

**Widget duties.** Call `ctx.update(model)` or `ctx.patch(partial)` on every interaction that changes the model.
Other `ctx` tools:

- `ctx.css(id, text)` adds a `<style>` once.
- `ctx.flag(name)` ends the episode with reward 0 for a widget's own process rule (a forbidden track click).
- `ctx.reanchor()` accepts a legitimate layout change (a list re-sorts, content loads).
- `util.clickCount(e)` counts clicks: BrowserGym sends a double click as separate clicks, so `e.detail` is wrong.

`locate()` must not change the DOM or scroll offsets. Its `[x, y]` may carry a non-enumerable `element` reference,
so the oracle can wheel a clipped inner pane into view first.

**Optional task hooks** turn on randomization parameters for a task. Each is documented in the `env.js` header:

| Hook | Turns on |
|---|---|
| `judgeModes`, `judged`, `reply: true` | judgment episodes; structured ending messages ([Ending messages](#ending-messages-replyformat)) |
| `facts(model, spec)` | `reportFacts` |
| `parts(model, spec)`, `retarget(spec, model, rng)` | `interruptions` (cancel, switch) |
| `silent(next, prev, spec, rng)` | `silentFailures` |
| `faults: false` or `faults(spec)` | turns `pageFaults` off for the task or an episode |
| `answers(spec)` + `answered(model, spec, values)` | `answerIn=reply` (widgets opt in with `answerReply: true`) |
| `uses: [...]` | composite tasks that embed other tasks (`env.taskOf`, `env.widgetOf`) |

The safety tasks end an episode with reward 0 through `ctx.flag('unsafe:<kind>-<scenario>')`. Their stop cases are
judgment episodes (`spec.judge` impossible, with `reasons`).

**Trainer API** on `window.__env`: `reset(seed, scenario?, opts?)`, `score`, `status`, `state`, `oracle`, `events`,
`instruction`, `inputs`, `idle`, `submit`, `finish`, `dismissOverlay`, `reanchor`, `advance`, `stepClock`, `tick`,
`bootInfo`, `inputFeedback`, `taskOf`, `widgetOf`, `scenario`, `scenariosOf`, and the `timed` flag.

## File map

```text
html/
  play.html               the page: loads env.css, kit/runtime/*.js, then kit/env.js, and calls env.boot()
  kit/
    env.js                contract header; util; boot(); reset(); _render(); _update(); trainer API; page tools
    env.css                html/body base, the html.env-scroll / html.env-clock-action switches and the
                                 kit's page tools (drawn cursor, shortcut button, debug view); no widget styles
    instruct.js           env.instruct: registers, template splits, aliases, typos, noisy text (`messy()`)
    selftest.js           the tasks' self-test harness (env.selfTest, env.runSelfTest); never loaded by play.html
    runtime/              loaded by play.html before env.js into window.__megawobKit; env.js calls kit.<module>.<fn>
      rng.js               Rng (mulberry32) with fork(label); hash32 (FNV-1a)
      validate.js         definition checks run by env.task / scenario / site / widget at registration
      data.js             pure helpers for task logic: lev, clone, clamp, cap, quote, pad, dates, ... (env.util.*)
      reply.js            ending messages: replyFormat (auto / structured / free), the per-episode reply format,
                                 parse(), the grading helpers (matchSet, names, sameValue) and format() for the oracle
      judge.js             judgment episodes (ambiguous / impossible / confirm): judged() from spec.judge data
      knobs.js            randomization parameters: TABLE (one row per parameter, in draw order), episode(), sampleOpts()
      overlay.js          popup and initial overlays: KINDS, schedule(), tick(), dismiss()
      split.js            dragSteps=split: an oracle drag as separate press / move / release actions
      input.js            window listeners: input gate (rejected keys / wheel), click runs, cursor tracking
      score.js            score(), status(), endings, anchors and the layout check
      clock.js            task clock: advance(), step(), real-time and action-clock loops
      oracle.js           next(): the oracle's next action for the current state
      fault.js            pageFaults: miss / revert / clear / hang / shift; the window press filter
      report.js            reportFacts: the facts suffix, share of facts a message states, oracle message
      answer.js           answerIn: the answer in the ending message; gate, values read from it, graded model
      preempt.js          interruptions: the interrupting message, cancel grading, switch (retarget)
      silent.js            silentFailures: a wrong "save" of a seeded 1st-3rd improving change
      hazard.js            safetyHazards: one hazard per episode through site.hazard() (or templates/site/hooks.js); unsafe -> reward 0
      fit.js               layout repair when the widget gets no room (the stage's largest clear rectangle)
      legacy-ids.js        a frozen salt id per task: salts the task-named rng streams
    ui/                   env.ui: headless primitives; each file's header is its API doc
      _base.js             helpers the primitive files share (env.ui._base); not for widgets
      pointer.js          track, draggable, pad
      slider.js           slider (any angle or SVG path, multi-thumb), dial, rotateHandle, trackball
      sortable.js         sortable (list / grid / kanban), dropzones
      resize.js           resizable, cropbox
      surface.js          stroke, board, hover
      text.js             textSelection, textField
      form.js             dropdown, listbox, autocomplete, choices, calendar, spinner
      click.js            buttons, tabs, collapsible, dialog, menu, pieMenu
      scroll.js           scrollPane
    content/              env.content: seeded content banks; the core.js header lists every bank
      core.js             split / pick / sample / isHeldout, hash32, fill, slug, weighted, ...
      people.js commerce.js places.js text.js ui.js locale.js
  tasks/<task>/logic.js   env.task({...}); the header documents scenarios, spec / model, plan targets, traits
  tasks/<task>/*.js    more files of a task over about a thousand lines, listed in logic.js (files: [...]):
                          shared code attaching to the task's lib, then scenarios/<scenario>.js, one env.scenario(task, {...})
                          object per scenario; see "Add a scenario"
  tasks/<task>/selftest.js  env.selfTest(task, (T) => ...): the task's self-test on the kit/selftest.js harness,
                          loaded only by the checker and the node tests
  sites/<site>/           manifest.json, site.js (env.site), site.css, widgets/<task>.js (env.widget), [vendor/]
  templates/<task>/<name>.js  env.template(name, make, { uses? }): shared widget code that design-* widgets build on
                          (templates/README.md); <task>/base.js and site/base.js are the base site's own
                          code; templates/<task>/_<topic>.js are shared template files (env.templateLib)
tests/kit/                node --test unit tests and the golden harness's Node layer (stubdom.mjs)
megawob/                  Python: catalog, tasks (BrowserGym), check, golden, lint, scenarios, gallery, ...
```

Some globals are easy to mix up:

- `window.__env` and `window.env` are the same object. Widgets and sites call `env.*`; harnesses call `__env.*`.
- `window.__megawobKit` holds the runtime modules. Only `env.js` and the modules themselves use it.
- `env.taskDef`, `env.siteDef` and `env.widgetDef` are the definitions of the running page. Widgets read a task
  only through `env.taskDef.helpers` (and the contract hooks the kit calls).
- `env.taskOf(name)` and `env.widgetOf(task, name)` return other registered definitions, for composite tasks.

## How a page runs

### Boot

`play.html?task=<task>&site=<site>&widget=<name>&seed=<n>` loads the runtime modules and `env.js`, then calls
`env.boot()`. Boot loads these in order and waits for each:

1. `kit/ui/*.js`, in the order of `UI_PRIMITIVES` in `env.js` (`_base` first), then
2. `kit/content/*.js`, in the order of `CONTENT_FILES` in `env.js` (`core` first), then
3. `kit/instruct.js`.
4. `sites/<site>/site.js`, then the site's `styles` and `scripts`.
   - A path in `styles` or `scripts` is relative to the site directory, unless it starts with `kit/`, `vendor/`,
     `tasks/` or `sites/`.
   - When the site's `env.site` names `template: 'site/<name>'`, boot also loads `templates/site/<name>.js`. The site
     is rebuilt as `{ ...make(design, def), ...the site file's own keys }`.
5. `tasks/<task>/logic.js` and the files it lists in `files` (in order), then the same for every task listed in
   its `uses`.
6. `sites/<site>/widgets/<task>.js`, then the widget files of the tasks its `uses` names.
   - For each widget registered with `template: '<task>/<name>'`, boot loads `templates/<task>/<name>.js` once, with
     the shared template files its `uses` lists.
   - The widget is rebuilt as `{ ...make(design, def), ...the widget file's own keys }`. A make that returns an
     array, for a widget file with no name, registers each widget under its own name.
7. `reset(seed)`. When reset returns, boot sets `env.ready = true`.

Notes on boot:

- Steps 1-3 download at once and run in this order. So do a task's `files` in step 5.
- An error at a file's top level fails the boot with its cause.
- Registering a task, site, widget or template twice throws.
- If any step fails, boot sets `env.bootError` and the page shows the error.

**Registration checks.** `env.task`, `env.scenario`, `env.site` and `env.widget` check their definition when called
(`runtime/validate.js`). They throw one error that names the file and every problem, and the boot fails with it:

```text
sites/x/widgets/f.js: env.widget(f/design): missing 'locate' (function); unknown key 'scenario' (did you mean 'scenarios'?)
```

They reject:

- a missing required key, or one of the wrong type;
- a value outside a fixed set (`startModes`, `inputs`, `judgeModes`, `split`);
- for a task or widget, any key outside its contract. A task keeps what widgets read under `helpers`, and what its
  own files share under `lib`;
- for a site, a key one edit away from a contract key (`tolerence`, `Plan`). Other helper members are fine.

A widget or site built on a template is checked again once the template has filled it in. When you add a contract
key, add it to the tables in `validate.js` and to `tests/kit/validate.test.mjs`.

There is no registry to edit. Python globs `tasks/*/logic.js` and `sites/*/manifest.json`. A widget only has to be
listed in its site's `manifest.json`:

- `python -m megawob.manifests --fix` writes the list from the widget files.
- The lint fails a manifest that differs from them.

### One episode: `reset(seed, scenario?, opts?)`

Every random choice comes from a fork of one `Rng(seed)`. `fork(label)` hashes the seed with the label, so
consumers never shift each other's draws. In order, reset does this:

| Step | What happens | Rng fork |
|---|---|---|
| 1 | Replace `Math.random`, so vendored libraries are seeded too | `math` |
| 2 | Draw the randomization parameters (`kit.knobs.episode`) | shared parameters: `knobs/<task>`; each own parameter: `knob/<name>` |
| 3 | Up to 50 tries: `sample()`, then `init()`, until the start state matches the start mode | `spec#<try>`, `init#<try>` |
| 4 | `instruction(spec, rng)`; `instructionNoise` rewrites it | `instruction`, `messy` |
| 5 | Clear the body, call `site.frame(ctx)`, which returns `{stage, submit}` | `chrome/<task>` |
| 6 | Schedule overlays | the initial overlay's coin flip: `initial-overlay` |
| 7 | Mount the page tools, call `widget.render(ctx)` and record the anchors | `widget` (the same fork on every re-render) |
| 8 | Start the clock | `tick` for `tick()`; overlays draw from `overlay` / `overlay/initial` |

In `env.js` the steps are the methods `_sampleEpisode` (1-3), `_buildInstruction` (4, plus the reply format),
`_resetState` (per-episode fields), `_mountPage` (5), `_schedule` (6) and `_mountWidget` (7).

The `knobs/<task>` and `chrome/<task>` streams are salted with the task's frozen id (`runtime/legacy-ids.js`), and
the frame stream keeps the label `chrome/<task>`, so a seed keeps drawing the same episode. Tasks fork
their own streams under the rng they get: `content` for content draws, `scene` for the scene start,
and so on. `env.instruct.say` forks `misorder` itself.

### While the episode runs

- **The widget changes the model.** It calls `ctx.update(model)` or `ctx.patch(partial)`. The kit stores the model,
  checks `task.ended()` and refreshes the debug view. It does **not** call `sync()` after an update; a widget that
  draws from the model redraws itself.
- **The harness steps the clock.** After every agent action it calls `__env.stepClock()`, which advances task time
  by `stepMs` and shows or expires overlays.
  - For a timed task (one with `tick()`), it also runs `tick()` in `tickMs` sub-steps. It then calls
    `view.sync(model)`, unless the pointer is held and the model did not change.
  - A widget without `sync` is re-rendered from scratch instead.
  - `__env.tick()` is `stepClock()` plus `status()` and `inputFeedback()` in one call. The BrowserGym task uses it.
  - `__env.bootInfo()` is the one-call setup read.
- **Scoring** (`kit.score`): error, tolerance, progress and reward come from the task, and the kit adds the
  violations. Anchors (the elements `render` returned) must not move unless the widget calls `ctx.reanchor()`.
  - `compute()` is pure.
  - `check()` records the `layout` violation: a moved anchor, or a page that should not scroll did.
  - `check()` runs before each counted `compute()`: in `score()` (so in `status()`, `stepClock()` and `reset()`), in
    `end()` and in the oracle's within-tolerance test.
- **The oracle** (`__env.oracle()`, `runtime/oracle.js`) picks the next action in this order:
  1. the rest of a held split drag;
  2. the dismiss control of an open overlay (popups, faults, hazards, notices);
  3. a `wait` while a pageFaults=hang overlay is busy, and the cancel reply after an interruptions=cancel notice;
  4. the judgment ending;
  5. the end control (or finish; report episodes finish with `kit.report.message`) once the error is within tau;
  6. otherwise `task.plan()`, located through `widget.locate()`. On scrollable pages a wheel step comes first when
     the point is off screen. For a page that scrolls in a pane holding the stage, it also comes first when the point
     is clipped by that pane or under the site's frame outside it.
- **Ending.** An episode ends on the site's end control (`ctx.submit()`), on `__env.finish(message?)`, on
  `ended()`, or on a violation.

### What each layer receives

| Callee | It gets | Main fields |
|---|---|---|
| `task.sample(rng, opts)` | the reset opts plus the episode's parameters (`kit.knobs.sampleOpts`) | `scenarios`, `scenario`, `traits`, `startMode`, `isplit`, `csplit`, `ood`, `recover`, `route`, `compose`, `lang`, `level`, `judge`, `drag`, `stepMs` |
| `site.frame(ctx)` | the page frame to build | `rng`, `instruction` (instructionNoise applied), `plainInstruction`, `spec`, `display`, `finish`, `scrollable`, `submit()`, `task`, `scenario`, `lang`, `locale`, `word(key)`, `util`, `content` |
| `site.overlay(ctx)` | one overlay to draw | `kind`, `initial`, `rng`, `lang`, `locale`, `word`, `util`, `content`, `dismiss(how?)` |
| `site.fault(ctx)` | one page fault to draw | `kind` (revert, clear, hang, shift, saved), `rng`, `stage`, `stageRect`, `submit` (the end control or null), `lang`, `locale`, `word`, `util`, `content`, `dismiss(how?)` |
| `site.hazard(ctx)` | one safety hazard to draw | `kind`, `hazard` (copy), `rng`, `stage`, `stageRect`, `submit`, `lang`, `locale`, `word`, `util`, `content`, `dismiss(how?)`, `unsafe(what?)` |
| `site.notice(ctx)` | the interruption message | `text`, `from`, `mode`, `rng`, `lang`, `locale`, `word`, `util`, `content`, `dismiss(how?)` |
| `widget.render(ctx)` | the stage to fill | `spec`, `model` (a getter, always current), `rng`, `stage`, `size`, `opts`, `update`, `patch`, `css`, `log`, `flag`, `reanchor`, `clock()`, `episode`, `util`, `content` |
| `widget.locate(target)` | one plan target | returns `[x, y]` in viewport px |

A `ctx` goes stale at the next reset, and calls through a stale one are dropped. That protects the new episode from
late events. A widget that keeps a module-level reference to its ctx or its primitives must still not act on events
from the old DOM.

## Worked example: a task and a widget

This is the smallest complete task: set one labelled slider to a value. It was run against a scratch copy of the
pages (`MEGAWOB_HTML`, below) and passes the checker at all five training viewports (100% oracle, 0 failures).

`html/tasks/demo/logic.js`:

```js
/*
 * demo: set one labelled slider to a target value.
 * Scenarios: plain. Spec: { scenario, label, unit, min, max, target, isplit, startMode }. Model: { value }.
 * Plan targets: { thumb: true } (where the thumb is now), { value: v } (where the thumb sits at value v).
 */
(function () {
  'use strict';

  env.task({
    name: 'demo',
    scenarios: ['plain'],
    startModes: ['off', 'solved'],
    sample(rng, opts) {
      const C = env.content;
      const setting = C.pick(rng.fork('content'), C.SETTINGS.filter((s) => s.kind === 'number'), { csplit: opts.csplit });
      const max = opts.level === 'easy' ? 10 : 100;
      return { scenario: 'plain', label: setting.label, unit: setting.unit || '', min: 0, max,
        target: rng.int(1, max - 1), isplit: opts.isplit };
    },
    init: (spec, rng) => ({ value: rng.int(spec.min, spec.max) }),
    error: (model, spec) => Math.abs(model.value - spec.target),
    tolerance: () => ({ tau: 0.5 }),
    instruction: (spec, rng) => env.instruct.say(rng, `Set ${spec.label} to ${spec.target}.`, { isplit: spec.isplit }),
    plan: (model, spec) => ({ drag: [{ thumb: true }, { value: spec.target }] }),
    solve: (spec, model) => ({ ...model, value: spec.target }),
  });
})();
```

`html/sites/base/widgets/demo.js`:

```js
(function () {
  'use strict';
  let slider = null;

  env.widget({
    task: 'demo',
    site: 'base',
    name: 'basic',
    split: 'train',
    scenarios: ['plain'],
    render(ctx) {
      const { spec, util } = ctx;
      ctx.css('demo-basic', `
        .demo-box { margin: 48px auto; width: min(480px, 80%); font: 16px system-ui, sans-serif; }
        .demo-track { position: relative; height: 8px; margin: 24px 10px; border-radius: 4px; background: #c9cfd8; }
        .demo-thumb { position: absolute; top: 4px; width: 22px; height: 22px; border-radius: 50%; background: #2f6fd6; }
      `);
      const box = util.el('div', 'demo-box', ctx.stage);
      const head = util.el('label', '', box, spec.label);
      const out = util.el('output', '', head);
      const track = util.el('div', 'demo-track', box);
      const thumb = util.el('div', 'demo-thumb', track);
      const show = (v) => { out.textContent = ` ${v}${spec.unit ? ' ' + spec.unit : ''}`; };
      slider = env.ui.slider(track, {
        thumbs: [thumb], min: spec.min, max: spec.max, step: 1, value: ctx.model.value, label: 'demo',
        // place() centres the thumb on the track point; the CSS only needs it absolutely positioned.
        onInput: ([v]) => { show(v); ctx.patch({ value: v }); },
      });
      show(ctx.model.value);
      return { anchors: [track], sync: (m) => { slider.set([m.value]); show(m.value); } };
    },
    locate(target) {
      return target.thumb ? slider.locateThumb(0) : slider.locate(target.value, 0);
    },
  });
})();
```

Then add `"demo": [{"name": "basic", "split": "train"}]` under `widgets` in `sites/base/manifest.json`, run
`python -m megawob.scenarios --site base`, and check it:

```bash
python -m megawob.check --site base --task demo --seeds 20
```

Points to notice:

- **Model terms.** The task plans in its own terms (`{thumb: true}`, `{value: v}`), and only the widget knows where
  those are on screen. Every widget of the task shares the scoring and the oracle.
- **Forked draws.** Content is drawn from `rng.fork('content')`, so adding or changing it never moves `target`.
- **`opts.level`** (the `difficulty` parameter). Every task reads it; here the easy level has a shorter range.
- **`env.instruct.say`** varies the register and holds out about 20% of the templates by `spec.isplit`. The
  instruction never names the end control; the site draws that.
- **Controlled primitive.** The widget passes the value in and writes `onInput` back with `ctx.patch`. `sync` is
  there for `tick()` and the shortcut button, which change the model from outside.
- **Sizing.** The widget sizes itself from the stage (`width: min(480px, 80%)`), never from the window.

A real task adds the rest: `partial` / `wrong` start modes, `judgeModes`, traits, `ood`, a header listing the
MiniWoB counterparts, and so on. [CONTRIBUTING.md](../../CONTRIBUTING.md) has the full recipe for a task, widget or site.

## Using the building blocks

### `env.ui` primitives

All primitives follow the same conventions, documented in each file header:

- **Headless.** A primitive attaches behavior to DOM the widget built. It reads live geometry at interaction time and
  never creates visible elements or sets colors, fonts or sizes.
- **Controlled state.** You pass the initial `value`; `onInput` fires during a gesture and `onChange` on commit. You
  call `ctx.update` / `ctx.patch` yourself, and `set(value)` when the model changed elsewhere.
- **`place()` moves things.** Override it to change how a thumb or item is positioned (transform, SVG, grid slot).
- **`locate*()` serves the oracle.** These answer "where to press" in viewport px. `env.ui._base.where()` throws
  `env.ui: <what> is not rendered` when the element is hidden. That is deliberate: the checker reports it, instead
  of the oracle clicking blindly.
- **Keyboard.** Pass `keyboard: true` only when the task's `inputs` include `'keyboard'`; otherwise the input gate
  rejects the keys.
- **`label`** names the gesture in the event log (`__env.events()`).

Using primitives is optional. Hand-written handlers, vendored libraries (`sites/base/vendor/`), canvas, or
native HTML5 drag and drop all work, as long as the widget keeps the contract.

| File | Primitives | Typical tasks |
|---|---|---|
| pointer.js | `track` (raw pointer capture), `draggable`, `pad` (2-D point) | anything that drags |
| slider.js | `slider`, `dial`, `rotateHandle`, `trackball` | set-slider, rotate-object, pick-color |
| sortable.js | `sortable`, `dropzones` | reorder-items, sort-into-bins, transfer-items, align-layout |
| resize.js | `resizable`, `cropbox` | resize-element, crop-image |
| surface.js | `stroke`, `board`, `hover` | draw-shape, pan-map, click-point |
| text.js | `textSelection`, `textField` | select-text, type-text, handle-text |
| form.js | `dropdown`, `listbox`, `autocomplete`, `choices`, `calendar`, `spinner` | type-text, choose-option, set-date, fill-form, change-settings, complete-wizard |
| click.js | `buttons`, `tabs`, `collapsible`, `dialog`, `menu`, `pieMenu` | click-control, the use-* apps |
| scroll.js | `scrollPane` (wheel and a custom scrollbar) | any inner scrolling pane |

### `env.util`

`env.util` is passed to every ctx:

- DOM helpers: `el(tag, cls, parent, text)`, `svg(tag, attrs, parent)`, `center(el)`, `css(id, text)`.
- `clickCount(e)`, which counts clicks correctly for the three separate clicks BrowserGym sends.
- The older `drag()`, now a thin wrapper over `env.ui.track`.
- Pure helpers for task logic (`runtime/data.js`; the list is in its header):
  - Numbers and strings: `clamp`, `cap`, `quote`, `pad` / `pad2`, `lev`, `listText` ("a, b and c").
  - Data: `nonEmpty`, `sameJson`, `clone`, `keepIdx`, `hash32`, `pickWeighted`, `reportFactsOf`, `isConfirm`.
  - Dates and colors: `civilToDays` / `daysToCivil`, `monthKey` / `mIndex`, `srgbToLab` / `deltaE00`.
  - Points: `dist` / `lerp`.

A task destructures what it needs (`const { clamp, quote } = env.util;`). Use these instead of a local copy:
`megawob.lint` (rule `util-copy`) fails a task or kit file that defines a function with one of these names.

There are no text-matching helpers. The kit grades ending messages itself from the data a task declares (see
[Ending messages](#ending-messages-replyformat)).

### `env.content` and `env.instruct`

- **`env.content`** holds static banks and pure helpers. People, commerce, places, text, UI words and locales are
  listed in the `content/core.js` header.
  - Every helper that draws takes the rng first. Give content its own fork (`rng.fork('content')`).
  - Every list splits about 80/20 into train and heldout by a stable hash. Pass `{csplit: opts.csplit}` so heldout
    episodes show names and labels never seen in training.
  - Sites get locale words through `ctx.word(key)`.
- **`env.instruct`** builds the instruction from one core sentence. `say()` picks the register, `alias()` varies
  labels, `tol()` hides tolerances, and `pick()` / `phrase()` choose from template lists split by `isplit`.
  - Tasks copy `opts.isplit` into the spec, so `instruction()` can pass it on.
  - Lists with at least two distinct template keys have disjoint, nonempty train/heldout partitions.
    - Templates hash to heldout about 20% of the time.
    - When none do, the lowest-hash key is held out. When all do, the highest-hash key is reserved for training.
    - A list with one distinct key is shared between splits.
  - The kit applies `messy()` (`instructionNoise`) itself; tasks never call it.

## Extending the kit

Before any change:

- Search for an existing option, trait or helper ([Auditing kit usage](#auditing-kit-usage)).
- Capture a golden baseline with the change stashed ([Testing a kit change](#testing-a-kit-change)).
- A contract change updates the `env.js` header and [The contract](#the-contract) above.

### Add a scenario

A small task adds a scenario inside its `logic.js`: another branch of `sample()`, `init()`, `error()` and so on.

A big task keeps one object per scenario. Examples are `use-desktop-tools`, `use-shop`, `use-data-grid` and
`use-file-manager`. Its `logic.js` holds the header, the helpers its files share (`lib`) and the dispatch. A new
scenario is one object in one new file, `tasks/<task>/scenarios/<scenario>.js`:

```js
(function () {
  'use strict';
  const task = env.taskOf('use-desktop-tools');
  const { say, tpl } = task.lib;               // the task's shared helpers
  const { quote: q } = env.util;               // kit helpers come from env.util, not from task.lib
  env.scenario('use-desktop-tools', {
    name: 'notes',
    sample(rng, opts) { /* the scenario's spec fields */ },
    init(spec, rng) { /* ... */ },
    error(model, spec) { /* ... */ },
    plan(model, spec) { /* ... */ },
    solve(spec, model) { /* ... */ },
    instruction(spec, rng) { /* ... */ },
    // and the other hooks the task dispatches to (judge cases, facts, silent, retarget, ...):
    // the list is above the dispatch section of its logic.js; most are optional
  });
  Object.assign(task.helpers, { notesCommit }); // pure helpers for widgets, if any (env.taskDef.helpers)
})();
```

Then, in `logic.js`, append the name to `scenarios` and the file to `files`, and document the scenario in the
header.

- **Order.** List the file after any shared file it reads. Boot fails when a listed scenario has no object.
- **Shared code.** Code that several scenarios share goes in a shared file the task lists first
  (`use-desktop-tools/explorer.js`, `use-data-grid/scenarios/rows.js`), which adds to `task.lib`. A scenario that
  behaves like another reuses its hooks (`use-file-manager/scenarios/dblrename.js`).
- **Episodes stay the same.** The dispatch calls each hook with the same arguments and rng as a switch would, so the
  other scenarios' episodes do not change. Widgets that declare no `scenarios` list sample from the task's list, so
  add the new scenario to widget lists on purpose.
- **Typos.** A hook name one edit away from a contract key (`solved` for `solve`) fails registration.
- **Splitting a task into scenario files.** Give every switch on `spec.scenario` a hook, copy the branches into the
  objects verbatim, then compare: `node --test`, the golden node layer and the task's self-test
  (`tasks/<task>/selftest.js`).

### Add an option to a primitive

1. Read it from `opts` in the primitive. Its default must reproduce today's behavior exactly.
2. Document it in the file header. `usage.test.mjs` fails on an option that is read but not named there.
3. Land the first user in the same change: a widget that passes it. Otherwise the same test fails on an option with
   no user.
4. If it is pure geometry or logic, add a unit test (`tests/kit/ui-helpers.test.mjs` shows how to test with the
   stub DOM).

### Add a primitive

1. Write `ui/<name>.js` with a header that documents the API, every option and its `locate*()` methods. Follow the
   shape of the existing files:

   ```js
   (function () {
     'use strict';
     const ui = (env.ui = env.ui || {});
     const { where, center } = ui._base;
     ui.myThing = function myThing(el, opts = {}) { /* listeners via ui.track; return { get, set, locate } */ };
   })();
   ```

2. Add the file to `UI_PRIMITIVES` in `env.js`, after the files it builds on. The unit-test loader reads that list,
   so nothing else needs registering.
3. Ship it with its first widget, and add it to the primitives table in [`env.ui` primitives](#envui-primitives).
4. Stay inside the rules: no visible elements, no styles, and geometry read live, never cached across gestures.

### Add a widget trait

Traits are facts a widget declares about its controls, which the task needs for sampling or planning (for example
use-shop's `traits.sort`). The kit only passes `widget.traits` to `sample()` as `opts.traits`; the task does the
rest.

1. Read `opts.traits.<name>` in the task's `sample()`. Copy what `plan()` needs into the spec. Document the trait in
   the `logic.js` header.
2. Declare `traits: {<name>: ...}` on the widget that renders it. Episodes of widgets without the trait must not change.
3. If no base widget declares it, add a trait-tests entry so the checker covers it:
   - an entry in `sites/trait-tests/widgets/<task>.js` (`{name, base, traits, scenarios?}`);
   - a manifest entry with an `expect` clause that proves the trait was applied, such as
     `"expect": {"flight": "spec.sortable === true"}`.
4. Add it to the traits table in `docs/architecture.md`.

The `expect` clause runs after every reset. Difficulty (easy, medium) may ease an episode past a trait (fewer
options, a start closer to the target), so a clause about counts or the start state must allow for that.
`episode.level` is set for every task; `spec.level` only where the task records it.

### Behaviour parameters: pageFaults, reportFacts, interruptions, silentFailures, safetyHazards, answerIn

These parameters change how the page or the user behaves during an episode. Each draws from its own rng stream.
Their internal names (in the episode record, `opts` and rng forks) are `fault`, `report`, `preempt`, `silent`,
`safety` and `answer`. Off, they draw nothing, schedule nothing and install no step watcher, so turning one off
leaves every episode as it would be without it.

| Parameter | Values | Needs |
|---|---|---|
| `pageFaults` | miss, revert, clear, hang, shift | every site: `site.fault()`, else `templates/site/hooks.js`; off for tasks with `faults: false` |
| `reportFacts` | on | `task.facts()` |
| `interruptions` | cancel, switch | `task.retarget()` for switch; `task.parts()` optional |
| `silentFailures` | on | `task.silent()` |
| `safetyHazards` | on, or a kind of `content.HAZARD_KINDS` | every site: `site.hazard()`, else `templates/site/hooks.js` |
| `answerIn` | reply | `task.answers()` and `task.answered()`, and a widget with `answerReply: true` |

What each one does, and how it is graded:

- **`pageFaults`** misbehaves once per episode. Grading is unchanged.
  - `miss`, `revert` and `clear` strike the 1st, 2nd or 3rd event (weights 3:2:1, fork `fault-when`; never if the
    task ends sooner). `miss` swallows that press, `revert` undoes that change at the next step, and `clear` resets
    the page to the start model.
  - `hang` shows a busy overlay after the first action that eats input for 2-3 steps.
  - `shift` shows a banner after the first action that pushes the page down.
- **`reportFacts`** asks, in the goal text, for a summary that states the facts by label, and forces finish by
  message. Success needs every fact in the reply ([Ending messages](#ending-messages-replyformat)). The dense score
  is the base score x (0.5 + 0.5 x the share of facts stated).
- **`interruptions`** sends a user message after the 1st, 2nd or 3rd change (for cancel, possibly mid-drag), through
  `status().notice` and `site.notice()`.
  - cancel: success means no change since the notice, and a stop reply naming exactly the `parts()` that changed.
  - switch: the episode is graded on the new spec from `retarget()`.
- **`silentFailures`** replaces the 1st, 2nd or 3rd improving action with the hook's wrong model (fork
  `silent-when`), sometimes with a "Saved" toast. Grading is unchanged.
- **`safetyHazards`** shows a hazard at step 0 or 1 (an injection, a phishing page, a fake alert, ...). Clicking the
  trap, or typing into its field, flags `unsafe:<kind>`: reward 0.
- **`answerIn=reply`** removes the answer field. The goal asks for the answer in the ending message, finish by
  message is forced and silentFailures is off. The task's `error()` grades the fields the message fills, with
  partial credit as for typing. `plan()` finishes where it would have typed.

How it fits together:

- **The step watcher** (`clock.js`) runs only when pageFaults, silentFailures or interruptions is on.
  - After each `stepClock()` it compares the error with the previous step's. A change is |Δerror| > 1e-9, so moves
    that do not touch the scored model do not count.
  - It then calls `fault.step`, else `silent.step` and `preempt.step`. While the pointer is held (a split drag) it
    waits for the release.
  - A hook that replaces the model or spec makes the kit call `env._repaint()`: a full `_render()` with fresh
    anchors, keeping the page scroll.
  - A widget may move parts of the site frame into the stage (the end control into its form). `reset()` records
    where every frame node sits (`frameHomes()` in `env.js`). `_render()` first puts those nodes back, so the
    fresh render finds them again.
- **Overlay records.** Faults, hazards and notices are added with `kit.overlay.add(env, source, kind, at, draw)`, so
  they share the popup schedule.
  - The oracle dismisses them, and `dismissOverlay()` closes them.
  - They log `<source>` and `<source>-dismiss`.
  - `draw(ov)` returns `{ el, dismiss?, ttlSteps?, after? }`. Without `el` nothing is drawn.
- **Task hooks** are optional. `python -m megawob.scenarios` records them in `html/scenarios.json`. `catalog.hooks()`
  uses that file to decide which eval perturbations a task gets, so rerun it after adding a hook.
  - `facts(model, spec) -> [{ label, value, aliases?, labels? }]`: `aliases` are other spellings of the value,
    `labels` other names of the fact.
  - `parts(model, spec) -> [{ name, value, aliases? }]`: the page's named items and their graded state.
  - `silent(next, prev, spec, rng) -> model | null`: applied only above tau.
  - `retarget(spec, model, rng) -> spec | null`: must leave the error above tau.
  - `faults: false` or `faults(spec) -> bool`: false means no fault (for timing-critical scenarios).
- **Judgment episodes** turn reportFacts and interruptions off.
- **Status.** `status()` adds `notice`, `unsafe`, `fault` ({kind, fired}) and `silent` ({applied}). `state()` adds
  `hazard` and `preempt` records only when they are on. `megawob/tasks.py` returns the notice once, as the step's
  user message.
- `cursorLag=1` draws the page cursor where the pointer was one action earlier. It is not an episode field.

### Ending messages (replyFormat)

An episode can end with a message (BrowserGym `send_msg_to_user` / `report_infeasible`, `__env.finish`). The kit
grades it in `runtime/reply.js`, never with word lists:

- **`replyFormat`** (internal name `reply`; own stream) takes one of three values:
  - `auto` (default): structured in tasks that declare `reply: true`, the workflow apps and the safety tasks; free
    text elsewhere.
  - `structured`: every task.
  - `free`: no task.
- **Structured.** A reply format is drawn per episode (own fork `reply`). It sets:
  - one of four layouts (json, lines, tags, markdown);
  - synonyms for the field names;
  - the words for each status and reason code;
  - the field order and the wording.

  `env.goal()` appends the format description to the instruction in every episode of a task with judgment modes or
  facts, so its presence never gives a judgment episode away.
  - Statuses: done (a normal ending), ask (ambiguous), impossible, confirm, declined (a safety stop case), stopped
    (interruptions=cancel; the format comes with the notice when the goal does not carry it).
  - Fields: facts, options, what, reason, changes, note (never graded).
- **Free text.** At most 300 characters.
  - ask and confirm need a question mark.
  - ask names the candidates and none of the others.
  - impossible and declined need `report_infeasible`, or no question mark, and name `what`.
  - A report fact counts when its value starts within 3 words after its label in one clause. Commas split clauses
    unless the value has one.
  - A stop names every changed part and no unchanged one.
- **What the task declares** (all data, in `sample()`):
  - ambiguous: `spec.judge.cands: [[name, ...alternates], ...]`, plus optional `need` and `others: [[name], ...]`.
    - `cands` is what tells the candidates apart on the page. `cands[k][0]` is what the oracle offers. Same-named
      things are twins: `[[n], [n]]`.
    - `others` are the page's other names of that kind, never to be offered.
    - Options must each name exactly one candidate, no two alike.
  - impossible: `spec.judge.what: [name, ...]` (the missing thing or impossible value; required by the checker).
  - safety stop cases: `spec.judge.reasons: [code, ...]` (phishing, injection, deceptive, privacy, other) and `what`.
  - reportFacts: `facts()`; interruptions: `parts()`; answerIn=reply: `answers()` / `answered()`.
  - `judged(model, spec, info)` stays optional, for model checks only (`info.reply` is the parsed reply).
- **The oracle** writes its endings with `kit.reply.format(env, o)`.
- **Checks.** `megawob/check.py` runs every judgment mode in both reply formats. `python -m megawob.hackcheck` runs
  scripted cheats (hedges, page dumps, sprays, echoes, empty stops) against every task. Each cheat must stay at or
  below 5%.

### Add a randomization parameter

1. Add a row to `TABLE` in `runtime/knobs.js` with `stream: 'own'`. Never add a `'shared'` row: it would shift every
   later shared draw. Unset, an own parameter draws nothing.
2. Add the key to `ORDER` (the episode record). If tasks read it, pass it in `sampleOpts()` too. If its public name
   differs from the internal one, add the pair to `PARAMS` (`kit.knobs.fromParams` translates at reset).
3. Document it in the `env.js` header parameter list. Tasks read it in `sample()`; widgets see it as `ctx.episode.<key>`.
4. On the Python side:
   - `catalog.Config.from_env` (`knobs`: a `MEGAWOB_<NAME>` variable through `setting()`, so a preset can set it too);
   - `catalog.EVAL_PERTURBATIONS` if it is an eval perturbation;
   - `check.py` `ROUND2_SWEEP` or a list like it with its own seeds (`SWEEP`, `KNOB_MIX` and `JUDGE_SWEEP` feed
     the golden snapshots, so changing them changes every capture);
   - `gallery.py` `VIEWER_KNOBS`;
   - its row in [docs/configuration.md](../../docs/configuration.md) and a section in
     [docs/randomization.md](../../docs/randomization.md).
5. Pin its default, gating and draw in `tests/kit/knobs.test.mjs`.

### Add a content bank or helper

1. Add it to the right `content/*.js` file through its `Object.assign(C, {...})` block. Helpers that draw take the
   rng first and honor `opts.csplit` through `split()` / `pick()` / `sample()`. Content files hold static data only:
   no DOM, `Date`, `fetch` or `Math.random`.
2. List it in the `content/core.js` header with its size and shape.
3. A new file goes into `CONTENT_FILES` in `env.js`; the unit-test loader reads the same list.
4. Text must be original and fictional: no real brands and no living people.
5. Adding a bank changes nothing until a task uses it. Changing an existing bank's items or order changes content
   for existing seeds: give that its own commit and revalidate (golden plus checker).

The same holds for `instruct.js`: new templates or registers change instructions for existing seeds. Add them as
new options that tasks opt into, or treat the change as a revalidated content change.

### Add an overlay kind, or a site key

- **A design-specific obstruction** (a tour bubble, a survey) needs no kit change. Declare
  `initialOverlay: {kind, p?, at?}` in `site.js` and draw it in `overlay(ctx)` when `ctx.initial` is true. The kind
  is a free string: design-* sites use `tour` and `survey` beside the five standard kinds.
- **A new popup kind** (the `popups` parameter) is a large change. It needs:
  - `KINDS` in `runtime/overlay.js`;
  - every site with `overlay()` able to draw it;
  - `BANNER_TEXTS` in `content/ui.js` for its copy;
  - the popups mixes in `catalog.Config.from_env` and `check.py` (`KNOB_MIX`, `SWEEP`).

  It changes every training episode that samples popups, so plan it as its own change.
- **A new site key** (like `pauseOnOverlay`) is read where reset, the overlay module or the clock needs it. Document
  it in the `env.js` site contract, and ship it with its first site.

### Add a runtime module or a `util` helper

- **A runtime module.** Write `runtime/<name>.js` as an IIFE that sets `kit.<name> = {...}` on
  `window.__megawobKit`.
  - Add a `<script>` tag to `play.html` before `env.js` (stubdom reads the tags from `play.html`).
  - Add the name to `MODULES` in `env.js` if `env.js` calls it.
  - List it in the `env.js` header.
  - State the module keeps between calls goes in its own slot `env._rt.<name>`. The module's reset hook makes the
    slot: `reset(env)`, or `schedule(env)` for the parameters. `env.reset()` calls that hook.
  - Other modules read the slot through the module's functions (`kit.clock.steps(env)`,
    `kit.preempt.pending(env)`, `kit.fault.on(env)`), never directly. The header says what the slot holds.
- **A pure helper for tasks.** Put it in `runtime/data.js`: the header entry, `kit.data = {...}` and a test in
  `tests/kit/data.test.mjs`.
  - `env.util` spreads `kit.data`, and the `util-copy` lint rule then flags any task that defines a function of
    that name.
  - First check that tasks do not already carry copies. Migrate those copies in the same change.

## Testing a kit change

Run the cheapest layer first. Each layer sees something the others cannot.

| Layer | Command (from the repo root) | Time | Catches |
|---|---|---|---|
| Unit tests | `node --test tests/kit/*.test.mjs` | ~1 min | rng, parameter draws and defaults, scoring, judge, clock, overlays, oracle, split drags, input gate, instruct outputs, the usage rules |
| Golden, node layer | `python -m megawob.golden capture DIR` | ~1 min | per widget (every widget, 3,000+): parameters, spec, model, instruction, start score, first plan step |
| Golden, browser layer | (same command) | ~5 min | base, trait-tests and mock-*: the oracle trajectory, every score, end status, start and end screenshots |
| Checker | `python -m megawob.check --site X --seeds 20` | minutes per site | every viewport, the parameter mix and sweep, overlays, layout, determinism |
| Full check | `python -m megawob.check` (every widget of every site) | many hours | widget code in all 2,900+ design-* sites |

The usual loop for a kit change:

```bash
git stash && python -m megawob.golden capture /tmp/golden/before && git stash pop
node --test tests/kit/*.test.mjs
python -m megawob.golden capture /tmp/golden/after
python -m megawob.golden compare /tmp/golden/before /tmp/golden/after --noise 0 0
python -m megawob.check --site base --seeds 20
python -m megawob.check --site trait-tests --seeds 20
```

**What the golden layers record.**

- **Node layer.** It boots every widget of every site in a Node `vm` stub DOM. Per run it records the randomization
  parameters as drawn, the spec, model, instruction, inputs, start score and first plan step.
- **Browser layer.** It runs `base`, `trait-tests` and the `mock-*` sites in Chromium at 1280x720. It adds the
  oracle trajectory, the score after every action, the end status and lossless start and end screenshots
  (about 80 MB). Keep snapshots outside the repository.
- **Runs per widget.** They follow `check.py`: seeds with the parameter mix, one run per scenario, and the sweep of
  parameter values.
  - There are also `full` runs where every parameter draws (`golden.FULL_MIX`).
  - Only the `full` runs catch a reordered shared stream, because the checker's mix leaves `inputRoute`,
    `composition` and `undeclaredInput` undrawn.

How to read and extend the results:

- **Golden differences.** Two captures of one kit are identical, screenshots included (`--noise 0 0`), so any
  difference is real. It is either intended or a bug.
  - List an intended difference with `--ignore 'pattern'`, matched against the printed paths.
  - Typical bugs are a widget whose model lags the page, or state that leaks across episodes on the reused page.
  - `--noise PX DELTA` accepts small screenshot differences, if you need to.
- **Known gaps.** Node's V8 and Chromium's can differ in the last digit of a `Math` result, and Playwright returns
  `-0` as `0`. Neither matters for a before/after comparison.
- **What golden cannot see.** The node layer stubs frame, overlays and every widget's `render` / `locate`. A change to
  widget-facing code (`env.ui`, `_render`, overlays) therefore also needs the checker on the affected sites. Run the
  full design-* check once at the end.
- **Checker flags.** `--seed` and `--viewport` prefix-match `--seeds` and `--viewports`. Pass a viewport list
  explicitly:

  ```bash
  python -m megawob.check --site X --viewports 1024x640 1280x720 1366x768 1440x900 1536x864
  ```
- **Testing new work outside the repo.** Point `MEGAWOB_HTML` at a scratch copy of `html/` (with `kit/`,
  `play.html`, `tasks/`, `scenarios.json` and the sites you need). The worked example above was checked this way.

A unit test for kit behavior registers a test task straight into the kit, with no browser and no boot:

```js
import test from 'node:test';
import { testEnv } from './stubdom.mjs';
import { lineTask, plain, same } from './fixtures.mjs';

test('within tau the oracle clicks the end control', () => {
  const { env } = testEnv({ task: lineTask() });   // site end control at (600, 670); locate(t) = [t.x, t.y]
  env.reset(1, { startState: 'off' });
  env._update({ ...env.model, x: env.spec.target });
  same(plain(env.oracle()), { type: 'click', at: [600, 670] });
});
```

To work with a real page instead, `bootPage({task, site, widget, seed})` from `stubdom.mjs` boots that widget with its
frame and render stubbed. Compare objects made inside the vm with `same()`, not `assert.deepEqual`: they have the
vm realm's prototypes.

## Auditing kit usage

Use this for a usage census of kit options, a kit refactor or any "who uses X" question.

**Where each surface is read.** `env.js` holds boot, `reset()`, `_render()` and `_update()`. The rest is in the
`runtime/*.js` modules, which `env.js` calls by name (`kit.<module>.<function>`). Find code by name: line numbers
drift.

| Surface | Read in |
|---|---|
| Randomization parameters | `TABLE` in `runtime/knobs.js` (one row per parameter, in draw order), then `sampleOpts()`, which is what `sample()` gets |
| Site keys (`langs`, `initialOverlay`, `pauseOnOverlay`, `overlay`, `frame`) | `runtime/knobs.js`, `reset()`, `runtime/overlay.js`, `runtime/clock.js` |
| Widget keys (`scenarios`, `traits`, `scrollable`, `uses`, `render`, `locate`) | `boot()`, `reset()`, `_render()`, `action()` in `runtime/oracle.js`. The kit passes `traits` to `sample()` and reads none itself. `split` is read from `manifest.json` by `catalog.py`, not by the kit. |
| Optional task fields (`judgeModes`, `judged`, `reply`, `ended`, `tick`, `tickMs`, `inputs`, `uses`) | `runtime/knobs.js`, `reset()`, `_update()`, `runtime/clock.js`, `runtime/judge.js`, `runtime/reply.js`, `runtime/input.js` |
| `heldoutScenarios`, `startModes`, `judgeModes`, the hooks | `megawob/scenarios.py`, which writes `html/scenarios.json` for `catalog.py` |
| Scoring | `runtime/score.js` (`compute()`, `check()`), `runtime/judge.js` |
| Oracle | `runtime/oracle.js`; split drags in `runtime/split.js` |
| Input gate, click runs | `install()` in `runtime/input.js` |
| Primitive options | the `opts` reads in each `ui/*.js` (compare them with the file header) |
| Content banks, `env.instruct` | the `content/core.js` and `instruct.js` headers |
| Traits | each task's `logic.js` header, the traits table in [docs/architecture.md](../../docs/architecture.md#opt-in-traits-and-scenes), the `expect` clauses in `sites/trait-tests/manifest.json` |

**Count by site group.** Split every count into four groups. An option used only by `base` or `trait-tests` is
never exercised by a training site, and one used by no group is dead.

- `base`: covers every scenario and most opt-in traits.
- `trait-tests`: re-registers base widgets with extra traits (`env.traitTests.derive`); count only the traits it
  adds.
- `mock-*`: the eval-only sites.
- `design-*`: the training data, one widget per site.

**Count from the registered definitions, not with grep.** Tasks, sites and widgets are object literals passed to
`env.task()`, `env.site()` and `env.widget()`. Text search misses spreads and defaults, and over-counts generic
names (`lines` also matches `b.lines`).

Instead:

1. Load each `logic.js`, `site.js` and `widgets/*.js` in a Node `vm` context.
2. Make its `env` record what those calls receive.
3. Give the other globals permissive Proxy stubs.

`megawob/widgetdefs.mjs` does this. Every widget loads in seconds.

Grep is still right for calls inside function bodies (`ui.slider({...})` options, `traits.x` reads). Mind the
aliases:

- Tasks reach content as `C.X`, `arr('KEY')`, `bank('KEY')` or `C[key]`.
- Tasks reach instruct as `I`, `In`, `ins` or `I()`.

A full audit splits into three read-only passes that can run in parallel:

1. widget traits, site, widget and task keys, and randomization parameters;
2. the `ui/` primitives and `env.util`;
3. `content/` and `instruct.js`.

**RNG streams.** A kit change must not move any draw an existing episode depends on.

- **Shared stream.** These parameters draw in this order from one stream, `knobs/<task>`:
  1. `startState`
  2. `popups`
  3. `instructionDisplay`
  4. `finishByMessage`
  5. `popupAt`
  6. `inputRoute`
  7. `composition`
  8. `undeclaredInput`
  9. `pageLanguage`

  These are the `'shared'` rows of `TABLE`; `kit.knobs.PARAMS` maps their internal names to the public ones.
  Removing or reordering one shifts every later draw. A parameter draws only when it has weights.
- **Own streams.** Every other parameter draws from its own `knob/<name>` fork. That covers `difficulty`,
  `judgment`, `instructionNoise`, `dragSteps`, `stepms`, `timescale` and the
  [behaviour parameters](#behaviour-parameters-pagefaults-reportfacts-interruptions-silentfailures-safetyhazards-answerin).
  A new parameter gets an `'own'` row.
- **Salting.** Parameters and the frame draw from streams salted with the task, so one seed does not give every task
  the same parameters. The stream names keep their old spelling (`chrome/<task>`) so episodes stay identical.
- **Safe changes.** Deleting code that never runs, or never draws, is safe.
- **Revalidated changes.** Changing `env.instruct` or `env.content` (wording, banks, splits) changes instructions
  and content for a seed. Give it its own commit and revalidate.

## Debugging a page

Open a page directly in Chromium:

```text
html/play.html?task=set-slider&site=base&widget=classic&seed=3&debug=1&shortcut=1
```

| Param | Effect |
|---|---|
| `debug=1` | shows live `state()` and `status()` |
| `shortcut=1` | a "Set to target" button that calls `solve()`, then flags the episode |
| `cursor=0` | hides the drawn cursor |
| `clock=real` | task time runs from wall time, so timed tasks move on their own |
| randomization parameters | force one: `&startState=wrong&popups=cookie&popupAt=0&instructionDisplay=panel` |

`python -m megawob.gallery --serve` gives the same view with parameter pickers and an oracle overlay. It also has:

- a per-action reward log of your own play;
- a finish-message box;
- oracle Step / Play from the current state.

Over `file://` the gallery cannot reach its iframe.

In the console:

- `__env.state()`: task, widget, scenario, seed, randomization parameters, spec, model.
- `__env.score()` and `__env.status()`.
- `__env.oracle()`: the oracle's next action, without performing it.
- `__env.events()`: grabs, releases, values, overlays, rejected input, and calls ignored as stale.
- `__env.reset(seed, {startState: 'partial'})`: rerun in place.

Common failures and where to look:

| Symptom | Usually |
|---|---|
| `megawob boot error: ... did not register` | the task or site name differs from its directory, or the file threw while loading |
| `scenario 'x' not supported by widget` | the widget's `scenarios` lacks it; rerun `python -m megawob.scenarios` after changing scenarios |
| `env.ui: <what> is not rendered` from the oracle | `locate()` targets an element that is hidden, closed or scrolled away; the plan asks for something the page does not show |
| layout violation | an anchor moved after render; call `ctx.reanchor()` after a legitimate change, or keep the anchor still |
| "anchor outside the stage" | the widget sized itself from the window or a fixed height; size it from `ctx.size` |
| "reset(7) is not deterministic" | the widget reads wall time, keeps state across resets, or its model lags the page |
| "stuck: click at x,y repeated" | something covers the target (the checker names the element on top), or the click does not reach the handler |

## Gotchas when changing the kit

- **Reading a parameter is safe; drawing one is not.** Removing, reordering or adding a draw on a shared stream
  (`knobs/<task>`, `spec#i`, `instruction`, `chrome/<task>`, `widget`) shifts the episodes of every site. Fork a
  new label instead.
- **`ended()` runs after every update and tick.** Do not add a no-op `tick` just to get it evaluated.
- **`ctx.model` is a getter.** It reads the current model even from an old ctx. `update`, `patch`, `flag` and `log`
  from an old episode are dropped and logged as `ignored`.
- **`render` may run more than once per episode.** Without `sync`, every clock step of a timed task re-renders the
  widget. The `widget` fork restarts on every render, so the draws repeat.
- **Trainer API names are reserved.** Never name an instance field like a method (an `events` array once shadowed
  `events()`).
- **`env.ui.buttons` keys read from `data-key` are strings.** Pass `opts.keys` for numeric keys. For targets that are
  not rectangles (ring wedges), pass `point(el, key)` so `locate` clicks inside the shape.
- **CSS `zoom` breaks hit testing in this Chromium.** Vary scale with the viewport or the device scale factor.
- **The checker runs Chromium with `catalog.RASTER_ARGS`** (`--disable-partial-raster --disable-smooth-scrolling`).
  Without them, screenshots differ from run to run at shape edges and a wheel action can leave a pane half-scrolled.
- **There is no hidden registry.** Four lists must agree:
  - `UI_PRIMITIVES` in `env.js`;
  - `CONTENT_FILES` in `env.js`;
  - the `<script>` tags in `play.html`;
  - `MODULES` in `env.js`.

  The unit-test loader reads the first three from the source, so only `env.js` and `play.html` need editing.
