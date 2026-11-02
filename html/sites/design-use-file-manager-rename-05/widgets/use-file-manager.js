// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-rename-05',
  name: 'design',
  split: 'train',
  scenarios: ['rename'],
  template: 'use-file-manager/explorer',
  design: {
    tileGap: 22,
    treeIndent: 26,
    parts: {
      folderSvg(base, S) {
        return (size, cls = 'fi') => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="classic-folder-${size}" x2="0" y2="1"><stop stop-color="#ffffcf"/><stop offset="1" stop-color="#ffdd43"/></linearGradient></defs><path d="M12 23h27l9 10h39v53H12z" fill="#957020" opacity=".45" transform="translate(3 3)"/><path d="M9 25l10-13h24l11 11h30l7 8v54H9z" fill="#ffc43e" stroke="#86600b" stroke-width="2.5"/><path d="M13 27l8-10h20l11 11h32v8H13z" fill="#fff9b2"/><path d="M10 41l11-9h62l5 5v46H10z" fill="url(#classic-folder-${size})" stroke="#a66e00" stroke-width="2.5"/><path d="M15 45l9-9h56M14 44v35" fill="none" stroke="#fffde4" stroke-width="3"/></svg>`;
      },
      fileSvg(base, S) {
        return (kind, extension, size) => {
          const ext = String(extension || '').replace(/^\./, '').toLowerCase();
          let art = '<path d="M22 36h48M22 43h48M22 50h48M22 57h48M22 64h48M22 71h48M22 78h48M22 85h48" stroke="#aaa" stroke-width="1.7"/>';
          if (/^(docx?|rtf)$/.test(ext)) art = '<path d="M27 37h43M27 45h43M27 53h43M27 61h43M27 69h43M27 77h43M27 85h43" stroke="#6d9ad2" stroke-width="2"/><rect x="3" y="21" width="44" height="42" fill="#1a58b1" stroke="#082d73" stroke-width="2"/><rect x="6" y="24" width="38" height="36" fill="#d7e6fa" stroke="#82a9da"/><text x="24" y="52" text-anchor="middle" font-family="Georgia" font-weight="bold" font-style="italic" font-size="33" fill="#164e9b">W</text>';
          if (/^(xlsx?|csv)$/.test(ext)) art = '<path d="M25 36h45v46H25z" fill="#c2e3c7" stroke="#3e9757"/><path d="M25 45h45M25 54h45M25 63h45M25 72h45M40 36v46M55 36v46" stroke="#fff" stroke-width="2"/><rect x="2" y="23" width="43" height="43" fill="#14772b" stroke="#0a501c" stroke-width="2"/><rect x="5" y="26" width="37" height="37" fill="#e4f0df"/><text x="24" y="56" text-anchor="middle" font-family="Georgia" font-weight="bold" font-size="33" fill="#147429">X</text>';
          if (ext === 'pdf') art = '<rect x="3" y="21" width="45" height="18" fill="#e50016" stroke="#9d0014"/><text x="25" y="35" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#fff">PDF</text><path d="M47 44c-10-9-8 4-2 14 7 13 16 11 16 7s-20 1-30 12-12 9-8 3 25-23 24-36z" fill="none" stroke="#e60016" stroke-width="2.3"/>';
          if (/^(png|jpe?g|gif|svg|psd|webp)$/.test(ext)) art = '<rect x="18" y="31" width="56" height="55" fill="#d3e7ff" stroke="#4f6f97" stroke-width="2"/><rect x="21" y="34" width="50" height="48" fill="#8cceff"/><circle cx="35" cy="48" r="9" fill="#ff9b03" stroke="#e07b00"/><path d="M21 65l15-9 16 13 10-12 9 8v17H21z" fill="#359521"/><path d="M21 63l15-7 17 15 18 4v7H21z" fill="#d9670f"/><path d="M22 84h49" stroke="#fff" stroke-width="3"/>';
          if (/^(eml|msg)$/.test(ext)) art = '<path d="M18 43h56v35H18z" fill="#fff9db" stroke="#8a8060" stroke-width="2"/><path d="M18 43l28 22 28-22M18 78l20-20m36 20L54 58" fill="none" stroke="#aaa38c" stroke-width="2"/>';
          return `<svg width="${size}" height="${size}" viewBox="0 0 90 104" aria-hidden="true"><path d="M18 8h45l18 18v75H18z" fill="#999"/><path d="M15 5h46l18 18v75H15z" fill="#fbfbfa" stroke="#333" stroke-width="1.8"/><path d="M61 5v19h18" fill="#e0e0e0" stroke="#333" stroke-width="1.5"/><path d="M19 28v65h55" fill="none" stroke="#ddd"/>${art}</svg>`;
        };
      },
      tileSize(base, S) {
        return (m, groups) => {
          const fallback = base(m, groups);
          const rows = Math.max(1, groups.reduce((n, g) => n + Math.ceil(g.ids.length / S.spec.cols), 0));
          const room = S.geo.paneH - 30 - (S.spec.grouped ? groups.length * 26 : 0) - Math.max(0, rows - 1) * 22;
          const tileH = Math.min(182, Math.floor(room / rows));
          if (tileH < 96) return fallback;
          return { tileH, iconPx: Math.min(102, tileH - 66), lines: 2 };
        };
      },
      tile(base, S) {
        return (m, id, height, iconPx, lines, box) => {
          const tile = base(m, id, height, iconPx, lines, box);
          const file = env.taskDef.helpers.itemOf(S.spec, id);
          if (file && file.size) S.ctx.util.el('div', 'classic-file-size', tile, file.size);
          return tile;
        };
      },
      group(base, S) {
        return (m, group) => {
          const box = base(m, group);
          box.style.setProperty('--classic-cols', S.spec.cols);
          return box;
        };
      },
      treeRow(base, S) {
        return (m, f, depth, kids, over) => {
          const row = base(m, f, depth, kids, over);
          if (kids.length) row.chev.innerHTML = m.expanded.includes(f.id) ? '−' : '+';
          row.row.style.setProperty('--tree-depth', depth);
          if (depth > 0) row.row.classList.add('classic-tree-child');
          return row;
        };
      },
      draw(base, S) {
        return (m, light) => {
          base(m, light);
          const inspector = S.els.win.querySelector('.xp-inspector');
          if (!inspector) return;
          const h = env.taskDef.helpers;
          const ids = h.childrenOf(m, S.spec, m.cwd);
          const goal = S.spec.goal || {};
          const id = m.selected[0] || [goal.id, goal.file, goal.item, goal.target].find((x) => ids.includes(x)) || ids.find((x) => h.itemOf(S.spec, x).size);
          const item = id && h.itemOf(S.spec, id);
          if (!item) return;
          inspector.querySelector('.xp-file-name').textContent = S.P.itemName(m, id);
          const ext = String(item.ext || '').replace(/^\./, '').toLowerCase();
          const kind = /^(txt|md)$/.test(ext) ? 'Text Document' : /^(docx?|rtf)$/.test(ext) ? 'Word Document' : /^(xlsx?|csv)$/.test(ext) ? 'Spreadsheet' : /^(png|jpg|svg|psd)$/.test(ext) ? 'Image Document' : ext === 'pdf' ? 'PDF Document' : 'File';
          inspector.querySelector('.xp-kind').textContent = kind;
          const values = inspector.querySelectorAll('.xp-meta-row span:last-child');
          if (values[0]) values[0].textContent = item.size || '';
          if (values[1] && item.date) values[1].textContent = S.P.fmtDate(item.date, S.ctx.content);
        };
      },
      sizes(base, S) {
        return (ctx) => {
          // The inspector shares the body with the tree and file pane. Size the
          // grid from that pane rather than the template's two-column estimate.
          const { pane } = S.els;
          S.geo = {
            paneW: pane.clientWidth - 16,
            paneH: pane.clientHeight - 20,
          };
          base(ctx);
        };
      },
      toolbar(base, S) {
        return (ctx) => {
          base(ctx);
          const { bar } = S.els;
          const label = (button, text) => {
            const span = ctx.util.el('span', 'xp-tool-label', button, text);
            span.setAttribute('aria-hidden', 'true');
          };
          S.els.backBtn.innerHTML = '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#31a51d" stroke="#257f19" stroke-width="2"/><path d="M22 10L12 20l10 10M13 20h16" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          label(S.els.backBtn, 'Back');
          S.els.upBtn.innerHTML = '<svg viewBox="0 0 40 40"><path d="M6 13h13l5 5h11l-5 19H3z" fill="#ffdb4f" stroke="#9e7419" stroke-width="1.5"/><path d="M6 21h23L22 35H5z" fill="#fff4a3"/><path d="M20 4l11 10h-6v13h-9V14h-6z" fill="#359f1b" stroke="#287615" stroke-width="1.3"/><path d="M19 8v16" stroke="#9de668" stroke-width="2"/></svg>';
          label(S.els.upBtn, 'Up');
          label(S.els.trashBtn, 'Delete');
          const add = (icon, label, title, disabled = false) => {
            const b = S.P.ib(icon, label, title);
            if (disabled) b.disabled = true;
            return b;
          };
          const forward = add('<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>', '', 'Forward', true);
          forward.innerHTML = '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#d7d7d7" stroke="#aaa" stroke-width="2"/><path d="M18 10l10 10-10 10M27 20H12" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          label(forward, 'Forward');
          bar.insertBefore(forward, S.els.upBtn);
          const search = add('<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#4076b6" stroke-width="2"/><path d="M15.5 15.5L21 21" stroke="#4076b6" stroke-width="2.5"/></svg>', 'Search', 'Search');
          search.dataset.role = 'xtra';
          search.addEventListener('click', () => S.ctx.log('decoy', { label: 'Search' }));
          const folders = add('<svg viewBox="0 0 24 24"><path d="M2 6h8l2 2h10v12H2z" fill="#f5c33b" stroke="#b1841b"/><path d="M2 9h20" stroke="#fff1ad" stroke-width="2"/></svg>', 'Folders', 'Folders');
          folders.dataset.role = 'xtra';
          folders.addEventListener('click', () => S.ctx.log('decoy', { label: 'Folders' }));
          bar.insertBefore(search, S.els.crumbs);
          bar.insertBefore(folders, S.els.crumbs);
          const address = ctx.util.el('div', 'xp-address-row', bar.parentElement);
          ctx.util.el('span', 'xp-address-label', address, 'Address');
          address.appendChild(S.els.crumbs);
          const go = ctx.util.el('button', 'xp-go', address, '➜');
          go.type = 'button';
          go.title = 'Go';
          go.addEventListener('click', () => ctx.log('decoy', { label: 'Go' }));
          go.textContent = '▾';
          const addressIcon = ctx.util.el('span', 'classic-address-icon', address);
          addressIcon.innerHTML = S.P.folderSvg(25, '');
          const view = bar.querySelector('[title="Change view"]');
          if (view) {
            view.innerHTML = '<svg viewBox="0 0 36 36"><path d="M2 3h31v29H2z" fill="#eee" stroke="#4368a4" stroke-width="2"/><path d="M5 6h25" stroke="#fff"/><path d="M8 10h4v4H8zM8 20h4v4H8z" fill="#248cec"/><path d="M17 10h4v4h-4zM26 20h4v4h-4z" fill="#51b420"/><path d="M26 10h4v4h-4zM17 20h4v4h-4z" fill="#e8a61d"/></svg>';
            view.style.order = '6';
          }
          S.els.undoBtn.style.order = '8';
          S.els.trashBtn.style.order = '9';
        };
      },
      body(base, S) {
        return (ctx) => {
          base(ctx);
          const { bodyEl, main, tree } = S.els;
          const treeWrap = ctx.util.el('aside', 'classic-tree-wrap', bodyEl);
          bodyEl.insertBefore(treeWrap, tree);
          const treeHeader = ctx.util.el('div', 'classic-tree-header', treeWrap, 'Folders');
          const treeClose = ctx.util.el('button', '', treeHeader, '×');
          treeClose.type = 'button';
          treeClose.title = 'Folder pane';
          treeClose.addEventListener('click', () => ctx.log('folder-pane'));
          treeWrap.appendChild(tree);
          const inspector = ctx.util.el('aside', 'xp-inspector', bodyEl);
          S.els.inspector = inspector;
          const selected = ctx.model.selected && ctx.model.selected[0];
          const item = selected && ctx.spec.items && ctx.spec.items.find((x) => x.id === selected);
          const fileName = item ? item.name : 'PXL_20210428_762409343.svg';
          const head = ctx.util.el('div', 'xp-inspector-head', inspector);
          head.innerHTML = '<svg viewBox="0 0 72 104" aria-hidden="true"><path d="M4 2h45l19 19v81H4z" fill="#fff" stroke="#555" stroke-width="2"/><path d="M49 2v20h19" fill="#eee" stroke="#555" stroke-width="2"/><path d="M12 34h45M12 43h45M12 52h45M12 61h45M12 70h45M12 79h45M12 88h45" stroke="#999" stroke-width="1.5"/><path d="M7 6h42" stroke="#ddd" stroke-width="2"/></svg>';
          ctx.util.el('span', 'xp-head-name', head, fileName);
          const preview = ctx.util.el('div', 'xp-preview', inspector);
          preview.innerHTML = '<svg class="xp-svg-art" viewBox="0 0 100 136" aria-hidden="true"><path d="M13 2h51l22 22v108H13z" fill="#fff" stroke="#777" stroke-width="2"/><path d="M64 2v24h22" fill="#e6eaf0" stroke="#777" stroke-width="2"/><circle cx="50" cy="68" r="23" fill="#20a8e0" stroke="#1679ad" stroke-width="2"/><path d="M30 62q10-12 19-5l-5 9-9 2zM51 48l10 4 5 9-8 3-4-6-8 1zM41 72l11 3 4 11-8 6-9-10zM62 72l9-2-3 12-8 4z" fill="#f3d52e"/><rect x="27" y="101" width="46" height="20" rx="2" fill="#279c14"/><text x="50" y="116" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold" font-size="16">SVG</text></svg>';
          ctx.util.el('div', 'xp-file-name', inspector, fileName);
          ctx.util.el('div', 'xp-kind', inspector, 'SVG Document');
          ctx.util.el('div', 'xp-rule', inspector);
          const metadata = ctx.util.el('div', 'xp-metadata', inspector);
          for (const [k, v] of [['Size:', '12.4 KB'], ['Modified:', '9/4/2025 3:17 PM'], ['Attributes:', 'A (Archive)']]) {
            const row = ctx.util.el('div', 'xp-meta-row', metadata);
            ctx.util.el('span', '', row, k);
            ctx.util.el('span', '', row, v);
          }
          const help = ctx.util.el('aside', 'classic-help', bodyEl);
          const helpHead = ctx.util.el('div', 'classic-help-head', help);
          helpHead.innerHTML = '<svg viewBox="0 0 32 42" aria-hidden="true"><path d="M9 29c0-7-6-9-6-16C3-3 29-3 29 13c0 7-7 10-7 16z" fill="#ffdc30" stroke="#3e3b16" stroke-width="1.5"/><path d="M8 11c0-5 5-7 9-7" fill="none" stroke="#fffbc1" stroke-width="3"/><path d="M12 14l4 6 4-6m-4 6v10" fill="none" stroke="#ac791b" stroke-width="1.6"/><path d="M10 29h12v8H10z" fill="#aaa" stroke="#333"/><path d="M11 31h10m-10 3h10" stroke="#fff"/><path d="M13 38h6l-2 3h-2z" fill="#444"/></svg>';
          ctx.util.el('strong', '', helpHead, 'Help and Tips');
          ctx.util.el('p', 'classic-help-long', help, 'You can view, move, copy, delete, and rename files and folders. To select multiple items, hold down Ctrl or Shift while clicking.');
          ctx.util.el('p', 'classic-help-short', help, 'View, move, copy, delete, rename files and folders. Hold Ctrl or Shift to select multiple items.');
          main.style.flex = '1 1 0';
        };
      },
    },
  },
});
