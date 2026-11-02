// Preserve the source line count used to size this site's multiline copy panes.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-2-06',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste-2'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {
    parts: {
      sourceLines: (base, S) => (ctx, text, source) => {
        text.style.setProperty('--ut-source-lines', source.lines.length);
      },
    },
  },
});
