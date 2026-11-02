// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-colfilter-04',
  name: 'design',
  split: 'train',
  scenarios: ['colfilter'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'HelpDesk Pro',
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    contextAt: 9999,
    cardInsetX: 18,
    cardInsetY: 18,
    cardTop: 0,
    font: '14px/1.35 "Segoe UI",Arial,sans-serif',
    rowMin: 18,
    rowMax: 32,
    parts: {
      fit: (base, S) => () => {
        base();
        // Match the existing header, toolbar and footer heights without
        // changing the template's card bounds or popover coordinates.
        S.FIXED = 44 + 54 + 40 + 70 + 2;
        S.rowH = Math.max(18, Math.min(32, Math.floor((S.cardH - S.FIXED - 4) / S.spec.pageSize)));
      },
    },
    extraCss: `
      .to-workspace { border-color:transparent; border-radius:0; background:transparent; }
      .to-workspace .to-card { border:1px solid #d3deea; border-radius:14px; box-shadow:0 10px 28px rgba(31,54,83,.17),4px 4px 10px rgba(190,203,219,.55); }
      .to-appbar,.to-nav,.to-context,.to-tabs,.to-stream,.to-facts { display:none!important; }
      .to-card { border:1px solid #d3deea; border-radius:14px; box-shadow:0 10px 28px rgba(31,54,83,.17),4px 4px 10px rgba(190,203,219,.55); }
      .to-head { height:44px!important; padding:0 20px!important; background:linear-gradient(#fff,#f7f9fc); }
      .to-head h2 { font-size:18px!important; }
      .to-head .to-object .to-icon,.to-head .to-chip,.to-head .to-btn { display:none!important; }
      .to-tools { height:54px!important; padding:0 20px!important; border-bottom:0!important; background:#fff!important; }
      .to-tools .to-search { order:4; width:320px!important; margin-left:auto; height:34px!important; }
      .to-tools > .sp { display:none!important; }
      .to-tools .to-selinfo { font-size:14px!important; font-weight:500!important; }
      .to-grid { margin:0 18px; border:1px solid #dce4ed; }
      .to-hrow { height:34px!important; background:#f3f6fa!important; border-bottom:1px solid #d9e2ed!important; }
      .to-h { color:#172742!important; font-size:13px!important; padding-left:12px!important; }
      .to-h .ib { color:#687991!important; }
      .to-card.dense .to-h { display:flex!important; padding:0 7px!important; }
      .to-card.dense .to-h .lbl { display:inline!important; line-height:normal!important; }
      .to-card.dense .to-h .ib { position:static!important; width:18px!important; height:18px!important; }
      .to-row { background:#fff!important; }
      .to-c { font-size:14px!important; padding:0 10px!important; }
      .to-pill { border-radius:5px!important; padding:3px 8px!important; }
      .to-foot { height:70px!important; padding:0 18px!important; border-top:1px solid #e0e7ef!important; }
      .to-foot { position:relative!important; }
      .to-foot .info { font-size:13px!important; }
      .to-foot > .info:first-child { position:absolute!important; right:280px!important; }
      .to-foot .to-pager { position:absolute!important; right:150px!important; margin:0!important; }
      .to-foot > .info:nth-of-type(2) { position:absolute!important; right:14px!important; }
      .to-card { position:absolute!important; }
      .to-tools { position:static!important; }
      .to-tools > div[style*="align-items: center"] { position:absolute!important; left:18px!important; bottom:17px!important; z-index:8!important; display:flex!important; gap:8px!important; }
      .to-tools > div[style*="align-items: center"] > .to-btn { display:inline-flex!important; }
      .to-foot .to-btn { box-shadow:2px 2px 5px #dce4ee,-2px -2px 5px #fff!important; }
      @media(max-width:1100px) { .to-tools .to-search { width:220px!important; } }
    `,
  },
});
