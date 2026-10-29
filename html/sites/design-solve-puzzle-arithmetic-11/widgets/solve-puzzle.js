// This arithmetic design keeps the end control in the scene only for form placement.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-arithmetic-11',
  name: 'design',
  split: 'train',
  scenarios: ['arithmetic'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      submitAllowed: () => (el) => el.dataset.placement === 'form',
    },
  },
});
