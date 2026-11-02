# read-figure templates

Two templates. The agent looks at a figure, reads it and answers by clicking or typing a number.

| Template | Scenarios |
| --- | --- |
| `read-figure/scene` | `addition`, `ascending`, `color`, `count`, `greatest`, `grid`, `identify`, `number-checkboxes`, `shape` |
| `read-figure/shades` | `shades` |

`scene` draws a content root around a scene. The scene holds the widget of the scenario, an Undo bar, an optional
reset control and menu labels. `shades` draws a panel of shade tiles and has little in common with the others.

| Scenario | What the page shows |
| --- | --- |
| `addition` | Two groups of blocks. The agent types the total. |
| `ascending` | Number tiles to click in ascending order. |
| `color` | Swatches. The agent clicks the one named, or the one that matches a sample. |
| `count` | Items on a board, or a polygon. The agent counts items or sides and answers with buttons or by typing. |
| `greatest` | Cards. The agent finds the greatest. |
| `grid` | A labeled coordinate plane. The agent clicks the dot at a given point. |
| `identify` | One big figure. The agent clicks the button that describes it. |
| `number-checkboxes` | A digit or pattern to copy into a grid of checkboxes. |
| `shape` | Letters, digits and shapes on a board. The agent clicks the one that matches a description. |
| `shades` | Tiles in shades of one hue. The agent selects every tile of the named hue. |

With `design: {}`, each scenario draws the page of its first design: `design-read-figure-<scenario>-01`. The
exceptions are:

- `number-checkboxes` draws `design-read-figure-number-checkboxes-03`.
- `shades` draws `design-read-figure-shades-03`.

The header of each `.js` file lists every token and part. This file is a shorter guide.

## Rules

- A scenario preset sets some tokens before your design. Anything in `design` wins over it. Unknown tokens and
  unknown parts throw.
- Object and array tokens replace the whole value.
- Parts are `(base, S) => replacement`. A part that belongs to another scenario throws.
- All state belongs to the factory. Hooks see live state through `S`.
- The renderer draws no random numbers in `scene`. In `shades`, a replaced part keeps the original draws, in order:
  `layout` draws twice, `resultBar` three times, and `place` draws from its fork before it calls `position`.
- The panel stylesheet of `shades` and the structural CSS of `scene` keep rules some scenarios do not use, so site CSS
  can depend on the cascade.

## scene: presets

| Scenario | Preset |
| --- | --- |
| `addition` | `cubeFaces: ['#ff9a35', '#fa8421', '#b55813']` (orange cubes). |
| `color` | `swatchSizing: true`. |
| `count` | `boardColumns: 5`, `sceneBoard: true`, `largeScale: .85`, `answerCaption: 'Your answer:'`. |
| `greatest` | `resetLabel: 'Clear Selection'`. |
| `grid` | `resetLabel: 'Clear'`, `gridArrows: true`. |
| `number-checkboxes` | `answerTitle: 'Your Answer'`, `resetLabel: 'Clear'`. |
| `shape` | `boardColumns: 5`, `sceneBoard: true`, `largeScale: .85`, and `menuLabels` of `Play`, `Instructions`, `Settings`, `Help`. |
| `ascending`, `identify` | None. |

## scene: tokens

Shared:

| Token | Default | Effect |
| --- | --- | --- |
| `resetLabel` | `null` | Text of an optional reset control. |
| `resetParent` | `'.bottom'` | Frame selector that holds the reset control. |
| `recoveryParent` | `null` | Selector that holds the recovery (Undo) bar. `null` uses the root. |
| `menuLabels` | `null` | Array that replaces the menu labels. |
| `optionalMenu` | `false` | Tolerates a missing menu. |
| `inputSynced` | `true` | Includes the text field in paints (`addition`, `count`). |

Glyphs and board (`count`, `identify`, `shape`):

| Token | Default | Effect |
| --- | --- | --- |
| `fontFamily` | `'Arial'` | Font of glyph text. |
| `textScale` | `1` | Scale of glyph text. |
| `shapeStroke`, `shapeStrokeWidth` | `null`, `2` | Outline color and width of shapes. |
| `boardColumns`, `boardRows` | `null`, `null` | Reflows the items by a maximum column count or a requested row count (`count`, `shape`). |
| `sceneBoard` | `false` | Uses the scene budget for the board size. |
| `smallScale`, `largeScale` | `.4`, `.75` | Cell fractions for small and large glyphs. |
| `itemColors` | `{}` | Color overrides. |

By scenario:

| Token | Default | Effect |
| --- | --- | --- |
| `cubeFaces` | `null` | `addition`: top, front and side colors. `null` draws a plain span. |
| `cubeStroke` | `'#873e09'` | `addition`: cube outline. |
| `additionInputParent` | `'root'` | `addition`: `'root'` or `'scene'`. |
| `sampleLabel` | `'Sample Color'` | `color`: caption of the sample. |
| `swatchSizing` | `false` | `color`: responsive CSS sizes. |
| `answerCaption` | `null` | `count`: optional wrapper around the count options. |
| `typedLabel` | `'Your answer:'` | `count`: label of the typed answer. |
| `gridArrows` | `false` | `grid`: arrowheads and axis names. |
| `arrowColor` | `'#143756'` | `grid`: arrow color. |
| `arrowEnds` | `'positive'` | `grid`: `'positive'` or `'all'`. |
| `tickSize` | `0` | `grid`: half tick length. |
| `gridAspect` | `null` | `grid`: optional `preserveAspectRatio` attribute. |
| `optionIcons` | `true` | `identify`: includes glyphs on the answer buttons. |
| `figureScale` | `.7` | `identify`: figure size as a fraction of the frame. |
| `answerTitle` | `'Your turn'` | `number-checkboxes`: heading text. |
| `titleClass` | `''` | `number-checkboxes`: heading class. |
| `pixelMax`, `pixelGap`, `pixelInset` | `34`, `5`, `55` | `number-checkboxes`: pixel size, gap and inset. |

## scene: parts

Every scenario:

| Part | Result and default behavior |
| --- | --- |
| `set(patch)` | Updates the model and syncs. |
| `sync(model)` | Runs the paints, then the `synced(model)` hook. |
| `answer(key)` | Records a single choice. |
| `button(parent, text, key, fn, cls = 'control')` | Creates and indexes a button. |
| `begin(ctx)` | Runs before the widget. No-op. |
| `rendered(ctx)` | Runs after the frame controls, before the first sync. No-op. |
| `recoveryParent(ctx)` | The element that holds recovery: the selector, or the root. |
| `recovery(ctx)` | The Undo bar. |
| `recovered(ctx, bar)` | Runs after the bar is made. No-op. |
| `resetModel(first)` | Returns a clone of the initial model. |
| `reset(ctx)` | The optional reset control. |
| `menu(ctx)` | The menu labels. |
| `widget(ctx)` | Draws the scenario's widget. |

By scenario:

| Scenarios | Part | Result and default behavior |
| --- | --- | --- |
| `count`, `identify`, `shape` | `poly(n, cx, cy, r, rot = 0, inner = 0)` | Polygon points. |
| `count`, `identify`, `shape` | `figure(u, parent, item, cx, cy, size, color)` | An SVG glyph. |
| `count`, `shape` | `boardLayout(items, cols, rows)` | `{items, cols, rows}`. |
| `count`, `shape` | `boardSize(ctx)` | `{W, H}`. |
| `count`, `shape` | `itemGeometry(item, index, geo)` | `{cx, cy, sz, x, y, width, height}`. |
| `count`, `shape` | `itemColor(item)` | The color of an item. |
| `count`, `shape` | `board(items, cols, rows, clickable)` | Creates the SVG cells. |
| `count`, `shape` | `item(ctx, group, item, index)` | Runs after each glyph. No-op. |
| `count`, `identify` | `options(parent, keys)` | The answer buttons. |
| `count`, `identify` | `optionParent(parent)` | The element that holds the options. Unchanged by default. |
| `count`, `identify` | `optionIcon(button, key)` | The answer glyph of `identify` when `optionIcons` is set; otherwise no-op. |
| `count`, `identify` | `optionsReady(ctx, row)` | Runs after the options. No-op. |
| `addition`, `count` | `input(parent, prop, label = 'Your answer:')` | The `textField` binding. |
| `addition`, `count` | `inputReady(ctx, element, prop)` | No-op. |
| `addition` | `cube(ctx, group, groupIndex, index)` | One block. The submit button moves into the scene. |
| `ascending` | `numberGeometry(ctx, board, button, cell, index)` | Positions and sizes one number tile. |
| `color` | `swatchSize(ctx)` | Sets the sample and swatch CSS sizes. |
| `color` | `colorReady(ctx, sample, choices)` | Runs after the swatches. No-op. |
| `count` | `countOptions(ctx)` | The number options, wrapped or bare. |
| `grid` | `gridSize(ctx)` | `{W, H}`. |
| `grid` | `gridGeometry(ctx)` | `{W, H, pad, X, Y}`: the mappings. |
| `grid` | `gridFrame(ctx, geo)` | The SVG. |
| `grid` | `gridLine(ctx, svg, geo, value, axis)` | The extents of an axis or grid line. |
| `grid` | `gridTick(...)`, `gridLabel(...)` | A tick, a number. Both take `(ctx, svg, geo, value, axis)`. |
| `grid` | `gridArrows(ctx, svg, geo)` | The arrow path and axis names. |
| `grid` | `gridDecorated(ctx, svg, geo)` | Calls `gridArrows`. |
| `grid` | `gridRadius(ctx, geo)` | The click-circle radius. |
| `identify` | `fClamp(value)` | A scale capped at 1.1. |
| `identify` | `identifySize(ctx)` | `{W, H}`: the frame budget. |
| `identify` | `identifyFrame(ctx, W, H)` | The bordered SVG. |
| `identify` | `identified(ctx, svg, W, H)` | Runs after the figure, before the options. No-op. |
| `number-checkboxes` | `pixelTitles(ctx)` | `[example, answer]` headings. |
| `number-checkboxes` | `pixelParent(ctx, row, index)` | The parent of a grid. |
| `number-checkboxes` | `pixelSize(ctx)` | The CSS size of a pixel. |
| `number-checkboxes` | `pixelGrid(ctx, wrap, grid, index)` | Runs before the cells. No-op. |
| `number-checkboxes` | `pixelReady(ctx, wrap, grid, index)` | Runs after the cells. No-op. |
| `shape` | `shape(ctx)` | The SVG board. Replace it for a different presentation, such as a ledger table. |

`S` exposes live `ctx`, `spec`, `root`, `scene`, `refs`, `paints`, `field`, `D` and `P`.

## shades

| Token | Default | Effect |
| --- | --- | --- |
| `columns` | `null` | `null` uses the sampled column count. A number is the maximum number of fixed columns. |
| `columnVar` | `'--tile-cols'` | Name of the CSS variable that holds the column count. `null` leaves it out. |
| `columnDivisor` | `4` | Divisor used for that variable. |
| `budgetWidth`, `budgetHeight` | `76`, `115` | Width and height taken off the body budget. |
| `recoverHeight` | `45` | Height taken off when the recovery bar shows. |
| `scaleVar` | `false` | Mirrors the fit scale in `--up-scale`. |

`shades` has no preset. A design that wants five columns without the variable sets `columns: 5, columnVar: null`.

| Part | Result and default behavior |
| --- | --- |
| `columns(ctx, n)` | The column count: sampled, or capped fixed. |
| `layout(ctx, B)` | Draws the gap and tile size. Returns `{n, cols, rows, gap, hintH, T}`. |
| `grid(ctx, body, geo)` | The CSS grid element. |
| `tileStyle(ctx, tile, geo)` | CSS for a tile: square dimensions and HSL color. |
| `tile(ctx, el, index)` | A decoration hook. No-op. |
| `tilesReady(ctx, tiles)` | No-op. Use it for clear controls. |
| `selection(ctx, tiles, up)` | Returns the sync. Scopes the clear controls. |
| `tilesSync(ctx, tiles, model)` | Sets `aria-checked`. |
| `begin(ctx)` | Runs before the tiles. No-op. |
| `shades(ctx, body, up, B)` | Returns `{sync, locate}`: tile click handlers and the modifier hint. |
| `budget(ctx, recover)` | `{w, h}`: the body budget. |
| `resultBar(ctx, panel, up)` | Returns `{sync, locate}`: seeded feedback. |
| `beforeFit(ctx, panel, body)` | Runs after the first sync. No-op. |
| `scale(ctx, panel, k)` | Applies the transform and the optional scale variable. |
| `fit(ctx, panel)` | `{w, h, k}`: measures and scales. |
| `position(ctx, panel, geo, place)` | Sets `left` and `top`. |
| `place(ctx, panel, geo)` | Consumes the `place` fork, then calls `position`. |
| `rendered(ctx, panel)` | Runs after placement. No-op. |

`S` exposes live `ctx`, `panel`, `body`, `tiles`, `view`, `up`, `D` and `P`.

## Common changes

- A different cube palette: `cubeFaces`, `cubeStroke`. Gradient faces: replace `cube`.
- Tile positions in `ascending`: `numberGeometry`.
- Where the Undo bar and the reset control go: `recoveryParent`, `resetParent`, `recovered`, `resetLabel`.
- A reflowed board in `count` or `shape`: `boardColumns`, `boardRows`, `boardLayout`, `boardSize`, `itemGeometry`.
- Different glyphs: `fontFamily`, `textScale`, `shapeStroke`, `shapeStrokeWidth`, or replace `figure`.
- A ledger instead of a board in `shape`: replace `shape`.
- Frame size and decoration in `identify`: `identifySize`, `identifyFrame`, `figureScale`, `optionIcons`.
- Plot extents and arrows in `grid`: `gridSize`, `gridGeometry`, `gridLine`, `gridArrows`, `arrowEnds`, `tickSize`.
- Tile size, spacing and overflow in `shades`: `layout`, `grid`, `tileStyle`, `budget`, `beforeFit`, `position`.
- A clear control and status for the selection in `shades`: `selection`, `tilesReady`, `rendered`.

Verify a change to these templates as `templates/README.md` ("Changing a template") describes: golden snapshots of
the sites built on them before and after, the checker and the lint.
