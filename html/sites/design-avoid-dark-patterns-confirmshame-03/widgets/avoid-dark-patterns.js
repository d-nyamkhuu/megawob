// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-confirmshame-03',
  name: 'design',
  split: 'train',
  scenarios: ['confirmshame'],
  template: 'avoid-dark-patterns/browser',
  design: {
    parts: {
      paint: (base, S) => (model) => {
        const repaint = S.page.childElementCount > 0;
        base(model);
        // Content fitting can hide the tabs and move the stable address bar.
        if (repaint) S.ctx.reanchor();
      },
    },
  },
});
