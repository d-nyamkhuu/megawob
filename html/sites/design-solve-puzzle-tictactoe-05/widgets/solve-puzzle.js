// Adds this site's New Game reset control to the shared compact tictactoe design.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-tictactoe-05',
  name: 'design',
  split: 'train',
  scenarios: ['tictactoe'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'New Game',
  },
});
