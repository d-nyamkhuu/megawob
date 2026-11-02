// Sentence design: larger type and triple-click selects the nearest paragraph.
env.widget({
  task: 'select-text',
  site: 'design-select-text-sentence-07',
  name: 'design',
  split: 'train',
  scenarios: ['sentence'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 34,
    fontDivisor: 40,
    tripleClick: 'nearest',
  },
});
