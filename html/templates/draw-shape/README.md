# draw-shape/canvas

An SVG board on which the agent holds the left button and draws one stroke. Starting another stroke replaces the
first. The board geometry is the same in both directions and is sized from `ctx.size`.

The template header in `canvas.js` lists every token and part with its default. This file is a shorter guide.

## Scenarios

| Scenario | The agent draws | What the board shows |
| --- | --- | --- |
| `line` | A line through two dots labeled A and B, or through a point at a given direction or angle. | The dots with labels, or a guide line in angle mode. |
| `circle` | A circle with a given center and radius. | A center dot, and a dashed guide circle or a dot on the rim. |
| `trace` | A stroke along a path of a few vertices, or a wave. | A start marker, the guide, an arrowhead and an end label. |

With `design: {}` and no scenario preset, the defaults draw `design-draw-shape-line-01`. Each scenario also has a
preset that sets some tokens for you. Tokens in `design` win over the preset.

| Scenario | Preset |
| --- | --- |
| `line` | `grid: null` (seeded choice), `sampleHeight: [400, 600]`, `seededPlace: true`, a black r10 dot, no halo. Same page as `design-draw-shape-line-04`. |
| `circle` | `grid: null`, `sampleHeight: [400, 600]`, `seededPlace: true`, `clearTarget: 'returned'`. Same page as `design-draw-shape-circle-08`. |
| `trace` | A smooth dashed guide, a green r17.5 start marker, `Start` text, an `Arrowhead` end label. Same page as `design-draw-shape-trace-05`. |

## Rules

- Object and array tokens replace the whole default value. Spread the default if you only want to change one entry.
- Parts are `(base, S) => replacement`. Inside the template every call goes through the resolved parts `P`, so a
  replaced part is used by all its callers.
- `S` exposes `ctx`, `spec`, `geo` (settable), `wrap`, `board`, `svg`, `B`, `view`, `pen`, `stroke`, `D` (tokens),
  `P` (parts), and the helpers `fmtPx` and `unit(a, b)`. `geo` is `{W, H, scale, x?, y?}`; `x` and `y` translate model
  coordinates inside the SVG.
- `B` is the board object passed to most parts. It holds `ctx`, `svg`, `W`, `H`, `scale`, `px`, `toBoard`, `frame`,
  `hintEl`, `hint(text, swatch = true)`, `up(model)`, `bar` and `foot`.
- The factory creates no DOM. Parts do that when the page renders.
- A replaced part must keep the rng draws of the part it replaces, in the same order. This matters most for the
  sampled height draw (`sampleHeight`), which happens even when `capHeight` is false. Extra decoration draws from its
  own named fork.
- The stylesheet carries rules for tools the scenarios do not use. They stay so that site CSS keeps the same cascade.

## Tokens

Layout and board:

| Token | Default | Effect |
| --- | --- | --- |
| `css` | `''` | Extra CSS appended after the template CSS. |
| `labelFont` | `700 15px system-ui, ...` | Font shorthand of `.dw-label`. |
| `grid` | `'plain'` | `'plain'`, `'dots'` or `'lines'`. `null` draws a seeded choice of all three. |
| `background` | `'var(--panel)'` | Fill of the SVG background rectangle. |
| `gridAttrs` | `{}` | Extra attributes on the rectangle that covers the grid. |
| `reserveH`, `insetW` | `54`, `32` | Stage space left out when fitting the SVG. |
| `sampleHeight` | `null` | `null`: no draw. `[min, max]`: an `rng.int` height, drawn before the SVG is built. |
| `sampleFactor` | `1` | Multiplies the sampled height before the cap. |
| `capHeight` | `true` | Caps the fitted height by the sampled height. When false the value is still drawn. |
| `scaleGutter` | `0` | Pixels below the scored geometry, inside the SVG height. |
| `seededPlace` | `false` | Places the wrapper from the `place` fork of `ctx.rng`. |

Markers and labels:

| Token | Default | Effect |
| --- | --- | --- |
| `dotLayers` | panel r9, then foreground r6.5 | Ordered attributes of the solid marker circles. |
| `hollowAttrs` | r7.5, panel fill, foreground stroke 2.5 | Attributes of the hollow marker. |
| `haloAttrs` | r15, dashed muted ring | Ring around the dot in angle mode. `null` leaves it out. |
| `labelOffset` | `20` | Distance in pixels from a marker to its label. |
| `labelInsets` | `[16, 16, 14, 10]` | Clamp of labels to the board: left, right, top, bottom. |
| `connectDirection` | `null` | `null`: labels A and B point outward along the line. `[dx, dy]`: both labels use this direction. |
| `connectOffset` | `null` | Offset of the A and B labels. `null` uses `labelOffset`. |

Circle:

| Token | Default | Effect |
| --- | --- | --- |
| `circleAttrs` | dashed muted ring | Attributes of the guide circle, without `cx`, `cy` and `r`. |
| `circleBoth` | `false` | Also draws the guide circle when `spec.show` is `'both'`. |
| `rimOnGuide` | `false` | Adds a hollow rim. `'spec'` adds it only when `spec.rimDot` is true. |

Trace:

| Token | Default | Effect |
| --- | --- | --- |
| `startDot` | `false` | Value passed as `hollow` to `dot` for the start marker, for example `'start'`. |
| `startText` | `'start'` | Text of the start label. |
| `startClass` | `'dw-small'` | Class of the start label. |
| `startDirection` | `null` | Direction of the start label. `null` points outward. |
| `startOffset` | `24` | Distance of the start label from the marker. |
| `smooth` | `false` | `true`: the guide is a cubic path. `false`: a polyline. |
| `guideLayers` | wide faint stroke, then thin dashed stroke | Ordered guide attributes, without points, `d` and `fill`. |
| `headLength`, `headWidth` | `18`, `9` | Arrowhead length and half-width in pixels. |
| `headAttrs` | foreground fill, panel outline | Attributes of the arrowhead polygon. |
| `endText` | `null` | `null`: no end label. A string, including `''`, draws one. |

Stroke and Clear:

| Token | Default | Effect |
| --- | --- | --- |
| `ink` | `'var(--accent)'` | Stroke color. The width is still chosen with `rng.pick`. |
| `clearTarget` | `'widget'` | `'widget'`: installs Clear at render. `'returned'`: returns a widget method. `'none'`: no Clear. |
| `clearLog` | `false` | Logs `clear` before updating. |
| `clearInkFirst` | `false` | Clears the ink before `ctx.update`, not after. |
| `clearPreserve` | `false` | Keeps other model fields when it clears strokes. |

## Parts

Layout and coordinates:

| Part | Result and default behavior |
| --- | --- |
| `style()` | The template CSS with `labelFont` and `css` applied. |
| `begin(ctx)` | Runs before layout. No-op. Adapt frame instructions here. |
| `fit(ctx)` | Returns `geo`. Fits the stage and applies the sampled cap. Keeps the height draw. |
| `wrap(ctx)` | Creates `.dw-wrap` at 0,0 in `ctx.stage`. |
| `px(point)` | Model coordinates to SVG pixels. |
| `toBoard([x, y])`, `fromBoard(point)` | Viewport coordinates to model and back. Not rounded. |
| `frame()` | Stroke options. Uses `toBoard`, `fromBoard` and the bounds in `spec.board`. |
| `place(wrap, ctx, rng)` | Seeded placement when `seededPlace` is set. `rng` is the `place` fork. |
| `rendered(ctx)` | Runs after sync, hint sizing and placement. No-op. |

Drawing:

| Part | Result and default behavior |
| --- | --- |
| `grid(B)` | Draws the background and the optional seeded pattern. |
| `dot(util, g, px, p, hollow)` | A layered solid circle, or a hollow marker. |
| `label(util, g, px, W, H, p, d, text, cls?, off?)` | Draws clamped text. |
| `line(B, g)`, `circle(B, g)`, `trace(B, g)` | Draw the scenario's targets through the smaller parts below. |
| `lineGuide(B, g)` | The angle-mode guide line, its endpoints and the `guide` label. |
| `curve(path, px)` | A smooth cubic SVG path through the scored polyline. |
| `guide(B, g, path)` | Draws the guide layers in order. |
| `headGeometry(B, path)` | `{tip, d, head}`: arrowhead points and the direction of the last segment. |
| `arrowHead(B, g, geometry)` | Draws the arrowhead polygon. |
| `endLabel(B, g, geometry)` | Draws the end label when `endText` is set. |
| `arrowPath(B, g, path)` | Draws the guide, the arrowhead and the end label, in that order. |

Stroke and build:

| Part | Result and default behavior |
| --- | --- |
| `penCreated(B, pen)` | Runs before the stroke is bound. No-op. Add a detached preview here. |
| `ink(points, B, pen)` | Redraws the pen polyline for the last stroke. |
| `strokeOptions(B, pen)` | The pointer frame and model callbacks for `env.ui.stroke`. |
| `strokeReady(B, pen, stroke)` | Runs after the stroke is bound, before the hint draws. No-op. |
| `build(B)` | Returns `{sync, locate}`. Draws grid, targets, pen, stroke and the seeded hint, in that order. |
| `hint(B, text, swatch = true)` | Draws the hint spans. |
| `clear()` | Clears the scored strokes and the ink, following the clear tokens. |
| `controls(B, view)` | Installs the widget Clear method when requested. |

## Common changes

- Different dots: `dotLayers`, `hollowAttrs`, `haloAttrs`, or replace `dot` for a custom shape.
- A different label position: `labelOffset`, `labelInsets`, or replace `label`.
- Fixed directions for the A and B labels: `connectDirection` and `connectOffset`.
- A stage-filling, centered or zoomed board: replace `fit`. If the model frame is moved, also replace `px`,
  `toBoard`, `fromBoard` and `frame`, and return `x` and `y` in `geo`.
- Another height rule: `sampleHeight`, `sampleFactor`, `capHeight`, `reserveH`.
- A different trace guide: `smooth`, `guideLayers`, `curve`, `guide`.
- A different arrowhead: `headLength`, `headWidth`, `headAttrs`, or replace `headGeometry` and `arrowHead`.
- Different start and end labels: `startText`, `startClass`, `startDirection`, `startOffset`, `endText`, `endLabel`.
- A different Clear button behavior: `clearTarget`, `clearLog`, `clearInkFirst`, `clearPreserve`.
- A miniature preview of the ink: `penCreated` and `ink`.

If the site's CSS has to be in place before the frame is measured, check the first page load in a screenshot.
