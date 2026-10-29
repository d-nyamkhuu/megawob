// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const workspace = util.el('div', 'wb-workspace', body);
      const stage = util.el('main', 'ref-stage', workspace);
      S.frameAlign(_c, stage);
      const workbenchTools = util.el('div', 'wb-toolbar', workspace);
      for (const [icon, label] of [['◀', 'Back'], ['▶', 'Forward'], ['▲', 'Up'], ['✂', 'Cut'], ['▣', 'Copy'], ['▤', 'Paste'], ['▥', 'Delete'], ['↶', 'Undo']]) {
        const gadget = util.el('div', 'wb-gadget', workbenchTools);
        util.el('span', 'wb-gadget-icon', gadget, icon);
        util.el('span', 'wb-gadget-label', gadget, label);
      }
      const summary = util.el('aside', 'wb-summary', body);
      util.el('div', 'wb-summary-title', summary, 'Folder Information');
      const folder = util.el('div', 'wb-summary-folder', summary);
      util.el('span', 'wb-summary-folder-icon', folder, '📁');
      util.el('strong', '', folder, 'Current folder');
      for (const [label, value] of [['Type', 'Directory'], ['Location', 'Current path'], ['Size', 'Folder contents'], ['Modified', '—']]) {
        const row = util.el('div', 'wb-summary-row', summary);
        util.el('span', '', row, `${label}:`);
        util.el('span', '', row, value);
      }
      util.el('div', 'wb-summary-title wb-summary-subtitle', summary, 'Contents by Type');
      for (const [icon, label] of [['▤', 'Spreadsheets'], ['▤', 'Documents'], ['▧', 'Presentations'], ['▧', 'Images'], ['◉', 'Other']]) {
        const row = util.el('div', 'wb-summary-kind', summary);
        util.el('span', 'wb-summary-kind-icon', row, icon);
        util.el('span', '', row, label);
      }
      util.el('div', 'wb-summary-title wb-summary-subtitle', summary, 'Disk Information');
      for (const label of ['Local volume', 'Used space', 'Free space']) util.el('div', 'wb-summary-disk', summary, label);
      Object.assign(_c, { folder, stage, summary, workbenchTools });
    },
  };

  env.site({
    name: 'design-use-file-manager-select-02',
    template: 'site/base',
    design: { parts },
  });
})();
