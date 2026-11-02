// This design omits the geometric backdrop decoration used by the template preset.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-popup-02',
  name: 'design',
  split: 'train',
  scenarios: ['popup'],
  template: 'act-in-time/arena',
  design: { geometric: false, pendingVisible: true },
});
