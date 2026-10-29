// This design keeps the greatest cards and omits the template's default reset control.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-greatest-02',
  name: 'design',
  split: 'train',
  scenarios: ['greatest'],
  template: 'read-figure/scene',
  design: { resetLabel: null },
});
