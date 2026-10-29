// This design uses a multiline answer field and the original dense-source layout.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-02',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste'],
  template: 'handle-text/editor',
  design: {
    copyPlaceholder: false,
    denseSources: 3,
    sourceGrid: true,
    parts: {
      fieldInput: (base, S) => (ctx, row) => ctx.util.el('textarea', 'ut-input', row),
      fieldCreated: (base, S) => (ctx, field) => { field.input.placeholder = ''; },
    },
  },
});
