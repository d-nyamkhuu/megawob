// This design uses the Unicode preset for its sample, placeholder, full-stage layout, and action row.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-unicode-07',
  name: 'design',
  split: 'train',
  scenarios: ['unicode'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {},
});
