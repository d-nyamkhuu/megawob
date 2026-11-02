(function () {
  'use strict';
  const palette = { bg: '#a9aab0', panel: '#eef1f6', fg: '#10131a', muted: '#4a5568', line: '#aab3c2' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      _c.root.style.setProperty('--font', "'Segoe UI',Tahoma,Arial,sans-serif");
      _c.root.style.setProperty('--button-fg', '#000');
      document.body.classList.add('qt', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'qt-title', shell);
      u.el('span', 'qt-appico', title).innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M5 5h13v12H9l-4 3z" fill="#fff9d1" stroke="#e9b43e"/><path d="M8 8h8M8 11h6M8 14h4" stroke="#e0af33"/><path d="M6 4v14" stroke="#fff"/></svg>';
      u.el('span', 'qt-title-text', title, 'Notebook - Untitled');
      const wb = u.el('span', 'qt-wbtns', title);
      for (const g of ['_', '\u25a1', '\u00d7']) u.el('i', '', wb, g);
      const menu = u.el('nav', 'qt-menu', shell);
      for (const m of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help']) u.el('span', '', menu, m);
      const work = u.el('div', 'qt-work', shell);
      const tabs = u.el('div', 'qt-tabs', work);
      ['Notes', 'Ideas', 'Research', 'Tasks', 'Journal', 'Archive'].forEach((t, i) => u.el('div', 'qt-tab' + (i === 0 ? ' on' : ''), tabs, t));
      const page = u.el('div', 'qt-page', work);
      const rings = u.el('div', 'qt-rings', work);
      for (let i = 0; i < 10; i++) u.el('i', '', rings);
      Object.assign(_c, { shell, menu, page, header: page });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.page; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.page.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-note', 'note-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.page);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'note-toast');
        _c.page.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('div', 'qt-foot', _c.page);
      const clear = u.el('button', 'qt-clear', foot, 'Clear');
      clear.type = 'button';
      base(_c);
      foot.appendChild(document.body.querySelector('.ref-foot'));
      const st = u.el('footer', 'qt-status', _c.shell);
      u.el('span', 'qt-grip', st);
      u.el('span', 'qt-pos', st, 'Ln 1, Col 1');
      u.el('span', 'qt-zoom', st, '100%');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
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
    name: 'design-use-desktop-tools-editor-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#2f6fd0'], LOW_ACCENTS: ['#2f6fd0'], parts },
  });
})();
