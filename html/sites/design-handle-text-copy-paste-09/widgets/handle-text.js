// Preserve this site's multiline paste field and dense-source styling threshold.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-09',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {
    denseSources: 2,
    parts: {
      fieldInput: (base, S) => (ctx, row) => {
        const multiline = ctx.spec.scenario === 'copy-paste' &&
          ctx.spec.boxes.some((b) => /[\r\n]/.test(b.text));
        const input = ctx.util.el(multiline ? 'textarea' : 'input', 'ut-input', row);
        if (multiline) input.rows = 1;
        else input.type = 'text';
        return input;
      },
    },
  },
});
