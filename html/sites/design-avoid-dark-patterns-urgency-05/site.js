// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        if (W >= 1180) rng.bool(0.5);
        const nav = true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header);
        util.el('strong', '', brand, '🌲  Ironwood Games Central');
        brand.dataset.role = 'brand';
        if (nav) {
          const menu = util.el('nav', 'iron-menu', header);
          for (const item of ['File', 'Edit', 'View', 'Go', 'Favorites', 'Tools', 'Help']) {
            const a = util.el('a', '', menu, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'menu', label: item }); });
          }
          const n = util.el('nav', 'ref-nav', header);
          rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const item of ['🏠　Home', '🎮　Games', '▤　News', '♟　Community', '🛒　Store', '▣　Library', '❔　Support']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { brand, header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, rng, sidebar, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        const side = util.el('aside', 'ref-help', body);
        util.el('h2', '', side, '🌲  IRONWOOD GAMES PASS');
        const links = [['🎟️','Subscription'],['💿','Game Library'],['⬇️','Downloads'],['👤','Account Details'],['💳','Payment Methods']];
        for (const [icon, title] of links) {
          const row = util.el('div', 'iron-side-link', side);
          util.el('b', '', row, icon); util.el('span', '', row, title);
        }
        util.el('hr', '', side);
        const detail = util.el('section', 'iron-details', side);
        util.el('h3', '', detail, 'Subscription Details');
        const rows = [['Service:', 'Ironwood Games Pass'], ['Billing:', 'Monthly'], ['Status:', 'Not Subscribed'], ['Next Billing Date:', '—'], ['Payment Method:', 'Not Set']];
        for (const [k,v] of rows) { const row=util.el('div','iron-detail-row',detail); util.el('span','',row,k); util.el('b','',row,v); }
        util.el('div', 'iron-includes', detail, 'Includes:\n　• PC game downloads\n　• Exclusive demos\n　• Member discounts\n　• Online multiplayer\n　• Cancel anytime');
        Object.assign(_c, { body, side });
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.panel': (base, S) =>
      function (_c) {
        base(_c);
        if (_c.display === 'panel') _c.side.prepend(_c.body.lastElementChild);
      },
  };

  env.site({
    name: 'design-avoid-dark-patterns-urgency-05',
    template: 'site/base',
    design: { parts },
  });
})();
