// Allows dropdown option rows to grow up to four pixels taller than the template default.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-dropdown-05',
  name: 'design',
  split: 'train',
  scenarios: ['dropdown'],
  template: 'choose-option/widgets',
  design: {
    rowMaxExtra: 4,
  },
});
