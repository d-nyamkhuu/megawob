// Keeps the shared compact board and adds this site's New Game control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-tictactoe-11',
  name: 'design',
  split: 'train',
  scenarios: ['tictactoe'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'New Game',
  },
});
