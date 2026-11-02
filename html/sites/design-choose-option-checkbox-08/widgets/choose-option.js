// This design keeps the topic grid traits and connects the page's Clear control.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-08',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  traits: { grid: true, topic: 'topics', count: [16, 16] },
  template: 'choose-option/widgets',
  design: {
    clearSelector: '.ds-clear',
  },
});
