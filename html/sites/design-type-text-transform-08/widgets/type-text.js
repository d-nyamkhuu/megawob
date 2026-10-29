// Keeps this site's empty-field marker for its custom caret decoration.
env.widget({
  task: 'type-text',
  site: 'design-type-text-transform-08',
  name: 'design',
  split: 'train',
  scenarios: ['transform'],
  template: 'type-text/fields',
  design: {
    parts: {
      paintInput: (base) => (x, id, m) => {
        base(x, id, m);
        x.el.dataset.empty = String(!(m.fields[id] ?? ''));
      },
    },
  },
});
