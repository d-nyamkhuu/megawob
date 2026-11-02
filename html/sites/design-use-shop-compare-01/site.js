(function () {
  'use strict';
  const palette = { bg: '#0753a0', panel: '#eeeeee', fg: '#111', muted: '#555', line: '#b7b7b7' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes use this application's dedicated request strip.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('beos', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('div', 'app-icon', title, '🛒');
      u.el('div', 'design-brand', title, 'AppShop');
      u.el('div', 'title-tab-close', title, '×');
      u.el('div', 'window-controls', title, '−　□　×');
      Object.assign(_c, { shell, title, header: title });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'design-nav', _c.shell);
      for (const text of ['Shop', 'Edit', 'View', 'Go', 'Help']) u.el('span', '', nav, text);
      const note = u.el('section', 'task-note', _c.shell);
      note.hidden = _c.display === 'hidden';
      if (_c.display === 'header') u.el('b', '', note, 'Shopping request');
      Object.assign(_c, { note, header: note });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('food-task');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      const heading = _c.note.querySelector('.ref-panel-title');
      if (heading) heading.textContent = 'Shopping request';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') _c.note.appendChild(document.body.querySelector('.ref-note'));
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        texts = {
          cookie: ['Cookie preferences', 'This app uses local preferences.', 'Dismiss'],
          toast: ['Notification', 'Your shopping view is ready.', 'Dismiss'],
          chat: ['Help', 'Need a hand comparing packs?', 'Close'],
          promo: ['Shop update', 'New outdoor gear is now available.', 'Close'],
          banner: ['Announcement', 'Seasonal collection now available.', 'Dismiss'],
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
    name: 'design-use-shop-compare-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-compare-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffd51a'],
      LOW_ACCENTS: ['#ffd51a'],
      parts,
    },
  });
})();
