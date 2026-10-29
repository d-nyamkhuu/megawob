// GEM mail with compact rows, a stacked message view, and a floating tool palette.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-02',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      style: 'gem',
      rowHeight: 34,
      stack: true,
      folderList: ['inbox', 'starred', 'important', 'archive', 'trash'],
      parts: {
        snapped: (base, S) => () => {
          base();
          const palette = S.el('div', 'gem-palette', S.els.root);
          for (const [label, ic] of [
            ['New', 'new'],
            ['Open', 'move'],
            ['Save', 'archive'],
            ['Print', 'file'],
            ['Delete', 'delete'],
          ])
            S.button(palette, label, null, null, ic);
        },
      },
    },
  });
})();
