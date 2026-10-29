// Keeps the compact two-control range row, Monday-first calendars and numeric date readouts.
env.widget({
  task: 'set-date',
  site: 'design-set-date-range-10',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'set-date/calendar',
  design: {
    rangeLayout: null,
    parts: {
      calendarLabel: (base) => (range) => range ? 'Start date:' : base(range),
      calendarRow: (base) => (ctx, range, row, help) => {
        base(ctx, range, row, help);
        if (range) row.classList.add('fd-range-fields');
      },
      calendarFields: (base, S) => (ctx, range, row) => {
        if (!range) return base(ctx, range, row);
        const { util } = ctx;
        const endControlLabel = util.el('label', 'fd-label fd-end-label', row, 'End date:');
        void endControlLabel;
        const endControl = S.P.clickControl(row, S.D.calendarIcon, util);
        endControl.classList.add('fd-end-control');
        endControl.setAttribute('role', 'button');
        endControl.setAttribute('aria-label', 'End date');
        endControl.tabIndex = 0;
        const endTxt = util.el('span', 'fd-txt', endControl);
        endControl.addEventListener('click', () => S.P.act({ field: 'main' }));
        endControl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            S.P.act({ field: 'main' });
          }
        });
        return { endControl, endTxt };
      },
      rangeReadout: (base, S) => (ctx, model, txt, fields) => {
        if (S.spec.scenario !== 'range') return base(ctx, model, txt, fields);
        const { util } = ctx;
        const a = util.el('span', model.start ? '' : 'fd-ph', txt,
          model.start ? S.P.fmtLocal(model.start, 'numeric') : '--/--/----');
        a.dataset.part = 'start';
        fields.endTxt.replaceChildren();
        util.el('span', model.end ? '' : 'fd-ph', fields.endTxt,
          model.end ? S.P.fmtLocal(model.end, 'numeric') : '--/--/----');
        fields.endControl.classList.toggle('open', !!model.open);
      },
      dayGrid: (base, S) => (box, y, month, decorate, util, cal = S.ui.cal) => {
        const { fam, spec, ui, geo, P, L } = S;
        const dow = util.el('div', 'fd-dow', box);
        for (const wd of cal.weekdays()) {
          util.el('div', '', dow, (L.weekdaysShort || fam.helpers.WEEKDAYS.map((w) => w.slice(0, 2)))[wd].replace(/\.$/, ''));
        }
        const grid = util.el('div', 'fd-grid', box);
        const model = S.ctxRef.model;
        const cells = cal.weeks(fam.helpers.monthKey(y, month)).flat();
        if (spec.scenario === 'range' && cells.length) {
          while (cells.length < 42) {
            const iso = fam.helpers.fromDays(fam.helpers.days(cells[cells.length - 1].iso) + 1);
            cells.push({ iso, day: +iso.slice(8, 10), inMonth: iso.slice(0, 7) === fam.helpers.monthKey(y, month) });
          }
        }
        const usedRows = Math.ceil((cells.map((cell) => cell.inMonth).lastIndexOf(true) + 1) / 7);
        for (const [index, { iso, day, inMonth }] of cells.entries()) {
          if (spec.scenario === 'range' && index >= usedRows * 7) {
            util.el('div', 'fd-empty', grid);
            continue;
          }
          if (!inMonth && !geo.showOut && spec.scenario !== 'range') {
            util.el('div', '', grid);
            continue;
          }
          const cell = cal.bindDay(util.el('div', 'fd-day' + (inMonth ? '' : ' out'), grid, String(day)), iso, { inMonth });
          cell.dataset.role = 'day';
          if (iso === spec.today && spec.scenario !== 'range') cell.classList.add('today');
          if (fam.helpers.disabled(spec, model, iso)) {
            cell.classList.add('off');
            cell.setAttribute('aria-disabled', 'true');
          }
          if ((spec.booked || []).includes(iso)) cell.classList.add('booked');
          for (const c of decorate(iso)) cell.classList.add(c);
        }
      },
      initUI: (base, S) => (ctx) => {
        const { fam, spec, P } = S;
        S.ui = { spin: {}, cols: {}, dur: {}, el: {} };
        S.ui.cal = env.ui.calendar({
          label: S.D.calendarLabels[0],
          weekStart: spec.scenario === 'range' ? 1 : spec.weekStart || 0,
          math: { days: fam.helpers.days, fromDays: fam.helpers.fromDays, weekday: fam.helpers.weekday },
          onDay: (iso) => P.calendarAction('day', iso, 'start'),
          onNav: (dir) => P.calendarAction('nav', dir, 'start'),
          onToggle: () => P.act({ yearToggle: true }),
          onYear: (year) => P.act({ year }),
        });
      },
    },
  },
});
