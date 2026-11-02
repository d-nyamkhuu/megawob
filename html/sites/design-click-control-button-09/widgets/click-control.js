// Design of this site on click-control/controls: retain the button scenario's shared rendering and status behavior.
env.widget({
  task: 'click-control',
  site: 'design-click-control-button-09',
  name: 'design',
  split: 'train',
  scenarios: ['button'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {},
});
