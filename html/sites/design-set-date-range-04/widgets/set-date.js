// Range design: split calendar controls, adjacent days, and the original five-row minimum.
env.widget({
  task: 'set-date',
  site: 'design-set-date-range-04',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  traits: { inline: true, splitCals: true },
  template: 'set-date/calendar',
  design: {
    showOut: true,
    trimWeeks: true,
    trimWithOutside: true,
    minWeeks: 5,
    inlineRange: false,
    openOnPick: false,
    rangeLayout: null,
    adjacentDays: true,
    splitCalendars: true,
    parts: {
      begin: (base, S) => (ctx) => {
        base(ctx);
        env.widgetDef.clear = () => {
          ctx.log('clear', { field: 'range' });
          ctx.update({ ...ctx.model, start: null, end: null });
          S.P.paint();
        };
      },
    },
  },
});
