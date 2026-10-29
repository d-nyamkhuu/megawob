env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-guess-04',
  name: 'design',
  split: 'train',
  scenarios: ['guess'],
  template: 'solve-puzzle/classic',
  design: {
    resetLabel: 'Reset',
    parts: {
      guessInput: (base, S) => (work) => {
        const s = S.spec;
        return S.P.input(work, 'text', `Enter a number between ${s.lo} and ${s.hi}:`);
      },
      range: (base, S) => (work) => {
        const s = S.spec,
          u = S.ctx.util;
        u.el('div', 'range-note', work, `Allowed numbers: ${s.lo} – ${s.hi}`);
      },
      history: (base, S) => (work) => {
        const ctx = S.ctx,
          s = S.spec,
          u = S.ctx.util,
          f = env.taskDef.helpers,
          scene = S.scene,
          paints = S.paints;
        const remaining = u.el('div', 'remaining-count', work);
        const history = u.el('div', 'history', scene);
        const total = f.left(ctx.model, s) + ctx.model.guesses.length,
          range = document.querySelector('.range-value'),
          totalEl = document.querySelector('.total-value'),
          dots = document.querySelector('.progress-dots'),
          progressLabel = document.querySelector('.progress-label');
        range.innerHTML = `<span>Number range:</span><strong>${s.lo} – ${s.hi}</strong>`;
        totalEl.innerHTML = `<span>Total guesses:</span><strong>${total}</strong>`;
        for (let i = 0; i < total; i++) u.el('i', 'progress-dot', dots);
        paints.push((m) => {
          remaining.textContent = `Guesses remaining: ${f.left(m, s)}`;
          history.replaceChildren();
          u.el('b', '', history, 'Guess History');
          const body = u.el('div', 'history-body', history);
          if (!m.guesses.length) {
            const empty = u.el('p', 'empty-history', body);
            u.el('span', '', empty, 'No guesses yet.');
            u.el('span', '', empty, 'Your guesses and hints will appear here.');
          }
          m.guesses.forEach((g) => u.el('div', 'guess-entry', body, `${g.value}: ${g.verdict}`));
          dots
            .querySelectorAll('.progress-dot')
            .forEach((dot, i) => dot.classList.toggle('used', i < m.guesses.length));
          progressLabel.textContent = `${m.guesses.length} of ${total} guesses used`;
        });
      },
      resetParent: () => () => document.querySelector('.dock-actions') || document.querySelector('.bottom'),
    },
  },
});
