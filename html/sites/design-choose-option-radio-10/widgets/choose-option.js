// Design: customize the email content heading and its two decorative options.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-radio-10',
  name: 'design',
  split: 'train',
  scenarios: ['radio'],
  template: 'choose-option/widgets',
  design: {
    emailContentTitle: 'Other options',
    emailOptions: ['Also receive product news', 'Include special offers'],
  },
});
