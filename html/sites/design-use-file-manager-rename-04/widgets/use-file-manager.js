// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-rename-04',
  name: 'design',
  split: 'train',
  scenarios: ['rename'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#fff', fg: '#111', line: '#222', muted: '#222', accent: '#111',
    fontSize: 23, nameFontSize: 23, detailFontSize: 23, controlFont: 'inherit',
    windowRadius: 0, margin: 7, titleHeight: 39, toolbarHeight: 77, statusHeight: 49,
    tileGap: 0, treeIndent: 40, folderTone: '#fff',
    kindColors: Object.fromEntries(['document','text','spreadsheet','presentation','image','video','audio','archive','data','web','design'].map(k => [k, '#111'])),
    titleLabels: ['File Manager'], lightsChance: 0,
    toastBackground: '#eee', toastColor: '#111', undoColor: '#111', dismissColor: '#111',
    separators: ['›'], listHeadings: ['Name', 'Size', 'Type', 'Modified'],
    parts: {
      fit: (base, S) => (ctx) => {
        base(ctx);
        S.geo = { winW: S.geo.W, winH: S.geo.H, left: 0, top: 0 };
      },
      paneSize: (base, S) => (ctx) => {
        base(ctx);
        S.geo = { treeW: Math.round(S.geo.winW * .25), paneW: Math.round(S.geo.winW * .75) - 24,
          paneH: S.geo.winH - 190 };
      },
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const { bar } = S.els;
        const svg = p => `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linejoin="miter" stroke-linecap="square">${p}</svg>`;
        const art = {
          back: '<path d="M24 10H5v21h23V9m-7-4 5 4-5 3"/>',
          up: '<path d="M2 28V7h11l4 5h12v5M2 28l5-14h24l-5 14Z"/>',
          copy: '<path d="M13 9H5v21h15v-7M13 9V5h9l7 7v19H13Zm9-4v8h7"/>',
          cut: '<circle cx="8" cy="26" r="4"/><circle cx="24" cy="26" r="4"/><path d="m7 3 16 20M25 3 9 23"/>',
          paste: '<path d="M11 6H6v25h21V6h-6M12 3h9v6h-9ZM11 14h11m-11 5h11m-11 5h11"/>',
          trash: '<path d="m6 6 21 21M27 6 6 27"/>',
          undo: '<path d="m12 7-9 9 9 8M4 16h16q9 0 9 11"/>',
          list: '<path d="M7 8h1m5 0h16M7 16h1m5 0h16M7 24h1m5 0h16"/>',
          grid: '<path d="M2 5h29v23H2ZM12 5v23M21 5v23M2 16h29"/>'
        };
        const set = (b, key) => { b.innerHTML = svg(art[key]); b.classList.add('gem-tool'); };
        const all = [...bar.querySelectorAll('button')];
        const back = all.find(b => b.title === 'Back');
        const up = all.find(b => b.title === 'Up one level');
        const undo = all.find(b => b.title === 'Undo');
        const trash = all.find(b => b.title.startsWith('Delete'));
        set(back, 'back'); set(up, 'up'); set(undo, 'undo'); set(trash, 'trash');
        const decoration = (key, title) => {
          const b = ctx.util.el('button', 'fm-ib', bar);
          b.type = 'button'; b.title = title; b.dataset.role = 'xtra'; set(b, key);
          b.addEventListener('click', () => ctx.log('decoy', { label: title }));
          return b;
        };
        const copy = decoration('copy', 'Copy');
        const cut = decoration('cut', 'Cut');
        const paste = decoration('paste', 'Paste');
        const views = all.filter(b => b.dataset.role === 'xtra');
        if (views.length < 2) views.push(decoration('grid', 'Icon view'));
        views.forEach((b, i) => set(b, i ? 'grid' : 'list'));
        views[0].classList.add('gem-active');
        up.classList.add('gem-separator'); paste.classList.add('gem-separator'); undo.classList.add('gem-separator');
        bar.append(back, up, copy, cut, paste, trash, undo, ...views);
      },
      body: (base, S) => (ctx) => {
        base(ctx);
        S.els.main.prepend(S.els.crumbs);
      },
      sizes: (base, S) => (ctx) => {
        base(ctx);
        const row = Math.max(35, Math.min(52, S.geo.W * .031));
        S.sizes = { rowH: row, treeRowH: Math.max(32, Math.min(49, S.geo.W * .0295)),
          listCols: '36.7% 13.3% 21.2% 28.8%' };
      },
      folderSvg: () => (size, cls = 'fi') => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 32 32"><path d="M2 28V6h10l5 5h13v17Z" fill="#f7f7f7" stroke="#111" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
      fileSvg: () => (kind, ext, size) => `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" stroke="#111" stroke-width="2"><path fill="#fff" d="M6 2h15l7 7v21H6Z"/><path d="M21 2v8h7M11 14h12M11 19h12M11 24h12"/></svg>`,
      treeRow: (base) => (m, f, depth, kids, over) => {
        const t = base(m, f, depth, kids, over);
        t.chev.textContent = kids.length ? (m.expanded.includes(f.id) ? '−' : '+') : '';
        t.chev.classList.toggle('gem-toggle', !!kids.length);
        t.row.dataset.depth = depth;
        if (!depth) t.row.querySelector('svg').innerHTML = '<path d="m4 27 4-23h16l5 23ZM6 21h21M12 8h8l2 8H10Z" fill="#eee" stroke="#111" stroke-width="2"/>';
        return t;
      },
      buildMain: (base, S) => (m) => {
        base(m);
        if (S.spec.view !== 'list') {
          const head = S.ctx.util.el('div', 'fm-lhead', S.els.pane);
          for (const label of ['Name', 'Size', 'Type', 'Modified']) S.ctx.util.el('span', '', head, label);
          S.els.pane.prepend(head);
        }
      },
      row: (base, S) => (m, id, box) => {
        const t = base(m, id, box);
        const cells = [...t.querySelectorAll(':scope > .dim')];
        t.append(cells[2], cells[1], cells[0]);
        if (env.taskDef.helpers.isFolder(id)) { cells[2].textContent = '—'; cells[1].textContent = 'File folder'; cells[0].textContent = ''; }
        return t;
      },
      status: (base, S) => (ctx) => {
        base(ctx);
        const tip = S.els.status.lastElementChild;
        tip.textContent = 'Tip: Double-click a file to open it.';
        tip.classList.add('gem-tip');
        tip.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 32" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 24C8 18 3 17 3 10a9 9 0 0 1 18 0c0 7-5 8-5 14ZM8 27h8m-7 3h6"/></svg>');
      },
      tile: (base, S) => (m, id, tileH, iconPx, lines, box) => {
        const t = base(m, id, tileH, iconPx, lines, box);
        const fam = env.taskDef.helpers;
        const item = fam.itemOf(S.spec, id);
        const folder = fam.isFolder(id);
        const type = folder ? 'File folder' : ((fam.KINDS[item.kind] || [item.kind, item.kind])[1]).replace(/^./, c => c.toUpperCase());
        const date = (() => {
          const [year, month, day] = String(item.date || '').slice(0, 10).split('-');
          const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          return year && month && day ? `${names[Number(month) - 1] || month} ${day}, ${year}` : String(item.date || '');
        })();
        const size = folder ? '—' : (item.size || '');
        for (const value of [size, type, date]) {
          const cell = S.ctx.util.el('span', 'dim', t, value);
          cell.dataset.details = 'cell';
        }
        t.dataset.detailsRow = 'true';
        return t;
      },
    },
  },
});
