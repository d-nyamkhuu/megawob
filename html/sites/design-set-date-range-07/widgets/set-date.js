// Separate start and end fields, with a compact two-month calendar and the site's calendar mark.
(function () {
  'use strict';

  const ICON_CAL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/><path stroke-width="1.8" d="M7 13h.5M11.8 13h.5M16.5 13h.5M7 17h.5M11.8 17h.5M16.5 17h.5"/></svg>';

  env.widget({
    task: 'set-date',
    site: 'design-set-date-range-07',
    name: 'design',
    split: 'train',
    scenarios: ['range'],
    template: 'set-date/calendar',
    design: {
      calendarIcon: ICON_CAL,
      adjacentDays: false,
      minWeeks: 4,
      parts: {
        dayGrid: (base, S) => (box, y, m, deco, util, cal = S.ui.cal, side) => {
          const { fam, geo, spec, ctxRef, D, P } = S;
          const dow = util.el('div', 'fd-dow', box);
          for (const wd of cal.weekdays()) util.el('div', '', dow, P.weekday(wd));
          const grid = util.el('div', 'fd-grid', box);
          const model = ctxRef.model;
          const weeks = P.weeks(cal, y, m, box, grid).slice();
          grid.style.gridTemplateRows = `repeat(${weeks.length}, 1fr)`;
          for (const { iso, day, inMonth } of weeks.flat()) {
            if (!inMonth && !geo.showOut && !D.adjacentDays) {
              util.el('div', 'fd-day out', grid, String(day));
              continue;
            }
            const cell = cal.bindDay(util.el('div', 'fd-day' + (inMonth ? '' : ' out'), grid, String(day)), iso, { inMonth });
            cell.dataset.role = 'day';
            if (iso === spec.today) cell.classList.add('today');
            if (fam.helpers.disabled(spec, model, iso, side)) {
              cell.classList.add('off');
              cell.setAttribute('aria-disabled', 'true');
            }
            if ((spec.booked || []).includes(iso)) cell.classList.add('booked');
            for (const c of deco(iso)) cell.classList.add(c);
            P.day(cell, iso, day, inMonth, side);
          }
          P.gridBuilt(box, grid, cal);
        },
        calendarLabel: (base, S) => (range) => range ? 'Start date' : base(range),
        calendarFields: (base, S) => (ctx, range, row, txt) => {
          if (!range) return base(ctx, range, row, txt);
          const { util } = ctx;
          const fields = util.el('div', 'fd-range-fields', S.geo.body);
          fields.append(row);
          row.querySelector('.fd-label').firstChild.textContent = 'Start date ';
          const { row: endRow } = S.P.fieldRow(fields, 'End date', null, util);
          const endControl = S.P.clickControl(endRow, S.D.calendarIcon, util);
          const endTxt = util.el('span', 'fd-txt', endControl);
          endControl.addEventListener('click', () => {
            if (!S.ctxRef.model.open) S.P.act({ field: 'main' });
          });
          const footer = document.querySelector('.ds-footer');
          const clear = util.el('button', 'ds-clear', footer, 'Clear');
          clear.type = 'button';
          footer.prepend(clear);
          clear.addEventListener('click', () => {
            S.ctxRef.update({ ...S.ctxRef.model, start: null, end: null });
            S.P.paint();
          });
          return { endControl, endTxt };
        },
        rangeReadout: (base, S) => (ctx, m, txt, fields) => {
          const { util } = ctx;
          const a = util.el('span', m.start ? '' : 'fd-ph', txt,
            m.start ? S.P.fmtLocal(m.start, S.geo.disp) : 'Select a date...');
          a.dataset.part = 'start';
          fields.endTxt.replaceChildren();
          util.el('span', m.end ? '' : 'fd-ph', fields.endTxt,
            m.end ? S.P.fmtLocal(m.end, S.geo.disp) : 'Select a date...');
          fields.endControl.classList.toggle('open', !!m.open);
        },
        calendarPopup: () => () => {},
      },
    },
  });
})();
