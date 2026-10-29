// Design of this site on click-control/controls: keeps its larger sequence buttons and omits template decoys.
env.widget({
  task: 'click-control',
  site: 'design-click-control-sequence-12',
  name: 'design',
  split: 'train',
  scenarios: ['sequence'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    seqW: 280,
    seqH: 120,
    seqHFrac: 0.24,
    seqDecoys: 0,
  },
});
