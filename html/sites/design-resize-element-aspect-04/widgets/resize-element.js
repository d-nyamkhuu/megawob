// Design on templates/resize-element/base.js: the base site's resize-element widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-aspect-04',
  name: 'design',
  split: 'train',
  scenarios: ['aspect'],
  template: 'resize-element/base',
  design: {
    parts: {
      'window.scenarios': (base, S) => ['numeric', 'ghost'],
    },
  },
});
