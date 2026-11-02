// Adds the algebra-only Clear answer control to the shared equation design.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-algebra-07',
  name: 'design',
  split: 'train',
  scenarios: ['algebra'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      rendered: (base, S) => () => {
        base();
        if (S.spec.scenario !== 'algebra' || !env.submitEl) return;
        const u = S.ctx.util;
        const scene = S.scene;
        const clear = u.el('button', 'clear-answer', scene, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => S.P.set({ answer: '' }));
      },
    },
  },
});
