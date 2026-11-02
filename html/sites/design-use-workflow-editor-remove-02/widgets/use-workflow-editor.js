// Design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-remove-02',
  name: 'design',
  split: 'train',
  scenarios: ['remove'],
  template: 'use-workflow-editor/editor',
  design: {
    frameInset: 0,
    frameRadius: 0,
    paletteWidth: 205,
    tightPaletteWidth: 175,
    paletteTitle: 'Steps',
    fontFamily: 'Georgia,"Times New Roman",serif',
    // 2008 look: cream surfaces, a workflow title above the canvas, the controls under it,
    // and a plain step list on the left.
    extraCSS: `
  .af-app { background:#fffefa; border-color:#c7c4bd; }
  .af-workspace,.af-canvas { background-color:#fffefa; }
  .relay-workflow-head { flex:none; display:flex; align-items:center; justify-content:space-between; height:54px; padding:0 0 5px 12px;
    border-bottom:1px solid #bdbab3; background:#f6f5f1; }
  .relay-workflow-head strong { font:bold 34px/1 Georgia,"Times New Roman",serif; white-space:nowrap; }
  .relay-workflow-head span { color:#4e4b46; font-size:16px; padding-right:8px; }
  .af-app .af-palette { background:#fbfaf7; border-right:1px solid #c7c4bd; }
  .af-app .af-palette h3 { margin:0; padding:10px 14px; height:54px; border-bottom:1px solid #c7c4bd; background:#f7f6f2;
    font:bold 29px/1 Georgia,"Times New Roman",serif; color:#171614; }
  .af-app .af-component { margin:0; padding:8px 12px; border-width:0 0 1px; border-radius:0; border-color:#dedbd5; background:#fffdf9;
    font:18px Georgia,"Times New Roman",serif; color:#171614; }
  .af-app .af-toolbar { height:auto; min-height:56px; padding:8px 16px; gap:9px; border:1px solid #c7c4bd; border-radius:5px;
    background:#f7f6f2; color:#171614; }
  @media (max-height:720px) {
    .af-app .af-palette h3 { height:42px; padding-top:8px; font-size:24px; }
    .af-app .af-component { padding:4px 10px; font-size:16px; }
    .af-app .af-toolbar { min-height:44px; padding:4px 12px; }
    .relay-workflow-head { height:46px; }
    .relay-workflow-head strong { font-size:28px; }
  }
  @media (max-width:1100px) {
    .relay-workflow-head strong { font-size:22px; }
    .relay-workflow-head span { display:none; }
  }`,
    parts: {
      // No app header: the workflow title sits above the canvas, the controls below it.
      top: () => () => {},
      canvas: (base, S) => (ctx) => {
        base(ctx);
        const workspace = S.els.workspace;
        const head = S.P.el('div', 'relay-workflow-head', workspace);
        S.P.el('strong', '', head, 'Order Processing');
        S.P.el('span', '', head, 'Last modified\u3000Apr 22, 2008 10:14 AM');
        workspace.prepend(head);
        workspace.append(S.els.bar);
      },
      // No workspace navigation, inspector, execution history or status footer.
      navigation: () => () => {},
      executions: (base, S) => (ctx) => {
        base(ctx);
        S.els.executions.remove();
      },
      overview: (base, S) => (ctx) => {
        base(ctx);
        S.els.overviewTitle.closest('.af-overview').remove();
      },
      footer: (base, S) => (ctx) => {
        base(ctx);
        S.els.nodeCount.parentElement.remove();
      },
    },
  },
});
