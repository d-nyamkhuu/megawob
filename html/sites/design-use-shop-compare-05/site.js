// TrailHub storefront (2016 enterprise-suite look): a design on site/reference. The template keeps the frame's
// rng draws (end control placement and label, decoys, instruction display); this file replaces the header, the
// nav, the instruction slot and the body furniture around the stage.
(function () {
  'use strict';

  const NAV = ['Shop', 'Orders', 'Account', 'Support'];
  const FILTERS = [
    ['Category', 'Backpacks'],
    ['Size (L)', 'Any'],
    ['Max Weight (g)', 'Any'],
    ['Max Price (US$)', 'Any'],
    ['Min Warranty (years)', 'Any'],
    ['Sort by', 'Featured'],
  ];
  const cartSvg = (color, px, sw) =>
    `<svg viewBox="0 0 28 28" width="${px}" height="${px}"><path d="M2 5 H6 L9 19 H22 L25 9 H8" fill="none" stroke="${color}" stroke-width="${sw}"/><circle cx="11" cy="23" r="2" fill="${color}"/><circle cx="20" cy="23" r="2" fill="${color}"/></svg>`;
  const LAUNCHER =
    '<svg viewBox="0 0 18 18" width="18" height="18" fill="#fff">' +
    [0, 7, 14].map((y) => [0, 7, 14].map((x) => `<rect x="${x}" y="${y}" width="4" height="4"/>`).join('')).join('') +
    '</svg>';
  const MOUNTAIN =
    '<svg viewBox="0 0 30 20" width="30" height="20"><path d="M1 19 L10 3 L16 12 L20 7 L29 19 Z" fill="#9fc3e8"/></svg>';
  const SEARCH =
    '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="8" cy="8" r="6" fill="none" stroke="#536987" stroke-width="2"/><path d="M12.5 12.5 L18 18" stroke="#536987" stroke-width="2"/></svg>';

  env.site({
    name: 'design-use-shop-compare-05',
    template: 'site/base',
    design: {
      parts: {
        'frame.theme': (base) =>
          function (_c) {
            base(_c);
            const vars = { bg: '#eaf3fa', panel: '#ffffff', fg: '#0b2448', muted: '#536987', line: '#d5e1ec', accent: '#1266bd' };
            for (const [k, v] of Object.entries(vars)) _c.root.style.setProperty('--' + k, v);
            _c.root.dataset.theme = 'light';
          },
        // The template draws the sidebar flag; this design has no filler sidebar (the draw is kept).
        'frame.placement': (base) =>
          function (_c) {
            base(_c);
            _c.sidebar = false;
          },
        'frame.header': (base, S) =>
          function (_c) {
            const { util } = _c;
            const header = util.el('header', 'ref-task', document.body);
            const old = S.frameBrand(_c, header); // keeps the template's brand draw
            if (old) old.remove();
            util.el('div', 'app-launcher', header).innerHTML = LAUNCHER;
            const brand = util.el('div', 'ref-brand', header);
            brand.dataset.role = 'brand';
            brand.innerHTML = MOUNTAIN;
            util.el('span', '', brand, 'TrailHub');
            Object.assign(_c, { header });
          },
        'frame.nav': (base) =>
          function (_c) {
            base(_c);
            const { header, util } = _c;
            for (const n of header.querySelectorAll('.ref-nav')) n.remove();
            const nav = util.el('nav', 'ref-nav', header);
            NAV.forEach((t, i) => {
              const a = util.el('a', 'ref-navlink' + (i === 0 ? ' is-active' : ''), nav, t);
              a.dataset.role = 'nav';
              a.addEventListener('click', (e) => {
                e.preventDefault();
                env.log('decoy', { what: 'nav', label: t });
              });
            });
          },
        // The instruction sits in the hero band (header display), so the header holds search and cart here.
        'frame.instruction': () =>
          function (_c) {
            const { header, util } = _c;
            const search = util.el('div', 'header-search', header);
            search.innerHTML = SEARCH;
            util.el('span', '', search, 'Search products, brands, categories...');
            const cart = util.el('div', 'header-cart', header);
            cart.innerHTML = cartSvg('#fff', 28, 2);
            util.el('span', 'cart-badge', cart, '0');
          },
        'frame.body': (base) =>
          function (_c) {
            base(_c);
            const { body, ctx, display, util } = _c;
            const hero = util.el('div', 'hero-band', body);
            util.el('div', 'hero-title', hero, 'Backpacks');
            if (display === 'header') util.el('div', 'ref-instruction', hero, ctx.instruction);
            else util.el('div', 'hero-sub', hero, 'Gear for wherever you go');
            const bar = util.el('div', 'filter-bar', body);
            for (const [label, val] of FILTERS) {
              const f = util.el('div', 'filter-field', bar);
              util.el('span', '', f, label);
              const bx = util.el('div', 'filter-box', f);
              util.el('span', '', bx, val);
              util.el('span', 'chev', bx, '⌄');
            }
            const count = util.el('div', 'filter-count', bar);
            util.el('strong', '', count, '4');
            util.el('span', '', count, 'Packs shown');
            const count2 = util.el('div', 'filter-count', bar);
            util.el('strong', '', count2, '0');
            util.el('span', '', count2, 'In your bag');
            const bag = util.el('aside', 'bag-panel', body);
            const head = util.el('div', 'bag-head', bag);
            head.innerHTML = cartSvg('#0b2448', 24, 2);
            util.el('span', '', head, 'Your Bag');
            const empty = util.el('div', 'bag-empty', bag);
            empty.innerHTML = cartSvg('#9aa6b4', 84, 1.4);
            util.el('strong', '', empty, 'Your bag is empty');
            util.el('span', '', empty, 'Add a pack to get started.');
            const totals = util.el('div', 'bag-totals', bag);
            for (const [a, b] of [['Items (0)', '$0.00'], ['Estimated total', '$0.00']]) {
              const row = util.el('div', '', totals);
              util.el('span', '', row, a);
              util.el('span', '', row, b);
            }
          },
        'frame.panel': (base) =>
          function (_c) {
            base(_c);
            if (_c.display === 'panel') _c.body.classList.add('has-panel');
          },
      },
    },
  });
})();
