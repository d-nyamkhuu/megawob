(function () {
  'use strict';
  const palette = {
    bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#222222', line: '#555555',
  };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', "'Times New Roman',Times,serif");
      document.body.classList.add('instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('a', 'design-brand', header, 'FlightFinder');
      brand.href = '#';
      brand.addEventListener('click', (e) => e.preventDefault());
      u.el('div', 'design-nav-gap', header);
      const nav = u.el('nav', 'design-nav', header);
      for (const n of ['Home', 'Flights', 'Hotels', 'Car Rental', 'My Trips', 'Help']) {
        const a = u.el('a', '', nav, n);
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());
      }
      u.el('div', 'design-date', header, 'Mon, Aug 16, 2027');
      const body = u.el('div', 'design-body', shell);
      if (_c.display === 'hidden') body.classList.add('body-stage-only');
      const noteHost = u.el('div', 'design-note-host', body);
      Object.assign(_c, { shell, header, flightBody: body, noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteHost;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.flightBody;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteHost.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = _c.util.el('footer', 'design-footer', _c.shell);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
    name: 'design-use-shop-flight-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#0000ee'],
      LOW_ACCENTS: ['#0000ee'],
      parts,
    },
  });
})();
