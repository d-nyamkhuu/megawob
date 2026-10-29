// This design uses sharp-cornered square shapes; the sort preset supplies the matching box colors.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-sort-02',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  template: 'sort-into-bins/boxes',
  design: {
    shapes: { square: '<rect x="8" y="8" width="84" height="84"/>' },
  },
});
