// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-precheck-04',
  name: 'design',
  split: 'train',
  scenarios: ['precheck'],
  template: 'avoid-dark-patterns/browser',
  design: {
    parts: {
      paint: (base, S) => {
        let paintedContext;
        return (model) => {
          base(model);
          // Screen changes can trigger the template's compact layout.
          // Initial anchors are registered by the kit after render returns.
          if (paintedContext === S.ctx) S.ctx.reanchor();
          paintedContext = S.ctx;
        };
      },
    },
  },
});
