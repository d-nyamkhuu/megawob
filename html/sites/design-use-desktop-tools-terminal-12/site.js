(function () {
  'use strict';
  const D = { site: 'design-use-desktop-tools-terminal-12', brand: 'File Manager Lab', mode: 'side-left',
    nav: 'Practice common command line tasks', obstruction: null, footer: 'Ready' };
  const palette = { bg: '#effaff', panel: '#ffffff', fg: '#174b79', muted: '#5e6779', line: '#bebebe' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated left note area at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = D.mode + ' instruction-' + _c.display;
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
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', chrome, D.brand);
      u.el('nav', 'design-nav', chrome, D.nav);
      const noteHost = u.el('section', 'task-note episode-note');
      noteHost.hidden = _c.display === 'hidden';
      if (_c.display === 'header') u.el('h2', '', noteHost, 'Your Task');
      const toolbar = u.el('div', 'site-toolbar', shell);
      Object.assign(_c, { shell, header: noteHost, noteHost, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.dataset.role = 'instruction';
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      body.appendChild(_c.noteHost);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      const note = _c.noteHost.querySelector('.ref-panel');
      if (note) {
        note.dataset.role = 'instruction';
        note.querySelector('.ref-panel-title').textContent = 'Your Task';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.dataset.role = 'instruction';
        _c.noteHost.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'design-footer', _c.shell);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').textContent = D.footer;
      footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util, named = D.obstruction;
      const texts = { cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'], chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'] };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', title);
      u.el('h2', '', el, title); u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') { const accept = u.el('button', '', actions, 'Accept all'); accept.addEventListener('click', () => ctx.dismiss()); }
      if (/Tip/.test(title)) { const c = u.el('label', '', el); c.style.cssText = 'display:block;padding:0 22px 14px'; const ch = u.el('input', '', c); ch.type = 'checkbox'; c.append(' Do not show again'); }
      const dismiss = u.el('button', 'primary', actions, label); dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-use-desktop-tools-terminal-12': palette }, LOW_THEME: palette,
      ACCENTS: ['#349ccf'], LOW_ACCENTS: ['#349ccf'], parts },
  });
})();
