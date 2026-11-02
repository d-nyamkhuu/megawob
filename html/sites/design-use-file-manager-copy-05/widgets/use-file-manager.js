// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-copy-05',
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
          const treeW = Math.max(195, Math.round(S.geo.winW * 0.264));
          S.geo = { ...S.geo, treeW, paneW: S.geo.winW - treeW - 2,
            paneH: S.geo.winH - 82 };
        };
      },
      body(base, S) {
        return (ctx) => {
          const { util } = S.ctx;
          base(ctx);
          S.els.tree.style.width = S.geo.treeW + 'px';
          const bar = S.els.bar;
          const navigation = document.querySelector('.glass-navigation');
          if (navigation) navigation.appendChild(bar);
          const tools = util.el('div', 'finder-tools', S.els.main);
          S.els.main.insertBefore(tools, S.els.pane);
          util.el('strong', 'finder-current', tools, S.P.itemName(S.model, S.model.cwd));
          const actions = util.el('div', 'finder-actions', tools);
          const group = util.el('span', 'finder-group', actions, '⠿⌄');
          group.setAttribute('aria-hidden', 'true');
          util.el('span', 'finder-tag', actions).innerHTML = '<svg viewBox="0 0 24 24"><path d="m3 12 10-10h8v8L11 20z"/><circle cx="17" cy="6" r="1"/></svg>';
          util.el('span', 'finder-share', actions).innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 8H5v14h14V8h-3M12 15V2m-4 4 4-4 4 4"/></svg>';
          actions.append(S.els.undoBtn, S.els.trashBtn);
          util.el('span', 'finder-more', actions, '···');
          const search = util.el('button', 'fm-ib fm-search', bar);
          search.type = 'button'; search.title = 'Search'; search.setAttribute('aria-label', 'Search');
          search.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m15.5 15.5 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span>Search</span>';
        };
      },
      sizes(base, S) {
        return (ctx) => {
          base(ctx);
          const cols = Math.max(3, Math.min(5, Math.floor(S.geo.paneW / 138)));
          S.sizes = { tileW: Math.floor((S.geo.paneW - 40 - (cols - 1) * 12) / cols), GAP: 12,
            treeRowH: Math.max(24, Math.min(36, Math.floor((S.geo.winH - 50) / S.spec.folders.length))) };
        };
      },
      tileSize(base, S) {
        return (m, groups) => {
          base(m, groups);
          const cols = Math.max(3, Math.min(5, Math.floor(S.geo.paneW / 138)));
          const rows = Math.max(1, groups.reduce((n, g) => n + Math.ceil(g.ids.length / cols), 0));
          const tileH = Math.max(74, Math.min(205, Math.floor((S.geo.paneH - groups.length * 30 - (rows - 1) * 16) / rows)));
          const iconPx = Math.max(24, Math.min(128, S.sizes.tileW - 20, tileH - 84));
          return { tileH, iconPx, lines: 2 };
        };
      },
      group(base, S) {
        return (m, g) => {
          const box = base(m, g);
          const cols = Math.max(3, Math.min(5, Math.floor(S.geo.paneW / 138)));
          if (S.spec.view !== 'list') box.style.gridTemplateColumns = `repeat(${cols}, ${S.sizes.tileW}px)`;
          return box;
        };
      },
      tile(base, S) {
        return (m, id, height, iconPx, lines, box) => {
          const tile = base(m, id, height, iconPx, lines, box);
          tile.style.gap = '0';
          const item = env.taskDef.helpers.itemOf(S.spec, id);
          if (item && item.size) S.ctx.util.el('div', 'finder-file-size', tile, item.size);
          return tile;
        };
      },
      drawBar(base, S) {
        return (m) => {
          base(m);
          const label = S.els.main.querySelector('.finder-current');
          if (label) label.textContent = S.P.itemName(m, m.cwd);
        };
      },
      folderSvg(base, S) {
        return (size, cls = 'fi', tone) => '<svg class="'+cls+'" width="'+size+'" height="'+size+'" viewBox="0 0 56 46" aria-hidden="true"><defs><linearGradient id="finder-folder" x2="0" y2="1"><stop stop-color="#55c2ff"/><stop offset="1" stop-color="#219efa"/></linearGradient></defs><path d="M3 8q0-3 3-3h14l6 6h24q3 0 3 3v26H3z" fill="#198df4"/><rect x="3" y="13" width="50" height="28" rx="3" fill="url(#finder-folder)"/><path d="M5 14h46" stroke="#9bdcff" stroke-width="1.5"/></svg>';
      },
      fileSvg(base, S) {
        return (kind, extension, size) => {
          const ext = String(extension || kind).replace(/^\./, '').toLowerCase();
          if (/^(mp4|mov|avi|webm|mkv)$/.test(ext)) return '<svg class="fi" width="'+size+'" height="'+size+'" viewBox="0 0 110 100" aria-hidden="true"><defs><linearGradient id="film-sky" x2="0" y2="1"><stop stop-color="#7bb9ed"/><stop offset="1" stop-color="#dce9f1"/></linearGradient><linearGradient id="film-lake" x2="0" y2="1"><stop stop-color="#67abc9"/><stop offset="1" stop-color="#317ba1"/></linearGradient></defs><rect x="4" y="8" width="102" height="82" rx="6" fill="#333638"/><rect x="18" y="15" width="74" height="68" rx="2" fill="url(#film-sky)"/><path d="m18 53 22-24 13 13 15-18 24 31v11H18" fill="#637887"/><path d="m39 29 8 15-8-5-7 5 7-15m29-5 8 16-8-6-7 5 7-15" fill="#e6e5df"/><path d="M18 56h74v27H18" fill="url(#film-lake)"/><path d="m18 55 14-9 10 15-24 17m74-26-13-6-10 17 23 14" fill="#355c55"/><path d="M8 16h6v8H8zm0 16h6v8H8zm0 16h6v8H8zm0 16h6v8H8zm88-48h6v8h-6zm0 16h6v8h-6zm0 16h6v8h-6zm0 16h6v8h-6z" fill="#fafafa"/></svg>';
          let art;
          if (ext === 'pdf') art = '<path d="M25 70c22-12 31-59 24-53-8 7 8 48 30 43-21-8-62 14-54 10Z" fill="none" stroke="#f21e1e" stroke-width="2.8" stroke-linejoin="round"/>';
          else if (/^(png|jpg|jpeg|gif|webp|svg)$/.test(ext)) art = '<rect x="26" y="33" width="48" height="38" rx="4" fill="#5ccab1"/><circle cx="49" cy="46" r="8" fill="#ffd24a"/><path d="m26 64 17-17 15 16 8-12 8 17v3H26" fill="#1d9bc8"/>' + (ext === 'gif' ? '<text x="50" y="88" text-anchor="middle" font-family="Arial" font-size="12" fill="#89919f">GIF</text>' : '');
          else if (/^(doc|docx|odt|xls|xlsx|ods|csv|ppt|pptx)$/.test(ext)) {
            const sheet = /^(xls|xlsx|ods|csv)$/.test(ext), slide = /^ppt/.test(ext);
            const color = sheet ? '#168257' : slide ? '#d85c2a' : '#146bc7';
            const letter = sheet ? 'X' : slide ? 'P' : 'W';
            art = '<rect x="34" y="34" width="42" height="44" rx="3" fill="'+color+'"/><path d="M42 42h27m-27 8h27m-27 8h27m-27 8h27" stroke="white" opacity=".5" stroke-width="3"/><rect x="19" y="45" width="34" height="32" rx="3" fill="'+color+'"/><text x="36" y="69" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="26" fill="white">'+letter+'</text>';
          } else art = '<path d="M29 40h43M29 50h43M29 60h43M29 70h43M29 80h33" stroke="#cbd0d6" stroke-width="2.5"/>';
          return '<svg class="fi" width="'+size+'" height="'+size+'" viewBox="0 0 100 110" aria-hidden="true"><defs><linearGradient id="page-'+ext+'" x2=".8" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#f3f4f6"/></linearGradient></defs><path d="M20 5h43l22 23v73a4 4 0 0 1-4 4H20a5 5 0 0 1-5-5V10a5 5 0 0 1 5-5Z" fill="url(#page-'+ext+')" stroke="#d9dce1"/><path d="M63 5v18q0 6 6 6h16" fill="#e6e8eb"/>'+art+'</svg>';
        };
      },
    },
  },
});
