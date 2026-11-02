// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-crm-03',
  name: 'design',
  split: 'train',
  scenarios: ['crm'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Acme Support',
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    contextAt: 100000,
    cardInsetX: 0,
    cardTop: 0,
    cardInsetY: 0,
    fixedHeight: 200,
    rowMin: 12,
    rowMax: 61,
    extraCss: `
      .to-workspace { inset:0; border:0; border-radius:0; background:transparent; }
      .to-card { border:1px solid #d9e0e9; border-radius:10px; background:#fff; font-size:15px; box-shadow:0 1px 2px #17233a0a; }
      .to-head { height:54px; padding:0 18px; border:0; }
      .to-head h2 { font-size:30px; color:#18243b; }
      .to-tools { height:38px; padding:0 12px; border:0; background:#fff; }
      .to-tools .to-search { margin-left:auto; }
      .to-h { font-size:13px; }
      .to-c { font-size:14px; }
      .to-c.mono span { font:inherit; }
      .to-foot { height:64px; padding:0 18px; }
      .to-foot .info { font-size:14px; }
      .to-pg { min-width:36px; height:38px; font-size:14px; border:1px solid #d9e0e9; }
      .crm-grid-decoration { display:none; }
      .crm-grid-search { margin-left:auto; display:flex; align-items:center; gap:10px; color:#71809a; font-size:14px; }
      .crm-grid-search-label, .crm-grid-filter-label { border:1px solid #d9e0e9; border-radius:9px; padding:8px 12px; white-space:nowrap; }
      .crm-grid-filter-label { color:#18243b; }
      @media (max-width:1150px) {
        .to-c { font-size:12px; }
        .to-head h2 { font-size:26px; }
        .crm-grid-search { gap:6px; font-size:12px; }
        .crm-grid-search-label, .crm-grid-filter-label { padding:6px 8px; }
      }
    `,
    parts: {
      // The outer site already supplies the application shell. Preserve the
      // template builders and their RNG draws, and omit only duplicate decoration.
      appbar: (base, S) => () => {
        base();
        S.appbar.classList.add('crm-grid-decoration');
      },
      navigation: (base, S) => () => {
        base();
        S.nav.classList.add('crm-grid-decoration');
      },
      heading: (base, S) => () => {
        base();
        S.title.textContent = 'Tickets';
        S.count.classList.add('crm-grid-decoration');
        S.nb.classList.add('crm-grid-decoration');
        for (const node of S.head.querySelectorAll('.to-icon, [data-role="xtra"], .sp')) node.classList.add('crm-grid-decoration');
        if (!S.fam.helpers.searchable(S.spec)) {
          const search = S.P.el('div', 'crm-grid-search', S.head);
          S.P.el('span', 'crm-grid-search-label', search, '⌕  Search tickets…');
          S.P.el('span', 'crm-grid-filter-label', search, '▽  Filters  ⌄');
        }
      },
      tabs: (base, S) => () => {
        base();
        S.tabs.classList.add('crm-grid-decoration');
      },
      toolbar: (base, S) => () => {
        base();
        const label = S.tools.querySelector(':scope > .to-selinfo');
        if (label) label.classList.add('crm-grid-decoration');
      },
      stream: (base, S) => () => {
        base();
        S.stream.classList.add('crm-grid-decoration');
      },
      footer: (base, S) => () => {
        base();
        S.facts.classList.add('crm-grid-decoration');
        if (S.spec.scenario !== 'paginate') S.rpp.classList.add('crm-grid-decoration');
      },
    },
  },
});
