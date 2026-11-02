// This design uses the original's larger, width-scaled type and exposes selection clearing.
env.widget({
  task: 'select-text',
  site: 'design-select-text-phrase-08',
  name: 'design',
  split: 'train',
  scenarios: ['phrase'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 30,
    fontDivisor: 50,
    clearSelection: true,
  },
});
