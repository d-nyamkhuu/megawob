// Maple Creek arithmetic design: adds the original answer-field placeholder.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-arithmetic-03',
  name: 'design',
  split: 'train',
  scenarios: ['arithmetic'],
  template: 'solve-puzzle/classic',
  design: {
    placeholder: 'Your answer here...',
  },
});
