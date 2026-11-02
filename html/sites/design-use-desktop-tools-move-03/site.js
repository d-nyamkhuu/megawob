(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#121a31', muted: '#58647e', line: '#d7dbea' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'side-left instruction-' + _c.display;
      document.documentElement.style.setProperty('--font', 'Arial,sans-serif');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, 'Files');
      const search = u.el('div', 'window-search', header);
      u.el('span', 'search-glass', search, '⌕');
      const searchInput = u.el('span', 'search-placeholder', search, 'Search in this folder');
      searchInput.setAttribute('aria-hidden', 'true');
      const windowControls = u.el('div', 'window-controls', header);
      for (const [cls, label, glyph] of [['minimize', 'Minimize', '−'], ['maximize', 'Maximize', '□'], ['close', 'Close', '×']]) {
        const control = u.el('span', cls, windowControls, glyph);
        control.setAttribute('aria-label', label);
      }
      const body = u.el('div', 'design-body');
      Object.assign(_c, { shell, header, body });
    },
    'frame.nav': () => (_c) => {
      _c.util.el('nav', 'design-nav', _c.header, 'File    Edit    View    Go    Tools    Help');
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.body;
      base(_c);
      _c.header = header;
      const note = _c.body.querySelector('.ref-instruction');
      if (note) {
        const text = note.textContent;
        note.textContent = '';
        _c.util.el('div', 'ref-instruction-text', note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('header-actions');
    },
    'frame.body': () => (_c) => {
      _c.shell.appendChild(_c.body);
    },
    'frame.panel': (base) => (_c) => { base(_c); },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => { base(_c); },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('footer-label');
      text.textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util, named = ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'];
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement']
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
    }
  };
  env.site({
    name: 'design-use-desktop-tools-move-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#cfe7ff'], LOW_ACCENTS: ['#cfe7ff'], parts
    }
  });
})();
