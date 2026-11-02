(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#26313d', muted: '#778391', line: '#dfe4e8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('side-left', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'sun-symbol', chrome, '');
      u.el('div', 'design-brand', chrome, 'TrailShop');
      u.el('div', 'window-controls', chrome, '');
      u.el('nav', 'design-nav', chrome, 'Shop       Cart       Orders       Account');
      const body = u.el('div', 'design-body', shell);
      const toolbar = u.el('div', 'design-footer', shell);
      Object.assign(_c, { shell, body, toolbar, header: body });
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
      const records = u.el('aside', 'saved-records', _c.body);
      const cartHeading = u.el('h2', 'rail-cart-title', records);
      cartHeading.innerHTML = '🛒  Your Cart';
      u.el('div', 'rail-cart-empty', records, 'Your cart is empty');
      u.el('h2', 'records-title', records, 'Saved Addresses');
      const edit = u.el('button', 'records-edit', records, 'Edit');
      edit.type = 'button';
      edit.addEventListener('click', () => env.log('decoy', { what: 'Edit addresses' }));
      const addressRows = [];
      for (const [name, street, city, code] of [
        ['Home (Marseille)', '12 Rue Saint-Ferréol', 'Marseille', '13001'],
        ['Work (Paris)', '8 Avenue des Ternes', 'Paris', '75017'],
        ['Parents (Lyon)', '42 Rue du Plat', 'Lyon', '69002'],
      ]) {
        const row = u.el('button', 'address-record', records);
        row.type = 'button';
        row.setAttribute('aria-pressed', name.startsWith('Home') ? 'true' : 'false');
        u.el('strong', '', row, name);
        u.el('span', '', row, street);
        u.el('span', '', row, code + ' ' + city);
        u.el('span', '', row, 'France');
        addressRows.push(row);
      }
      addressRows.forEach((row) => row.addEventListener('click', () => {
        addressRows.forEach((x) => {
          x.classList.remove('selected');
          x.setAttribute('aria-pressed', 'false');
        });
        row.classList.add('selected');
        row.setAttribute('aria-pressed', 'true');
      }));
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
      if (note) _c.body.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.shell.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-checkout-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#39a987'], LOW_ACCENTS: ['#39a987'], parts,
    },
  });
})();
