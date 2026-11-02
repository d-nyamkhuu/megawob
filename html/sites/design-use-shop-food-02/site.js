(function () {
  'use strict';
  const palette = { bg: '#cbd0d6', panel: '#e9ecf0', fg: '#101923', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Arial,sans-serif');
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('div', 'sun-symbol', title, '▧');
      u.el('div', 'design-brand', title, 'Campus Café – Food Ordering');
      u.el('div', 'window-controls', title, '−  ×');
      const nav = u.el('nav', 'design-nav', title, 'File    Edit    View    Options    Help');
      u.el('span', 'sun-logo', nav, '▧ Sun');
      const body = u.el('div', 'design-body', shell);
      const briefing = u.el('section', 'task-note', body);
      u.el('h2', '', briefing, 'Order Briefing');
      const footer = u.el('footer', 'design-footer', shell);
      const clear = u.el('button', 'clear-basket', footer, '↶  Clear basket');
      clear.type = 'button';
      Object.assign(_c, { shell, body, navBar: nav, header: briefing, toolbar: footer });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('food-task');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('food-task');
      const u = _c.util;
      u.el('p', 'brief-help', _c.header,
        'Use the menu on the right to select items and quantities. Add items to your basket. When you are ready, click Place order.');
      const status = u.el('p', 'brief-status', _c.header);
      u.el('strong', '', status, 'Note:');
      u.el('span', 'basket-state', status, 'The basket is not complete yet.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.toolbar.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.toolbar.appendChild(foot);
      _c.util.el('div', 'order-slot', _c.toolbar);
      const extras = _c.toolbar.querySelectorAll('.ref-xtra');
      extras.forEach((button, i) => {
        if (i < 2) button.style.gridColumn = String(i + 2);
        else {
          button.classList.add('menu-pq');
          _c.navBar.appendChild(button);
        }
      });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
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
    name: 'design-use-shop-food-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#88a9cd'], LOW_ACCENTS: ['#88a9cd'], parts,
    },
  });
})();
