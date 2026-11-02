(function () {
  'use strict';
  const palette = {
    bg: '#008080', panel: '#c0c0c0', fg: '#000000', muted: '#404040', line: '#808080',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four note modes share the reserved space in the New Event window.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      _c.root.style.setProperty('--font', "'MS Sans Serif','Microsoft Sans Serif',Tahoma,Arial,sans-serif");
      _c.root.style.setProperty('--button-fg', '#000');
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', chrome, 'Terminal');
      u.el('nav', 'design-nav', chrome, 'Terminal    Edit    Settings    Help');
      const header = u.el('div', 'site-note-slot');
      const toolbar = u.el('div', 'site-toolbar', shell);
      Object.assign(_c, { shell, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      body.appendChild(_c.header);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'stage', _c.body);
      const icons = u.el('div', 'desk-icons', _c.body);
      const items = [
        ['My Computer', '#dfe6f0'], ['My Documents', '#f2d74a'],
        ['Network Neighborhood', '#9fb4d8'], ['Recycle Bin', '#b8c4b8'], ['Briefcase', '#e8e0b0'],
      ];
      for (const [name, color] of items) {
        const it = u.el('div', 'desk-icon', icons);
        u.el('i', '', it).style.background = color;
        u.el('span', '', it, name);
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('design-footer');
      _c.shell.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const tools = footer.querySelector('.ref-tools');
      u.el('span', 'tb-start', footer, 'Start');
      u.el('span', 'tb-task on', footer, 'Calendar - Daily View');
      u.el('span', 'tb-task', footer, 'New Event');
      footer.appendChild(tools);
      u.el('span', 'tb-clock', footer, '10:23 AM');
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'];
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
    name: 'design-use-desktop-tools-calendar-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-desktop-tools-calendar-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
