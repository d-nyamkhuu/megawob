(function () {
  'use strict';
  const palette = { bg: '#e8edf1', panel: '#f5f7f9', fg: '#202936', muted: '#697887', line: '#cbd4dc' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'app-mark', top, '⬡');
      u.el('span', 'ds-brand', top, 'Inventory Manager');
      const win = u.el('div', 'window-actions', top);
      ['−', '□', '×'].forEach((t) => u.el('span', '', win, t));
      _c.header = top;
    },
    'frame.nav': () => (_c) => {
      const menu = _c.util.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((t) => _c.util.el('span', '', menu, t));
      _c.toolbar = menu;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const navItems = [
        ['⬡', 'Products'], ['🛒', 'Orders'], ['♟', 'Customers'],
        ['▥', 'Reports'], ['▰', 'Suppliers'], ['⚙', 'Settings'],
      ];
      navItems.forEach((it, i) => {
        const e = u.el('div', 'rail-item' + (!i ? ' active' : ''), rail);
        u.el('span', 'rail-icon', e, it[0]);
        u.el('span', '', e, it[1]);
      });
      const content = u.el('div', 'ds-content', body);
      const workspace = u.el('div', 'ds-main', content);
      const table = u.el('section', 'catalog', workspace);
      u.el('h1', 'catalog-title', table, 'Products');
      const fake = u.el('div', 'fake-table', table);
      u.el('div', 'fake-head', fake, 'Name　⌃　　　　　　　　　　　　 Price　　　　　　　　　Category');
      [
        'Camping Tent', 'Water Bottle', 'Hiking Backpack', 'LED Flashlight',
        'Portable Charger', 'Travel Pillow', 'First Aid Kit', 'Sunscreen Lotion',
        'Insect Repellent', 'Cooler Box', 'Folding Chair', 'Binoculars',
      ].forEach((n, i) => {
        const r = u.el('div', 'fake-row', fake);
        u.el('span', '', r, n);
        u.el('span', '', r, '$' + (19 + i * 7) + '.99');
        u.el('span', '', r, i % 2 ? 'Outdoors' : 'Equipment');
      });
      const inspector = u.el('aside', 'inspector', workspace);
      u.el('h2', '', inspector, 'Details');
      u.el('div', 'empty-cube', inspector, '⬡');
      u.el('div', 'empty-caption', inspector, 'No product selected');
      ['SKU', 'Price', 'Category', 'Stock', 'Brand', 'Dimensions', 'Weight', 'Description'].forEach((n) => {
        const r = u.el('div', 'prop-row', inspector);
        u.el('span', '', r, n);
        u.el('span', '', r, '–');
      });
      Object.assign(_c, { body, workspace });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = document.body;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.workspace);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) document.body.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const status = _c.util.el('footer', 'ds-footer', document.body);
      _c.util.el('span', 'product-count', status, '12 products');
      const foot = document.body.querySelector('.ref-foot');
      if (foot) status.appendChild(foot);
      _c.status = status;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.status.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-search-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-search-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1683f7'],
      LOW_ACCENTS: ['#1683f7'],
      parts,
    },
  });
})();
