// This copy-paste design uses a multiline answer field for the long source text.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-10',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste'],
  template: 'handle-text/editor',
  design: {
    parts: {
      fieldInput: (base, S) => (ctx, row, id) => {
        const input = ctx.util.el('textarea', 'ut-input', row);
        input.rows = 4;
        return input;
      },
    },
  },
});
