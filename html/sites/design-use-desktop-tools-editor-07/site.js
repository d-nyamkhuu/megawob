(function () {
  'use strict';
  const palette = {
    bg: '#ffffff', panel: '#ffffff', fg: '#2b3340', muted: '#7b8794', line: '#e6e9ec',
  };
  const D = { obstruction: null };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame reserves a task margin at every viewport.
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
      _c.root.style.setProperty('--font', "'Source Sans Pro','Segoe UI',Helvetica,Arial,sans-serif");
      _c.root.style.setProperty('--button-fg', '#fff');
      document.body.className = 'side-left instruction-' + (_c.display === 'toast' ? 'notice' : _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const body = u.el('div', 'design-body', shell);
      const noteHost = u.el('section', 'instruction-slot mode-' + _c.display, body);
      noteHost.hidden = _c.display === 'hidden';
      const toolbar = u.el('div', 'design-toolbar', shell);
      Object.assign(_c, { shell, workspace: body, header: noteHost, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.workspace;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        _c.header.appendChild(document.body.querySelector('.ref-note'));
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'design-footer', _c.shell);
      base(_c);
      footer.appendChild(document.body.querySelector('.ref-foot'));
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = D.obstruction;
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
    name: 'design-use-desktop-tools-editor-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-desktop-tools-editor-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4fb89f'],
      LOW_ACCENTS: ['#4fb89f'],
      parts,
    },
  });
})();
