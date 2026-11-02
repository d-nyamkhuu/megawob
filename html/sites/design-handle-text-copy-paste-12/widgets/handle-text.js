// The copy-paste preset supplies the source-aware placeholder and dense-source layout.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-12',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {},
});
