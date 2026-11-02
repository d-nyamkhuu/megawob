// Uses the shared card template with this site's tighter Memphis row sizing.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-list-08',
  name: 'design',
  split: 'train',
  scenarios: ['list'],
  template: 'reorder-items/cards',
  design: {
    listHeight: .0735,
    listFill: .52,
  },
});
