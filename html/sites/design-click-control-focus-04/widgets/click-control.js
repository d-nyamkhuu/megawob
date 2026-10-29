// Focus form design; its intro, numbered labels, and decoy rows use the template defaults.
env.widget({
  task: 'click-control',
  site: 'design-click-control-focus-04',
  name: 'design',
  split: 'train',
  scenarios: ['focus'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {},
});
