// This design keeps the plain board and result line, with its original Reset control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-tictactoe-03',
  name: 'design',
  split: 'train',
  scenarios: ['tictactoe'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Reset',
  },
});
