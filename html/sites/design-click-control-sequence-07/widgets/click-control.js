// Design of this site on click-control/controls: seven widely spaced sequence controls, including decoys.
env.widget({
  task: 'click-control',
  site: 'design-click-control-sequence-07',
  name: 'design',
  split: 'train',
  scenarios: ['sequence'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    seqSpots: [
      [0.05, 0.02],
      [0.4, 0.05],
      [0.74, 0.02],
      [0.2, 0.4],
      [0.55, 0.4],
      [0.07, 0.77],
      [0.57, 0.74],
    ],
    seqDecoys: 7,
  },
});
