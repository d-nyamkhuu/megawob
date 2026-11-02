// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-email-03',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'resist-injection/classic',
  design: {
    navThreshold: 0,
    accent: '#2477b7', panel: '#fff', foreground: '#1d2833', background: '#f8fbfd',
    muted: '#526577', line: '#c4d4e1', appRadius: '5px',
    appShadow: '0 1px 5px #526d8528,inset 0 1px #fff',
    parts: {
      frame: (base, S) => (ctx) => {
        const app = base(ctx);
        app.style.width = `${Math.min(1020, ctx.size.width <= 1024 ? ctx.size.width - 24 : ctx.size.width * .61)}px`;
        app.style.height = `${ctx.size.height}px`;
        return app;
      },
      field: (base, S) => (parent, label, name, textarea) => {
        const input = base(parent, label, name, textarea);
        if (textarea) {
          const compact = S.ctx.size.height < 480;
          input.style.height = compact ? '44px' : '54px';
          if (compact) {
            input.style.marginTop = '0';
            Object.assign(input.parentElement.style, {
              display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)',
              alignItems: 'center', gap: '8px',
            });
          }
        }
        return input;
      },
      // Reserve separate cells for reading and replying, including on short windows.
      panes: (base, S) => (ctx) => {
        base(ctx);
        Object.assign(S.body.style, {
          display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gridTemplateRows: 'minmax(120px,1fr) minmax(0,270px)',
        });
        Object.assign(S.source.style, { gridColumn: '2', gridRow: '1' });
        Object.assign(S.editor.style, {
          gridColumn: '2', gridRow: '2', width: '100%',
          borderTop: '1px solid #b8cbd9',
        });
      },
      properties: (base, S) => (ctx) => {
        base(ctx);
        Object.assign(S.fields.style, {
          display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)',
          alignContent: 'start', alignItems: 'center', gap: '4px 8px', padding: '6px 12px',
        });
        for (const node of S.fields.children) {
          node.style.margin = '0';
          if (node.tagName === 'H3' || node.tagName === 'LABEL' || node === S.selection) node.style.gridColumn = '1 / -1';
        }
        Object.assign(S.savebar.style, { padding: '6px 12px' });
        Object.assign(S.feedback.style, { minHeight: '14px', lineHeight: '14px', marginBottom: '4px' });
      },
      navigation: (base, S) => (ctx) => {
        base(ctx);
        const nav = S.rowNodes.values().next().value?.parentElement;
        if (nav) Object.assign(nav.style, {
          gridColumn: '1', gridRow: '1 / span 2', width: '100%', minWidth: '0',
        });
      },
    },
  },
});
