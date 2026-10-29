// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-trickq-01',
  name: 'design',
  split: 'train',
  scenarios: ['trickq'],
  template: 'avoid-dark-patterns/browser',
  design: {
    parts: {
      paint: (base, S) => (model) => {
        const before = S.bar.getBoundingClientRect();
        base(model);
        const after = S.bar.getBoundingClientRect();
        // The template can leave its compact layout when the form completes.
        // Rebaseline the address-bar anchor after that legitimate screen change.
        if (before.x !== after.x || before.y !== after.y ||
            before.width !== after.width || before.height !== after.height) {
          S.ctx.reanchor();
        }
      },
    },
  },
});
