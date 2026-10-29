// Adds a line-count CSS variable to line-based source boxes for this design.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-2-02',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste-2'],
  template: 'handle-text/editor',
  design: {
    parts: {
      sourceLines: (base, S) => (ctx, text, box, index) => {
        if (box.lines) text.style.setProperty('--risc-line-count', String(box.lines.length));
      },
    },
  },
});
