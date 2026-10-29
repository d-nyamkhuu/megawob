// The scroll-text preset supplies this site's printed document and reading-range treatment.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-06',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {},
});
