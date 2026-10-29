// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-cellEdit-02',
  name: 'design',
  split: 'train',
  scenarios: ['cellEdit'],
  template: 'use-data-grid/grid',
  design: {
    extraCss: `
        .to-workspace { --grid-chrome-scale: 1; }
        .to-head { height: calc(44px * var(--grid-chrome-scale)); }
        .to-tabs, .to-tabs button { height: calc(30px * var(--grid-chrome-scale)); }
        .to-tools, .to-foot { height: calc(38px * var(--grid-chrome-scale)); }
        .to-facts { height: calc(22px * var(--grid-chrome-scale)); }
    `,
    parts: {
      fit: (base, S) => () => {
        base();
        // Keep a complete page of readable rows inside the available stage.
        // Compact only the surrounding bars when the window needs the space.
        const bars = 44 + 30 + 38 + 38 + 22;
        const rows = Math.min(S.spec.pageSize, S.spec.rows.length) * S.D.rowMin;
        const scale = Math.min(1, Math.max(0.6, (S.cardH - 46 - rows) / bars));
        S.shell.style.setProperty('--grid-chrome-scale', scale);
        S.FIXED = 42 + bars * scale;
        S.rowH = Math.max(S.D.rowMin, Math.min(S.D.rowMax,
          Math.floor((S.cardH - S.FIXED - 4) / S.spec.pageSize)));
      },
    },
  },
});
