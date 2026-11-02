// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Aurora Office'];

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const windowTitle = util.el('div', 'metro-titlebar', document.body);
      util.el('span', 'metro-word-icon', windowTitle, 'W');
      util.el('span', '', windowTitle, 'Project Plan Draft.docx - Word');
      util.el('span', 'metro-window-actions', windowTitle, '−　□　×');
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, windowTitle });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, '✦  Aurora Office');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const labels = ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Table', 'Review', 'View', 'Help'];
        for (const [i, label] of labels.entries()) {
          const a = util.el('a', 'ref-navlink', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const search = util.el('div', 'ref-search', headerTools);
      util.el('span', 'ref-search-icon', search, '⌕');
      util.el('span', 'ref-search-label', search, '');
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const ribbon = util.el('div', 'metro-ribbon', document.body);
      const groups = [
        ['✓', 'Spelling &\nGrammar'], ['▤', 'Thesaurus'], ['123', 'Word Count'],
        ['＋', 'New Comment'], ['×', 'Delete'], ['←', 'Previous'], ['→', 'Next'],
        ['▤', 'Track Changes'], ['▾', 'All Markup'], ['⌄', 'Show Markup'], ['☷', 'Reviewing Pane'],
        ['✓', 'Accept'], ['×', 'Reject'], ['←', 'Previous'], ['→', 'Next'], ['▤', 'Compare']
      ];
      for (const [icon, label] of groups) {
        const item = util.el('div', 'metro-ribbon-item', ribbon);
        util.el('span', 'metro-ribbon-icon', item, icon);
        util.el('span', 'metro-ribbon-label', item, label);
      }
      Object.assign(_c, { groups, headerTools, ribbon, search, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-slides-trackchanges-02',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
