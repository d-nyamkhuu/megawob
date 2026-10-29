# set-date/calendar

A form card with one date, time or duration control. It is built from divs, placed at a sampled position in the stage
and sized from `ctx.size`. Month and weekday names, the first day of the week and the field formats follow
`spec.locale`.

| Scenario | The control |
| --- | --- |
| `calendar` | A field that opens a month grid. The header is arrows, a title that opens a year grid, or month and year menus. |
| `range` | A field that opens two months side by side. The first click sets the start and the second sets the end. |
| `typed` | A masked text input (digits only, separators inserted), or free text for long dates. |
| `time` | Spinners with an AM and PM switch, hour and minute columns, a masked `HH:MM` input, or a clock dial. |

The template also keeps the `duration` path (spinners, two number inputs, or preset chips).

The mechanics come from `env.ui` (`kit/ui/form.js`): the picker is an `env.ui.dropdown`, the month grid an
`env.ui.calendar`, and the spinners `env.ui.spinner`. Every callback goes through `env.taskDef.helpers.apply()`, so the
task's plan and the page agree. A press outside an open picker closes it. The card has a fixed size, which is the
anchor, and pickers overlay its lower part.

With `design: {}`, the scenarios draw `design-set-date-calendar-02`, `design-set-date-range-03`,
`design-set-date-time-01` and `design-set-date-typed-01`. The raw token defaults draw `design-set-date-typed-11`. The
header of `calendar.js` lists every token and part. This file is a shorter guide.

## Rules

- Parts are `(base, S) => replacement`. All calls go through `P`.
- `S` has live `ctxRef`, `spec`, `fam`, `card`, `control`, `pop`, `geo`, `paintFns`, `ui`, `L`, `D` and `P`. The
  `control`, `pop`, `geo` and `ui` values can be set. A design may keep private data on `S`.
- Per-page state is private to each factory. A reset replaces the episode state.
- No part builds DOM when the factory runs. A hook with no stated behavior does nothing.
- The random draws of `geometry` are in a fixed order. A replaced part keeps every draw.
- Setting `showOut`, `display` or `placeholder` skips the matching sampled draw. Setting `subtitle` does not: its
  draw is still made.
- Widget traits (for example `sceneRows`) stay in the widget registration of the site.
- The structural stylesheet is the same for every site. Sites own their look in `site.css`.

## Presets

| Scenario | Preset |
| --- | --- |
| `calendar` | `cardWidth: [380, 440]`, `randomAbove: true`, `notesLabel: 'Notes'`. |
| `range` | `cardWidth: 600`, `randomAbove: true`, `inlineRange: true`, `bothNav: true`, `openOnPick: true`, `rangeLayout: 'nested'`, `adjacentDays: true`, `trimWeeks: true`, `trimWithOutside: true`. |
| `time` | `title: 'Reservation Details'`, `timeSummary: true`, `fit: 'remaining'`. |
| `typed` | `title: 'Project Task'`, a description row, `Priority` and `Category` rows, and `typedReminder: true`. |

The raw defaults draw `typed-11`, which opts out of the `typed` preset's title, context, extra rows and reminder.

## Tokens

Look:

| Token | Default | Effect |
| --- | --- | --- |
| `css` | the template CSS | The structural stylesheet. |
| `calendarIcon`, `clockIcon` | built-in SVG | Icons of the field. |
| `left`, `right`, `up`, `down` | built-in SVG | Navigation and spinner markup. |
| `title` | `null` | `null` uses `spec.scene.title`. A string is the literal card title. |
| `subtitle` | `null` | `null` keeps the sampled subtitle. |
| `cardWidth` | `650` | Width cap in px, or `[min, max]` sampled with `rng.int` before the cell. |
| `randomAbove` | `false` | Samples the number of extras above a non-popup control, instead of `min(1, count)`. |
| `fieldClass` | `''` | Extra classes for scored field rows. |
| `notesLabel` | `'Notes (optional)'` | Caption of the filler notes. |
| `fit` | `null` | `'remaining'`: scale to the bottom of the stage. `'height'`: use the total stage height. `'stage'`: scale step by step with important transforms (minimum .6). |

Sampled formats. A string or boolean skips that rng draw:

| Token | Default | Effect |
| --- | --- | --- |
| `showOut` | `null` | `null` samples whether adjacent-month days show. |
| `display` | `null` | `null` samples the date display format. |
| `placeholder` | `null` | `null` samples the date placeholder. |

Calendar and range:

| Token | Default | Effect |
| --- | --- | --- |
| `trimWeeks` | `false` | Removes trailing weeks that have no day of the current month. |
| `trimWithOutside` | `false` | Trims even when `geo.showOut` is true. |
| `minWeeks` | `1` | Lower bound while trimming. |
| `weekCount` | `null` | `'box'`, `'grid'` or `'popup'` writes `--weeks` on that element. |
| `inlineRange` | `false` | Shows range calendars whatever `model.open` is. |
| `inlineBinding` | `null` | `null` uses the dropdown. `'none'`, `'click'` or `'button'` binds an inline field. |
| `bothNav` | `false` | Both arrows on both range months, instead of the outer arrows only. |
| `openInitial` | `false` | `positioned()` sets `model.open` before the first paint. |
| `openOnPick` | `false` | Calendar callbacks open the picker through `act(field)` before day and navigation actions. |
| `rangeLayout` | `null` | `'nested'` adds a separate end field. `null` uses one field. |
| `adjacentDays` | `false` | Binds adjacent days even when `geo.showOut` is false. |
| `splitCalendars` | `false` | Independent start and end calendar primitives, with target routing. |
| `calendarLabels` | `['calendar', 'end calendar']` | Log labels of the start and end primitives. |
| `endToggle` | `false` | Also binds the year toggle and year callbacks on the end calendar. |
| `daySide` | `false` | Each bound day gets `data-cal` set to start or end, for split calendars. |
| `splitFallback` | `'same'` | When the end view is missing, `'same'` uses the start view and `'next'` the following month. |

Time and typed:

| Token | Default | Effect |
| --- | --- | --- |
| `timeSummary` | `false` | Appends seeded scene facts and the live time to the site's summary. |
| `timeParts` | `null` | Optional `[hour, colon, minute, ampm, wrapper?]` span class names. A `null` colon leaves it out. The wrapper wraps the four segments. |
| `longText` | `false` | Long-form typed specs use unmasked text and `spec.longShown`. |
| `typedContext` | `null` | Optional `[label, text]` before the typed field. |
| `typedAux` | `null` | Optional `[[label, value], ...]` after the typed field. |
| `typedReminder` | `false` | Appends the unscored "Add a reminder" checkbox. |

## Parts

Helpers and rows:

| Part | Result and default behavior |
| --- | --- |
| `ensureStyle()` | Installs `css` once, as `fd-style`. |
| `act(target)` | Applies the task action, logs the pick, updates and paints. |
| `paint()` | Clears the calendar bindings, runs `paintFns`, syncs the dropdown, calls `painted`. |
| `content()` | `env.content`. |
| `fmtLocal(iso, style)` | A locale date formatter with a task fallback. |
| `word(key, english)` | A locale UI word with an English fallback. |
| `req(element, description)` | The center of a connected target. Throws otherwise. |
| `fieldLabel(label)` | The label, a space, then the required marker. |
| `fieldRow(parent, label, help, util)` | `{row, help}`: a required label and a detached help. A `null` help omits it. |
| `staticRow(parent, [label, value], util)` | An unscored label and value row. Calls `staticCreated`. |
| `staticCreated(parent, row, label, value, util)` | Runs after the static row children. |
| `clickControl(row, icon, util)` | The field div with its icon. |
| `extras(ctx)` | A copy of `spec.scene.extra`. |

Calendar grids:

| Part | Result and default behavior |
| --- | --- |
| `monthName(month)`, `monthSelectName(month)`, `monthTitle(year, month)` | Full, short and title names. |
| `monthBlock(parent, key, {prev, next, toggle, selects, menu, cal?}, util)` | `{box, y, m}`: a month header. |
| `weekday(index)` | The short locale weekday, without a trailing dot. |
| `weeks(cal, year, month, box, grid)` | `calendar.weeks` with the optional trim and count. |
| `blankDay(grid, day, util)` | Appends an empty cell for a hidden adjacent day. |
| `day(cell, iso, day, inMonth, side)` | Runs after the day is bound and classed. Optional `data-cal`. |
| `gridBuilt(box, grid, cal)` | Runs after all days. |
| `dayGrid(box, year, month, decorate, util, cal?, side?)` | The weekdays and bound days, with disabled and decorated days. |
| `bindInlineField(element)` | Binds according to `inlineBinding`. |
| `calendarAction(kind, value, side)` | Routes day and navigation callbacks, with the optional opening and split side. |

Popup and card sizing:

| Part | Result and default behavior |
| --- | --- |
| `placePop(util)` | Creates the picker and its dropdown or inline binding. |
| `sizePop(width, height)` | Aligns the picker below the field. Returns the card height it needs. |
| `needsNotes(spare)` | True when `spare > 96`. |
| `fitCard(height, util)` | Adds the optional notes and reserves a stable anchor height. |
| `popRoom(size)` | The picker height available inside the stage. |
| `geometry(ctx, extras, nAbove)` | `geo`: sampled dimensions and display. The draw order is fixed. |
| `initUI(ctx)` | Initializes the per-episode primitives and element tables. |

Calendar and range building, in order:

| Part | Result and default behavior |
| --- | --- |
| `calendarLabel(range)` | The combined labels, or the start label in the nested layout. |
| `calendarRow(ctx, range, row, help)` | Runs before the main control is built. |
| `calendarFields(ctx, range, row, txt)` | The nested end control and text, or `{}`. Passed to the hooks below. |
| `calendarHelp(ctx, range, row, help)` | Runs after the first rule and help text, before the extras. |
| `calendarExtras(ctx, range, row, help, txt, fields)` | Runs after the extras, before the popup is created. |
| `calendarPopup(ctx, range, row, help, txt, fields)` | Runs after the popup. The nested layout moves the help to the card. |
| `calendarSized(ctx, range, row, help, txt, fields)` | Runs after the picker and card are sized, before the main paint function. |
| `calendarPainting(ctx, model, range)` | Runs after the open class, before the readout. |
| `rangeReadout(ctx, model, txt, fields)` | Combined date spans, or separate spans for nested fields. |
| `calendarOpen(model, range)` | True for `model.open` or `inlineRange`. |
| `calendarOpened(ctx, model, range)` | Runs after the popup is cleared. Resets the popup `--weeks` if used. |
| `rangeMonths(ctx, model)` | Renders and decorates both range months. Routes split calendars when configured. |
| `buildCalendar(ctx, range)` | The whole calendar or range control, using the parts above. |

Time, duration and typed:

| Part | Result and default behavior |
| --- | --- |
| `timeReadout(txt, value, util, kind)` | The closed time text for `columns` and `clock`, with optional segmented spans. |
| `buildTimeColumns(ctx)`, `buildClock(ctx)`, `buildSpin(ctx)`, `buildDropdowns(ctx)`, `buildDuration(ctx)` | The widget builders. They use the shared field, sizing and text parts. |
| `textCreated(ctx, row, help, shown, unmasked)` | Runs after the input value, before the help is appended. |
| `textHelp(ctx, row, help, shown)` | Runs after the help, before the extras. |
| `buildText(ctx, mask, shown, helpText, unmasked = false)` | The masked or unmasked input and its model binding. |
| `typedBefore(ctx)`, `typedAfter(ctx)` | The optional context before the input, and the auxiliary rows and reminder after it. |
| `buildTyped(ctx)` | `typedBefore`, then `buildText`, then `typedAfter`. |

Lifecycle, in order:

| Part | Runs |
| --- | --- |
| `begin(ctx)` | After the state and `paintFns` are set up, before the extras and geometry. |
| `cardCreated(ctx)` | After the card width is set, before the title. |
| `heading(ctx, extras)` | After the title and subtitle, before the Today line. |
| `bodyStart(ctx, extras)` | After `geo.body = card`, before the extras above the control. |
| `buildControl(ctx)` | Dispatches to the builder of the scenario. |
| `built(ctx)` | After the widgets, before the sampled card placement. |
| `positioned(ctx)` | After placement. Optional initial open and time summary. |
| `painted(ctx)` | After every paint's dropdown sync. |
| `rendered(ctx)` | After the first paint. Optional stage fitting. |
| `locate(target)` | Returns the point of a field, calendar, time or duration target. It makes no DOM changes. |

## Common changes

- A different card title or width: `title`, `cardWidth`.
- Skipping a sampled format: `display`, `placeholder`, `showOut`. These skip their rng draws, so check that the
  episode still matches the design.
- Fewer calendar rows: `trimWeeks`, `minWeeks`, `weekCount`.
- A range with two separate fields or calendars: `rangeLayout`, `splitCalendars`, `calendarLabels`, `splitFallback`.
- A calendar that is always open: `inlineRange`, `inlineBinding`, `openInitial`.
- Segments for the time text: `timeParts`, or replace `timeReadout`.
- Extra context around the typed field: `typedContext`, `typedAux`, `typedReminder`.
- Scaling the card to the stage: `fit`.

Verify a change to the template as `templates/README.md` ("Changing a template") describes: golden snapshots of the
sites built on it before and after, the checker and the lint.
