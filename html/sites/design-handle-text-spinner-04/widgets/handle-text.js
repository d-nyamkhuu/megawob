// Adds the original card height cap to the shared spinner design.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-spinner-04',
  name: 'design',
  split: 'train',
  scenarios: ['spinner'],
  template: 'handle-text/editor',
  design: {
    parts: {
      cardLayout: (base, S) => (ctx, view, box) => {
        base(ctx, view, box);
        view.card.style.maxHeight = '100%';
      },
    },
  },
});
