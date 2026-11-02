// This design uses the paragraph template with the original's wider type scaling.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-02',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true, triple: true },
  template: 'select-text/paragraphs',
  design: { fontDivisor: 35 },
});
