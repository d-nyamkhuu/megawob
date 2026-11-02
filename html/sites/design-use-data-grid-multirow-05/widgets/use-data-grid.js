// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-multirow-05',
  name: 'design',
  split: 'train',
  scenarios: ['multirow'],
  template: 'use-data-grid/grid',
  design: {
    parts: {
      decorate: () => function () {},
      px: (base, S) => function (width) {
        return Math.round(width * (S.cardW - (S.rowpick ? 0 : 30)) / S.nominal);
      },
      heading: (base, S) => function () {
        const cardW = S.cardW;
        S.cardW = S.originalCardW;
        try { return base(); }
        finally { S.cardW = cardW; }
      },
      drawRows: (base, S) => function (m) {
        base(m);
        S.grid.style.height = (52 * S.ipadScale + S.paneHeight + 2) + 'px';
      },
      rendered: (base, S) => function (ctx) {
        base(ctx);
        if (!S.card) return;
        const el = S.ctx.util.el;
        S.card.style.setProperty('--ipad-scale', String(S.ipadScale));
        S.card.classList.remove('upper', 'zebra', 'showdots', 'dense');
        S.card.classList.add('lines');
        const top = el('section', 'ipad-grid-header', S.card);
        S.card.insertBefore(top, S.card.firstChild);
        const titleRow = el('div', 'ipad-grid-title-row', top);
        el('strong', 'ipad-grid-title', titleRow, 'Orders');
        const newAction = [...(S.head?.querySelectorAll('button') || [])].find(b => /^New\s/i.test(b.textContent || ''));
        if (newAction) titleRow.appendChild(newAction);
        const filterRow = el('div', 'ipad-filter-row', top);
        const search = el('div', 'ipad-grid-search', filterRow);
        search.innerHTML = S.D.icons.search;
        if (S.input) {
          search.appendChild(S.input);
          S.input.placeholder = 'Search orders, customers, or products…';
        } else el('span', '', search, 'Search orders, customers, or products…');
        for (const [label,value] of [['Status','All Statuses'],['Date Range','Last 30 Days'],['Customer','All Customers']]) {
          const box = el('div', 'ipad-filter-box', filterRow);
          el('small', '', box, label); el('span', '', box, value);
          el('i', '', box, '⌄');
        }
        const more = el('span', 'ipad-more-filters', filterRow, 'More Filters');
        S.P.icon(more, 'funnel');
        const actionRow = el('div', 'ipad-grid-action-row', top);
        const caption = el('strong', '', actionRow, 'Orders ');
        caption.appendChild(S.count);
        const actionSet = el('div', 'ipad-grid-actions', actionRow);
        const exportAction = [...S.head.querySelectorAll('button')].find(b => b.textContent.trim() === 'Export');
        if (exportAction) actionSet.appendChild(exportAction);
        else { const b = el('span', 'ipad-passive-action', actionSet, 'Export'); S.P.icon(b, 'export'); }
        el('span', 'ipad-passive-action', actionSet, '✎  Edit');
        if (S.archBtn) actionSet.appendChild(S.archBtn);
        if (S.delBtn) actionSet.appendChild(S.delBtn);
        actionSet.appendChild(S.markBtn);
        actionSet.appendChild(S.undoBtn);
        actionRow.appendChild(S.selInfo);
        actionRow.appendChild(S.clearSelBtn);
      },
      drawTools: (base, S) => function (m) {
        base(m);
        if (S.markBtn) S.markBtn.hidden = !m.selected.length;
        if (S.selInfo) S.selInfo.hidden = !m.selected.length;
        if (S.clearSelBtn) S.clearSelBtn.hidden = !m.selected.length;
      },
      drawHeader: (base, S) => function (m) {
        base(m);
        for (const c of S.spec.cols) {
          const p = S.parts[c.id];
          if (!p.arrow.innerHTML) p.arrow.textContent = '⌃⌄';
        }
      },
      pageButton: (base, S) => function (label, key, disabled, cls) {
        const b = base(label, key, disabled, cls);
        if (key === 'prev' || key === 'next') {
          b.setAttribute('aria-label', label);
          for (const n of [...b.childNodes]) if (n.nodeType === 3) n.remove();
        }
        return b;
      },
      fit: (base, S) => function () {
        base.apply(this, arguments);
        S.originalCardW = S.cardW;
        S.ipadScale = Math.max(.64, Math.min(1, S.W / 1309));
        S.cardW = S.W - 48 * S.ipadScale;
        S.cardH = S.H;
        S.left = 24 * S.ipadScale;
        S.top = 0;
        S.FIXED = 402 * S.ipadScale;
        S.rowH = Math.max(16, Math.min(55 * S.ipadScale, Math.floor((S.cardH - S.FIXED) / S.spec.pageSize)));
      },
    },
  },
});
