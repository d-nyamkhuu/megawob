(function () {
  'use strict';
  const icons = {
    Home: '<path d="M18 6l7 1-6 3" fill="#d0e9f4" stroke="#172c3f" stroke-width=".8"/><path d="M4 13c3 0 5-2 6-5-1-4 2-7 6-6 5 1 6 6 4 10 0 7-4 12-10 11-4 0-7-3-8-7l5 2" fill="#a0d3ed" stroke="#192f42" stroke-width=".9"/><path d="M3 12c2 1 5 1 8 0 1 4-3 7-7 5M8 24l3 1m3-2 2 1" fill="none" stroke="#d3eafa" stroke-width="1.2"/><circle cx="17" cy="6" r="1" fill="#142737"/>',
    Messages: '<path d="M3 5h20v15H3z" fill="currentColor"/><path d="M3 5l10 9L23 5M3 20l7-8m13 8-7-8" stroke="#1d252b"/>',
    Favorites: '<path d="M13 2l3.2 7.5 8 .8-6 5.2 1.9 8L13 19l-7.1 4.5 1.9-8-6-5.2 8-.8z" fill="currentColor"/>',
    Profile: '<circle cx="13" cy="8" r="5" fill="currentColor"/><path d="M4 23v-2c0-7 18-7 18 0v2z" fill="currentColor"/>',
  };
  const palette = { bg: '#22272a', panel: '#15181a', fg: '#dce5ef', muted: '#bfccd9', line: '#30363b' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every display uses the original dedicated note card in the bottom bar.
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
      document.body.classList.add('carbon', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const menu = u.el('div', 'mac-menu', header);
      const apple = u.el('span', 'apple-mark', menu);
      apple.innerHTML = '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M17 1c0 4-3 6-5 6 0-3 2-5 5-6zm3 8c-5-3-6 0-8 0S8 6 4 9c-7 5 0 18 4 18 2 0 2-1 4-1s3 1 5 1c2 0 5-5 6-8-5-2-6-7-3-10z" fill="currentColor"/></svg>';
      for (const title of ['Chirp', 'File', 'Edit', 'View', 'Go', 'Account', 'Help'])
        u.el('span', title === 'Chirp' ? 'menu-brand' : '', menu, title);
      const titlebar = u.el('div', 'mac-titlebar', header);
      const lights = u.el('div', 'window-lights', titlebar);
      for (const color of ['red', 'yellow', 'green']) u.el('i', color, lights);
      u.el('div', 'design-brand', titlebar, 'Chirp');
      const footer = u.el('footer', 'design-footer');
      const note = u.el('section', 'task-note', footer);
      note.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, chromeHeader: header, titlebar, footer, header: note });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const tabs = u.el('nav', 'design-nav', _c.chromeHeader);
      for (const title of ['Home', 'Mentions', 'Messages', 'Favorites', 'Profile']) {
        const tab = u.el('button', 'chrome-tab' + (title === 'Home' ? ' selected' : ''), tabs);
        tab.type = 'button';
        const icon = u.el('span', 'tab-icon', tab);
        icon.innerHTML = title === 'Mentions' ? '@' : '<svg viewBox="0 0 26 26" aria-hidden="true">' + icons[title] + '</svg>';
        u.el('span', '', tab, title);
        tab.addEventListener('click', () => env.log('decoy', { what: title }));
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.titlebar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.shell.appendChild(_c.footer);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
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
      const [title, copy, label] = texts[ctx.kind];
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
    name: 'design-use-social-feed-all-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-social-feed-all-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6f9bbc'],
      LOW_ACCENTS: ['#6f9bbc'],
      parts,
    },
  });
})();
