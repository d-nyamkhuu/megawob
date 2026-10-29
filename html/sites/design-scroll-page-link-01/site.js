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
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        {
          if (display !== 'header' || nav) rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header);
          brand.dataset.role = 'brand';
          const pines = util.el('span', 'ref-pine-mark', brand);
          pines.setAttribute('aria-hidden', 'true');
          pines.innerHTML =
            '<svg viewBox="0 0 62 54" xmlns="http://www.w3.org/2000/svg"><g fill="#74142b"><path d="m15 2-4 9 3-1-7 9 5-1-9 12 7-2-8 12 10-3-3 8 6-3v11h5V42l6 3-3-8 8 3-9-12 6 2-8-11 4 1-6-9 2 1z"/><path d="m43 1-4 9 3-1-7 9 5-1-9 12 7-2-8 12 10-3-3 8 6-3v11h5V42l6 3-3-8 8 3-9-12 6 2-8-11 4 1-6-9 2 1z"/></g><path d="M16 42v11m27-11v11" stroke="#f7f3e8" stroke-width="1.2"/></svg>';
          util.el('span', 'ref-brand-copy', brand, 'Maple & Pine');
          util.el('small', 'ref-brand-tag', brand, 'GOODS FOR A BRIGHTER EVERYDAY');
          const n = util.el('nav', 'ref-nav', header);
          const oldNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          for (const item of [
            'Shop⌄',
            'New Arrivals',
            'Home & Living⌄',
            'Apparel⌄',
            'Outdoors⌄',
            'Gifts⌄',
            'Journal',
          ]) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const storeIcons = util.el('span', 'ref-store-icons', headerTools);
        storeIcons.setAttribute('aria-hidden', 'true');
        storeIcons.innerHTML =
          '<svg viewBox="0 0 160 36" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#74142b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="17" cy="15" r="9"/><path d="m24 22 8 8"/><circle cx="77" cy="10" r="7"/><path d="M64 31c1-8 5-12 13-12s12 4 13 12z"/><path d="M120 7h7l6 19h20l5-14h-27M138 31h.1M153 31h.1"/></g><circle cx="151" cy="5" r="10" fill="#08717a"/><text x="151" y="9" text-anchor="middle" fill="#fff" font="bold 12px Arial">0</text></svg>';
        Object.assign(_c, { headerTools, storeIcons, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
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
            ['Account Status', 'Active'],
            ['Member Since', 'March 12, 2019'],
            ['Default Shipping Address', 'Jordan Taylor\n123 Maple St\nPortland, OR 97204\nManage addresses  →'],
            ['Default Billing Address', 'Jordan Taylor\n123 Maple St\nPortland, OR 97204\nManage addresses  →'],
            ['Payment Methods', '▱  Visa ending in 4242\n    Expires 08/2026\n    Manage payment methods  →'],
            ['Email Address', 'jordan.taylor@example.com\nEdit personal information  →'],
            ['Phone Number', '(555) 228-4167\nEdit personal information  →'],
          ]) {
            const row = util.el('section', 'ref-inspector-row', side);
            util.el('strong', '', row, label);
            util.el('div', '', row, value);
          }
        }
        Object.assign(_c, { body });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-scroll-page-link-01',
    template: 'site/base',
    design: { parts },
  });
})();
