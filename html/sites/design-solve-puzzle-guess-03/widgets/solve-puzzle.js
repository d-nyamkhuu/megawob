// Adds the sampled range to the input label and a column heading to guess history.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-03',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Reset Game',
    parts: {
      guessInput: (base, S) => (work) => {
        const s = S.spec;
        return S.P.input(work, 'text', `Enter a number (${s.lo} – ${s.hi}):`);
      },
      history: (base, S) => (work) => {
        base(work);
        const scene = S.scene,
          u = S.ctx.util;
        S.paints.push(() => {
          const history = scene.querySelector('.history'),
            title = history.querySelector('b'),
            columns = u.el('div', 'history-columns');
          ['#', 'Your Guess', 'Result'].forEach((label) => u.el('span', '', columns, label));
          title.after(columns);
        });
      },
    },
  },
});
