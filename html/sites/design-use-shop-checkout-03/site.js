(function () {
  'use strict';
  const palette = { bg: '#f4f7fb', panel: '#fff', fg: '#101b32', muted: '#697991', line: '#d9e1eb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.documentElement.style.setProperty('--font', 'Arial, sans-serif');
      // Episodes reuse the body; only the current instruction mode may style its note.
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('shop-app', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const traffic = u.el('div', 'traffic-strip', shell);
      u.el('i', 'traffic red', traffic);
      u.el('i', 'traffic yellow', traffic);
      u.el('i', 'traffic green', traffic);
      const rail = u.el('aside', 'shop-rail', shell);
      u.el('div', 'shop-logo', rail, '▣');
      u.el('strong', 'shop-brand', rail, 'ShopEasy');
      const nav = u.el('nav', 'shop-nav', rail);
      for (const [icon, label, active] of [
        ['⌂', 'Home'], ['◇', 'Shop'], ['⚙', 'Deals'], ['▣', 'Orders'], ['♙', 'Account'],
      ]) {
        const a = u.el('div', 'rail-item' + (active ? ' selected' : ''), nav);
        u.el('span', 'rail-icon', a, icon);
        u.el('span', '', a, label);
      }
      const workspace = u.el('div', 'shop-workspace', shell);
      const toolbar = u.el('header', 'shop-toolbar', workspace);
      const search = u.el('div', 'search-box', toolbar);
      u.el('span', 'search-icon', search, '⌕');
      u.el('span', 'search-placeholder', search, 'Search products, brands, and more');
      const cart = u.el('div', 'cart-summary', toolbar);
      u.el('span', 'cart-icon', cart, '🛒');
      const carttext = u.el('div', '', cart);
      u.el('b', '', carttext, 'Cart');
      u.el('small', '', carttext, '0 items  ·  $0.00');
      u.el('span', 'cart-chevron', cart, '›');
      Object.assign(_c, { shell, traffic, rail, workspace, toolbar, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      if (_c.display === 'header') {
        const header = _c.header;
        _c.header = _c.util.el('section', 'task-note', _c.workspace);
        base(_c);
        _c.header.querySelector('.ref-instruction').classList.add('task-copy');
        _c.header = header;
      } else base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.workspace; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const panel = _c.rail.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.querySelector('.ref-panel-text').classList.add('task-copy');
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'stage', _c.workspace); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.querySelector('.ref-note-text').classList.add('task-copy');
        _c.workspace.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.traffic.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.rail.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        map = {
          cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Accept'],
          toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
          chat: ['Help', 'Need help finding something?', 'Close'],
          promo: ['Special offer', 'See what’s new at ShopEasy.', 'Close'],
          banner: ['Announcement', 'Free delivery on orders over $35.', 'Dismiss'],
        };
      const [t, c, b] = map[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      u.el('h2', '', el, t);
      u.el('div', 'overlay-copy', el, c);
      const button = u.el('button', 'primary', el, b);
      button.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss: button };
    },
  };
  env.site({
    name: 'design-use-shop-checkout-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-checkout-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0877f9'],
      LOW_ACCENTS: ['#0877f9'],
      parts,
    },
  });
})();
