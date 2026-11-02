// Horizon calendar design: adds the event context rows and seeded task dates.
env.widget({
  task: 'set-date',
  site: 'design-set-date-calendar-01',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'set-date/calendar',
  design: {
    showOut: false,
    display: 'numeric',
    placeholder: 'MM/DD/YYYY',
    trimWeeks: true,
    weekCount: 'box',
    parts: {
      begin: (base, S) => (ctx) => {
        const { fam, spec } = S;
        document.querySelectorAll('.ds-task-date').forEach((el, i) => {
          const iso = fam.helpers.fromDays(fam.helpers.days(spec.target) - [9, 7, 6, 2][i]);
          const [y, m, d] = iso.split('-');
          el.textContent = `${m}/${d}/${y}`;
        });
        return base(ctx);
      },
      extras: (base, S) => (ctx) => {
        const { spec } = S;
        const extras = spec.scene.extra.slice(0, 1);
        const detail = spec.scene.extra.slice(1).map(([label, value]) => `${label}: ${value}`).join('\n');
        extras.push(['Description', detail || 'Discuss project goals and next steps.']);
        return extras;
      },
      monthSelectName: (base, S) => (month) => (S.L.months || S.fam.helpers.MONTHS)[month - 1],
      bodyStart: (base, S) => (ctx, extras) => {
        const row = S.P.staticRow(S.geo.body, ['Event title', S.spec.scene.title], ctx.util);
        row.classList.add('fd-event-title');
        return base(ctx, extras);
      },
      staticCreated: (base, S) => (parent, row, label, value, util) => {
        base(parent, row, label, value, util);
        if (label === 'Description') row.classList.add('fd-description');
      },
      calendarPopup: (base, S) => (ctx, range, row, help, txt, fields) => {
        base(ctx, range, row, help, txt, fields);
        S.pop.classList.toggle('has-today', !!S.spec.todayBtn);
      },
      positioned: (base, S) => (ctx) => {
        base(ctx);
        ctx.update({ ...ctx.model, open: true, view: S.spec.target.slice(0, 7), years: false, menu: '' });
      },
    },
  },
});
