// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Countries'];

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      rng.bool(0.35);
      const sidebar = true;
      rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.nav': (base, S) => function (_c) {
      const { header, nav, util } = _c;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Collections', 'Items', 'Categories', 'Locations', 'Notes']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      let side = null;
      if (sidebar) {
        side = util.el('aside', 'ref-side', body);
        local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        for (const item of ['All Collections', 'Electronics', 'Home & Living', 'Office Supplies', 'Tools & Hardware', 'Pet Care', 'Hobbies', 'Other']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body, side });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      if (_c.display === 'panel' && _c.side) {
        _c.side.prepend(_c.body.lastElementChild);
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('h2', '', inspector, 'Collection Properties');
      const props = util.el('div', 'ref-properties', inspector);
      for (const [label, value] of [['Name:', 'Home Essentials'], ['Category:', 'Home & Living'], ['Item count:', '7']]) {
        const row = util.el('div', 'ref-property', props);
        util.el('span', '', row, label);
        util.el('strong', '', row, value);
      }
      const dates = util.el('div', 'ref-properties ref-dates', inspector);
      for (const [label, value] of [['Created:', 'Mar 14, 2011'], ['Modified:', 'Mar 14, 2011']]) {
        const row = util.el('div', 'ref-property', dates);
        util.el('span', '', row, label);
        util.el('strong', '', row, value);
      }
      util.el('div', 'ref-description-label', inspector, 'Description:');
      util.el('div', 'ref-description', inspector, 'Items for home, office and everyday use.');
      Object.assign(_c, { dates, inspector, props, stage });
    },
  };

  env.site({
    name: 'design-transfer-items-move-04',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
