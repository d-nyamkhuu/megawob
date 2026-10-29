/*
 * templates / set-date / calendar: a form card with one date, time or duration control, built from divs,
 * placed at a sampled position inside the stage and sized from ctx.size. Month and weekday names, the
 * first day of the week and the field formats follow spec.locale (env.content.LOCALES).
 *   calendar  a field that opens a month grid. Header per spec.header: prev/next arrows; a "Month YYYY"
 *             title that opens a year grid; or month and year menus (grids over the days). Optional Today
 *             button in a footer. Disabled days (spec.limit) are struck through and inert. Adjacent-month
 *             days are shown muted and clickable on some seeds. A "Today: ..." line shows spec.today.
 *   range     a field that opens two months side by side; first click start, second click end. Booked
 *             days and (while choosing the end) days outside the min/max nights or past the next booked
 *             day are disabled. An end before the start shows a validation error under the field.
 *   typed     a masked text input (digits only, separators inserted), placeholder = spec.maskShown.
 *   time      spin: hour / minute spinners (the values take focus and ArrowUp / ArrowDown) and an AM | PM
 *             switch; columns: a popup with hour / minute / AM-PM columns; text24: a masked HH:MM input;
 *             clock: a popup with a clock dial (hours, then minutes), an "07:45" header whose parts switch
 *             the dial, and AM / PM buttons.
 *   duration  spin: hours and minutes spinners; fields: two number inputs; presets: preset chips, a readout
 *             and -/+ step buttons.
 * Mechanics come from env.ui (kit/ui/form.js): the picker field + popup is an env.ui.dropdown, the month
 * grid an env.ui.calendar (fed the task's own day arithmetic), spinners env.ui.spinner and the AM | PM
 * switch / time columns env.ui.choices. Every callback goes through env.taskDef.helpers.apply(), so the logic's
 * plan and the page agree exactly. A press outside an open picker closes it. The card has a fixed size (the
 * anchor); pickers overlay the lower part of the card, never the page.
 *
 * L1 medoid: design-set-date-typed-11. Unpreset TOKENS/BASE reproduce it, retaining every render RNG draw.
 * Presets (one declared scenario): calendar -> design-set-date-calendar-02 (including its sceneRows: 8 trait),
 * range -> design-set-date-range-03, time -> design-set-date-time-01, typed -> design-set-date-typed-01.
 * Those four sites use design: {}. The medoid opts out of the typed preset's title/context/aux/reminder.
 * The five live medoid paths above remain supported; dropdowns additionally serves time-07.
 * Wrappers only renamed registrations; their effective identity/traits remain in each design file.
 * See README.md beside this template for all 48 members' variation points and recurrence counts.
 *
 * Tokens (defaults below; a scenario preset and then the design replace whole values):
 *   css = CSS                         structural stylesheet; sites still own their site.css
 *   calendarIcon = ICON_CAL            field calendar SVG
 *   clockIcon = ICON_CLOCK             field clock SVG
 *   left/right/up/down = LEFT/RIGHT/UP/DOWN   navigation and spinner SVG markup
 *   title = null                       null uses spec.scene.title; otherwise literal card title
 *   subtitle = null                    null keeps sampled subtitle; overriding it still consumes that draw
 *   cardWidth = 650                     width cap in px, or [min, max] sampled with rng.int before cell
 *   randomAbove = false                sample non-popup extras-above count instead of taking min(1, count)
 *   showOut = null                     null samples calendar adjacent days; boolean skips that RNG draw
 *   display = null                     null samples date display format; a string skips that draw
 *   placeholder = null                 null samples date placeholder; a string skips that draw
 *   fieldClass = ''                    extra classes for scored field rows
 *   notesLabel = 'Notes (optional)'     automatic filler notes caption
 *   trimWeeks = false                  remove trailing weeks containing no current-month days
 *   trimWithOutside = false            trim even when geo.showOut is true
 *   minWeeks = 1                       lower bound while trimming trailing weeks
 *   weekCount = null                   'box'/'grid'/'popup' writes --weeks on that element
 *   inlineRange = false                display range calendars regardless of model.open
 *   inlineBinding = null               null uses dropdown; 'none'/'click'/'button' binds an inline field
 *   bothNav = false                    both arrows on both range months, instead of outer arrows only
 *   openInitial = false                positioned() sets model.open before the first paint
 *   openOnPick = false                 calendar callbacks open via act(field) before day/nav actions
 *   rangeLayout = null                 'nested' adds range-03's separate end field; null uses one field
 *   adjacentDays = false               bind adjacent days even when geo.showOut is false
 *   splitCalendars = false             independent start/end calendar primitives and target routing
 *   calendarLabels = ['calendar', 'end calendar']   primitive log labels for start/end
 *   endToggle = false                  also bind year-toggle/year callbacks on the end calendar
 *   daySide = false                    each bound day gets data-cal = start/end for split calendars
 *   splitFallback = 'same'             missing end view uses start view ('next' uses following month)
 *   timeSummary = false                append seeded scene facts and live time to the site's summary
 *   timeParts = null                   optional [hour, colon, minute, ampm, wrapper?] span class names;
 *                                      null colon omits it, wrapper wraps the four time segments
 *   fit = null                         'remaining' scales to stage bottom; 'height' uses total stage height;
 *                                      'stage' iteratively scales with important transforms (min .6)
 *   longText = false                   typed long-form specs use unmasked text and spec.longShown
 *   typedContext = null                optional [label, text] before the typed field
 *   typedAux = null                    optional [[label, value], ...] after the typed field
 *   typedReminder = false              append the unscored Add a reminder checkbox
 *
 * VARIANTS: calendar samples width [380,440]/extras above and labels filler Notes; range caps width at 600,
 * samples extras above, trims empty weeks, shows adjacent days, uses nested separate fields, inline months
 * with both arrows and opens on calendar callbacks; time sets Reservation Details, summary and remaining
 * scale; typed sets Project Task, Description, Priority/Category and reminder. No extra random draws are
 * introduced: these presets follow their named originals, including deliberate skipped draws in designs.
 *
 * Parts are (base, S) => replacement; all calls use P. S has live getters ctxRef, spec, fam, card, control,
 * pop, geo, paintFns, ui, L, D and P; control/pop/geo/ui have setters. Designs may keep private data on S.
 * No part factory builds DOM. Hooks with no stated behavior do nothing and return undefined.
 *   ensureStyle()                     install D.css once as fd-style
 *   act(target)                       apply task action, log pick, update and paint
 *   paint()                           clear calendar bindings, run paintFns, sync dropdown, call painted
 *   content() -> bank                  env.content
 *   fmtLocal(iso, style) -> string     locale date formatter with task fallback
 *   word(key, english) -> string       locale UI word with English fallback
 *   req(element, description) -> point connected target center, otherwise throw
 *   fieldLabel(label) -> string        label + space before required marker
 *   fieldRow(parent, label, help, util) -> {row, help}  required label and detached help (null omits help)
 *   staticRow(parent, [label,value], util) -> row       unscored label/value row; calls staticCreated
 *   staticCreated(parent, row, label, value, util)     after static row children
 *   clickControl(row, icon, util) -> element           field div with icon
 *   monthName(month), monthSelectName(month), monthTitle(year, month) -> string   full/short/title names
 *   monthBlock(parent, key, {prev,next,toggle,selects,menu,cal?}, util) -> {box,y,m} month header
 *   weekday(index) -> string           locale short weekday, trailing dot removed
 *   weeks(cal, year, month, box, grid) -> weeks        calendar.weeks with optional trim/count
 *   blankDay(grid, day, util)          append an empty cell for a hidden adjacent day
 *   day(cell, iso, day, inMonth, side)  after day binding/classes; optional data-cal
 *   gridBuilt(box, grid, cal)          after all days
 *   dayGrid(box, year, month, decorate, util, cal?, side?)  weekdays and bound days, disabled/decorated
 *   bindInlineField(element)          bind according to inlineBinding
 *   placePop(util)                    create picker and its dropdown/inline binding
 *   sizePop(width, height) -> height   align below field; return required card height
 *   needsNotes(spare) -> boolean       spare > 96
 *   fitCard(height, util)              add optional notes, reserve stable anchor height
 *   popRoom(size) -> height            available picker height inside stage
 *   calendarLabel(range) -> string     combined labels, or nested-layout start label
 *   calendarRow(ctx, range, row, help)  before building main control
 *   calendarFields(ctx, range, row, txt) -> fields     nested end control/text or {}; passed to hooks below
 *   calendarHelp(ctx, range, row, help) after initial rule/help text, before extras
 *   calendarExtras(ctx, range, row, help, txt, fields)  after extras, before popup creation
 *   calendarPopup(ctx, range, row, help, txt, fields)   after popup; nested layout moves help to card
 *   calendarSized(ctx, range, row, help, txt, fields)   after picker/card sizing, before main paintFn
 *   calendarPainting(ctx, model, range)                after main control open class, before readout
 *   rangeReadout(ctx, model, txt, fields)              combined date spans or separate nested-field spans
 *   calendarOpen(model, range) -> boolean              model.open or inlineRange
 *   calendarOpened(ctx, model, range)                 after popup cleared; resets popup --weeks if used
 *   rangeMonths(ctx, model)            render/decorate both range months; split routing when configured
 *   buildCalendar(ctx, range)          complete calendar/range control, using the parts above
 *   timeReadout(txt, value, util, kind) closed time text (kind columns/clock); optional segmented spans
 *   buildTimeColumns(ctx), buildClock(ctx), buildSpin(ctx), buildDropdowns(ctx), buildDuration(ctx)
 *                                      widget builders; use shared field, sizing and text parts
 *   textCreated(ctx, row, help, shown, unmasked)        after input value, before help appended
 *   textHelp(ctx, row, help, shown)     after help appended, before extras
 *   buildText(ctx, mask, shown, helpText, unmasked=false)  masked/unmasked input and model binding
 *   typedBefore(ctx), typedAfter(ctx)  optional context before input / auxiliary rows and reminder after
 *   buildTyped(ctx)                    typedBefore -> buildText -> typedAfter
 *   extras(ctx) -> pairs               copy of spec.scene.extra
 *   geometry(ctx, extras, nAbove) -> geo               sampled dimensions/display (RNG order is contractual)
 *   initUI(ctx)                        initialize per-episode primitives and element tables
 *   calendarAction(kind, value, side)  day/nav callback routing, optional opening and split side
 *   begin(ctx)                         after state/paintFns initialized, before extras/geometry
 *   cardCreated(ctx)                   after main card width, before title
 *   heading(ctx, extras)               after title/subtitle, before Today line
 *   bodyStart(ctx, extras)             after geo.body = card, before extras above control
 *   buildControl(ctx)                  dispatch scenario/control to its widget builder
 *   built(ctx)                         after widgets, before sampled card placement
 *   positioned(ctx)                    after placement; optional initial open and time summary
 *   painted(ctx)                       after every paint's dropdown sync
 *   rendered(ctx)                      after first paint; optional stage fitting
 *   locate(target) -> point            field/calendar/time/duration model targets; no DOM mutations
 */
(function () {
  'use strict';

  const ICON_CAL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
  const ICON_CLOCK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  const CHEV = (d) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  const LEFT = CHEV('M15 5l-7 7 7 7');
  const RIGHT = CHEV('M9 5l7 7-7 7');
  const UP = CHEV('M5 15l7-7 7 7');
  const DOWN = CHEV('M5 9l7 7 7-7');
  const SUBS = ['Fields marked * are required.', 'Review the details before you continue.', 'Changes are saved when you finish.', 'All times are local.'];

  const SCENARIOS = {
    calendar: { cardWidth: [380, 440], randomAbove: true, notesLabel: 'Notes' },
    range: { cardWidth: 600, randomAbove: true, inlineRange: true, bothNav: true, openOnPick: true,
      rangeLayout: 'nested', adjacentDays: true, trimWeeks: true, trimWithOutside: true },
    time: { title: 'Reservation Details', timeSummary: true, fit: 'remaining' },
    typed: { title: 'Project Task', typedContext: ['Description', 'Compile key findings and prepare the final report.'],
      typedAux: [['Priority', 'Medium'], ['Category', 'Work']], typedReminder: true },
  };

  env.template('set-date/calendar', (design, def) => {
    const CSS = env.templateLib('set-date/_styles').calendar;
    const TOKENS = {
      css: CSS, calendarIcon: ICON_CAL, clockIcon: ICON_CLOCK, left: LEFT, right: RIGHT, up: UP, down: DOWN,
      title: null, subtitle: null, cardWidth: 650, randomAbove: false,
      showOut: null, display: null, placeholder: null, fieldClass: '', notesLabel: 'Notes (optional)',
      trimWeeks: false, trimWithOutside: false, minWeeks: 1, weekCount: null,
      inlineRange: false, inlineBinding: null, bothNav: false, openInitial: false, openOnPick: false,
      rangeLayout: null, adjacentDays: false, splitCalendars: false, calendarLabels: ['calendar', 'end calendar'],
      endToggle: false, daySide: false, splitFallback: 'same',
      timeSummary: false, timeParts: null, fit: null, longText: false,
      typedContext: null, typedAux: null, typedReminder: false,
    };

    let ctxRef;
    let spec;
    let fam;
    let card;
    let control;
    let pop;
    let geo;
    let paintFns;
    let ui; // env.ui widgets of the live episode: { dd, cal, spin: {}, ampm, cols: {}, dur: {}, el: {} }
    let L; // locale record

    let D, P;
    const BASE = {};
    const S = {
      get ctxRef() { return ctxRef; },
      get spec() { return spec; },
      get fam() { return fam; },
      get card() { return card; },
      get control() { return control; },
      set control(value) { control = value; },
      get pop() { return pop; },
      set pop(value) { pop = value; },
      get geo() { return geo; },
      set geo(value) { geo = value; },
      get paintFns() { return paintFns; },
      get ui() { return ui; },
      set ui(value) { ui = value; },
      get L() { return L; },
      get D() { return D; },
      get P() { return P; },
    };

    // ---- building blocks

    // One month: header (title or selects, optional arrows) + weekday row + 6x7 grid.

    // Popup geometry: below the control, left-aligned with it; card tall enough to contain it.

    // ---- scenarios

    Object.assign(BASE, env.templateLib('set-date/_calendar-parts').parts(S));
    ({ D, P } = env.templateDesign('set-date/calendar', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));

    return {
      render(ctx) {
        P.ensureStyle();
        const { util, rng, size } = ctx;
        ctxRef = ctx;
        spec = ctx.spec;
        fam = env.taskOf('set-date');
        L = fam.helpers.loc(spec);
        paintFns = [];
        P.begin(ctx);
        const extras = P.extras(ctx);
        const popup = spec.scenario === 'calendar' || spec.scenario === 'range' || (spec.scenario === 'time' && (spec.control === 'columns' || spec.control === 'clock'));
        const nAbove = popup ? 0 : D.randomAbove ? rng.int(0, Math.min(1, extras.length)) : Math.min(1, extras.length);
        geo = P.geometry(ctx, extras, nAbove);

        P.initUI(ctx);

        const wrap = util.el('div', '', ctx.stage);
        Object.assign(wrap.style, { position: 'absolute', inset: '0' });
        card = util.el('div', 'fd-card', wrap);
        card.dataset.role = 'form';
        card.style.width = geo.cardW + 'px';
        P.cardCreated(ctx);
        util.el('div', 'fd-title', card, D.title === null ? spec.scene.title : D.title);
        const sub = util.el('div', 'fd-sub', card, rng.pick(SUBS));
        if (D.subtitle !== null) sub.textContent = D.subtitle;
        P.heading(ctx, extras);
        if (spec.showToday) {
          const t = util.el('div', 'fd-today', card, `${P.word('today', 'Today')}: `);
          util.el('b', '', t, P.fmtLocal(spec.today, 'full'));
        }
        geo.body = card;
        P.bodyStart(ctx, extras);
        for (const ex of extras.slice(0, nAbove)) P.staticRow(card, ex, util);

        P.buildControl(ctx);
        P.built(ctx);

        // Sampled placement inside the stage.
        const w = card.offsetWidth;
        const h = card.offsetHeight;
        const fx = rng.pick([0, 0.5, 0.5, 1, rng.float()]);
        const fy = rng.pick([0.5, 0.5, 0, 1, rng.float()]);
        card.style.left = Math.round(16 + fx * Math.max(0, size.width - w - 32)) + 'px';
        card.style.top = Math.round(12 + fy * Math.max(0, size.height - h - 24)) + 'px';
        P.positioned(ctx);
        P.paint();
        P.rendered(ctx);
        return { anchors: [card], sync: () => P.paint() };
      },
      locate(t) { return P.locate(t); },
    };
  }, { uses: ['set-date/_styles', 'set-date/_calendar-parts'] });
})();
