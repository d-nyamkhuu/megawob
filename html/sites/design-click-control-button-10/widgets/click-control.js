// This design enables the button hint and keeps the site's menu interaction trait.
env.widget({
  task: 'click-control',
  site: 'design-click-control-button-10',
  name: 'design',
  split: 'train',
  scenarios: ['button'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    helper: true,
  },
});
