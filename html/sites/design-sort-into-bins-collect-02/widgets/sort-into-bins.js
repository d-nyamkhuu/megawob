// This collect design uses the template's default Box caption and layout.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-collect-02',
  name: 'design',
  split: 'train',
  scenarios: ['collect'],
  template: 'sort-into-bins/boxes',
  design: { caption: 'Drop Shapes Here' },
});
