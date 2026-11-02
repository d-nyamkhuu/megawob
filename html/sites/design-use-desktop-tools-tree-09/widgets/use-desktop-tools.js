// RISC OS file browser design: custom Explorer frame, dense tree rows, and a file details table.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-tree-09',
  name: 'design',
  split: 'train',
  scenarios: ['tree'],
  template: 'use-desktop-tools/workspace',
  design: {
    rowRange: [21, 27],
    folder: (open) => open
      ? '<svg class="ico" viewBox="0 0 20 20"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3.6l1.6 1.6h7.8A1.5 1.5 0 0 1 18 7.1v8.4a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 15.5z" fill="#f2c94c"/><path d="M3 7h14" stroke="#148db1" stroke-opacity=".3"/></svg>'
      : '<svg class="ico" viewBox="0 0 20 20"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3.6l1.6 1.6h7.8A1.5 1.5 0 0 1 18 7.1v8.4a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 15.5z" fill="#e8b43a"/></svg>',
    file: (name, cls) => {
      const m = /\.(tar\.gz|[A-Za-z0-9]+)$/.exec(name);
      const sheet = m && /^(xlsx|ods|csv)$/i.test(m[1]);
      return `<svg class="${cls}" viewBox="0 0 24 30"><path d="M5 1h11l7 7v21H5z" fill="${sheet ? '#9cdec9' : '#f1f0e9'}" stroke="${sheet ? '#087a61' : '#507484'}" stroke-width="1.7" stroke-linejoin="round"/><path d="M16 1v7h7M9 12h10M9 16h10M9 20h10M9 24h10" fill="none" stroke="${sheet ? '#087a61' : '#507484'}" stroke-width="1.4"/>${sheet ? '<rect x="0" y="8" width="12" height="19" rx="1" fill="#087a61"/><path d="m3 13 6 10m0-10-6 10" stroke="#d1f0e2" stroke-width="1.4"/>' : ''}</svg>`;
    },
    parts: {
      explorerHead: (base, S) => (T) => {
        // Keep the original project-name draw, even though this design replaces the visible heading.
        T.ctx.rng.pick(S.PROJECTS);
        T.head.classList.add('rs-breadcrumb');
        T.head.replaceChildren();
        const arrows = T.util.el('span', 'rs-arrows', T.head);
        arrows.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5m7-7-7 7 7 7"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';
        const home = T.util.el('span', 'rs-home', T.head);
        home.innerHTML = S.FOLDER(true);
        T.util.el('b', '', home, 'My Files');
        const search = T.util.el('div', 'rs-search', T.head);
        search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/></svg>';
        T.util.el('span', '', search, 'Search files...');
      },
      rowsLead: (base, S) => (T) => {
        const root = T.util.el('div', 'rs-tree-root');
        root.innerHTML = S.CHEV + S.FOLDER(false);
        T.util.el('span', '', root, 'My Files');
        return [root];
      },
      rowIndent: (base) => (T, r) => `${6 + (r.depth + 1) * (T.mainR.width >= 900 ? 27 : 18)}px`,
      previewPane: (base) => (T) => {
        base(T);
        T.pbody.classList.add('rs-file-body');
      },
      previewBody: (base, S) => (T, m) => {
        const { util, fam, spec } = T;
        for (const label of ['Name  ▴', 'Size', 'Type', 'Date Modified']) util.el('span', '', T.crumbs, label);
        const table = util.el('div', 'rs-file-table', T.pbody);
        for (const r of fam.rows(m, spec)) {
          const tr = util.el('div', 'rs-file-row', table);
          tr.dataset.id = r.id;
          if (m.clicks.includes(r.id) || m.sel === r.id) tr.dataset.sel = '';
          const name = util.el('div', 'rs-file-name', tr);
          name.innerHTML = r.dir ? S.FOLDER(fam.isOpen(m, r.id)) : S.FILE(r.name);
          util.el('span', '', name, r.name);
          const hash = [...r.name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
          util.el('span', '', tr, r.dir ? '—' : `${2 + (hash % 28)} KB`);
          util.el('span', '', tr, r.dir ? 'Folder' : `${r.name.split('.').pop().toUpperCase()} File`);
          util.el('span', '', tr, `Feb ${String(1 + (hash % 28)).padStart(2, '0')}, 2015`);
          tr.addEventListener('click', () => {
            if (r.dir) T.commit({ ...fam.toggleFolder(T.ctx.model, spec, r.id, T.ctx.clock()), sel: r.id });
            else T.commit(fam.treeClickFile(T.ctx.model, spec, r.id));
          });
        }
        const last = m.clicks[m.clicks.length - 1];
        const details = document.querySelector('.rs-det');
        const detailName = details && details.querySelector('b');
        const detailCopy = details && details.querySelector('span');
        if (last === undefined) {
          if (detailName) detailName.textContent = 'No file selected';
          if (detailCopy) detailCopy.textContent = 'Select a file to see details here.';
          return;
        }
        const selected = fam.live(m, spec).byId.get(last);
        if (detailName && selected) detailName.textContent = selected.name;
        if (detailCopy && selected) detailCopy.textContent = `${selected.name.split('.').pop().toUpperCase()} File`;
        if (spec.recoverable) {
          const b = util.el('button', 'at-back', T.pbody, '← Back');
          b.type = 'button';
          b.dataset.role = 'back';
          b.addEventListener('click', () => T.commit(fam.treeBack(T.ctx.model, spec)));
        }
      },
    },
  },
});
