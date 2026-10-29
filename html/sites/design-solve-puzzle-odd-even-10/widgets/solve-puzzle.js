// This design adds dense-grid sizing and the Clear All control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-odd-even-10',
  name: 'design',
  split: 'train',
  scenarios: ['odd-even'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Clear All',
    parts: {
      grid: (base, S) => () => {
        const grid = base();
        if (S.spec.numbers.length > 5) grid.classList.add('dense-parity');
        return grid;
      },
    },
  },
});
