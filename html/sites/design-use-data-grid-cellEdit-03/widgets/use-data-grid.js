// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-cellEdit-03',
  name: 'design',
  split: 'train',
  scenarios: ['cellEdit'],
  template: 'use-data-grid/grid',
  design: {
    navWidth: 0,
    railWidth: 0,
    contextWidth: 0,
    cardInsetX: 2,
    cardInsetY: 2,
    cardTop: 0,
    rowMax: 55,
    parts: {
      fit: (base, S) => () => {
        base();
        // Match the widget's row calculations to the styled header and footer.
        const style = getComputedStyle(S.ctx.stage);
        S.cardW = Math.min(S.W, S.shell.clientWidth);
        S.cardH = Math.min(S.H, S.shell.clientHeight);
        S.FIXED = Number(style.getPropertyValue('--acme-grid-fixed'));
        const maximum = Number(style.getPropertyValue('--acme-row-max'));
        S.rowH = Math.max(S.D.rowMin, Math.min(maximum,
          Math.floor((S.cardH - S.FIXED - 4) / S.spec.pageSize)));
      },
      drawRows: (base, S) => (model) => {
        base(model);
        // The template's default header is 40px; this design stacks its filters.
        S.grid.style.height = (S.hrow.getBoundingClientRect().height + S.paneHeight + 2) + 'px';
      },
    },
  },
});
