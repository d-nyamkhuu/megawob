// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-code-04',
  name: 'design',
  split: 'train',
  scenarios: ['code'],
  template: 'resist-injection/classic',
  design: {
    compactEditorWidth: '242px', topHeight: '32px', widthInset: 0, heightInset: 0,
    parts: {
      panes: (base, S) => (ctx) => {
        base(ctx);
        if (ctx.size.height < 440) {
          S.fields.style.padding = '6px 12px';
          S.savebar.style.padding = '6px 12px';
        }
      },
      field: (base, S) => (parent, label, name, textarea = false) => {
        const input = base(parent, label, name, textarea);
        if (textarea && S.ctx.size.height < 440) input.style.height = '32px';
        return input;
      },
    },
  },
});
