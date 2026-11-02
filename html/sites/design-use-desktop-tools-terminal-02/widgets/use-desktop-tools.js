// Terminal design: keeps the workspace host in its tab and uses the site's laptop prompt and file listing.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-terminal-02',
  name: 'design',
  split: 'train',
  scenarios: ['terminal'],
  template: 'use-desktop-tools/workspace',
  design: {
    placeholder: '█',
    parts: {
      termPs: (base, S) => (X, cwd) =>
        `<span class="at-ps">user@laptop</span>:<span class="at-pc">${cwd ? '~/' + cwd : '~'}</span>$`,
      termWelcome: () => (X, m) => {
        const { spec, line } = X;
        line('out', `Current directory: ${m.cwd ? '~/' + m.cwd : '~'}`);
        line('out', 'Available files in this workspace:');
        const listing = X.util.el('div', 'at-file-list', X.lines);
        for (const file of spec.files) X.util.el('div', 'at-tl out', listing, '~/' + file);
      },
      termPaintEnd: (base, S) => (X, m) => {
        base(X, m);
        X.tabs.dataset.title = `Terminal — user@laptop: ${m.cwd ? '~/' + m.cwd : '~'}`;
      },
    },
  },
});
