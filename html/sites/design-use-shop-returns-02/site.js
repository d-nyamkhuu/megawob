(function () {
  'use strict';
  const palette = { bg: '#0e141c', panel: '#171f29', fg: '#f3f6fa', muted: '#aab5c3', line: '#2b3541' };
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
      document.documentElement.style.setProperty('--font', 'Segoe UI, Arial, sans-serif');
      document.body.classList.add('shop-window', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body),
        title = u.el('header', 'design-header', shell);
      u.el('span', 'app-mark', title, '');
      u.el('b', 'design-brand', title, 'ShopEase');
      const search = u.el('div', 'global-search', title);
      u.el('span', 'search-icon', search, '⌕');
      u.el('span', '', search, 'Search for products, brands and more');
      u.el('span', 'title-icon', title, '♧');
      u.el('span', 'title-icon user-icon', title, '◉');
      u.el('i', 'title-divider', title);
      u.el('span', 'window-action', title, '−');
      u.el('span', 'window-action', title, '□');
      u.el('span', 'window-action close-action', title, '×');
      const area = u.el('div', 'app-area', shell),
        toolbar = u.el('div', 'orders-toolbar', area);
      const heading = u.el('div', 'heading-row', toolbar);
      u.el('h1', '', heading, 'Your orders');
      const finder = u.el('div', 'order-finder', heading);
      u.el('span', '', finder, '⌕');
      u.el('span', '', finder, 'Search your orders');
      const range = u.el('div', 'date-range', heading);
      u.el('span', '', range, 'Last 12 months');
      u.el('span', '', range, '⌄');
      const tabs = u.el('nav', 'orders-tabs', toolbar);
      ['Orders', 'Returns', 'Buy again'].forEach((x, i) => u.el('span', i ? '' : 'active', tabs, x));
      const noteSlot = u.el('div', 'task-note', area);
      const extraTools = u.el('div', 'shop-tools', tabs);
      Object.assign(_c, { shell, title, area, noteSlot, extraTools, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.headerTools.querySelectorAll('.ref-xtra').forEach((button) => _c.extraTools.appendChild(button));
    },
    'frame.body': () => (_c) => { _c.body = _c.area; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'stage', _c.area);
      const details = u.el('section', 'return-strip', _c.area);
      const intro = u.el('div', 'return-intro', details);
      u.el('b', '', intro, 'Start a return');
      u.el('span', '', intro, 'Select an order and item to continue.');
      const fields = u.el('div', 'return-fields', details);
      u.el('b', 'details-title', fields, 'Return details');
      [
        ['Reason for return', 'Select a reason'],
        ['Refund method', 'Select a refund method'],
        ['Return method', 'Select a return method'],
      ].forEach(([a, b]) => {
        const f = u.el('div', 'return-field', fields);
        u.el('label', '', f, a);
        const v = u.el('div', 'field-select', f, b);
        u.el('span', '', v, '⌄');
      });
      const help = u.el('aside', 'returns-help', _c.area);
      u.el('b', 'help-heading', help, '●　Returns help');
      [
        'Most items can be returned within 30 days of delivery.',
        'Items must be in original condition with all tags and accessories.',
        'Refunds can be issued to your original payment method or a store credit.',
        'You can return items by mail or at a parcel locker (depending on the item).',
      ].forEach((t) => u.el('div', 'help-line', help, '•　' + t));
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('nav', 'design-footer', _c.shell);
      [
        ['⌂', 'Home'], ['⌕', 'Shop'], ['◇', 'Deals'],
        ['▤', 'Orders'], ['♡', 'Saved'], ['🛒', 'Cart'],
      ].forEach(([icon, label]) => {
        const item = u.el('div', 'dock-item' + (label === 'Orders' ? ' selected' : ''), dock);
        u.el('span', 'dock-icon', item, icon);
        u.el('span', '', item, label);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.querySelectorAll('.ref-xtra').forEach((button) => _c.extraTools.appendChild(button));
        dock.appendChild(foot);
      }
      Object.assign(_c, { dock, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with your return?', 'Close'],
        promo: ['News and updates', 'Discover the latest from ShopEase.', 'Close'],
        banner: ['Announcement', 'You can still browse your orders.', 'Dismiss'],
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
    name: 'design-use-shop-returns-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-returns-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#36a8ff'],
      LOW_ACCENTS: ['#36a8ff'],
      parts,
    },
  });
})();
