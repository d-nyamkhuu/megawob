// This design defers agreement scroll restoration and ignores scroll events until the user interacts.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-sign-agreement-05',
  name: 'design',
  split: 'train',
  scenarios: ['sign-agreement'],
  template: 'handle-text/editor',
  design: {
    signScrollMode: 'touched',
    deferSignRestore: true,
  },
});
