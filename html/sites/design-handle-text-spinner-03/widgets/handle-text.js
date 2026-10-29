// Uses filled arrow glyphs with the shared spinner wheel and preview behavior.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-spinner-03',
  name: 'design',
  split: 'train',
  scenarios: ['spinner'],
  template: 'handle-text/editor',
  design: {
    upSvg: '<svg viewBox="0 0 20 12" fill="currentColor"><path d="M0 12L10 0L20 12Z"/></svg>',
    downSvg: '<svg viewBox="0 0 20 12" fill="currentColor"><path d="M0 0L10 12L20 0Z"/></svg>',
  },
});
