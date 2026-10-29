(function () {
  'use strict';
  env.site({
    name: 'design-use-shop-cartedit-03',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'homedesk instruction-' + ctx.display;
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
      const nav = u.el('nav', 'design-nav', shell);
      [
        'Home',
        'Furniture',
        'Decor',
        'Lighting',
        'Bedding & Bath',
        'Kitchen & Dining',
        'Storage',
        'Outdoor',
        'Rugs',
        'Deals',
      ].forEach((x, i) => u.el('span', i === 9 ? 'sale' : '', nav, x));
      const body = u.el('div', 'design-body', shell);
      const side = u.el('aside', 'side-panel', body);
      u.el('h2', '', side, 'Products');
      const cats = [
        ['All Products', '328'],
        ['Living Room', '52'],
        ['Bedroom', '41'],
        ['Lighting', '48'],
        ['Bedding & Bath', '36'],
        ['Storage', '46'],
        ['Kitchen & Dining', '38'],
        ['Rugs', '28'],
        ['Decor', '37'],
        ['Outdoor', '42'],
      ];
      cats.forEach(([a, b], i) => {
        const row = u.el('div', 'category' + (!i ? ' selected' : ''), side);
        u.el('span', '', row, a);
        u.el('span', 'count', row, b);
      });
      const recent = u.el('section', 'recent', side);
      u.el('h2', '', recent, 'Recently Viewed');
      [
        ['Floor Lamp, Arc Style', '$149.00'],
        ['Bookshelf, 5 Shelves, Oak Finish', '$199.00'],
        ['Bath Towel Set, 6 Pieces', '$59.00'],
        ['Ceramic Planter, Medium', '$34.00'],
      ].forEach((x, i) => {
        const r = u.el('div', 'recent-item', recent);
        u.el('span', 'recent-thumb thumb-' + i, r, '');
        const t = u.el('span', '', r);
        u.el('span', 'recent-name', t, x[0]);
        u.el('span', 'recent-price', t, x[1]);
      });
      const stage = u.el('main', 'stage', body);
      const note = u.el('section', 'task-note', shell);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('strong', '', note, 'Task note');
        u.el('span', '', note, ctx.instruction);
      }
      const footer = u.el('footer', 'design-footer', shell);
      const endRng = ctx.rng.fork('chrome/end');
      const placement = endRng.pick(['footer', 'header', 'link', 'icon']);
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels = Array.isArray(bank) && bank.length ? bank : ['Finish', 'Submit', 'Done', 'Continue', 'OK'];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = endRng.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          placement === 'link' ? 'end-link' : 'end-control',
          footer,
          placement === 'icon' ? '✓' : textOf(label),
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = placement === 'icon' ? 'Proceed' : textOf(label);
        submit.setAttribute('aria-label', textOf(label));
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const b = u.el('button', 'xtra', footer, 'Accept');
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: 'Accept', collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
