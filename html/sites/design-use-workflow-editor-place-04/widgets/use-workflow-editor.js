// Closed auxiliary panels keep the single-purpose canvas view. Their original
// controls remain available in disclosure menus, built before initial measurement.
function flowDrawer(S, parent, content, cls, label) {
  const drawer = S.P.el('details', cls, parent);
  S.P.el('summary', 'flow-drawer-label', drawer, label);
  drawer.append(content);
  return drawer;
}
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-place-04',
  name: 'design',
  split: 'train',
  scenarios: ['place'],
  template: 'use-workflow-editor/editor',
  design: {
    paletteWidth: 292,
    tightPaletteWidth: 190,
    tightWidth: 1100,
    fontFamily: '"Segoe UI", Arial, sans-serif',
    extraCSS: `
      .flow-drawer-label { cursor:pointer; padding:5px 10px; color:#42556c; font-size:11px; }
      .flow-workflow-menu { flex:none; height:28px; background:#f8fafc; }
      .flow-workflow-menu .af-top { position:absolute; z-index:30; top:28px; left:0; right:0; background:var(--panel); }
      .flow-navigation-menu { position:relative; flex:none; }
      .flow-navigation-menu .af-worknav { position:absolute; z-index:30; top:24px; left:0; width:100%; background:var(--panel); border:1px solid var(--line); }
      .flow-inspector-menu, .flow-runs-menu { position:absolute; top:-64px; z-index:25; }
      .flow-inspector-menu { right:0; }
      .flow-runs-menu { right:120px; }
      .flow-inspector-menu .af-overview { display:flex; position:absolute; right:0; top:28px; width:210px; max-height:300px; border:1px solid var(--line); }
      .flow-runs-menu .af-executions { position:absolute; right:0; top:28px; width:360px; height:113px; border:1px solid var(--line); }
    `,
    parts: {
      top: (base, S) => (ctx) => {
        base(ctx);
        const app = S.els.app;
        flowDrawer(S, app, app.lastElementChild, 'flow-workflow-menu', 'Workflow');
      },
      navigation: (base, S) => (ctx, palette) => {
        base(ctx, palette);
        flowDrawer(S, palette, palette.lastElementChild, 'flow-navigation-menu', 'Workspace');
      },
      overview: (base, S) => (ctx) => {
        base(ctx);
        const body = S.els.body;
        flowDrawer(S, body, body.lastElementChild, 'flow-inspector-menu', 'Step inspector');
      },
      executions: (base, S) => (ctx) => {
        base(ctx);
        flowDrawer(S, S.els.workspace, S.els.executions, 'flow-runs-menu', 'Recent executions');
      },
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const tabs = S.els.bar.firstElementChild;
        tabs.children[0].addEventListener('click', () => { S.els.executions.parentElement.open = false; });
        tabs.children[1].addEventListener('click', () => { S.els.executions.parentElement.open = true; });
      },
    },
  },
});
