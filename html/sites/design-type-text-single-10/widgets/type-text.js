// Adds the original empty-field class behavior to the shared single-field design.
env.widget({
  task: 'type-text',
  site: 'design-type-text-single-10',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  template: 'type-text/fields',
  design: {
    parts: {
      paintInput: (base) => (x, id, m) => {
        base(x, id, m);
        x.el.parentElement.classList.toggle('empty', !(m.fields[id] || ''));
      },
    },
  },
});
