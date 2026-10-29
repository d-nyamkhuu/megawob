// Adds the site's introductory copy and uses its shorter guess field label.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-02',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: {
    guessLabel: 'Your guess:',
    parts: {
      widget: (base, S) => (...args) => {
        const s = S.spec;
        S.ctx.util.el(
          'p',
          'guess-intro',
          S.scene,
          `I’m thinking of a whole number between ${s.lo} and ${s.hi}, inclusive.\nType a guess, click Guess, and use the hints to find the number.`,
        );
        return base(...args);
      },
    },
  },
});
