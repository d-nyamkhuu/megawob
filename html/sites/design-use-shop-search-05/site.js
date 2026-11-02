(function () {
  'use strict';
  const palette = { bg: '#d9d2c3', panel: '#f2f0ea', fg: '#101923', muted: '#444', line: '#8d9bb5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has its own compact cards even at the smaller viewports.
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
      document.documentElement.style.setProperty('--font', "'Times New Roman',Times,serif");
      document.body.classList.add('mg', 'instruction-' + _c.display);
      const win = u.el('div', 'win', document.body);
      const toolbar = u.el('div', 'win-title', win);
      const mast = u.el('header', 'mast', win);
      const left = u.el('div', 'mast-l', mast);
      u.el('div', 'house', left);
      const ll = u.el('div', 'mast-links', left);
      for (const t of ['Home', 'Shop', 'Community', 'Messages', 'Guestbook']) u.el('a', '', ll, t);
      const mid = u.el('div', 'mast-m', mast);
      u.el('span', 'tree', mid);
      const mt = u.el('div', 'mast-t', mid);
      u.el('h1', '', mt, 'Maple Grove Marketplace');
      u.el('div', 'tag', mt, 'A Friendly Place to Shop Online');
      const divider = u.el('div', 'rule', mt);
      u.el('i', 'rule-end', divider);
      u.el('span', 'tree', mid);
      const right = u.el('div', 'mast-r', mast);
      const rl = u.el('div', 'mast-links r', right);
      for (const t of ['My Account', 'Help', 'Sign Out']) u.el('a', '', rl, t);
      u.el('div', 'basket', right);
      Object.assign(_c, { win, toolbar });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'cats', _c.win);
      ['Books', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Toys', 'More'].forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        u.el('a', '', nav, t);
      });
      const note = u.el('section', 'task-note task-note-' + _c.display, _c.win);
      note.hidden = _c.display === 'hidden';
      _c.header = note;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('food-task');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      // The existing widget places this template control in its search toolbar.
      if (_c.submit) _c.submit.classList.add('end-control');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.win;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const heading = _c.header.querySelector('.ref-panel-title');
      if (heading) heading.textContent = 'Task Note';
    },
    'frame.stage': () => (_c) => {
      _c.util.el('div', 'res-head', _c.win, 'Search Results');
      _c.stage = _c.util.el('main', 'stage', _c.win);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = u.el('footer', 'foot', _c.win);
      const fl = u.el('div', 'foot-l', foot);
      ['About Us', 'Shipping', 'Returns', 'Privacy', 'Contact'].forEach((t, i) => {
        if (i) u.el('span', 'sep', fl, '|');
        u.el('a', '', fl, t);
      });
      const fr = u.el('div', 'foot-r', foot);
      u.el('span', 'copyright', fr, 'Maple Grove Marketplace   © 1996');
      const templateFoot = document.body.querySelector('.ref-foot');
      templateFoot.querySelector('.ref-foot-text').remove();
      fr.appendChild(templateFoot);
      _c.foot = foot;
      const pal = u.el('aside', 'palette', document.body);
      const pt = u.el('div', 'pal-title', pal);
      u.el('i', '', pt);
      u.el('span', '', pt, 'Quick Notes');
      const minimize = u.el('button', 'pal-control', pt, '_');
      minimize.type = 'button';
      minimize.setAttribute('aria-label', 'Minimize notes');
      const close = u.el('button', 'pal-control', pt, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close notes');
      const pb = u.el('pre', 'pal-body', pal, 'Shopping list:\n- running shoes\n- water bottle\n- backpack');
      minimize.addEventListener('click', () => {
        pb.hidden = !pb.hidden;
        pal.classList.toggle('minimized', pb.hidden);
      });
      close.addEventListener('click', () => { pal.hidden = true; });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
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
    name: 'design-use-shop-search-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-search-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a1ab8'],
      LOW_ACCENTS: ['#1a1ab8'],
      parts,
    },
  });
})();
