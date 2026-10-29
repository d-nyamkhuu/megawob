env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-generate-02',
  name: 'design',
  split: 'train',
  scenarios: ['generate'],
  traits: { generate: { initial: true } },
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      actions: (base, S) => () => {
        const u = S.ctx.util,
          root = S.root,
          refs = S.refs;
        const box = root.querySelector('.generator'),
          actions = u.el('div', 'generate-actions', box);
        const generateButton = refs.get(JSON.stringify({ button: 'generate' }));
        const buttonCaption = (e) => {
          const caption = e.textContent;
          e.replaceChildren();
          u.el('span', 'button-caption', e, caption);
        };
        if (generateButton) {
          buttonCaption(generateButton);
          actions.append(generateButton);
        }
        if (env.submitEl) {
          if (env.submitEl.dataset.placement === 'workbench') {
            buttonCaption(env.submitEl);
            actions.append(env.submitEl);
          }
        }
        S.P.inspector();
      },
      inspector: (base, S) => () => {
        const u = S.ctx.util,
          paints = S.paints;
        const aside = document.querySelector('.aside-copy');
        aside.replaceChildren();
        u.el('b', '', aside, 'Current Value');
        const v = u.el('div', 'inspector-value', aside);
        u.el('hr', '', aside);
        u.el('b', '', aside, 'Status');
        const note = u.el('p', '', aside);
        u.el('hr', '', aside);
        u.el('b', '', aside, 'Goal');
        u.el(
          'p',
          'goal-copy',
          aside,
          document.body.classList.contains('instruction-hidden') ? '' : env.instruction(),
        );
        u.el('hr', '', aside);
        u.el('b', '', aside, 'Controls');
        u.el('p', '', aside, 'Generate  –  creates a new random number.');
        u.el('p', '', aside, 'Submit  –  submit the current number if it meets the goal.');
        paints.push((m) => {
          v.textContent = m.value === null ? '—' : m.value;
          note.textContent =
            m.value === null ? 'Generate a number to begin.' : `Generated ${m.presses} times`;
        });
      },
    },
  },
});
