// The unicode preset supplies the answer sample, placeholder, and full-stage layout; preserve its form-control filter and mode styling.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-unicode-03',
  name: 'design',
  split: 'train',
  scenarios: ['unicode'],
  template: 'handle-text/editor',
  design: {
    parts: {
      unicodeControl: (base, S) => (ctx, control) => !control.dataset.placement || control.dataset.placement === 'form',
      rendered: (base, S) => (ctx, view, look, box) => {
        base(ctx, view, look, box);
        view.card.dataset.mode = ctx.spec.mode;
      },
    },
  },
});
