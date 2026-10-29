# set-slider templates

Two templates. The agent drags slider thumbs to target values.

| Template | Scenarios | What the page shows |
| --- | --- | --- |
| `set-slider/classic` | `horizontal`, `vertical`, `log`, `range`, `multi`, `stops`, `media`, `mixer`, `match` | Straight custom or native sliders. |
| `set-slider/settings` | `horizontal` | Rows of settings sliders, with decorative rows around the live ones. |

With `design: {}`, `classic` draws `design-set-slider-range-12`, `design-set-slider-log-01`,
`design-set-slider-multi-10` and `design-set-slider-vertical-03` for `range`, `log`, `multi` and `vertical`. The
other `classic` scenarios keep the reference behavior. `settings` draws `design-set-slider-horizontal-09`; with
the raw defaults it draws `design-set-slider-horizontal-10`.

The header of each `.js` file lists every token and part. This file is a shorter guide.

## Rules

- Parts are `(base, S) => replacement`. All calls go through `P`.
- A replaced part keeps every rng draw it replaces, in order. The exception is a site whose original had a fixed look
  or length and therefore made no such draw (see `sampleLook` and `sampleLength`).
- A scenario preset can include part replacements. A part you set in `design` replaces the preset's part as a whole:
  `() => replacement` discards what the preset did.
- State is per factory. `S` exposes it as live getters.

## classic

`S` has `ctx`, `sliders` (settable), `D`, `P` and `CSS`.

### Presets

| Scenario | Preset |
| --- | --- |
| `log` | `ticks: true`, `readout: true`, `native: false`, plus `geometry` and `placed` parts that use the whole stage width and place the card at the top left. |
| `multi` | `ticks: true`, `readout: true`, `native: false`, `horizontal: true`, `tickCount: 1`, plus `begin`, `look` and `geometry` parts. |
| `vertical` | `ticks: true`, `readout: true`, plus a `geometry` part for vertical sliders. |
| `range` | None. |

The look draws are still made before the preset overrides apply.

### Tokens

`null` means "keep the sampled value".

| Token | Default | Effect |
| --- | --- | --- |
| `ticks`, `readout`, `native` | `null` | Override the sampled booleans. `readout: 'shown'` follows `spec.showValue`. |
| `thumb`, `rail`, `thumbBox` | `null` | Dimensions in px. |
| `sampleLook` | `true` | Draws the look stream. `false` is for sites that never made those draws. |
| `sampleLength` | `true` | Draws the length stream. `false` is for sites that never made those draws. |
| `clear` | `false` | Installs `widgetDef.clear`. |
| `stageStyle` | `false` | Puts the stylesheet in the stage and replaces it on each render. |
| `horizontal` | `false` | Forces a horizontal presentation. |
| `seededOrientation` | `false` | Uses `spec.vertical` for the length draws even when the presentation is horizontal. |
| `rowClass` | `null` | A class that replaces `display: contents` on rows. |
| `minor` | `null` | Minor ticks: `{log, tag = 'div', cls = 'slc-minor', before = false, vertical = false, count}`. |
| `bubble` | `null` | A value label inside every thumb: `{tag = 'span', cls, units = false}`. |
| `cross` | `null` | Hit thickness override. |
| `tickCount` | `null` | Tick count override. |

### Parts

Shared:

| Part | Result and default behavior |
| --- | --- |
| `ensureStyle()` | Installs the structural CSS. |
| `placeIn(ctx, el, rng, pad = 12)` | Sampled placement. |
| `keyboard(ctx, el, index, s, get, set)` | Focus and key bindings. |
| `tickValues(s, scale, n, L, vertical)` | The tick labels. |
| `commit(ctx, index, values)` | Updates the model. |
| `makeSlider(ctx, parent, index, s, g)`, `makeNative(ctx, parent, index, s, g)` | The controllers. |
| `renderPlain(ctx, look)`, `renderMedia(ctx, look)`, `renderMixer(ctx, look)` | The layouts. Each returns the controller array. |
| `begin(ctx)` | Runs before the look. No-op. |
| `look(ctx)` | The sampled look, with the token overrides. |
| `rendered(ctx, look)` | The optional clear binding, after all widgets. |
| `sync(ctx, model)` | Runs before the sync. No-op. |

Layout:

| Part | Result and default behavior |
| --- | --- |
| `size(ctx, look)` | `ctx.size`. |
| `orientation(ctx)` | `spec.vertical`, or the horizontal override. |
| `card(ctx, l)` | Creates the card. |
| `limits(ctx, l)` | `{maxV, maxH}`. |
| `length(ctx, s, l, limits)` | The sampled length in px. |
| `beforeGroup(ctx, l)` | Runs before the group. No-op. |
| `group(ctx, l)` | The group element. |
| `layout(ctx, l)` | Runs after setup. No-op. |
| `parent(ctx, l, s, i)` | The group element for a slider. |
| `geometry(ctx, g, s, i, l)` | Applies `tickCount` and mutates the widget geometry. |
| `control(ctx, parent, i, s, g, native)` | Builds the controller that fits. |
| `controlled(ctx, ctl, s, i, l)` | No-op. |
| `beforePlace(ctx, l, controllers)`, `placed(ctx, l, controllers)` | Before and after the sampled card placement. No-op. |

One slider's parts:

| Part | Result and default behavior |
| --- | --- |
| `root(ctx, el, index, s, g)` | The row display. |
| `label(ctx, root, index, s, g)` | The label element. |
| `cross(ctx, index, s, g)` | The hit thickness in px. |
| `rail(ctx, w)` | Runs after the rail is created. No-op. |
| `beforeThumbs(ctx, w)`, `thumb(ctx, w, el, j)` | Decorations before and on the thumbs. |
| `ticks(ctx, w)` | The ticks. |
| `minorTicks(ctx, w, ticks)` | The configured minor marks. |
| `readout(ctx, w)` | The readout element, or `null`. |
| `afterReadout(ctx, w)` | Runs after the readout exists. No-op. |
| `paintReadout(ctx, w, values)` | The readout text. |
| `painted(ctx, w, values, fractions)` | Thumb labels. No-op. |
| `sliderOptions(ctx, w)` | Extra primitive options. Default `{}`. |
| `widget(ctx, w)` | Runs after the first paint. No-op. |
| `native(ctx, {input, index, s, g, L, T, center, value, paint})` | Runs after the native event bindings. No-op. |

`w` is `{root, body, hit, rail, fill, index, s, g, L, cross, frac, fmt, n, thumbs, readout}`. Its fields become
available as they are built. `l` is `{size, vertical, n, anyLog, look, card, group}`.

## settings

A settings section of rows. Some rows are live sliders and the others are decorative and inert. `S` has `ctx`,
`controls` (settable), `D`, `P` and `def` (the widget identity). The template draws no random numbers.

The `horizontal` preset sets: `rows: 4`, labels `Brightness`, `Contrast`, `Saturation`, `Sharpness`, `max: 10`,
`order: 'prepend'`, `ticks: 4`, `fill: true`, `fillFirst: true`, and decorative values for the four labels.

### Tokens

| Token | Default | Effect |
| --- | --- | --- |
| `rows` | `3` | Number of rows, live and decorative. |
| `labels` | `['Brightness', 'Sharpness', 'Contrast']` | Row labels. |
| `min`, `max` | `0`, `1000` | Range of the sliders. |
| `order` | `'swap'` | Order of the rows. See below. |
| `ticks` | `8` | Tick intervals. `null` disables ticks. |
| `major` | `0` | Every Nth tick gets `.major` when not zero. |
| `fill` | `false` | Creates a fill behind the thumb. |
| `fillFirst` | `false` | Creates the fill before the ticks. |
| `fillMode` | `'width'` | `'width'`: width in percent. `'variable'`: the `--f` variable. `'inset'`: width `calc(percent + .8em)`. |
| `labelSuffix` | `''` | Suffix of the label text. |
| `heading` | `null` | Heading text of the settings section. `null` uses an `h3`. |
| `settings` | `true` | Wraps the rows in a settings section. |
| `locateError` | `'Unknown library slider'` | Error for an unrecognized slider target. |
| `decorative` | `null` | `{label: number}` fixed values for the inert rows. `null` uses `Brightness = 512` and `300` for the rest. |
| `decorativeFraction` | `null` | A fixed percent for all inert rows. `null` uses 51.2 and 30, or the values from `decorative`. |

`order` values:

- `'swap'`: exchanges the first two rows, for one live control.
- `'last'`: rotates the live row to the end.
- `'prepend'`: puts all decorative rows first.
- `'scoredLast'`: moves the targeted live rows last.
- `null`: keeps the order.

### Parts

| Part | Result and default behavior |
| --- | --- |
| `begin(ctx)` | Runs before the model is copied. No-op. |
| `settings(ctx)` | The settings container. The stage when `settings` is false. |
| `rows(ctx, settings)` | The `.slider-rows` element. |
| `entries(ctx)` | `[{s, i}]`: the live and decorative rows. `i` is `null` for decorative rows. |
| `prepared(ctx, rows, entries)` | Runs before the rows are built. No-op. |
| `row(ctx, rows, s, i)` | Builds a row. Returns `w`. |
| `ticks(ctx, w, s, i)` | The tick marks. |
| `endpoints(ctx, w, s, i)` | The min and max labels. |
| `readout(ctx, w, s, i)` | The output element. |
| `decorative(ctx, w, s)` | Position and text of an inert row. |
| `place(ctx, w, s, i, thumb, point, fraction)` | Places the thumb and the fill. |
| `paint(ctx, w, s, i, values)` | The value text. |
| `bind(ctx, w, s, i)` | `{ctl, paint}`: the controller and keyboard. |
| `keyboard(ctx, hit, s, i, ctl, commit)` | The key and focus wiring. |
| `rendered(ctx, rows, entries)` | Runs after the controls. No-op. |
| `reset(ctx, initial, sync)` | Binds the page reset action. |

`w` is `{row, body, hit, thumb, fill, readout}`. Parts may add private fields.

## Common changes

- Ticks, readout or native input: `ticks`, `readout`, `native`.
- Minor ticks: `minor`, `minorTicks`.
- A label in each thumb: `bubble`, `thumb`, `painted`.
- Slider sizes: `thumb`, `rail`, `thumbBox`, `cross`, `size`, `length`, `geometry`.
- Extra decoration around the group: `beforeGroup`, `group`, `layout`, `beforePlace`, `placed`.
- A current or target label that follows the value: `begin`, `painted`, `commit`, `rendered`, `sync`.
- A fixed layout with no look or length draw: `sampleLook: false`, `sampleLength: false`.
- A fill behind the thumb in `settings`: `fill`, `fillFirst`, `fillMode`, `place`, `paint`.
- The row mix in `settings`: `rows`, `labels`, `order`, `entries`, `heading`, `settings`.
- Preview panels around the rows: `begin`, `rows`.

Verify a change to these templates as `templates/README.md` ("Changing a template") describes: golden snapshots of
the sites built on them before and after, the checker and the lint.
