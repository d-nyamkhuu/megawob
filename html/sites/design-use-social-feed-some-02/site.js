(function () {
  'use strict';
  const palette = {
    bg: '#f0f1f3', panel: '#ffffff', fg: '#172235',
    muted: '#5f6a78', line: '#c8cdd5',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original inspector and corner note fit at every training viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Arial,sans-serif');
      document.body.classList.add('side-right', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const topbar = u.el('div', 'gn-top', shell);
      u.el('span', '', topbar, 'Activities');
      u.el('span', 'gn-app', topbar, 'SocialNow');
      u.el('span', 'gn-clock', topbar, 'Mon Apr 28  10:14 AM');
      const tray = u.el('span', 'gn-tray', topbar);
      tray.innerHTML =
        '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="3"/><path d="M7 9h10M7 15h10M8 6l8 12"/></svg><svg viewBox="0 0 24 24"><path d="M3 8q9-8 18 0M6 12q6-6 12 0M9 16q3-3 6 0"/><circle cx="12" cy="20" r="1"/></svg><svg viewBox="0 0 24 24"><path d="M4 9h4l5-5v16l-5-5H4zM16 8q5 4 0 8M19 5q7 7 0 14"/></svg><svg viewBox="0 0 24 24"><rect x="7" y="5" width="10" height="16" rx="1"/><path d="M10 5V2h4v3M12 9v8"/></svg>';
      const toolbar = u.el('header', 'design-header', shell);
      u.el('div', 'gn-logo', toolbar);
      u.el('div', 'design-brand', toolbar, 'SocialNow');
      const sb = u.el('div', 'gn-search', toolbar);
      sb.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg><span>Search posts, people, or topics...</span>';
      const wc = u.el('div', 'gn-wc', toolbar);
      u.el('span', '', wc, '–');
      u.el('span', '', wc, '□');
      u.el('span', '', wc, '✕');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden';
      if (_c.display === 'header') u.el('h2', '', note, 'Task');
      Object.assign(_c, { shell, toolbar, body, header: note });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('gn-end-tools');
      _c.shell.style.setProperty('--gn-tools-width', _c.headerTools.getBoundingClientRect().width + 'px');
      _c.shell.dataset.endPlacement = _c.placement || 'none';
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task';
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
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('design-footer');
        _c.shell.appendChild(foot);
        const text = foot.querySelector('.ref-foot-text');
        text.classList.add('footer-label');
        text.textContent = 'Ready';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
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
    name: 'design-use-social-feed-some-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-social-feed-some-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3584e4'],
      LOW_ACCENTS: ['#3584e4'],
      parts,
    },
  });
})();
