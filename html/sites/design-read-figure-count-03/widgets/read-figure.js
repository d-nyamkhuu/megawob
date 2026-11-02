// This design adds dark shape outlines and uses a three-row board with smaller large glyphs.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-count-03',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'read-figure/scene',
  design: {
    shapeStroke: '#171717',
    shapeStrokeWidth: 2,
    boardRows: 3,
    largeScale: 0.7,
  },
});
