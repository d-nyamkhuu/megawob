// Sunnybrook's accordion uses a filled chevron and adds short notes to its first and last sections.
env.widget({
  task: 'click-control',
  site: 'design-click-control-collapsible-11',
  name: 'design',
  split: 'train',
  scenarios: ['collapsible'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    chevron: '<svg viewBox="0 0 16 21" aria-hidden="true"><path d="M2 1L15 10.5L2 20Z"/></svg>',
    parts: {
      colSection: (base) => (ctx, sec, h, bd, s, i) => {
        base(ctx, sec, h, bd, s, i);
        if (i === 0 || i === ctx.spec.sections.length - 1) {
          const summary = ctx.util.el('div', 'uc-summary', sec,
            i === 0
              ? 'Welcome to our collection of helpful links and local information.'
              : 'Personal notes and reminders.');
          bd.before(summary);
        }
      },
    },
  },
});
