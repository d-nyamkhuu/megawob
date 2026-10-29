// Design on templates/fill-form/base.js: the base site's fill-form widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-fix-02',
  name: 'design',
  split: 'train',
  scenarios: ['fix'],
  template: 'fill-form/base',
  design: {
    parts: {
      buildFrame: (base, S) => function (ctx, formBuilder) {
        const view = base(ctx, formBuilder);
        // The window already supplies its inset; avoid spending another
        // 24 vertical pixels on the template's outer document margins.
        S.st.root.style.margin = '0 16px';
        S.st.root.style.maxHeight = Math.max(0, ctx.size.height) + 'px';
        S.st.root.style.minHeight = '0';
        return view;
      },
      showList: (base, S) => function (dd, btn, list, open) {
        base(dd, btn, list, open);
        if (!open || dd.closest('.ff-scan')) return;
        const stage = S.st.ctx.stage.getBoundingClientRect();
        const button = btn.getBoundingClientRect();
        const above = button.top - stage.top - 8;
        const below = stage.bottom - button.bottom - 8;
        const up = list.scrollHeight > below && above > below;
        dd.classList.toggle('up', up);
        list.style.maxHeight = Math.max(40, up ? above : below) + 'px';
        list.style.overflow = 'auto';
      },
      workspace: (base, S) => function (ctx, scan) {
        // Keep the reference's rendering, random draws and target wiring. The
        // design owns pane geometry here so its normal font fitting can run.
        ctx.css('gem-task-layout', `
          .gem-workspace .ff-appbar,.gem-workspace .ff-contextbar,
          .gem-workspace .ff-queue,.gem-workspace .ff-work-status,
          .gem-workspace .ff-record-bar,.gem-workspace .ff-sub,
          .gem-workspace .ff-form h2 { display:none; }
          .gem-workspace .ff-workbody { min-width:0; min-height:0; }
          .gem-workspace .ff-workcenter { align-items:flex-start; }
          .gem-workspace .ff-root { display:grid; grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr); grid-template-rows:auto minmax(0,1fr); align-items:start; gap:0 8px; }
          .gem-workspace .ff-panels { display:contents; }
          .gem-workspace .ff-tabs { grid-column:2; grid-row:1; padding:0; border:0; gap:2px; }
          .gem-workspace .ff-tab { padding:.4em .8em; margin:0; font-size:1em; }
          .gem-workspace .ff-docpane { position:relative; grid-column:1; grid-row:1 / span 2; min-width:0; padding:2.2em .6em .5em; }
          .gem-workspace .ff-docpane.off { visibility:visible; pointer-events:auto; }
          .gem-workspace .ff-docpane:before { content:'Document'; position:absolute; top:0; left:0; right:0; padding:.3em .7em; border-bottom:2px solid #111; background:#ddd; font:bold 1em 'Courier New',monospace; }
          .gem-workspace .ff-formpane { grid-column:2; grid-row:2; align-self:start; min-width:0; max-width:100%; }
          .gem-workspace .ff-root:not(.tabs) .ff-docpane,
          .gem-workspace .ff-root:not(.tabs) .ff-formpane { grid-row:1; }
          .gem-workspace .ff-forminner { max-width:100%; }
          .gem-workspace .ff-form { width:100%; padding:1.1em .8em; }
          .gem-workspace .ff-grid { display:grid; gap:1em; }
          .gem-workspace .ff-grid.two .ff-field:not(.ff-wide) { display:block; }
          .gem-compact-form .ff-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .gem-compact-form .ff-field:not(.ff-wide) { display:block; }
          .gem-compact-form .ff-wide { grid-column:1 / -1; }
          .gem-workspace .ff-field:not(.ff-wide) { display:grid; grid-template-columns:minmax(0,.7fr) minmax(0,1fr); align-items:center; gap:.5em; }
          .gem-workspace .ff-label { margin:0; font-size:1em; }
          .gem-workspace .ff-input,.gem-workspace .ff-ddbtn { height:2.3em; font-size:1em; }
          .gem-workspace .ff-ddbtn { width:100%; }
          .gem-workspace .ff-inspector { overflow:auto; }
        `);
        const shell = base(ctx, scan);
        shell.root.classList.add('gem-workspace');
        shell.root.classList.toggle('gem-compact-form', ctx.spec.fields.length > 6 && ctx.size.height < 480);
        shell.root.style.width = Math.max(0, ctx.size.width) + 'px';
        shell.root.style.height = Math.max(0, ctx.size.height) + 'px';
        shell.root.style.margin = '0';
        return shell;
      },
    },
  },
});
