(function () {
  'use strict';
  const palette = { bg: '#cbd0d6', panel: '#e9ecf0', fg: '#101923', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated note strip, even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      document.documentElement.style.setProperty('--font', 'Arial,sans-serif');
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'sun-symbol', header, '🌐');
      u.el('div', 'design-brand', header, 'Global Bazaar');
      const search = u.el('div', 'design-nav', header);
      const searchInput = u.el('input', 'search-input', search);
      searchInput.placeholder = 'Search for products, brands or keywords...';
      searchInput.setAttribute('aria-label', 'Search products');
      const searchButton = u.el('button', 'search-button', search, 'Search');
      searchButton.type = 'button';
      const quick = u.el('nav', 'quick-links', header);
      [['◉', 'Home'], ['▤', 'Help'], ['?', 'Support']].forEach(([icon, label]) => {
        const a = u.el('div', 'quick-link', quick);
        u.el('span', 'quick-icon', a, icon);
        u.el('span', '', a, label);
      });
      const rail = u.el('aside', 'left-rail', shell);
      [['⌂', 'Shop'], ['♧', 'Bag (3)'], ['▤', 'Catalog'], ['✦', 'Special Offers'], ['▧', 'Orders'], ['♙', 'My Account']].forEach(([icon, label], i) => {
        const a = u.el('div', 'rail-item' + (i === 1 ? ' active' : ''), rail);
        u.el('span', 'rail-icon', a, icon);
        u.el('span', '', a, label);
      });
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
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
        // Keep this top-of-page note outside the widget's fixed bottom-cover detection.
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'design-footer', _c.shell);
      const shelfTitle = u.el('div', 'shelf-title', footer, 'Recommended for You');
      u.el('span', 'see-more', shelfTitle, 'See More »');
      const shelf = u.el('div', 'recommendation-shelf', footer);
      const recs = [
        ['Mystic Lands', 'CD-ROM  |  RPG', '$29.99', '▣'],
        ['SkyTrack Flight Stick', 'PC Compatible', '$39.99', '✈'],
        ['SoundWave 2000', 'Stereo Speakers', '$49.99', '♫'],
        ['Adventure Pack', '3 CD Set', '$34.99', '▤'],
        ['Travel Case', 'CD Storage  |  48 Disc', '$19.99', '▰'],
      ];
      recs.forEach(([name, desc, price, icon], i) => {
        const card = u.el('div', 'rec-card', shelf);
        u.el('div', 'rec-art art-' + i, card, icon);
        const info = u.el('div', 'rec-info', card);
        u.el('b', '', info, name);
        u.el('span', '', info, desc);
        u.el('strong', '', info, price);
        const b = u.el('button', 'rec-add', info, 'Add to Bag');
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: 'recommendation' }));
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = null;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
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
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-coupon-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-coupon-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#88a9cd'],
      LOW_ACCENTS: ['#88a9cd'],
      parts,
    },
  });
})();
