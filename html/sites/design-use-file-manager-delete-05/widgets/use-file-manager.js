// Design on the shared use-file-manager/explorer template.
const xpSvg = (body, cls = '') => `<svg class="${cls}" viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gold" x2="0" y2="1"><stop stop-color="#fff4a4"/><stop offset="1" stop-color="#efbd39"/></linearGradient><linearGradient id="green" x2="0" y2="1"><stop stop-color="#a4eb74"/><stop offset=".5" stop-color="#40bf16"/><stop offset="1" stop-color="#058500"/></linearGradient><linearGradient id="gray" x2="0" y2="1"><stop stop-color="#e9edf0"/><stop offset="1" stop-color="#929da5"/></linearGradient></defs>${body}</svg>`;
const xpFolder = '<path d="M3 8V5h10l3 3h12v20H3z" fill="#f9df79" stroke="#b28a37"/><path d="M3 12h26l-3 16H3z" fill="url(#gold)" stroke="#ac8633"/><path d="M5 13h22" stroke="white"/>';
const xpIcons = {
  back: xpSvg('<circle cx="16" cy="16" r="14" fill="url(#green)" stroke="#43852c"/><path d="M18 8l-8 8 8 8M10 16h15" fill="none" stroke="white" stroke-width="3"/>'),
  forward: xpSvg('<circle cx="16" cy="16" r="14" fill="url(#gray)" stroke="#a1a7ab"/><path d="M14 8l8 8-8 8M22 16H7" fill="none" stroke="white" stroke-width="3"/>'),
  up: xpSvg(xpFolder + '<path d="M17 27v-9h-4l7-7 7 7h-4v9z" fill="#80c1ec" stroke="#4986a3"/><path d="M20 24v-8" stroke="white" stroke-width="2"/>'),
  folder: xpSvg(xpFolder),
  copy: xpSvg('<path d="M3 2h14l7 7v20H3z" fill="white" stroke="#225fa7"/><path d="M17 2v7h7M6 12h14M6 16h14M6 20h14M6 24h14" fill="none" stroke="#4180bb"/><path d="M11 8h13l6 6v17H11z" fill="#f8fcff" stroke="#225fa7"/><path d="M24 8v6h6M14 17h13M14 21h13M14 25h13M14 28h13" fill="none" stroke="#4180bb"/>'),
  cut: xpSvg('<path d="M9 3l15 22M23 3L9 25" stroke="#8aa4b6" stroke-width="3"/><path d="M10 4l6 12 6-12" fill="none" stroke="#337dac"/><circle cx="9" cy="26" r="4" fill="none" stroke="#267aaa" stroke-width="2.5"/><circle cx="24" cy="26" r="4" fill="none" stroke="#267aaa" stroke-width="2.5"/>'),
  paste: xpSvg('<rect x="5" y="5" width="21" height="25" rx="1" fill="#edc97e" stroke="#a48857"/><path d="M10 7V3h4V1h5v2h4v5z" fill="#d9e1e6" stroke="#8595a1"/><path d="M14 13h15v18H14z" fill="white" stroke="#2974b3"/><path d="M17 17h9M17 21h9M17 25h9M17 28h9" stroke="#5d97bf"/>'),
  delete: xpSvg('<path d="M5 5l23 23M27 4L5 28" stroke="#960b0e" stroke-width="3"/><path d="M4 3l23 23M26 3L4 27" stroke="#ed232b" stroke-width="2.5"/>'),
  views: xpSvg('<path d="M2 4h28v25H2z" fill="#f8fcff" stroke="#175a98" stroke-width="1.5"/><path d="M4 6h24v3H4z" fill="#4086b9"/><path d="M6 13h5v4H6zM6 21h5v4H6z" fill="#69a4c7" stroke="#235d8a"/><path d="M14 13h11M14 16h11M14 21h11M14 24h11" stroke="#235d8a"/>'),
  share: xpSvg('<circle cx="9" cy="16" r="6" fill="#acd1ee" stroke="#2b7aaf"/><path d="M15 21h11v8H10v-5" fill="#f5df8c" stroke="#af8d38"/><path d="M16 13l8-8v5h6v8h-6v5z" fill="#6fb547" stroke="#4a8930"/>'),
  undo: xpSvg('<path d="M12 5L2 14l11 8v-6c13-5 15 3 9 11 15-10 7-24-10-16z" fill="url(#green)" stroke="#43852c"/>'),
  computer: xpSvg('<rect x="5" y="2" width="22" height="22" rx="2" fill="#b8c4d4" stroke="#456a91"/><path d="M8 5h16v15H8z" fill="#219de0" stroke="#fff"/><path d="M10 7h10l-10 9" fill="#6ad4f0"/><path d="M13 24h7v4h6v3H6v-3h7z" fill="#a8a6ad" stroke="#746d7a"/>'),
};
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-delete-05',
  name: 'design',
  split: 'train',
  scenarios: ['delete'],
  template: 'use-file-manager/explorer',
  design: {
    fontSize: 16,
    nameFontSize: 16,
    detailFontSize: 16,
    controlFont: '16px Georgia, "Times New Roman", serif',
    windowRadius: 0,
    margin: 0,
    titleHeight: 0,
    toolbarHeight: 54,
    statusHeight: 52,
    treeIndent: 28,
    listHeadings: ['Name', 'Date Modified', 'Type', 'Size'],
    separators: ['›'],
    folderTone: '#f2b52f',
    parts: {
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const { bar, crumbs, backBtn, upBtn, trashBtn, undoBtn } = S.els;
        backBtn.innerHTML = xpIcons.back;
        upBtn.innerHTML = xpIcons.up;
        trashBtn.innerHTML = xpIcons.delete;
        undoBtn.innerHTML = xpIcons.undo;
        S.ctx.util.el('span', '', undoBtn, 'Undo');
        const add = (key, label, before) => {
          const b = S.ctx.util.el('button', `fm-ib xp-tool xp-${key}`, bar);
          b.type = 'button'; b.title = label; b.innerHTML = xpIcons[key];
          S.ctx.util.el('span', '', b, label);
          b.addEventListener('click', () => ctx.log('decoy', { label }));
          if (before) bar.insertBefore(b, before);
          return b;
        };
        add('forward', 'Forward', upBtn);
        for (const [key, label] of [['folder','New Folder'],['copy','Copy'],['cut','Cut'],['paste','Paste']]) add(key, label, trashBtn);
        for (const b of bar.querySelectorAll('[title="Change view"]')) { b.innerHTML = xpIcons.views; S.ctx.util.el('span', '', b, 'Views'); }
        if (!bar.querySelector('[title="Change view"]')) {
          const views = add('views', 'Views');
          views.title = 'Change view';
        }
        for (const b of bar.querySelectorAll('[title="Share"]')) b.innerHTML = xpIcons.share;
        [...bar.children].filter(b => b !== crumbs && b !== undoBtn).forEach((b, index) => b.style.setProperty('order', index, 'important'));
        undoBtn.style.setProperty('order', 20, 'important');
        const row = S.ctx.util.el('div', 'fm-crumbrow', bar.parentNode);
        bar.after(row);
        row.appendChild(crumbs);
      },
      body: (base, S) => (ctx) => {
        base(ctx);
        S.els.main.prepend(S.els.win.querySelector('.fm-crumbrow'));
      },
      folderSvg: () => (_size, cls = 'fi') => xpSvg(xpFolder, cls),
      fileSvg: (base) => (kind, extension, size) => {
        const ext = String(extension || '').toLowerCase().replace(/^\./, '');
        let art;
        if (/png|jpg|jpeg|gif|webp|bmp/.test(ext)) art = '<path d="M7 13h18v15H7z" fill="#77b5d5"/><path d="M7 25l6-9 5 6 3-4 4 7v3H7z" fill="#187597"/><circle cx="21" cy="16" r="2" fill="#dae6a2"/>';
        else if (/svg|ai|eps/.test(ext)) art = '<g fill="#ffce1b" stroke="#f3940a" stroke-width="1.2"><ellipse cx="16" cy="22" rx="3" ry="9"/><ellipse cx="16" cy="22" rx="9" ry="3"/><ellipse cx="16" cy="22" rx="3" ry="9" transform="rotate(45 16 22)"/><ellipse cx="16" cy="22" rx="3" ry="9" transform="rotate(-45 16 22)"/></g><circle cx="16" cy="22" r="3" fill="#f48d0d"/>';
        else if (/xlsx|xls|csv/.test(ext)) art = '<path d="M14 12h14v17H14z" fill="white" stroke="#14713e"/><path d="M17 15h9M17 19h9M17 23h9M20 13v14M24 13v14" stroke="#31925b"/><path d="M2 10l14-3v25L2 29z" fill="#08763d"/><path d="M5 15l7 11M12 14L5 25" stroke="white" stroke-width="2"/>';
        else if (ext === 'pdf') art = '<path d="M9 27c14-15 5-21 5-14s4 13 11 11-9-8-16 3z" fill="none" stroke="#d40a16" stroke-width="1.6"/>';
        else if (ext === 'md') art = '<rect x="3" y="15" width="26" height="15" rx="1" fill="white" stroke="#555"/><path d="M6 27V18l4 5 4-5v9M21 18v8m-4-3l4 4 4-4" fill="none" stroke="#222" stroke-width="2.5"/>';
        else if (/txt|rtf|doc|docx/.test(ext)) art = '<path d="M7 12h16M7 16h16M7 20h16M7 24h16M7 28h13" stroke="#6d9bb8" stroke-width="1.3"/>';
        else return base(kind, extension, size);
        return xpSvg(`<path d="M5 2h15l7 7v22H5z" fill="#fafcfe" stroke="${ext === 'pdf' ? '#c20d1b' : '#4578a5'}" stroke-width="1.4"/><path d="M20 2v7h7" fill="#dbe9f4" stroke="#4578a5"/>${art}`);
      },
      treeRow: (base, S) => (model, folder, depth, children, over) => {
        const result = base(model, folder, depth, children, over);
        result.row.style.setProperty('--depth', depth);
        result.row.style.paddingLeft = `calc((18 + ${depth} * 30) * var(--xp))`;
        result.chev.replaceChildren();
        result.chev.textContent = children.length ? (model.expanded.includes(folder.id) ? '−' : '+') : '';
        result.chev.classList.toggle('xp-leaf', !children.length);
        for (let level = 0; level < depth; level++) {
          const line = S.ctx.util.el('i', 'xp-branch', result.row);
          line.style.left = `calc((25 + ${level} * 30) * var(--xp))`;
        }
        return result;
      },
      status: (base, S) => (ctx) => {
        base(ctx);
        const summary = ctx.util.el('div', 'xp-summary', S.els.status);
        ctx.util.el('span', 'xp-bytes', summary);
        const computer = ctx.util.el('span', 'xp-computer', summary);
        computer.innerHTML = xpIcons.computer;
        ctx.util.el('span', '', computer, 'My Computer');
      },
      drawStatus: (base, S) => (model) => {
        base(model);
        const sum = S.els.status.querySelector('.xp-bytes');
        if (sum) {
          const values = [...S.els.pane.querySelectorAll('.fm-row > .dim:last-child')].map(e => e.textContent);
          const bytes = values.reduce((n, s) => n + (parseFloat(s.replace(/,/g, '')) || 0) * (/GB/i.test(s) ? 1048576 : /MB/i.test(s) ? 1024 : 1), 0);
          sum.textContent = bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} MB` : `${Math.round(bytes)} KB`;
        }
      },
      buildMain: (base, S) => (model) => {
        base(model);
        const { pane } = S.els;
        if (S.spec.view !== 'list') {
          const head = S.ctx.util.el('div', 'fm-lhead fm-paper-head', pane);
          for (const label of ['Name', 'Size', 'Type', 'Date Modified']) S.ctx.util.el('span', '', head, label);
          pane.prepend(head);
        }
        const headings = pane.querySelector('.fm-lhead');
        if (headings) {
          headings.replaceChildren();
          ['Name', 'Size', 'Type', 'Date Modified'].forEach((label, index) => {
            const cell = S.ctx.util.el('span', '', headings, label);
            cell.style.setProperty('grid-column', index + 1, 'important');
            cell.style.setProperty('justify-content', index === 1 ? 'flex-end' : 'flex-start', 'important');
          });
        }
      },
      tile: (_base, S) => (model, id, _height, _icon, _lines, box) => S.P.row(model, id, box),
    },
  },
});
