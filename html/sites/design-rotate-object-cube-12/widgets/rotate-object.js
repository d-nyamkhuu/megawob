// This design uses a larger cube, larger labels, and goal-independent guidance.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-cube-12',
  name: 'design',
  split: 'train',
  scenarios: ['cube'],
  template: 'rotate-object/cube',
  design: {
    edgeHeight: .66,
    edgeMax: 300,
    labelMax: .25,
    labelFit: .9,
    parts: {
      helper: () => (ctx, g) => {
        g.helper.textContent = 'Click and drag the cube to rotate it.';
      },
    },
  },
});
