(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#1d2942', muted: '#78859c', line: '#dce2e9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original storefront keeps each instruction in its dedicated place.
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
      const shell = u.el('div', 'shop-frame', document.body);
      const header = u.el('header', 'shop-header', shell);
      u.el('div', 'shop-wordmark', header, 'atelier');
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('shop-instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('shop-header-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'shop-area', _c.shell);
      const inspector = u.el('aside', 'shop-inspector', body);
      u.el('h2', '', inspector, 'Product Details');
      const info = [
        ['Name', 'Hooded Utility Jacket'],
        ['Price', '$89'],
        ['Rating', '★★★★★  (124 reviews)'],
        ['Description', 'A lightweight jacket with a drawstring hood, front snap closure and plenty of pockets. Perfect for everyday wear.'],
        ['Materials', '100% Cotton'],
        ['Care', 'Machine wash cold, tumble dry low'],
        ['SKU', 'HJ-2847-SND'],
        ['Availability', 'In stock'],
      ];
      info.forEach(([k, v]) => {
        const row = u.el('section', 'shop-detail', inspector);
        u.el('strong', '', row, k);
        u.el('span', '', row, v);
      });
      Object.assign(_c, { body, inspector });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.inspector;
      base(_c);
      _c.body = body;
      const note = _c.inspector.querySelector('.ref-panel');
      if (note) note.classList.add('shop-panel-note');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'shop-stage', _c.body);
      const gallery = u.el('div', 'shop-gallery', _c.body);
      u.el('div', 'shop-photo', gallery);
      const thumbs = u.el('div', 'shop-thumbs', gallery);
      ['front', 'back', 'detail', 'hood'].forEach((v) => {
        const t = u.el('div', 'shop-thumb shop-thumb-' + v, thumbs);
        t.setAttribute('aria-hidden', 'true');
      });
      const summary = u.el('section', 'shop-summary', _c.body);
      const titleRow = u.el('div', 'shop-title-row', summary);
      u.el('h1', '', titleRow, 'Hooded Utility Jacket');
      u.el('strong', 'shop-price', titleRow, '$89');
      const rating = u.el('div', 'shop-rating', summary);
      u.el('span', 'shop-stars', rating, '★★★★★');
      u.el('span', 'shop-reviews', rating, '(124 reviews)');
      u.el('p', 'shop-description', summary,
        'A lightweight jacket with a drawstring hood, front snap closure and plenty of pockets. Perfect for everyday wear.');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('shop-toast');
        _c.shell.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const dock = u.el('nav', 'shop-dock', _c.shell);
      [ ['⌂', 'Home'], ['⌕', 'Shop'], ['♡', 'Favorites'], ['🛒', 'Cart'], ['♙', 'Account'] ].forEach(([icon, t], i) => {
        const a = u.el('div', 'shop-navitem' + (i === 1 ? ' active' : ''), dock);
        u.el('i', '', a, icon);
        u.el('span', '', a, t);
      });
      const foot = document.body.querySelector('.ref-foot');
      dock.appendChild(foot);
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'shop-overlay shop-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new collection.',
        banner: 'New season arrivals are here.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-countdown-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-countdown-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#43c4a1'],
      LOW_ACCENTS: ['#43c4a1'],
      parts,
    },
  });
})();
