// Uses the shared focus form; its intro, numbered labels and decoy fields match this site's design.
env.widget({
  task: 'click-control',
  site: 'design-click-control-focus-11',
  name: 'design',
  split: 'train',
  scenarios: ['focus'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {},
});
