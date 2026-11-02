(function () {
  'use strict';
  const palette = { bg: '#9fa4b0', panel: '#c9c6be', fg: '#111111', muted: '#222222', line: '#8d8a84' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original window has a note slot in every viewport.
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
      document.documentElement.style.setProperty('--font', "Helvetica,Arial,'Liberation Sans',sans-serif");
      document.body.classList.add('motif', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('span', 'mo-logo', header, 'UNIX');
      for (const t of ['Applications', 'Workspace', 'Help']) {
        const item = u.el('span', 'mo-top', header);
        u.el('u', '', item, t[0]);
        item.append(t.slice(1));
      }
      u.el('span', 'mo-clock', header, 'Mon Jul 15 1991   10:24 AM');
      const win = u.el('div', 'design-body', shell);
      const tb = u.el('div', 'mo-title', win);
      u.el('span', 'mo-tear', tb, '');
      u.el('span', 'mo-tt', tb, 'Web Finder');
      u.el('span', 'mo-wb', tb, '▭');
      u.el('span', 'mo-wb', tb, '✕');
      const menu = u.el('div', 'mo-menu', win);
      for (const m of ['File', 'Edit', 'View', 'Search', 'Go', 'Bookmarks']) {
        const item = u.el('span', 'mo-mi', menu);
        u.el('u', '', item, m[0]);
        item.append(m.slice(1));
      }
      const help = u.el('span', 'mo-mi mo-help', menu);
      u.el('u', '', help, 'H');
      help.append('elp');
      const fr = u.el('div', 'mo-frame', win);
      Object.assign(_c, { shell, win, menu, header: fr });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.header;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'panel-note');
        panel.querySelector('.ref-panel-title').textContent = 'Task instructions';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'toast-note');
        _c.body.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      foot.querySelector('.ref-foot-text').remove();
      _c.win.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.prepend(dock);
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
    name: 'design-use-shop-search-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-search-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a1ad0'],
      LOW_ACCENTS: ['#1a1ad0'],
      parts,
    },
  });
})();
