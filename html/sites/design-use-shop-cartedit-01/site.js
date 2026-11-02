(function () {
  'use strict';
  const palette = { bg: '#e8f1fa', panel: '#fff', fg: '#102d58', muted: '#566a84', line: '#c7d7e8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('trailshop', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('span', 'sun-symbol', title, '◧');
      u.el('div', 'design-brand', title, 'TrailSide Outfitters – Shop');
      const win = u.el('div', 'window-controls', title);
      for (const x of ['−', '□', '×']) u.el('span', '', win, x);
      const nav = u.el('nav', 'design-nav', shell);
      for (const x of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) u.el('span', 'menu-item', nav, x);
      const toolbar = u.el('div', 'shop-toolbar', shell);
      for (const [label, icon] of [
        ['Back', '◀'], ['Forward', '▶'], ['Home', '⌂'], ['Search', '⌕'],
        ['Favorites', '★'], ['Cart', '🛒'], ['Orders', '▣'], ['Account', '♟'],
      ]) {
        const b = u.el('span', 'tool-item', toolbar);
        u.el('b', '', b, icon);
        u.el('span', '', b, label);
      }
      const shophead = u.el('div', 'shop-head', shell);
      u.el('div', 'shop-logo', shophead, '◢▲◣');
      u.el('div', 'shop-wordmark', shophead, 'TrailSide');
      u.el('div', 'shop-submark', shophead, 'Outfitters');
      u.el('div', 'search-box', shophead, 'Search for products, brands or keywords');
      u.el('button', 'search-go', shophead, '⌕');
      u.el('div', 'bag-indicator', shophead, '🛒　Your Bag (4)\n　　 $327.96');
      const header = u.el('div', 'note-slot');
      Object.assign(_c, { shell, toolbar, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      const cats = u.el('aside', 'category-rail', body);
      u.el('b', '', cats, 'Shop by Category');
      for (const c of ['Camping & Hiking', 'Outdoor Clothing', 'Footwear', 'Water Sports',
        'Cycling', 'Fitness & Recreation', 'Travel Gear', 'Accessories', 'Sale', 'Gift Cards', 'Top Brands']) {
        u.el('span', c === 'Water Sports' ? 'active' : '', cats, c);
      }
      body.appendChild(_c.header);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.shell.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = 'TrailSide Outfitters';
        _c.shell.classList.add('with-footer');
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.shell.appendChild(dock);
        _c.shell.classList.add('with-floating');
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['Privacy preferences', 'We use cookies to improve your shopping experience.', 'Reject optional'],
        toast: ['Notification', 'Your shopping bag has been updated.', 'Dismiss'],
        chat: ['TrailSide support', 'How can we help with your order?', 'Close'],
        promo: ['TrailSide newsletter', 'Get updates on new outdoor gear.', 'Close'],
        banner: ['Store announcement', 'Free shipping on orders over $75.', 'Dismiss announcement'],
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-cartedit-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#1765b7'], LOW_ACCENTS: ['#1765b7'], parts },
  });
})();
