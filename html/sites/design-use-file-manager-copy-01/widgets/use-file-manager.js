// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-copy-01',
  name: 'design',
  split: 'train',
  scenarios: ['copy'],
  template: 'use-file-manager/explorer',
  design: {
    fontSize: 16, nameFontSize: 16, detailFontSize: 14, windowRadius: 14, margin: 0,
    titleHeight: 0, toolbarHeight: 56, statusHeight: 24, tileGap: 20,
    folderTone: '#3584e4', titleLabels: ['Files'], separators: ['/'], lightsChance: 0,
    parts: {
      fit(base, S) {
        return (ctx) => {
          base(ctx);
          S.geo = { ...S.geo, fullW: S.geo.W, fullH: S.geo.H, winW: S.geo.W, winH: S.geo.H, left: 0, top: 0 };
        };
      },
      paneSize(base, S) {
        return (ctx) => {
          base(ctx);
          const inspectorW = Math.max(250, Math.min(375, Math.round(S.geo.winW * 0.265)));
          const treeW = Math.max(210, Math.min(275, Math.round(S.geo.winW * 0.205)));
          S.geo = { ...S.geo, treeW, paneW: S.geo.winW - treeW - inspectorW - 2,
            paneH: S.geo.winH - 56 - 150 - 24 };
        };
      },
      body(base, S) {
        return (ctx) => {
          const { util } = S.ctx;
          const win = S.els.win;
          const currentPath = `/home/olivia/Documents/Projects/${S.P.itemName(S.model, S.model.cwd)}`;
          const summary = util.el('section', 'fm-summary', win);
          util.el('div', 'fm-summary-icon', summary).innerHTML = S.P.folderSvg(84, 'fi');
          const heading = util.el('div', 'fm-summary-heading', summary);
          util.el('strong', '', heading, S.P.itemName(S.model, S.model.cwd));
          util.el('span', '', heading, '12 items');
          const facts = util.el('div', 'fm-summary-facts', summary);
          for (const [key, value] of [['Type', 'Folder'], ['Location', currentPath], ['Modified', 'Jan 24, 2024   10:14']]) {
            const row = util.el('div', 'fm-summary-fact', facts);
            util.el('span', '', row, key); util.el('b', '', row, value);
          }
          base(ctx);
          S.els.tree.style.width = S.geo.treeW + 'px';
          const bar = S.els.bar;
          const search = util.el('button', 'fm-ib fm-search', bar);
          search.type = 'button'; search.title = 'Search'; search.setAttribute('aria-label', 'Search');
          search.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15.5 15.5 4.2 4.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
          bar.insertBefore(search, S.els.undoBtn);
          const windowControls = util.el('div', 'fm-window-controls', bar);
          for (const [symbol, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
            const control = util.el('span', 'fm-window-control', windowControls, symbol);
            control.setAttribute('aria-label', label);
          }
          const inspector = util.el('aside', 'fm-inspector', S.els.bodyEl);
          util.el('div', 'fm-inspector-icon', inspector).innerHTML = S.P.folderSvg(148, 'fi');
          util.el('strong', 'fm-inspector-name', inspector, S.P.itemName(S.model, S.model.cwd));
          util.el('span', 'fm-inspector-type', inspector, 'Folder');
          const detailRows = [
            ['Size', '12 items'],
            ['Location', currentPath],
            ['Modified', 'Jan 24, 2024   10:14'],
            ['Accessed', 'Jan 24, 2024   10:14'],
            ['Created', 'Jan 10, 2024   16:37'],
          ];
          const details = util.el('div', 'fm-inspector-details', inspector);
          for (const [key, value] of detailRows) {
            const row = util.el('div', 'fm-inspector-row', details);
            util.el('span', '', row, key); util.el('b', '', row, value);
          }
          const tags = util.el('div', 'fm-inspector-tags', inspector);
          util.el('span', '', tags, 'Tags'); util.el('span', '', tags, 'Add tags…');
        };
      },
    },
  },
});
