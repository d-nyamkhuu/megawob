(function () {
  'use strict';
  const palette = { bg: '#bdbdb6', panel: '#eeece2', fg: '#080807', muted: '#080807', line: '#242421' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four note presentations fit the workstation's dedicated note area.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'lisa instruction-' + _c.display;
      const shell = u.el('div', 'site-shell', document.body);
      const menu = u.el('header', 'design-header', shell);
      const apple = u.el('span', 'apple', menu);
      apple.innerHTML = '<svg viewBox="0 0 28 32" aria-hidden="true"><path d="M17 7c1-4 4-6 7-6 0 4-3 7-7 7M14 11C8 6 2 12 3 19c1 7 5 13 8 12l4-1 4 1c3 1 7-5 8-8-6-2-7-9-1-12-4-4-8-3-12 0" fill="currentColor"/></svg>';
      const nav = u.el('nav', 'design-nav', menu);
      for (const title of ['File', 'Edit', 'View', 'Tools', 'Calendar', 'Window', 'Help']) u.el('span', '', nav, title);
      u.el('span', 'menu-clock', menu, 'Mon Apr 16, 1984   10:24 AM');
      const win = u.el('section', 'document-window', shell);
      const title = u.el('div', 'document-title', win);
      u.el('i', 'window-box', title);
      u.el('span', 'title-rule', title);
      u.el('b', '', title, 'Calendar');
      u.el('span', 'title-rule', title);
      u.el('i', 'window-box', title);
      const body = u.el('div', 'design-body', win);
      Object.assign(_c, { shell, title, calendarBody: body, header: body });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.calendarBody; },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.body.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.body.appendChild(foot);
        // A footer with no controls needs no extra status line in this design.
        if (!foot.querySelector('.ref-tools').children.length) foot.hidden = true;
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.body.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['Calendar notice', 'Allow optional cookies for this workstation?', 'Reject optional'],
        toast: ['Calendar', 'Your calendar is up to date.', 'Dismiss'],
        chat: ['Help', 'Drag over the calendar to set a time, or use the New Event fields.', 'Close'],
        promo: ['Calendar notice', 'Keep your appointments in one place.', 'Close'],
        banner: ['Calendar notice', 'Remember to create your event before submitting.', 'Dismiss']
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('p', '', el, copy);
      const dismiss = u.el('button', '', el, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    }
  };
  env.site({
    name: 'design-use-desktop-tools-calendar-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-desktop-tools-calendar-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#080807'],
      LOW_ACCENTS: ['#080807'],
      parts
    }
  });
})();
