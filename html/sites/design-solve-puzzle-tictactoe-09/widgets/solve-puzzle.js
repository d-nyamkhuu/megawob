// Uses the compact tictactoe board and adds this site's New Game reset.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-tictactoe-09',
  name: 'design',
  split: 'train',
  scenarios: ['tictactoe'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'New Game',
  },
});
