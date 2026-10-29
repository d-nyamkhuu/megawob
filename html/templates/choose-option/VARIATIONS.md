# choose-option/widgets

A form card that holds the widget of the scenario. The card, its CSS and its state are shared. The scenario picks the
widget.

| Scenario | The widget |
| --- | --- |
| `checkbox` | Native checkbox choices. |
| `radio` | Native radio choices. |
| `dropdown` | A DOM select with an all-options popup. |
| `autocomplete` | A text input with suggestions on the task clock. |
| `listbox` | A listbox with a custom scrollbar, in the reference card. |

With `design: {}`, each scenario draws one existing site:

| Scenario | Site | Preset |
| --- | --- | --- |
| `checkbox` | `design-choose-option-checkbox-11` | None: a plain form shell with native choices. |
| `radio` | `design-choose-option-radio-01` | `emailHeader: true`, `emailContent: true`, `resetSelector: '.ds-reset'`, `optionCount: true`, `scaleBeforeLayout: true`, `scaleInset: 8`. |
| `dropdown` | `design-choose-option-dropdown-01` | `details: true`, `motif: true`, `scaleBeforeLayout: true`, `scaleInset: 8`. |
| `autocomplete` | `design-choose-option-autocomplete-01` | `marker: true`, `titleTag: 'h3'`, `titleClass: 'ds-destination-title'`, `titleText: 'Destination'`, `travelExtra: true`, `suggestionColumns: true`, `scale: false`. |
| `listbox` | `design-choose-option-listbox-11` | `compact: true`, `syncScroll: false`, `integralRows: true`. |

The header of `widgets.js` lists every token and part. This file is a shorter guide. (The file is named
`VARIATIONS.md` because the header refers to it by that name.)

## Rules

- Parts are `(base, S) => replacement`. All calls go through `P`.
- `S.ctx`, `S.spec` and `S.st` read the live episode. `S.els` holds `wrap`, `card` and `field`, and the controls of the
  widget. For `autocomplete` the controls are spread into `S.els`. For `listbox` they are in `S.els.controls`.
  `S.D` and `S.P` are the resolved tokens and parts.
- There is no module state. Unknown tokens and unknown parts throw.
- Keep every rng draw, in order. Extra decoration draws from `ctx.rng.fork(label)`.
- Keep a site's identity, traits and its own widget methods. A listbox with its own public `clear()` method keeps it,
  and installs its callback through `parts.ready`.

## Card tokens

| Token | Default | Effect |
| --- | --- | --- |
| `cardClass` | `'fp-card'` | Class of the card. |
| `cardWidth` | `true` | Stage width minus 60px, at least 240px. |
| `radius`, `controlRadius` | `'3px'`, `'2px'` | Radii of the card and the controls. |
| `titleTag` | `'div'` | Tag of the title. `null` omits the title. |
| `titleClass` | `'fp-title'` | Class of the title. |
| `titleText` | `null` | Title text. `null` uses `spec.title`. |
| `note` | `true` | Draws `spec.note`. |
| `fieldClass` | `'fp-field'` | Class of the field. |
| `compact` | `false` | Adds `.compact` when the card is taller than the stage minus 24px. |
| `freeze` | `true` | Freezes the card height. |
| `scale` | `true` | Scales a card that overflows. |
| `scaleBeforeLayout` | `false` | Scales before the widget's layout and show. |
| `scaleInset` | `10` | Height reserved below the card, in px. |

## Choice tokens (checkbox and radio)

| Token | Default | Effect |
| --- | --- | --- |
| `choiceFlow` | `null` | `grid-auto-flow` of the choices. `null` leaves it to CSS. Use `'column'` for column-major choices. |
| `choiceRows` | `null` | Fixed column count for the grid rows. `null` omits the rows. |
| `choiceRowsVar` | `null` | CSS custom property that receives `ceil(count / choiceRowsDivisor)`. |
| `choiceRowsDivisor` | `3` | Divisor for that property. |
| `clearSelector` | `null` | An existing clear button to bind. |
| `detailTable` | `{}` | Option details by option, when the spec has none. |
| `detailFallback` | `null` | Detail text for options not in `detailTable`. |

## Radio tokens

| Token | Default | Effect |
| --- | --- | --- |
| `emailHeader` | `false` | An email heading instead of the title and note. |
| `emailTitle` | `'Email Preferences'` | Text of that heading. |
| `emailNote` | `'Select how often ... at any time.'` | The introductory paragraph. |
| `emailContent` | `false` | Adds the email content checkboxes. |
| `emailContentTitle` | `'Email content:'` | Title of that section. |
| `emailOptions` | `['University news', 'Events and activities', 'Alumni stories']` | Labels of those checkboxes. |
| `resetSelector` | `null` | An existing reset button to bind. |
| `optionCount` | `false` | Mirrors the option count to `card.dataset.options`. |

## Dropdown tokens

| Token | Default | Effect |
| --- | --- | --- |
| `chevron` | built-in SVG | The trigger icon. |
| `rowMaxExtra` | `0` | Added to the sampled maximum row height. |
| `revealOptions` | `false` | Reveals the active or located row in a scrolling popup. |
| `details` | `false` | A description and attachments aside. |
| `motif` | `false` | A title input instead of the title, plus decoy fields. |
| `motifTitle` | `'Title:'` | Label of that input. |
| `motifValue` | `'Update user guide'` | Value of that input. |
| `motifFields` | `[['Priority:', 'Medium'], ['Due Date:', 'Apr 24, 1991'], ['Status:', 'In Progress']]` | Decoy label and value pairs. |

## Autocomplete tokens

| Token | Default | Effect |
| --- | --- | --- |
| `searchSvg`, `okSvg` | built-in SVG | The input and committed icons. |
| `marker` | `false` | The Trip Details marker. |
| `travelExtra` | `false` | The travel dates and travelers section. |
| `suggestionColumns` | `false` | Fits the suggestions into one or two columns. |

## Listbox tokens

| Token | Default | Effect |
| --- | --- | --- |
| `sampleRows` | `true` | Draws `rng.int(30, 34)` before the list is built. `false` makes no such draw. |
| `syncScroll` | `true` | Reapplies the model scroll in `show`. |
| `scrollPad` | `2` | Scrollbar padding in px. `null` uses `max(20, stage width * .061)`. |
| `minThumb` | `28` | Smallest thumb size. |
| `keyboard` | `false` | Keyboard input on the list. |
| `railClass` | `'fp-rail'` | Class of the scrollbar wrapper. `null` puts the track in the list frame. |
| `arrows` | `true` | Arrow buttons. |
| `arrowClass` | `'fp-arrow'` | Class of the arrow buttons. |
| `arrowUp`, `arrowDown` | `'⌃'`, `'⌄'` | Arrow text. |
| `arrowStep` | `'row'` | `'row'`: a row's `offsetHeight`. `'geometry'`: `rowH`. |
| `stopArrows` | `false` | Stops propagation of arrow `pointerdown` and `click`. |
| `integralRows` | `false` | Integer row and list CSS properties from the frame height. |
| `emptyText` | `'Nothing selected'` | Text of the empty selection box. |
| `rowBox` | `false` | An empty selection box for single selection too. |

## Parts

Card and flow:

| Part | Result and default behavior |
| --- | --- |
| `begin(ctx)` | Runs before the card. Calls `P.marker`, then `P.details`. |
| `layout(ctx)` | `{wrap, card, field}`. Calls `P.wrap`, `P.card`, `P.heading` and `P.field`. |
| `wrap(ctx)` | The `fp-wrap` element in the stage. |
| `card(ctx, wrap)` | Creates and sizes the card. For `listbox`, the reference card with sampled radii and width. |
| `heading(ctx, card)` | The email header, or `P.motifTitle`, or the title; then the note. |
| `field(ctx, card)` | Creates the field and calls `P.label`. |
| `label(ctx, field)` | `spec.label`. For `listbox`, with a sampled caps draw. |
| `decorated(ctx, card, field, wrap)` | Runs after the widget. Calls `P.motifFields`, `P.emailContent`, the option count and `P.travelExtra`. |
| `freeze(ctx, card)` | Makes the card compact and freezes its height. |
| `scale(ctx, card)` | Fits the card height. Not used for `listbox`. |
| `ready(ctx, card)` | Runs after `scale`, or before the layout when `scaleBeforeLayout` is set. Binds `resetSelector`. For `listbox`, `ready(ctx, controls)` runs at the end of the build and does nothing. |
| `place(ctx, card)` | `listbox` only, after `freeze`: the sampled reference placement. |
| `rendered(ctx, card, field, wrap)` | Runs after layout, show and scale. No-op. |
| `locate(target)` | `[x, y]`. Delegates to the widget. Throws on a missing target. |
| `build(field, ctx)` | Builds the widget of the scenario. Installs `st.show`, `st.loc` and `st.layout`. |

Choices (checkbox and radio). The controls are `{group, inputs, labels, ch, show, set}`:

| Part | Result and default behavior |
| --- | --- |
| `choiceGrid(ctx, group, n, cols)` | Applies the flow and row styles after the grid columns. |
| `choiceBeforeText(ctx, label, input, option, index)` | Runs before the option text. No-op. |
| `choiceDetail(ctx, option)` | The detail text: `spec` detail, then the token table and fallback. |
| `choicesReady(ctx, controls)` | Runs before the first show. Binds `clearSelector`. |
| `choicesShown(ctx, controls)` | Runs after the classes update. No-op. |
| `emailContent(ctx, card)` | The email content checkboxes. |

Dropdown. Its controls are `{rows, trigger, pop, rowMax, dd}`:

| Part | Result and default behavior |
| --- | --- |
| `select(parent, ctx, options)` | The DOM dropdown controller. Keeps the `rowMax` draw. |
| `selectLayout(ctx, controls)` | Places rows and columns within the stage. |
| `option(ctx, row, value, index)` | The option label after the tick. |
| `reveal(ctx, controls, value)` | Scrolls an option into view, when `revealOptions` is set. |
| `details(ctx)` | The description and attachments aside. |
| `motifTitle(ctx, card)` | The title input. |
| `motifFields(ctx, card)` | The decoy inputs. |

Autocomplete. The controls gain `{box, ctl, input, pop, ac, show, status, rowH}` in construction order:

| Part | Result and default behavior |
| --- | --- |
| `marker(ctx)` | The Trip Details marker. |
| `travelExtra(ctx, card, field, wrap)` | The travel dates and travelers. |
| `autocompleteInput(ctx, controls)` | Runs after the input, before the OK icon. No-op. |
| `autocompleteControl(ctx, controls)` | Runs after the popup, before the status. No-op. |
| `autocompletePainted(ctx, controls, model)` | Runs after a controller paint change. No-op. |
| `autocompleteShown(ctx, controls, model)` | Runs after the committed class update. No-op. |
| `autocompleteReady(ctx, controls)` | Runs before the first show. No-op. |
| `suggestions(ctx, controls)` | Runs after every paint: columns of 28px, or single rows of 36px. |

Listbox. The controls gain `{field, initialScroll, lb, rowH, H, border, list, rows, track, thumb, up, down, status,
mirror, lbx, show}` in construction order:

| Part | Result and default behavior |
| --- | --- |
| `geometry(ctx, controls, sampledRowH)` | `{rowH, H, border}`: the sampled rows and a 2px border. |
| `list(ctx, controls)` | The `fp-list` element, with the geometry height. |
| `row(ctx, controls, option, index)` | A row: the selection box, the decoration and the text. |
| `rowDecoration(ctx, controls, row, option, index)` | Runs before the row text. No-op. |
| `rowsDone(ctx, controls)` | Runs after the last row's border is removed. No-op. |
| `rail(ctx, controls)` | `{track, thumb, up?, down?}`: the track, thumb and optional arrows. |
| `status(ctx, controls)` | The status element. |
| `prepare(ctx, controls)` | Runs before the controller. Optional whole-pixel CSS geometry. |
| `scrollOptions(ctx, controls)` | `pad`, `minThumb` and `onDrag` for the scrollbar. |
| `mirror(ctx, controls, physicalIndex)` | Rounds the scroll index and mirrors it into the model. |
| `toPhysical(ctx, controls, logicalIndex)` | The physical index. Default: the identity. |
| `wheelScale(ctx, controls)` | Default: `1`. |
| `wheel(ctx, controls)` | Binds the wheel, refreshes and mirrors. |
| `arrowsReady(ctx, controls)` | Binds the arrow clicks. |
| `controllerReady(ctx, controls)` | Runs after the controller, before the wheel. No-op. |
| `values(ctx, controls, model)` | Sets the selected values, and the scroll when `syncScroll` is set. |
| `shown(ctx, controls, model)` | Runs after the selection and status update. No-op. |
| `measured(ctx, controls)` | Writes the row pitch into `model.px`. |

## Common changes

- Column-major or fixed-row choices: `choiceFlow`, `choiceRows`, `choiceGrid`.
- A row-count CSS variable: `choiceRowsVar`, `choiceRowsDivisor`.
- A clear or reset button that already exists in the frame: `clearSelector`, `resetSelector`. A button the design
  creates itself: `choicesReady`.
- A label moved out of the card or around the widget: `decorated`.
- A different scale rule: `scale`, `scaleBeforeLayout`, `scaleInset`, `freeze`.
- Descriptions under the radio options: `choiceDetail`, `detailTable`, `detailFallback`.
- A different email section in `radio`: `emailContent`, `emailOptions`, `emailContentTitle`, `emailNote`.
- A different dropdown layout or an upward popup: `selectLayout`, `select`, `option`.
- Decoy fields around the dropdown: `motifTitle`, `motifFields`, `details`.
- Suggestions in different columns: `suggestions`, `suggestionColumns`.
- Extra controls around the autocomplete input: the `autocomplete*` hooks and `travelExtra`.
- Listbox row geometry and decoration: `geometry`, `list`, `row`, `rowDecoration`, `integralRows`.
- Listbox arrows and scrollbar: `rail`, `arrows`, `arrowUp`, `arrowDown`, `scrollPad`, `scrollOptions`.
- A scroll mapping other than the plain one: `mirror`, `toPhysical`, `wheelScale`, `measured`.
- An external selection summary or a clear action in the listbox: `shown` and `ready`.

Verify a change to the template as `templates/README.md` ("Changing a template") describes: golden snapshots of the
sites built on it before and after, the checker and the lint.
