(function () {
  'use strict';
  const palette = { bg: '#a9abab', panel: '#c8c8c8', fg: '#111', muted: '#333', line: '#858585' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Keep the original pane modes and its compact-width fallback.
      _c.display = _c.ctx.display || 'header';
      if (_c.W < 1180 && (_c.display === 'panel' || _c.display === 'toast')) _c.display = 'header';
      document.body.className = 'instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = ['footer', 'link', 'floating'].includes(_c.placement);
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const toolbar = u.el('header', 'design-header', shell);
      const heading = u.el('div', 'window-heading', toolbar);
      u.el('span', 'design-brand', heading, 'Workplace Shell - Documents');
      Object.assign(_c, { shell, toolbar, header: heading });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('chrome-actions', 'header-actions');
      const controls = _c.util.el('div', 'window-controls', _c.toolbar);
      controls.setAttribute('aria-hidden', 'true');
      _c.util.el('span', 'window-minimize', controls);
      _c.util.el('span', 'window-maximize', controls);
      _c.util.el('span', 'window-close', controls);
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
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('design-footer');
        foot.querySelector('.ref-tools').classList.add('chrome-actions', 'footer-actions');
        _c.shell.appendChild(foot);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['Cookies', 'We use cookies to improve your experience. By continuing to use this site, you agree to our privacy policy.', 'Dismiss'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Need help?', 'Hi! How can we help you today?', 'Close'],
        promo: ['Stay in the loop', 'Get the latest updates, product news and more.', 'Not now'],
        banner: ['New version available!', 'Update now to get the latest features and improvements.', 'Dismiss announcement']
      };
      const [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'chat' || ctx.kind === 'promo') {
        const pictogram = u.el('div', 'overlay-pictogram', el);
        pictogram.innerHTML = ctx.kind === 'chat'
          ? '<svg viewBox="0 0 60 52"><path d="M6 29C-5 5 31-5 50 9c18 15-1 34-25 31L8 49l4-15z" fill="#fff" stroke="#111" stroke-width="2"/><circle cx="18" cy="23" r="3"/><circle cx="29" cy="23" r="3"/><circle cx="40" cy="23" r="3"/></svg>'
          : '<svg viewBox="0 0 60 45"><rect x="3" y="5" width="54" height="36" rx="2" fill="#fff" stroke="#111" stroke-width="3"/><path d="M4 7l26 20L56 7M4 39l16-17m20 0l16 17" fill="none" stroke="#111" stroke-width="2"/></svg>';
        const field = u.el('input', 'overlay-field', actions);
        field.type = 'text';
        field.placeholder = ctx.kind === 'chat' ? 'Type a message…' : 'Your email address';
        field.setAttribute('aria-label', ctx.kind === 'chat' ? 'Message' : 'Email address');
        const decoy = u.el('button', '', actions, ctx.kind === 'chat' ? 'Send' : 'Subscribe');
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent }));
      }
      let dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      if (ctx.kind === 'chat' || ctx.kind === 'promo' || ctx.kind === 'banner') {
        const close = u.el('button', 'overlay-close', el, '×');
        close.type = 'button'; close.title = 'Close'; close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss());
        if (ctx.kind === 'chat' || ctx.kind === 'banner') { dismiss.hidden = true; dismiss = close; }
      }
      const shell = document.querySelector('.site-shell');
      const header = document.querySelector('.design-header');
      const footer = document.querySelector('.design-footer');
      if (shell && header) {
        const box = shell.getBoundingClientRect();
        const bottom = footer && !footer.hidden ? footer.getBoundingClientRect().top : box.bottom;
        if (ctx.kind === 'cookie' || ctx.kind === 'banner') {
          el.style.left = `${box.left + 8}px`;
          el.style.width = `${box.width - 16}px`;
        }
        if (ctx.kind === 'cookie' || ctx.kind === 'chat') el.style.bottom = `${document.documentElement.clientHeight - bottom + 8}px`;
        if (ctx.kind === 'chat') el.style.right = `${document.documentElement.clientWidth - box.right + 8}px`;
        if (ctx.kind === 'banner') el.style.top = `${header.getBoundingClientRect().bottom + 2}px`;
      }
      return { el, dismiss };
    }
  };
  env.site({
    name: 'design-use-desktop-tools-move-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#51c5cf'], LOW_ACCENTS: ['#51c5cf'], parts,
    },
  });
})();
