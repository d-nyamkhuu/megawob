// Adds conditional trailing colons and long-label styling to the shared multi-field form.
env.widget({
  task: 'type-text',
  site: 'design-type-text-multi-02',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'type-text/fields',
  design: {
    parts: {
      labelText: () => (f, look) => {
        const text = f.label + (look.optional && f.blank ? ' (optional)' : '');
        return text + (f.label.endsWith(':') ? '' : ':');
      },
      labelClass: () => (text, look) =>
        'ft-label' + (text.length > 19 ? ' ft-long-label' : '') + (look.caps ? ' caps' : ''),
    },
  },
});
