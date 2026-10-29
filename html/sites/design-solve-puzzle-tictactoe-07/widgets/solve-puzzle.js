// Uses the compact tic-tac-toe board with this site's status styling and reset control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-tictactoe-07',
  name: 'design',
  split: 'train',
  scenarios: ['tictactoe'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'New Game',
    statusClass: 'turn-status',
  },
});
