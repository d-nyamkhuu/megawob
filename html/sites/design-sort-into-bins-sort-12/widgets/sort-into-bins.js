// This design uses the sort preset's sharp squares and color-matched bins.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-sort-12',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  traits: { itemsAt: 'left', orient: 'row' },
  template: 'sort-into-bins/boxes',
  design: {},
});
