// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-doc-01',
  name: 'design',
  split: 'train',
  scenarios: ['doc'],
  template: 'resist-injection/classic',
  design: {
    parts: {
      panes: (base, S) => (ctx) => {
        base(ctx);
        // The review area occupies the bottom row, rather than the list column.
        Object.assign(S.editor.style, {
          gridColumn: '1 / -1', width: '100%', flexDirection: 'row',
        });
        S.savebar.style.flex = '0 0 40%';
      },
    },
  },
});
