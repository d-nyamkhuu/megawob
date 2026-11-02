# select-text/paragraphs

Native DOM text selection on an article card. The agent selects a span of text, and the page reads the browser
selection. The text is a document of paragraphs; every position is a character offset into it.

| Scenario | The agent selects |
| --- | --- |
| `paragraph` | A whole paragraph, named by position, topic or a word only it contains. |
| `sentence` | One sentence, named by position, a word only it contains or its first words. |
| `phrase` | An exact quoted phrase of two to five words. It may cross an inline link or bold mark. |

The template also keeps the `word` and `field` paths of the original widget. Long documents can sit in a scrolling
pane (the widget declares `traits.pane`), so the target starts below the visible part.

With `design: {}`, the scenarios draw `design-select-text-sentence-01`, `design-select-text-paragraph-01` and
`design-select-text-phrase-11`. The header of `paragraphs.js` lists every token and part. This file is a shorter
guide.

## Rules

- Parts are `(base, S) => replacement`. Every part is called through `P`, including inner functions that other parts
  use.
- State is per factory. Overrides read live state through `S`: `ctx`, `spec`, `card`, `head`, `pane`, `bar`, `thumb`,
  `textEl`, `sel`, `scroller`, `D`, `P`, and settable `font` and `lh`.
- Build DOM in `render` only. Preserve every rng draw, in order. The line-height draw is always made, even when
  `lineHeight` is set.
- Widget traits (for example `triple` and `pane`) stay in the widget registration of the site. They are
  never inferred from the UI.
- A site that has its own widget methods, such as its own clear method, keeps them in its widget registration. A
  `bound` override can connect them to the live state.
- The original CSS, content choices, inline mark rendering and scrollbar measurements are kept.

## Presets

| Scenario | Preset |
| --- | --- |
| `sentence` | None. |
| `paragraph` | `fontMax: 34`, `fontDivisor: 42`, `paragraphCount: false`, `roomMode: 'paragraph'`. |
| `phrase` | `fontDivisor: 40`, `paragraphCount: false`, `sections: true`, `roomMode: 'padded'`. |

## Tokens

| Token | Default | Effect |
| --- | --- | --- |
| `fontMax`, `fontDivisor` | `28`, `55` | Font size: `min(fontMax, round(ctx.size.width / fontDivisor))`. |
| `paragraphCount` | `true` | Sets `--hl-paragraph-count` on the card. |
| `sections` | `false` | Section wrappers, headings, the paragraph dataset and the `hl-full` class. |
| `headings` | `['A Quiet Morning', 'Plans for the Day', 'Looking Ahead']` | Section heading text. `null` leaves headings out. |
| `headingFallback` | `'Further Notes'` | Heading used when there are more sections than headings. |
| `roomMode` | `'stage'` | How the room is measured. See below. |
| `lineHeight` | `null` | A fixed line height. `null` uses the sampled one. |
| `minFont` | `10` | Smallest font for full-document fitting. The pane floor stays 13. |
| `sentenceRows` | `null` | `null`: plain paragraphs. `'flow'` or `'numbered'`: splits the text into sentence spans. |
| `clearSelection` | `false` | Installs `env.widgetDef.clear` after the selection is bound. |
| `readKeyup` | `false` | Mirrors the native selection right after key input. |
| `readPointerup` | `false` | Mirrors the native selection right after the pointer is released. |
| `dragEndpoints` | `null` | `null`: native drag. `'checked'`, `'pointer'` or `'button'`: commits the real caret positions with the original validation, `pointercancel` scope and listener order. |
| `tripleClick` | `null` | `null`: native click. `'exact'`: selects the containing paragraph. `'nearest'`: falls back to the nearest one. |

`roomMode` values:

| Value | Room height |
| --- | --- |
| `'stage'` | `stage.clientHeight - 2`. |
| `'paragraph'` | `max(size.height - 32, stage.clientHeight - 8)`. |
| `'padded'` | `min(size.height, clientHeight)` minus the stage padding. |
| `'bounded'` | `max(0, min(size.height, clientHeight) - 2)`. |

## Parts

Layout and text:

| Part | Result and default behavior |
| --- | --- |
| `width(ctx)` | `size.width - 44`, in px. |
| `font(ctx, width)` | The font size from the tokens, in px. |
| `begin(ctx)` | Runs before the card is created. No-op. |
| `card(ctx, el)` | Sets the paragraph-count property. |
| `heading(ctx, el)` | The seeded article or message header. |
| `meta(ctx)` | The paragraph-count text. |
| `textCreated(ctx)` | Runs right after the text is created, before `data-role`. No-op. |
| `text(ctx)` | Runs after `data-role`, with the section dataset and class. |
| `paragraphsBefore(ctx)` | No-op. |
| `paragraph(ctx, index)` | The optional section and heading, then the paragraph. |
| `paragraphContent(ctx, p, text, offset, marks, segments)` | Returns the sentence count, or `null`. |
| `sentenceRuns(text)` | `{text, start}[]`: the sentence tokenizer. |
| `segment(ctx, el, text, offset, marks, segments, force = false)` | Inline marks and text nodes. |
| `fillParagraph(util, el, text, offset, marks)` | Appends text, link and bold runs. |
| `paragraphsAfter(ctx, counts)` | Runs before the footer. No-op. Use it for previews or tips. |
| `footer(ctx)` | The conditional footer, with its rng draws. |

Fitting:

| Part | Result and default behavior |
| --- | --- |
| `fit(ctx)` | Applies the current font and the line height. |
| `room(ctx)` | The room in px, from `roomMode`. |
| `beforeFit(ctx, room)` | No-op. |
| `preparePane(ctx)` | Runs before the pane height is zeroed. No-op. |
| `paneChrome(ctx)` | The card height minus the pane, in px. |
| `paneView(ctx, avail, full)` | A seeded 40 to 62 percent view, bounded by the available height. |
| `fitPane(ctx, room)` | Fits the scrolling text, then sizes the pane. One float draw. |
| `prepareFull(ctx, room)` | The section text height. |
| `overflows(ctx, room)` | True when the card or its sections overflow. |
| `reduceFont(font)` | `font - 1`. |
| `fitFull(ctx, room)` | Prepares, then shrinks down to `minFont`. |
| `afterFit(ctx, room)` | No-op. Use it for compact fallbacks or previews. |

Selection and scrolling:

| Part | Result and default behavior |
| --- | --- |
| `bindSelection(ctx, textEl, segments, onShow?)` | Binds the native selection. Returns the primitive. |
| `selectionBound(ctx, textEl, selection, update)` | No-op. Use it for extra caret checks. |
| `dragSelection(ctx, textEl, selection, update, drag, caretAt)` | The endpoint listeners. |
| `paragraphAt(spec, offset)` | The exact or nearest paragraph range for a triple-click, or `null`. |
| `bound(ctx)` | Installs the optional clear. |
| `show(model)` | Shows the selection. No-op. Use it for counters. |
| `clear()` | Sets an empty selection, shows it and updates the model. |
| `scrollPane(ctx, pane, content, bar, thumb)` | Returns `{st, init, to, locate}`: the custom scrollbar. |
| `rendered(ctx)` | Runs after the scrollbar is initialized. No-op. |
| `sync(model)` | Sets the selection and shows it. |

## Common changes

- A different font rule: `fontMax`, `fontDivisor`, or replace `font`.
- A different room calculation: `roomMode`, or replace `room`.
- A fixed line height: `lineHeight`.
- Sentences as separate spans: `sentenceRows`, with `sentenceRuns`.
- Headings and sections (phrase): `sections`, `headings`, `headingFallback`. Section fitting uses `prepareFull`,
  `overflows` and `fitFull`.
- A clear button and a status display: `clearSelection`, `bound`, `show`, `sync`.
- A different pane frame: `paneChrome`, `preparePane`, `fitPane`.
- A preview or a tip under the text: `paragraphsAfter` or `afterFit`.
- Selection through key or pointer release: `readKeyup`, `readPointerup`.
- Selection by dragging caret positions: `dragEndpoints`, with `selectionBound` and `dragSelection`.
- Triple-click on a paragraph: `tripleClick`, with `paragraphAt`.

Verify a change to the template as `templates/README.md` ("Changing a template") describes: golden snapshots of the
sites built on it before and after, the checker and the lint.
