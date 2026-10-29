// This design exposes the checkbox group's row count to the site's grid layout.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-checkbox-09',
  name: 'design',
  split: 'train',
  scenarios: ['checkbox'],
  template: 'choose-option/widgets',
  design: {
    choiceRowsVar: '--fp-rows',
  },
});
