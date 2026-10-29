// Design for the wider grid gap and larger tiles used by this site.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-grid-08',
  name: 'design',
  split: 'train',
  scenarios: ['grid'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    gridGap: .0235,
    gridHeight: .845,
    gridWidth: .84,
  },
});
