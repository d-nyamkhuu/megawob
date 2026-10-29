// Design on templates/read-figure/base.js with a board sized to the free
// stage and the template's recovery controls kept visible.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-spatial-02',
  name: 'design',
  split: 'train',
  scenarios: ['spatial'],
  template: 'read-figure/base',
  design: {
    parts: {
      // Use the stage's actual budget rather than magnifying the rendered board.
      buildSpatial: (base, S) => (ctx, body, up) => S.buildItemsBoard(ctx, body, up, {
        w: ctx.size.width - 20,
        h: ctx.size.height - 20 - (ctx.spec.recoverable ? 44 : 0),
      }, 164),
      CSS: () => `
        .up-panel { position:absolute; display:flex; flex-direction:column;
          width:calc(100% - 8px); height:calc(100% - 8px); box-sizing:border-box;
          background:transparent; border:0; box-shadow:none; }
        .up-head { display:none; }
        .up-body { flex:1; min-height:0; display:flex; align-items:center; justify-content:center; }
        .up-board { display:block; flex:none; }
        .up-item { cursor:pointer; }
        .up-item .hit { fill:transparent; }
        .up-item[data-clicked] .hit { fill:rgba(0,0,0,.08); stroke:#555; stroke-dasharray:4 3; }
        .up-glyph { font-weight:700; text-anchor:middle; dominant-baseline:central; pointer-events:none;
          font-family:"DejaVu Sans",Verdana,system-ui,sans-serif; }
        .up-sym,.up-emoji { text-anchor:middle; dominant-baseline:central; pointer-events:none; font-weight:400; }
        .up-sym { font-family:"DejaVu Sans",sans-serif; font-variant-emoji:text; }
        .up-emoji { font-family:"Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif; font-variant-emoji:emoji; }
        .up-low .up-emoji,.up-emoji.low { opacity:.5; }
        .up-result { flex:none; display:flex; align-items:center; gap:12px; height:44px; padding:0 12px;
          box-sizing:border-box; color:#000; background:#c0c0c0; border:2px inset #eee; font:14px Arial; }
        .up-result.bad { background:#e2b5b5; }
        .up-result-text { display:grid; }
        .up-result-text > span { grid-area:1 / 1; }
        .up-result-size { visibility:hidden; }
        .up-result button { margin-left:auto; height:30px; padding:0 14px; font:inherit;
          background:#c0c0c0; color:#000; border:2px outset #fff; cursor:pointer; }
        .up-result button:disabled { opacity:.45; cursor:default; }
      `,
    },
  },
});
