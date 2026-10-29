// Use the shared copy-paste-2 layout and dock this site's end-control container.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-2-01',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste-2'],
  template: 'handle-text/editor',
  design: {
    endSelector: '.chrome-end-dock',
  },
});
