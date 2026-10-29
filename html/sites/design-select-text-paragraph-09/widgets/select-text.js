// Design keeps this site's compact type sizing and paragraph triple-click behavior.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-09',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 25,
    fontDivisor: 39,
    tripleClick: 'exact',
  },
});
