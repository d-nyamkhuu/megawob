(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#f0f5f8', fg: '#111111', muted: '#404650', line: '#c6d4e0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const s = window.getSelection();
      if (s) s.removeAllRanges();
      const u = _c.util;
      const head = u.el('header', 'shop-head', document.body);
      const brand = u.el('div', 'shop-brand', head);
      u.el('span', 'shop-homeicon', brand, '◆');
      const id = u.el('div', '', brand);
      u.el('strong', '', id, 'Home & Living');
      u.el('small', '', id, 'Quality Products for a Comfortable Home');
      const tools = u.el('div', 'shop-tools', head);
      u.el('div', 'shop-links', tools, 'My Account　 |　 Order Status　 |　 Help');
      u.el('div', 'shop-cart', tools, 'Shopping Cart (0 items)');
      _c.header = head;
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'shop-nav', document.body);
      ['Home', 'Kitchen', 'Bed & Bath', 'Furniture', 'Decor', 'Storage', 'Outdoor', 'Specials'].forEach((x, i) =>
        _c.util.el('span', i ? '' : 'active', nav, x),
      );
      _c.toolbar = nav;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('shop-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const area = u.el('div', 'shop-area', document.body);
      const left = u.el('section', 'shop-search', area);
      u.el('h2', 'shop-panel-title', left, 'Search Products');
      u.el('div', 'shop-form', left);
      const filters = u.el('div', 'shop-filters', left);
      const addMenu = (label, items) => {
        const wrap = u.el('div', 'shop-filter', filters);
        u.el('b', '', wrap, label);
        const button = u.el('button', 'shop-filter-button', wrap, items[0]);
        button.type = 'button';
        const menu = u.el('div', 'shop-filter-menu', wrap);
        menu.hidden = true;
        items.forEach((value) => {
          const option = u.el('button', '', menu, value);
          option.type = 'button';
          option.addEventListener('click', () => {
            button.textContent = value;
            menu.hidden = true;
          });
        });
        button.addEventListener('click', () => { menu.hidden = !menu.hidden; });
      };
      addMenu('Category:', ['All Categories', 'Kitchen', 'Bed & Bath', 'Furniture', 'Decor']);
      const range = u.el('div', 'shop-filter', filters);
      u.el('b', '', range, 'Price Range:');
      const prices = u.el('div', 'shop-prices', range);
      u.el('span', '', prices, '$');
      const min = u.el('input', '', prices);
      min.setAttribute('aria-label', 'Minimum price');
      u.el('span', '', prices, 'to $');
      const max = u.el('input', '', prices);
      max.setAttribute('aria-label', 'Maximum price');
      addMenu('Brand:', ['All Brands', 'Home & Living', 'Comfort House']);
      const stats = u.el('aside', 'shop-side', area);
      const cart = u.el('section', 'shop-panel shop-cartpanel', stats);
      u.el('h2', 'shop-panel-title', cart, 'Your Cart');
      u.el('div', 'shop-cardbody', cart, '0 items　　　　　　　　　$0.00');
      u.el('a', 'shop-cartlink', cart, 'View Cart');
      const dept = u.el('section', 'shop-panel shop-dept', stats);
      u.el('h2', 'shop-panel-title', dept, 'Departments');
      [ ['Kitchen', '124'], ['Bed & Bath', '98'], ['Furniture', '86'], ['Decor', '112'],
        ['Storage', '76'], ['Outdoor', '54'], ['Specials', '32'] ].forEach(([name, count]) => {
        const row = u.el('div', 'shop-deptrow', dept);
        u.el('a', '', row, name);
        u.el('span', '', row, `(${count})`);
      });
      const promo = u.el('section', 'shop-panel shop-feature', stats);
      u.el('h2', 'shop-panel-title', promo, 'Featured Offer');
      u.el('div', 'shop-offer', promo, 'Spring Home Event');
      Object.assign(_c, { body: area, stats });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.stats;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage shop-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('shop-toast');
        note.setAttribute('role', 'status');
      }
    },
    'frame.footer': (base) => (_c) => { base(_c); },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'shop-overlay shop-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Spring styles are here. Sign up for updates.',
        banner: 'Spring Home Event: fresh styles for every room.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-search-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-search-03': palette }, LOW_THEME: palette,
      ACCENTS: ['#0045ef'], LOW_ACCENTS: ['#0045ef'], parts,
    },
  });
})();
