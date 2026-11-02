(function () {
  'use strict';
  const palette = { bg: '#f7f6f3', panel: '#ffffff', fg: '#18243b', muted: '#5e6779', line: '#bebebe' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four modes have a dedicated note location in this frame.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('top', 'instruction-' + _c.display);
      document.documentElement.style.setProperty('--font', 'monospace');
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
      const toolbar = u.el('header', 'design-header', shell);
      const logo = u.el('span', 'design-logo', toolbar);
      logo.innerHTML =
        '<svg viewBox="0 0 32 32" width="30" height="30"><defs><linearGradient id="bag-orange" x2="0" y2="1"><stop stop-color="#ffab47"/><stop offset="1" stop-color="#f07805"/></linearGradient></defs><rect x="1" y="6" width="30" height="27" rx="4" fill="url(#bag-orange)"/><path d="M9 11V5a7 7 0 0114 0v6" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M8 13l5-2a3 3 0 006 0l5 2-2 6-3-1v10h-9V18l-3 1z" fill="#fff"/><path d="M3 9v18" stroke="#fff" opacity=".22"/></svg>';
      u.el('div', 'design-brand', toolbar, 'FinderShop');
      const nav = u.el('nav', 'design-nav', toolbar);
      for (const t of ['File', 'Edit', 'View', 'Help']) u.el('span', '', nav, t);
      const wc = u.el('span', 'win-ctl', toolbar);
      wc.innerHTML =
        '<svg viewBox="0 0 120 20" width="110" height="18" fill="none" stroke="#ddd" stroke-width="1.600"><path d="M5 10h12"/><rect x="48" y="4" width="11" height="11"/><path d="M52 2h11v11"/><path d="M92 3l12 12M104 3L92 15"/></svg>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden';
      note.classList.toggle('panel-display', _c.display === 'panel');
      if (_c.display !== 'hidden') {
        u.el('div', 'note-lbl', note, 'TASK');
        const about = u.el('div', 'note-about', note);
        u.el('h3', '', about, 'ABOUT THIS TASK');
        u.el('div', '', about, 'Use the search box below to find the result.');
        const line = u.el('div', '', about);
        line.append('Click the ');
        u.el('b', '', line, 'requested result');
        line.append(' in the search results.');
        u.el('div', '', about, 'Your workspace is ready.');
        _c.about = about;
      }
      Object.assign(_c, { shell, toolbar, body, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.dataset.long = String(text.textContent.length > 75);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.about || _c.header;
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
      text.textContent = '';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-use-shop-search-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#ed710b'],
      LOW_ACCENTS: ['#ed710b'],
      parts,
    },
  });
})();
