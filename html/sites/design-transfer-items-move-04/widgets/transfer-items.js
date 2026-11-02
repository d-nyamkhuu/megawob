// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-move-04',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'transfer-items/dual',
  design: {
    // Leave room for longer held-out lists within the stage's measured size.
    minPitch: 18,
    fontFamily: 'Georgia, "Times New Roman", serif',
    colors: {
      panel: '#fff', line: '#c8bead', fg: '#211911', muted: '#756a58',
      accent: '#b9d3f4', selected: '#211911', selectedIndex: '#756a58',
    },
    cardShadow: 'none',
  },
});
