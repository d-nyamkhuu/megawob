// The scroll-text preset supplies this site's printed document layout and range display.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-scroll-text-02',
  name: 'design',
  split: 'train',
  scenarios: ['scroll-text'],
  template: 'handle-text/editor',
  design: {
    printMin: 22,
    printMax: 25,
    printDivisor: 65,
    documentFieldLabel: 'Found word:',
  },
});
