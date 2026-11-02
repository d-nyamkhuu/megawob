// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-select-02',
  name: 'design',
  split: 'train',
  scenarios: ['select'],
  template: 'use-file-manager/explorer',
  design: {
    parts: {
      tileSize: (base, S) => (model, groups) => {
        const size = base(model, groups);
        if (S.spec.view === 'list') {
          const count = groups.reduce((n, group) => n + group.ids.length, 0);
          const headingHeight = S.els.pane.classList.contains('compact') ? 20 : 26;
          const headers = S.spec.grouped ? groups.length : 0;
          // Account for pane padding, the column header and each group's vertical padding.
          const available = S.geo.paneH - 20 - 28 - headers * headingHeight - groups.length * 8;
          S.sizes = { rowH: Math.min(S.sizes.rowH, Math.floor(available / Math.max(1, count))) };
        }
        return size;
      },
    },
  },
});
