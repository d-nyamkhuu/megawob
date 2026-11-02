// This collect design keeps its narrow central container placement on the shared boxes template.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-collect-08',
  name: 'design',
  split: 'train',
  scenarios: ['collect'],
  traits: { containers: [{ x: 0.32, y: 0.06, w: 0.36, h: 0.88 }] },
  template: 'sort-into-bins/boxes',
  design: {},
});
