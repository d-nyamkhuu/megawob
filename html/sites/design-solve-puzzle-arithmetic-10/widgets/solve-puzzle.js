// This arithmetic design adds the original answer prompt and Clear control, and preserves submit placement.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-arithmetic-10',
  name: 'design',
  split: 'train',
  scenarios: ['arithmetic'],
  template: 'solve-puzzle/classic',
  design: {
    answerLabel: 'Your answer:',
    parts: {
      answerActions: (base, S) => (fieldEl) => {
        S.P.button(
          S.scene,
          'Clear',
          { clear: true },
          () => {
            fieldEl.value = '';
            fieldEl.dispatchEvent(new Event('input', { bubbles: true }));
          },
          'control',
        );
      },
      submitAllowed: (base) => (el) =>
        base(el) && (!el.dataset.placement || el.dataset.placement === 'form'),
    },
  },
});
