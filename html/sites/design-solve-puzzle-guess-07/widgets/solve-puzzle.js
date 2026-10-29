// Dark horizontal guess design with compact range, remaining-count, and history labels.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-07',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Reset Game',
    historyTitle: 'History',
    parts: {
      range: (base, S) => (work) => {
        const s = S.spec;
        S.ctx.util.el('div', 'range-label', work, `Range:\n${s.lo} – ${s.hi}`);
      },
      history: (base, S) => (work) => {
        const s = S.spec,
          u = S.ctx.util,
          f = env.taskDef.helpers,
          scene = S.scene,
          paints = S.paints;
        const remaining = u.el('div', 'remaining', work),
          history = u.el('div', 'history', scene);
        paints.push((m) => {
          remaining.textContent = `Guesses\nremaining:\n${f.left(m, s)}`;
          history.replaceChildren();
          S.P.historyHeading(history);
          if (!m.guesses.length) u.el('p', '', history, 'No guesses yet.');
          m.guesses.forEach((g) => u.el('div', '', history, `${g.value}: ${g.verdict}`));
        });
      },
    },
  },
});
