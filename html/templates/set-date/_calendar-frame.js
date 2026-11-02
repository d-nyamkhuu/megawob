/* set-date/_calendar-frame: shared template builders; S retains the live template scope and design hooks. */
(function () {
  'use strict';
  env.template('set-date/_calendar-frame', () => ({
    ensureStyle(S) {
      if (document.getElementById('fd-style')) return;
      const s = document.createElement('style');
      s.id = 'fd-style';
      s.textContent = S.D.css;
      document.head.append(s);
    },

    act(S, t) {
      const before = S.ctxRef.model;
      const after = S.fam.helpers.apply(before, S.spec, t);
      S.ctxRef.log('pick', { target: t });
      if (after !== before) S.ctxRef.update(after);
      S.P.paint();
    },

    paint(S) {
      if (S.ui.cal) S.ui.cal.clear();
      if (S.ui.calEnd) S.ui.calEnd.clear();
      for (const f of S.paintFns) f(S.ctxRef.model);
      if (S.ui.dd) S.ui.dd.set({ open: !!S.geo.inline || !!S.ctxRef.model.open });
      S.P.painted(S.ctxRef);
    },

    content(S) { return env.content; },

    fmtLocal(S, iso, style) { return S.P.content().formatDate ? S.P.content().formatDate(iso, S.spec.locale, style) : S.fam.helpers.fmtDate(iso, 'short'); },

    word(S, k, en) { return S.P.content().uiWord ? S.P.content().uiWord(k, S.spec.locale) || en : en; },

    req(S, el, what) {
      if (!el || !el.isConnected) throw new Error(`set-date: ${what} is not rendered`);
      return S.ctxRef.util.center(el);
    },

    fieldRow(S, parent, label, help, util) {
      const row = util.el('div', 'fd-row' + (S.D.fieldClass ? ' ' + S.D.fieldClass : ''), parent);
      const lab = util.el('label', 'fd-label', row, S.P.fieldLabel(label));
      util.el('b', '', lab, '*');
      return { row, help: help === null ? null : util.el('div', 'fd-help', null, help) };
    },

    staticRow(S, parent, [k, v], util) {
      const row = util.el('div', 'fd-row', parent);
      util.el('div', 'fd-label', row, k);
      util.el('div', 'fd-static', row, v);
      S.P.staticCreated(parent, row, k, v, util);
      return row;
    },

    clickControl(S, row, icon, util) {
      const c = util.el('div', 'fd-control', row);
      c.dataset.role = 'field';
      c.insertAdjacentHTML('beforeend', icon);
      return c;
    },

    monthName(S, m) { return (S.L.months || S.fam.helpers.MONTHS)[m - 1]; },

    monthSelectName(S, m) { return (S.L.monthsShort || S.fam.helpers.MONTHS)[m - 1]; },

    monthTitle(S, y, m) { return S.P.content().formatDate ? S.P.content().formatDate(`${y}-${String(m).padStart(2, '0')}-01`, S.spec.locale, 'monthYear') : `${S.P.monthName(m)} ${y}`; },

    placePop(S, util) {
      S.pop = util.el('div', 'fd-pop', S.card);
      S.pop.dataset.role = 'picker';
      S.pop.hidden = true;
      if (S.D.inlineBinding !== null && S.spec.scenario === 'range') {
        S.P.bindInlineField(S.control);
        return;
      }
      S.ui.dd = env.ui.dropdown(S.control, S.pop, {
        label: 'picker',
        open: !!S.geo.inline || !!S.ctxRef.model.open,
        show: () => {}, // P.paint() owns the popup's visibility and contents
        onOpenChange: (open, reason) => S.P.act(reason === 'outside' ? { outside: true } : { field: 'main' }),
      });
    },

    sizePop(S, w, h) {
      const top = S.control.offsetTop + S.control.offsetHeight + 6;
      Object.assign(S.pop.style, { left: S.control.offsetLeft + 'px', top: top + 'px', width: w + 'px', height: h + 'px' });
      return top + h + 18;
    },

    fitCard(S, height, util) {
      const spare = height - S.card.offsetHeight;
      if (S.P.needsNotes(spare)) {
        const row = util.el('div', 'fd-row fd-notes', S.card);
        util.el('div', 'fd-label', row, S.D.notesLabel);
        util.el('div', 'fd-static', row, S.geo.note);
      }
      S.card.style.height = Math.max(S.card.offsetHeight, height) + 'px';
    },

    popRoom(S, size) {
      return size.height - 24 - (S.control.offsetTop + S.control.offsetHeight + 6) - 18;
    },

    fieldLabel(S, label) { return label + ' '; },

    needsNotes(S, spare) { return spare > 96; },

    bindInlineField(S, el) {
      if (S.D.inlineBinding === 'none') return;
      if (S.D.inlineBinding === 'button') {
        el.tabIndex = 0;
        el.setAttribute('role', 'button');
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); S.P.act({ field: 'main' }); }
          else if (e.key === 'Escape' && S.ctxRef.model.open) { e.preventDefault(); S.P.act({ outside: true }); }
        });
      }
      el.addEventListener('click', () => S.P.act({ field: 'main' }));
    },

    calendarOpen(S, m, range) { return (range && S.D.inlineRange) || m.open; },

    calendarFields(S, ctx, range, row, txt) {
      if (!range || S.D.rangeLayout !== 'nested') return {};
      const { util } = ctx;
      row.classList.add('fd-range-fields');
      const endRow = util.el('div', 'fd-end-field', row);
      util.el('label', 'fd-label', endRow, 'Last day (End date)');
      const endControl = S.P.clickControl(endRow, S.D.calendarIcon, util);
      const endTxt = util.el('span', 'fd-txt', endControl);
      endControl.addEventListener('click', () => { if (!S.ctxRef.model.open) S.P.act({ field: 'main' }); });
      return { endControl, endTxt };
    },

    rangeReadout(S, ctx, m, txt, fields) {
      const { util } = ctx;
      const separate = S.D.rangeLayout === 'nested';
      const a = util.el('span', m.start ? '' : 'fd-ph', txt, m.start ? S.P.fmtLocal(m.start, S.geo.disp) : separate ? 'Select date' : S.spec.scene.label);
      a.dataset.part = 'start';
      if (separate) {
        fields.endTxt.replaceChildren();
        util.el('span', m.end ? '' : 'fd-ph', fields.endTxt, m.end ? S.P.fmtLocal(m.end, S.geo.disp) : 'Select date');
      } else {
        util.el('span', 'fd-arrowr', txt, '  →  ');
        util.el('span', m.end ? '' : 'fd-ph', txt, m.end ? S.P.fmtLocal(m.end, S.geo.disp) : S.spec.scene.label2);
      }
    },

    extras(S, ctx) { return S.spec.scene.extra.slice(); },

    positioned(S, ctx) {
      if (S.D.openInitial) ctx.update({ ...ctx.model, open: true });
      if (!S.D.timeSummary) return;
      const { util } = ctx;
      const summary = document.querySelector('.ds-reservation-values');
      if (summary) {
        const extras = S.spec.scene.extra.slice();
        if (!extras.some((x) => /name/i.test(x[0]))) extras.unshift(['Name', 'Library Member']);
        extras.forEach((x) => util.el('div', '', summary, x[0] + ': ' + x[1]));
        const time = util.el('div', '', summary);
        S.paintFns.push((m) => { time.textContent = S.spec.scene.label + ': ' + S.fam.helpers.fmt12(m.value); });
      }
    },

    rendered(S, ctx) {
      if (S.D.fit === 'stage') {
        let z = 1;
        for (let i = 0; i < 4; i++) {
          const s = ctx.stage.getBoundingClientRect();
          const r = S.card.getBoundingClientRect();
          if (r.bottom <= s.bottom || r.height <= 0 || s.bottom - 1 <= r.top) return;
          z = Math.max(0.6, (z * (s.bottom - 1 - r.top)) / r.height);
          S.card.style.setProperty('transform-origin', 'top left', 'important');
          S.card.style.setProperty('transform', `scale(${z})`, 'important');
        }
      } else if (S.D.fit) {
        const rr = S.card.getBoundingClientRect();
        const sr = ctx.stage.getBoundingClientRect();
        const ratio = Math.min(1, (S.D.fit === 'height' ? ctx.size.height - 8 : sr.bottom - rr.top - 8) / rr.height);
        if (ratio < 1) {
          S.card.style.transformOrigin = 'top left';
          S.card.style.transform = `scale(${ratio})`;
        }
      }
    },

    geometry(S, ctx, extras, nAbove) {
      const { rng, size } = ctx;
      return {
        cardW: Math.min(size.width - 32, Array.isArray(S.D.cardWidth) ? rng.int(...S.D.cardWidth) : S.D.cardWidth),
        cell: rng.int(34, 42),
        row: rng.int(25, 28),
        round: rng.pick(['50%', '8px']),
        showOut: S.D.showOut === null ? S.spec.scenario === 'calendar' && rng.bool(0.5) : S.D.showOut,
        disp: S.D.display === null ? rng.pick(S.spec.scenario === 'range' ? ['short', 'medium', 'numeric'] : ['short', 'medium', 'long', 'full', 'iso']) : S.D.display,
        placeholder: S.D.placeholder === null ? rng.pick(['Select a date', 'Choose date', 'Pick a date']) : S.D.placeholder,
        hour12First: rng.bool(0.5),
        padHour: rng.bool(0.5),
        vertAmpm: rng.bool(0.5),
        extrasBelow: extras.slice(nAbove),
        note: rng.pick(['Anything we should know?', 'Add a note', 'Optional comments']),
      };
    },

    initUI(S, ctx) {
      S.ui = { spin: {}, cols: {}, dur: {}, el: {} };
      const math = { days: S.fam.helpers.days, fromDays: S.fam.helpers.fromDays, weekday: S.fam.helpers.weekday };
      S.ui.cal = env.ui.calendar({
        label: S.D.calendarLabels[0],
        weekStart: S.spec.weekStart || 0,
        math,
        onDay: (iso) => S.P.calendarAction('day', iso, 'start'),
        onNav: (dir) => S.P.calendarAction('nav', dir, 'start'),
        onToggle: () => S.P.act({ yearToggle: true }),
        onYear: (y) => S.P.act({ year: y }),
      });
      if (S.D.splitCalendars) S.ui.calEnd = env.ui.calendar({
        label: S.D.calendarLabels[1],
        weekStart: S.spec.weekStart || 0,
        math,
        onDay: (iso) => S.P.calendarAction('day', iso, 'end'),
        onNav: (dir) => S.P.calendarAction('nav', dir, 'end'),
        ...(S.D.endToggle ? { onToggle: () => S.P.act({ yearToggle: true }), onYear: (y) => S.P.act({ year: y }) } : {}),
      });
    },

    calendarAction(S, kind, value, side) {
      if (S.D.openOnPick && !S.ctxRef.model.open) S.P.act({ field: 'main' });
      S.P.act({ [kind]: value, ...(S.D.splitCalendars ? { cal: side } : {}) });
    },

    buildControl(S, ctx) {
      if (S.spec.scenario === 'calendar') S.P.buildCalendar(ctx, false);
      else if (S.spec.scenario === 'range') S.P.buildCalendar(ctx, true);
      else if (S.spec.scenario === 'typed') S.P.buildTyped(ctx);
      else if (S.spec.scenario === 'duration') S.P.buildDuration(ctx);
      else if (S.spec.control === 'dropdowns') S.P.buildDropdowns(ctx);
      else if (S.spec.control === 'text24') S.P.buildText(ctx, S.fam.helpers.MASK24, 'HH:MM', '24-hour clock, HH:MM');
      else if (S.spec.control === 'columns') S.P.buildTimeColumns(ctx);
      else if (S.spec.control === 'clock') S.P.buildClock(ctx);
      else S.P.buildSpin(ctx);
    },

    begin(S) {},

    staticCreated(S) {},

    day(S, cell, iso, day, inMonth, side) { if (S.D.daySide && side) cell.dataset.cal = side; },

    gridBuilt(S) {},

    calendarLabel(S, range) { return range ? S.D.rangeLayout === 'nested' ? 'First day (Start date)' : `${S.spec.scene.label} – ${S.spec.scene.label2}` : S.spec.scene.label; },

    calendarRow(S) {},

    calendarHelp(S) {},

    calendarExtras(S) {},

    calendarPopup(S, ctx, range, row, help) { if (range && S.D.rangeLayout === 'nested') S.card.append(help); },

    calendarSized(S) {},

    calendarPainting(S) {},

    calendarOpened(S) { if (S.D.weekCount === 'popup') S.pop.style.setProperty('--weeks', '1'); },

    textCreated(S) {},

    textHelp(S) {},

    cardCreated(S) {},

    heading(S) {},

    bodyStart(S) {},

    built(S) {},

    painted(S) {},

    locate(S, t) {
      if (t.field) return S.ctxRef.util.center(S.control);
      if (t.dd) return S.P.req(S.ui.el.triggers[t.dd], `${t.dd} dropdown`);
      if (t.nav) return (t.cal === 'end' ? S.ui.calEnd : S.ui.cal).locateNav(t.nav);
      if (t.yearToggle) return S.ui.cal.locateToggle();
      if (t.year !== undefined) return S.ui.cal.locateYear(t.year);
      if (t.day) return (t.cal === 'end' ? S.ui.calEnd : S.ui.cal).locateDay(t.day);
      if (t.menu) return S.P.req(t.menu === 'month' ? S.ui.el.menuMonth : S.ui.el.menuYear, `${t.menu} menu`);
      if (t.pickMonth !== undefined) return S.P.req(S.ui.el.menuItems && S.ui.el.menuItems.get(t.pickMonth), `month ${t.pickMonth}`);
      if (t.pickYear !== undefined) return S.P.req(S.ui.el.menuItems && S.ui.el.menuItems.get(t.pickYear), `year ${t.pickYear}`);
      if (t.todayBtn) return S.P.req(S.ui.el.today, 'Today button');
      if (t.spinField) return S.P.req(S.ui.el[t.spinField], `${t.spinField} value`);
      if (t.spin) return S.ui.spin[t.spin].locate(t.dir);
      if (t.ampm) return S.spec.control === 'clock' ? S.P.req(S.ui.el[t.ampm], t.ampm) : S.ui.ampm.locate(t.ampm);
      if (t.col) return S.ui.cols[t.col].locate(t.value);
      if (t.faceMode) return S.P.req(t.faceMode === 'hour' ? S.ui.el.hourPart : S.ui.el.minutePart, 'clock header');
      if (t.face) return S.P.req(S.ui.el.nums && S.ui.el.nums.get(t.value), `dial ${t.value}`);
      if (t.dur) return S.ui.dur[t.dur].locate(t.dir);
      if (t.durField) return S.P.req(S.ui.el[t.durField], `${t.durField} field`);
      if (t.preset !== undefined) return S.P.req(S.ui.el.presets.get(t.preset), `preset ${t.preset}`);
      if (t.stepBtn) return S.P.req(t.stepBtn === 'up' ? S.ui.el.stepup : S.ui.el.stepdown, 'step button');
      throw new Error(`set-date/calendar cannot locate ${JSON.stringify(t)}`);
    }
  }));
})();
