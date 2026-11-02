// Keeps the shared tictactoe layout and adds this site's New Game control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-tictactoe-02',
  name: 'design',
  split: 'train',
  scenarios: ['tictactoe'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'New Game',
  },
});
