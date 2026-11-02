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
      const sidebarDraw = roomy && rng.bool(0.35);
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        if (display !== 'header' || nav) rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header);
        brand.dataset.role = 'brand';
        util.el('span', 'ref-pine-mark', brand, '▤');
        util.el('span', 'ref-brand-copy', brand, 'Service Console');
        util.el('small', 'ref-brand-tag', brand, '');
        const n = util.el('nav', 'ref-nav', header);
        const oldNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const item of ['Shop⌄', 'New Arrivals', 'Home & Living⌄', 'Apparel⌄', 'Outdoors⌄', 'Gifts⌄', 'Journal']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const overview = util.el('section', 'motif-overview', document.body);
      util.el('div', 'motif-logo', overview, '◆');
      const intro = util.el('div', 'motif-intro', overview);
      util.el('strong', 'motif-title', intro, 'Acme API Platform');
      util.el('div', 'motif-subtitle', intro, 'Build, secure, and monitor your APIs');
      util.el('p', 'motif-description', intro, 'The Acme API Platform lets you manage your services, configure endpoints, and monitor usage from a single, integrated console.');
      const stats = util.el('aside', 'motif-stats', overview);
      util.el('strong', 'motif-stats-title', stats, 'Account Overview');
      for (const [k, v] of [['Services', '3'], ['Endpoints', '5'], ['API Keys', '2'], ['Active Integrations', '1']]) {
        const row = util.el('div', 'motif-stat', stats);
        util.el('span', '', row, k);
        util.el('b', '', row, v);
      }
      Object.assign(_c, { intro, overview, stats });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        util.el('div', 'ref-profile-avatar', side, 'JT');
        util.el('strong', 'ref-profile-name', side, 'Jordan Taylor');
        util.el('div', 'ref-profile-email', side, 'jordan.taylor@example.com');
        for (const [label, value] of [
          ['Account Status', 'Active'], ['Member Since', 'March 12, 2019'],
          ['Default Shipping Address', 'Jordan Taylor\n123 Maple St\nPortland, OR 97204\nManage addresses  →'],
          ['Default Billing Address', 'Jordan Taylor\n123 Maple St\nPortland, OR 97204\nManage addresses  →'],
          ['Payment Methods', '▱  Visa ending in 4242\n    Expires 08/2026\n    Manage payment methods  →'],
          ['Email Address', 'jordan.taylor@example.com\nEdit personal information  →'], ['Phone Number', '(555) 228-4167\nEdit personal information  →']
        ]) {
          const row = util.el('section', 'ref-inspector-row', side);
          util.el('strong', '', row, label);
          util.el('div', '', row, value);
        }
      }
      Object.assign(_c, { body });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-scroll-page-link-03',
    template: 'site/base',
    design: { parts },
  });
})();
