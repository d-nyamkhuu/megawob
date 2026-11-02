// This algebra design adds answer tools and checks the submit control's class.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-algebra-10',
  name: 'design',
  split: 'train',
  scenarios: ['algebra'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      submitAllowed: (base, S) => (el) => el.classList.contains('submit'),
    },
  },
});
