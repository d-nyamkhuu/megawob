// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base) => function (_c) {
      base(_c);
      const { body, stage, util } = _c;
      const area = util.el('div', 'ref-explorer-area', body);
      body.insertBefore(area, stage);
      util.el('aside', 'ref-places', area, '▣\nPlaces\n\n▰\nFiles\n\n⌕\nSearch\n\n▱\nDevices');
      area.appendChild(stage);
      util.el('aside', 'ref-tips', area,
        '💡  Tips\n───────────────────\nYou can:\n\n• Double-click a file to open it\n\n• Select multiple files with Ctrl+click or Shift+click\n\n• Drag and drop files to move them to a folder\n\n• Right-click for more options\n\n• Use Undo to restore deleted files');
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, navDraw, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        // Keep the legacy seeded draw in place, while presenting the reference app's tabs.
        if (navDraw) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Files', 'Recents', 'Shared', 'Favorites']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
  };

  env.site({
    name: 'design-use-file-manager-select-04',
    template: 'site/base',
    design: { parts },
  });
})();
