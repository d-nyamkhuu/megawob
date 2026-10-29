// Design on the shared use-file-manager/explorer template.
(function () {
  function folderArt(size, cls = 'fi') {
    return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="aero-folder-front"><stop stop-color="#fff0a0"/><stop offset=".48" stop-color="#e7c65a"/><stop offset="1" stop-color="#bc9435"/></linearGradient><linearGradient id="aero-folder-side"><stop stop-color="#f5df85"/><stop offset="1" stop-color="#d9b248"/></linearGradient></defs><ellipse cx="13" cy="21" rx="10" ry="2" fill="#576370" opacity=".16"/><path d="M4 2l14 3 .5 15-7 3-8-4z" fill="url(#aero-folder-side)" stroke="#c7a64e" stroke-width=".65"/><path d="M6 4l10 3v12l-5 2-5-3z" fill="#fff4ba"/><path d="M3 2l7 2v19l-7-4z" fill="url(#aero-folder-front)" stroke="#c5a54a" stroke-width=".6"/><path d="M10 4l8 1v15l-8 3z" fill="url(#aero-folder-front)"/><path d="M4 3l5 2v16l-5-3z" fill="none" stroke="#fff6bd" stroke-width=".6"/><path d="M17 15l3 1v5l-3 1z" fill="#efcf66" stroke="#c5a54a" stroke-width=".5"/><path d="M19 16.8l1 .3v3l-1 .5z" fill="#83aed0"/></svg>`;
  }
  function ribbonArt(name, size = 48) {
    const sheet = '<path d="M13 4h17l9 9v29H13z" fill="url(#paper)" stroke="#8594a2"/><path d="M30 4v10h9" fill="#dbe6ed" stroke="#8594a2"/><path d="M18 21h15m-15 5h15m-15 5h15m-15 5h11" stroke="#87a4bd" stroke-width="1.5"/>';
    const folder = '<path d="M6 5l16 3 2 34-17-6z" fill="url(#gold)" stroke="#c3a049"/><path d="M22 8l15 3v25l-13 6z" fill="#e5c666" stroke="#c3a049"/><path d="M10 9l8 2 2 25-10-4z" fill="#fff1ae"/>';
    const paths = {
      'Copy': '<g transform="translate(-6,-2)">' + sheet + '</g><g transform="translate(3,5) scale(.85)">' + sheet + '</g>',
      'Paste': '<path d="M9 7h29v36H9z" fill="url(#silver)" stroke="#8095aa" stroke-width="1.4"/><rect x="13" y="13" width="21" height="26" fill="#f2f6fa" stroke="#a5b8cb"/><path d="M17 5h5V3h5v2h5v7H17z" fill="url(#silver)" stroke="#8197ad"/><path d="M17 19h13m-13 5h13m-13 5h13m-13 5h13" stroke="#b8c8d8"/>',
      'Cut': '<path d="M17 29L30 5l1 17-11 13M28 30L16 5l-1 17 10 13" fill="url(#silver)" stroke="#728fa6"/><circle cx="15" cy="36" r="7" fill="#84c9ef" stroke="#2c81b6" stroke-width="2"/><circle cx="30" cy="36" r="7" fill="#84c9ef" stroke="#2c81b6" stroke-width="2"/><circle cx="15" cy="36" r="3" fill="#e4f4ff"/><circle cx="30" cy="36" r="3" fill="#e4f4ff"/><circle cx="23" cy="26" r="2" fill="#dae6ec" stroke="#66869e"/>',
      'Delete': '<path d="M8 8c7 1 12 8 16 13C30 13 37 8 42 7 34 13 29 22 28 24c5 7 10 12 12 19-6-3-11-9-16-15C18 35 12 42 5 43c5-8 10-14 15-19C14 18 9 12 8 8z" fill="url(#red)" stroke="#b63b24" stroke-width=".6"/><path d="M10 9c6 2 10 7 14 13M27 23l12-13" fill="none" stroke="#ffbd9c" stroke-width="2"/>',
      'Rename': '<rect x="3" y="19" width="36" height="17" fill="#fff" stroke="#6b8da7" stroke-width="2"/><rect x="7" y="23" width="21" height="9" fill="url(#blue)"/><path d="M29 5h11m-5 0v38m-6 0h11M31 5l3 3 3-3" stroke="#68859b" stroke-width="3" fill="none"/>',
      'New folder': folder,
      'Move to': folder + '<path d="M27 25h15v10H27v7L16 30l11-12z" fill="url(#blue)" stroke="#1876aa"/>',
      'Copy to': folder + '<g transform="translate(19,3) scale(.55)">' + sheet + '</g>',
      'Copy path': '<path d="M7 13h33v25H7z" fill="#edf6fc" stroke="#6799bb"/><path d="M17 29L30 7l1 13-10 13" fill="#b5d4e9" stroke="#3b8abd"/><circle cx="16" cy="31" r="5" fill="none" stroke="#2f94ce" stroke-width="3"/>',
      'Paste shortcut': sheet + '<path d="M3 27h19v16H3z" fill="#fff" stroke="#7e97ac"/><path d="M7 39v-8h8v-4l7 7-7 6v-5H11v4z" fill="#6c91af"/>',
      'New item': sheet + '<path d="M8 5v14M1 12h14" stroke="#2a95c9" stroke-width="4"/>',
      'Easy access': sheet + '<path d="M9 15l8 9-13 11" fill="none" stroke="#4099c7" stroke-width="4"/>',
      'Undo': '<path d="M17 13H7V3L1 16l15 8v-7c15-2 23 4 18 19 16-16 4-28-17-23z" fill="url(#blue)" stroke="#3a7ba4"/>',
      'Search': '<circle cx="29" cy="17" r="11" fill="#c3ebff" stroke="#3e8db9" stroke-width="4"/><path d="M21 25L8 40" stroke="#2c6fa1" stroke-width="7"/><path d="M25 10q7-4 11 3" fill="none" stroke="#fff" stroke-width="3"/>',
      'Back': '<circle cx="24" cy="24" r="21" fill="url(#navblue)" stroke="#7b95ae" stroke-width="2"/><path d="M26 11L12 24l14 12v-8h12v-9H26z" fill="#fff" stroke="#437da5"/><path d="M8 18q15-17 32 0" fill="none" stroke="#fff" opacity=".5" stroke-width="4"/>',
      'Up': '<circle cx="24" cy="24" r="21" fill="url(#silver)" stroke="#8096aa" stroke-width="2"/><path d="M12 25l12-13 12 13h-8v12h-9V25z" fill="#fff" stroke="#7895ab"/>',
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#edf2f6"/></linearGradient><linearGradient id="silver" x2=".4" y2="1"><stop stop-color="#fbfdff"/><stop offset=".5" stop-color="#b5c9dc"/><stop offset="1" stop-color="#e5edf3"/></linearGradient><linearGradient id="gold"><stop stop-color="#fff0a0"/><stop offset=".5" stop-color="#e6c25b"/><stop offset="1" stop-color="#bc9435"/></linearGradient><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#a1dcf9"/><stop offset=".5" stop-color="#4aaddd"/><stop offset="1" stop-color="#147ab4"/></linearGradient><linearGradient id="red" x2=".4" y2="1"><stop stop-color="#fc9071"/><stop offset=".5" stop-color="#df3720"/><stop offset="1" stop-color="#b82314"/></linearGradient><linearGradient id="navblue" x2="0" y2="1"><stop stop-color="#c1e5f8"/><stop offset=".47" stop-color="#447dad"/><stop offset=".52" stop-color="#07519b"/><stop offset="1" stop-color="#34b9e7"/></linearGradient></defs>${paths[name] || sheet}</svg>`;
  }
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-range-05',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'use-file-manager/explorer',
  design: {
    fontSize: 16,
    nameFontSize: 16,
    detailFontSize: 16,
    controlFont: '16px "Segoe UI", Tahoma, Arial, sans-serif',
    parts: {
      toolbar(base, S) {
        return function (ctx) {
          base(ctx);
          const { util } = ctx;
          const { bar, crumbs, backBtn, upBtn, undoBtn, trashBtn } = S.els;
          const crumbRow = util.el('div', 'fm-ref-crumb-row', bar);
          const menuRow = util.el('div', 'fm-ref-menubar', bar);
          const actionRow = util.el('div', 'fm-ref-actions', bar);
          const sampledDecoys = [...bar.querySelectorAll('[data-role="xtra"]')];
          backBtn.innerHTML = ribbonArt('Back', 36);
          upBtn.innerHTML = ribbonArt('Up', 36);
          crumbRow.append(backBtn, upBtn, crumbs);
          const search = util.el('div', 'fm-search', crumbRow);
          search.innerHTML = '<span class="fm-search-text">Search folder</span>' + ribbonArt('Search', 24);
          for (const label of ['Organize', 'Open', 'Share with', 'Burn', 'New folder']) {
            const b = util.el('button', 'fm-menu-command', menuRow, label);
            b.type = 'button';
            if (label === 'Open') b.insertAdjacentHTML('afterbegin', folderArt(22));
            b.addEventListener('click', () => ctx.log('decoy', { label }));
          }
          const group = () => util.el('div', 'fm-ribbon-group', actionRow);
          const action = (parent, label, small = false, existing = null) => {
            const b = existing || util.el('button', '', parent);
            if (existing) parent.append(b);
            b.className = 'fm-ib fm-ref-action' + (small ? ' fm-action-small' : '');
            b.type = 'button'; b.title = label;
            b.innerHTML = `<span class="fm-ref-action-icon">${ribbonArt(label, small ? 24 : 48)}</span><span>${label}</span>`;
            if (!existing) { b.dataset.role = 'xtra'; b.addEventListener('click', () => ctx.log('decoy', { label })); }
            return b;
          };
          const clipboard = group();
          action(clipboard, 'Copy'); action(clipboard, 'Paste');
          const clipStack = util.el('div', 'fm-ribbon-stack', clipboard);
          for (const label of ['Cut', 'Copy path', 'Paste shortcut']) action(clipStack, label, true);
          const folders = group(); action(folders, 'Move to'); action(folders, 'Copy to');
          const edit = group(); action(edit, 'Delete', false, trashBtn); action(edit, 'Rename');
          const create = group(); action(create, 'New folder');
          const stack = util.el('div', 'fm-ribbon-stack', create);
          action(stack, 'New item', true); action(stack, 'Easy access', true); action(stack, 'Undo', true, undoBtn);
          const other = util.el('div', 'fm-ribbon-other', actionRow);
          for (const b of sampledDecoys) other.append(b);
        };
      },
      folderSvg(base, S) {
        return (size, cls = 'fi') => folderArt(size, cls);
      },
      fileSvg(base, S) {
        return function (kind, extension, size) {
          const ext = String(extension || '').toLowerCase();
          const excel = /xls|ods|csv/.test(ext) || kind === 'spreadsheet';
          const ppt = /ppt|key|odp/.test(ext) || kind === 'presentation';
          const pdf = ext === 'pdf';
          const word = /doc|rtf|odt/.test(ext);
          const picture = /svg|png|jpg|jpeg|webp|heic|gif/.test(ext) || kind === 'image';
          const audio = /mp3|wav|m4a|aac|ogg/.test(ext) || kind === 'audio';
          const archive = /zip|rar|7z|tar|gz/.test(ext) || kind === 'archive';
          const color = excel ? '#26713b' : ppt ? '#b44421' : pdf ? '#d21819' : word ? '#284f91' : '#7c8a94';
          const letter = excel ? 'X' : ppt ? 'P' : word ? 'W' : '';
          const badge = letter ? `<rect x="1" y="8" width="11" height="13" rx=".7" fill="${color}" stroke="#fff" stroke-width=".6"/><text x="6.5" y="17.8" text-anchor="middle" font-family="Georgia,serif" font-size="10" font-weight="bold" fill="#fff">${letter}</text>` : pdf ? '<path d="M7 19c5-9 5-12 4-13-2-2-1 5 2 8s6 2 5 1-6 0-11 4z" fill="none" stroke="#d21819" stroke-width="1.5"/>' : picture ? '<rect x="3" y="9" width="18" height="13" fill="#c0e8f7" stroke="#7495a8"/><circle cx="17" cy="12" r="2" fill="#fff5b6"/><path d="M4 21l6-9 4 6 3-3 4 6z" fill="#639452"/><path d="M4 21l6-9 2 4-3 1z" fill="#a5ba83"/>' : audio ? '<path d="M9 10l10-3v12c0 4-7 5-7 1 0-2 2-3 5-3v-7l-6 2v10c0 4-7 5-7 1 0-2 2-3 5-3z" fill="#2586b9" stroke="#1e6c9a" stroke-width=".5"/>' : archive ? '<path d="M12 3h3v17h-3z" fill="#7d858b"/><path d="M11 5h5m-5 3h5m-5 3h5m-5 3h5m-5 3h5" stroke="#e8cb73" stroke-width="1.5"/><rect x="11" y="19" width="5" height="5" rx="1" fill="#d3b65d" stroke="#8f7e49"/>' : '';
          return `<svg width="${size}" height="${size}" viewBox="0 0 24 26" aria-hidden="true"><defs><linearGradient id="office-paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e8edf1"/></linearGradient></defs><path d="M5 1h11l6 6v18H5z" fill="url(#office-paper)" stroke="${pdf ? color : '#8a969f'}" stroke-width=".9"/><path d="M16 1v6h6" fill="#d9e2e9" stroke="#8999a6" stroke-width=".8"/><path d="M9 10h10m-10 3h10m-10 3h10m-10 3h10m-10 3h10" stroke="${excel ? '#83a78b' : '#9caebc'}" stroke-width=".6"/>${excel ? '<path d="M14 9v14m3-14v14" stroke="#83a78b" stroke-width=".6"/>' : ''}${badge}</svg>`;
        };
      },
      fmtDate(base, S) {
        return function (iso, content) {
          const match = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
          if (!match) return base(iso, content);
          const [, year, month, day, hour, minute] = match;
          const date = `${Number(month)}/${Number(day)}/${year}`;
          return hour === undefined ? date : `${date} ${Number(hour) % 12 || 12}:${minute} ${Number(hour) < 12 ? 'AM' : 'PM'}`;
        };
      },
      body(base, S) {
        return function (ctx) {
          base(ctx);
          const inspector = document.querySelector('.fm-inspector');
          if (inspector) S.els.bodyEl.append(inspector);
        };
      },
      drawBar(base, S) {
        return function (m) {
          base(m);
          const task = env.taskDef.helpers;
          const current = task.itemOf(S.spec, m.cwd);
          const name = S.P.itemName(m, m.cwd);
          const title = document.querySelector('.fm-folder-copy strong');
          if (title) title.textContent = name;
          const values = document.querySelectorAll('.fm-property span:last-child');
          if (values[0]) values[0].textContent = current.date ? S.P.fmtDate(current.date, S.ctx.content) : '—';
          if (values[3]) values[3].textContent = `${task.childrenOf(m, S.spec, m.cwd).length} items`;
          const search = S.els.bar.querySelector('.fm-search-text');
          if (search) search.textContent = `Search ${name}`;
          const icon = S.ctx.util.el('span', 'fm-path-icon'); icon.innerHTML = folderArt(23);
          S.els.crumbs.prepend(icon);
        };
      },
      status(base, S) {
        return function (ctx) {
          base(ctx);
          const icon = ctx.util.el('span', 'fm-status-icon'); icon.innerHTML = folderArt(43);
          S.els.status.prepend(icon);
          S.els.status.lastElementChild.style.display = 'none';
          const views = S.els.bar.querySelector('.fm-ribbon-other');
          if (views) { views.classList.add('fm-status-views'); S.els.status.append(views); }
        };
      },
      sizes(base, S) {
        return function (ctx) {
          base(ctx);
          const task = env.taskDef.helpers;
          const empty = { names: {}, parent: {}, deleted: [] };
          const count = Math.max(1, ...S.spec.folders.map(folder =>
            task.childrenOf(empty, S.spec, folder.id).length));
          S.sizes = {
            ...S.sizes,
            rowH: Math.max(20, Math.min(33, Math.floor((S.els.pane.clientHeight - 42) / count))),
            listCols: `minmax(0, 39fr) minmax(0, 20fr) minmax(0, 29fr) minmax(50px, 12fr)`,
          };
        };
      },
      buildMain(base, S) {
        return function (m) {
          const { ctx, P, spec } = S;
          const { pane, tileEls } = S.els;
          pane.replaceChildren();
          for (const k of Object.keys(tileEls)) delete tileEls[k];
          const task = env.taskDef.helpers;
          const order = task.display(m, spec, m.cwd);
          const groups = spec.grouped ? task.groups(m, spec, m.cwd) : [{ kind: 'all', label: '', ids: order }];
          if (!order.length) P.empty(m);
          P.listHead(m);
          for (const group of groups) {
            const box = P.group(m, group);
            box.classList.add('fm-ref-list');
            for (const id of group.ids) {
              const isFolder = task.isFolder(id);
              const row = P.row(m, id, box);
              row.dataset.id = id;
              row.title = P.itemName(m, id);
              if (isFolder) row.dataset.drop = `tile:${id}`;
              tileEls[id] = row;
              if (m.renaming === id) {
                const input = P.renameField(m, row);
                S.els.renameInput = input;
                P.bindRename(input);
              }
              P.item(ctx, row, id);
            }
          }
        };
      },
      listHead(base, S) {
        return function () {
          const { ctx } = S;
          const { pane } = S.els;
          const head = ctx.util.el('div', 'fm-lhead fm-ref-head', pane);
          head.style.gridTemplateColumns = S.sizes.listCols;
          for (const label of ['Name', 'Date modified', 'Type', 'Size']) ctx.util.el('span', '', head, label);
          return head;
        };
      },
      row(base, S) {
        return function (m, id, box) {
          const { ctx, P, sizes } = S;
          const fam = env.taskDef.helpers;
          const row = ctx.util.el('div', 'fm-row', box);
          row.style.gridTemplateColumns = sizes.listCols;
          row.style.height = `${sizes.rowH}px`;
          row.style.setProperty('--aero-row-height', `${sizes.rowH}px`);
          const name = ctx.util.el('div', 'nm', row);
          const icon = ctx.util.el('span', 'ic', name);
          icon.innerHTML = P.iconHtml(m, id, Math.min(24, sizes.rowH - 8));
          icon.style.display = 'inline-flex';
          const label = ctx.util.el('span', 'lab', name, P.itemName(m, id));
          row._label = label;
          row._icon = icon;
          const item = fam.itemOf(S.spec, id);
          const extension = P.itemName(m, id).split('.').pop().toLowerCase();
          const types = { xlsx: 'Microsoft Excel Worksheet', xls: 'Microsoft Excel 97 - 2003 Worksheet', ods: 'OpenDocument Spreadsheet', csv: 'CSV File', docx: 'Microsoft Word Document', doc: 'Microsoft Word 97 - 2003 Document', pptx: 'Microsoft PowerPoint Presentation', ppt: 'Microsoft PowerPoint Presentation', key: 'Keynote Presentation', txt: 'Text Document', pdf: 'Adobe Acrobat Document', rtf: 'Rich Text Format', heic: 'HEIC Image', svg: 'Scalable Vector Graphics' };
          ctx.util.el('span', 'dim', row, fam.isFolder(id) ? '—' : P.fmtDate(item.date, ctx.content));
          ctx.util.el('span', 'dim', row, fam.isFolder(id)
            ? 'File folder' : (types[extension] || (fam.KINDS[item.kind] || [item.kind, item.kind])[1]));
          ctx.util.el('span', 'dim', row, fam.isFolder(id) ? '—' : item.size);
          return row;
        };
      },
    },
  },
});
})();
