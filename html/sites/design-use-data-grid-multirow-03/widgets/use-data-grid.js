// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-multirow-03',
  name: 'design',
  split: 'train',
  scenarios: ['multirow'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Oceanic Supply',
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    contextAt: 99999,
    cardInsetX: 0,
    cardInsetY: 0,
    cardTop: 0,
    rowMin: 20,
    rowMax: 36,
    parts: {
      fit(base, S) {
        return () => {
          base();
          const compact = S.cardH < 294 + S.spec.pageSize * 20;
          S.FIXED = (compact ? 190 : 290) + (S.fam.helpers.searchable(S.spec) ? 58 : 0);
          S.rowH = Math.max(16, Math.min(S.D.rowMax, Math.floor((S.cardH - S.FIXED - 4) / S.spec.pageSize)));
        };
      },
      rendered(base, S) {
        return (...args) => {
          base(...args);
          S.card.classList.add('orders-reflow');

          const selection = S.P.el('div', 'orders-selection', S.card);
          selection.appendChild(S.selInfo);
          selection.appendChild(S.clearSelBtn);
          S.card.insertBefore(selection, S.grid);

          const bulk = S.P.el('div', 'orders-bulkbar', S.card);
          for (const control of [S.markBtn, S.archBtn, S.delBtn, S.undoBtn]) bulk.appendChild(control);
          S.card.insertBefore(bulk, S.stream);

          // Let records scroll in the space left by the selection and bulk bars.
          Object.assign(S.grid.style, { display: 'flex', flexDirection: 'column', flex: '1 1 0', minHeight: '166px' });
          S.hrow.style.flex = 'none';
          Object.assign(S.body.style, { flex: '1 1 0', minHeight: '0', overflowY: 'auto' });

          if (S.cardH < 294 + S.spec.pageSize * 20) {
            S.card.classList.add('orders-compact');
            S.head.style.height = '36px';
            S.hrow.style.height = '32px';
            S.foot.style.height = '36px';
            Object.assign(selection.style, { minHeight: '28px' });
            Object.assign(bulk.style, { minHeight: '48px', padding: '5px 9px', margin: '3px 8px' });
          }
        };
      },
    },
  },
});
