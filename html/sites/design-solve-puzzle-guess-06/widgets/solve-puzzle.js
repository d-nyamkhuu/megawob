env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-06',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: null,
    guessLabel: 'Your guess',
    parts: {
      range: (base, S) => (work) => {
        const s = S.spec,
          u = S.ctx.util;
        const range = u.el('div', 'guess-range', work);
        u.el('span', 'metric-label', range, 'Allowed range');
        u.el('strong', 'metric-value', range, `${s.lo} – ${s.hi}`);
        u.el('small', 'metric-foot', range, '(inclusive)');
      },
      history: (base, S) => (work) => {
        const s = S.spec,
          u = S.ctx.util,
          f = env.taskDef.helpers,
          scene = S.scene,
          paints = S.paints;
        const remaining = u.el('div', 'guess-stat', work);
        const attempts = u.el('div', 'guess-stat attempts-stat', work);
        const history = u.el('div', 'history', scene);
        paints.push((m) => {
          remaining.replaceChildren();
          u.el('span', 'metric-label', remaining, 'Guesses remaining');
          u.el('strong', 'metric-value', remaining, String(f.left(m, s)));
          u.el('small', 'metric-foot', remaining, `of ${m.guesses.length + f.left(m, s)}`);
          attempts.replaceChildren();
          u.el('span', 'metric-label', attempts, 'Attempts used');
          u.el('strong', 'metric-value', attempts, String(m.guesses.length));
          u.el('small', 'metric-foot', attempts, `of ${m.guesses.length + f.left(m, s)}`);
          history.replaceChildren();
          u.el('b', '', history, 'Guess history');
          if (!m.guesses.length) {
            const empty = u.el('p', '', history, 'No guesses yet. Enter a number and click Guess.');
            empty.setAttribute('data-empty-history', '');
          }
          m.guesses.forEach((g) => u.el('div', 'history-entry', history, `${g.value}: ${g.verdict}`));
        });
      },
      guessInput: (base, S) => (work) => {
        const s = S.spec;
        const e = S.P.input(work, 'text', 'Your guess');
        e.type = 'number';
        e.min = String(s.lo);
        e.max = String(s.hi);
        return e;
      },
    },
  },
});
