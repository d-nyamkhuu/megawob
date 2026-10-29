(function () {
  'use strict';
  const icon = (path) => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + path + '"/></svg>';
  const icons = {
    bag: 'M5 7h14l2 15H3L5 7zm3 0V5a4 4 0 0 1 8 0v2h-2V5a2 2 0 0 0-4 0v2H8z',
    home: 'M1 11 12 1l11 10-2 2-2-2v12h-5v-8h-4v8H5V11l-2 2z',
    search: 'M10 1a9 9 0 1 0 5.5 16.1L22 24l2-2-6.9-6.5A9 9 0 0 0 10 1zm0 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12z',
    tag: 'M1 13 13 1h9v9L10 22 1 13zm16-8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
    star: 'm12 0 3.7 7.8 8.3 1.1-6 6 1.5 8.5-7.5-4-7.5 4L6 15 0 9l8.3-1.2z',
    account: 'M12 1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM3 23v-4a9 7 0 0 1 18 0v4H3z',
    cart: 'M0 1h4l2 14h14l4-11H6l-.4-3H0zm9 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm10 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  };
  env.site({
    name: 'design-use-shop-coupon-05',
    template: 'site/base',
    design: {
      THEMES: {
        light: { bg: '#d9f1ff', panel: '#ffffff', fg: '#082b63', muted: '#587393', line: '#b7dfff' },
        dark: { bg: '#d9f1ff', panel: '#ffffff', fg: '#082b63', muted: '#587393', line: '#b7dfff' },
        warm: { bg: '#d9f1ff', panel: '#ffffff', fg: '#082b63', muted: '#587393', line: '#b7dfff' },
      },
      LOW_THEME: { bg: '#d9f1ff', panel: '#ffffff', fg: '#082b63', muted: '#587393', line: '#b7dfff' },
      ACCENTS: ['#078de2'], LOW_ACCENTS: ['#078de2'], TITLES: ['ShopEase'], LANGS: ['en'],
      parts: {
        endLabel: (base) => function (rng, content) { const label = base(rng, content); return rng.fork('shop/end-label').bool(0.5) ? 'OK' : label; },
        'frame.placement': (base) => function (_c) { base(_c); if (!_c.ctx.finish && _c.rng.fork('shop/end-placement').bool(0.5)) _c.placement = 'header'; },
        'frame.header': (base) => function (_c) {
          base(_c);
          const brand = _c.util.el('div', 'aero-brand', _c.header);
          const mark = _c.util.el('span', 'aero-brand-mark', brand);
          mark.innerHTML = '<svg viewBox="0 0 78 84" aria-hidden="true"><defs><linearGradient id="shopBag" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#12c5ff"/><stop offset="1" stop-color="#0874ca"/></linearGradient></defs><path d="m10 24 54-7 10 56-63 10L3 77z" fill="url(#shopBag)"/><path d="m10 24 1 59-8-6z" fill="#1685d1"/><path d="M23 29C17 0 49-8 52 26" fill="none" stroke="#009af1" stroke-width="3"/><path d="M25 29C21 3 47-4 50 26" fill="none" stroke="white" stroke-width="1.5"/><circle cx="24" cy="29" r="2" fill="white"/><circle cx="51" cy="26" r="2" fill="white"/></svg>';
          const copy = _c.util.el('div', '', brand); _c.util.el('b', '', copy, 'ShopEase'); _c.util.el('small', '', copy, 'Everyday Great Finds');
          const search = _c.util.el('div', 'aero-search', _c.header, 'Search for products, brands and more...');
          const searchIcon = _c.util.el('span', '', search); searchIcon.innerHTML = icon(icons.search);
        },
        'frame.tools': (base) => function (_c) {
          base(_c);
          const account = _c.util.el('div', 'aero-account', _c.headerTools);
          account.innerHTML = icon(icons.account) + '<span>My Account</span>' + icon(icons.cart) + '<b>Bag</b>';
        },
        'frame.stage': (base) => function (_c) {
          base(_c);
          window.__installAeroShop();
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const foot = document.querySelector('.ref-foot') || _c.util.el('footer', 'ref-foot', document.body);
          const nav = _c.util.el('nav', 'aero-dock', foot);
          for (const [name, key] of [['Home', 'home'], ['Shop', 'search'], ['Deals', 'tag'], ['My Lists', 'star'], ['Account', 'account'], ['Bag', 'cart']]) {
            const item = _c.util.el('button', 'aero-dock-item' + (key === 'cart' ? ' selected' : ''), nav);
            item.innerHTML = icon(icons[key]) + '<span>' + name + '</span>';
            item.addEventListener('click', () => env.log('decoy', { label: name }));
          }
        },
      },
    },
  });
})();
