(function () {
  'use strict';
  const D = { site: 'design-use-shop-checkout-01', brand: 'ShopEase' };
  const palette = { bg: '#aeb4b7', panel: '#f5f5f5', fg: '#17191b', muted: '#5e6266', line: '#c6c9cb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.documentElement.style.setProperty('--font', 'Arial, Helvetica, sans-serif');
      document.body.classList.add('instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'window-title', shell);
      u.el('span', 'traffic-lights', title, '●  ●  ●');
      u.el('span', 'window-name', title, D.brand);
      u.el('span', 'window-spacer', title, '');
      const nav = u.el('nav', 'app-nav', shell);
      for (const [icon, name] of [
        ['H', 'Home'], ['▣', 'Shop'], ['◆', 'Deals'], ['▤', 'Orders'], ['A', 'Account'],
      ]) {
        const item = u.el('div', 'nav-item' + (name === 'Shop' ? ' active' : ''), nav);
        u.el('b', '', item, icon);
        item.append(' ' + name);
      }
      u.el('div', 'nav-search', nav, '⌕  Search ShopEase');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, title, body, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('food-task');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) { title.classList.add('note-label'); title.textContent = 'Order details'; }
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('food-task');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'stage', _c.body);
      const rail = u.el('aside', 'shop-rail', _c.body);
      const cart = u.el('section', 'rail-box cart-box', rail);
      u.el('div', 'rail-title', cart, '▣  Your Cart');
      u.el('div', 'cart-count', cart, '0 items');
      u.el('div', 'cart-empty-icon', cart, '▱');
      u.el('div', 'cart-empty', cart, 'Your cart is empty.');
      const help = u.el('section', 'rail-box help-box', rail);
      u.el('div', 'rail-title', help, '?  Need help?');
      for (const [icon, titleText, copy] of [
        ['?', 'How to place an order', 'Learn how to search, add items to your cart and checkout.'],
        ['➜', 'Shipping information', 'See delivery options and estimated delivery times.'],
        ['◆', 'Using promo codes', 'Find out how to use discount codes at checkout.'],
        ['▣', 'Returns & refunds', 'Our return policy and how to start a return.'],
      ]) {
        const row = u.el('div', 'help-row', help);
        u.el('span', 'help-icon', row, icon);
        const words = u.el('div', 'help-words', row);
        u.el('b', '', words, titleText);
        u.el('span', '', words, copy);
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-text').classList.add('food-task');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('footer-status');
      status.textContent = 'Shop  ·  All products';
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['Privacy preferences', 'We use cookies to improve your shopping experience.', 'Reject optional'],
        toast: ['Notification', 'Your shop is up to date.', 'Dismiss'],
        chat: ['Need help?', 'Our shop team is here to help.', 'Close'],
        promo: ['Special offer', 'Discover this week’s offers.', 'Close'],
        banner: ['Announcement', 'New products are available in the shop.', 'Dismiss'],
      };
      const [heading, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      u.el('h2', '', el, heading);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
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
      ACCENTS: ['#2587d7'], LOW_ACCENTS: ['#2587d7'], parts,
    },
  });
})();
