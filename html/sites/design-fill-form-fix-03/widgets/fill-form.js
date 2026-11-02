// Community styling on the shared fill-form template; its fitting and controls remain intact.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-fix-03',
  name: 'design',
  split: 'train',
  scenarios: ['fix'],
  template: 'fill-form/base',
  design: {
    parts: {
      buildFrame: (base) => (ctx, formBuilder) => {
        const view = base(ctx, formBuilder);
        if (!ctx.spec.layout.long) {
          const pane = ctx.stage.querySelector('.ff-formpane');
          const height = ctx.size.height - 24 - (ctx.spec.layout.tabs ? 48 : 0);
          // Preserve the template's font fitting; scroll only when it cannot fit.
          if (pane && pane.getBoundingClientRect().height > height) {
            pane.style.maxHeight = `${Math.max(0, height)}px`;
            pane.style.overflow = 'auto';
          }
        }
        return view;
      },
      // Keep the workspace within the actual stage, including instruction modes.
      workspace: (base) => (ctx, scan = false) => {
        ctx.css('meadow-workspace', `
        .ff-workspace .ff-workbody { min-height:0; }
        .ff-workspace:is(.wide,.compact) .ff-queue,.ff-workspace .ff-queue { width:25%; min-width:0; padding:0; margin-right:9px; gap:0; }
        .ff-workspace .ff-queue::before { content:'Invoices'; display:block; flex:none; padding:8px 12px; background:#c5cbe4; border-bottom:2px ridge #a5a9b8; font:bold 21px Georgia,serif; }
        .ff-workspace .ff-queue-list { display:block; position:relative; min-height:0; overflow:auto; padding:32px 0 0; }
        .ff-workspace .ff-queue-list::before { content:'Date                    Vendor                 Amount'; position:absolute; inset:0 0 auto; height:32px; display:flex; align-items:center; padding:0 8px; background:#ececf1; border-bottom:1px solid #b8b8bf; font:bold 14px Georgia,serif; white-space:pre; overflow:hidden; }
        .ff-workspace .ff-queue-record { display:grid; grid-template-columns:31% minmax(0,1fr) 25%; align-items:center; gap:3px; min-height:42px; padding:4px 7px; font:14px Georgia,serif; }
        .ff-workspace .ff-queue-record strong { grid-column:2; grid-row:1; font:14px Georgia,serif; }
        .ff-workspace .ff-queue-record small { grid-column:1 / -1; font:10px Georgia,serif; }
        .ff-workspace .ff-queue-record::before { grid-column:1; grid-row:1; font:13px Georgia,serif; white-space:nowrap; }
        .ff-workspace .ff-queue-record::after { grid-column:3; grid-row:1; text-align:right; font:13px Georgia,serif; }
        .ff-workspace .ff-workcenter { min-height:0; }
        @media(max-width:1150px) {
          .ff-workspace .ff-queue { width:22%; }
          .ff-workspace .ff-queue-list::before { content:'Vendor'; }
          .ff-workspace .ff-queue-record { grid-template-columns:minmax(0,1fr); }
          .ff-workspace .ff-queue-record strong { grid-column:1; }
          .ff-workspace .ff-queue-record::before,.ff-workspace .ff-queue-record::after { content:none; }
        }
        `);
        ctx.css('meadow-form', `
        .ff-root { font-family:Georgia,'Times New Roman',serif; gap:8px; }
        .ff-root:not(.tabs) { flex-direction:row; }
        .ff-root .ff-formpane { min-height:0; }
        .ff-root .ff-invoice { padding:1.4em 1.3em; }
        .ff-root .ff-form { padding:1.1em; }
        .ff-root .ff-form h2 { margin:0 0 .8em; padding:.4em .6em; font-size:1.3em; }
        .ff-root .ff-label { font-weight:bold; }
        `);
        const shell = base(ctx, scan);
        shell.root.style.width = `${ctx.size.width}px`;
        if (!ctx.spec.layout.long) shell.root.style.height = `${ctx.size.height}px`;
        shell.root.style.margin = '0';
        return shell;
      },
    },
  },
});
