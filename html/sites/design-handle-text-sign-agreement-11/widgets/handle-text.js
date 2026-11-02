// This design waits for user interaction before accepting agreement scroll updates.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-sign-agreement-11',
  name: 'design',
  split: 'train',
  scenarios: ['sign-agreement'],
  template: 'handle-text/editor',
  design: {
    signScrollMode: 'touched',
  },
});
