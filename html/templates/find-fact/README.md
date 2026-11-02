# find-fact templates

Four templates, one per scenario. Each is a page in which the agent finds a fact in some content and gives the answer.

| Template | Scenario | What the agent works with |
| --- | --- | --- |
| `find-fact/table` | `table` | A source table and an answer form. |
| `find-fact/find-word` | `find-word` | A passage of text and an answer form. |
| `find-fact/phone-book` | `phone-book` | A contact book with search, sort, paging and linked properties. |
| `find-fact/similar` | `similar` | A grid of candidate words to tick, with a source-word briefing. |

With `design: {}`, each template draws the page of its first design: `design-find-fact-table-01`,
`design-find-fact-find-word-02`, `design-find-fact-phone-book-01` and `design-find-fact-similar-01`.
The header of each `.js` file lists every token and part. This file is a shorter guide.

## Rules for every template

- Parts are `(base, S) => replacement`. Call other parts through `S.P`, so a replaced part is used everywhere.
- `S.ctx`, `S.spec`, `S.view` and `S.frame` are live. `S.D` holds the resolved tokens and `S.P` the resolved parts.
- All episode state belongs to the factory. The `B` argument of the layout hooks is built per render and must never be
  kept as module state.
- Hooks run before the anchors are returned.
- A replaced part must keep the rng draws of the part it replaces, in the same order. Randomness for new decoration
  comes from its own named fork.
- A part that is a no-op by default can be filled in without touching anything else. Replace a part that draws or
  builds only when the design really differs there.
- The structural stylesheet (`rl-style`) keeps rules that a given template does not use. Site CSS may rely on its
  cascade.

## Tokens and parts shared by all four

| Token | Default | Effect |
| --- | --- | --- |
| `roomInset` | `[48, 48]` | Width and height subtracted from the stage to get the room the widget fits into. |

| Part | Result and default behavior |
| --- | --- |
| `style()` | Installs the `rl-style` stylesheet once. |
| `frame(ctx)` | Returns `{app, work, room}`: a full-stage frame that uses `roomInset`. |
| `card(util, parent, title, sub)` | Returns `{card, body}`: the card DOM. |
| `begin(ctx)` | Runs before the frame. No-op. |
| `framed(ctx, frame, up)` | Runs before the widget. No-op, except in `similar`. |
| `rendered(ctx, frame, up)` | Runs after the widget. No-op. |
| `build(ctx, work, up, room)` | Returns the view: the scenario's widget. |

## table

| Token | Default | Effect |
| --- | --- | --- |
| `emptyLabel` | `null` | Fallback label for answer fields that have none. |
| `multipleTitle` | `'Answer form'` | Title of the answer card when there are several fields. |
| `answerNote` | `true` | Samples the note of a single-field form. |
| `preserveNote` | `false` | Keeps `.ds-header-note` when the reply controls are dropped. |
| `recordHeader` | `null` | `['Field', 'Value']` adds a header row to record tables. |

| Part | Result and default behavior |
| --- | --- |
| `input(util, parent, role, placeholder)` | A text input with the original attributes. |
| `answerTitle(ctx, labels)` | The sampled single-field title, or `multipleTitle`. |
| `placeholder(ctx, label)` | A sampled placeholder for an unlabeled field. |
| `answerCard(ctx, card, body)` | Runs before the fields. No-op. |
| `answerForm(ctx, parent, labels, model, onEdit)` | Returns the controlled answer fields. |
| `dropAnswer(ctx, app)` | Removes the answer controls in reply mode. `preserveNote` keeps the header note. |
| `fits(el, room)` | True when the bounds fit the room. |
| `source(ctx, card, body)` | Runs before the source table. No-op. |
| `table(ctx, table, body)` | Runs before the source headers. No-op. |
| `answers(ctx, B)` | Arranges the answers before fitting. No-op. |
| `fit(ctx, B)` | The compact, narrow, grow and tight sequence that fits the layout. |
| `fitted(ctx, B)` | Runs after `fit`. No-op. |

`B` in these hooks is `{work, room, tc, body, t, form, fields, up}`. Reply mode is when the answer goes in the ending
message and the page shows no answer field.

## find-word

| Token | Default | Effect |
| --- | --- | --- |
| `emptyLabel`, `multipleTitle`, `answerNote`, `preserveNote` | as in `table` | Same meaning as in `table`. |
| `sampledFrame` | `false` | Uses the seeded app frame with a bar. The scenario preset sets it to `true`. |

| Part | Result and default behavior |
| --- | --- |
| `input`, `answerTitle`, `placeholder`, `answerCard`, `answerForm`, `dropAnswer`, `fits` | As in `table`. |
| `fullFrame(ctx)` | The full-stage frame with `roomInset`. Used when `sampledFrame` is false. |
| `sampledFrame(ctx)` | The seeded records frame with an app bar. Used when `sampledFrame` is true. |
| `usable(ctx)` | The stage box without the floating end control. |
| `readingTitle(ctx)` | The title picked with the rng. |
| `readingCard(ctx, card, body, work)` | Runs after the card class is set. No-op. |
| `paragraphs(ctx, card, body)` | The plain source paragraphs. |
| `counters(ctx, card, body)` | Word and character counters. No-op. |
| `answers(ctx, B)` | Runs after the form, before the fit. No-op. |
| `fit(ctx, B)` | The font-fit loop that tries 16, 15, 14 and 13 px. |
| `fitted(ctx, B)` | An extra layout fit after the loop. No-op. |

`B` is `{work, room, rc, body, fields, up}`.

## phone-book

| Token | Default | Effect |
| --- | --- | --- |
| `cards` | `true` | Allows the card layout, which takes an rng draw. The scenario preset sets `false`, so rows are used and that draw is skipped. |
| `searchIcon` | the magnifier SVG | Icon of the search box. |
| `headers` | `['Name', 'Phone', 'Email', 'Address']` | Column captions. |
| `widths` | `['24%', '20%', '30%', '26%']` | Column widths. |
| `props` | `['phone', 'email', 'address']` | Order of the linked properties. |
| `footClass` | `''` | Optional class of the footer. |
| `idleClass` | `''` | Suffix of the status class while nothing is picked, for example `' idle'`. |
| `hideIdle` | `false` | Hides the status with `display: none` until something is picked. |

| Part | Result and default behavior |
| --- | --- |
| `input(util, parent, role, placeholder)` | The text input. |
| `firstBox(el)` | The center of the first link's line box. |
| `link(ctx, parent, contact, index, prop, clicked)` | Returns the span of a contact action. |
| `headers(ctx, B, table)` | Draws the headers and widths. |
| `header(ctx, th, index)` | Decorates one header. No-op. |
| `cards(ctx, B, indices, picked, links)` | The contact-card layout. |
| `row(ctx, B, tr, contact, index, picked, links)` | One row: the name, then the properties. |
| `name(ctx, B, tr, contact, index, picked, links)` | The plain name cell. |
| `book(ctx, B)` | Runs before sizing. No-op. |
| `searchParent(ctx, B)` | The element that holds the search. Default: the body. |
| `searchInput(ctx, B, box, input)` | Runs before the search is bound. No-op. |
| `searchBound(ctx, B)` | Runs after binding; `B.searchField` exists. No-op. |
| `status(ctx, B)` | Runs before the undo control is created. No-op. |
| `results(ctx, B)` | Returns the result container. |
| `pager(ctx, B, buttons)` | Runs before the pager is bound. No-op. |
| `rowsRendered(ctx, B)` | Runs before the links are bound. No-op. |
| `picked(ctx, B, model, lastPick, wrong)` | Runs before the status text. No-op. |
| `footer(ctx, B, count)` | Runs after the count text. No-op. |
| `ready(ctx, B)` | Runs before the first paint; `B.paint` exists. No-op. |

`B` starts as `{work, room, bc, body, search, per, fam, up}`. The fields `searchField`, `status`, `statusText`,
`results`, `foot` and `paint` appear at the hooks above.

Two things to keep when the name cell changes. The name part calls `P.link` before the other properties, which keeps
the order of the links. The search is bound at a fixed point, so moving the input is done with `searchParent` and
`searchInput`, not by rebinding.

## similar

| Token | Default | Effect |
| --- | --- | --- |
| `briefSelector` | `null` | Selector of the frame element that receives the source-word briefing. The preset is `'.ds-brief'`. `null` shows no briefing. |
| `briefText` | `'Choose all words from the list on the right that are similar in meaning to the source words.'` | Briefing sentence. |
| `wordRows` | `null` | Column divisor for the candidate grid's `--word-rows`. |

| Part | Result and default behavior |
| --- | --- |
| `framed` | Calls `P.briefing(ctx)`. |
| `briefing(ctx)` | Draws the source-word briefing when `briefSelector` matches. |
| `wordCard(ctx, card, body, work)` | Runs after the minimum width is set. No-op. |
| `hint(ctx, card, body)` | Runs after the sampled hint. No-op. |
| `grid(ctx, card, body, grid)` | Runs before the options. No-op. |
| `option(ctx, grid, word, index)` | Returns the option label, with its parent and placement. |
| `marked(ctx, model)` | Runs after the selection classes. No-op. |
| `ready(ctx, B)` | Runs after the initial selection. No-op. |

`B` in `ready` is `{c, body, grid, labels, inputs, ch, mark, up}`.

## Common changes

- A different heading or card: `answerTitle`, `answerCard`, `source`, `readingCard`, `wordCard`.
- A Field and Value header on record tables: `recordHeader`.
- Fitting that depends on the design: `fit`, `fitted`, `rendered`. Keep the original rng draws.
- Another column order in the phone book: `props`, `headers`, `widths`. A name cell with an icon or a nested
  address: `name`.
- The search somewhere else: `searchParent`, `searchInput`, `searchBound`.
- A clear-selection action in `similar`: `ready` or `rendered`.
- Reply mode that moves the instruction: set `preserveNote` in `table` or `find-word`, and use `dropAnswer`.

Verify a change to these templates as `templates/README.md` ("Changing a template") describes: golden snapshots of
the sites built on them before and after, the checker and the lint.
