# Widget templates

The design-* sites (`html/sites/design-<task>-<scenario>-<NN>/`) render their task with shared widget code from this folder.
A design-* site's `widgets/<task>.js` holds only its design: the template it builds on, design tokens and the few parts
it does differently. A fix to a template therefore reaches every site built on it.

```text
templates/<task>/<name>.js     one template: shared widget code for one task (all its scenarios)
templates/<task>/_<topic>.js   a shared template file: code the task's templates build on (env.templateLib)
sites/design-*/widgets/<task>.js    one design: env.widget({..., template: '<task>/<name>', design: {...}})
sites/design-*/site.css             the design's look (templates bring structural CSS; sites restyle it)
```

A task has one template, or a few when its design-* sites descend from implementations that really differ (a cube
rotator and a dial rotator). Templates are widget-layer code: the kit rules for widgets apply (determinism, ctx.size,
anchors, inputs, the contract lint), and the kit itself still holds no widget code or CSS.

## How a widget uses a template

```js
// sites/design-sort-into-bins-collect-01/widgets/sort-into-bins.js
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-collect-01',
  name: 'design',
  split: 'train',
  scenarios: ['collect'],
  traits: { layout: 'central', itemSize: .18 },
  template: 'sort-into-bins/boxes',
  design: {
    caption: 'Box',                                      // a token
    parts: {                                             // replaced parts
      title: () => (it) => `${it.color} ${it.shape}`,
      shapeSvg: (base, S) => (content, it) => base(content, it).replace('rx="7"', ''),
    },
  },
});
```

After loading the widget file the kit loads `templates/<template>.js` once and registers
`{ ...make(design, def), ...the widget file's other keys }`: the template supplies `render`, `locate`,
default `traits` and so on, and any key the widget file sets itself (`traits`, `scrollable`, `answerReply`, ...) wins.
The lint fails a design-* widget file without `template` (the base, trait-tests and mock-* sites are exempt).
The widget file keeps the identity keys (`task`, `site`, `name`, `split`, `scenarios`) and the manifest entry as
before. A widget file may wrap its registration in an IIFE to keep helper constants (colors, SVG) private.

The widget is checked twice (`kit/runtime/validate.js`): when the file registers it, it needs `task` and `template`
(`design`, if given, an object whose `parts` are functions; a misspelled key throws), and once the template is
resolved the whole object must satisfy the widget contract (`site`, `name`, `render`, `locate`, ...), every widget the
template registers separately.

## Writing a template

A template registers a factory and keeps all per-page state inside it; `env.templateDesign` resolves the design:

```js
(function () {
  'use strict';
  const CSS = `...`;                                     // module-level constants are fine
  const TOKENS = { caption: null, stepHint: false };     // every token, with its default
  const SCENARIOS = {                                     // what the sites of one scenario share
    single: { stepHint: true },
    collect: { caption: 'Box' },
  };

  env.template('sort-into-bins/boxes', (design, def) => {
    let D, P;                                            // tokens and parts, resolved below
    let board, geo, spec, ctxRef;                        // state of this page
    const BASE = {};
    const S = { get board() { return board; }, get geo() { return geo; }, set geo(g) { geo = g; },
      get spec() { return spec; }, get ctx() { return ctxRef; }, get D() { return D; }, get P() { return P; } };

    BASE.fit = (ctx) => ({ ... });                       // parts: the units a design may replace
    BASE.renderBoxes = function (ctx) { ... P.fit(ctx) ... D.caption ... };

    ({ D, P } = env.templateDesign('sort-into-bins/boxes', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return { inputs: [...], render(ctx) { ... }, locate(t) { ... } };
  });
})();
```

`env.templateDesign` applies three layers in order: the token defaults and `BASE` parts, the preset in `SCENARIOS`
for the widget's scenario (when it declares exactly one), then the widget's design. A preset has the same shape as a
design (tokens and `parts`); a part override wraps the layer below it, and a token replaces the one below it (an
object token such as an SVG table is replaced whole, not merged). Unknown tokens and parts throw, so a typo fails the
checker instead of silently changing nothing.

- **Defaults reproduce real sites.** With `design: {}` the template (with its scenario's preset) behaves exactly
  like one existing design-* site of each scenario (the header names them): same DOM, same rng draws, same episodes.
  Start from one site's widget.
- **Task x scenario.** Code for one scenario lives once, in the template (one path per scenario, or scenario
  branches). What the sites of one scenario do alike (a caption every collect site adds, a hint every single site
  writes) is that scenario's preset, so those sites' designs stay empty. When the scenarios are different pages on
  shared frame and helpers, the shared code stays once and each scenario adds its own parts (below). Write one
  template per scenario (`templates/<task>/<scenario>.js`) only when the scenarios share little (one menu, one
  slider, one pie) rather than one file with unrelated halves.

### Scenarios with their own parts

A template that serves several scenarios keeps the code they share once (window frame, geometry, DOM helpers,
event binding, `locate`) and gives each scenario the parts only it has. The widget's scenario (`def.scenarios[0]`; every
design-* widget declares one) is known in the factory, so the template installs the parts of that scenario only:

```js
  env.template('protect-privacy/classic', (design, def) => {
    const BASE = {};
    const V = def.scenarios[0];
    BASE.element = ...;                                  // shared parts
    if (V === 'redact') {                                // redact's own parts
      BASE.toolbar = (main, m) => { ... };
      BASE.view = (m) => { ... P.toolbar(main, m) ... };
    }
    if (V === 'share') { BASE.document = ...; BASE.view = ...; }
```

Two scenarios may define a part of the same name (`view`, `document`) differently; a design overrides the one of its
scenario, and a design that names another scenario's part throws like any unknown part. Token defaults that differ
per scenario go in the scenario's preset (`SCENARIOS`). The header lists the shared parts, then each scenario's.
Adding a scenario to such a task is one more block (and a preset when its defaults differ), not a new copy of the
template.
- **Tokens** are data: labels, sizes, flags, SVG markup, color tables.
- **Parts** are the functions a design may replace: `parts: { name: (base, S) => replacement }`, where the
  replacement takes the part's arguments and may call `base(...)`. The template calls parts only through `P` and
  reads tokens through `D` (both resolved before render), so a replaced inner part (`toPx`) also changes the outer
  parts that use it. `S` reads the live state (getters; a setter where a design must change it, such as `S.geo`),
  the tokens (`S.D`) and the parts (`S.P`).
- **Granularity.** Variation that two or more sites share becomes a token or a part of its own; hooks that default
  to nothing (`box(ctx, el, container)` after each box is built, `rendered(ctx)` after the layout is drawn) cover
  added decorations. Keep parts small enough that a design replacing one copies little code; a site with a
  one-off change replaces the smallest part that contains it.
- **The header documents** the scenarios, the sites the defaults reproduce, every token (meaning and default), each
  scenario's preset and every part (arguments, return value, default behavior).
- **No DOM work in the factory** itself: it runs once per page load, before any episode. Build DOM in `render`.
- **Randomness:** a part override must keep the rng draws of the part it replaces (each `rng.int`, `pick`, `bool`,
  in order), or every seed's episode changes. Draw extra values from `ctx.rng.fork('<label>')`.

## Shared template files

A template longer than about a thousand lines, or code several templates of one task share (a CSS string, a
builder, an asset map), goes in shared files next to it: `templates/<task>/_<topic>.js`. A shared file registers a
factory with no arguments that returns its values and functions; a template names the shared files it uses, and the
kit loads them before the template is built:

```js
// templates/use-bank/_records.js
(function () {
  'use strict';
  env.template('use-bank/_records', () => ({ RECORD_CSS: `...`, recordRow(ctx, item) { ... } }));
})();

// templates/use-bank/ledger.js
(function () {
  'use strict';
  env.template('use-bank/ledger', (design, def) => {
    const { RECORD_CSS, recordRow } = env.templateLib('use-bank/_records');   // made once per page
    ...
  }, { uses: ['use-bank/_records'] });
})();
```

- A shared file's factory runs once per page, the first time `env.templateLib(name)` asks for it; keep per-episode
  state in the template's own code, as before. A shared file may itself list `uses`.
- Code moved into a shared file keeps its statement order, so every rng draw happens where it did.
- A unit a design-* design overrides (`parts`) stays a unit of the template (it may call into the shared file); a
  design cannot override what only a shared file defines.
- `megawob/widgetdefs.mjs`, `tests/kit/stubdom.mjs` and `tests/kit/usage.test.mjs` load shared files the same way.

## Base templates

For many tasks, `templates/<task>/base.js` is the source of the base site's widgets, and `templates/site/base.js`
of its site code. The base site uses their defaults:

- its `widgets/<task>.js` is `env.widget({ task, site: 'base', template: '<task>/base', design: {} })` with no
  widget name, which registers every sub-widget the base code registers, each under its own name;
- its `site.js` is `env.site({ name: 'base', template: 'site/base', design: {} })`.

`trait-tests` is the same site design and derives its widgets from those sub-widgets. Other sites built on these
templates keep only what they changed.

- `<task>/base` runs the base code once per page and returns the sub-widget that serves the widget's
  scenario, or the sub-widget named by `design: { widget }`, or every sub-widget for a widget file with no name. Its parts
  (`design.parts`) are the units of the base code, per IIFE:
  - top-level functions, constants and lets, by name (`<name>@<iife>` where the name repeats across IIFEs);
  - other top-level statements, as `stmt<iife>.<n>`;
  - each sub-widget's props, as `<widget>.<prop>`;
  - added functions, constants and lets, as `'+<iife>.<name>'`.

  An override is `(base, S) => replacement`. S is the IIFE's scope: overriding code reads constants and functions
  with `const { ... } = S` and lets as `S.<name>`, so module state stays shared.
  A design that changes part of a unit's result wraps it instead of copying it, so the unit's rng draws stay in
  step: `'mailGeometry': (base) => (ctx, ads) => ({ ...base(ctx, ads), stack: true })`. When a design needs a
  smaller unit than the template has, split the unit in the template (keeping the base output) and override
  the new unit.
- A composite site (the `design-complete-goals-*` sites) embeds other tasks' sub-widgets by name: its
  `widgets/<task>.js` registers `env.widget({ task, name, template: '<task>/base', design: { widget: name } })`
  for every base sub-widget, with no `site` or `split` and no manifest entry (the manifest lists the widgets that
  serve the site's tasks; the kit loads the file through the composite widget's `uses`). A site that changed its
  sub-widgets passes one shared `parts` object to every embedded design: the template runs the base code once
  per page and refuses a second, different parts object.
- `site/base` is a site template (`env.site({ template, design })`, see the kit/env.js site contract). Its
  tokens are the base constants. Its parts are `endLabel`, `overlay`, `fault`, `hazard`, `notice`, and
  `frame`'s sections (`'frame.header'`, `'frame.stage'`, ...). The sections run in order and pass the frame's
  locals along in `_c`, so a design overrides only the sections it changed. It is written like any template
  (`env.templateDesign`); edit it in place.

  The styles of its overlay part and of its fault, hazard and notice parts are
  `templates/site/css/base-overlays.css` and `base-hooks.css`. A design that keeps those parts lists them in its
  `styles` before `site.css` (`styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css',
  'site.css']`) rather than copying them.

### Editing a base widget template

The code in `<task>/base` is the base widget code as it was written, plus hooks that let a design replace
its units. Changing code inside a unit needs nothing else. Adding, renaming or removing a unit keeps its hooks in
step (copy them from a unit of the same kind):
- every top-level name of the IIFE has a getter in the IIFE's `__scope` (a let also a setter), so overrides read it
  through S;
- a function: `if (__has('<key>')) <name> = __parts['<key>'](<name>, __scope);` in the IIFE's prologue;
- a constant or let: `const <name> = __has('<key>') ? __parts['<key>'](undefined, __scope) : (<init>);`;
- another statement a design may replace: `if (__has('stmt<iife>.<n>')) __parts['stmt<iife>.<n>'](undefined, __scope);`
  then `else <statement>`, with an unused `<n>` (the numbers are labels; never renumber).

`<key>` is the name, or `<name>@<iife>` when another IIFE of the file has a unit of that name. `__has` records the
keys it is asked for as the code runs, so the template knows its units without a list, and a design part that
names none of them throws. The code reads `scriptOf` where the original file read `document.currentScript`: the
site's own `widgets/<task>.js`, so vendor and asset paths resolve per site. Renaming or removing a unit migrates
every design that overrides it (search for the key in `sites/*/widgets/<task>.js`). Then compare golden snapshots
of the base site, trait-tests and the sites built on the template (below).

## Site templates

Besides `site/base`, each `templates/site/<name>.js` is a site frame that many design-* `site.js` files are designs
on. It is named after the site it was made from (`site/reorder-items-list-03` from `design-reorder-items-list-03`,
whose design is `{}`).

- **A new site** is a design on `site/base` or on one of these templates. As a design on `site/base` that overrides
  the frame sections it draws differently, it gets the end-control placements and labels, decoys, instruction
  displays, popups and the fault, hazard and notice hooks for free.
- **Standalone frames.** Sites that draw a frame of their own are listed in `html/sites/STANDALONE_SITE_JS.txt`. The
  lint (`site-template`) fails a design-* `site.js` that is not a design unless it is listed, and fails a longer
  list: shrink it, never grow it.

The header of each template lists its tokens and parts:
- **tokens**: the file's constants (`C`, the site's config object, ...), each replaced whole. A top-level `let` the
  code writes is a token too (its initial value); the code reads and writes it as `S.<name>`.
- **parts**: the top-level functions, each hook (`frame`, `overlay`, ...) and its sections `'<hook>.<n>'`, one per
  statement of the original body. The hook runs them in order; the first one that returns a value ends it. Sections
  share the hook's locals through `_c`: a section destructures what it reads from `_c` and publishes what it declares
  with `Object.assign(_c, {...})`; a local the code reassigns, or uses before its own statement, lives on `_c` and is
  written `_c.<name>`.
- A design overrides the sections it changed (`'frame.3': (base, S) => function (_c) { ... }`), and `() => () => {}`
  drops one. Designs name sections by number, so never renumber: new code goes inside the section it belongs to.
- Helpers only one site has stay in its design file, above `env.site`, and may use only each other.

`templates/site/hooks.js` (`site/hooks`) is not a site template. It holds plain `fault()` and `hazard()` hooks, with a
small neutral stylesheet.

- The kit loads it at boot for a site without its own `fault()` or `hazard()` and fills in only the missing hook, so
  page faults and safety hazards reach every site. A site that wants them in its own style defines the hook itself
  (`site/base` does).
- Faults that replace the model (revert, clear) or shrink the stage (shift) re-render the widget, so a widget must
  survive a re-render. What it adds to the frame outside the stage (instruction steps, an option slot) it clears
  first, and UI state its model holds (an open suggestion list) its paint restores.

## Shared base stylesheets (`site/css/`)

Most design-* `site.css` files start with `@import url("../../templates/site/css/<base>.css");`. The rules many sites
share live in a base stylesheet (a base may import its parent), and `site.css` holds only the site's own rules after
the import, so a site's styles are the import's text followed by the rest of its file.

- **To restyle one site**, edit its `site.css` below the import; rules there win.
- **Editing a base** restyles every site that imports it, so golden-compare those sites.
- **A new design** may import a base that fits it, or start from a plain `site.css`.
- `megawob.lint` (rule `css-import`) accepts only `@import url("<path>");` at the top of a file, naming a file in
  `templates/site/css/`, with no cycles.

## Changing a template

A template change changes every site built on it. A new token or part defaults to the old behaviour, so existing
designs are unchanged. Renaming or removing one migrates every design that uses it in the same commit. For a change
to `sort-into-bins` templates:

```bash
python -m megawob.golden capture BEFORE --sites 'design-sort-into-bins-*' --browser-sites 'design-sort-into-bins-*'
# ... make the change ...
python -m megawob.golden capture AFTER --sites 'design-sort-into-bins-*' --browser-sites 'design-sort-into-bins-*'
python -m megawob.golden compare BEFORE AFTER
python -m megawob.check --task sort-into-bins          # the task's other widgets too
python -m megawob.lint --site 'design-sort-into-bins-*'  # also lints the templates those sites name
```
