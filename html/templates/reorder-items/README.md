# reorder-items/cards

Absolutely positioned cards on `env.ui.sortable`. The agent drags cards into a target order, or into columns.

| Scenario | The agent |
| --- | --- |
| `grid` | Sorts cards on a grid by a rule, reading row by row. |
| `list` | Sorts a vertical list by a rule. Some items may be pinned: they have no grip and stay in place. |
| `move` | Makes one edit of a given list: move an item to the top, bottom or a position, put it next to another, or swap two. |
| `kanban` | Drops cards into category columns, sometimes in a given order inside each column. Wide boards scroll in a pane. |

With `design: {}` the scenarios draw `design-reorder-items-grid-01`, `design-reorder-items-list-01` and
`design-reorder-items-kanban-11`. `move` uses the unmodified list path.

The header of `cards.js` lists every token and part. This file is a shorter guide.

## Rules

- Parts are `(base, S) => replacement`. Every call, including nested calls and callbacks, goes through `P`.
- A replaced part keeps every original rng draw, in order. Extra decoration draws from a named fork.
- Body-class conditions matter for the random stream. Skipping the margin branch or the flat-geometry branch of the
  list changes the draws that come after it. Set `flatClasses` and `zeroMarginClasses` instead of removing a branch.
- `S` has live `D` (tokens), `P` (parts), `ctx`, `spec`, `board`, `wrap`, `geo` (settable), `sortable`, `paneEl`,
  `paneGeo`, `layout`, `cards`, `staged`, `trayPositions` (settable), `dragScrollStart` and `trayDelta` (settable),
  `showCounts`, `EDGE_BAND`, `LOCK_SVG` and `extra`. `extra` is private scratch state for a design.
- `L` is the kanban layout record `{size, n, k, barH, wordy, boardW, boardH}`.
- Prefer a token over a part when it reproduces the exact formula.

## Presets

| Scenario | Preset |
| --- | --- |
| `grid` | None. |
| `list` | `numericClass: false`, `flatClasses: ['memphis']`, `zeroMarginClasses: ['memphis']`, and `monthHint` with the descending-month wording of `list-01`. |
| `kanban` | `chromeHints: false`, `tray: true`, `avatars: false`, `kanbanWidth: .224`, `kanbanHead: [28, .073]`, and small `trayFit`, `tray` and `trayPositions` parts that build a bottom tray. |

The kanban preset tray is one layout. Other tray styles replace those three parts.

## Tokens

Shared:

| Token | Default | Effect |
| --- | --- | --- |
| `chromeHints` | `true` | Updates the Memphis or newspaper frame for non-month and non-alpha rules. |
| `numericClass` | `true` | Adds `.numeric` to numeric grid cards. |

Grid:

| Token | Default | Effect |
| --- | --- | --- |
| `gridCols` | `null` | Fixed visual columns. `null` uses `spec.cols`. Model order is not changed. |
| `gridGap` | `.0175` | Minimum gap as a fraction of the stage width. The sampled gap is still drawn. |
| `gridHeight` | `.64` | Fraction of the available row height. The minimum card height is 40. |
| `gridWidth` | `.90` | Fraction of the stage width that cards and gaps occupy. |

List:

| Token | Default | Effect |
| --- | --- | --- |
| `flatClasses` | `[]` | Body classes that select the unsampled list geometry and an unpadded available room. |
| `zeroMarginClasses` | `[]` | Body classes that select margin 0 and skip both margin draws. |
| `monthHint` | `null` | Helper text for descending months, set before the wrap margin. |
| `listGapMin` | `4` | Minimum gap in px in the flat branch. |
| `listGap` | `.009` | Flat gap as a fraction of the stage height. |
| `listHeight` | `.075` | Flat card height cap as a fraction of the stage height. `Infinity` removes the cap. |
| `listFill` | `null` | Flat height budget as a fraction of the stage height. `null` uses the available height. |
| `listFontMax` | `24` | Flat maximum font size in px. The minimum is 15. |
| `listFont` | `.46` | Flat font size as a fraction of the card height. |

Kanban:

| Token | Default | Effect |
| --- | --- | --- |
| `tray` | `false` | Deterministic tray and column geometry. `false` keeps the sampled kanban. |
| `realStaging` | `false` | Starts the staged ids from the actual source group and skips the fake tray offsets. |
| `stagingLast` | `false` | Puts an actual staging group after the destinations, not before. |
| `avatars` | `true` | Draws the avatar coin flip and, when true, a sampled person and color per card. |
| `roundBoard` | `false` | Rounds the board width to whole px. |
| `roundPane` | `false` | Floors the deterministic pane width. |
| `kanbanWidth` | `.205` | Card width cap as a fraction of the stage width (non-pane boards). |
| `columnGap` | `.026` | Deterministic column gap as a fraction of the stage width. |
| `kanbanHead` | `[34, .086]` | Header height: the larger of the minimum px and the stage height times the fraction. |

## Parts

Shared and ordered scenarios (`grid`, `list`, `move`):

| Part | Result and default behavior |
| --- | --- |
| `style(id, css)` | Injects the shared CSS plus `css` once, at the original cascade position. |
| `tagEl(util, parent, lab)` | The colored tag badge. |
| `keyPanel(ctx, parent)` | The legend element, or `null`. |
| `isLocked(spec, id)` | True when the id is pinned. |
| `onOrder(ctx, getSortable)` | The drop handler: re-pins, sets when needed, mirrors the model order. |
| `mirrorFocus(ctx, root, idOf)` | Mirrors focus and pointer focusing for keyboard episodes. |
| `orderedBegin(ctx, wrap)` | Runs before the ordered measurements. No-op. |
| `available(ctx, wrap)` | `{availW, availH}`, minus the legend and the stage margins. |
| `gridFit(ctx, room, longest)` | Sets `geo` for the grid: card size, pitch and font. One gap draw. |
| `listFit(ctx, room, longest)` | Sets `geo` for the list. Two draws unless `flatClasses` matches. |
| `orderedFit(ctx, wrap)` | Runs after the board extent, before the board is created. No-op. |
| `orderedBoard(ctx, wrap)` | Runs after the board is created and sized. No-op. |
| `orderedCard(ctx, card, lab, longest)` | Runs after the data attributes, before sizing and children. No-op. |
| `gridTitle(ctx, card, lab, longest)` | The main tile title, before the optional subtitle. |
| `grip(ctx, card)` | The unlocked list grip (text dots by default). |
| `orderedReady(ctx, wrap)` | Runs after the sortable is set up, before the focus listeners. No-op. |
| `slotPos(i)` | `[x, y]` of an ordered slot from the live `geo`. |
| `renderOrdered(ctx, wrap)` | Renders list, move or grid through the smaller parts. |
| `begin(ctx)` | Frame hints, after `spec` is set, before the wrap exists. |
| `wrap(ctx, wrap)` | The descending-month helper and the sampled or zero margin. |
| `resetOrder(ctx)` | Installs `widget.clear`, which restores the episode's initial order. |
| `rendered(ctx, wrap)` | Runs after rendering, before the anchors. No-op. |
| `render(ctx)` | Episode setup and scenario dispatch. Returns `{anchors}`. |
| `locate(target)` | The viewport point of a target, through the sortable and pane geometry. |
| `ctxCenter(el)` | The viewport center of an element. |

Kanban layout:

| Part | Result and default behavior |
| --- | --- |
| `kanbanSize(ctx, wrap)` | The size from `ctx.size`. May remeasure the frame or size and position `wrap`. |
| `kanbanFit(ctx, size)` | Samples or computes `geo`, sets up staging and returns `L`. |
| `trayFit(ctx, size)` | Runs after the deterministic heights and staging, before the column widths. No-op. |
| `columnFit(ctx, size)` | Runs after the widths and pitches, before the board extents. No-op. |
| `boardHeight(ctx, size, barH)` | In px. With `tray`, the full available height. Sampled boards use the column height. |
| `boardWidth(ctx, size)` | The column extents in px, rounded when `roundBoard` is set. |
| `paneWidth(ctx, L)` | The deterministic width, or a sampled 2.2 to 3.4 columns (one float draw). |
| `kanbanBoard(ctx, L)` | Sets `.ordered` on trays, the board size, and the sampled-board font draw. |
| `renderKanban(ctx, wrap)` | Creates the board, columns, cards, sortable and pane controls. |

Kanban staging, columns and cards:

| Part | Result and default behavior |
| --- | --- |
| `staging(ctx)` | Resets `staged` and `trayPositions` for the episode. |
| `trayPositions(ctx, L)` | Fills the fake source positions. Default: four columns. |
| `tray(ctx, wrap, L)` | Builds the tray DOM before the columns. Default: a label and the fake positions. |
| `columnIds()` | The visible destination column order. Default: `spec.columns`. |
| `groupIds()` | The sortable group order, with a real staging group when `realStaging` is set. |
| `columnBegin(ctx, col, c, ci, L)` | Runs before the column heading. No-op. |
| `column(ctx, col, h, c, ci, L)` | Adds the heading's label. |
| `columnReady(ctx, col, h, c, ci, L)` | Runs after the heading and count. No-op. |
| `columnsReady(ctx, L, cols, counts)` | Runs after all columns, before the first count update. No-op. |
| `counts(ctx, cols, counts, L)` | Returns a callback that shows the model column counts. |
| `kanbanCardBegin(ctx, card, lab, L)` | Runs after the avatars, before the title and value. No-op. |
| `kanbanTitle(ctx, card, lab, L)` | The title, with wordy wrapping and a 13px wordy font. |
| `kanbanCard(ctx, card, lab, L)` | Runs after the title and value, before the sortable setup. No-op. |
| `kanbanReady(ctx, wrap, L, cols)` | Runs after the sortable setup, before the pane controls. No-op. |
| `cardPos(columnIndex, i, n)` | `[x, y]` of a column slot, with a compressed pitch in crowded columns. |
| `slotRect(i, column, n)` | `[x, y, w, h]`: maps a group id to its slot geometry. |
| `paneColumns()` | The column spans for the task oracle. |
| `paneReady(ctx)` | Runs before the pane listeners and the first pane mirror. No-op. |
| `mirrorPane(ctx)` | Mirrors scroll, width, max and column spans into `model.pane`. |
| `thumbLeft(scroll)` | The scrollbar thumb offset in px. |

Kanban dragging and dropping:

| Part | Result and default behavior |
| --- | --- |
| `dragStart(id)` | Records the scroll and the grab offset of a fake-source card. |
| `dragRect(el, rect, info)` | Applies the fake-source placement and grab offsets. |
| `pan(el, rect, info)` | Pans the pane at its edge, mirrors it and compensates the dragged x. |
| `place(el, rect, info)` | Calls `sortable.defaultPlace` after `dragRect` and `pan`. |
| `dragScrollDelta()` | The live scroll minus the scroll at drag start, in px. |
| `groupAt([x, y])` | The nearest destination column, with pan and source compensation. |
| `dropRule([x, y], slots)` | The closest slot center in 2D, with the same compensation. |
| `columnsChanged(columns, info)` | Clears fake staging and reflows when needed, then updates the model and counts. |

## Common changes

- Different grid sizes: `gridCols`, `gridGap`, `gridHeight`, `gridWidth`, or replace `gridFit`.
- A different list density: `listGap`, `listGapMin`, `listHeight`, `listFill`, `listFont`, `listFontMax`, or wrap
  `listFit`. Wrapped fits run after the original draws.
- A different list grip: `grip`.
- A reset button: `resetOrder`, called from `rendered` or `orderedReady`.
- A different tray or source panel in kanban: `trayFit`, `tray`, `trayPositions`, and `dragStart`, `dragRect`, `place`
  when the tray cards drag from a fake position.
- A real source group that is a sortable group: `realStaging`, `stagingLast`, `groupIds`, `slotRect`.
- Counts or progress in empty columns: `counts`, `columnBegin`, `columnReady`.
- Remeasuring the board after a count change: `kanbanSize`, `columnsChanged`.
- Cards with detail lines: `kanbanTitle`, `kanbanCard`. Keep the `cardMeta` and `wheelPane` traits of the widget.
