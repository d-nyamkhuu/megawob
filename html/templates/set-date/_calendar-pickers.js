/* set-date/_calendar-pickers: shared template builders; S retains the live template scope and design hooks. */
(function () {
  'use strict';
  env.template('set-date/_calendar-pickers', () => ({
    monthBlock(S, parent, key, { prev, next, toggle, selects, menu, cal = S.ui.cal }, util) {
      const box = util.el('div', 'fd-month', parent);
      const head = util.el('div', 'fd-head', box);
      if (prev) cal.bindNav(util.el('div', 'fd-nav', head), 'prev').innerHTML = S.D.left;
      else util.el('div', 'fd-navgap', head);
      const [y, m] = [+key.slice(0, 4), +key.slice(5, 7)];
      if (selects) {
        const sels = util.el('div', 'fd-sels', head);
        const ms = util.el('div', 'fd-sel' + (menu === 'month' ? ' on' : ''), sels, S.P.monthSelectName(m));
        const ys = util.el('div', 'fd-sel' + (menu === 'year' ? ' on' : ''), sels, String(y));
        ms.dataset.role = 'month-menu';
        ys.dataset.role = 'year-menu';
        ms.addEventListener('click', () => S.P.act({ menu: 'month' }));
        ys.addEventListener('click', () => S.P.act({ menu: 'year' }));
        S.ui.el.menuMonth = ms;
        S.ui.el.menuYear = ys;
      } else {
        const title = util.el('div', 'fd-mtitle', head, S.P.monthTitle(y, m));
        if (toggle) { title.classList.add('toggle'); cal.bindToggle(title); }
      }
      if (next) cal.bindNav(util.el('div', 'fd-nav', head), 'next').innerHTML = S.D.right;
      else util.el('div', 'fd-navgap', head);
      return { box, y, m };
    },

    dayGrid(S, box, y, m, deco, util, cal = S.ui.cal, side) {
      const dow = util.el('div', 'fd-dow', box);
      for (const wd of cal.weekdays()) util.el('div', '', dow, S.P.weekday(wd));
      const grid = util.el('div', 'fd-grid', box);
      const model = S.ctxRef.model;
      for (const { iso, day, inMonth } of S.P.weeks(cal, y, m, box, grid).flat()) {
        if (!inMonth && !S.geo.showOut && !S.D.adjacentDays) { S.P.blankDay(grid, day, util); continue; }
        const cell = cal.bindDay(util.el('div', 'fd-day' + (inMonth ? '' : ' out'), grid, String(day)), iso, { inMonth });
        cell.dataset.role = 'day';
        if (iso === S.spec.today) cell.classList.add('today');
        if (S.fam.helpers.disabled(S.spec, model, iso, side)) {
          cell.classList.add('off');
          cell.setAttribute('aria-disabled', 'true');
        }
        if ((S.spec.booked || []).includes(iso)) cell.classList.add('booked');
        for (const c of deco(iso)) cell.classList.add(c);
        S.P.day(cell, iso, day, inMonth, side);
      }
      S.P.gridBuilt(box, grid, cal);
    },

    buildCalendar(S, ctx, range) {
      const { util, size } = ctx;
      const { row, help } = S.P.fieldRow(S.geo.body, S.P.calendarLabel(range), '', util);
      S.P.calendarRow(ctx, range, row, help);
      S.control = S.P.clickControl(row, S.D.calendarIcon, util);
      const txt = util.el('span', 'fd-txt', S.control);
      const fields = S.P.calendarFields(ctx, range, row, txt);
      row.append(help);
      if (range) {
        if (S.spec.rule === 'minmax') help.textContent = `Minimum stay ${S.spec.minN} nights · maximum ${S.spec.maxN} nights`;
        else if (S.spec.rule === 'booked') help.textContent = ctx.rng.pick(['Striped dates are already booked.', 'Unavailable dates cannot be selected.', 'Some dates are fully booked.']);
      } else if (S.spec.limit) help.textContent = S.spec.limit.min ? 'Past dates are not available.' : 'Future dates are not allowed.';
      S.P.calendarHelp(ctx, range, row, help);
      for (const ex of S.geo.extrasBelow) S.P.staticRow(S.geo.body, ex, util);
      S.P.calendarExtras(ctx, range, row, help, txt, fields);
      S.P.placePop(util);
      S.P.calendarPopup(ctx, range, row, help, txt, fields);

      const months = range ? 2 : 1;
      const foot = !range && S.spec.todayBtn ? 42 : 0;
      const fixed = 24 + 40 + 26 + foot;
      S.geo.cell = Math.max(26, Math.min(S.geo.cell, Math.floor((S.P.popRoom(size) - fixed) / 6)));
      const maxW = size.width - 32 - 2 * S.control.offsetLeft;
      const gap = 24;
      S.geo.cell = Math.max(26, Math.min(S.geo.cell, Math.floor((maxW - 24 - (months - 1) * gap) / (7 * months))));
      const popW = 24 + months * 7 * S.geo.cell + (months - 1) * gap;
      const popH = fixed + 6 * S.geo.cell;
      S.pop.style.setProperty('--cell', S.geo.cell + 'px');
      S.pop.style.setProperty('--round', S.geo.round);
      S.card.style.width = Math.min(size.width - 32, Math.max(S.geo.cardW, popW + S.control.offsetLeft * 2)) + 'px';
      S.P.fitCard(S.P.sizePop(popW, popH), util);
      S.P.calendarSized(ctx, range, row, help, txt, fields);

      S.paintFns.push((m) => {
        S.control.classList.toggle('open', !!m.open);
        S.P.calendarPainting(ctx, m, range);
        txt.replaceChildren();
        if (range) {
          S.P.rangeReadout(ctx, m, txt, fields);
          const bad = m.start && m.end && m.end < m.start;
          S.control.classList.toggle('bad', !!bad);
          if (bad) { help.textContent = `${S.spec.scene.label2} is before ${S.spec.scene.label.toLowerCase()}.`; help.classList.add('err'); } else if (help.classList.contains('err')) {
            help.classList.remove('err');
            help.textContent = S.spec.rule === 'minmax' ? `Minimum stay ${S.spec.minN} nights · maximum ${S.spec.maxN} nights` : S.spec.rule === 'booked' ? 'Unavailable dates cannot be selected.' : '';
          }
        } else {
          util.el('span', m.value ? '' : 'fd-ph', txt, m.value ? S.P.fmtLocal(m.value, S.geo.disp) : S.geo.placeholder);
        }
        const opened = S.P.calendarOpen(m, range);
        S.pop.hidden = !opened;
        if (!opened) return;
        S.pop.replaceChildren();
        S.P.calendarOpened(ctx, m, range);
        S.ui.el = {};
        if (!range) {
          const sel = S.spec.header === 'selects';
          const { box, y } = S.P.monthBlock(S.pop, m.view, { prev: !m.years, next: !m.years, toggle: S.spec.header === 'yearGrid', selects: sel, menu: m.menu }, util);
          if (m.years) {
            const grid = util.el('div', 'fd-years', box);
            const rows = Math.ceil(S.fam.helpers.YEARS.length / 4);
            grid.style.gridAutoRows = Math.floor((26 + 6 * S.geo.cell - 6 * (rows - 1)) / rows) + 'px';
            for (const yy of S.fam.helpers.YEARS) {
              const c = S.ui.cal.bindYear(util.el('div', 'fd-year' + (yy === y ? ' sel' : ''), grid, String(yy)), yy);
              c.dataset.role = 'year';
            }
          } else {
            S.P.dayGrid(box, y, +m.view.slice(5, 7), (iso) => (iso === m.value ? ['sel'] : []), util);
          }
          if (sel && m.menu) {
            const menu = util.el('div', 'fd-menu', box);
            const grid = util.el('div', m.menu === 'month' ? 'fd-mgrid' : 'fd-years', menu);
            const items = m.menu === 'month' ? Array.from({ length: 12 }, (_, i) => i + 1) : S.fam.helpers.YEARS;
            const rows = Math.ceil(items.length / (m.menu === 'month' ? 3 : 4));
            grid.style.gridAutoRows = Math.floor((26 + 6 * S.geo.cell - 12 - 6 * (rows - 1)) / rows) + 'px';
            S.ui.el.menuItems = new Map();
            for (const it of items) {
              const on = m.menu === 'month' ? it === +m.view.slice(5, 7) : it === y;
              const c = util.el('div', (m.menu === 'month' ? 'fd-mcell' : 'fd-year') + (on ? ' sel' : ''), grid,
                m.menu === 'month' ? (S.L.monthsShort || S.fam.helpers.MONTHS)[it - 1] : String(it));
              c.dataset.role = m.menu;
              c.addEventListener('click', () => S.P.act(m.menu === 'month' ? { pickMonth: it } : { pickYear: it }));
              S.ui.el.menuItems.set(it, c);
            }
          }
          if (S.spec.todayBtn) {
            const f = util.el('div', 'fd-foot', S.pop);
            const b = util.el('div', 'fd-btn', f, S.P.word('today', 'Today'));
            b.dataset.role = 'today';
            b.addEventListener('click', () => S.P.act({ todayBtn: true }));
            S.ui.el.today = b;
          }
          return;
        }
        S.P.rangeMonths(ctx, m);
      });
    },

    weekday(S, wd) { return (S.L.weekdaysShort || S.fam.helpers.WEEKDAYS.map((w) => w.slice(0, 2)))[wd].replace(/\.$/, ''); },

    weeks(S, cal, y, m, box, grid) {
      const weeks = cal.weeks(S.fam.helpers.monthKey(y, m));
      if (S.D.trimWeeks && (!S.geo.showOut || S.D.trimWithOutside)) {
        while (weeks.length > S.D.minWeeks && weeks[weeks.length - 1].every((day) => !day.inMonth)) weeks.pop();
      }
      if (S.D.weekCount === 'box') box.style.setProperty('--weeks', weeks.length);
      else if (S.D.weekCount === 'grid') grid.style.setProperty('--weeks', weeks.length);
      else if (S.D.weekCount === 'popup') S.pop.style.setProperty('--weeks', Math.max(+S.pop.style.getPropertyValue('--weeks') || 1, weeks.length));
      return weeks;
    },

    blankDay(S, grid, day, util) { util.el('div', '', grid); },

    rangeMonths(S, ctx, m) {
      const { util } = ctx;
      const wrap = util.el('div', 'fd-months', S.pop);
      const lo = m.start ? S.fam.helpers.days(m.start) : null;
      const hi = m.end ? S.fam.helpers.days(m.end) : null;
      const deco = (iso) => {
        const n = S.fam.helpers.days(iso);
        if (n === lo || n === hi) return ['sel'];
        return lo !== null && hi !== null && n > lo && n < hi ? ['inr'] : [];
      };
      for (let k = 0; k < 2; k++) {
        const side = S.D.splitCalendars ? k === 0 ? 'start' : 'end' : undefined;
        const cal = side === 'end' ? S.ui.calEnd : S.ui.cal;
        const fallback = S.D.splitFallback === 'next' ? S.fam.helpers.addMonths(m.view, 1) : m.view;
        const key = S.D.splitCalendars ? k === 0 ? m.view : m.view2 || fallback : S.fam.helpers.addMonths(m.view, k);
        const { box, y, m: mm } = S.P.monthBlock(wrap, key, { prev: S.D.bothNav || k === 0, next: S.D.bothNav || k === 1, cal }, util);
        S.P.dayGrid(box, y, mm, deco, util, cal, side);
      }
    }
  }));
})();
