// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-filter-03',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'transfer-items/dual',
  // Allow compact stages to fit the capped rows inside the card's placement margins.
  design: { minPitch: 18 },
});
