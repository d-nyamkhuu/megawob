// Restores this design's reference reset control on the shared guess widget.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-09',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Reset Game',
    // Re-rendering clears the stage, so the hidden reset cannot accumulate in the footer.
    parts: { resetParent: (base, S) => () => S.scene },
  },
});
