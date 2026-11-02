// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-crm-02',
  name: 'design',
  split: 'train',
  scenarios: ['crm'],
  template: 'use-data-grid/grid',
  design: {
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    cardInsetX: 0,
    cardInsetY: 0,
    cardTop: 0,
    fixedHeight: 288,
    rowMin: 24,
    rowMax: 56,
    parts: {
      drawRows: (base, S) => function (m) {
        base(m);
        // The editorial header is 68px rather than the template's 40px.
        S.grid.style.height = (68 + S.paneHeight + 2) + 'px';
      },
    },
    extraCss: `
      .to-workspace { inset:0; border:0; border-radius:0; font:16px/1.4 Arial,sans-serif; }
      .to-appbar,.to-nav,.to-context,.to-tabs,.to-stream,.to-facts { display:none; }
      .to-card { border:0; border-radius:0; box-shadow:none; font-size:16px; }
      .to-head { height:98px; padding:19px 26px 9px; border:0; align-items:flex-start; gap:12px; }
      .to-head h2 { font-size:0; line-height:1.1; font-weight:750; letter-spacing:-1.6px; }
      .to-head h2:after { content:'Tickets'; font-size:40px; }
      .to-head .to-object { display:block; }
      .to-head .to-object .to-icon { display:none; }
      .to-chip { position:absolute; left:26px; top:66px; padding:0; border:0; background:none; font-size:0; font-weight:400; color:#788392; }
      .to-chip:after { content:'8 tickets'; font-size:18px; }
      .to-head>.to-btn,.to-head>.sp { display:none; }
      .to-tools { height:66px; padding:0 26px 17px; gap:8px; border:0; background:#fff; }
      .to-tools .to-selinfo { display:none; }
      .to-tools .sp { display:block; }
      .to-tools .to-btn { visibility:visible; }
      .to-tools .to-btn { height:48px; padding:0 16px; border-radius:4px; font-size:16px; border-color:#cbd3dc; }
      .to-grid { margin:0 20px; border:1px solid #d8dee5; border-radius:4px; }
      .to-tabs,.to-card .scope { display:none; }
      .to-hrow { height:68px; background:#f1f3f5; }
      .to-h { align-items:flex-start; flex-direction:column; justify-content:center; gap:3px; padding:5px 12px; color:#111; font-size:16px; font-weight:700; border-left:1px solid #d9dfe5; }
      .to-h .lbl { flex:none; }
      .to-h .gap { display:none; }
      .to-h .ib { width:30px; height:27px; border:1px solid #cbd3dc; border-radius:4px; background:#fff; opacity:1; }
      .to-h .ib svg { width:15px; height:15px; }
      .to-edge { right:-5px; }
      .to-row { background:#fff; }
      .to-c { padding:0 12px; font-size:18px; color:#252d36; }
      .to-c.mono span { font:16px Arial,sans-serif; color:#252d36; }
      .to-c .to-pill { min-width:74px; padding:4px 10px; border-radius:4px; text-align:center; font-size:16px; font-weight:400; color:#111; }
      .to-cb input { width:23px; height:23px; }
      .to-foot { height:54px; margin: auto 20px 0; padding:0; border-top:1px solid #d5dbe2; }
      .to-foot .info,.to-foot .to-pager { font-size:16px; }
      .to-pg { min-width:44px; height:44px; border:1px solid #e0e4e9; border-radius:4px; font-size:16px; }
      .to-pg.cur { border-color:#edb9b9; background:#fbe5e5; color:#c22; }
      .to-card .to-fill { display:none; }
    `,
  },
});
