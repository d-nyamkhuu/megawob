// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-select-03',
  name: 'design',
  split: 'train',
  scenarios: ['select'],
  template: 'use-file-manager/explorer',
  design: {
    windowRadius: 0,
    parts: {
      // Keep the full-stage window, with its geometry owned by the template.
      fit: (base, S) => (ctx) => {
        base(ctx);
        const { W, H } = S.geo;
        S.geo = { fullW: W, fullH: H, winW: W, winH: H, left: 0, top: 0 };
      },
      tileSize: (base, S) => {
        let normalRowH;
        return (model, groups) => {
          const size = base(model, groups);
          if (S.spec.view === 'list') {
            normalRowH ??= S.sizes.rowH;
            const count = groups.reduce((n, group) => n + group.ids.length, 0);
            const headers = S.spec.grouped ? groups.length : 0;
            // Include pane padding, the column header and each group's vertical padding.
            const available = S.geo.paneH - 20 - 28 - groups.length * 8;
            let rowH = Math.floor((available - headers * 26) / Math.max(1, count));
            const compact = rowH < 22;
            S.els.pane.classList.toggle('compact', compact);
            if (compact) rowH = Math.floor((available - headers * 20) / Math.max(1, count));
            S.sizes = { rowH: Math.min(normalRowH, rowH) };
          }
          return size;
        };
      },
    },
  },
});
