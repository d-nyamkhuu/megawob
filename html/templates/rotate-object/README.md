# rotate-object templates

Three templates, one per scenario. The agent turns an object to a target orientation.

| Template | Scenario | What the page shows |
| --- | --- | --- |
| `rotate-object/cube` | `cube` | A CSS cube with six labeled faces, turned trackball-style. The agent brings a named face to the front. |
| `rotate-object/dial` | `dial` | An SVG dial with tick labels. The agent turns it to a value or a heading by dragging, the wheel or the keys. |
| `rotate-object/orient` | `orient` | A shape on a canvas with a rotation handle. The agent matches a reference, points at a star or points at a heading. |

With `design: {}`, each template draws the page of its first design: `design-rotate-object-cube-11`,
`design-rotate-object-dial-11` and `design-rotate-object-orient-04`. The header of each `.js` file lists every token
and part. This file is a shorter guide.

## Rules for every template

- Parts are `(base, S) => replacement`. They call each other through the resolved parts `P`.
- `S` exposes live `ctx`, `geo`, `D` (tokens) and `P`. In `orient` it also has `R2D`.
- The factory holds page state only. Construction parts take `(ctx, g)` and return objects that `render` merges into
  the live `g`. `S.geo` is that same `g`.
- Callbacks that run after setup read `g.rot` or `g.dial` when they run, not a value captured earlier. Those are
  created after the fields and controls.
- A replaced part keeps every original rng draw, in order. Extra decoration draws from a named fork.
- The `rot-style` stylesheet keeps rules some scenarios do not use, so site CSS can depend on the cascade.

## cube

No preset: the defaults draw `design-rotate-object-cube-11`.

| Token | Default | Effect |
| --- | --- | --- |
| `edgeHeight` | `.61` | Cube edge limit as a fraction of the pad height. |
| `edgeWidth` | `.4` | Cube edge limit as a fraction of the pad width. |
| `edgeMax` | `285` | Cube edge limit in px. |
| `x`, `y` | `.58`, `.5` | Visual center and trackball origin as pad fractions. |
| `labelMax` | `.16` | Largest label font, as a fraction of the edge. |
| `labelFit` | `.8` | Label length limit: font times label length over edge. |
| `labelColor` | `'#25313e'` | Label ink on light faces. `null` omits it. |
| `background` | `'background'` | Face style property to set. Use `'backgroundColor'` for a plain color. |
| `faceImage` | `null` | Optional `backgroundImage` on the faces. |
| `shade` | `.24` | Darkness of the face shading. |
| `reset` | `true` | Binds the frame reset control to the initial orientation. |

| Part | Result and default behavior |
| --- | --- |
| `matrix(q, translation = [0, 0, 0])` | A CSS `matrix3d` string. |
| `begin(ctx, g)` | Stage art. No-op. |
| `pad(ctx, g)` | The trackball pad. |
| `fit(ctx, g)` | The cube edge. |
| `origin(rect)` | The trackball point. |
| `face(ctx, g, data, i)` | The shade element. Builds the face, its matrix and its label through `P`. |
| `label(ctx, g, label, data)` | Styles the label text. |
| `legend(ctx, g)` | Runs after the faces. No-op. |
| `helper(ctx, g)` | Writes the visible task helper. |
| `beforePaint(ctx, g)` | A status hook. No-op. |
| `shade(ctx, g, el, light, i)` | Paints the shade of a face. |
| `controls(ctx, g)` | Binds the reset control. |
| `paint(ctx, g)` | Paints the cube matrix, the status and the face shading. |

`g` holds `pad`, `rect`, `edge`, `cube`, `shadow`, `faces`, the initial orientation, the ball and the paint callback.

## dial

The preset shows the readout, sizes the dial from `ctx.size`, and uses a dark dial face with a thick bevel. To get the
plain appearance back, set the appearance tokens below to their defaults.

| Token | Default | Effect |
| --- | --- | --- |
| `css` | the template CSS | The scaffold CSS. |
| `forceReadout` | `false` | Always shows the readout. Preset: `true`. |
| `sync` | `'none'` | `'none'`: no sync. `'paint'`: repaint only. `'dial'`: set the dial angle, then paint. |
| `dialSize` | `null` | `null`: the sampled radius. `[widthRatio, heightRatio, radiusRatio]`: fixes the diameter from `ctx.size` and keeps the draw. |
| `titleUnits` | `true` | Adds the unit to the title. |
| `unitCaption` | `false` | Adds a unit row. |
| `tickUnits` | `'px'` | `'px'`: radii are offsets. `'width'` or `'radius'`: radii are ratios. |
| `tickRadii` | `[8, 22, 15, 40]` | Start, major end, minor end and label radius. |
| `stops` | panel to line | Radial gradient stops of the dial face. |
| `bevelStops` | `null` | Stops of a bevel gradient. `null` draws none. |
| `knobStroke` | `'var(--line)'` | Stroke of the dial face. `'bevel'` uses the bevel gradient. |
| `knobStrokeWidth` | `2` | Stroke width of the dial face. |
| `rimRatio` | `.88` | Rim radius as a fraction of the dial radius. |
| `needleScale` | `null` | `null`: from -14 to -(radius - 14). `[inner, outer]`: radius ratios. |
| `needleCap` | `'round'` | Needle line cap. |

| Part | Result and default behavior |
| --- | --- |
| `style()` | Installs `css`. |
| `sv(tag, attrs, parent)` | An SVG element. Values with `var(` or `color-mix` become CSS style. |
| `polar(c, r, a)`, `centerOf(el)` | Points. |
| `niceTicks(spec, key)` | The scale values. |
| `arcPath(r, a0, a1)` | SVG arc data. |
| `tickRadius(g, i)` | A tick dimension resolved from the tokens. |
| `placeCard(card, ctx)` | Samples the card placement. |
| `frame(ctx, g)` | Returns the geometry, card, column and SVG. |
| `ticks(ctx, g)` | Draws the tick ring and labels. |
| `knob(ctx, g)` | Returns `knob`, `gid` and `defs`. Reuses the `defs` from `ticks` if it made them. |
| `surface(ctx, g)` | Draws the dial face gradients and the rim. It owns an `rng.bool` draw. |
| `pointer(ctx, g)` | Returns `arc`, `turn` and `grip`. |
| `readout(ctx, g)` | Returns the readout and hints. |
| `paint(ctx, g)` | Updates the rotation, the arc and the value. |
| `input(ctx, g)` | Installs the wheel and key handlers. Returns `setValue`. |
| `dial(ctx, g)` | Returns the dial primitive. |
| `controls(ctx, g)` | A hook for frame controls. No-op. |
| `placed(ctx, g)` | Samples the card placement. |

## orient

The preset draws `design-rotate-object-orient-04`: `modeClass: 'rot-'`, a thin arrow and an `ell` shape in `shapes`, and
replacements of `fit`, `shapeScale`, `handleRadius`, `heading`, `point` and `handle`. The `ell` shape is only sampled
when a widget opts in with a `shapes` trait.

| Token | Default | Effect |
| --- | --- | --- |
| `css` | the template CSS | The scaffold CSS. `null` skips it. |
| `shapes` | `{}` | Overrides and additions to the table of `[path, halfWidth, halfHeight]`. |
| `sync` | `'none'` | `'paint'` repaints on sync. |
| `modeClass` | `null` | Class prefix for the card. The mode follows it. |

Geometry parts. `frame` calls these separately, keeping both draws in order. An override may store more geometry on
`g`, for example `unit` or `dragRadius`:

| Part | Result and default behavior |
| --- | --- |
| `fit(ctx, g)` | The canvas side: the floor of the smallest of 560, height - 130 and width - 520. |
| `shapeScale(ctx, g, B, C)` | `B / 100`. |
| `handleRadius(ctx, g)` | `round(top + rng.int(26, 36))`. |
| `shapePaths()` | The shape table, with `shapes` merged in. |

Helpers:

| Part | Result and default behavior |
| --- | --- |
| `style()` | Installs `css`. |
| `sv(tag, attrs, parent)` | An SVG element. |
| `polar(c, r, a)`, `centerOf(el)` | Points. |
| `starPath(outer, inner, n)` | An SVG path. |
| `angleField(ctx, host, label, onAngle)` | Returns `{paint, locate}`: the typed angle field. |

Construction parts take `(ctx, g)` and run in this order:

| Part | Draws |
| --- | --- |
| `frame` | The sampled shape geometry, the card and the canvas. |
| `grid` | The seeded grid pattern. |
| `heading` | The degree ring. |
| `point` | The target star and fixed decorations. |
| `shape` | The shape path. |
| `selection` | The dashed box and its corners. |
| `handle` | The stem, the grip and the hub. |
| `reference` | The reference SVG beside the canvas. |
| `readout` | The angle field and the hint. |
| `rotate` | The `rotateHandle` primitive. |

After them: `hubDrag(ctx, g)` installs the shared hub pointer tracking, `controls(ctx, g)` is a no-op hook for frame
buttons, `placed(ctx, g)` samples the card placement, and `placeCard(card, ctx)` implements the sampled offset.
`paint(ctx, g)` updates the readout. Callbacks use `g.rot`, which is created after the readout.

## Common changes

- Dial size and ticks: `dialSize`, `tickUnits`, `tickRadii`, or replace `ticks`.
- Dial face and needle artwork: `surface`, `pointer`, `stops`, `bevelStops`, `knobStroke`, `needleScale`.
- Reset or step controls: `controls`. In the dial, also `sync: 'dial'` when the buttons snap the knob.
- Canvas size and shape scale in `orient`: `fit`, `shapeScale`, `handleRadius`.
- A different shape table: `shapes`, or replace `shape` for a different path or paint.
- A hidden selection box: replace `selection` with a no-op.
- Decorations such as rings and a compass: `grid`, `heading`, `point`.
- Cube size and position: `edgeHeight`, `edgeWidth`, `edgeMax`, `x`, `y`, or replace `fit` and `origin`.
- Cube faces and labels: `background`, `faceImage`, `labelColor`, `labelMax`, `labelFit`, `shade`, `face`, `label`.
- A legend, status text or a floor under the cube: `legend`, `beforePaint`, `begin`.
- A fixed layout without sampled card placement: replace `placed` with a no-op.

Verify a change to these templates as `templates/README.md` ("Changing a template") describes: golden snapshots of
the sites built on them before and after, the checker and the lint.
