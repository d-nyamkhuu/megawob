// Keep only canvas and link end controls in the generator action row.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-generate-10',
  name: 'design',
  split: 'train',
  scenarios: ['generate'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      moveSubmit: () => (el) => el.matches('.end-canvas,.end-link'),
    },
  },
});
