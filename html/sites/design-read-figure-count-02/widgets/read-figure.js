// This design keeps typed answers independent of model paints, as in the original site.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-count-02',
  name: 'design',
  split: 'train',
  scenarios: ['count'],
  template: 'read-figure/scene',
  design: {
    inputSynced: false,
  },
});
