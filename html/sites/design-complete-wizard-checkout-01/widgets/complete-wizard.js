// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-checkout-01',
  name: 'design',
  split: 'train',
  scenarios: ['checkout'],
  template: 'complete-wizard/stepper',
  design: { look: { stepHead: true, ind: 'circles', cols: 1 } },
});
