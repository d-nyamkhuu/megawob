// This single design keeps its inset triangle and site-specific row placement on the shared boxes template.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-single-01',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  traits: {
    layout: 'rows',
    itemsAt: 'left',
    itemSize: 0.347,
    containers: [{ x: 0.493, y: 0.2665, w: 0.45, h: 0.467 }],
  },
  template: 'sort-into-bins/boxes',
  design: {
    shapes: {
      triangle: '<polygon points="50,12.5 95,87.5 5,87.5" stroke-linejoin="round"/>',
    },
  },
});
