// This design exposes the option count as --choice-rows for the site CSS.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-06',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  traits: { topic: 'amenities', count: [18, 18] },
  template: 'choose-option/widgets',
  design: {
    choiceRowsVar: '--choice-rows',
    choiceRowsDivisor: 3,
  },
});
