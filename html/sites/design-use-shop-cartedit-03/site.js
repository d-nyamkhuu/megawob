(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#101b31', muted: '#647188', line: '#d8e0e8' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'homedesk instruction-' + _c.display;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('div', 'window-title', shell);
      u.el('span', 'tiny-mark', title, '▣');
      u.el('span', '', title, 'HomeNest');
      u.el('span', 'window-controls', title, '−　□　×');
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'brand', header, '◆ HomeNest');
      const search = u.el('div', 'searchbox', header);
      u.el('span', 'search-icon', search, '⌕');
      u.el('span', 'search-placeholder', search, 'Search products, brands, or categories');
      u.el('div', 'account-nav', header, '♡　 Wishlist');
      u.el('div', 'bag-pill', header, '🛒　Bag (4)');
      u.el('div', 'account-nav', header, '♙　Account');
      Object.assign(_c, { shell, title, header: shell });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'design-nav', _c.shell);
      ['Home', 'Furniture', 'Decor', 'Lighting', 'Bedding & Bath', 'Kitchen & Dining', 'Storage', 'Outdoor', 'Rugs', 'Deals']
        .forEach((x, i) => _c.util.el('span', i === 9 ? 'sale' : '', nav, x));
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.shell.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const heading = _c.util.el('strong', '', null, 'Task note');
        note.prepend(heading);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.title.insertBefore(_c.headerTools, _c.title.querySelector('.window-controls'));
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      const side = u.el('aside', 'side-panel', body);
      u.el('h2', '', side, 'Products');
      const cats = [
        ['All Products', '328'], ['Living Room', '52'], ['Bedroom', '41'], ['Lighting', '48'],
        ['Bedding & Bath', '36'], ['Storage', '46'], ['Kitchen & Dining', '38'], ['Rugs', '28'],
        ['Decor', '37'], ['Outdoor', '42'],
      ];
      cats.forEach(([a, b], i) => {
        const row = u.el('div', 'category' + (!i ? ' selected' : ''), side);
        u.el('span', '', row, a);
        u.el('span', 'count', row, b);
      });
      const recent = u.el('section', 'recent', side);
      u.el('h2', '', recent, 'Recently Viewed');
      [
        ['Floor Lamp, Arc Style', '$149.00'], ['Bookshelf, 5 Shelves, Oak Finish', '$199.00'],
        ['Bath Towel Set, 6 Pieces', '$59.00'], ['Ceramic Planter, Medium', '$34.00'],
      ].forEach((x, i) => {
        const r = u.el('div', 'recent-item', recent);
        u.el('span', 'recent-thumb thumb-' + i, r, '');
        const t = u.el('span', '', r);
        u.el('span', 'recent-name', t, x[0]);
        u.el('span', 'recent-price', t, x[1]);
      });
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.shell;
      base(_c);
      _c.body = body;
      const note = _c.shell.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.querySelector('.ref-panel-title').textContent = 'Task note';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        const heading = _c.util.el('strong', '', null, 'Task note');
        note.querySelector('.ref-note-text').prepend(heading);
        _c.shell.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.shell.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const data = {
        cookie: ['Cookie preferences', 'We use cookies to improve your shopping experience.', 'Reject optional'],
        toast: ['Just a moment', 'Your bag is up to date.', 'Dismiss'],
        chat: ['HomeNest support', 'How can we help you today?', 'Close'],
        promo: ['A little something for your home', 'Enjoy 10% off your next order.', 'Close'],
        banner: ['A note from HomeNest', 'Explore new arrivals and seasonal favorites.', 'Dismiss'],
      }[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, data[0]);
      u.el('div', 'overlay-copy', el, data[1]);
      const b = u.el('button', 'primary', el, data[2]);
      b.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss: b };
    },
  };
  env.site({
    name: 'design-use-shop-cartedit-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-cartedit-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1680f8'],
      LOW_ACCENTS: ['#1680f8'],
      parts,
    },
  });
})();
