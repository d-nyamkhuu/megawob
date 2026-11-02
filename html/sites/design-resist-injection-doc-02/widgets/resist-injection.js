// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-doc-02',
  name: 'design',
  split: 'train',
  scenarios: ['doc'],
  template: 'resist-injection/classic',
  design: {
    accent: '#1a73e8',
    panel: '#fff',
    foreground: '#182236',
    background: '#f5f8fd',
    muted: '#687d9c',
    line: '#d5e0ef',
    paperFont: 'Arial, sans-serif',
    widthInset: 0,
    editorWidth: '29%',
    compactEditorWidth: '29%',
    sourcePadding: '34px 8%',
    compactSourcePadding: '34px 8%',
    inputFont: '16px/1.45 Arial, sans-serif',
    parts: {
      // The shell already supplies the workspace title and document index.
      header: () => () => {},
      toolbar: (base, S) => (ctx) => {
        const toolbar = ctx.util.el('div', 'si-toolbar fn-pdf-toolbar', S.app);
        S.toolbar = toolbar;
        Object.assign(toolbar.style, {
          minHeight: '52px', padding: '0 22px',
        });
        ctx.util.el('span', 'fn-pdf-title', toolbar, S.spec.sourceTitle);
        const pages = ctx.util.el('span', 'fn-pdf-pages', toolbar, '1   /   8      |      −      100%      +');
        pages.style.marginLeft = 'auto';
      },
    },
  },
});
