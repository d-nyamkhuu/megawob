// This design leaves the email intro paragraph empty.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-radio-04',
  name: 'design',
  split: 'train',
  scenarios: ['radio'],
  template: 'choose-option/widgets',
  design: {
    emailNote: '',
  },
});
