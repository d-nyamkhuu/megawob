(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#444', line: '#111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses an inline note at small sizes, including panel/toast modes.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--button-fg', '#000');
      document.body.className = 'plain-files instruction-' + _c.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      brand.innerHTML =
        '<svg viewBox="0 0 24 20" aria-hidden="true"><path d="M1 3h8l2 3h12v13H1z"/></svg><span>Workspace</span>';
      const winControls = u.el('div', 'window-controls', header);
      for (const mark of ['−', '□', '×']) u.el('span', '', winControls, mark);
      u.el('nav', 'design-nav', header, 'File     Edit     View     Go     Tools     Help');
      const toolbar = u.el('div', 'file-toolbar', shell);
      const icons = [
        '<path d="M3 6h6l2 2h10v10H3z"/><path d="M8 11v5m-3-3h6"/>',
        '<path d="M7 3h9l4 4v14H7z"/><path d="M16 3v5h4M4 7v14h12"/>',
        '<path d="m5 4 14 16M19 4 5 20"/>',
        '<path d="M6 3h10l4 4v14H6z"/><path d="M16 3v5h4M9 12h8m-8 3h8"/>',
        '<path d="M5 5h14v14H5z"/><path d="m8 8 8 8m0-8-8 8"/>',
        '<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6"/>',
        '<path d="M4 5h16M4 12h16M4 19h16"/><path d="M8 3v4m8-4v4m-8 3v4m8-4v4m-8 3v4m8-4v4"/>',
      ];
      for (const [i, label] of ['New Folder', 'Copy', 'Cut', 'Paste', 'Delete', 'Find', 'Views'].entries()) {
        const b = u.el('button', 'file-tool', toolbar);
        const icon = u.el('span', 'file-tool-icon', b);
        icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[i]}</svg>`;
        u.el('span', '', b, label);
      }
      const body = u.el('div', 'design-body');
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, header, body, note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.note;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('header-actions');
    },
    'frame.body': () => (_c) => {
      _c.shell.appendChild(_c.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        _c.note.appendChild(document.body.querySelector('.ref-note'));
        _c.body.appendChild(_c.note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        named = ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'];
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
    name: 'design-use-desktop-tools-files-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-desktop-tools-files-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0755c7'],
      LOW_ACCENTS: ['#0755c7'],
      parts,
    },
  });
})();
