// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sampledSidebar = roomy && rng.bool(0.35);
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (!word && rng.fork('chrome/next-save').bool(0.7)) label = 'Save';
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sampledSidebar, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const brand = util.el('div', 'ref-brand', header, 'Sales Report Builder');
      brand.dataset.role = 'brand';
      util.el('div', 'header-dots', header);
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sampledSidebar, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        if (sampledSidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const side = util.el('aside', 'ref-side', body);
        util.el('h2', 'ref-side-title', side, 'Columns');
        util.el('p', 'side-intro', side, 'Choose the columns to include in your report. Select one or more items and move them to the other list using the arrow buttons, double-click or drag and drop.');
        util.el('div', 'side-rule', side);
        const tips = util.el('section', 'tips', side);
        util.el('h3', 'tips-title', tips, 'Tips');
        for (const tip of ['Click to select a column.', 'Ctrl+click to select multiple items.', 'Shift+click to select a range of items.', 'Use the arrow buttons to move your selection.', 'You can also double-click an item or drag it to the other list.']) util.el('p', 'tip', tips, tip);
        util.el('div', 'side-dots', side);
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-transfer-items-range-05',
    template: 'site/base',
    design: { parts },
  });
})();
