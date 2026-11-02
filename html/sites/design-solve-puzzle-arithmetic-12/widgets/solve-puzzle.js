// This design places the wired answer in the homepage preview and respects frame-owned submit controls.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-arithmetic-12',
  name: 'design',
  split: 'train',
  scenarios: ['arithmetic'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      expression: (base) => () => {
        const expression = base();
        const preview = document.querySelector('.preview-expression');
        if (preview) preview.textContent = expression;
        return expression;
      },
      answerActions: () => (answerInput) => {
        const previewField = document.querySelector('.preview-empty');
        if (previewField) {
          answerInput.classList.add('preview-empty');
          previewField.replaceWith(answerInput);
          answerInput.setAttribute('aria-label', 'Your answer:');
        }
      },
      submitAllowed: () => (el) => !el.dataset.chromeEnd,
    },
  },
});
