// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-sort-04',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Northwind Inventory',
    expandedAt: 9999,
    contextAt: 99999,
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    cardInsetX: 0,
    cardInsetY: 0,
    cardTop: 0,
    fixedHeight: 60 + 64 + 40 + 58 + 22 + 2,
    rowMin: 20,
    rowMax: 40,
    decoys: ['Edit', 'Delete', 'Duplicate', 'Export', 'More Actions'],
    font: '14px/1.35 "Segoe UI",Arial,sans-serif',
    extraCss: `
      .to-workspace { inset:0; border:0; border-radius:0; background:#fff; }
      .to-appbar,.to-nav,.to-context,.to-tabs,.to-stream,.to-facts { display:none !important; }
      .to-card { left:0 !important; top:0 !important; width:100% !important; height:100% !important; border:0; border-radius:0; box-shadow:none; }
      .to-head { height:60px; padding:0 10px; border-bottom:0; }
      .to-head h2 { font-size:23px; }
      .to-head .to-object .to-icon { display:none; }
      .to-head .to-object { gap:0; }
      .to-head .to-btn { position:absolute; top:66px; z-index:2; height:38px; }
      .to-head .to-btn:nth-of-type(1) { left:10px; }
      .to-head .to-btn:nth-of-type(2) { left:118px; }
      .to-head .to-btn:nth-of-type(3) { left:228px; }
      .to-head .to-btn { text-transform:capitalize; }
      .to-head .to-btn .to-icon { color:#ed640d; }
      .to-chip { display:none; }
      .to-tools { height:64px; padding:0 18px; background:#f7f7f6; border-top:1px solid #d5d7da; border-bottom:1px solid #cfd2d5; }
      .to-tools > .to-selinfo { display:none !important; }
      .to-search { order:20; margin-left:auto; width:235px; height:38px; border-radius:3px; }
      .to-btn { height:38px; border-radius:3px; font-size:14px; }
      .to-grid { display:flex; flex:1 1 auto; flex-direction:column; min-height:0; }
      .to-hrow { height:48px; flex:none; background:linear-gradient(#f4f4f3,#e7e7e6); }
      .to-hrow { width:100%; }
      .to-h { color:#31363d; font-size:14px; font-weight:600; border-right:1px solid #d6dade; }
      .to-body { flex:1 1 auto; min-height:0; overflow:auto; }
      .to-row { min-height:0; width:100%; }
      .to-c { font-size:14px; border-right:1px solid #e0e2e5; }
      .to-c .to-avatar { display:none; }
      .to-h .ib:not(.dots) { opacity:0; }
      .to-row .to-c:not(.to-cb) { flex:1 1 0 !important; }
      .to-row .to-c:last-child { flex:1 1 auto !important; width:auto !important; }
      .to-hrow .to-h { flex-grow:1; }
      .to-cb { width:60px; }
      .to-hrow .to-cb { width:60px; }
      .to-card.dense .to-h { display:flex; padding:0 8px; }
      .to-card.dense .to-h .lbl { display:block; line-height:normal; }
      .to-card.dense .to-h .gap { display:block; }
      .to-card.dense .to-h .ib { position:static; width:18px; height:18px; }
      .to-card.dense .to-h .arrow { position:static; }
      .to-foot { height:58px; border-top:1px solid #d5d7da; padding:0 18px; }
      .to-pg { height:34px; border-radius:3px; }
      .to-pg.cur { background:#ed640d; color:#fff; border-color:#ed640d; }
      .to-foot .info { font-size:14px; color:#42474d; }
      .to-card.upper .to-h { text-transform:none; letter-spacing:0; font-size:14px; }
      .to-h .dots { opacity:1; background:transparent; }
    `,
  },
});
