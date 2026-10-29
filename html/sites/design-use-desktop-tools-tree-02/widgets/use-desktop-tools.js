// Classic use-file-manager frame, illustrated icons, and the site's tree preview copy.
(function () {
  'use strict';

  const FILE = (name, cls, S) => {
    const m = /\.(tar\.gz|[A-Za-z0-9]+)$/.exec(name);
    const ext = m ? m[1].toLowerCase() : '';
    const color = S.extColor(name);
    const detail = /^(png|jpg|gif|svg|webp)$/.test(ext)
      ? '<rect x="12" y="12" width="43" height="48" fill="#8e8dbd"/><circle cx="23" cy="24" r="4" fill="#555586"/><circle cx="46" cy="22" r="4" fill="#555586"/><path d="M14 55L28 35 39 47 45 37 54 55Z" fill="#565586"/>'
      : /^(csv|xlsx|ods)$/.test(ext)
        ? '<rect x="13" y="15" width="40" height="43" fill="#a4a2cf" stroke="#61618b" stroke-width="2"/><path d="M13 23H53M13 31H53M13 39H53M13 47H53M26 23V58M40 23V58" stroke="#66668e" stroke-width="1.5"/>'
        : '<path d="M13 12H44" stroke="#9695bd" stroke-width="6"/><path d="M12 23H50M12 27H50M12 31H50M12 35H50M12 39H50M12 45H50M12 51H50M12 57H32" stroke="#8d8db2" stroke-width="2"/>';
    return `<svg class="${cls}" viewBox="0 0 68 74"><path d="M4 3H48L62 17V70H4Z" fill="#c9cdd6" stroke="#30315b" stroke-width="2"/><path d="M6 68V5H47" fill="none" stroke="#f0edf9" stroke-width="3"/><path d="M48 3V17H62" fill="#acabd0" stroke="#35355c" stroke-width="1.5"/>${detail}</svg>`;
  };

  const FILEMAN_GLYPHS = {
    Back: '<path d="M8 20L23 7V15H37V26H23V34Z"/>',
    Forward: '<path d="M36 20L21 7V15H7V26H21V34Z"/>',
    Up: '<path d="M22 4L5 21H16V37H28V21H39Z"/>',
    Home: '<path d="M4 20L22 5 40 20H34V37H10V20Z"/>',
    Reload: '<path d="M33 12L31 4 39 14 27 17 30 12C15 8 8 19 15 29 23 37 34 31 35 23H41C40 39 20 44 10 32 0 18 12 3 33 12Z"/>',
    Views: '<rect x="5" y="5" width="34" height="34"/><path d="M15 9V35M25 9V35M9 15H35M9 25H35" fill="none" stroke="#373861" stroke-width="3"/>',
    'New Folder': '<path d="M4 8H19L24 14H39V37H4Z"/><path d="M21 21V32M16 26H27" fill="none" stroke="#c6c3e8" stroke-width="3"/>',
  };

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-tree-02',
    name: 'design',
    split: 'train',
    scenarios: ['tree'],
    template: 'use-desktop-tools/workspace',
    design: {
      chev: (S) => S.svg('<path d="M4 2L12 8 4 14Z" fill="#939ba3" stroke="#202630"/><path d="M5 3L10 8" stroke="#e8e9ed"/>', 16, 'class="chev"'),
      folder: () => '<svg class="ico" viewBox="0 0 80 72"><path d="M3 5H28L35 11H65V17H76V68H3Z" fill="#8281b3" stroke="#25264c" stroke-width="2"/><path d="M4 6H28L34 12H65M5 17H73M5 7V64" fill="none" stroke="#e1dffb" stroke-width="3"/><path d="M6 19H72V64H6Z" fill="#9291c2"/><path d="M73 18V66H6" fill="none" stroke="#53527e" stroke-width="4"/><path d="M7 20V61" stroke="#b8b6df" stroke-width="2"/></svg>',
      file: FILE,
      explorerTitle: 'Project Files',
      rowRange: [21, 27],
      parts: {
        afterTitle: (base) => (F) => {
          const { util } = F.ctx;
          util.el('span', 'sg-maximize', F.title, '▣');
          const mb = util.el('div', 'sg-menu', F.win);
          for (const t of ['File', 'Edit', 'View', 'Go', 'Bookmarks']) util.el('span', '', mb, t);
          util.el('span', 'sg-help', mb, 'Help');
          const tb = util.el('div', 'sg-tools', F.win);
          for (const t of ['Back', 'Forward', 'Up', 'Home', 'Reload', 'Views', 'New Folder']) {
            const b = util.el('span', 'sg-tool' + (t === 'Forward' ? ' off' : ''), tb);
            b.innerHTML = '<svg viewBox="0 0 44 44"><defs><linearGradient id="sg-tool-shade" x2=".8" y2="1"><stop stop-color="#c8c6e9"/><stop offset=".4" stop-color="#9794c5"/><stop offset="1" stop-color="#615e94"/></linearGradient></defs><g fill="url(#sg-tool-shade)" stroke="#35355b" stroke-width="2">' + FILEMAN_GLYPHS[t] + '</g></svg><span>' + t + '</span>';
          }
          const loc = util.el('div', 'sg-loc', F.win);
          util.el('span', '', loc, 'Location:');
          util.el('div', 'sg-path', loc, '/');
          base(F);
        },
        previewEmpty: (base, S) => (T, m) => {
          const { ctx, util, spec, fam, pbody } = T;
          const L = fam.live(m, spec);
          const selected = L.byId.get(m.sel);
          const folder = selected && selected.dir ? selected : null;
          const rows = fam.rows(m, spec);
          const items = folder
            ? (L.kids.get(folder.id) || []).map((n) => (typeof n === 'object' ? n : L.byId.get(n))).filter(Boolean)
            : rows.filter((n) => n.depth === 0).map((n) => L.byId.get(n.id)).filter(Boolean);
          const path = [];
          for (let n = folder; n; n = L.byId.get(n.parent)) path.unshift(n.name);
          const loc = T.main.closest('.at-win').querySelector('.sg-path');
          if (loc) loc.textContent = '/' + path.join('/');
          const grid = util.el('div', 'sg-file-grid', pbody);
          if (folder && fam.isOpen(m, folder.id) && !fam.isLoaded(m, spec, folder.id)) {
            util.el('span', 'sg-loading', grid, 'Loading…');
            return;
          }
          let fileRow = false;
          for (const n of items) {
            const item = util.el('button', 'sg-file-item', grid);
            if (!n.dir && !fileRow) {
              item.style.gridColumn = '1';
              fileRow = true;
            }
            item.type = 'button';
            item.innerHTML = n.dir ? S.FOLDER(false) : S.FILE(n.name);
            util.el('span', '', item, n.name);
            item.addEventListener('click', () =>
              n.dir
                ? T.commit({ ...fam.toggleFolder(ctx.model, spec, n.id, ctx.clock()), sel: n.id })
                : T.commit(fam.treeClickFile(ctx.model, spec, n.id)),
            );
          }
          const status = document.querySelector('.footer-label');
          const dirs = items.filter((n) => n.dir).length;
          if (status) status.textContent = `${items.length} items  |  ${dirs} folders, ${items.length - dirs} files`;
        },
      },
    },
  });
})();
