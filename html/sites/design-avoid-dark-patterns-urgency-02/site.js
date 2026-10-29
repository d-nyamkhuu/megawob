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
        util.el('strong', '', brand, '❧　Lodgewren');
        util.el('b', '', brand, '');
        util.el('small', '', brand, 'Hotels　•　 Inns　•　 Unique Stays');
        brand.dataset.role = 'brand';
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const item of ['⌕　 Search', 'My Trips', 'Favourites', 'Help', '⚙']) {
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
        util.el('h2', '', side, 'Stays in Lakeshire');
        util.el('small', 'hotel-count', side, '27 results');
        const hotels = [
          ['🏨', 'Willowmere Suites', '★★★★★　(842)', '£89'],
          ['⌂', 'Pineview Hotel', '★★★★☆　(417)', '£76'],
          ['⌂', 'Lakeside Inn', '★★★★☆　(308)', '£82'],
          ['⌂', 'Maple Grove Resort', '★★★★☆　(269)', '£95'],
          ['⌂', 'The Beacon', '★★★★★　(521)', '£88'],
          ['⌂', 'Riverside Lodge', '★★★★☆　(310)', '£79'],
          ['⌂', 'Oakwood House', '★★★★☆　(188)', '£67'],
        ];
        for (const [icon, title, detail, price] of hotels) {
          const row = util.el('div', 'ref-help-row', side);
          util.el('b', 'hotel-thumb', row, icon);
          const copy = util.el('div', 'hotel-copy', row);
          util.el('strong', '', copy, title);
          util.el('span', '', copy, detail);
          util.el('em', '', copy, `from ${price} / night`);
        }
        util.el('hr', '', side);
        util.el('h3', '', side, 'Popular nearby');
        util.el('a', '', side, 'Hotels with lake views');
        util.el('a', '', side, 'Country house stays');
        Object.assign(_c, { body, hotels, side });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-avoid-dark-patterns-urgency-02',
    template: 'site/base',
    design: { parts },
  });
})();
