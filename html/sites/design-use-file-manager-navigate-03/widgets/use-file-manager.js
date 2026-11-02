// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-navigate-03',
  name: 'design',
  split: 'train',
  scenarios: ['navigate'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#fff', fg: '#142235', line: '#a4afb8', muted: '#4a5968',
    accent: '#2473b7', windowRadius: 0,
    parts: {
      fit: (base, S) => (ctx) => {
        // Preserve the template's seeded draws, then fit to the actual stage.
        base(ctx);
        S.geo = { left: 0, top: 0, winW: ctx.size.width, winH: ctx.size.height };
      },
      paneSize: (base, S) => (ctx) => {
        base(ctx);
        const treeW = Math.round(S.geo.winW * 0.28);
        S.geo = { treeW, paneW: S.geo.winW - treeW - 3 };
      },
    },
  },
});
