// Uses a larger font cap and width-based font sizing than the sentence template defaults.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-03',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 36,
    fontDivisor: 42,
  },
});
