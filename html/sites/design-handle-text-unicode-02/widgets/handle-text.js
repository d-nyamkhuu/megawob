// Uses the Unicode preset for its sample text, placeholder, full-stage layout, and action row.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-unicode-02',
  name: 'design',
  split: 'train',
  scenarios: ['unicode'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {},
});
