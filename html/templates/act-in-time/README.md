# act-in-time/arena

The arena console: a bar with a status line and a clock above a body that holds one timed widget. The widget's
scenario picks which one:

| Scenario | What the widget is |
| --- | --- |
| `chase` | A circle that moves on a board, with elapsed-time and pointer-dwell meters. |
| `delay` | A delayed-action card, or interval buttons. |
| `moving` | Shapes sliding along lanes. |
| `popup` | A sign-in form with a modal or a cookie notice. |
| `simon` | Rectangular pads with a phase indicator and a sequence history. |
| `stock` | A quote, a price chart and an order form. |

A template serves only its own scenario. With `design: {}` each scenario draws the same page as its first design:
`design-act-in-time-chase-01`, `-delay-02`, `-moving-03`, `-popup-08`, `-simon-01` and `-stock-01`.

The header of `arena.js` is the reference for every token and part. This file is a shorter guide to it.

## Rules

- Parts are factories: `{ name: (base, S) => replacement }`. A name the template does not know throws, and so does a
  part that belongs to another scenario.
- `S.ctx`, `S.spec`, `S.frame`, `S.view` (settable), `S.D` (tokens) and `S.P` (parts) are live.
  `S.els` stores page decorations, for example elements a later sync hook updates.
- A replaced part must keep the rng draws of the part it replaces, in the same order. Extra decoration draws from a
  named fork, not from the main stream.
- The template installs its stylesheet (id `ut-style`) once, through `ensureStyle`. Site CSS may depend on its
  cascade, so a design adds rules and does not rename the template's classes.
- A fixed title or text token replaces a sampled one. It must not leave a dummy draw behind, so the template skips the
  draw when the token is set.

## Tokens

A scenario preset sets some tokens for you. Anything you put in `design` wins over the preset.

| Token | Default | Effect |
| --- | --- | --- |
| `clockPad` | `false` | Pads the minutes in the clock text. |

Chase:

| Token | Default | Effect |
| --- | --- | --- |
| `elapsedLabel` | `'Time elapsed'` | Label of the elapsed-time meter. |
| `insideLabel` | `'Pointer dwell time inside circle'` | Label of the dwell meter. |
| `sideTarget` | `null` | Selector of the frame container that receives the side panel. Preset: `'.ds-brief'`. |
| `sidePlacement` | `'append'` | DOM method used to place the panel. `'prepend'` suits footer layouts. |
| `metricsTarget` | `null` | Selector of a separate frame container for the metrics. |
| `motionOnly` | `false` | Ignores pointer events that do not move the pointer. |
| `clearView` | `false` | Exposes the clear and detach lifecycle of the hover view. |
| `clearOnRender` | `false` | Also detaches the hover view before each render. |

Delay:

| Token | Default | Effect |
| --- | --- | --- |
| `process` | `false` | Array of step labels for a process strip above the widget. The preset has four steps. |
| `waitText` | `null` | Replaces the wait label. |
| `intervalWidth` | `1` | Fraction of the main width that the interval surface uses. |

Moving:

| Token | Default | Effect |
| --- | --- | --- |
| `triangle` | `false` | Adds a triangle silhouette. Preset: `true`. |
| `caughtLabel` | `false` | Shows a remaining-target count and a "Shapes to catch" label. |

Popup:

| Token | Default | Effect |
| --- | --- | --- |
| `loginTitle` | `null` | Fixed login title. `null` draws one with `rng.pick`. |
| `loginSubtitle` | `null` | Fixed login subtitle. |
| `dialogTitle`, `dialogText` | `null` | Fixed modal heading and paragraph. `null` keeps the two sampled paragraphs. |
| `stayLabel` | `null` | Replaces the sampled stay label. |
| `hideLeave` | `false` | Hides the leave choice. |
| `geometric` | `false` | Draws a geometric backdrop. |
| `openPending` | `false` | Opens a pending popup by updating the model in `beforeBuild`. |
| `pendingVisible` | `false` | Shows a pending modal as open without changing the model or the field lock. |

The popup preset sets a login title and subtitle (`Welcome Back`), a `System Update` dialog, the stay label `Close`,
`hideLeave: true` and `geometric: true`.

Stock:

| Token | Default | Effect |
| --- | --- | --- |
| `namesClass` | `'ds-stock-name'` | Class of the quote name. |
| `showStats` | `false` | Shows four market facts. Preset: `true`. |
| `chartTitle` | `null` | Chart title. The preset is `'Price History (5 Days)'`. |
| `chartColor` | `'#4199e6'` | Color of the price line and marker. |
| `quantityLabel` | `'Quantity'` | Label of the order quantity row. |
| `quantity` | `'100'` | Initial order quantity. |
| `symbolField` | `null` | Label of a symbol field placed before Action. |
| `estimate` | `true` | Shows the cost and buying-power panel. |
| `quick` | `true` | Shows quick values and the clear binding. |

## Parts

These parts exist in every scenario. All hooks that say "no-op" do nothing until a design replaces them.

| Part | Result and default behavior |
| --- | --- |
| `ensureStyle()` | Installs the stylesheet once. |
| `clockText(ms)` | Task time as `m:ss`. `clockPad` pads the minutes. |
| `sec1(ms)` | Seconds with one decimal place. |
| `frame(ctx)` | `{arena, body, status, setClock, setStatus}`: the full-stage console. For `moving` it is the sampled console. |
| `build(ctx, f, up)` | `{sync, locate, detach?}`: the scenario's widget. |
| `begin(ctx)` | Runs before the style and frame are created. No-op. |
| `beforeBuild(ctx, f)` | Runs after the frame, before the widget. No-op, except in `delay` and `popup`. |
| `rendered(ctx, f)` | Runs after the widget, before the first sync. No-op. |
| `beforeSync(ctx, f, m)`, `synced(ctx, f, m)` | Run around each widget sync. No-op. |
| `afterRender(ctx, f)` | Runs after the first sync, before anchors. No-op. |

`moving` draws seven values in `frame`, in the original order.

### chase and moving

| Part | Result and default behavior |
| --- | --- |
| `sideCard(util, parent, label)` | A labeled `ut-card`. |
| `boardSize(main, aspect)` | `[w, h]`: the largest board that fits. |
| `boardSvg(util, main, aspect, cls)` | `{svg, toBoard, fromBoard}`: board SVG with live DOM coordinates. |

### chase

| Part | Result and default behavior |
| --- | --- |
| `build` | The grid, the trajectory, the circle and the hover tracking. |
| `rendered` | Moves the side panel and the metrics into the frame, then calls `resizeBoard`. |
| `metrics(ctx, main, side)` | `{leftV, leftM, insV, insM, pill}`: the elapsed and dwell cards. |
| `details(ctx, details)` | Four target facts. |
| `hover(ctx, board, up)` | `{detach}`: the hover binding. |
| `metricValue(valueMs, totalMs)` | One-decimal value over total seconds. |
| `extraMetrics(ctx, main, metrics)` | Runs before `details`. No-op. |
| `readout(ctx, main)` | Runs after `details`, before `hover`. No-op. |
| `metricsSync(ctx, m)` | Runs after the meters, before the frame status. No-op. |
| `resizeBoard(ctx, f)` | Fits the board to the stage and updates the diameter. |

### delay

| Part | Result and default behavior |
| --- | --- |
| `build` | The interval surface or the delayed-action card. |
| `beforeBuild` | Adds the process strip when `process` is an array. |
| `spinner(util, parent)` | `{svg, arc}`. |
| `delayBegin(ctx)` | Runs before the main area. No-op. |
| `main(ctx, main)` | Runs before the mode branch. No-op. |
| `interval(ctx, {main, surf, els, pad, W, H})` | Runs after the interval buttons, before binding. No-op. |
| `delayState(ctx, card)` | Returns extra state: decorations after the status, before the actions. Default `{}`. |
| `actions(ctx, card)` | The parent of the action row. Default `card`. |
| `go(ctx, f, go)` | Runs after the target is created, before sizing and binding. No-op. |
| `card(ctx, layout)` | Runs after the card is bound, before sync. No-op. |
| `waitText(ctx, ready)` | `Ready`, or `waitText`, or the mode's wait text. |
| `delaySync(ctx, layout, m, ready)` | Runs after the status text. |

In `card` and `delaySync`, `layout` holds `main`, `card`, `state`, `spin`, `ok`, `stTxt`, `row`, `els`, `go`, and the
value `delayState` returned as `extra`.

### moving

| Part | Result and default behavior |
| --- | --- |
| `build` | The lanes, the shapes and the board hit testing. |
| `shapeEl(util, group, shape, radius, fill)` | The shape silhouettes. |
| `side(ctx, f)` | The `ut-side` container. |
| `board(ctx, board, main)` | Runs before the lanes. No-op. |
| `item(ctx, main, group, item, index)` | Draws one shape and its tooltip. |
| `metrics(ctx, side)` | State of the Catch, Caught and Missed cards and the tally. |
| `metricsSync(ctx, f, metrics, m)` | Updates the counts, the tally, the misses and the frame status. |
| `hit(ctx, sync)` | Runs after a successful shape click. No-op. |

### popup

| Part | Result and default behavior |
| --- | --- |
| `build(ctx, f)` | The sign-in form, the modal or cookie notice, and the recoverable exit. |
| `beforeBuild` | Adds the geometric decoration and the pending-popup model update. |
| `loginHeading(ctx, card)` | The title. |
| `loginIntro(ctx, main, card)` | The subtitle element, or `null`. |
| `fields(ctx, card, userEl, passEl)` | Runs after the fields, before the error and login button. Returns extra state, default `{}`. |
| `loginButton(ctx, button, fieldExtra)` | Runs before the signed-in notice. No-op. |
| `dialogContent(ctx, box)` | The fixed heading and text, or the two sampled paragraphs. |
| `dialogButtons(ctx, box, row, choice, mk)` | Runs before button order, placement and binding. No-op. |
| `loginSync(ctx, layout, m)` | Runs after the field and signed-in state and the status. No-op. |
| `popupOpen(m)` | True when the popup is open, or also when pending and `pendingVisible` is set. |

Form handlers stay in the template. A design that changes the form replaces `fields`, `loginButton` or
`dialogContent`, and never has to copy the handlers.

### simon

`build` draws the rectangular pads, the phase indicator and the history. It uses no rng. The scenario has no
tokens of its own, so `design: {}` is enough.

### stock

| Part | Result and default behavior |
| --- | --- |
| `build` | The quote, the historical chart and the order form. |
| `quote(ctx, quote)` | Runs after the price. Returns extra state, default `{}`. |
| `stats(ctx, quote)` | The four market statistics when `showStats` is set. |
| `chartTitle(ctx, market)` | The chart title. |
| `history(ctx)` | 31 prices drawn from the `historical-prices` fork, shifted to end at the opening price. |
| `chartX(ctx, history, index)`, `chartY(ctx, low, high, price)` | Pixel positions in the chart. |
| `axes(ctx, chart, X, Y, low, high)` | The grid and the price labels. |
| `afterAxes(ctx, chart, X, Y)` | Runs before the threshold and price paths. No-op. |
| `recent(ctx, market, history)` | The six recent-price cells. |
| `orderFields(ctx)` | `[label, value][]`: the order fields. |
| `estimate(ctx, order)` | The estimate element, or `null`. |
| `notes(ctx, root)` | The four order instructions. |
| `extraOrder(ctx, root)` | Runs after `notes`. No-op. |
| `frame(ctx, root, history, up, sync)` | The quick values and the clear handler when `quick` is set. |
| `samples(ctx, history, index)` | The history plus the live prices. |
| `quoteSync(ctx, extra, history, m)`, `stockSync(ctx, {root, buy}, m)` | Sync hooks. No-op. |

`history`, `chartX`, `chartY`, `axes`, `recent`, `orderFields`, `estimate`, `notes` and `frame` can each be replaced on
their own. `quantity`, `quantityLabel` and `symbolField` cover the common order-field differences without a part.

## Common changes

- A different metric format in `chase`: replace `metricValue`.
- A side panel somewhere else in `chase`: set `sideTarget` and `sidePlacement`.
- Extra summary cards and board readouts in `chase`: use `extraMetrics`, `readout` and `metricsSync`.
  Store the readout elements in `S.els`. None of these draws random numbers.
- A different legend, counters or deadline in `moving`: replace `metrics` and `metricsSync`. Do not touch the lane or
  hit-test code.
- A different modal in `popup`: replace `dialogContent`, `dialogButtons` or `loginIntro`.
- Extra price facts or a different order panel in `stock`: use `quote`, `stats`, `extraOrder`, `orderFields`.

Verify a change to the template as `templates/README.md` ("Changing a template") describes: golden snapshots of the
sites built on it before and after, the checker and the lint.
