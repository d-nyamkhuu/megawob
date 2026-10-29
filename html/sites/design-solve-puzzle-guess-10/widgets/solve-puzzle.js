// Uses the shared guess widget with this site's labels and reset control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-10',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Reset Game',
    guessLabel: 'Your guess:',
    historyTitle: 'Guess history:',
  },
});
