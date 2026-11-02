// Keeps this site's generated number mirrored in the page preview.
env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-generate-04',
  name: 'design',
  split: 'train',
  scenarios: ['generate'],
  template: 'solve-puzzle/classic',
  design: {
    parts: {
      value: (base) => (model) => {
        const preview = document.querySelector('.preview-value');
        if (preview) preview.textContent = model.value === null ? '—' : model.value;
      },
    },
  },
});
