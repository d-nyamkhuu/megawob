// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-colfilter-01',
  name: 'design',
  split: 'train',
  scenarios: ['colfilter'],
  template: 'use-data-grid/grid',
  design: {
    navWidth: 266,
    contextWidth: 320,
    cardInsetX: 96,
    cardInsetY: 100,
    cardTop: 32,
    contextAt: 1200,
    contextHeight: 580,
    font: '17px/1.25 "Arial Narrow", "Liberation Sans Narrow", Arial, sans-serif',
    rowMin: 18,
    rowMax: 48,
    // Match the heading, search row, toolbar, grid header and footer below.
    fixedHeight: 38 + 53 + 62 + 40 + 48 + 2,
    parts: {
      heading: (base, S) => () => {
        base();
        if (S.title) S.title.textContent = 'Support Tickets';
      },
      tabs: (base, S) => () => {
        base();
        const el = S.ctx.util.el;
        const row = el('div', 'irix-search-row', S.card);
        el('span', 'irix-search-icon', row, '⌕');
        const field = el('div', 'irix-search-field', row);
        el('span', '', field, 'Search tickets...');
      },
      contextPanel: (base, S) => () => {
        base();
        const panel = S.shell.querySelector('.to-context');
        if (!panel) return;
        panel.replaceChildren();
        panel.classList.add('irix-inspector');
        const el = S.ctx.util.el;
        el('h4', 'irix-inspector-title', panel, 'Ticket Details');
        for (const label of ['ID', 'Title', 'Customer', 'Priority', 'Status', 'Assigned To', 'Created', 'Updated']) {
          const row = el('div', 'irix-detail-row', panel);
          el('span', '', row, label);
          el('span', 'value', row, '—');
        }
        el('h4', 'irix-inspector-subtitle', panel, 'Description');
        el('div', 'irix-inspector-box', panel, '—');
        el('h4', 'irix-inspector-subtitle', panel, 'Activity');
        el('div', 'irix-inspector-box activity', panel, '—');
      },
    },
    extraCss: `
      .to-workspace { background:transparent!important; border:0!important; box-shadow:none!important; }
      .to-appbar,.to-nav,.to-tabs,.to-stream { display:none!important; }
      .irix-search-row { flex:none; height:40px; margin:5px 18px 8px; display:flex; align-items:center; gap:10px; padding:0 12px; border:1px solid #7b8495; background:linear-gradient(#f5f6f8,#e7e9ee); color:#5b6576; font-size:17px; }
      .irix-search-icon { font:28px/1 Arial,sans-serif; color:#202a3b; }
      .irix-search-field { flex:1; padding:3px 6px; }
      .to-card { border-radius:2px!important; box-shadow:2px 2px #505968!important; }
      .to-head { height:38px!important; min-height:38px; background:linear-gradient(#c6c5df,#9b9bbe)!important; }
      .to-head h2 { font-size:20px!important; }
      .to-tools { height:62px!important; flex-wrap:nowrap; align-content:center; padding:4px 12px!important; gap:9px!important; }
      .to-search { width:100%!important; height:32px!important; flex:0 0 100%; }
      .to-tools > .sp { display:none!important; }
      .to-tools > div:nth-last-child(2) { display:flex!important; margin-left:0!important; }
      .to-tools [data-key="status"] { order:1; }
      .to-tools [data-key="archive"] { order:2; }
      .to-tools [data-key="delete"] { order:3; }
      .to-tools .to-selinfo { order:4; }
      .to-tools .to-btn { height:32px!important; padding:0 10px!important; }
      .to-hrow { height:40px!important; }
      .to-foot { height:48px!important; min-height:48px; }
      .to-facts { display:none!important; }
      .to-context.irix-inspector { border:1px solid #626b7b; background:linear-gradient(#dfe2e9,#cbd0da)!important; }
      .irix-inspector-title { height:38px; padding:7px 18px!important; margin:0!important; font-size:20px!important; line-height:23px; color:#171827!important; text-transform:none!important; letter-spacing:0!important; background:linear-gradient(#c6c5df,#9b9bbe); border-bottom:1px solid #626078; }
      .irix-detail-row { display:flex; align-items:center; justify-content:space-between; height:35px; padding:0 20px; font-size:17px; }
      .irix-detail-row .value { width:48%; color:#50596a; }
      .irix-inspector-subtitle { margin:12px 20px 4px!important; padding-top:12px; border-top:1px solid #858d9d; font-size:17px!important; color:#171827!important; text-transform:none!important; letter-spacing:0!important; }
      .irix-inspector-box { height:160px; margin:0 20px; padding:12px; border:1px solid #788294; background:linear-gradient(#e6e8ed,#d4d8e1); font-size:17px; }
      .irix-inspector-box.activity { height:150px; }
      .to-h { font-size:16px!important; font-weight:500!important; }
      .to-c { font-size:16px!important; }
      .to-pill { font-size:16px!important; border-radius:2px!important; }
      .to-btn,.to-pg { border-radius:2px!important; }
    `,
  },
});
