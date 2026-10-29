// Design on templates/resize-element/panel.js.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-01',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: {'grips': ['se'], 'geometry': {'start': {'w': [360, 380], 'h': [425, 445]}, 'target': {'w': 470, 'h': 475}, 'max': {'w': 510, 'h': 510}, 'portrait': true, 'grow': true}},
  template: 'resize-element/panel',
  design: {},
});
