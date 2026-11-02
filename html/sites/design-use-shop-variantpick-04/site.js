(function () {
  'use strict';
  const palette = { bg: '#9bb0d0', panel: '#eef0f2', fg: '#111111', muted: '#555555', line: '#aeb0b3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'platinum instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const menu = u.el('div', 'mac-menu', shell);
      u.el('b', 'apple', menu, '');
      ['AppShop', 'File', 'Edit', 'View', 'Go', 'Shop', 'Window', 'Help'].forEach((x, i) =>
        u.el(i ? 'span' : 'b', '', menu, x),
      );
      u.el('span', 'mac-time', menu, '10:24 AM');
      u.el('span', 'menu-status', menu, '▣');
      const title = u.el('header', 'window-title', shell);
      u.el('span', 'title-collapse', title, '−');
      u.el('b', 'window-name', title, 'AppShop');
      u.el('span', 'title-spacer', title);
      const controls = u.el('div', 'window-actions', title);
      ['○', '⊗'].forEach((x, i) => u.el('span', i ? 'close-control' : 'zoom-control', title, x));
      const nav = u.el('nav', 'shop-nav', shell);
      [
        ['‹', 'Back'],
        ['›', 'Forward'],
        ['⌂', 'Home'],
        ['⌕', 'Search'],
        ['▦', 'Products'],
        ['♧', 'Bag (0)'],
      ].forEach(([ic, txt], i) => {
        const n = u.el('div', 'nav-item' + (i === 3 ? ' active' : ''), nav);
        u.el('b', 'nav-icon', n, ic);
        u.el('span', '', n, txt);
      });
      const search = u.el('div', 'search-area', nav);
      const field = u.el('div', 'search-pill', search);
      u.el('b', '', field, '⌕');
      u.el('span', '', field, 't-shirt');
      const sb = u.el('button', 'search-button', search, 'Search');
      sb.type = 'button';
      const hero = u.el('section', 'store-hero', shell);
      const heroCopy = u.el('div', 'hero-copy', hero);
      u.el('strong', 'hero-title', heroCopy, 'AppShop');
      u.el('span', 'hero-subtitle', heroCopy, 'Quality goods for everyday life.');
      const depts = u.el('div', 'hero-departments', hero);
      ['Clothing', 'Accessories', 'Home', 'Outdoors'].forEach((t) => u.el('span', '', depts, t));
      Object.assign(_c, { shell, hero, controls, header: hero });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.hero.querySelector('.ref-instruction');
      if (note) {
        const text = note.textContent;
        note.textContent = '';
        note.classList.add('task-note');
        _c.util.el('b', 'note-label', note, 'Shopping request');
        _c.util.el('span', 'food-task', note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.controls;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.hero;
      base(_c);
      _c.body = body;
      const note = _c.hero.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        const title = note.querySelector('.ref-panel-title');
        title.classList.add('note-label');
        title.textContent = 'Shopping request';
        note.querySelector('.ref-panel-text').classList.add('food-task');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.querySelector('.ref-note-text').classList.add('food-task');
        const title = _c.util.el('b', 'note-label', null, 'Shopping request');
        note.prepend(title);
        _c.hero.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.hero.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.hero.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        texts = {
          cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
          toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
          chat: ['Help', 'Need help with this store?', 'Close'],
          promo: ['News and updates', 'Discover the latest arrivals.', 'Close'],
          banner: ['Announcement', 'New season essentials are now available.', 'Dismiss'],
        };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const b = u.el('button', '', actions, 'Accept all');
        b.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-variantpick-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-variantpick-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4389df'],
      LOW_ACCENTS: ['#4389df'],
      parts,
    },
  });
})();
