// Uses the multi template preset with this site's title and colon-only field labels.
env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-04',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    title: 'Contact Information',
    parts: {
      labelText: () => (f) => `${f.label}:`,
    },
  },
});
