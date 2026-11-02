// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-multirow-02',
  name: 'design',
  split: 'train',
  scenarios: ['multirow'],
  template: 'use-data-grid/grid',
  design: {
    font: '16px/1.25 Tahoma,Arial,sans-serif',
    cardInsetX: 0, cardInsetY: 0, cardTop: 0,
    contextAt: 99999, navWidth: 0, railWidth: 0,
    rowMin: 18, rowMax: 58,
    brand: 'Northwind Traders',
    // Keep the classic layout in the template's geometry, including its row budget.
    extraCss: `
      .to-workspace { inset:0; --accent:#064ba1; --fg:#111; --muted:#333; --panel:#fff; --line:#a0a0a0; }
      .to-appbar, .to-tabs, .to-context, .to-stream, .to-facts { display:none; }
      .to-head { height:var(--inventory-head); padding:0 18px; }
      .to-head .to-btn { height:32px; }
      .to-tools { height:var(--inventory-tools); padding:0 18px; gap:10px; }
      .to-tools .to-btn { height:39px; padding:0 var(--inventory-button-pad); }
      .to-search { width:220px; height:36px; }
      .to-h, .to-c { padding:0 12px; }
      .to-card.rowpick .to-cb { width:0; }
      .to-foot { height:64px; padding:0 18px; }
      .to-pg { min-width:38px; height:36px; }
    `,
    parts: {
      fit: (base, S) => () => {
        base();
        const compact = S.W < 1000;
        S.FIXED = (compact ? 56 + 54 : 68 + 62) + 40 + 64 + 4;
        S.rowH = Math.max(S.D.rowMin, Math.min(S.D.rowMax,
          Math.floor((S.cardH - S.FIXED - 4) / S.spec.pageSize)));
      },
      card: (base, S) => () => {
        base();
        const compact = S.W < 1000;
        S.card.style.setProperty('--inventory-head', compact ? '56px' : '68px');
        S.card.style.setProperty('--inventory-tools', compact ? '54px' : '62px');
        S.card.style.setProperty('--inventory-button-pad', compact ? '7px' : '14px');
      },
      toolbar: (base, S) => () => {
        base();
        // The classic toolbar shows its selection count and bulk tools even at zero.
        const viewLabel = S.tools.querySelector(':scope > .to-selinfo');
        if (viewLabel) viewLabel.remove();
      },
      drawTools: (base, S) => (m) => {
        base(m);
        S.selBar.style.display = 'flex';
        S.clearSelBtn.hidden = !m.selected.length;
        S.undoBtn.hidden = false;
      },
    },
  },
});
