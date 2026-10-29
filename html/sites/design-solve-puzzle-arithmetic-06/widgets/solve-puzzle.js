// This arithmetic design preserves the site's conditional in-scene submit placement.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-arithmetic-06',
  name: 'design',
  split: 'train',
  scenarios: ['arithmetic'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      submitAllowed: (base, S) => (el) => base(el) && !el.dataset.chromePlacement,
    },
  },
});
