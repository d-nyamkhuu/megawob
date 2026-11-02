// This design keeps the Explorer's seeded project title and Windows-style file table and icons.
(function () {
  'use strict';

  const folder = () =>
    '<svg class="ico" viewBox="0 0 32 30"><defs><linearGradient id="folderGold" x2="0" y2="1"><stop stop-color="#fff4ae"/><stop offset=".48" stop-color="#ffda61"/><stop offset="1" stop-color="#edb32a"/></linearGradient></defs><path d="M3 6Q3 3 6 3H12L16 7H27Q29 7 29 10V25H3Z" fill="#ffe38c" stroke="#d79f27"/><path d="M4 9H29L27 26H3Z" fill="url(#folderGold)" stroke="#ce991d"/><path d="M5 10H28M4 24V11" fill="none" stroke="#fff7c9" stroke-width="1.5"/></svg>';

  const file = (name, cls, S) => {
    const m = /\.(tar\.gz|[A-Za-z0-9]+)$/.exec(name);
    const ext = m ? m[1].toLowerCase() : '';
    const color = S.extColor(name);
    const letter = /xlsx|ods|csv/.test(ext)
      ? 'X'
      : /doc|odt|rtf/.test(ext)
        ? 'W'
        : /ppt|key/.test(ext)
          ? 'P'
          : ext === 'pdf'
            ? '⌁'
            : '';
    return `<svg class="${cls}" viewBox="0 0 24 30"><path d="M6 2h11l5 5v21H6z" fill="#fff" stroke="${color}" stroke-width="1.4" stroke-linejoin="round"/><path d="M17 2v6h5" fill="#d7e9ec" stroke="${color}"/><path d="M9 12h10M9 16h10M9 20h10M9 24h10" stroke="${color}" opacity=".45"/>${letter ? `<rect x="1" y="9" width="14" height="16" rx="1" fill="${color}"/><path d="M2 10h12" stroke="#fff" opacity=".6"/><text x="8" y="22" text-anchor="middle" fill="#fff" font-family="Arial" font-size="13" font-weight="bold">${letter}</text>` : ''}</svg>`;
  };

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-tree-03',
    name: 'design',
    split: 'train',
    scenarios: ['tree'],
    template: 'use-desktop-tools/workspace',
    design: {
      explorerTitle: null,
      chev: '<svg class="chev" viewBox="0 0 16 16"><path d="M4 2L12 8 4 14Z" fill="#6489b4" stroke="#446592" stroke-width=".7"/></svg>',
      folder,
      file,
      parts: {
        rowHeight: (base, S) => (T) => Math.round(Math.max(21, T.mainR.height / 16.6)),
        rowIndent: (base, S) => (T, r) => `${3 + r.depth * Math.max(20, T.mainR.width * 0.024)}px`,
        paintPreview: (base, S) => (T, m) => {
          const { util, fam, spec, crumbs, pbody } = T;
          crumbs.replaceChildren();
          pbody.replaceChildren();
          const last = m.clicks[m.clicks.length - 1];
          const live = fam.live(m, spec);
          const selected = live.byId.get(m.sel);
          const folderNode = selected && selected.dir
            ? selected
            : last !== undefined
              ? live.byId.get(live.byId.get(last)?.parent)
              : null;
          const entries = fam.rows(m, spec).filter((r) =>
            folderNode ? live.byId.get(r.id)?.parent === folderNode.id : r.depth === 0,
          );
          crumbs.classList.add('nb-columns');
          ['Name', 'Date modified', 'Type', 'Size'].forEach((text, i) =>
            util.el('span', 'nb-col' + (i === 0 ? ' sorted' : ''), crumbs, text),
          );
          const table = util.el('div', 'nb-file-table', pbody);
          entries.forEach((r) => {
            const row = util.el('div', 'nb-file-row', table);
            row.dataset.id = r.id;
            if (last === r.id) row.dataset.sel = '';
            const nameEl = util.el('span', 'nb-file-name', row);
            nameEl.innerHTML = r.dir ? S.FOLDER(false) : S.FILE(r.name);
            util.el('span', '', nameEl, r.name);
            const hash = [...r.name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
            util.el(
              'span',
              '',
              row,
              `2024-04-${String(1 + (hash % 27)).padStart(2, '0')} ${String(9 + (hash % 9)).padStart(2, '0')}:${String(hash % 60).padStart(2, '0')}`,
            );
            const ext = r.name.split('.').pop().toLowerCase();
            const types = {
              xlsx: 'Microsoft Excel Worksheet',
              ods: 'OpenDocument Spreadsheet',
              docx: 'Microsoft Word Document',
              pdf: 'PDF Document',
              txt: 'Text Document',
              pptx: 'Microsoft PowerPoint Presentation',
            };
            util.el('span', '', row, r.dir ? 'File folder' : types[ext] || `${ext.toUpperCase()} File`);
            util.el('span', '', row, r.dir ? '' : `${1 + (hash % 64)} KB`);
            row.addEventListener('click', () =>
              r.dir
                ? T.commit({ ...fam.toggleFolder(T.ctx.model, spec, r.id, T.ctx.clock()), sel: r.id })
                : T.commit(fam.treeClickFile(T.ctx.model, spec, r.id)),
            );
          });
          const status = document.querySelector('.footer-label');
          if (status) {
            status.replaceChildren();
            status.insertAdjacentHTML('beforeend', S.FOLDER(false));
            util.el('span', '', status, folderNode ? folderNode.name : 'Files');
            util.el('span', 'nb-status-count', status, `${entries.length} items`);
          }
          if (spec.recoverable && last !== undefined) {
            const b = util.el('button', 'at-back', pbody, '← Back');
            b.type = 'button';
            b.dataset.role = 'back';
            b.addEventListener('click', () => T.commit(fam.treeBack(T.ctx.model, spec)));
          }
        },
      },
    },
  });
})();
