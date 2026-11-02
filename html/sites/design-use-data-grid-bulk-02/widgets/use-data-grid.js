// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-bulk-02',
  name: 'design',
  split: 'train',
  scenarios: ['bulk'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Inventory Manager',
    navWidth: 0,
    railWidth: 0,
    contextWidth: 350,
    contextAt: 900,
    contextHeight: 500,
    cardInsetX: 30,
    cardInsetY: 76,
    cardTop: 66,
    font: '14px/1.3 "Courier New",monospace',
    extraCss: `
      .to-workspace{inset:0;background:#d1d1d1;font:14px/1.3 "Courier New",monospace}
      .to-appbar{display:none!important}
      .to-nav{position:absolute;left:0;right:0;top:0;bottom:auto;width:auto!important;height:58px;padding:4px 22px;display:flex;align-items:stretch;gap:12px;overflow:hidden;border:0;border-bottom:3px solid #888;background:#d8d8d8}
      .to-nav small,.to-nav .to-project{display:none!important}
      .to-nav button{width:auto;min-width:112px;height:50px;padding:0 10px;justify-content:flex-start;gap:9px;border:1px solid transparent;border-radius:0;color:#222;font:14px "Courier New",monospace}
      .to-nav button.active{border:1px solid #777;background:#b9d4ec;color:#111;box-shadow:inset 1px 1px #fff}
      .to-nav .nav-label{display:block!important}.to-nav .nav-count{display:none}
      .to-nav .to-icon{width:29px;height:29px;color:#222}
      .to-context{position:absolute;top:66px;right:10px;bottom:10px;width:350px!important;padding:0;border:1px solid #888;background:#eee;font:14px/1.35 "Courier New",monospace}
      .to-context h4{margin:0;padding:7px 9px;color:#111;background:linear-gradient(#e2e2e2,#c5c5c5);border-bottom:1px solid #888;font:bold 14px "Courier New",monospace;text-transform:none;letter-spacing:0}
      .to-context h4:first-child{font-size:0}.to-context h4:first-child:before{content:"Product Summary";font:bold 14px "Courier New",monospace}
      .to-context h4:nth-of-type(2){display:none!important}
      .to-context strong,.to-context p,.to-context .to-feed{display:none!important}
      .to-context:after{content:"Total products                 8\\A Active                         8\\A Archived                       0\\A\\A By Category (active)\\A\\A Apparel                        2\\A Home                           3\\A Office                         2\\A Outdoor                        1";white-space:pre;display:block;padding:12px;color:#111;font:14px/1.9 "Courier New",monospace}
      .to-card{border:1px solid #888;background:#eee;font-size:14px}
      .to-head,.to-tabs,.to-stream,.to-facts{display:none!important}
      .to-tools{height:76px;padding:8px;display:flex;flex-wrap:wrap;align-content:center;gap:6px;border-bottom:1px solid #888;background:#d1d1d1}
      .to-search{width:34%;height:34px;border:1px solid #888;border-radius:0;background:#fff}
      .to-search input{font:14px "Courier New",monospace}
      .to-tools .to-selinfo{font:14px "Courier New",monospace}
      .to-tools>.to-selinfo{display:none!important}
      .to-tools>div:has(>.to-btn){display:flex!important;align-items:center;gap:6px;margin-left:auto}
      .to-tools>div:has(>.to-btn)>.to-selinfo{display:inline!important;margin-right:8px}
      .to-tools>div:has(>.to-btn)>.to-link{display:none!important}
      .to-tools>.sp{display:block!important;flex:1;min-width:4px}
      .to-tools .to-btn{height:36px;padding:0 11px;border:1px solid #888;border-radius:0;background:#d7d7d7;box-shadow:inset 1px 1px #fff,inset -1px -1px #999;font:14px "Courier New",monospace;color:#111}
      .to-tools .to-btn.danger{color:#111}
      .to-grid{overflow:auto}
      .to-hrow{background:#c6c6c6}
      .to-h,.to-card.upper .to-h{padding:0 8px;font:14px "Courier New",monospace;color:#111;text-transform:none;letter-spacing:0}
      .to-cb{width:48px}.to-cb input{width:20px;height:20px}
      .to-row{background:#fff}
      .to-c{padding:0 10px;border-right:1px solid #ccc;font:14px "Courier New",monospace}
      .to-c.mono span{font:14px "Courier New",monospace;color:#111}
      .to-card.lines .to-c,.to-card.lines .to-h{border-left:1px solid #aaa}
      .to-foot{height:58px;padding:0 10px;background:#d1d1d1;border-top:1px solid #888}
      .to-foot .info{font:13px "Courier New",monospace;color:#222}
      .to-pg{border:1px solid #999;border-radius:0;background:#ddd;font:13px "Courier New",monospace}
      .to-pg.cur{color:#111;border-color:#777}
      .to-pop,.to-dialog{border-radius:0;font-family:"Courier New",monospace}
    `,
  },
});
