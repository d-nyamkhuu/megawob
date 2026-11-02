(function () {
  'use strict';
  const palette = {
    bg: '#ffffff', panel: '#ffffff', fg: '#101010',
    muted: '#5f6a78', line: '#c8cdd5', font: 'Arial,sans-serif',
  };
  const styleControls = (parent, header = false) => {
    parent.querySelectorAll('.ref-submit').forEach((b) => {
      b.classList.add('end-control');
      if (header) b.classList.add('header-end');
    });
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('end-link'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('end-xtra'));
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the original compact fallback and the wide side card.
      if (_c.display === 'panel' && _c.W <= 1280) _c.display = 'header';
      document.body.className = 'index instruction-' + _c.display;
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
      const index = u.el('nav', 'task-index', document.body);
      for (let i = 1; i <= 10; i++) u.el('span', i === 1 ? 'on' : '', index, String(i).padStart(2, '0'));
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'hd-num', header, '01');
      const hm = u.el('div', 'hd-mid', header);
      u.el('div', 'hd-kick', hm, 'SOCIAL');
      u.el('div', 'hd-title', hm, 'Follow the Instructions');
      const toolbar = u.el('div', 'hd-task', header);
      u.el('span', 'task-count', toolbar, 'TASK 1 OF 10');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, toolbar, body, header: note });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools, true);
    },
    'frame.body': () => () => {},
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
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('footer-label');
      text.textContent = 'Ready';
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = null;
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
    name: 'design-use-social-feed-all-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-social-feed-all-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ee262b'],
      LOW_ACCENTS: ['#ee262b'],
      parts,
    },
  });
})();
