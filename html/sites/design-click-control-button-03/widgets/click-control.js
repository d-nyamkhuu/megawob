// This design uses the shared button controls and keeps this site's menu interaction trait.
env.widget({
  task: 'click-control',
  site: 'design-click-control-button-03',
  name: 'design',
  split: 'train',
  scenarios: ['button'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {},
});
