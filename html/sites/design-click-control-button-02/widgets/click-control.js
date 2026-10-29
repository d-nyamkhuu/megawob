// This design uses the shared button controls with the site's original menu interaction trait.
env.widget({
  task: 'click-control',
  site: 'design-click-control-button-02',
  name: 'design',
  split: 'train',
  scenarios: ['button'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {},
});
