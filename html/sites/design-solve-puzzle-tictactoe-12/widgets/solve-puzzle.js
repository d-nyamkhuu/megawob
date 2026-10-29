// Keeps this site's New Game reset on the shared compact Tic-Tac-Toe widget.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-tictactoe-12',
  name: 'design',
  split: 'train',
  scenarios: ['tictactoe'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'New Game',
  },
});
