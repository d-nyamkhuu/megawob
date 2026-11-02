// Adds the empty-field caret marker used by this site's form styling.
env.widget({
  task: 'type-text',
  site: 'design-type-text-transform-07',
  name: 'design',
  split: 'train',
  scenarios: ['transform'],
  scrollable: (spec) => !!spec.long,
  template: 'type-text/fields',
  design: {
    parts: {
      paintInput: (base) => (x, id, m) => {
        base(x, id, m);
        x.el.parentElement.classList.toggle('ft-empty', !m.fields[id]);
      },
    },
  },
});
