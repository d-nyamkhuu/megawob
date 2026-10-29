// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-sneak-02',
  name: 'design',
  split: 'train',
  scenarios: ['sneak'],
  template: 'avoid-dark-patterns/browser',
  design: {
    parts: {
      paint: (base, S) => {
        let paintedContext = null;
        return (model) => {
          base(model);
          // Screen changes can change the compact layout after the first render.
          if (paintedContext === S.ctx) S.ctx.reanchor();
          paintedContext = S.ctx;
        };
      },
    },
  },
});
