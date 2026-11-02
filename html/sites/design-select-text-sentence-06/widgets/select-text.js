// Uses a larger, slightly narrower font scale while keeping paragraph counts enabled.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-06',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 35,
    fontDivisor: 41,
  },
});
