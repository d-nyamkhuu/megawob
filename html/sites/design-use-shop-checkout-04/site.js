(function () {
  'use strict';
  const palette = { bg: '#f1efe3', panel: '#f7f5ea', fg: '#111110', muted: '#55554f', line: '#74746d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Georgia,"Times New Roman",serif');
      document.body.classList.add('lisa-window', _c.display === 'toast' ? 'toast-mode' : 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('span', 'app-mark', title, '▧');
      u.el('strong', 'design-brand', title, 'Shop & Buy');
      const win = u.el('div', 'window-controls', title);
      for (const c of ['−', '□', '×']) u.el('span', '', win, c);
      Object.assign(_c, { shell, header: title });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'design-nav', _c.shell);
      u.el('span', 'app-menu-icon', nav, '▯');
      for (const t of ['File', 'Edit', 'View', 'Search', 'Products', 'Cart', 'Tools', 'Help']) u.el('span', '', nav, t);
      const toolbar = u.el('div', 'toolbar', _c.shell);
      for (const [ic, label] of [['⌂', 'Home'], ['⌕', 'Search'], ['▤', 'Categories'], ['🛒', 'Cart'], ['▤', 'Orders']]) {
        const b = u.el('button', 'tool-button', toolbar);
        b.type = 'button';
        u.el('b', 'tool-icon', b, ic);
        u.el('span', '', b, label);
        b.addEventListener('click', () => env.log('decoy', { label }));
      }
      _c.toolbar = toolbar;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const hero = u.el('section', 'auto-hero', _c.shell);
      u.el('div', 'auto-art', hero);
      const heroText = u.el('div', 'hero-copy', hero);
      u.el('h1', '', heroText, 'Auto Parts & Accessories');
      u.el('p', '', heroText, 'Quality parts for a smooth ride.');
      const benefits = u.el('div', 'hero-benefits', hero);
      for (const t of ['Trusted brands', 'In-stock items', 'Fast delivery']) {
        const row = u.el('div', '', benefits);
        u.el('b', '', row, '✓');
        u.el('span', '', row, t);
      }
      _c.body = _c.shell;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'stage', _c.shell);
      const inspector = u.el('section', 'product-inspector', _c.shell);
      u.el('strong', 'inspector-title', inspector, 'Product Details');
      const preview = u.el('div', 'inspector-preview', inspector);
      u.el('div', 'inspector-art', preview, '▧');
      const summary = u.el('div', 'inspector-summary', preview);
      const products = _c.ctx.spec.products || {};
      const product = products[Object.keys(products)[0]] || {};
      const productName = product.name || 'Selected product';
      const productBrand = product.brand || productName.split(' ')[0];
      const productType = product.type || productName.split(' ').slice(1).join(' ') || productName;
      u.el('b', '', summary, productName);
      u.el('div', 'inspector-stars', summary, '★★★★☆　' + (product.rating ? (product.rating / 10).toFixed(1) : '4.8'));
      u.el('p', '', summary, product.description || product.desc || 'Reliable ' + productType.toLowerCase() + ' for dependable everyday performance.');
      const metadata = u.el('div', 'inspector-meta', inspector);
      for (const [a, b] of [
        ['Brand:', productBrand], ['Type:', productType],
        ['Compatibility:', product.compatibility || 'Multiple models'],
        ['Condition:', product.condition || 'New'],
        ['Availability:', product.stock ? 'In stock' : 'Out of stock'],
        ['Price:', product.price != null ? (product.price / 100).toFixed(2).replace('.', ',') + ' €' : '—'],
      ]) {
        const r = u.el('div', '', metadata);
        u.el('span', '', r, a);
        u.el('b', '', r, b);
      }
      const cart = u.el('aside', 'cart-inspector', inspector);
      u.el('strong', 'cart-title', cart, '🛒　Your Cart');
      u.el('div', 'cart-empty', cart, 'Your cart is empty.');
      u.el('div', 'cart-subtotal', cart, 'Subtotal:　　0,00 €');
      _c.cart = cart;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.shell.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.cart.appendChild(foot);
      _c.cart.classList.toggle('has-end', _c.placement === 'footer' || _c.placement === 'link' || _c.placement === 'floating');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.cart.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const copy = {
        cookie: ['Cookie notice', 'This application stores essential preferences.', 'Accept'],
        toast: ['Notice', 'Your catalogue is ready.', 'Dismiss'],
        chat: ['Assistance', 'Can we help with your order?', 'Close'],
        promo: ['Special offer', 'See this week’s stationery and parts offers.', 'Close'],
        banner: ['Announcement', 'The catalogue is available for browsing.', 'Dismiss'],
      };
      const [t, m, l] = copy[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, t);
      u.el('div', 'overlay-copy', el, m);
      const actions = u.el('div', 'overlay-actions', el);
      const b = u.el('button', 'primary', actions, l);
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss: b };
    },
  };
  env.site({
    name: 'design-use-shop-checkout-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#111110'], LOW_ACCENTS: ['#111110'], parts,
    },
  });
})();
