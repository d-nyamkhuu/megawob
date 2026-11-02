// This design exposes the original three-option row count as a CSS variable.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-04',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  template: 'choose-option/widgets',
  design: {
    choiceRowsVar: '--ol-rows',
    choiceRowsDivisor: 3,
  },
});
