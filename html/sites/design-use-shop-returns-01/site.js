(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#111318', muted: '#59606a', line: '#d8dce0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame provides a note location for every display at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Arial,Helvetica,sans-serif');
      document.body.classList.add('returns-site', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, 'Northwood');
      u.el('div', 'top-separator', header);
      const topnav = u.el('nav', 'top-nav', header);
      ['Shop', 'Orders', 'Returns', 'Account'].forEach((x, i) => {
        u.el('span', i === 1 ? 'active' : '', topnav, x);
      });
      const search = u.el('div', 'top-search', header);
      u.el('span', 'search-glass', search).innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 5 5"/></svg>';
      u.el('span', 'search-placeholder', search, 'Search products, orders or help');
      const toolbar = u.el('div', 'header-controls', header);
      const body = u.el('div', 'design-body', shell);
      Object.assign(_c, { shell, header, toolbar, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.body;
      base(_c);
      _c.header = header;
      const note = _c.body.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const copy = document.createElement('div');
        copy.className = 'instruction-copy';
        while (note.firstChild) copy.appendChild(note.firstChild);
        note.appendChild(copy);
      }
      const spacer = _c.body.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      if (!_c.headerTools.children.length) _c.toolbar.remove();
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const rail = u.el('nav', 'left-rail', _c.body);
      const icons = {
        Home: '<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/>',
        Shop: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
        Cart: '<path d="M2 3h2l2.2 12.2h12.4L21 7H5"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',
        Orders: '<rect x="4" y="2.5" width="16" height="19" rx="1.5"/><path d="M8 7h8M8 11h8M8 15h6"/>',
        Returns: '<path d="M8 7 3 12l5 5M3 12h11a6 6 0 0 1 0 12" transform="translate(0 -3)"/>',
        Account: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2z"/>',
        Help: '<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.7 2.7 0 1 1 4.7 1.8c-1.5 1.4-2.2 1.5-2.2 3.4M12 18h.01"/>',
      };
      Object.entries(icons).forEach(([label, icon]) => {
        const row = u.el('div', 'rail-item' + (label === 'Orders' ? ' selected' : ''), rail);
        u.el('span', 'rail-icon', row).innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true">' + icon + '</svg>';
        u.el('span', '', row, label);
      });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
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
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.shell.appendChild(foot);
        foot.classList.add('footer-controls');
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const box = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      const data = {
        cookie: ['Cookie preferences', 'We use cookies to make shopping easier.', 'Accept'],
        toast: ['Saved', 'Your preferences are up to date.', 'Dismiss'],
        chat: ['Customer care', 'How can we help with your order?', 'Close'],
        promo: ['Northwood journal', 'New season essentials, selected for you.', 'Close'],
        banner: ['Delivery update', 'Free delivery on orders over $50.', 'Dismiss'],
      }[ctx.kind];
      u.el('b', 'overlay-title', box, data[0]);
      u.el('span', 'overlay-copy', box, data[1]);
      const b = u.el('button', 'overlay-dismiss', box, data[2]);
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss());
      return { el: box, dismiss: b };
    },
  };
  env.site({
    name: 'design-use-shop-returns-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-returns-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ed2525'],
      LOW_ACCENTS: ['#ed2525'],
      parts,
    },
  });
})();
