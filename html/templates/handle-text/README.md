# handle-text/editor

An editor window around the text fields, source boxes and scroll lists that the handle-text scenarios need. All
scenarios share the frame, the fields, source selection, the page clipboard, the scrolling DOM and the result line.

| Scenario | The agent |
| --- | --- |
| `copy-paste` | Copies the whole text of a named source box into the answer field. |
| `copy-paste-2` | Copies one part of a source box: a sentence, a line, or the value after a label. |
| `scroll-text` | Reads a fixed-height box of lines: types the last word, a word of a given line, or scrolls to an end. |
| `sign-agreement` | Scrolls an agreement to the end, which enables the name field and buttons, then signs or declines. |
| `spinner` | Moves a number (a font size) to a target with arrow buttons, typing or press-and-hold. |
| `unicode` | Types a non-ASCII string, copies it from a box, or clicks the button with a given label. |

The header of `editor.js` lists every token and part. This file is a shorter guide.

## Defaults and presets

The token defaults draw `design-handle-text-spinner-12`. Each scenario also has a preset that sets some tokens for
you, and tokens in `design` win over the preset. With `design: {}` the presets draw these sites:

| Scenario | Site |
| --- | --- |
| `copy-paste` | `design-handle-text-copy-paste-01` |
| `copy-paste-2` | `design-handle-text-copy-paste-2-04` |
| `scroll-text` | `design-handle-text-scroll-text-01` |
| `sign-agreement` | `design-handle-text-sign-agreement-07` |
| `spinner` | `design-handle-text-spinner-01` |
| `unicode` | `design-handle-text-unicode-01` |

The `spinner` preset replaces the arrows with filled triangles and turns on wheel stepping and the preview. A
spinner design that wants the plain arrows sets `upSvg`, `downSvg` back to the originals and `spinnerWheel: false`,
`spinnerPreview: false`.

The template also keeps the `edit` and `find` builders (`buildEdit`, `buildFind`) for callers that ask for them.

## Rules

- Parts are `(base, S) => replacement`. All calls go through the resolved parts `P`.
- `S.st` (get and set) is this page's episode state. `S.ctx`, `S.spec`, `S.D` and `S.P` are live.
- All mutable state, the document listener flags and the caret measurer belong to the page's factory instance, not to
  module scope. No DOM work runs in the factory.
- A view has `card`, `loc(target)` and `sync(model)`, and may have `after()` and `dispose()`.
- A replaced part must keep every original rng draw, in order. `resultLine` samples its Undo label. Extra draws use
  `ctx.rng.fork(label)`.
- A fitter that has to run after the final geometry can work on the card in `afterRender`, or wrap `S.st.view.after`
  in `rendered` before it is called.

## Tokens

Shared:

| Token | Default | Effect |
| --- | --- | --- |
| `avoidSubmit` | `true` | Subtracts the overlapping end control from the usable stage. |
| `emptyPlaceholder` | `null` | Fallback when a field has no placeholder. Unicode uses one space. |

copy-paste and copy-paste-2:

| Token | Default | Effect |
| --- | --- | --- |
| `copyPlaceholder` | `false` | Uses a placeholder that knows its source. |
| `denseSources` | `Infinity` | Adds the `dense-sources` class above this source count. The preset is `3`. |
| `sourceGrid` | `false` | Sets two grid columns above three sources, after building. |
| `copyLineHeight` | `false` | Fits the line height of the first source (`copy-paste-2`). |
| `dockAnswer` | `false` | Moves the end control and the visible instruction into the answer row. |
| `endSelector` | `'.submit'` | The end control that `dockAnswer` moves. |

scroll-text:

| Token | Default | Effect |
| --- | --- | --- |
| `document` | `false` | Printed rows, a document heading, a range counter and cleaned-up field. |
| `documentTitle` | `'Document: Partner Onboarding Guide (v1.4)'` | Heading text. |
| `documentFieldLabel` | `null` | `null` uses the sampled label with one trailing colon. |
| `printMin`, `printMax`, `printDivisor` | `18`, `20.5`, `78` | Printed line height: `width / printDivisor`, clamped to `[printMin, printMax]`. |
| `recordSeen` | `false` | Also publishes the changed seen state when the scroll did not change. |
| `lineImportant` | `false` | Sets the list height with `!important` and a fixed flex box. |
| `forcePane` | `false` | Applies the list height again before the final card sizing. |

sign-agreement:

| Token | Default | Effect |
| --- | --- | --- |
| `agreementLook` | `false` | Uses `--agreement-reserve` (fallback 164) for the row height. |
| `scrollArrows` | `false` | Adds an up and down arrow rail. |
| `signFieldLabel` | `null` | Label of the name field. `null` keeps the sampled one. |
| `signPlaceholder` | `false` | `false` keeps the placeholder, `null` removes it, a string replaces it. |
| `pendingResult` | `false` | Marks the result as pending until a button is pressed. |
| `directDecline` | `false` | Lets Cancel skip the scroll gate in decline mode. |
| `signScrollMode` | `'plain'` | How scroll restoration is guarded. `'position'` ignores restoration echoes. `'touched'` ignores scrolls before a pointer, wheel or key interaction. |
| `deferSignRestore` | `false` | Restores the agreement scroll after the final card sizing. |
| `unlockAtEnd` | `false` | Publishes an unchanged end position if the gate is still locked. |

`lineImportant` and `forcePane` apply here too.

spinner:

| Token | Default | Effect |
| --- | --- | --- |
| `upSvg`, `downSvg` | stroked arrow markup | Arrow icons. |
| `spinnerWheel` | `false` | Steps the value with the wheel while the field is focused. |
| `spinnerPreview` | `false` | Adds a preview and regroups the label and hint. |
| `previewTitle` | `'Preview'` | Preview heading. |
| `previewSubtitle` | `'Sample text with the current font size.'` | Preview subheading. |
| `previewText` | `'The quick brown fox jumps over the lazy dog.'` | Preview body. |
| `spinnerDescription` | `'Set the font size for the document text.'` | The regrouped hint. |

unicode:

| Token | Default | Effect |
| --- | --- | --- |
| `unicodeSample` | `false` | Shows the answer sample instead of the plain type hint. |
| `unicodeActions` | `false` | Creates an action row. |
| `unicodeControls` | `'.submit,.clear-text'` | Selector of the controls that move into that row. |

## Parts

Plumbing. These are rarely replaced:

| Part | Result and default behavior |
| --- | --- |
| `ensureStyle()` | Prepends the shared `ut-style` once. |
| `fam()` | The task definition. Widget helpers are under `.helpers`. |
| `live()` | True while the current card is connected. |
| `isTextInput(el)` | True for an enabled, writable text or search input or textarea. |
| `up(patch)` | Merges a patch into the current model. |
| `liveSel()`, `sameSel(a, b)`, `modelSel(selection)` | Source selection helpers. `liveSel` needs a single source box. |
| `copied(text)`, `onCopy(event)`, `onPaste(event)` | The page clipboard: update, copy or cut, and paste at the caret. |
| `install()` | Installs the page listeners once per factory instance. |
| `caretPoint(input, index)` | Measures a caret boundary. |

Frame and layout:

| Part | Result and default behavior |
| --- | --- |
| `usable(ctx)` | `stageBox` minus an overlapping end control. |
| `stageBox(ctx)` | The full `ctx.size` rectangle. |
| `makeLook(rng, spec, box, squeeze)` | The fixed editor layout and its CSS variables. |
| `frame(ctx, look, file, tag)` | Returns `{card, body}`: the editor window and title bar. |
| `statusBar(card, util, items)` | Appends the status strip. |
| `fieldRow(ctx, parent, field, inline, id, onInput, value)` | Returns `{row, input, api}`: a labeled text field. |
| `resultLine(ctx, parent, onUndo)` | Returns `{set, locate}`: the result line and its sampled Undo label. |
| `lineBox(ctx, parent, lines, opts)` | The scrolling DOM: `{box, list, lbx, ...}`. |
| `scrollLoc(target, lbx, spec, list)` | A point for the pane, thumb or edge targets, or `null`. |
| `sourceBox(ctx, parent, source, index, onFocus, onSel)` | Returns `{text, sel}`: a source with scoped selection. |
| `beforeRender(ctx)` | Runs first. No-op. Can dispose the previous `S.st.view`. |
| `build(ctx, look)` | Dispatches to the builder of the scenario. |
| `viewBuilt(ctx, view, look, box)` | Optional dense grid or pane sizing, before the card is sized. |
| `cardLayout(ctx, view, box)` | Full-stage absolute card sizing. |
| `rendered(ctx, view, look, box)` | Preview, answer docking and Unicode actions, before `view.after`. |
| `afterRender(ctx, view, look, box)` | Runs after `view.after`, before the anchors. No-op. |
| `renderResult(ctx, view)` | Returns `{anchors, sync}`: the card anchor and the view sync. |

Builders, one per scenario: `buildCopy` (copy-paste and the Unicode text entry), `buildButtons` (the Unicode button
test), `buildScroll`, `buildSign` and `buildSpinner`.

copy-paste and unicode:

| Part | Result and default behavior |
| --- | --- |
| `fieldInput(ctx, row, id)` | Creates the text input. Replace it to use a textarea. |
| `fieldCreated(ctx, field, definition, id)` | Runs after `textField` is bound. No-op. |
| `sourceLines(ctx, text, source, index)` | Runs before the source line DOM. No-op. |
| `sourceCreated(ctx, parent, source, index, {text, sel})` | Runs after the selection is bound. No-op. |
| `sourceContainer(ctx, src, source, index)` | Runs before the source title. No-op. |
| `copyBuilt(ctx, card, sources)` | Runs after the sources and the answer are built. No-op. |
| `copyField(ctx, field, typed)` | Sets the source-aware paste placeholder when enabled. |
| `typedSample(ctx, body, look)` | The Unicode sample, or the plain hint. |
| `unicodeControl(ctx, control)` | Returns true for the controls that move into the Unicode action row. |
| `fitFlow(ctx, view)` | When the Unicode button flow is taller than the card, goes to 2 columns, then 3. |

scroll-text and sign-agreement:

| Part | Result and default behavior |
| --- | --- |
| `lineHeight(spec, box)` | The sampled row fit, or the document row fit. |
| `lookMade(ctx, look, box)` | The line-height presets of `copy-paste-2` and the agreement. |
| `lineLayout(ctx, box, list, opts)` | The pane height and the printed reading space. |
| `lineRow(ctx, row, opts, index)` | Optional printed row height. |
| `linesCreated(ctx, box, list, indexedRows, opts)` | Runs before the scrollbar. No-op. |
| `scrollbar(ctx, box, list, opts)` | Returns the scrollbar, with the optional arrow rail, thumb and padding. |
| `lineApi(ctx, box, list, indexedRows, opts, scrollbar)` | Binds the listbox: `{box, list, lbx, ...}`. Replace it for a different physical scroll mechanism. |
| `printLineHeight(ctx, look)` | `width / printDivisor`, clamped between `printMin` and `printMax`. |
| `documentRange(ctx, holder, look)` | Returns `{printLh, visibleRows?, read, show, bind, sb?}`: the document line counter. |
| `documentBound(ctx, scrollBox, range)` | Runs before the initial scroll restore. No-op. |
| `documentAfter(ctx, scrollBox, range, look)` | Runs after the final geometry. No-op. |
| `documentField(ctx, field)` | Document label and placeholder cleanup. |

sign-agreement only:

| Part | Result and default behavior |
| --- | --- |
| `signLook(ctx, look, card)` | Runs before the agreement heading. No-op. |
| `signParent(ctx, body)` | The parent element. Default: `body`. Replace it to add a document and name pane. |
| `signAcknowledgment(ctx, parent)` | Runs between the document and the name field. No-op. |
| `signCaption(ctx, body)` | Runs between the name field and the actions. No-op. |
| `signField(ctx, field)` | Optional label and placeholder of the name field. |
| `signEnabled(ctx, model, key)` | True when unlocked, or when `directDecline` allows it. |
| `signPaint(ctx, body, model)` | Optional pending class on the result. |
| `signScroll(ctx, card, body, look)` | Returns the scroll controller, with the policy chosen by `signScrollMode`. |

A `signScroll` controller has `options`, `read(index, paint)`, `initial(scrollBox)`, `built()`,
`after(scrollBox, field)`, `sync(scrollBox, model)` and `dispose()`. It keeps its policy state per render.

spinner only:

| Part | Result and default behavior |
| --- | --- |
| `spinnerInput(ctx, input, clamp, show)` | Optional focused wheel stepping. |
| `spinnerBuilt(ctx, body)` | Runs before the status strip. No-op. |
| `spinnerPreview(ctx, view)` | Optional preview and regrouped label and hint. |

## Common changes

- A textarea instead of an input: `fieldInput`, and `fieldCreated` for what follows the binding.
- Where the end control and the instruction go: `usable`, `stageBox`, `dockAnswer`, `endSelector` and `rendered`.
- Fitting crowded sources after layout: `rendered`.
- A different printed row height: `printMin`, `printMax`, `printDivisor`, or replace `printLineHeight`.
- A different scrollbar or scroll surface: `scrollbar`, `lineApi`, `lineLayout`.
- A different scroll guard in the agreement: `signScrollMode`, `deferSignRestore`, `unlockAtEnd`, or replace
  `signScroll`.
- Extra spinner decorations: `spinnerBuilt`, `spinnerPreview`, or wrap the base `rendered`.
- Moving the Unicode controls: `unicodeControls`, `unicodeControl`.

Verify a change to the template as `templates/README.md` ("Changing a template") describes: golden snapshots of the
sites built on it before and after, the checker and the lint.
