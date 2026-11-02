(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-tree-12',
    brand: 'ACME SUPPLY CO.',
    obstruction: null,
  };
  const palette = { bg: '#e7eef3', panel: '#ffffff', fg: '#111b35', muted: '#5e6779', line: '#bebebe' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has its own task pane even at the narrow viewports.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Verdana,Arial,sans-serif');
      document.body.classList.add('side-right', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const logo = u.el('span', 'design-logo', header);
      logo.innerHTML = '<svg viewBox="0 0 44 42"><path fill="#b5d7ef" stroke="#749ab8" d="M22 1L11 22l11 19V1zM24 4v35l10-17zM9 24L1 40h17zM35 25l8 15H27z"/></svg>';
      u.el('div', 'design-brand', header, D.brand);
      u.el('div', 'design-sub', header, 'Partner Extranet');
      const tl = u.el('div', 'design-toplinks', header);
      ['Help', '|', 'Contact Us', '|', 'Log Out'].forEach((t) => u.el('span', t === '|' ? 'sep' : 'lnk', tl, t));
      const note = u.el('section', 'task-note');
      note.hidden = _c.display === 'hidden' || _c.display === 'toast';
      if (_c.display === 'header') u.el('h2', '', note, 'Your Task');
      const dock = u.el('div', 'response-dock');
      Object.assign(_c, { shell, chrome: header, header: note, note, dock });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'design-nav', _c.chrome);
      ['Home', 'Documents', 'Orders', 'Accounts', 'Support'].forEach((t) =>
        _c.util.el('span', 'tab' + (t === 'Documents' ? ' on' : ''), nav, t));
      _c.util.el('span', 'date', nav, 'Mon, Mar 22, 1999');
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction-copy');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.dock;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      body.appendChild(_c.note);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      const text = _c.note.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction-copy');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'design-footer', _c.body);
      const tb = _c.util.el('span', 'footer-label', footer);
      ['New Folder', 'Upload...', 'Delete', 'Rename', 'Move...', 'Copy...'].forEach((t) =>
        _c.util.el('span', 'fake-btn', tb, t));
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
      _c.body.appendChild(_c.dock);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
      _c.dock.hidden = !_c.dock.querySelector('button, a');
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
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#b24d1b'], LOW_ACCENTS: ['#b24d1b'], parts,
    },
  });
})();
