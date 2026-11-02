// Adds the sample-form heading, type-specific captions, and a decoy Reset control.
env.widget({
  task: 'click-control',
  site: 'design-click-control-widget-06',
  name: 'design',
  split: 'train',
  scenarios: ['widget'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    headings: {
      text: 'Name',
      textarea: 'Message',
      radio: 'Favorite IDE',
      checkbox: 'Receive updates',
      button: 'Action',
      other: 'Helpful link',
    },
    parts: {
      widgetsStart: (base) => (ctx, card) => {
        base(ctx, card);
        ctx.util.el('div', 'dv-ftitle', card, 'Sample Form');
        ctx.util.el('div', 'dv-fsub', card, 'This panel contains several common UI widgets.');
      },
      widgetsBuilt: (base) => (ctx, card) => {
        base(ctx, card);
        const footer = ctx.util.el('div', 'dv-form-footer', card);
        const reset = ctx.util.el('button', 'dv-reset', footer, 'Reset');
        reset.type = 'button';
        reset.addEventListener('click', () => env.log('decoy', { label: 'Reset' }));
      },
    },
  },
});
