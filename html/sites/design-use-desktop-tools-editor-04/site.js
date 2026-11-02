(function () {
  'use strict';
  const palette = { bg: '#575757', panel: '#ccccd2', fg: '#000000', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'side-left instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'nx-shell', document.body);
      const menu = u.el('header', 'nx-menubar', shell);
      const cube = u.el('span', 'nx-cube', menu);
      cube.innerHTML = '<svg viewBox="0 0 48 48" width="44" height="44"><path d="M7 10L31 3l11 25-25 17L5 24z" fill="#050505" stroke="#aaa"/><path d="M7 10l21 11 14 7M28 21L31 3M28 21L17 45" fill="none" stroke="#999"/><g fill="white" font-family="Arial" font-weight="bold" font-size="12" transform="rotate(-23 22 14)"><text x="9" y="14">NeXT</text><text x="10" y="24" font-size="10">NeXT</text></g></svg>';
      ['File', 'Edit', 'Format', 'Find', 'Window', 'Help'].forEach((t) => u.el('span', 'nx-mi', menu, t));
      u.el('span', 'nx-clock', menu, 'Mon Apr 26  10:24 AM');
      const idx = u.el('nav', 'nx-index', shell);
      for (let i = 1; i <= 20; i++) u.el('span', i === 1 ? 'on' : '', idx, String(i));
      const win = u.el('div', 'nx-window', shell);
      const title = u.el('div', 'nx-title', win);
      u.el('i', 'nx-box x', title);
      u.el('i', 'nx-box m', title);
      u.el('b', '', title, 'Untitled — Text Editor');
      u.el('i', 'nx-box z', title);
      const body = u.el('div', 'nx-body', win);
      Object.assign(_c, { shell, win, title, body, header: body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = h;
      if (_c.headerTools.children.length) _c.title.classList.add('has-tools');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.querySelector('.ref-panel-title').textContent = 'Task Inspector';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.body.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('nx-footer');
      _c.win.appendChild(foot);
      const label = foot.querySelector('.ref-foot-text');
      label.classList.add('footer-label');
      label.textContent = 'Line 1, Column 1';
      const zoom = _c.util.el('span', 'nx-zoom', foot, '100% ▾');
      foot.insertBefore(zoom, foot.querySelector('.ref-tools'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.firstChild);
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
    name: 'design-use-desktop-tools-editor-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#333333'],
      LOW_ACCENTS: ['#333333'],
      parts,
    },
  });
})();
