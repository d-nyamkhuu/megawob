// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-paginate-03',
  name: 'design',
  split: 'train',
  scenarios: ['paginate'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Acme Enterprises',
    font: '20px/1.35 Georgia,"Times New Roman",serif',
    cardInsetX: 0,
    cardInsetY: 0,
    cardTop: 0,
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    expandedAt: 99999,
    contextAt: 99999,
    fixedHeight: 44 + 54 + 40 + 40,
    rowMin: 30,
    rowMax: 52,
    extraCss: `
      .to-workspace { inset:0!important; border:0!important; border-radius:0!important; background:#fff!important; font:16px/1.35 Georgia,"Times New Roman",serif!important; }
      .to-appbar,.to-nav,.to-context,.to-tabs,.to-stream,.to-facts { display:none!important; }
      .to-card { left:0!important; top:0!important; width:100%!important; height:100%!important; border:0!important; border-radius:0!important; box-shadow:none!important; background:#fff!important; overflow:visible!important; font:18px/1.35 Georgia,"Times New Roman",serif!important; }
      .to-head { height:0!important; min-height:0!important; padding:0!important; overflow:visible!important; border:0!important; }
      .to-head .to-object,.to-head .to-chip { display:none!important; }
      .to-head .sp { display:none!important; }
      .to-head > .to-btn { position:absolute; z-index:4; top:0; right:26px; height:46px!important; padding:0 18px!important; font:18px Georgia,"Times New Roman",serif!important; }
      .to-head > .to-btn:not(.pri) { display:none!important; }
      .to-head > .to-btn.pri { right:auto; left:calc(100% - 170px); }
      .to-tools { height:54px!important; margin-top:0!important; padding:0 22px!important; gap:10px!important; background:#fff!important; border:0!important; overflow:visible!important; }
      .to-search { width:355px!important; height:42px!important; margin-right:160px; padding:0 10px!important; border:1px solid #888!important; border-radius:2px!important; }
      .to-search input { font:18px Georgia,"Times New Roman",serif!important; }
      .to-fchip,.to-selinfo { display:none!important; }
      .to-tools .sp { display:none!important; }
      .to-tools > div[style*="display:flex"] { margin-left:auto!important; }
      .to-tools .to-btn { height:42px!important; padding:0 16px!important; font:17px Georgia,"Times New Roman",serif!important; border-radius:2px!important; }
      .to-tools .to-btn[disabled] { opacity:.45!important; }
      .to-search input::placeholder { color:transparent!important; }
      .to-foot > .info:last-of-type { display:flex!important; position:absolute!important; top:5px!important; left:390px!important; z-index:5; align-items:center; gap:8px; color:#211f1e!important; font:17px Georgia,"Times New Roman",serif!important; }
      .to-foot > .info:last-of-type .to-pg { min-width:26px!important; height:30px!important; padding:0 5px!important; border:0!important; background:transparent!important; color:#211f1e!important; font:16px Georgia,"Times New Roman",serif!important; }
      .to-hrow { height:54px!important; background:#f1eee8!important; border:1px solid #bdbab5!important; }
      .to-cb { width:80px!important; }
      .to-cb input { width:25px!important; height:25px!important; }
      .to-h { font: bold 21px/1.2 Georgia,"Times New Roman",serif!important; color:#292623!important; padding:0 12px!important; border-left:1px solid #d0cec9!important; }
      .to-h,.to-c { flex-grow:1!important; }
      .to-h .arrow { color:#333!important; }
      .to-h .ib { width:18px!important; height:18px!important; }
      .to-row { height:52px!important; min-height:52px!important; border-bottom:1px solid #d2d0cc!important; }
      .to-c { padding:0 14px!important; font:20px/1.25 Georgia,"Times New Roman",serif!important; border-left:1px solid #ddd!important; }
      .to-c span { font:inherit!important; }
      .to-c.mono span { font:inherit!important; color:inherit!important; }
      .to-row:nth-child(even) { background:#f7f6f3!important; }
      .to-row:hover { background:inherit!important; }
      .to-foot { display:contents!important; }
      .to-foot .info { display:none!important; }
      .to-pager { position:absolute!important; bottom:24px!important; left:50%!important; transform:translateX(-50%); gap:0!important; }
      .to-pg { min-width:46px!important; height:48px!important; border:1px solid #d0ceca!important; border-radius:0!important; background:#fff!important; color:#a51f1d!important; font:18px Georgia,"Times New Roman",serif!important; }
      .to-pg.cur { background:#b51f1d!important; border-color:#a51f1d!important; color:#fff!important; }
      .to-pg[disabled] { background:#f0efed!important; color:#aaa!important; opacity:1!important; }
      .to-empty { font:18px Georgia,"Times New Roman",serif!important; }
      .to-pop,.to-dialog,.to-toast { font-family:Georgia,"Times New Roman",serif!important; }
      @media(max-width:1100px) {
        .to-head > .to-btn.pri { top:0; left:auto; right:18px; }
        .to-foot > .info:last-of-type { left: min(390px, 38vw)!important; }
        .to-search { width: min(33vw,355px)!important; }
        .to-tools .to-btn { padding:0 7px!important; font-size:14px!important; }
        .to-c { font-size:15px!important; padding:0 7px!important; }
        .to-h { font-size:16px!important; }
        .to-cb { width:40px!important; }
        .to-pager { bottom:8px!important; }
      }
      @media(max-height:720px) {
        .to-hrow { height:42px!important; }
        .to-row { height:30px!important; min-height:30px!important; }
        .to-c { font-size:16px!important; }
        .to-h { font-size:17px!important; }
        .to-pg { height:38px!important; min-width:38px!important; }
        .to-pager { bottom:5px!important; }
      }
      @media(max-height:660px) {
        .to-tools { height:44px!important; }
        .to-hrow { height:38px!important; }
        .to-row { height:25px!important; min-height:25px!important; }
        .to-c { font-size:14px!important; }
        .to-h { font-size:15px!important; }
        .to-pg { height:32px!important; min-width:32px!important; }
      }
    `,
  },
});
