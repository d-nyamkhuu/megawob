// This design mirrors entered values into the site's text preview.
env.widget({
  task: 'type-text',
  site: 'design-type-text-single-06',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  template: 'type-text/fields',
  design: {
    parts: {
      painted: () => (m) => {
        const preview = document.querySelector('.ds-preview-text');
        if (preview) preview.textContent = 'Text: ' + Object.values(m.fields).join(' ');
      },
    },
  },
});
