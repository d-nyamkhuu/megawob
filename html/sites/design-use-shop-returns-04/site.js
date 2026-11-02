(function () {
  'use strict';
  const palette = {
    bg: '#e4ebef', panel: '#fff', fg: '#08132f', muted: '#44566a', line: '#7891a7',
  };
  function panel(u, title, parent, rows) {
    const p = u.el('section', 'rail-panel', parent);
    u.el('h3', '', p, title);
    rows.forEach((x) => u.el('div', 'rail-row', p, x));
    return p;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated account-rail note at every size.
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
      document.body.className = 'industrial instruction-' + _c.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'mountain', header, '▲');
      const word = u.el('div', 'brand-block', header);
      u.el('strong', '', word, 'NORTHWIND');
      u.el('small', '', word, 'O U T T I T T E R S');
      u.el('i', 'tagline', header, 'Outdoor Gear for Life');
      const utility = u.el('div', 'utility-links', header);
      u.el('span', '', utility, 'My Account');
      u.el('span', '', utility, 'Customer Service');
      u.el('span', '', utility, 'Help');
      u.el('span', 'cart-label', utility, '🛒　Cart (0)');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('aside', 'task-note', body);
      note.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, body, note, header: note });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'design-nav', _c.shell);
      ['Home', 'Shop by Category', 'Brands', 'Special Offers', 'Order History', 'Returns & Exchanges'].forEach((x, i) => {
        const a = _c.util.el('span', i === 4 ? 'active' : '', nav, x);
        a.setAttribute('role', 'link');
      });
      _c.toolbar = nav;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('food-task');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const rail = u.el('aside', 'account-rail', _c.body);
      panel(u, 'My Account', rail, [
        'Customer:　 Alex Carter', 'Account #:　582719', 'Email:　 alex.carter@northwind.com',
      ]);
      panel(u, 'Order Status Summary', rail, [
        'Total Orders　　　　　　 12', 'Processing　　　　　　　 0', 'Shipped　　　　　　　　 2',
        'Delivered　　　　　　　　8', 'Returns　　　　　　　　 2',
      ]);
      panel(u, 'Returns & Exchanges', rail, [
        'Eligible for Return　　　 4', 'Return in Progress　　　　0', 'Completed Returns　　　　2',
      ]);
      const help = u.el('section', 'rail-panel help-panel', rail);
      u.el('h3', '', help, 'Help Topics');
      ['Our Return Policy', 'How to Return an Item', 'Return Shipping Options', 'Refund Information', 'Contact Support']
        .forEach((x) => u.el('a', '', help, x));
    },
    'frame.panel': (base) => (_c) => {
      const b = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = b;
      const title = _c.note.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task note';
      const text = _c.note.querySelector('.ref-panel-text');
      if (text) text.classList.add('food-task');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.note.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('food-task');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['Cookie preferences', 'This site uses cookies for account services.', 'Dismiss'],
        toast: ['Notice', 'Your account information is current.', 'Dismiss'],
        chat: ['Customer service', 'How can we help with your return?', 'Close'],
        promo: ['Northwind news', 'See the latest outdoor equipment updates.', 'Close'],
        banner: ['Service notice', 'Returns are being processed as usual.', 'Dismiss'],
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-returns-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { northwind: palette }, LOW_THEME: palette,
      ACCENTS: ['#104c80'], LOW_ACCENTS: ['#104c80'], parts,
    },
  });
})();
