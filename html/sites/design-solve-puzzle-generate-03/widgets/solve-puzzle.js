// Keep the site frame end control out of the generator action row.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-generate-03',
  name: 'design',
  split: 'train',
  scenarios: ['generate'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      moveSubmit: () => (el) => !el.classList.contains('chrome-end'),
    },
  },
});
