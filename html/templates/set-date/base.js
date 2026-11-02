// set-date/base: the base site's set-date widgets (calendar, jqui, bootstrap, inline) as a template. This
// file is their source. The design-* sites that started from a copy of them, and the composite sites that embed them,
// are designs on it.
// CSS and popup time builders live in _base-assets.js and _base-time.js; their unit hooks stay here.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/set-date.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/set-date.js (what
// document.currentScript was for the reference file). design.parts replaces units of it: { '<key>': (base, S) =>
// replacement }, where base is the unit's reference value (functions and widget props) and S the scope of the unit's
// IIFE (getters for its top-level names, setters for its lets). Keys: top-level functions, constants and lets by name
// (name@<iife> when the name repeats), other top-level statements as stmt<iife>.<n>, widget props as <widget name>.<prop>
// (a new prop adds it), and '+<iife>.<name>' for a function, constant or let a design adds (read through S, built on
// first read; a let can be assigned). Editing this code and its unit hooks: templates/README.md, "Reference
// templates".
(function () {
  const HTML = new URL('../../', document.currentScript.src);
  const UNITS = new Set(); // the part keys of the units below, recorded as they run (__has)
  let widgets = null;
  let parts = null;
  function reference(site, __parts) {
    const assets = window.env.templateLib('set-date/_base-assets');
    const time = window.env.templateLib('set-date/_base-time');
    const captured = [];
    let scopeNow = null;
    const __has = (key) => { UNITS.add(key); return key in __parts; };
    const env = new Proxy(window.env, {
      get: (t, k) => (k === 'widget' ? (d) => {
        for (const key of Object.keys(__parts)) {
          const dot = key.indexOf('.');
          if (!key.startsWith('stmt') && !key.startsWith('+') && dot > 0 && key.slice(0, dot) === d.name) d[key.slice(dot + 1)] = __parts[key](d[key.slice(dot + 1)], scopeNow);
        }
        captured.push(d);
      } : Reflect.get(t, k)),
    });
    const scriptOf = { src: new URL(`sites/${site}/widgets/set-date.js`, HTML).href };
    /*
     * reference / set-date / calendar: a form card with one date, time or duration control, built from divs,
     * placed at a sampled position inside the stage and sized from ctx.size. Month and weekday names, the
     * first day of the week and the field formats follow spec.locale (env.content.LOCALES).
     *   calendar  a field that opens a month grid. Header per spec.header: prev/next arrows; a "Month YYYY"
     *             title that opens a year grid; or month and year menus (grids over the days). Optional Today
     *             button in a footer. Disabled days (spec.limit) are struck through and inert. Adjacent-month
     *             days are shown muted and clickable on some seeds. A "Today: ..." line shows spec.today.
     *   range     a field that opens two months side by side; first click start, second click end. Booked
     *             days and (while choosing the end) days outside the min/max nights or past the next booked
     *             day are disabled. An end before the start shows a validation error under the field.
     *   month     a field that opens a month picker: year title with arrows (they page a year) over a grid of 12 month
     *             names (3 x 4); a click on a month picks it and closes the picker (classic widget only)
     *   week      the calendar grid with whole-week picking: a click on a day picks its week (locale first weekday), the
     *             week is highlighted and the field reads "Mar 1 - Mar 7, 2027" style (classic widget only)
     *   typed     a masked text input (digits only, separators inserted), placeholder = spec.maskShown.
     *   segmented separate day / month / year inputs in the locale's order inside one field box (placeholders
     *             dd / mm / yyyy): click a segment and type (a full segment moves on), ArrowUp / ArrowDown on it,
     *             or the up / down spinner buttons at the right end of the field (they step the focused segment).
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
     * Three more widgets of the calendar scenario share this file (renderCard with a `look`):
     *   jqui       jQuery-UI-like datepicker: blue header with prev / next arrows and month / year menus, a day
     *              grid with cell borders, and a button row with Today (only jumps to today's month, picks
     *              nothing) and Done (closes the picker)
     *   bootstrap  Bootstrap-like datepicker: clicking the title zooms days -> months -> years; a year opens its
     *              months, a month its days; in the months view the arrows page whole years
     *   inline     always-open calendar embedded in the card (no field, no popup); the picked date is read out
     *              above it and picking a day keeps the calendar open
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get ICON_CAL() { return ICON_CAL; },
        get ICON_CLOCK() { return ICON_CLOCK; },
        get CHEV() { return CHEV; },
        get LEFT() { return LEFT; },
        get RIGHT() { return RIGHT; },
        get UP() { return UP; },
        get DOWN() { return DOWN; },
        get SUBS() { return SUBS; },
        get C() { return C; },
        get fmtLocal() { return fmtLocal; },
        get word() { return word; },
        get req() { return req; },
        get monthName() { return monthName; },
        get monthTitle() { return monthTitle; },
        get ctxRef() { return ctxRef; }, set ctxRef(v) { ctxRef = v; },
        get spec() { return spec; }, set spec(v) { spec = v; },
        get fam() { return fam; }, set fam(v) { fam = v; },
        get card() { return card; }, set card(v) { card = v; },
        get control() { return control; }, set control(v) { control = v; },
        get pop() { return pop; }, set pop(v) { pop = v; },
        get geo() { return geo; }, set geo(v) { geo = v; },
        get paintFns() { return paintFns; }, set paintFns(v) { paintFns = v; },
        get ui() { return ui; }, set ui(v) { ui = v; },
        get L() { return L; }, set L(v) { L = v; },
        get ensureStyle() { return ensureStyle; },
        get act() { return act; },
        get paint() { return paint; },
        get fieldRow() { return fieldRow; },
        get staticRow() { return staticRow; },
        get clickControl() { return clickControl; },
        get monthBlock() { return monthBlock; },
        get dayGrid() { return dayGrid; },
        get placePop() { return placePop; },
        get sizePop() { return sizePop; },
        get fitCard() { return fitCard; },
        get popRoom() { return popRoom; },
        get fillCalendar() { return fillCalendar; },
        get buildInline() { return buildInline; },
        get buildCalendar() { return buildCalendar; },
        get buildMonthPicker() { return buildMonthPicker; },
        get buildTimeColumns() { return buildTimeColumns; },
        get buildTimeDropdowns() { return buildTimeDropdowns; },
        get buildClock() { return buildClock; },
        get buildSpin() { return buildSpin; },
        get buildText() { return buildText; },
        get buildSegmented() { return buildSegmented; },
        get buildDuration() { return buildDuration; },
        get renderCard() { return renderCard; },
        get locateTarget() { return locateTarget; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('ensureStyle')) ensureStyle = __parts['ensureStyle'](ensureStyle, __scope);
      if (__has('act')) act = __parts['act'](act, __scope);
      if (__has('paint')) paint = __parts['paint'](paint, __scope);
      if (__has('fieldRow')) fieldRow = __parts['fieldRow'](fieldRow, __scope);
      if (__has('staticRow')) staticRow = __parts['staticRow'](staticRow, __scope);
      if (__has('clickControl')) clickControl = __parts['clickControl'](clickControl, __scope);
      if (__has('monthBlock')) monthBlock = __parts['monthBlock'](monthBlock, __scope);
      if (__has('dayGrid')) dayGrid = __parts['dayGrid'](dayGrid, __scope);
      if (__has('placePop')) placePop = __parts['placePop'](placePop, __scope);
      if (__has('sizePop')) sizePop = __parts['sizePop'](sizePop, __scope);
      if (__has('fitCard')) fitCard = __parts['fitCard'](fitCard, __scope);
      if (__has('popRoom')) popRoom = __parts['popRoom'](popRoom, __scope);
      if (__has('fillCalendar')) fillCalendar = __parts['fillCalendar'](fillCalendar, __scope);
      if (__has('buildInline')) buildInline = __parts['buildInline'](buildInline, __scope);
      if (__has('buildCalendar')) buildCalendar = __parts['buildCalendar'](buildCalendar, __scope);
      if (__has('buildMonthPicker')) buildMonthPicker = __parts['buildMonthPicker'](buildMonthPicker, __scope);
      if (__has('buildTimeColumns')) buildTimeColumns = __parts['buildTimeColumns'](buildTimeColumns, __scope);
      if (__has('buildTimeDropdowns')) buildTimeDropdowns = __parts['buildTimeDropdowns'](buildTimeDropdowns, __scope);
      if (__has('buildClock')) buildClock = __parts['buildClock'](buildClock, __scope);
      if (__has('buildSpin')) buildSpin = __parts['buildSpin'](buildSpin, __scope);
      if (__has('buildText')) buildText = __parts['buildText'](buildText, __scope);
      if (__has('buildSegmented')) buildSegmented = __parts['buildSegmented'](buildSegmented, __scope);
      if (__has('buildDuration')) buildDuration = __parts['buildDuration'](buildDuration, __scope);
      if (__has('renderCard')) renderCard = __parts['renderCard'](renderCard, __scope);
      if (__has('locateTarget')) locateTarget = __parts['locateTarget'](locateTarget, __scope);

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (assets.CSS);

      const ICON_CAL = __has('ICON_CAL') ? __parts['ICON_CAL'](undefined, __scope) : ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>');
      const ICON_CLOCK = __has('ICON_CLOCK') ? __parts['ICON_CLOCK'](undefined, __scope) : ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>');
      const CHEV = __has('CHEV') ? __parts['CHEV'](undefined, __scope) : { CHEV: (d) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>` }.CHEV;
      const LEFT = __has('LEFT') ? __parts['LEFT'](undefined, __scope) : (CHEV('M15 5l-7 7 7 7'));
      const RIGHT = __has('RIGHT') ? __parts['RIGHT'](undefined, __scope) : (CHEV('M9 5l7 7-7 7'));
      const UP = __has('UP') ? __parts['UP'](undefined, __scope) : (CHEV('M5 15l7-7 7 7'));
      const DOWN = __has('DOWN') ? __parts['DOWN'](undefined, __scope) : (CHEV('M5 9l7 7 7-7'));
      const SUBS = __has('SUBS') ? __parts['SUBS'](undefined, __scope) : (['Fields marked * are required.', 'Review the details before you continue.', 'Changes are saved when you finish.', 'All times are local.']);

      let ctxRef = __has('ctxRef') ? __parts['ctxRef'](undefined, __scope) : undefined;
      let spec = __has('spec') ? __parts['spec'](undefined, __scope) : undefined;
      let fam = __has('fam') ? __parts['fam'](undefined, __scope) : undefined;
      let card = __has('card') ? __parts['card'](undefined, __scope) : undefined;
      let control = __has('control') ? __parts['control'](undefined, __scope) : undefined;
      let pop = __has('pop') ? __parts['pop'](undefined, __scope) : undefined;
      let geo = __has('geo') ? __parts['geo'](undefined, __scope) : undefined;
      let paintFns = __has('paintFns') ? __parts['paintFns'](undefined, __scope) : undefined;
      let ui = __has('ui') ? __parts['ui'](undefined, __scope) : undefined; // env.ui widgets of the live episode: { dd, cal, spin: {}, ampm, cols: {}, dur: {}, el: {} }
      let L = __has('L') ? __parts['L'](undefined, __scope) : undefined; // locale record

      function ensureStyle() {
        if (document.getElementById('fd-style')) return;
        const s = document.createElement('style');
        s.id = 'fd-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      function act(t) {
        const before = ctxRef.model;
        const after = fam.helpers.apply(before, spec, t);
        ctxRef.log('pick', { target: t });
        if (after !== before) ctxRef.update(after);
        paint();
      }

      function paint() {
        if (ui.cal) ui.cal.clear();
        if (ui.cal2) ui.cal2.clear();
        for (const f of paintFns) f(ctxRef.model);
        if (ui.dd) ui.dd.set({ open: !!ctxRef.model.open });
      }

      const C = __has('C') ? __parts['C'](undefined, __scope) : { C: () => env.content }.C;
      const fmtLocal = __has('fmtLocal') ? __parts['fmtLocal'](undefined, __scope) : { fmtLocal: (iso, style) => (C().formatDate ? C().formatDate(iso, spec.locale, style) : fam.helpers.fmtDate(iso, 'short')) }.fmtLocal;
      const word = __has('word') ? __parts['word'](undefined, __scope) : { word: (k, en) => (C().uiWord ? C().uiWord(k, spec.locale) || en : en) }.word;
      const req = __has('req') ? __parts['req'](undefined, __scope) : { req: (el, what) => {
        if (!el || !el.isConnected) throw new Error(`set-date: ${what} is not rendered`);
        return ctxRef.util.center(el);
      } }.req;

      // ---- building blocks

      function fieldRow(parent, label, help, util) {
        const row = util.el('div', 'fd-row', parent);
        const lab = util.el('label', 'fd-label', row, label + ' ');
        util.el('b', '', lab, '*');
        return { row, help: help === null ? null : util.el('div', 'fd-help', null, help) };
      }

      function staticRow(parent, [k, v], util) {
        const row = util.el('div', 'fd-row fd-ex', parent);
        util.el('div', 'fd-label', row, k);
        util.el('div', 'fd-static', row, v);
      }

      function clickControl(row, icon, util) {
        const c = util.el('div', 'fd-control', row);
        c.dataset.role = 'field';
        c.insertAdjacentHTML('beforeend', icon);
        return c;
      }

      const monthName = __has('monthName') ? __parts['monthName'](undefined, __scope) : { monthName: (m) => (L.months || fam.helpers.MONTHS)[m - 1] }.monthName;
      const monthTitle = __has('monthTitle') ? __parts['monthTitle'](undefined, __scope) : { monthTitle: (y, m) => (C().formatDate ? C().formatDate(`${y}-${String(m).padStart(2, '0')}-01`, spec.locale, 'monthYear') : `${monthName(m)} ${y}`) }.monthTitle;

      // One month: header (title or selects, optional arrows) + weekday row + 6x7 grid.
      function monthBlock(parent, key, { prev, next, toggle, selects, menu, title: titleText, cal: calIn }, util) {
        const cal = calIn || ui.cal;
        const box = util.el('div', 'fd-month', parent);
        const head = util.el('div', 'fd-head', box);
        if (prev) cal.bindNav(util.el('div', 'fd-nav', head), 'prev').innerHTML = LEFT;
        else util.el('div', 'fd-navgap', head);
        const [y, m] = [+key.slice(0, 4), +key.slice(5, 7)];
        if (selects) {
          const sels = util.el('div', 'fd-sels', head);
          const ms = util.el('div', 'fd-sel' + (menu === 'month' ? ' on' : ''), sels, (L.monthsShort || fam.helpers.MONTHS)[m - 1]);
          const ys = util.el('div', 'fd-sel' + (menu === 'year' ? ' on' : ''), sels, String(y));
          ms.dataset.role = 'month-menu';
          ys.dataset.role = 'year-menu';
          ms.addEventListener('click', () => act({ menu: 'month' }));
          ys.addEventListener('click', () => act({ menu: 'year' }));
          ui.el.menuMonth = ms;
          ui.el.menuYear = ys;
        } else {
          const title = util.el('div', 'fd-mtitle', head, titleText !== undefined ? titleText : monthTitle(y, m));
          if (toggle) { title.classList.add('toggle'); cal.bindToggle(title); }
        }
        if (next) cal.bindNav(util.el('div', 'fd-nav', head), 'next').innerHTML = RIGHT;
        else util.el('div', 'fd-navgap', head);
        return { box, y, m };
      }

      function dayGrid(box, y, m, deco, util, calIn, calName) {
        const cal = calIn || ui.cal;
        const dow = util.el('div', 'fd-dow', box);
        for (const wd of cal.weekdays()) util.el('div', '', dow, (L.weekdaysShort || fam.helpers.WEEKDAYS.map((w) => w.slice(0, 2)))[wd].replace(/\.$/, ''));
        const grid = util.el('div', 'fd-grid', box);
        const model = ctxRef.model;
        for (const { iso, day, inMonth } of cal.weeks(fam.helpers.monthKey(y, m)).flat()) {
          if (!inMonth && !geo.showOut) { util.el('div', '', grid); continue; }
          const cell = cal.bindDay(util.el('div', 'fd-day' + (inMonth ? '' : ' out'), grid, String(day)), iso, { inMonth });
          cell.dataset.role = 'day';
          if (iso === spec.today) cell.classList.add('today');
          if (fam.helpers.disabled(spec, model, iso, calName)) {
            cell.classList.add('off');
            cell.setAttribute('aria-disabled', 'true');
          }
          if ((spec.booked || []).includes(iso)) cell.classList.add('booked');
          for (const c of deco(iso)) cell.classList.add(c);
        }
      }

      function placePop(util) {
        pop = util.el('div', 'fd-pop', card);
        pop.dataset.role = 'picker';
        pop.hidden = true;
        ui.dd = env.ui.dropdown(control, pop, {
          label: 'picker',
          open: !!ctxRef.model.open,
          show: () => {}, // paint() owns the popup's visibility and contents
          onOpenChange: (open, reason) => act(reason === 'outside' ? { outside: true } : { field: 'main' }),
        });
      }

      // Popup geometry: below the control, left-aligned with it; card tall enough to contain it.
      function sizePop(w, h) {
        const top = control.offsetTop + control.offsetHeight + 6;
        Object.assign(pop.style, { left: control.offsetLeft + 'px', top: top + 'px', width: w + 'px', height: h + 'px' });
        return top + h + 18;
      }

      function fitCard(height, util) {
        const spare = height - card.offsetHeight;
        if (spare > 96) {
          const row = util.el('div', 'fd-row fd-notes', card);
          util.el('div', 'fd-label', row, 'Notes (optional)');
          util.el('div', 'fd-static', row, geo.note);
        }
        card.style.height = Math.max(card.offsetHeight, height) + 'px';
      }

      function popRoom(size) {
        return size.height - 24 - (control.offsetTop + control.offsetHeight + 6) - 18;
      }

      // ---- scenarios

      // The single-month picker body of the calendar scenario, drawn into `pop` from model m (every paint).
      function fillCalendar(m, util) {
        const zoom = spec.header === 'zoom' ? m.zoom : 'days';
        const sel = spec.header === 'selects';
        const years = m.years || zoom === 'years';
        const vy = +m.view.slice(0, 4);
        const title = zoom === 'months' ? String(vy) : zoom === 'years' ? `${fam.helpers.YEARS[0]}–${fam.helpers.YEARS[fam.helpers.YEARS.length - 1]}` : undefined;
        const toggle = spec.header === 'yearGrid' || (spec.header === 'zoom' && zoom !== 'years');
        const { box, y } = monthBlock(pop, m.view, { prev: !years, next: !years, toggle, selects: sel, menu: m.menu, title }, util);
        const room = 26 + 6 * geo.cell;
        if (years) {
          const grid = util.el('div', 'fd-years', box);
          const rows = Math.ceil(fam.helpers.YEARS.length / 4);
          grid.style.gridAutoRows = Math.floor((room - 6 * (rows - 1)) / rows) + 'px';
          for (const yy of fam.helpers.YEARS) {
            const c = ui.cal.bindYear(util.el('div', 'fd-year' + (yy === y ? ' sel' : ''), grid, String(yy)), yy);
            c.dataset.role = 'year';
          }
        } else if (zoom === 'months') {
          const grid = util.el('div', 'fd-mgrid', box);
          grid.style.gridAutoRows = Math.floor((room - 12 - 6 * 3) / 4) + 'px';
          ui.el.menuItems = new Map();
          for (let it = 1; it <= 12; it++) {
            const c = util.el('div', 'fd-mcell' + (m.value && m.value.slice(0, 7) === fam.helpers.monthKey(vy, it) ? ' sel' : ''), grid, (L.monthsShort || fam.helpers.MONTHS)[it - 1]);
            c.dataset.role = 'month';
            c.addEventListener('click', () => act({ pickMonth: it }));
            ui.el.menuItems.set(it, c);
          }
        } else {
          const wk = spec.scenario === 'week' && m.value ? fam.helpers.days(m.value) : null;
          dayGrid(box, y, +m.view.slice(5, 7), (iso) => {
            if (spec.scenario !== 'week') return iso === m.value ? ['sel'] : [];
            const n = fam.helpers.days(iso);
            return wk === null ? [] : n === wk || n === wk + 6 ? ['sel'] : n > wk && n < wk + 6 ? ['inr'] : [];
          }, util);
        }
        if (sel && m.menu) {
          const menu = util.el('div', 'fd-menu', box);
          const grid = util.el('div', m.menu === 'month' ? 'fd-mgrid' : 'fd-years', menu);
          const items = m.menu === 'month' ? Array.from({ length: 12 }, (_, i) => i + 1) : fam.helpers.YEARS;
          const rows = Math.ceil(items.length / (m.menu === 'month' ? 3 : 4));
          grid.style.gridAutoRows = Math.floor((room - 12 - 6 * (rows - 1)) / rows) + 'px';
          ui.el.menuItems = new Map();
          for (const it of items) {
            const on = m.menu === 'month' ? it === +m.view.slice(5, 7) : it === y;
            const c = util.el('div', (m.menu === 'month' ? 'fd-mcell' : 'fd-year') + (on ? ' sel' : ''), grid,
              m.menu === 'month' ? (L.monthsShort || fam.helpers.MONTHS)[it - 1] : String(it));
            c.dataset.role = m.menu;
            c.addEventListener('click', () => act(m.menu === 'month' ? { pickMonth: it } : { pickYear: it }));
            ui.el.menuItems.set(it, c);
          }
        }
        if (spec.todayBtn) {
          const f = util.el('div', 'fd-foot', pop);
          const goto = spec.todayMode === 'goto';
          const b = util.el('div', 'fd-btn', f, word('today', 'Today'));
          b.dataset.role = 'today';
          b.addEventListener('click', () => act(goto ? { todayGoto: true } : { todayBtn: true }));
          ui.el.today = b;
          if (goto) {
            const d = util.el('div', 'fd-btn', f, 'Done');
            d.dataset.role = 'done';
            d.addEventListener('click', () => act({ done: true }));
            ui.el.done = d;
          }
        }
      }

      // Always-open calendar embedded in the card (spec.inline): a read-out of the pick, then the month.
      function buildInline(ctx) {
        const { util, size } = ctx;
        const row = util.el('div', 'fd-row', geo.body);
        util.el('div', 'fd-label', row, spec.scene.label);
        const out = util.el('div', 'fd-static', row);
        out.dataset.role = 'value';
        control = out;
        pop = util.el('div', 'fd-pop fd-inlinepop', geo.body);
        pop.dataset.role = 'picker';
        const fixed = 8 + 40 + 26 + (spec.todayBtn ? 42 : 0);
        const room = size.height - 24 - card.offsetHeight - 12 - fixed;
        geo.cell = Math.max(24, Math.min(geo.cell, Math.floor(room / 6)));
        const popW = 7 * geo.cell + 8;
        pop.style.setProperty('--cell', geo.cell + 'px');
        pop.style.setProperty('--round', geo.round);
        pop.style.width = popW + 'px';
        card.style.width = Math.min(size.width - 32, Math.max(geo.cardW, popW + 48)) + 'px';
        paintFns.push((m) => {
          out.textContent = m.value ? fmtLocal(m.value, geo.disp) : geo.placeholder;
          out.classList.toggle('fd-ph', !m.value);
          pop.replaceChildren();
          ui.el = {};
          fillCalendar(m, util);
        });
        paintFns[paintFns.length - 1](ctx.model);
        card.style.height = card.offsetHeight + 'px';
      }

      function buildCalendar(ctx, range) {
        if (spec.inline && !range) { buildInline(ctx); return; }
        const { util, size } = ctx;
        const { row, help } = fieldRow(geo.body, range ? `${spec.scene.label} – ${spec.scene.label2}` : spec.scene.label, '', util);
        control = clickControl(row, ICON_CAL, util);
        const txt = util.el('span', 'fd-txt', control);
        row.append(help);
        if (range) {
          if (spec.rule === 'minmax') help.textContent = `Minimum stay ${spec.minN} nights · maximum ${spec.maxN} nights`;
          else if (spec.rule === 'booked') help.textContent = ctx.rng.pick(['Striped dates are already booked.', 'Unavailable dates cannot be selected.', 'Some dates are fully booked.']);
        } else if (spec.limit) help.textContent = spec.limit.min ? 'Past dates are not available.' : 'Future dates are not allowed.';
        for (const ex of geo.extrasBelow) staticRow(geo.body, ex, util);
        placePop(util);

        const months = range ? 2 : 1;
        const foot = !range && spec.todayBtn ? 42 : 0;
        const fixed = 24 + 40 + 26 + foot;
        geo.cell = Math.max(26, Math.min(geo.cell, Math.floor((popRoom(size) - fixed) / 6)));
        const maxW = size.width - 32 - 2 * control.offsetLeft;
        const gap = 24;
        geo.cell = Math.max(26, Math.min(geo.cell, Math.floor((maxW - 24 - (months - 1) * gap) / (7 * months))));
        // A short stage under a tall card head: the 26px floor would make the card taller than the stage, so the
        // cells shrink to what fits (not below 22).
        const fitCell = Math.floor((size.height - 2 - (control.offsetTop + control.offsetHeight + 6) - 18 - fixed) / 6);
        if (geo.cell > fitCell) geo.cell = Math.max(22, fitCell);
        const popW = 24 + months * 7 * geo.cell + (months - 1) * gap;
        const popH = fixed + 6 * geo.cell;
        pop.style.setProperty('--cell', geo.cell + 'px');
        pop.style.setProperty('--round', geo.round);
        card.style.width = Math.min(size.width - 32, Math.max(geo.cardW, popW + control.offsetLeft * 2)) + 'px';
        fitCard(sizePop(popW, popH), util);

        paintFns.push((m) => {
          control.classList.toggle('open', !!m.open);
          txt.replaceChildren();
          if (range) {
            const a = util.el('span', m.start ? '' : 'fd-ph', txt, m.start ? fmtLocal(m.start, geo.disp) : spec.scene.label);
            a.dataset.part = 'start';
            util.el('span', 'fd-arrowr', txt, '  →  ');
            util.el('span', m.end ? '' : 'fd-ph', txt, m.end ? fmtLocal(m.end, geo.disp) : spec.scene.label2);
            const bad = m.start && m.end && m.end < m.start;
            control.classList.toggle('bad', !!bad);
            if (bad) { help.textContent = `${spec.scene.label2} is before ${spec.scene.label.toLowerCase()}.`; help.classList.add('err'); } else if (help.classList.contains('err')) {
              help.classList.remove('err');
              help.textContent = spec.rule === 'minmax' ? `Minimum stay ${spec.minN} nights · maximum ${spec.maxN} nights` : spec.rule === 'booked' ? 'Unavailable dates cannot be selected.' : '';
            }
          } else {
            const shown = !m.value ? (spec.scenario === 'week' ? 'Select a week' : geo.placeholder)
              : spec.scenario === 'week' ? `${fmtLocal(m.value, 'short')} – ${fmtLocal(fam.helpers.fromDays(fam.helpers.days(m.value) + 6), 'short')}` : fmtLocal(m.value, geo.disp);
            util.el('span', m.value ? '' : 'fd-ph', txt, shown);
          }
          pop.hidden = !m.open;
          if (!m.open) return;
          pop.replaceChildren();
          ui.el = {};
          if (!range) {
            fillCalendar(m, util);
            return;
          }
          const wrap = util.el('div', 'fd-months', pop);
          const lo = m.start ? fam.helpers.days(m.start) : null;
          const hi = m.end ? fam.helpers.days(m.end) : null;
          const deco = (iso) => {
            const n = fam.helpers.days(iso);
            if (n === lo || n === hi) return ['sel'];
            return lo !== null && hi !== null && n > lo && n < hi ? ['inr'] : [];
          };
          for (let k = 0; k < 2; k++) {
            if (spec.splitCals) {
              // independent start / end calendars (spec.splitCals): each has its own arrows and month
              const cal = k === 0 ? ui.cal : ui.cal2;
              const { box, y, m: mm } = monthBlock(wrap, k === 0 ? m.view : m.view2, { prev: true, next: true, cal }, util);
              dayGrid(box, y, mm, deco, util, cal, k === 0 ? 'start' : 'end');
              continue;
            }
            const key = fam.helpers.addMonths(m.view, k);
            const { box, y, m: mm } = monthBlock(wrap, key, { prev: k === 0, next: k === 1 }, util);
            dayGrid(box, y, mm, deco, util);
          }
        });
      }

      // month: a field + a popup with the year (arrows page a year) over the 12 month names.
      function buildMonthPicker(ctx) {
        const { util, size } = ctx;
        const { row, help } = fieldRow(geo.body, spec.scene.label, '', util);
        control = clickControl(row, ICON_CAL, util);
        const txt = util.el('span', 'fd-txt', control);
        row.append(help);
        for (const ex of geo.extrasBelow) staticRow(geo.body, ex, util);
        placePop(util);
        const fixed = 24 + 40 + 26;
        geo.cell = Math.max(26, Math.min(geo.cell, Math.floor((popRoom(size) - fixed) / 6)));
        const popW = 24 + 7 * geo.cell;
        const popH = fixed + 6 * geo.cell;
        pop.style.setProperty('--cell', geo.cell + 'px');
        pop.style.setProperty('--round', geo.round);
        card.style.width = Math.min(size.width - 32, Math.max(geo.cardW, popW + control.offsetLeft * 2)) + 'px';
        fitCard(sizePop(popW, popH), util);
        const room = 26 + 6 * geo.cell;
        paintFns.push((m) => {
          control.classList.toggle('open', !!m.open);
          txt.replaceChildren();
          util.el('span', m.value ? '' : 'fd-ph', txt, m.value ? monthTitle(+m.value.slice(0, 4), +m.value.slice(5, 7)) : 'Select a month');
          pop.hidden = !m.open;
          if (!m.open) return;
          pop.replaceChildren();
          ui.el = {};
          const vy = +m.view.slice(0, 4);
          const { box } = monthBlock(pop, m.view, { prev: true, next: true, title: String(vy) }, util);
          const grid = util.el('div', 'fd-mgrid', box);
          grid.style.gridAutoRows = Math.floor((room - 12 - 6 * 3) / 4) + 'px';
          ui.el.menuItems = new Map();
          for (let it = 1; it <= 12; it++) {
            const c = util.el('div', 'fd-mcell' + (m.value === fam.helpers.monthKey(vy, it) ? ' sel' : ''), grid, (L.monthsShort || fam.helpers.MONTHS)[it - 1]);
            c.dataset.role = 'month';
            c.addEventListener('click', () => act({ pickMonth: it }));
            ui.el.menuItems.set(it, c);
          }
        });
      }

      function buildTimeColumns(ctx) {
        time.buildTimeColumns(ctx, __scope);
      }

      // Three independent dropdowns (spec.control 'dropdowns'): hour, minute and AM / PM, each its own env.ui.dropdown
      // over a small grid popup under its trigger; model { h, m, ap (null = unset), open: '' | 'hour' | 'minute' | 'ampm' }.
      function buildTimeDropdowns(ctx) {
        time.buildTimeDropdowns(ctx, __scope);
      }

      function buildClock(ctx) {
        time.buildClock(ctx, __scope);
      }

      function buildSpin(ctx) {
        const { util } = ctx;
        const { row, help } = fieldRow(geo.body, spec.scene.label, ctx.rng.pick(['Use the arrows to change the time.', 'Click a number and use the arrow keys, or the buttons.']), util);
        control = util.el('div', 'fd-spin', row);
        control.dataset.role = 'field';
        const seg = (kind, range) => {
          const s = util.el('div', 'fd-seg', control);
          const up = util.el('div', 'fd-arr', s);
          up.innerHTML = UP;
          const val = util.el('div', 'fd-val', s);
          val.tabIndex = 0;
          val.dataset.role = `${kind}-value`;
          val.addEventListener('focus', () => { if (ctxRef.model.focus !== kind) act({ spinField: kind }); });
          val.addEventListener('blur', () => {
            if (!val.isConnected) return;
            if (ctxRef.model.focus === kind) { ctxRef.update({ ...ctxRef.model, focus: '' }); }
          });
          const down = util.el('div', 'fd-arr', s);
          down.innerHTML = DOWN;
          ui.spin[kind] = env.ui.spinner({ up, down, field: val, wrap: true, ...range, label: `time ${kind}`, keyboard: true,
            onStep: (dir) => act({ spin: kind, dir }) });
          ui.el[kind] = val;
          return val;
        };
        const hv = seg('hour', { min: 1, max: 12, step: 1 });
        util.el('div', 'fd-colon', control, ':');
        const mv = seg('minute', { min: 0, max: 60 - spec.step, step: spec.step });
        const ampm = util.el('div', 'fd-ampm' + (geo.vertAmpm ? ' vert' : ''), control);
        const aps = ['AM', 'PM'].map((a) => {
          const el = util.el('div', 'fd-ap', ampm, a);
          el.dataset.ampm = a;
          return el;
        });
        ui.ampm = env.ui.choices(aps.map((el) => [el.dataset.ampm, el]), {
          label: 'ampm',
          value: ctx.model.value >= 720 ? 'PM' : 'AM',
          onChange: (a) => act({ ampm: a }),
        });
        row.append(help);
        for (const ex of geo.extrasBelow) staticRow(geo.body, ex, util);
        card.style.width = geo.cardW + 'px';
        card.style.height = card.offsetHeight + 'px';
        paintFns.push((m) => {
          const h = Math.floor(m.value / 60) % 12 || 12;
          hv.textContent = geo.padHour ? String(h).padStart(2, '0') : String(h);
          mv.textContent = String(m.value % 60).padStart(2, '0');
          aps.forEach((el) => el.classList.toggle('on', el.dataset.ampm === (m.value >= 720 ? 'PM' : 'AM')));
          ui.spin.hour.set(h);
          ui.spin.minute.set(m.value % 60);
          ui.ampm.set(m.value >= 720 ? 'PM' : 'AM');
        });
      }

      function buildText(ctx, mask, shown, helpText) {
        const { util } = ctx;
        const { row, help } = fieldRow(geo.body, spec.scene.label, helpText, util);
        control = util.el('input', 'fd-input', row);
        control.dataset.role = 'field';
        Object.assign(control, { type: 'text', placeholder: shown, autocomplete: 'off', spellcheck: false });
        control.setAttribute('inputmode', mask ? 'numeric' : 'text');
        control.value = ctx.model.text;
        row.append(help);
        for (const ex of geo.extrasBelow) staticRow(geo.body, ex, util);
        control.addEventListener('input', () => {
          if (!mask) { ctx.update({ text: control.value }); return; } // longForm: free text
          const t = fam.helpers.maskText(control.value, mask);
          if (control.value !== t) {
            control.value = t;
            control.setSelectionRange(t.length, t.length);
          }
          ctx.update({ text: t });
        });
        paintFns.push((m) => { if (control.value !== m.text) control.value = m.text; });
        card.style.width = geo.cardW + 'px';
        card.style.height = card.offsetHeight + 'px';
      }

      function buildSegmented(ctx) {
        const { util } = ctx;
        const { row, help } = fieldRow(geo.body, spec.scene.label, `Format: ${spec.maskShown || spec.mask}`, util);
        const field = util.el('div', 'fd-segs', row);
        field.dataset.role = 'field';
        control = field;
        row.append(help);
        for (const ex of geo.extrasBelow) staticRow(geo.body, ex, util);
        const order = spec.segs.filter((x) => x.k).map((x) => x.k);
        ui.segs = {};
        const upd = (m) => ctx.update(m);
        for (const it of spec.segs) {
          if (it.sep) { util.el('span', 'fd-sep', field, it.sep); continue; }
          const inp = util.el('input', 'fd-segin', field);
          Object.assign(inp, { type: 'text', placeholder: it.ph, maxLength: it.w, autocomplete: 'off', spellcheck: false });
          inp.setAttribute('inputmode', 'numeric');
          inp.setAttribute('aria-label', { y: 'year', m: 'month', d: 'day' }[it.k]);
          inp.style.width = it.w + 1.2 + 'ch';
          inp.dataset.role = 'segment';
          inp.value = ctx.model[it.k];
          inp.addEventListener('focus', () => { if (ctx.model.focus !== it.k) upd(fam.helpers.apply(ctx.model, spec, { seg: it.k })); });
          inp.addEventListener('blur', (e) => { if (!field.contains(e.relatedTarget) && ctx.model.focus) upd({ ...ctx.model, focus: '' }); });
          inp.addEventListener('input', () => {
            const digits = inp.value.replace(/\D/g, '').slice(0, it.w);
            inp.value = digits;
            const m = { ...ctx.model, [it.k]: digits };
            const next = order[order.indexOf(it.k) + 1];
            if (digits.length === it.w && next) m.focus = next;
            upd(m);
            if (m.focus === next && next && digits.length === it.w) ui.segs[next].focus();
          });
          inp.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
            e.preventDefault();
            act({ key: e.key, field: it.k });
          });
          ui.segs[it.k] = inp;
        }
        const sp = util.el('div', 'fd-spinbtns', field);
        for (const dir of ['up', 'down']) {
          const b = util.el('div', '', sp);
          b.dataset.role = `spin-${dir}`;
          b.innerHTML = dir === 'up' ? UP : DOWN;
          b.addEventListener('mousedown', (e) => e.preventDefault()); // the segment keeps the focus
          b.addEventListener('click', () => act({ segSpin: dir }));
          ui.el[dir === 'up' ? 'segUp' : 'segDown'] = b;
        }
        paintFns.push((m) => {
          for (const k of order) if (ui.segs[k].value !== m[k]) ui.segs[k].value = m[k];
        });
        card.style.width = geo.cardW + 'px';
        card.style.height = card.offsetHeight + 'px';
      }

      function buildDuration(ctx) {
        const { util, rng } = ctx;
        const fmt = (v) => fam.helpers.fmtDur(v);
        if (spec.control === 'spin') {
          const { row, help } = fieldRow(geo.body, spec.scene.label, 'Hours and minutes', util);
          control = util.el('div', 'fd-spin', row);
          control.dataset.role = 'field';
          const seg = (kind, range, unit) => {
            const s = util.el('div', 'fd-seg', control);
            const up = util.el('div', 'fd-arr', s);
            up.innerHTML = UP;
            const val = util.el('div', 'fd-val', s);
            const down = util.el('div', 'fd-arr', s);
            down.innerHTML = DOWN;
            util.el('span', 'fd-unit', control, unit);
            ui.dur[kind] = env.ui.spinner({ up, down, field: val, ...range, label: `duration ${kind}`, onStep: (dir) => act({ dur: kind, dir }) });
            return val;
          };
          const hv = seg('hours', { min: 0, max: 12, step: 1 }, 'h');
          const mv = seg('minutes', { min: 0, max: 60 - spec.step, step: spec.step, wrap: true }, 'min');
          row.append(help);
          paintFns.push((m) => {
            hv.textContent = String(Math.floor(m.value / 60));
            mv.textContent = String(m.value % 60).padStart(2, '0');
            ui.dur.hours.set(Math.floor(m.value / 60));
            ui.dur.minutes.set(m.value % 60);
          });
        } else if (spec.control === 'fields') {
          const { row, help } = fieldRow(geo.body, spec.scene.label, rng.pick(['Enter hours and minutes.', 'Whole numbers only.']), util);
          control = util.el('div', 'fd-dur', row);
          control.dataset.role = 'field';
          const inp = (key, unit) => {
            const i = util.el('input', 'fd-input', control);
            Object.assign(i, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: '0' });
            i.setAttribute('inputmode', 'numeric');
            i.dataset.role = key === 'h' ? 'hours' : 'minutes';
            util.el('span', 'fd-unit', control, unit);
            i.addEventListener('input', () => {
              const t = i.value.replace(/\D/g, '').slice(0, 3);
              if (i.value !== t) i.value = t;
              ctxRef.update({ ...ctxRef.model, [key]: t });
            });
            return i;
          };
          ui.el.hours = inp('h', rng.pick(['h', 'hours', 'hrs']));
          ui.el.minutes = inp('m', rng.pick(['min', 'minutes', 'mins']));
          row.append(help);
          paintFns.push((m) => {
            if (ui.el.hours.value !== m.h) ui.el.hours.value = m.h;
            if (ui.el.minutes.value !== m.m) ui.el.minutes.value = m.m;
          });
        } else {
          const { row, help } = fieldRow(geo.body, spec.scene.label, `Steps of ${spec.step} minutes`, util);
          const chips = util.el('div', 'fd-presets', row);
          ui.el.presets = new Map();
          for (const p of spec.presets) {
            const c = util.el('div', 'fd-chip', chips, fmt(p));
            c.dataset.role = 'preset';
            c.addEventListener('click', () => act({ preset: p }));
            ui.el.presets.set(p, c);
          }
          control = util.el('div', 'fd-stepper', row);
          control.dataset.role = 'field';
          const dn = util.el('div', 'fd-sbtn', control, `−${spec.step}`);
          const out = util.el('div', 'fd-readout', control);
          const upb = util.el('div', 'fd-sbtn', control, `+${spec.step}`);
          dn.addEventListener('click', () => act({ stepBtn: 'down' }));
          upb.addEventListener('click', () => act({ stepBtn: 'up' }));
          ui.el.stepdown = dn;
          ui.el.stepup = upb;
          row.append(help);
          paintFns.push((m) => {
            out.textContent = fmt(m.value);
            for (const [p, c] of ui.el.presets) c.classList.toggle('on', p === m.value);
          });
        }
        for (const ex of geo.extrasBelow) staticRow(geo.body, ex, util);
        card.style.width = geo.cardW + 'px';
        card.style.height = card.offsetHeight + 'px';
      }

      // Shared by the widgets of this file; `look` is '' (reference) or the widget's class suffix.
      function renderCard(ctx, look) {
        {
          ensureStyle();
          const { util, rng, size } = ctx;
          ctxRef = ctx;
          spec = ctx.spec;
          fam = env.taskOf('set-date');
          L = fam.helpers.loc(spec);
          paintFns = [];
          const extras = spec.scene.extra.slice();
          const popup = spec.scenario === 'calendar' || spec.scenario === 'range' || spec.scenario === 'month' || spec.scenario === 'week' || (spec.scenario === 'time' && (spec.control === 'columns' || spec.control === 'clock' || spec.control === 'dropdowns'));
          const nAbove = popup ? 0 : rng.int(0, Math.min(1, extras.length));
          geo = {
            cardW: Math.min(size.width - 32, rng.int(380, 440)),
            cell: rng.int(34, 42),
            row: rng.int(25, 28),
            round: rng.pick(['50%', '8px']),
            showOut: spec.scenario === 'calendar' && rng.bool(0.5),
            disp: rng.pick(spec.scenario === 'range' ? ['short', 'medium', 'numeric'] : ['short', 'medium', 'long', 'full', 'iso']),
            placeholder: rng.pick(['Select a date', 'Choose date', 'Pick a date']),
            hour12First: rng.bool(0.5),
            padHour: rng.bool(0.5),
            vertAmpm: rng.bool(0.5),
            extrasBelow: extras.slice(nAbove),
            note: rng.pick(['Anything we should know?', 'Add a note', 'Optional comments']),
            look,
          };

          ui = { spin: {}, cols: {}, dur: {}, el: {}, ddk: {} };
          ui.cal = env.ui.calendar({
            label: 'calendar',
            weekStart: spec.weekStart || 0,
            math: { days: fam.helpers.days, fromDays: fam.helpers.fromDays, weekday: fam.helpers.weekday },
            onDay: (iso) => act({ day: iso }),
            onNav: (dir) => act({ nav: dir }),
            onToggle: () => act({ yearToggle: true }),
            onYear: (y) => act({ year: y }),
          });
          if (spec.splitCals) {
            const mk = (name) => env.ui.calendar({
              label: `${name} calendar`,
              weekStart: spec.weekStart || 0,
              math: { days: fam.helpers.days, fromDays: fam.helpers.fromDays, weekday: fam.helpers.weekday },
              onDay: (iso) => act({ day: iso, cal: name }),
              onNav: (dir) => act({ nav: dir, cal: name }),
              onToggle: () => {},
              onYear: () => {},
            });
            ui.cal = mk('start');
            ui.cal2 = mk('end');
          }

          const wrap = util.el('div', '', ctx.stage);
          Object.assign(wrap.style, { position: 'absolute', inset: '0' });
          card = util.el('div', 'fd-card' + (look ? ` fd-${look}` : ''), wrap);
          card.dataset.role = 'form';
          if (extras.length > 4) card.classList.add('fd-dense');
          card.style.width = geo.cardW + 'px';
          util.el('div', 'fd-title', card, spec.scene.title);
          util.el('div', 'fd-sub', card, rng.pick(SUBS));
          if (spec.showToday) {
            const t = util.el('div', 'fd-today', card, `${word('today', 'Today')}: `);
            util.el('b', '', t, fmtLocal(spec.today, 'full'));
          }
          geo.body = card;
          for (const ex of extras.slice(0, nAbove)) staticRow(card, ex, util);

          if (spec.scenario === 'calendar' || spec.scenario === 'week') buildCalendar(ctx, false);
          else if (spec.scenario === 'month') buildMonthPicker(ctx);
          else if (spec.scenario === 'range') buildCalendar(ctx, true);
          else if (spec.scenario === 'segmented') buildSegmented(ctx);
          else if (spec.scenario === 'typed' && spec.longForm) buildText(ctx, null, spec.longShown, `Format: ${spec.longShown}`);
          else if (spec.scenario === 'typed') buildText(ctx, spec.mask, spec.maskShown || spec.mask, `Format: ${spec.maskShown || spec.mask}`);
          else if (spec.scenario === 'duration') buildDuration(ctx);
          else if (spec.control === 'text24') buildText(ctx, fam.helpers.MASK24, 'HH:MM', '24-hour clock, HH:MM');
          else if (spec.control === 'columns') buildTimeColumns(ctx);
          else if (spec.control === 'dropdowns') buildTimeDropdowns(ctx);
          else if (spec.control === 'clock') buildClock(ctx);
          else buildSpin(ctx);

          // Sampled placement inside the stage.
          const w = card.offsetWidth;
          const h = card.offsetHeight;
          const fx = rng.pick([0, 0.5, 0.5, 1, rng.float()]);
          const fy = rng.pick([0.5, 0.5, 0, 1, rng.float()]);
          card.style.left = Math.round(16 + fx * Math.max(0, size.width - w - 32)) + 'px';
          // A card taller than the stage minus its margins moves up into the margin instead of past the bottom.
          card.style.top = Math.max(0, Math.min(Math.round(12 + fy * Math.max(0, size.height - h - 24)), Math.floor(size.height - h))) + 'px';
          paint();
          return { anchors: [card], sync: () => paint() };
        }
      }

      function locateTarget(t, widget) {
        {
          if (t.field) return ctxRef.util.center(control);
          if (t.nav) return (t.cal === 'end' ? ui.cal2 : ui.cal).locateNav(t.nav);
          if (t.yearToggle) return ui.cal.locateToggle();
          if (t.year !== undefined) return ui.cal.locateYear(t.year);
          if (t.day) return (t.cal === 'end' ? ui.cal2 : ui.cal).locateDay(t.day);
          if (t.menu) return req(t.menu === 'month' ? ui.el.menuMonth : ui.el.menuYear, `${t.menu} menu`);
          if (t.pickMonth !== undefined) return req(ui.el.menuItems && ui.el.menuItems.get(t.pickMonth), `month ${t.pickMonth}`);
          if (t.pickYear !== undefined) return req(ui.el.menuItems && ui.el.menuItems.get(t.pickYear), `year ${t.pickYear}`);
          if (t.todayBtn || t.todayGoto) return req(ui.el.today, 'Today button');
          if (t.done) return req(ui.el.done, 'Done button');
          if (t.seg) return req(ui.segs[t.seg], `${t.seg} segment`);
          if (t.segSpin) return req(t.segSpin === 'up' ? ui.el.segUp : ui.el.segDown, `spinner ${t.segSpin}`);
          if (t.spinField) return req(ui.el[t.spinField], `${t.spinField} value`);
          if (t.spin) return ui.spin[t.spin].locate(t.dir);
          if (t.ampm) return spec.control === 'clock' ? req(ui.el[t.ampm], t.ampm) : ui.ampm.locate(t.ampm);
          if (t.dd) return ui.ddk[t.dd].locateTrigger();
          if (t.col && spec.control === 'dropdowns') return ui.ddk[t.col].locateOption(t.value);
          if (t.col) return ui.cols[t.col].locate(t.value);
          if (t.faceMode) return req(t.faceMode === 'hour' ? ui.el.hourPart : ui.el.minutePart, 'clock header');
          if (t.face) return req(ui.el.nums && ui.el.nums.get(t.value), `dial ${t.value}`);
          if (t.dur) return ui.dur[t.dur].locate(t.dir);
          if (t.durField) return req(ui.el[t.durField], `${t.durField} field`);
          if (t.preset !== undefined) return req(ui.el.presets.get(t.preset), `preset ${t.preset}`);
          if (t.stepBtn) return req(t.stepBtn === 'up' ? ui.el.stepup : ui.el.stepdown, 'step button');
          throw new Error(`set-date/${widget} cannot locate ${JSON.stringify(t)}`);
        }
      }

      env.widget({
        task: 'set-date',
        site: 'base',
        name: 'calendar',
        split: 'train',
        scenarios: ['calendar', 'typed', 'segmented', 'time', 'range', 'duration', 'month', 'week'],
        render: (ctx) => renderCard(ctx, ''),
        locate: (t) => locateTarget(t, 'calendar'),
      });

      env.widget({
        task: 'set-date',
        site: 'base',
        name: 'jqui',
        split: 'train',
        scenarios: ['calendar'],
        traits: { headers: ['selects'], todayBtn: true, todayMode: 'goto' },
        render: (ctx) => renderCard(ctx, 'jqui'),
        locate: (t) => locateTarget(t, 'jqui'),
      });

      env.widget({
        task: 'set-date',
        site: 'base',
        name: 'bootstrap',
        split: 'train',
        scenarios: ['calendar'],
        traits: { headers: ['zoom'], todayBtn: false },
        render: (ctx) => renderCard(ctx, 'bootstrap'),
        locate: (t) => locateTarget(t, 'bootstrap'),
      });

      env.widget({
        task: 'set-date',
        site: 'base',
        name: 'inline',
        split: 'train',
        scenarios: ['calendar'],
        traits: { inline: true, headers: ['arrows', 'arrows', 'selects', 'yearGrid'] },
        render: (ctx) => renderCard(ctx, 'inline'),
        locate: (t) => locateTarget(t, 'inline'),
      });
    })();

    return captured;
  }
  env.template('set-date/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`set-date/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('set-date/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`set-date/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`set-date/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['set-date/_base-assets', 'set-date/_base-time'] });
})();
