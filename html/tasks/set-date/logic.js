/*
 * set-date: set a date, a time, a date range or a duration in a form control.
 * MiniWoB counterparts: choose-date (+ easy/medium), enter-date, enter-time. duration and the calendar /
 * range modes below have no MiniWoB counterpart; they cover date-picker mechanics common on real sites.
 *
 * Dates are pure day arithmetic (no Date objects, no clock): ISO 'YYYY-MM-DD' strings inside a fixed
 * epoch 2020-01-01 .. 2032-12-31; months are 'YYYY-MM' keys. A seeded spec.today stands in for "today" and
 * is shown on the page (the today cell, and a "Today: ..." line whenever the goal is relative to it).
 * Every episode has a locale (spec.locale, from env.content.LOCALES): the page shows month and weekday
 * names, the first day of the week (Monday-first for most European locales) and field formats in it; the
 * instruction stays English.
 *
 * scenarios
 *   calendar  a field opens a month grid. spec.header: 'arrows' (prev/next only), 'yearGrid' (the
 *             "Month YYYY" title opens a year grid) or 'selects' (month and year menus in the header).
 *             spec.todayBtn adds a "Today" button (selects today and closes; the oracle uses it as a
 *             shortcut when the target is near today and the view is far). spec.limit { min?, max? }
 *             disables days outside (e.g. past dates for appointments). The target is stated as "March 4,
 *             2027", "04/03/2027 (DD/MM/YYYY)", "the first Thursday after March 1, 2027", or relative to
 *             the shown today ("next Friday", "in 3 weeks", "the last day of next month", "yesterday")
 *             Widget traits (opts.traits, all optional): headers [..] limits spec.header (new value 'zoom': the
 *             title zooms days -> months -> years like Bootstrap's datepicker; picking a year opens its months,
 *             picking a month its days; the arrows page a year in the months view), todayBtn true|false,
 *             todayMode 'goto' (the Today button only jumps to today's month, jQuery-UI style; a Done button
 *             closes the picker without a pick), inline true (spec.inline: the calendar is always open, there
 *             is no field to click; picking a day keeps it open). Start mode 'scene': the picker open on the
 *             target's month with nothing selected (training keeps the navigation: scene is not in the default mix).
 *   Scene trait (any scenario): sceneRows n | [lo, hi] grows spec.scene.extra (the unscored label / value rows around
 *             the field) to n rows with seeded content that fits the scene ("Register a pet": Name, Species, Breed, Age,
 *             Sex, Shelter, Adoption fee, Adoption method; other scenes their own rows, then generic ones such as Email,
 *             Phone, Reference), never dropping a row the scene has. The draws are an own fork, so without the trait
 *             (and apart from these rows) the sample is unchanged. The rows are static: nothing in them is scored.
 *   typed     a masked text field in the locale's format (MM/DD/YYYY, DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY,
 *             YYYY/MM/DD, YYYY-MM-DD; the placeholder may use local letters such as TT.MM.JJJJ); the
 *             instruction uses another format or a phrase relative to the shown today. Widget trait typedFormat
 *             'long' | 'longDay' | 'either' (spec.longForm, spec.longShown): free text in "March 5, 2024" /
 *             "Tuesday, March 5, 2024" instead of the mask; parseLong accepts month names in full or abbreviated,
 *             an optional matching weekday, optional ordinal suffix and commas, and the instruction asks in another form
 *   time      spec.control: 'spin' (hour / minute spinners, 5-minute steps, AM | PM; spec.keys = the
 *             oracle focuses a value and uses ArrowUp / ArrowDown), 'columns' (hour / minute / AM-PM
 *             columns in a popup), 'text24' (masked HH:MM, any minute) or 'clock' (a clock-face popup: pick
 *             the hour on the dial, then the minute; AM / PM buttons; the "07:45" header switches dials).
 *             Times are asked as "7:45 PM", "19:45" or in words ("quarter to eight in the evening", "noon").
 *             Widget trait timeControls [..] limits spec.control to those (default spin, columns, text24, clock) and
 *             accepts 'dropdowns': three independent hour / minute (5-minute steps) / AM-PM dropdowns, each its own
 *             list, unset at first. Start mode 'scene': columns open with nothing chosen, dropdowns all unset
 *   segmented a date field made of separate day / month / year segments in the locale's order (like a native
 *             date input): click a segment and type its digits (two for day and month, four for the year; a full
 *             segment moves on to the next), or press ArrowUp / ArrowDown on the focused segment, or click the
 *             field's up / down spinner buttons (they act on the focused segment). All wrap around (month 1-12,
 *             day 1-days in month, year 2020-2032); an empty segment first becomes today's value. spec.how:
 *             'type' | 'keys' | 'spin' is how the oracle fills it (keys and spin use steps when a segment is at
 *             most 10 steps off, else they type). Asked like the typed scenario
 *   range     a two-month range calendar: first click start, second click end (an earlier click restarts).
 *             spec.rule: 'plain', 'booked' (spec.booked days are disabled and a range cannot span one:
 *             while choosing the end, days after the first booked day are disabled) or 'minmax' (minimum /
 *             maximum nights shown on the page; ends outside are disabled). Asks: explicit dates, "for N
 *             nights", relative to today, "the earliest N-night stay on or after X with no booked dates",
 *             "the shortest / longest stay allowed". A share of ranges crosses a year boundary. 'wrong'
 *             starts hold an end before the start (shown as an error) to correct. Widget traits: inline true
 *             (spec.inline: always open, no field click; picks keep it open) and splitCals true (spec.splitCals:
 *             independent start and end calendars, one month each, that may show the same month; each has its
 *             own arrows (nav { cal }), the start calendar sets the start, the end calendar the end, a later start
 *             clears an end that is not after it). Start mode 'scene': open on the target start month (both
 *             calendars with splitCals), nothing selected
 *   month     a month picker (card expiry, report month): the field opens a panel with the year and arrows (the
 *             arrows page a year) and a 4 x 3 grid of month names; one click on a month picks it and closes the
 *             panel. Asked as "September 2027", "09/2027", "2027-09" or relative to the shown today ("next month",
 *             "three months ago"). spec.target is the month key 'YYYY-MM'; model { value: 'YYYY-MM' | '', open, view:
 *             'YYYY-MM' (its year is shown) }; plan { nav }, { pickMonth: 1..12 }. error |months off|.
 *   week      a week picker (timesheet, meal plan): a one-month grid where a click on any day picks its whole
 *             week (the week starts on the locale's first weekday, spec.weekStart); the picked week is
 *             highlighted. Asked as "the week containing March 4, 2027" or relative to the shown today ("next
 *             week", "two weeks ago"). spec.target is the first day of the week (ISO), spec.anchor a day of it
 *             to click; model { value: first day of the picked week | '', open, view: 'YYYY-MM' }; plan { nav },
 *             { day: anchor }. error |days off| (multiples of 7).
 *             month and week are new scenarios: they are mixed in by their own fork (rng.fork('widget')), so
 *             the seeds of the older scenarios are unchanged.
 *   duration  spec.control: 'spin' (hours and minutes spinners), 'fields' (two number fields, typed) or
 *             'presets' (preset chips plus -/+ step buttons); asked as "1 h 25 min", "85 minutes", "an hour
 *             and a half", "1.5 hours", "1:25" ...
 *
 * spec   { scenario, scene: { title, label, label2?, extra[[k, v]], dir }, ask, askKind, today, locale,
 *          weekStart, isplit, csplit, ood, startMode,
 *          calendar: start ('YYYY-MM'), header, todayBtn, todayMode, inline, limit { min?, max? }, target ISO
 *          typed: mask (internal letters Y M D), maskShown (placeholder), target ISO, showToday
 *          segmented: as typed, plus how, segs [{ k: 'y'|'m'|'d', ph, w } | { sep }] (the field's layout)
 *          time: control, step, keys, target (minutes since midnight)
 *          typed (long form): longForm 'long' | 'longDay', longShown (placeholder text)
 *          range: start, rule, booked [ISO], minN, maxN, inline?, splitCals?, target { start, end }
 *          duration: control, step (spin/presets), presets [min], target (minutes) }
 * model  calendar  { value: ISO | '', open, view: 'YYYY-MM', years: bool, menu: '' | 'month' | 'year',
 *                  zoom: 'days' | 'months' | 'years' (header 'zoom' only) }
 *        typed     { text }
 *        segmented { y, m, d (the digits typed in each segment), focus: '' | 'y' | 'm' | 'd' }
 *        time      spin { value, focus: '' | 'hour' | 'minute' }   columns { value | null, open }
 *                  dropdowns { h: 1..12 | null, m: 0..55 | null, ap: 'AM' | 'PM' | null, open: '' | 'hour' | 'minute' | 'ampm' }
 *                  text24 { text }   clock { value, open, stage: 'hour' | 'minute' }
 *        range     { start: ISO | '', end: ISO | '', open, view: 'YYYY-MM' (left month), view2? (splitCals: the end calendar's month) }
 *        duration  spin / presets { value }   fields { h: text, m: text }
 *        open/view/years/menu/stage/focus are UI state: not scored, but plan() needs them.
 * error  |days off| (range: sum over both ends; an end cleared by picking a new start keeps the error of the end it had,
 *        at least 1, in the unscored model.endWas), |minutes off| for typed and field durations. Spinner controls score
 *        steps left, per field and wrap-aware, in the same units: time 60 per hour on the 12-hour dial + 1 per minute
 *        on the hour + 720 for AM / PM (every control); duration spinners 60 per hour + 1 per minute on the hour;
 *        segmented 1 per day on the month + 30 per month on the year + 365 per year on the YEAR0-YEAR1 wheel. An
 *        empty or unparseable field counts as maximally wrong (MAX_DAYS per date, MAX_MIN; segmented: per segment).
 *        tau 0;
 *        sigma 3 days (range 4), 10 minutes.
 * levels (opts.level easy | medium; normal is unchanged; spec.level records it): calendar the target in the shown
 *        month (easy) / within a month of it (medium), plain "March 4, 2027" style asks only (easy) and no limit;
 *        typed / segmented an ask in the field's own format and no relative phrases (easy) / no relative phrases
 *        (medium); time on the half hour (easy) / quarter hour (medium), plain 12-hour asks (24-hour for the typed
 *        field); range a plain rule, no year change, at most 5 / 10 nights near the shown month, no "N nights" ask
 *        on easy; duration (easy) preset chips only, multiples of 15 minutes, "1 h 25 min" style asks; month and
 *        week the target in the shown year / month (easy) or one step away (medium).
 * start modes: off, partial (right month but wrong day / right day-month but wrong year / hour right,
 *        minutes wrong / range start set / hours right), wrong (day and month swapped, AM-PM flipped, an
 *        end before the start, a decimal-hours misreading), solved, scene (see the scenarios; the scenarios without a
 *        scene read it as off). No early endings, so no recoverable mode.
 *
 * judge modes (judgeModes; opts.judge; spec.judge = { mode, message, ask, askKind, ... }; built from its own fork after the
 *   sample is complete, so nothing else changes and no rng is drawn while opts.judge is off). ambiguous / impossible start on
 *   the solved control and the instruction is the usual wording with spec.judge.ask in place of the goal:
 *   ambiguous   a numeric date that reads both ways ("04/05/2027": April 5 or May 4; calendar, range start, month, week),
 *               a weekday that does not match its date (typed, segmented), "7:30" without AM / PM (time), "1.30 hours"
 *               as 1 h 18 min or 1 h 30 min (duration); the reply asks (status ask) with one option per reading (spec.judge.cands: the
 *               reading's date or time in the usual spellings, never the numeric text the instruction gives)
 *   impossible  a day the month does not have (February 30, 29 in a common year, April 31: calendar, typed, segmented, week), a
 *               calendar day outside spec.limit, 13/2027 (month), "7:75 PM" / "25:30" (time), a range that spans a booked day,
 *               exceeds the maximum stay or ends before it starts, a negative duration; status impossible, whose what names the
 *               value (spec.judge.what: the ask as written, its bare form, the dates involved)
 *   confirm     the normal task plus "but check with me before you submit" (the kit's end control is the final step, whose
 *               ending the kit caps; no widget flag is needed)
 *
 * optional hooks (contract the html/kit/env.js header; pure, no DOM; called only by their knobs):
 *   parts(model, spec)            preempt=cancel: the control by its label (a range: both ends) with its value
 *   facts(model, spec)            the value as the page shows it in the locale (aliases: other styles and the ISO date) plus
 *                                 one derived fact: weekday (date scenarios), length of stay (range), part of the day (time),
 *                                 total minutes (duration), days in the month (month), the week's first weekday (week)
 *   silent(next, prev, spec, rng) a just-correct value is off though the page shows it picked: a date a day earlier or later
 *                                 or with day and month swapped, a range end or start a day off (never over a booked day or
 *                                 outside min / max nights), a month or week next door, a time with AM / PM flipped or one step
 *                                 off, a duration rounded to 15 minutes or one step off
 *   retarget(spec, model, rng)    a new goal in the same control: another date near the old one (calendar: an enabled day),
 *                                 another range that avoids booked days and respects min / max nights, another month, week,
 *                                 time or duration, with the matching ask; null for judge episodes
 *
 * Click semantics live in model.js (apply), shared by widgets and selftest.js:
 *   apply(model, spec, target) -> model for a click on a plan target (or a key on a focused spinner:
 *   { key, field }); widgets call it from their handlers. disabled(spec, model, iso) -> bool for day cells.
 *   maskText(raw, mask) -> the masked field text a widget shows after an input event (typed / text24); a typed
 *   field with spec.longForm takes the raw text instead (valueOf parses it with parseLong(text) -> ISO | null).
 *   disabled(spec, model, iso, cal?): splitCals widgets pass cal 'start' | 'end' for the calendar a cell belongs to.
 * Helpers (widget API, env.taskDef.helpers):
 *   days(iso): ISO date to day count
 *   fromDays(n): day count to ISO date
 *   weekday(iso): weekday index (Sunday = 0)
 *   monthKey(y, m): year and month to YYYY-MM
 *   addMonths(key, n): shift a month key
 *   fmtDate(iso, style): format an ISO date
 *   fmt12(min, dotted?): format 12-hour time
 *   fmtDur(min): format a duration
 *   maskText(raw, mask): apply a field mask
 *   apply(model, spec, target): apply a control target
 *   disabled(spec, model, iso, cal?): whether a calendar cell is disabled
 *   loc(spec): locale record
 *   YEARS: picker years
 *   MASK24: 24-hour input mask
 *   WEEKDAYS: English weekday names
 *   MONTHS: English month names
 *   parts12(min): hour, minute and AM/PM parts
 *
 * Modules: data.js (dates/formats), scenes.js (content and asks), model.js (control mechanics/scoring),
 *   scenarios/*.js (sampling), oracle.js (starts/plan/solve), instructions.js, judge.js and reporting.js.
 * Tests live in selftest.js and load only through kit/selftest.js.
 *
 * plan targets (all are clicks except the typed fields and spinner keys):
 *   { field: 'main' }                    the date/time field (opens or closes a picker; typing target)
 *   { nav: 'prev' | 'next' }             month arrows (splitCals: plus cal: 'start' | 'end')
 *   { yearToggle: true }                 the "Month YYYY" header (header 'yearGrid'; 'zoom': one level up)
 *   { todayGoto: true }                  the Today button of todayMode 'goto' (shows today's month, picks nothing)
 *   { done: true }                       a Done button (closes the picker; not planned)
 *   { seg: 'y' | 'm' | 'd' }             a date segment (focuses it; typing target { type: [{ seg }, digits] })
 *   { segSpin: 'up' | 'down' }           the segmented field's spinner buttons (step the focused segment)
 *   { year: 2027 }                       a cell of the year grid ('zoom': opens that year's months)
 *   { menu: 'month' | 'year' }           header menus (header 'selects'); { pickMonth: 1..12 }, { pickYear: y }
 *                                        ('zoom': pickMonth is a cell of the months view)
 *   { todayBtn: true }                   the Today button
 *   { day: ISO }                         the in-month cell of that date in a shown month
 *                                        (splitCals: { day, cal: 'start' | 'end' }, the cell in that calendar)
 *   { spin: 'hour' | 'minute', dir: 'up' | 'down' }   spinner arrows (time/spin)
 *   { spinField: 'hour' | 'minute' }     a spinner's value (focus it for the keyboard route)
 *   { ampm: 'AM' | 'PM' }                AM | PM switch (time/spin, time/clock)
 *   { col: 'hour' | 'minute' | 'ampm', value }        a cell in the time columns (time/columns), or in the open
 *                                        list of that dropdown (time/dropdowns: also closes it)
 *   { dd: 'hour' | 'minute' | 'ampm' }   a dropdown's trigger (time/dropdowns; opens that list, closing another)
 *   { face: 'hour' | 'minute', value }   a number on the clock dial; { faceMode: 'hour' | 'minute' } header
 *   { dur: 'hours' | 'minutes', dir }    duration spinner arrows; { durField: 'hours' | 'minutes' } fields
 *   { preset: minutes }, { stepBtn: 'up' | 'down' }   duration presets and -/+ buttons
 *   { outside: true }                    a click elsewhere on the stage (closes a picker; not planned)
 * plan steps: { click: target }, { type: [{ field: 'main' | durField | seg }, text] }, { key: 'ArrowUp' | 'ArrowDown' }
 *
 * opts.route ('keyboard' | 'pointer' | 'wheel' | undefined = own mix): time/spin spec.keys (ArrowUp / ArrowDown on a
 *   focused value) is forced true on 'keyboard' and false on 'pointer'; segmented spec.how becomes type | keys
 *   on 'keyboard' and spin on 'pointer'. Other scenarios have no such route and ignore it.
 */
(function () {
  'use strict';
  const lib = {};
  env.task({
    name: 'set-date',
    scenarios: ['calendar', 'typed', 'segmented', 'time', 'range', 'duration', 'month', 'week'],
    startModes: ['off', 'partial', 'wrong', 'solved', 'scene'],
    inputs: ['pointer', 'keyboard'],

    files: ['data.js', 'scenes.js', 'model.js', 'oracle.js', 'instructions.js', 'judge.js', 'reporting.js',
      'scenarios/calendar.js', 'scenarios/typed.js', 'scenarios/segmented.js', 'scenarios/time.js',
      'scenarios/range.js', 'scenarios/duration.js', 'scenarios/month.js', 'scenarios/week.js'],
    lib,
    helpers: {},

    sample(rng, opts) {
      // month and week are newer: mixed in through their own fork so the older scenarios keep their seeds.
      const older = opts.scenarios.filter((x) => x !== 'month' && x !== 'week');
      let scenario = opts.scenario || (older.length ? rng.pick(older) : rng.pick(opts.scenarios));
      if (!opts.scenario && older.length && older.length < opts.scenarios.length) {
        const w = rng.fork('widget');
        if (w.bool(0.12)) scenario = w.pick(opts.scenarios.filter((x) => x === 'month' || x === 'week'));
      }
      for (let t = 0; t < 40; t++) {
        const r = rng.fork(`try${t}`);
        const spec = { scenario, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood, startMode: opts.startMode || 'off' };
        if (opts.level === 'easy' || opts.level === 'medium') spec.level = opts.level;
        spec.locale = lib.pickLocale(r.fork('locale'), spec);
        spec.weekStart = lib.loc(spec).firstDayOfWeek || 0;
        const sampleScenario = env.scenariosOf('set-date')[scenario] || env.scenariosOf('set-date').duration;
        const out = sampleScenario.sample(r, spec, opts);
        if (out) {
          if (opts.traits && opts.traits.sceneRows) lib.addSceneRows(r.fork('sceneRows'), spec, out.scene, opts.traits.sceneRows);
          // Judge episodes: built last from their own fork (nothing is drawn while the knob is off).
          if (lib.JUDGE_MODES.includes(opts.judge)) out.judge = lib.judgeOf(rng.fork('judge'), out, opts.judge);
          return out;
        }
      }
      throw new Error(`set-date: could not sample ${scenario}`);
    },

    // ambiguous / impossible: the page starts as it should stay (the sampled goal already set).
    init(spec, rng) {
      const m = lib.initModel(spec, rng);
      return spec.judge && spec.judge.mode !== 'confirm' ? lib.solveOf(spec, m) : m;
    },
    error(model, spec) { return lib.errorOf(model, spec); },
    judgeModes: ['ambiguous', 'impossible', 'confirm'],
    facts(model, spec) { return lib.facts(model, spec); },
    parts(model, spec) { return lib.parts(model, spec); },
    silent(next, prev, spec, rng) { return lib.silent(next, prev, spec, rng); },
    retarget(spec, model, rng) { return lib.retarget(spec, model, rng); },

    tolerance(spec) {
      if (spec.scenario === 'time' || spec.scenario === 'duration') return { tau: 0, sigma: 10 };
      return { tau: 0, sigma: spec.scenario === 'range' ? 4 : spec.scenario === 'week' ? 7 : 3 };
    },

    instruction(spec, rng) { return lib.instructionOf(spec, rng); },
    plan(model, spec) { return lib.planOf(model, spec); },
    solve(spec, model) { return lib.solveOf(spec, model); },

  });
})();
