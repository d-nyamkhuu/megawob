env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-algebra-06',
  name: 'design',
  split: 'train',
  scenarios: ['algebra'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      answerActions: (base, S) => (fieldEl) => {
        const s = S.spec,
          u = S.ctx.util,
          scene = S.scene;
        if (s.scenario === 'algebra') {
          const actions = u.el('div', 'algebra-actions', scene),
            clear = u.el('button', 'control clear-action', actions, 'Clear'),
            hint = u.el('button', 'control hint-action', actions, 'Show Hint'),
            hintText = u.el('div', 'algebra-hint', scene, 'Use inverse operations to isolate x.');
          clear.type = hint.type = 'button';
          clear.addEventListener('click', () => {
            fieldEl.value = '';
            fieldEl.dispatchEvent(new Event('input', { bubbles: true }));
            fieldEl.focus();
          });
          hint.addEventListener('click', () => {
            const show = hintText.hidden;
            hintText.hidden = !show;
            hint.textContent = show ? 'Hide Hint' : 'Show Hint';
          });
          hintText.hidden = true;
        }
      },
    },
  },
});
