// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-virtual-02',
  name: 'design',
  split: 'train',
  scenarios: ['virtual'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Acme Support',
    cardInsetX: 0,
    cardInsetY: 12,
    cardTop: 0,
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    // Match the virtual geometry to the visible toolbar, header and footer.
    fixedHeight: 68 + 114 + 66 + 2,
    rowMin: 24,
    rowMax: 39,
    contextAt: Infinity,
    extraCss: `
      .to-workspace .to-tools { height:68px; padding:0 18px; gap:10px; }
      .to-card .to-tools .to-btn { height:44px; padding:0 15px; font-size:14px; }
      .to-card .to-search { order:99; margin-left:auto; width:258px; max-width:35%; height:44px; border-radius:5px; }
      .to-card .to-hrow { height:114px; }
      .to-card.dense .to-h, .to-card .to-h { display:grid; grid-template-columns:minmax(0,1fr) 16px; grid-template-rows:22px 28px 32px; align-content:start; gap:2px 4px; padding:8px 10px; }
      .to-card.dense .to-h .lbl, .to-card .to-h .lbl { grid-column:1; grid-row:1; line-height:22px; }
      .to-card.dense .to-h .arrow, .to-card .to-h .arrow { position:static; grid-column:2; grid-row:1; }
      .to-card.dense .to-h .gap, .to-card .to-h .gap { display:none; }
      .to-card.dense .to-h .dots, .to-card .to-h .dots { position:static; grid-column:1; grid-row:2; width:30px; height:26px; }
      .to-card.dense .to-h .ref-column-filter, .to-card .to-h .ref-column-filter { position:static; grid-column:1 / -1; grid-row:3; width:100%; height:30px; justify-content:flex-start; }
      .ref-column-filter::after { content:'All'; padding-left:7px; font-size:13px; color:#8292ad; }
      .ref-column-filter-placeholder { grid-column:1 / -1; grid-row:3; height:30px; padding:6px 8px; border:1px solid #d7e1ee; border-radius:4px; background:#fff; color:#8292ad; font-size:13px; font-weight:400; }
      .to-card .to-foot { height:66px; padding:0 16px; }
      .to-card .to-pill { padding:4px 13px; }
      .to-workspace.ref-grid-compact .to-tools { height:44px; padding:0 12px; }
      .to-workspace.ref-grid-compact .to-tools .to-btn, .to-workspace.ref-grid-compact .to-search { height:32px; }
      .to-workspace.ref-grid-compact .to-hrow { height:74px; }
      .to-workspace.ref-grid-compact .to-h { grid-template-rows:18px 20px 22px; padding:5px 10px; }
      .to-workspace.ref-grid-compact .to-h .lbl { line-height:18px; }
      .to-workspace.ref-grid-compact .to-h .dots { height:20px; }
      .to-workspace.ref-grid-compact .to-h .ref-column-filter { height:22px; }
      .ref-grid-compact .ref-column-filter-placeholder { height:22px; padding:2px 8px; }
      .to-workspace.ref-grid-compact .to-foot { height:42px; }
    `,
    parts: {
      fit: (base, S) => () => {
        base();
        const compact = S.H < 410;
        S.shell.classList.toggle('ref-grid-compact', compact);
        S.headerHeight = compact ? 74 : 114;
        S.FIXED = compact ? 44 + 74 + 42 + 2 : S.D.fixedHeight;
        S.rowH = Math.max(S.D.rowMin, Math.min(S.D.rowMax, Math.floor((S.cardH - S.FIXED - 4) / S.spec.pageSize)));
      },
      appbar: (base, S) => () => {
        base();
        Object.assign(S.shell.style, { inset: '0', border: '0', borderRadius: '0' });
        S.appbar.style.display = 'none';
      },
      heading: (base, S) => () => {
        base();
        S.head.style.display = 'none';
        S.scale = Math.min(S.scale, (S.cardW - 46) / S.nominal);
      },
      tabs: (base, S) => () => { base(); S.tabs.style.display = 'none'; },
      stream: (base, S) => () => { base(); S.stream.style.display = 'none'; },
      footer: (base, S) => () => { base(); S.facts.style.display = 'none'; },
      column: (base, S) => (c) => {
        base(c);
        const { funnel } = S.parts[c.id];
        if (funnel) funnel.classList.add('ref-column-filter');
        else S.P.el('span', 'ref-column-filter-placeholder', S.hcells[c.id], 'Filter…');
      },
      drawRows: (base, S) => (m) => {
        base(m);
        S.grid.style.height = `${S.headerHeight + S.paneHeight + 2}px`;
      },
      drawTools: (base, S) => (m) => {
        base(m);
        S.selBar.style.display = 'flex';
      },
      toolbar: (base, S) => () => {
        base();
        if (S.input) return;
        const { util, tools, fam, spec, ctx } = S;
        const bar = util.el('label', 'to-search ref-grid-search', tools);
        util.el('span', 'ref-grid-search-icon', bar, '⌕');
        const field = util.el('input', '', bar);
        field.type = 'text';
        field.placeholder = 'Search tickets…';
        field.value = ctx.model.query || '';
        field.addEventListener('input', () => S.P.act(fam.helpers.setQuery(ctx.model, field.value), false));
        S.input = field;
      },
    },
  },
});
