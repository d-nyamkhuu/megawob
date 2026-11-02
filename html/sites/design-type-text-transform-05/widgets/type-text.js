// Adds an empty-field class and underlines the “answer” word in the matching label.
env.widget({
  task: 'type-text',
  site: 'design-type-text-transform-05',
  name: 'design',
  split: 'train',
  scenarios: ['transform'],
  template: 'type-text/fields',
  design: {
    emptyClass: 'empty',
    parts: {
      fieldDone: () => (ctx, e) => {
        if (e.text === 'Your answer') e.label.innerHTML = 'Your <u>answer</u>:';
      },
    },
  },
});
