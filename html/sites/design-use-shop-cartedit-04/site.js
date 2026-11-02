(function () {
  'use strict';
  const palette = { bg: '#b8b8b8', panel: '#e7e7e7', fg: '#111', muted: '#555', line: '#999' };
  const D = { obstruction: null };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four note modes have dedicated positions in this window.
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
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'design-header', shell);
      u.el('div', 'sun-symbol', title, '▧');
      u.el('div', 'design-brand', title, 'AppShop');
      u.el('div', 'window-controls', title, '−  ×');
      const nav = u.el('nav', 'design-nav', title, 'File    Edit    View    Go    Products    Bag    Window    Help');
      u.el('span', 'sun-logo', nav, '▧ Sun');
      const body = u.el('div', 'design-body');
      Object.assign(_c, { shell, title, body, header: body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.shell.appendChild(_c.body);
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
      const footer = _c.util.el('footer', 'design-footer', _c.shell);
      for (const [cls, label] of [['home-item', '⌂   Home'], ['search-item', '⌕   Search'], ['bag-item', '🛒   Bag'], ['saved-item', '♡   Saved'], ['account-item', '♟   Account']]) {
        _c.util.el('span', 'footer-item ' + cls, footer, label);
      }
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        footer.appendChild(foot);
        const count = foot.querySelector('.ref-tools').children.length;
        if (count) footer.classList.add('has-tools');
        if (count > 1) footer.classList.add('has-wide-tools');
      }
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.footer.appendChild(dock);
        _c.footer.classList.add('has-floating');
      }
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
    name: 'design-use-shop-cartedit-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#bdbdbd'], LOW_ACCENTS: ['#bdbdbd'], parts,
    },
  });
})();
