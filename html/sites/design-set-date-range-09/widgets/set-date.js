// Keeps this range design's single inline field, two independently routed calendars, and stage-height fit.
env.widget({
  task: 'set-date',
  site: 'design-set-date-range-09',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  traits: { inline: true, splitCals: true },
  template: 'set-date/calendar',
  design: {
    inlineBinding: 'none',
    openOnPick: false,
    rangeLayout: null,
    adjacentDays: false,
    splitCalendars: true,
    minWeeks: 5,
    fit: 'height',
    parts: {
      weekday: (base, S) => (wd) => base(wd).slice(0, 2),
      blankDay: (base, S) => (grid, day, util) => {
        util.el('div', 'fd-day out', grid, String(day));
      },
      rangeReadout: (base, S) => (ctx, model, txt) => {
        const { util } = ctx;
        const { spec, geo, P } = S;
        const start = util.el('span', model.start ? '' : 'fd-ph', txt,
          model.start ? P.fmtLocal(model.start, geo.disp) : spec.scene.label);
        start.dataset.part = 'start';
        start.dataset.lab = `${spec.scene.label} (Start date)`;
        util.el('span', 'fd-arrowr', txt, '  →  ');
        const end = util.el('span', model.end ? '' : 'fd-ph', txt,
          model.end ? P.fmtLocal(model.end, geo.disp) : spec.scene.label2);
        end.dataset.lab = `${spec.scene.label2} (End date)`;
      },
      positioned: (base, S) => (ctx) => {
        base(ctx);
        const clear = document.querySelector('.bx-clear');
        if (clear) clear.addEventListener('click', () => {
          ctx.update({ ...ctx.model, start: null, end: null });
          S.P.paint();
        });
      },
    },
  },
});
