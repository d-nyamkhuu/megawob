// Site design on templates/handle-text/editor.js; shared behavior and part signatures are documented there.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-spinner-12',
  name: 'design',
  split: 'train',
  scenarios: ['spinner'],
  template: 'handle-text/editor',
  design: {
    upSvg: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7.8L6 4.3l3.5 3.5"/></svg>',
    downSvg: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4.2L6 7.7l3.5-3.5"/></svg>',
    spinnerWheel: false, spinnerPreview: false,
  },
});
