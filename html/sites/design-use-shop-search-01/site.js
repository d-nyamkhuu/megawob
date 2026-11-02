(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-search-01',
    brand: 'GreenLeaf',
    obstruction: null,
  };
  const palette = {
    bg: '#f7f6ed', panel: '#fffefa', fg: '#111111', muted: '#5f6a78', line: '#bbb8ae',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The storefront has its own dedicated note positions at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'side-right instruction-' + _c.display;
      document.documentElement.style.setProperty('--font', 'Georgia,serif');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('div', 'window-controls', header, '−  □  ×');
      const nav = u.el('nav', 'design-nav', header);
      for (const label of ['PLANTS', 'SEEDS', 'GARDEN SUPPLIES', 'BOOKS', 'GIFTS', 'SALE'])
        u.el('span', '', nav, label);
      const leaf = u.el('img', 'brand-leaf', header);
      leaf.src = 'sites/' + D.site + '/assets/brand-leaf.svg';
      leaf.alt = '';
      u.el('p', 'brand-tagline', header, 'Plants for a Happier Home');
      const accounts = u.el('div', 'account-links', header);
      for (const label of ['Sign In', 'My Account', 'Help']) u.el('span', '', accounts, label);
      const cart = u.el('span', 'cart-link', accounts);
      cart.innerHTML =
        '<svg viewBox="0 0 36 32" aria-hidden="true"><path d="M1 3h6l5 19h18l5-18-5 2H8M11 25h19" fill="#100e06" stroke="#100e06" stroke-width="2"/><circle cx="15" cy="29" r="2.5"/><circle cx="27" cy="29" r="2.5"/></svg>Cart (0)';
      u.el('i', 'brand-promise', header, 'Good Things Grow Here.');
      u.el('div', 'search-slot', header);
      const toolbar = u.el('div', 'shop-tools', header);
      Object.assign(_c, { shell, header, toolbar });
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
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        const title = note.querySelector('.ref-panel-title');
        title.textContent = '';
        _c.util.el('span', 'task-note-title', title, 'Your Task');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'stage', _c.body);
      const art = u.el('div', 'leaf-caption', _c.body);
      u.el('i', '', art, 'Plants\nInspire a\nBrighter Day.');
      u.el('p', '', art, 'Healthy Homes\nGreener Lifestyles\nHappier You');
      const note = _c.header.querySelector('.ref-instruction');
      if (note) _c.body.style.marginTop = Math.ceil(note.getBoundingClientRect().height + 16) + 'px';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('design-footer');
      _c.shell.appendChild(footer);
      const text = footer.querySelector('.ref-foot-text');
      text.classList.add('footer-label');
      text.textContent = 'Ready';
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (_c.display === 'toast') {
        const note = _c.body.querySelector('.ref-note');
        const controlsWidth = dock
          ? Math.max(_c.footer.getBoundingClientRect().width, dock.getBoundingClientRect().width + 100)
          : _c.footer.getBoundingClientRect().width;
        note.style.width = 'calc(92% - ' + Math.ceil(controlsWidth + 24) + 'px)';
        _c.body.style.marginBottom = Math.ceil(note.getBoundingClientRect().height + 24) + 'px';
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        named = D.obstruction,
        texts = {
          cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
          toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
          chat: ['Help', 'Need help with this workspace?', 'Close'],
          promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
          banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
        };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
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
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#ab1b1c'], LOW_ACCENTS: ['#ab1b1c'], parts,
    },
  });
})();
