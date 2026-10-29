// This site keeps its left-item/right-box layout traits and uses the template's single design preset.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-single-02',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  traits: { itemsAt: 'left', containers: [{ x: 0.56, y: 0.27, w: 0.25, h: 0.42 }] },
  template: 'sort-into-bins/boxes',
  design: {},
});
