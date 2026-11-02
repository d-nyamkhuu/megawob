// find-fact/base: the base site's find-fact widgets (records, portal, dense, cards, dashboard) as a template.
// This file is their source. The design-* sites that started from a copy of them, and the composite sites that embed
// them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/find-fact.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/find-fact.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/find-fact.js`, HTML).href };
    /*
     * reference / find-fact / records: a small records app (title bar with app name and section tabs) whose
     * work area shows the source to read and the place to answer. The app frame is sized from ctx.size (and
     * kept clear of a floating end control inside the stage), with a sampled width and alignment.
     *   table       a data card (key/value record or a striped grid with a header row) and an "Answer" card
     *               with one or two labeled text fields, beside the table when it fits, else below it
     *   find-word   a reading card (serif paragraphs) and an answer field
     *   phone-book  a contact book: cards (1-3 per page) or compact rows; a pager (prev, numbers, next, or
     *               prev, "Page k of N", next) or a search field over a fixed-height result list. Phone, email
     *               and address are links; a status strip above the results reports the last pick ("Opened
     *               ... ", with an Undo for a wrong pick in recoverable episodes)
     *   similar     native checkboxes (one or two columns, plain rows or tiles)
     *   datagrid    a data-table card: optional filter box, clickable sortable headers (arrows show the sort),
     *               a fixed-height body, numbered pages, and the answer field in the card footer. 'hscroll':
     *               the table scrolls sideways in its pane (frozen first column, hidden native scrollbar plus a
     *               custom horizontal scrollbar bound with env.ui.listbox axis 'x'; the wheel scrolls too)
     *   join        two table cards side by side (compact when the stage is narrow) under an answer strip
     *   chart       an SVG bar or line chart with a value axis and grid lines (half-step minor lines when
     *               needed), optional value labels, and a tooltip on hover (bars / points are hover targets)
     *   tooltip     'icon': a table whose rows end in an info icon; hovering it pops a tooltip with the row's extra
     *               fields (built on hover, never in the DOM before); 'abbr': a notes list with dotted-underlined
     *               abbreviations (no title attribute) whose full name shows in a tooltip on hover
     *   locate, count  a document viewer: a tool row (Find button, "Expand all" when sections fold, an optional
     *               Ctrl+F tip), the sections in a pane that scrolls with the wheel and a custom scrollbar
     *               (env.ui.scrollPane), and a find bar floating over its top right, opened by Ctrl+F (a document
     *               keydown listener) or the Find button: query field, "i of n" counter, match-case and whole-word
     *               toggles, previous / next (Enter / Shift+Enter in the field), close (Escape). Matches come from the
     *               task's findMatches() and are drawn as <mark>s (the current one in another color, scrolled a
     *               third of the way down); folded sections are not searched. The answer card sits beside the
     *               document when the work area is at least 860 px wide, else a footer strip holds the answer field
     * answer=reply episodes (answerReply: true on every widget): the answer fields are removed once built (the find bar,
     * pagers and filters stay), so the page shows only what is looked up.
     * Five widgets share this file. LOOK: 'records' (above), 'portal' (early-web: bevelled window, fieldsets,
     * <table border=1>, "[2]" / "Next >>" text-link pagers, arrow-button scrollbars; every scenario but chart),
     * 'dense' (enterprise grid: small ruled cells; table, datagrid, join; datagrid mostly 'hscroll' with traits
     * vscroll, a sticky header row and frozen first column over a body that also scrolls vertically, with a custom
     * vertical scrollbar from a second env.ui.listbox) and 'cards' (mobile-style tiles: table records as tiles,
     * datagrid sort / filter / pages as a tile list with sort chips; table, phone-book, datagrid). Traits: dense
     * { gridModes, vscroll }, cards { gridModes }; opts.route is honoured by the logic (see its header).
     * The fifth, 'dashboard' (chart, tooltip), is a canvas analytics dashboard: see its section at the end of the file.
     * Mechanics from env.ui: textField (answers, search, filter, find), choices (checkboxes), buttons (pager,
     * links, headers, undo, find bar), listbox (horizontal scroll), scrollPane (the document). The app frame is the anchor.
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get APPS() { return APPS; },
        get TABS() { return TABS; },
        get ACTIVE() { return ACTIVE; },
        get AV_COLORS() { return AV_COLORS; },
        get SEARCH_ICON() { return SEARCH_ICON; },
        get NOTES() { return NOTES; },
        get fail() { return fail; },
        get must() { return must; },
        get fits() { return fits; },
        get INFO_ICON() { return INFO_ICON; },
        get BUILDERS() { return BUILDERS; },
        get ALL() { return ALL; },
        get WIDGETS() { return WIDGETS; },
        get DB_CSS() { return DB_CSS; },
        get DB_APPS() { return DB_APPS; },
        get DB_NAV() { return DB_NAV; },
        get DB_RANGES() { return DB_RANGES; },
        get DB_DONUT() { return DB_DONUT; },
        get DB_PALETTE() { return DB_PALETTE; },
        get cap1() { return cap1; },
        get view() { return view; }, set view(v) { view = v; },
        get LOOK() { return LOOK; }, set LOOK(v) { LOOK = v; },
        get findKeys() { return findKeys; }, set findKeys(v) { findKeys = v; },
        get dbView() { return dbView; }, set dbView(v) { dbView = v; },
        get ensureStyle() { return ensureStyle; },
        get usable() { return usable; },
        get firstBox() { return firstBox; },
        get frame() { return frame; },
        get card() { return card; },
        get table() { return table; },
        get pagerEl() { return pagerEl; },
        get input() { return input; },
        get answerForm() { return answerForm; },
        get tileOf() { return tileOf; },
        get buildTable() { return buildTable; },
        get buildFindWord() { return buildFindWord; },
        get buildPhoneBook() { return buildPhoneBook; },
        get buildSimilar() { return buildSimilar; },
        get colWidths() { return colWidths; },
        get buildDatagrid() { return buildDatagrid; },
        get buildJoin() { return buildJoin; },
        get buildChart() { return buildChart; },
        get buildTooltip() { return buildTooltip; },
        get buildFind() { return buildFind; },
        get dropAnswer() { return dropAnswer; },
        get dbVars() { return dbVars; },
        get renderDashboard() { return renderDashboard; },
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
      if (__has('usable')) usable = __parts['usable'](usable, __scope);
      if (__has('firstBox')) firstBox = __parts['firstBox'](firstBox, __scope);
      if (__has('frame')) frame = __parts['frame'](frame, __scope);
      if (__has('card')) card = __parts['card'](card, __scope);
      if (__has('table')) table = __parts['table'](table, __scope);
      if (__has('pagerEl')) pagerEl = __parts['pagerEl'](pagerEl, __scope);
      if (__has('input')) input = __parts['input'](input, __scope);
      if (__has('answerForm')) answerForm = __parts['answerForm'](answerForm, __scope);
      if (__has('tileOf')) tileOf = __parts['tileOf'](tileOf, __scope);
      if (__has('buildTable')) buildTable = __parts['buildTable'](buildTable, __scope);
      if (__has('buildFindWord')) buildFindWord = __parts['buildFindWord'](buildFindWord, __scope);
      if (__has('buildPhoneBook')) buildPhoneBook = __parts['buildPhoneBook'](buildPhoneBook, __scope);
      if (__has('buildSimilar')) buildSimilar = __parts['buildSimilar'](buildSimilar, __scope);
      if (__has('colWidths')) colWidths = __parts['colWidths'](colWidths, __scope);
      if (__has('buildDatagrid')) buildDatagrid = __parts['buildDatagrid'](buildDatagrid, __scope);
      if (__has('buildJoin')) buildJoin = __parts['buildJoin'](buildJoin, __scope);
      if (__has('buildChart')) buildChart = __parts['buildChart'](buildChart, __scope);
      if (__has('buildTooltip')) buildTooltip = __parts['buildTooltip'](buildTooltip, __scope);
      if (__has('buildFind')) buildFind = __parts['buildFind'](buildFind, __scope);
      if (__has('dropAnswer')) dropAnswer = __parts['dropAnswer'](dropAnswer, __scope);
      if (__has('dbVars')) dbVars = __parts['dbVars'](dbVars, __scope);
      if (__has('renderDashboard')) renderDashboard = __parts['renderDashboard'](renderDashboard, __scope);

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('find-fact/_base-style').CSS);

      const APPS = __has('APPS') ? __parts['APPS'](undefined, __scope) : (['Ledger', 'Recordly', 'Filebase', 'Archivo', 'Datasheet', 'Registry', 'Tablewise', 'Lookout']);
      const TABS = __has('TABS') ? __parts['TABS'](undefined, __scope) : ({
        table: ['Records', 'Reports', 'Import', 'Settings'],
        'find-word': ['Library', 'Reading', 'Notes', 'Settings'],
        'phone-book': ['Contacts', 'Groups', 'Calls', 'Settings'],
        similar: ['Thesaurus', 'Quizzes', 'Lists', 'Settings'],
        datagrid: ['Data', 'Views', 'Exports', 'Settings'],
        join: ['Tables', 'Relations', 'Queries', 'Settings'],
        chart: ['Dashboard', 'Charts', 'Alerts', 'Settings'],
        tooltip: ['Overview', 'Details', 'Activity', 'Settings'],
        locate: ['Documents', 'Shared', 'History', 'Settings'],
        count: ['Documents', 'Review', 'History', 'Settings'],
      });
      const ACTIVE = __has('ACTIVE') ? __parts['ACTIVE'](undefined, __scope) : ({ table: 0, 'find-word': 1, 'phone-book': 0, similar: 1, datagrid: 0, join: 1, chart: 1, tooltip: 0, locate: 0, count: 1 });
      const AV_COLORS = __has('AV_COLORS') ? __parts['AV_COLORS'](undefined, __scope) : (['#2f6fed', '#d9480f', '#0b8a5b', '#7c3aed', '#c2255c', '#0c8599', '#8d5524', '#5c7cfa']);
      const SEARCH_ICON = __has('SEARCH_ICON') ? __parts['SEARCH_ICON'](undefined, __scope) : ('<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14"/></svg>');
      const NOTES = __has('NOTES') ? __parts['NOTES'](undefined, __scope) : (['Type the value exactly as asked.', 'Copy values exactly as they appear.', 'Leading and trailing spaces are ignored.']);

      let view = __has('view') ? __parts['view'](undefined, __scope) : (null); // live episode: { locate(t), sync(m) }
      let LOOK = __has('LOOK') ? __parts['LOOK'](undefined, __scope) : ('records'); // the widget being rendered: 'records' | 'portal' | 'dense' | 'cards'

      function ensureStyle() {
        if (document.getElementById('rl-style')) return;
        const s = document.createElement('style');
        s.id = 'rl-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      // Usable part of the stage (stage-local px): the whole stage minus a floating end control inside it.
      function usable(ctx) {
        const box = { x: 0, y: 0, w: ctx.size.width, h: ctx.size.height };
        const st = ctx.stage.getBoundingClientRect();
        const sub = env.submitEl && env.submitEl.getBoundingClientRect();
        if (sub && sub.width && sub.left < st.right && sub.right > st.left && sub.top < st.bottom && sub.bottom > st.top) {
          const cutH = st.bottom - sub.top + 10;
          const cutW = st.right - sub.left + 10;
          if (cutH * box.w <= cutW * box.h) box.h -= cutH;
          else box.w -= cutW;
        }
        return box;
      }

      // Center of an element's first line box (wrapped links, inline spans).
      function firstBox(el) {
        const rs = el.getClientRects();
        const r = rs.length ? rs[0] : el.getBoundingClientRect();
        if (!r || !r.width) return null;
        return [r.left + Math.min(r.width / 2, 40), r.top + r.height / 2];
      }

      function frame(ctx) {
        const { util, rng, spec } = ctx;
        const box = usable(ctx);
        const app = util.el('div', 'rl-app', ctx.stage);
        app.dataset.look = LOOK;
        const maxW = Math.min(box.w - 16, 1180);
        const W = Math.round(Math.max(Math.min(maxW, 640), maxW * rng.float(spec.scenario === 'datagrid' || spec.scenario === 'join' ? 0.92 : 0.8, 1)));
        const H = Math.round(Math.min(box.h - 12, 760));
        app.style.width = W + 'px';
        app.style.height = H + 'px';
        const align = rng.pick(['start', 'center', 'center', 'end']);
        const left = align === 'start' ? 8 : align === 'end' ? box.w - W - 8 : (box.w - W) / 2;
        app.style.left = Math.round(box.x + Math.max(0, left)) + 'px';
        app.style.top = Math.round(box.y + Math.max(0, (box.h - H) / 2)) + 'px';
        const bar = util.el('div', 'rl-bar', app);
        const brand = util.el('div', 'rl-brand', bar);
        util.el('span', 'rl-mark', brand);
        util.el('span', '', brand, rng.pick(APPS));
        const tabs = util.el('div', 'rl-tabs', bar);
        if (W >= 700) TABS[spec.scenario].forEach((t, i) => util.el('span', i === ACTIVE[spec.scenario] ? 'on' : '', tabs, t));
        const user = util.el('div', 'rl-user', bar);
        const who = rng.pick(['J. Doe', 'A. Kim', 'M. Silva', 'R. Lee', 'T. Park', 'S. Okafor']);
        util.el('span', '', user, who);
        util.el('i', '', user, who.replace(/[^A-Z]/g, ''));
        const work = util.el('div', 'rl-work', app);
        // Room inside the work area (padding 16 / 20).
        const room = { w: W - 2 - 40, h: H - 2 - 46 - 32 };
        // Last-resort widening (a builder whose content does not fit): full usable width, same alignment.
        room.grow = () => {
          const W2 = Math.round(maxW);
          if (W2 <= W) return false;
          const l2 = align === 'start' ? 8 : align === 'end' ? box.w - W2 - 8 : (box.w - W2) / 2;
          app.style.width = W2 + 'px';
          app.style.left = Math.round(box.x + Math.max(0, l2)) + 'px';
          room.w = W2 - 2 - 40;
          return true;
        };
        return { app, work, room };
      }

      function card(util, parent, title, sub) {
        if (LOOK === 'portal') {
          // A plain fieldset with a legend (no title bar).
          const c = util.el('fieldset', 'rl-card', parent);
          const h = util.el('legend', '', c, title);
          if (sub) util.el('small', '', h, ` (${sub})`);
          const b = util.el('div', 'rl-card-b', c);
          return { card: c, body: b };
        }
        const c = util.el('div', 'rl-card', parent);
        const h = util.el('h3', '', c, title);
        if (sub) util.el('small', '', h, sub);
        const b = util.el('div', 'rl-card-b', c);
        return { card: c, body: b };
      }

      // A data table: portal pages use the HTML attributes of the era (border=1, cellpadding, cellspacing).
      function table(util, parent, cls) {
        const t = util.el('table', cls, parent);
        if (LOOK === 'portal') {
          t.setAttribute('border', '1');
          t.setAttribute('cellpadding', '4');
          t.setAttribute('cellspacing', '0');
        }
        return t;
      }

      // A pager control: a button, or on portal pages a bracketed text link ("[2]", "Next >>").
      function pagerEl(util, parent, label) {
        if (LOOK !== 'portal') {
          const b = util.el('button', 'rl-pg', parent, label);
          b.type = 'button';
          return b;
        }
        const a = util.el('a', 'rl-pg', parent, label);
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());
        return a;
      }

      function input(util, parent, role, placeholder) {
        const inp = util.el('input', 'rl-input', parent);
        inp.type = 'text';
        inp.autocomplete = 'off';
        inp.spellcheck = false;
        inp.dataset.role = role;
        if (placeholder) inp.placeholder = placeholder;
        return inp;
      }

      // Text fields for answers: [{ label }] -> env.ui.textField per field.
      function answerForm(ctx, parent, labels, model, onEdit) {
        const { util, rng } = ctx;
        const inline = labels.length > 1 && labels.every((l) => l && l.length <= 14) && rng.bool(0.5);
        const { card: c, body } = card(util, parent, labels.length > 1 ? 'Answer form' : rng.pick(['Answer', 'Your answer', 'Response']));
        c.classList.add('rl-form');
        if (inline) c.classList.add('inline');
        const fields = labels.map((label, i) => {
          const f = util.el('div', 'rl-field', body);
          const id = `rl-f${i}`;
          if (label) {
            const l = util.el('label', '', f, label);
            l.htmlFor = id;
          }
          const inp = input(util, f, 'field', label ? '' : rng.pick(['Type your answer', 'Answer', 'Type here']));
          inp.id = id;
          return env.ui.textField(inp, { value: model.answers[i] || '', label: `answer${i}`, onInput: (v) => onEdit(i, v) });
        });
        if (labels.length === 1 && rng.bool(0.4)) util.el('div', 'rl-note', body, rng.pick(NOTES));
        return fields;
      }

      const fail = __has('fail') ? __parts['fail'](undefined, __scope) : { fail: (t) => { throw new Error(`find-fact/records cannot locate ${JSON.stringify(t)}`); } }.fail;
      const must = __has('must') ? __parts['must'](undefined, __scope) : { must: (p, t) => p || fail(t) }.must;
      const fits = __has('fits') ? __parts['fits'](undefined, __scope) : { fits: (el, room) => {
        const r = el.getBoundingClientRect();
        return r.width <= room.w + 1 && r.height <= room.h + 1;
      } }.fits;

      // One record as a tile (cards look): the first cell is the title, the others are "column  value" lines.
      function tileOf(util, parent, columns, row, numeric) {
        const tile = util.el('div', 'rl-tile', parent);
        util.el('h4', '', tile, row[0]);
        row.forEach((v, i) => {
          if (i === 0) return;
          const line = util.el('div', 'rl-tl' + (numeric(i) ? ' num' : ''), tile);
          util.el('span', 'k', line, columns[i]);
          util.el('span', 'v', line, v);
        });
        return tile;
      }

      // ---------------------------------------------------------------- table

      function buildTable(ctx, work, up, room) {
        return env.templateLib('find-fact/_base-records').buildTable(__scope, ctx, work, up, room);
      }

      // ---------------------------------------------------------------- find-word

      function buildFindWord(ctx, work, up, room) {
        return env.templateLib('find-fact/_base-records').buildFindWord(__scope, ctx, work, up, room);
      }

      // ---------------------------------------------------------------- phone-book

      function buildPhoneBook(ctx, work, up, room) {
        return env.templateLib('find-fact/_base-records').buildPhoneBook(__scope, ctx, work, up, room);
      }

      // ---------------------------------------------------------------- similar

      function buildSimilar(ctx, work, up, room) {
        return env.templateLib('find-fact/_base-records').buildSimilar(__scope, ctx, work, up, room);
      }

      // ---------------------------------------------------------------- datagrid

      // Column widths in px from the longest text in each column (deterministic, independent of the page).
      function colWidths(spec, fs) {
        return spec.cols.map((c, i) => {
          const len = Math.max(c.name.length * 0.95 + 2, ...spec.rows.map((r) => String(r[i]).length));
          return Math.round(Math.min(i === 0 ? 300 : 260, Math.max(64, len * fs * (i === 0 ? 0.64 : 0.58) + 26)));
        });
      }

      function buildDatagrid(ctx, work, up, room) {
        return env.templateLib('find-fact/_base-grid').buildDatagrid(__scope, ctx, work, up, room);
      }

      // ---------------------------------------------------------------- join

      function buildJoin(ctx, work, up, room) {
        return env.templateLib('find-fact/_base-records').buildJoin(__scope, ctx, work, up, room);
      }

      // ---------------------------------------------------------------- chart

      function buildChart(ctx, work, up, room) {
        return env.templateLib('find-fact/_base-chart').buildChart(__scope, ctx, work, up, room);
      }

      // ---------------------------------------------------------------- tooltip

      const INFO_ICON = __has('INFO_ICON') ? __parts['INFO_ICON'](undefined, __scope) : ('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="10" cy="10" r="7.5"/><path d="M10 9v5" stroke-linecap="round"/><circle cx="10" cy="6.2" r=".6" fill="currentColor"/></svg>');

      // Facts that only a tooltip shows: a list with an info icon per row (mode 'icon') or notes with dotted
      // abbreviations (mode 'abbr'). The tooltip's text is created on hover (no title attribute, nothing hidden in
      // the DOM before it shows).
      function buildTooltip(ctx, work, up, room) {
        return env.templateLib('find-fact/_base-find').buildTooltip(__scope, ctx, work, up, room);
      }

      // ---------------------------------------------------------------- locate, count (find in page)

      let findKeys = __has('findKeys') ? __parts['findKeys'](undefined, __scope) : (null); // the live episode's Ctrl+F listener on document (replaced on every render)

      function buildFind(ctx, work, up, room) {
        return env.templateLib('find-fact/_base-find').buildFind(__scope, ctx, work, up, room);
      }

      const BUILDERS = __has('BUILDERS') ? __parts['BUILDERS'](undefined, __scope) : ({ table: buildTable, 'find-word': buildFindWord, 'phone-book': buildPhoneBook, similar: buildSimilar,
        datagrid: buildDatagrid, join: buildJoin, chart: buildChart, tooltip: buildTooltip, locate: buildFind, count: buildFind });

      // The widgets of this file: one render, four looks (LOOK) that change markup and mechanics, not only colors.
      //   records  the original app: rounded cards, <table> grids, button pagers
      //   portal   an early-web portal: bevelled window, fieldsets, <table border=1>, "[2]" / "Next >>" text-link
      //            pagers, arrow-button scrollbars; the datagrid keeps every mode
      //   dense    an enterprise grid: small ruled cells; datagrid mostly 'hscroll' with a sticky header row and
      //            a frozen first column, whose body also scrolls vertically (the asked row starts below the fold)
      //   cards    a mobile-style list: record tables as tiles, datagrid modes sort / filter / pages as a tile
      //            list with sort chips instead of header cells
      const ALL = __has('ALL') ? __parts['ALL'](undefined, __scope) : (['table', 'find-word', 'phone-book', 'similar', 'datagrid', 'join', 'chart', 'tooltip', 'locate', 'count']);
      // Knob answer=reply (kit/runtime/answer.js): the answer goes in the agent's ending message, so the page drops its
      // answer fields (forms, footer and strip fields, the dashboard's answer box) once built, before anchors are taken.
      function dropAnswer(ctx, app) {
        if (ctx.episode.answer !== 'reply') return;
        app.querySelectorAll('.rl-form, .rl-ans, .rl-strip > label, .rl-strip > .rl-input, .db-ans').forEach((el) => el.remove());
        app.querySelectorAll('.rl-strip').forEach((el) => { if (!el.textContent.trim()) el.remove(); });
      }

      const WIDGETS = __has('WIDGETS') ? __parts['WIDGETS'](undefined, __scope) : ({
        records: { scenarios: ALL },
        portal: { scenarios: ALL.filter((v) => v !== 'chart') },
        dense: { scenarios: ['table', 'datagrid', 'join'], traits: { gridModes: ['hscroll', 'hscroll', 'sort', 'filter', 'pages'], vscroll: [true] } },
        cards: { scenarios: ['table', 'phone-book', 'datagrid'], traits: { gridModes: ['sort', 'filter', 'pages'] } },
      });

      if (__has('stmt0.0')) __parts['stmt0.0'](undefined, __scope);
      else for (const [look, def] of Object.entries(WIDGETS)) {
        env.widget({
          task: 'find-fact',
          site: 'base',
          name: look,
          split: 'train',
          scenarios: def.scenarios,
          ...(def.traits ? { traits: def.traits } : {}),
          answerReply: true,

          render(ctx) {
            LOOK = look;
            ensureStyle();
            const { app, work, room } = frame(ctx);
            const up = (patch) => ctx.update({ ...ctx.model, ...patch });
            view = BUILDERS[ctx.spec.scenario](ctx, work, up, room);
            dropAnswer(ctx, app);
            return { anchors: [app], sync: (m) => view.sync(m) };
          },

          locate(t) {
            return must(view && view.locate(t), t);
          },
        });
      }
      // ================================================================ widget: dashboard
      /*
       * reference / find-fact / dashboard: an analytics dashboard drawn on one <canvas>. KPI tiles, the asked chart
       * (bar or line, value axis, grid lines, legend, optional value labels), a side panel (a donut with a legend, or a
       * sparkline) and hover tooltips are all pixels: there is no DOM text, SVG or ARIA for any value, so a DOM or
       * accessibility-tree agent cannot read the answer. Only the top bar (app name, a date-range chip) and the answer
       * field are DOM. Hit testing and locate() come from the geometry computed at render.
       *   chart    every mode (value, max, min, hover); hovering a column band shows a canvas tooltip "cat: value unit"
       *   tooltip  mode 'icon': a status board (columns + an info icon per row) drawn on the canvas, hovering an icon
       *            draws the row's tooltip fields; mode 'abbr': meeting notes with dotted abbreviations, hovering one
       *            draws its full name
       * Decoys (KPI values, donut shares, sparkline, activity bars) come from ctx.rng and never name the asked fact.
       */
      const DB_CSS = __has('DB_CSS') ? __parts['DB_CSS'](undefined, __scope) : (env.templateLib('find-fact/_base-style').DB_CSS);
      const DB_APPS = __has('DB_APPS') ? __parts['DB_APPS'](undefined, __scope) : (['Metricly', 'Pulseboard', 'Statwise', 'Insightly', 'Trendline', 'Dataloom']);
      const DB_NAV = __has('DB_NAV') ? __parts['DB_NAV'](undefined, __scope) : (['Overview', 'Reports', 'Segments', 'Alerts', 'Exports', 'Goals', 'Team']);
      const DB_RANGES = __has('DB_RANGES') ? __parts['DB_RANGES'](undefined, __scope) : (['Last 7 days', 'Last 30 days', 'This quarter', 'Year to date', 'Last 12 months']);
      const DB_DONUT = __has('DB_DONUT') ? __parts['DB_DONUT'](undefined, __scope) : ([['Share by channel', ['Web', 'Store', 'Partners', 'Phone', 'Email']],
        ['Traffic sources', ['Search', 'Direct', 'Referral', 'Social', 'Newsletter']],
        ['Plan mix', ['Free', 'Starter', 'Team', 'Business']]]);
      const DB_PALETTE = __has('DB_PALETTE') ? __parts['DB_PALETTE'](undefined, __scope) : (['#4c6ef5', '#12b886', '#fab005', '#e64980', '#7950f2', '#15aabf', '#fd7e14']);

      let dbView = __has('dbView') ? __parts['dbView'](undefined, __scope) : (null);

      function dbVars() {
        const cs = getComputedStyle(document.documentElement);
        const g = (k, d) => (cs.getPropertyValue(`--${k}`) || '').trim() || d;
        return { bg: g('bg', '#f4f5f7'), panel: g('panel', '#fff'), fg: g('fg', '#1d2330'), muted: g('muted', '#6b7280'),
          line: g('line', '#d5d9e0'), accent: g('accent', '#2f6fed'), font: getComputedStyle(document.body).fontFamily || 'sans-serif' };
      }

      function renderDashboard(ctx) {
        return env.templateLib('find-fact/_base-dashboard').renderDashboard(__scope, ctx);
      }
      const cap1 = __has('cap1') ? __parts['cap1'](undefined, __scope) : { cap1: (s) => s.charAt(0).toUpperCase() + s.slice(1) }.cap1;

      env.widget({
        task: 'find-fact',
        site: 'base',
        name: 'dashboard',
        split: 'train',
        scenarios: ['chart', 'tooltip'],
        answerReply: true,
        render: renderDashboard,
        locate(t) {
          const p = dbView && dbView.locate(t);
          if (!p) throw new Error(`find-fact/dashboard cannot locate ${JSON.stringify(t)}`);
          return p;
        },
      });
    })();

    return captured;
  }
  env.template('find-fact/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`find-fact/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('find-fact/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`find-fact/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`find-fact/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['find-fact/_base-style', 'find-fact/_base-records', 'find-fact/_base-grid', 'find-fact/_base-find', 'find-fact/_base-chart', 'find-fact/_base-dashboard'] });
})();
