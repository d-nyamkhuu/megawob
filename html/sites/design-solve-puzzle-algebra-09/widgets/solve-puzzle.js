// This design italicizes x and adds the algebra answer field's Clear control.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-algebra-09',
  name: 'design',
  split: 'train',
  scenarios: ['algebra'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      equation: (base, S) => () => {
        const equation = base();
        equation.innerHTML = equation.textContent.replace(/x/g, '<i>x</i>');
        return equation;
      },
      answerActions: (base, S) => (fieldEl) => {
        const scene = S.scene;
        const clear = S.ctx.util.el('button', 'clear', scene, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          fieldEl.value = '';
          fieldEl.dispatchEvent(new Event('input', { bubbles: true }));
          fieldEl.focus();
        });
      },
    },
  },
});
