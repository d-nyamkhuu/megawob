// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-confirmshame-02',
  name: 'design',
  split: 'train',
  scenarios: ['confirmshame'],
  template: 'avoid-dark-patterns/browser',
  design: {
    parts: {
      onCtl: (base, S) => function (id) {
        base(id);
        // Content fitting may toggle the tab strip between task screens.
        S.ctx.reanchor();
      },
      sync: (base, S) => function (model) {
        base(model);
        S.ctx.reanchor();
      },
    },
  },
});
