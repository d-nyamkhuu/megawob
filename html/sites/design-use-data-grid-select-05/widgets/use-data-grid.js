// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-select-05',
  name: 'design',
  split: 'train',
  scenarios: ['select'],
  template: 'use-data-grid/grid',
  design: {
    font: '16px/1.35 Arial, "Segoe UI", sans-serif',
    brand: 'Inventory Manager',
    expandedAt: 99999,
    contextAt: 99999,
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    cardInsetX: 0,
    cardInsetY: 0,
    cardTop: 0,
    fixedHeight: 36 + 40 + 48 + 2,
    rowMin: 18,
    rowMax: 48,
    extraCss: `
      .to-workspace { inset:0; border:0; border-radius:0; }
      .to-appbar,.to-nav,.to-head,.to-tabs,.to-stream,.to-facts { display:none; }
      .to-card { border:0; border-radius:0; box-shadow:none; }
      .to-tools { height:36px; background:#e8edf6; padding:0 12px; font-size:15px; border-bottom:1px solid #c2cde0; }
      .to-hrow { height:40px; }
      .to-h { font-size:17px !important; }
      .human-empty-selection,.human-grid-totals { font-size:13px !important; color:#4a5568; }
      .to-hrow { background:linear-gradient(#f2f5fa,#d6deec) !important; }
      .to-row { background:#fff !important; }
      .to-foot { background:#dce4f1 !important; }
      .to-grid { border-color:#aab8d0 !important; }
      .to-tools .to-selinfo { font-size:clamp(12px,1.17vw,18px); font-weight:600; }
      .human-empty-selection { font-size:clamp(12px,1.17vw,18px); font-weight:600; white-space:nowrap; }
      .to-tools > .to-selinfo { display:none; }
      .to-tools > .sp { display:none; }
      .human-grid-totals { margin-left:auto; white-space:nowrap; font-size:clamp(12px,1.17vw,18px); font-weight:400; }
      .to-grid { border:1px solid #c9c3b9; border-radius:4px; margin:0 12px; }
      .to-hrow { height:40px; background:#e4e0d8; }
      .to-h { font-size:20px; color:#171b25; font-weight:600; }
      .to-row { background:#fffdfa; }
      .to-c { font-size:var(--human-row-font,20px); padding:0 14px; }
      .to-cb { width:68px; }
      .to-cb input { width:clamp(15px,2vh,23px);height:clamp(15px,2vh,23px); border-radius:4px; accent-color:#fa8124; }
      .to-foot { height:48px; padding:0 18px; background:#f1eee7; }
      .to-foot .info,.to-pg { font-size:18px; }
      .to-pg { border:1px solid #bdb7ad; background:#fbfaf7; }
      .to-search { margin-left:auto; width:320px; height:40px; }
      .to-search input { font-size:16px; }
      .to-card.compact .to-tools { height:40px; padding:0 12px; }
      .to-card.compact .to-foot { height:36px; padding:0 12px; }
      .to-card.compact .to-foot .info,.to-card.compact .to-pg { font-size:14px; }
      .to-card.compact .to-cb input { width:15px; height:15px; }
      .to-h .ib { display:none !important; }
      .to-h { padding-right:6px; }
      .human-empty-selection,.human-grid-totals { display:none !important; }
      .to-pager { display:flex; align-items:center; gap:3px; }
      .to-pg.qt-nav { min-width:34px; height:30px; padding:0; text-align:center; font-size:14px; background:linear-gradient(#f4f6fa,#d3dbe8); border:1px solid #8c9ab2; color:#223; }
      .to-pg.qt-dis { display:inline-flex; align-items:center; justify-content:center; }
      .qt-page { margin-left:14px; font-size:17px; color:#1b2433; }
      .to-foot .info { font-size:17px; }
      @media (max-width:1100px) {
        .to-h,.to-c { min-width:0; padding-left:5px; padding-right:5px; }
        .to-cb { width:46px; }
        .to-h .lbl,.to-c span { min-width:0; overflow:hidden; text-overflow:ellipsis; }
        .to-h .ib { width:14px; }
      }
    `,
    parts: {
      fit: (base, S) => () => {
        base();
        if (S.cardH < 400) {
          S.FIXED = 40 + 40 + 36 + 2;
          S.rowH = Math.max(14, Math.min(S.D.rowMax, Math.floor((S.cardH - S.FIXED - 4) / S.spec.pageSize)));
        }
      },
      card: (base, S) => () => {
        base();
        S.card.classList.toggle('compact', S.cardH < 400);
        S.card.style.setProperty('--human-row-font', Math.min(20, S.rowH - 4) + 'px');
      },
      drawFoot: (base, S) => (m) => {
        base(m);
        const pages = S.fam.helpers.pageCount(m, S.spec);
        const n = S.fam.helpers.visibleRows(m, S.spec).length;
        const glyph = { prev: '◀', next: '▶' };
        for (const [k, b] of Object.entries(S.pgButtons)) {
          if (glyph[k]) { b.textContent = glyph[k]; b.classList.add('qt-nav'); }
          else if (pages <= 1) b.style.display = 'none';
        }
        const mk = (t, first) => {
          const s = S.util.el('span', 'to-pg qt-nav qt-dis', null, t);
          if (first) S.pagerWrap.prepend(s); else S.pagerWrap.append(s);
        };
        mk('|◀', true); mk('▶|', false);
        if (pages <= 1) S.pagerWrap.querySelectorAll('.dots').forEach((d) => { d.style.display = 'none'; });
        const pg = S.util.el('span', 'qt-page', S.pagerWrap, `Page　${Math.min(m.page, pages - 1) + 1} of ${pages}`);
        void pg;
        S.info.textContent = `${n} orders`;
        S.rpp.style.display = 'none';
      },
      drawTools: (base, S) => (m) => {
        base(m);
        let empty = S.tools.querySelector('.human-empty-selection');
        if (!empty) {
          empty = S.util.el('span', 'human-empty-selection', S.tools);
          S.tools.prepend(empty);
        }
        empty.hidden = m.selected.length > 0;
        empty.textContent = `0 of ${S.spec.rows.length} products selected`;
        S.selInfo.textContent = `${m.selected.length} of ${S.spec.rows.length} products selected`;
        let totals = S.tools.querySelector('.human-grid-totals');
        if (!totals) totals = S.util.el('span', 'human-grid-totals', S.tools);
        const total = S.fam.helpers.visibleRows(m, S.spec).length;
        const size = S.fam.helpers.pageRows(m, S.spec).length;
        const first = total ? m.page * S.spec.pageSize + 1 : 0;
        const last = Math.min(total, first + size - 1);
        totals.textContent = `Total: ${total} products　│　Showing ${first} – ${last} of ${total}`;
      },
    },
  },
});
