// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-month-05',
  name: 'design',
  split: 'train',
  scenarios: ['month'],
  template: 'use-calendar/workspace',
  design: {
    parts: {
      monthCells: (base, S) => (st, m) => {
        const { P } = S;
        const { u, refs } = st;
        const mo = P.shownMonth(st, m), key = mo.name;
        if (refs.monthKey === key) return;
        refs.monthKey = key;
        const first = (mo.first + 1) % 7; // template's offset is Monday-first
        refs.weeks = Math.ceil((first + mo.days) / 7);
        const g = refs.monthGrid;
        g.replaceChildren(); refs.dates.clear();
        g.style.setProperty('--weeks', refs.weeks);
        for (const w of ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
          u.el('div', 'ac-weekday', g, w);
        for (let k = 0; k < refs.weeks * 7; k++) {
          const d = k - first + 1, cell = P.monthCell(st, g, d, mo);
          if (d >= 1 && d <= mo.days) refs.dates.set(d, cell);
        }
      },
      monthDay: (base, S) => (st, x, y) => {
        const { refs, s } = st;
        const r = refs.monthGrid.getBoundingClientRect();
        const head = refs.monthGrid.querySelector('.ac-weekday')?.getBoundingClientRect().height || 22;
        const row = Math.floor((y - r.top - head) / ((r.height - head) / refs.weeks));
        const col = Math.floor((x - r.left) / (r.width / 7));
        const first = (s.firstWeekday + 1) % 7;
        const d = row * 7 + col - first + 1;
        return row < 0 || col < 0 || col > 6 || d < 1 || d > s.monthDays ? null : d;
      },
      updateMonthDensity: (base, S) => st => {
        const { ctx, refs, root } = st;
        const head = refs.monthGrid.querySelector('.ac-weekday')?.getBoundingClientRect().height || 44;
        const row = (refs.monthGrid.clientHeight - head) / refs.weeks;
        refs.monthLimit = row < 126 ? 1 : 2;
        root.classList.toggle('ac-short-month', row < 53);
        ctx.patch({ monthLimit: refs.monthLimit });
      },
    },
  },
});
