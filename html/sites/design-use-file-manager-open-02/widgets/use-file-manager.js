// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-open-02',
  name: 'design',
  split: 'train',
  scenarios: ['open'],
  template: 'use-file-manager/explorer',
  design: {
      panel: '#fff', fg: '#111', muted: '#333', line: '#888', accent: '#1680c8',
      fontSize: 19, nameFontSize: 21, detailFontSize: 19,
      controlFont: '19px "Times New Roman", Times, serif',
      windowRadius: 0, margin: 0, titleHeight: 22, toolbarHeight: 116,
      statusHeight: 24, tileGap: 0, folderTone: '#e6d92b',
      toastBackground: '#fff', toastColor: '#111', undoColor: '#00e', dismissColor: '#333',
    parts: {
      fit: (base, S) => (ctx) => {
        base(ctx);
        S.geo = { winW: ctx.size.width, winH: ctx.size.height, left: 0, top: 0 };
      },
      window: (base, S) => (ctx) => {
        const win = base(ctx);
        win.style.setProperty('--explorer-bar-height', Math.min(116, Math.max(74, Math.floor(ctx.size.height / 4))) + 'px');
        return win;
      },
      paneSize: (base, S) => (ctx) => {
        base(ctx);
        const { winW, winH } = S.geo;
        const treeW = Math.round(winW * .205);
        const toolbar = Math.min(116, Math.max(74, Math.floor(winH / 4)));
        S.geo = {
          treeW, paneW: winW - treeW - Math.round(winW * .212) - 3,
          paneH: winH - S.D.titleHeight - toolbar - S.D.statusHeight - 2,
        };
      },
      body: (base, S) => (ctx) => {
        base(ctx);
        const { bodyEl, pane } = S.els;
        pane.style.overflow = 'auto';
        const inspector = ctx.util.el('aside', 'fm-properties', bodyEl);
        inspector.style.width = Math.round(S.geo.winW * .212) + 'px';
        inspector.textContent = 'Properties\n\n  📁    Desktop\n\n───────────────────\nType:          File Folder\nLocation:      Shared drive\nSize:          4.8 MB (11 items)\nContains:      4 folders, 7 files\n\n───────────────────\nModified:      Apr 9, 1994  9:13 AM\nCreated:       Mar 15, 1994 2:01 PM\n\n───────────────────';
      },
      sizes: (base, S) => (ctx) => {
        base(ctx);
        S.sizes = { treeRowH: Math.max(14, Math.min(38, Math.floor((S.geo.paneH - 48) / S.spec.folders.length))) };
      },
      treeRow: (base, S) => (...args) => {
        const entry = base(...args);
        const iconSize = Math.min(16, S.sizes.treeRowH - 2);
        entry.row.style.fontSize = Math.min(19, S.sizes.treeRowH - 2) + 'px';
        Object.assign(entry.chev.style, { width: iconSize + 'px', height: iconSize + 'px' });
        const icon = entry.row.querySelector('svg.fi');
        if (icon) Object.assign(icon.style, { width: iconSize + 'px', height: iconSize + 'px' });
        return entry;
      },
      tileSize: (base, S) => (model, groups) => {
        base(model, groups);
        const count = groups.reduce((n, group) => n + group.ids.length, 0);
        const headers = S.spec.grouped ? groups.length * 26 : 0;
        const tileH = Math.max(14, Math.min(38, Math.floor((S.geo.paneH - 20 - headers - groups.length * 12) / Math.max(1, count))));
        return { tileH, iconPx: Math.max(10, Math.min(32, tileH - 4)), lines: 1 };
      },
      group: (base) => (model, group) => {
        const box = base(model, group);
        if (box.classList.contains('fm-tiles')) {
          box.style.gridTemplateColumns = 'minmax(0, 1fr)';
          box.style.rowGap = '0px';
        }
        return box;
      },
      tile: (base) => (model, id, height, iconSize, lines, box) => {
        const tile = base(model, id, height, iconSize, lines, box);
        Object.assign(tile.style, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', padding: '0 10px' });
        Object.assign(tile._label.style, { flex: '1', textAlign: 'left', fontSize: Math.min(21, height - 2) + 'px', whiteSpace: 'nowrap' });
        return tile;
      },
      css: (base) => (ctx) => base(ctx) + `
        .fm-bar { height: var(--explorer-bar-height); flex-wrap: wrap; align-content: stretch; }
        .fm-bar::before { content: "📁  New Folder     📄  Copy     ✂  Cut     ▤  Paste     ❌  Delete     ↶  Undo     │   View:  Details   ▾"; flex: 0 0 100%; height: 50%; display: flex; align-items: center; white-space: pre; overflow: hidden; border-bottom: 1px solid #aaa; }
        .fm-tree::before { content: "Folders"; display: block; height: 28px; font-weight: bold; background: linear-gradient(#eee,#d4d4d4); }
        .fm-properties { flex: none; box-sizing: border-box; overflow: hidden; white-space: pre; padding: 9px 14px; border: 1px solid #888; background: #fff; font: 19px/1.65 "Times New Roman",Times,serif; }
      `,
    },
  },
});
