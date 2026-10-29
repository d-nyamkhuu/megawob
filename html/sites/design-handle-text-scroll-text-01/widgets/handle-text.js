// The scroll-text preset reproduces this site's printed document layout and scrolling behavior.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-01',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {},
});
