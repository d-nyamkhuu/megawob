(function () {
  'use strict';
  const palette = {
    bg: '#2584bd', panel: '#fff', fg: '#111', muted: '#61718d', line: '#a7bfd1',
  };
  const dockMarkup = '<span class="dock-item active"><i class="dock-icon files"><svg viewBox="0 0 48 48"><path d="M5 10h15l5 5h18v25H5z" fill="#f4cc48" stroke="#b68818"/><path d="M9 17h30v20H9z" fill="#d9ecfa" stroke="#6a9fc1"/><path d="M14 21h19v18H14z" fill="#f7fbff" stroke="#91b3c7"/></svg></i><b>Files</b></span><span class="dock-item"><i class="dock-icon editor"><svg viewBox="0 0 48 48"><path d="M8 14h29v28H8z" fill="#faf7e8" stroke="#8a7d5a"/><path d="M13 9h27v29" fill="#d9eafa" stroke="#6d91ab"/><path d="M14 21h18M14 27h18M14 33h13" stroke="#7e91a1"/></svg></i><b>Editor</b></span><span class="dock-item"><i class="dock-icon calendar"><svg viewBox="0 0 48 48"><rect x="7" y="8" width="34" height="34" rx="3" fill="#f8fbff" stroke="#557d9c"/><path d="M7 15h34" stroke="#477da3" stroke-width="5"/><path d="M15 5v8M33 5v8" stroke="#315d7e" stroke-width="3"/><path d="M14 22h5v5h-5zm9 0h5v5h-5zm9 0h5v5h-5zm-18 9h5v5h-5zm9 0h5v5h-5z" fill="#8db4d0"/></svg></i><b>Calendar</b></span><span class="dock-item"><i class="dock-icon terminal"><svg viewBox="0 0 48 48"><rect x="5" y="7" width="38" height="34" rx="3" fill="#202a34" stroke="#8da9bb" stroke-width="3"/><path d="m12 17 7 6-7 6m12 2h11" fill="none" stroke="#e3eff6" stroke-width="3"/><path d="M9 10h30" stroke="#7db4d4" stroke-width="2"/></svg></i><b>Command Line</b></span><span class="dock-item"><i class="dock-icon preferences"><svg viewBox="0 0 48 48"><path d="m24 4 4 3 5-1 2 5 5 2-1 5 4 4-3 5 1 5-5 2-2 5-5-1-5 4-4-4-5 1-2-5-5-2 1-5-4-4 3-5-1-5 5-2 2-5 5 1z" fill="#d7e5ef" stroke="#66859b" stroke-width="2"/><circle cx="24" cy="24" r="8" fill="#f5f9fc" stroke="#66859b" stroke-width="3"/></svg></i><b>Preferences</b></span>';

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes share the original compact card in the title area.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'vista instruction-' + _c.display;
      _c.root.style.setProperty('--font', '"Segoe UI",Tahoma,Arial,sans-serif');
      _c.root.style.setProperty('--button-fg', '#001f60');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, 'Workspace');
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => (_c) => {
      _c.util.el('nav', 'design-nav', _c.header, 'File     Edit     View     Tools     Help');
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('header-actions');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      // The original panel card also lives at the top of the title area.
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
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
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const dock = foot.querySelector('.ref-foot-text');
      dock.classList.add('footer-label');
      dock.innerHTML = dockMarkup;
      foot.querySelector('.ref-tools').classList.add('footer-actions');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        named = ['Workspace update', 'Your workspace is ready to use.', 'Close'];
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
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
    name: 'design-use-desktop-tools-move-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-desktop-tools-move-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2679b9'],
      LOW_ACCENTS: ['#2679b9'],
      parts,
    },
  });
})();
