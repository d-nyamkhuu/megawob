// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-resize-03',
  name: 'design',
  split: 'train',
  scenarios: ['resize'],
  template: 'use-data-grid/grid',
  design: {
    font: '16px/1.25 Arial, "MS Sans Serif", sans-serif',
    brand: 'Inventory Manager',
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    contextAt: 99999,
    contextHeight: 99999,
    cardInsetX: 8,
    cardInsetY: 8,
    cardTop: 0,
    rowMin: 32,
    rowMax: 36,
    parts: {
      heading: (base, S) => () => {
        // Freeze one model-to-pixel scale for the episode. Leave room for a
        // column to grow without pushing its resize handle out of the card.
        const widths = S.spec.cols.map(c => Math.max(c.w, S.ctx.model.widths[c.id]));
        const span = widths.reduce((sum, width) => sum + width, 0);
        S.scale = Math.min(1, (S.cardW - 56) / (span + Math.max(...widths)));
        base();
      },
    },
    extraCss: `
      .to-nav,.to-context,.to-stream { display:none!important; }
      .to-shell { left:0!important; right:0!important; top:0!important; bottom:0!important; width:auto!important; height:auto!important; background:#c0c0c0!important; }
      .to-workspace { inset:0; border:0; border-radius:0; background:#c0c0c0; }
      .to-card { border:2px outset #eee!important; border-radius:0!important; box-shadow:none!important; background:#c0c0c0!important; font-size:16px!important; }
      .to-head { height:40px!important; padding:0 10px!important; border-bottom:1px solid #777!important; }
      .to-head h2 { font-size:20px!important; }
      .to-chip { font-size:14px!important; border-radius:0!important; }
      .to-tabs { display:none!important; }
      .to-tools { height:48px!important; padding:0 12px!important; gap:7px!important; background:#c0c0c0!important; }
      .to-grid { flex:1 1 auto!important; min-height:0!important; }
      .to-hrow { height:42px!important; }
      .to-h { position:relative!important; padding:7px 30px 6px 10px!important; font-size:16px!important; font-weight:bold!important; background:#c0c0c0!important; }
      .to-h .dots,.to-h .ib { opacity:1!important; display:flex!important; position:absolute!important; right:3px!important; top:4px!important; width:22px!important; height:28px!important; border:2px outset #eee!important; background:#c0c0c0!important; }
      .to-h .edge { width:5px!important; }
      .to-row { height:36px!important; min-height:36px!important; background:#fff!important; }
      .to-c { padding:5px 10px!important; font-size:16px!important; border-right:1px solid #d0d0d0!important; border-bottom:1px solid #d0d0d0!important; }
      .to-cb { min-width:50px!important; }
      .to-foot { height:48px!important; background:#c0c0c0!important; }
      .to-btn,.to-tools button,.to-foot button { border:2px outset #eee!important; border-radius:0!important; background:#c0c0c0!important; color:#111!important; font:16px Arial,sans-serif!important; box-shadow:none!important; }
      .to-search input,.to-tools input { border:2px inset #ddd!important; border-radius:0!important; background:#fff!important; color:#111!important; font:16px Arial,sans-serif!important; }
      .to-h .dots::after { content:'▼'; font:12px Arial,sans-serif; }
    `,
  },
});
