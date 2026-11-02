(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-prefs-03', brand: 'My Workspace', mode: 'side-left',
    tokens: { bg: '#74c8ec', panel: '#f5fbff', fg: '#102c57', accent: '#45a9ed', font: 'Arial, Segoe UI, sans-serif', line: '#a7cfee', muted: '#536b8d', 'button-fg': '#fff' },
    nav: '',
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'], footer: ''
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = D.mode + ' instruction-' + _c.display;
      for (const [k, v] of Object.entries(D.tokens)) _c.root.style.setProperty('--' + k, v);
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
      const title = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', title, D.brand);
      u.el('button', 'title-opener', title, '▼').type = 'button';
      u.el('nav', 'design-nav', title, D.nav);
      const toolbar = u.el('div', 'app-toolbar', shell);
      for (const [icon, label] of [['▧','New'],['▰','Open'],['✖','Delete'],['▤','Print']]) {
        const item = u.el('button', 'app-tool', toolbar);
        item.type = 'button';
        u.el('span', 'tool-icon', item, icon);
        u.el('span', '', item, label);
        if (label === 'New' || label === 'Open') u.el('span', 'tool-caret', item, '▼');
      }
      u.el('span', 'toolbar-divider', toolbar);
      u.el('span', 'toolbar-spacer', toolbar);
      u.el('span', 'toolbar-preferences', toolbar, '⚙　Preferences');
      u.el('span', 'toolbar-help', toolbar, '❔　Help');
      const body = u.el('div', 'design-body', shell);
      Object.assign(_c, { shell, title, toolbar, body, header: body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
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
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('design-footer');
      _c.shell.appendChild(footer);
      const label = footer.querySelector('.ref-foot-text');
      label.classList.add('footer-label');
      label.textContent = D.footer || 'Ready';
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util, named = D.obstruction;
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
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-desktop-tools-prefs-03': D.tokens },
      LOW_THEME: D.tokens,
      ACCENTS: ['#45a9ed'],
      LOW_ACCENTS: ['#45a9ed'],
      parts
    }
  });
})();
