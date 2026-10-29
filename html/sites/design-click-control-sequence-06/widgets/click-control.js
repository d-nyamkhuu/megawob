// This sequence design keeps the template defaults for its larger buttons and six labelled decoys.
env.widget({
  task: 'click-control',
  site: 'design-click-control-sequence-06',
  name: 'design',
  split: 'train',
  scenarios: ['sequence'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {},
});
