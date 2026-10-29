// The password design uses the template's sampled look and password-specific label behavior.
env.widget({
  task: 'type-text',
  site: 'design-type-text-password-10',
  name: 'design',
  split: 'train',
  scenarios: ['password'],
  template: 'type-text/fields',
  design: {
    placeholderLayout: null,
    parts: {
      fieldDone: () => (ctx, e) => {
        if (e.label) e.label.classList.toggle('ft-long-label', e.text.length > 16);
      },
    },
  },
});
