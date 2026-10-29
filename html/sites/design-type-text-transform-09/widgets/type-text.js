// Design on templates/type-text/fields.js. The transform form shows nothing but the answer field: the text to
// transform is part of the goal (tasks/type-text/logic.js), so the page has no copy of it.
env.widget({
  task: 'type-text',
  site: 'design-type-text-transform-09',
  name: 'design',
  split: 'train',
  scenarios: ['transform'],
  template: 'type-text/fields',
  design: {
    placeholderAlways: '',
    parts: {
      labelText: () => () => 'Your answer',
    },
  },
});
