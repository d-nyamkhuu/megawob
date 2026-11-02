// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-cellEdit-01',
  name: 'design',
  split: 'train',
  scenarios: ['cellEdit'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Inventory', navWidth: 0, railWidth: 0, contextWidth: 0,
    cardInsetX: 2, cardInsetY: 2, cardTop: 0, fixedHeight: 236,
    extraCss: `
      .to-workspace { inset:0; border-color:#d8dfea; border-radius:0 7px 7px 0; }
      .to-appbar, .to-nav, .to-context, .to-tabs, .to-stream, .to-facts { display:none; }
      .to-card { border:0; border-radius:0 7px 7px 0; box-shadow:none; }
      .to-head { height:88px; align-items:flex-start; padding:16px 18px 0; }
      .to-object .to-icon, .to-head .to-chip { display:none; }
      .to-head h2 { font-size:24px; letter-spacing:-.5px; }
      .to-tools { height:50px; padding:8px 16px; }
      .to-hrow { background:#fff; }
      .to-h { color:#10162c; font-size:12px; }
      .to-card.dense .to-h .ib { top:20px; bottom:auto; background:#f8fafc; border:1px solid #edf0f4; }
      .to-c { color:#44516e; font-size:13px; }
      .to-foot { height:56px; }
    `,
  },
});
