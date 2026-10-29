// Lime tree design with viewport-scaled rows and a live path in the empty preview.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-tree-05',
    name: 'design',
    split: 'train',
    scenarios: ['tree'],
    template: 'use-desktop-tools/workspace',
    design: {
      chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="chev"><path d="M5 2L13 8L5 14Z"/></svg>',
      folder: () => '<svg class="ico" viewBox="0 0 20 20"><path d="M1.5 4.5A1.5 1.5 0 0 1 3 3h4l2 2h8A1.5 1.5 0 0 1 18.5 6.5v10A1.5 1.5 0 0 1 17 18H3a1.5 1.5 0 0 1-1.5-1.5z" fill="#c5fa4d"/></svg>',
      file: (name, cls, S) => {
        const color = S.extColor(name);
        return `<svg class="${cls}" viewBox="0 0 20 20"><path d="M4 1.5h8l5 5v12H4z" fill="color-mix(in srgb, ${color} 14%, transparent)" stroke="${color}" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 1.5V6.5h5" fill="none" stroke="${color}" stroke-width="1.3"/></svg>`;
      },
      parts: {
        explorerHead: (base, S) => (T) => {
          T.ctx.rng.pick(S.PROJECTS);
          T.util.el('span', '', T.head, 'Project files');
        },
        rowHeight: (base) => (T) => Math.round(Math.min(35, Math.max(24, T.mainR.height * 35 / 577))),
        rowIndent: () => (T, r) => `calc(6px + ${r.depth} * var(--ind, 18px))`,
        loadIndent: () => (T, r) => `calc(26px + ${r.depth + 1} * var(--ind, 18px))`,
        previewEmpty: (base, S) => (T) => {
          const { util } = T;
          const L = T.fam.live(T.ctx.model, T.spec);
          const openDirs = T.fam.rows(T.ctx.model, T.spec).filter((r) => r.dir && T.fam.isOpen(T.ctx.model, r.id));
          const current = openDirs.sort((a, b) => b.depth - a.depth)[0];
          const path = [];
          for (let n = current && L.byId.get(current.id); n; n = L.byId.get(n.parent)) path.unshift(n.name);
          if (path.length) {
            path.forEach((name, i) => {
              if (i) util.el('span', '', T.crumbs, '›');
              util.el('span', '', T.crumbs, name);
            });
          } else util.el('span', '', T.crumbs, 'Project files');
          const e = util.el('div', 'at-empty', T.pbody);
          e.innerHTML = S.svg(S.ICONS.files);
          util.el('div', '', e, 'Click a file in the Explorer to open it.');
        },
      },
    },
  });
})();
