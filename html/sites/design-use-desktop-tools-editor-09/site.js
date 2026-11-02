(function () {
  'use strict';
  const palette = { bg: '#c4c4c4', panel: '#c4c4c4', fg: '#000000', muted: '#555555', line: '#777777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Match the original editor's panel breakpoint.
      _c.display = _c.ctx.display || 'header';
      if ((_c.display === 'panel' && _c.W < 1200) || (_c.display === 'toast' && _c.H < 700)) _c.display = 'header';
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
      document.body.className = 'side-left instruction-' + _c.display;
      const root = document.documentElement;
      root.style.setProperty('--font', 'Arial,sans-serif');
      root.style.setProperty('--button-fg', '#000');
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('span', 'os-icon', title);
      u.el('div', 'design-brand', title, 'OS/2  Text Editor - Document1');
      const wc = u.el('span', 'os-wc', title);
      u.el('i', '', wc, '_');
      u.el('i', '', wc, '□');
      u.el('i', '', wc, '×');
      Object.assign(_c, { shell, header: shell });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const menu = u.el('nav', 'os-menu', _c.shell);
      for (const m of ['File', 'Edit', 'Format', 'Options', 'Help']) {
        const s = u.el('span', '', menu);
        u.el('u', '', s, m[0]);
        s.append(m.slice(1));
      }
      _c.menu = menu;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.shell.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.note = note;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      if (_c.note) foot.prepend(_c.note);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = [
        'OS/2 Workplace Shell',
        'Your text editor workspace is ready. Close this notice to continue.',
        'Close',
      ];
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
    name: 'design-use-desktop-tools-editor-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#008080'],
      LOW_ACCENTS: ['#008080'],
      parts,
    },
  });
})();
