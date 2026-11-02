// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = rng.bool(0.35);
      const sidebar = true;
      const navDraw = rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const sampledBrand = word ? word(lr.pick(K.brand)) : title;
        const brand = util.el('div', 'ref-brand', header, word ? sampledBrand : 'Community Services Manager');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const referenceNav = ['Home', 'Adoptions', 'People', 'Reports', 'Settings'];
        for (const [i, sampled] of sampledNav.entries()) {
          const item = word ? sampled : referenceNav[i] || sampled;
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
        const section = (title) => {
          const box = util.el('section', 'record-summary', side);
          util.el('h2', '', box, title);
          return box;
        };
        const row = (parent, label, value, cls) => {
          const line = util.el('div', `summary-row ${cls || ''}`.trim(), parent);
          util.el('span', '', line, label);
          if (value) util.el('span', '', line, value);
        };
        const records = section('Adoption Records');
        row(records, '▤  All Records', '142', 'selected');
        row(records, '▤  Pending', '28');
        row(records, '▤  Approved', '88');
        row(records, '▤  Closed', '26');
        const activity = section('Recent Activity');
        row(activity, '2024-07-12  Added record', '#A-4102');
        row(activity, '2024-07-10  Updated record', '#A-4098');
        row(activity, '2024-07-08  Approved record', '#A-4091');
        row(activity, '2024-07-04  Added record', '#A-4087');
        row(activity, '2024-07-01  Updated record', '#A-4083');
        const status = section('Status');
        row(status, 'Open records:', '28');
        row(status, 'Approved records:', '88');
        row(status, 'Closed records:', '26');
        row(status, 'Last updated:', '2024-07-12  14:32', 'last-update');
      }
      Object.assign(_c, { body });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-complete-goals-booking-01',
    template: 'site/base',
    design: { parts },
  });
})();
