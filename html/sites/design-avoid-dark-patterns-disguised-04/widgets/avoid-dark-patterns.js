// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-disguised-04',
  name: 'design',
  split: 'train',
  scenarios: ['disguised'],
  template: 'avoid-dark-patterns/browser',
  design: {
    parts: {
      paint: (base, S) => (model) => {
        const alreadyDrawn = S.page.hasChildNodes();
        base(model);
        // Compact layouts can change the address bar's vertical position.
        if (alreadyDrawn) S.ctx.reanchor();
      },
    },
  },
});
