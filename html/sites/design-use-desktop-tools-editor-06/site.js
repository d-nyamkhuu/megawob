(function () {
  'use strict';
  const palette = { bg: '#141517', panel: '#25282c', fg: '#e8eaed', muted: '#a4a9b0', line: '#3a3e44' };
  const D = {
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The editor has a dedicated note pane even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
      document.body.classList.toggle('editor-finish', !!_c.ctx.finish);
      document.documentElement.style.setProperty('--font', "'Segoe UI',Arial,sans-serif");
      document.documentElement.style.setProperty('--button-fg', '#fff');
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
      const title = u.el('header', 'design-header', shell);
      u.el('span', 'tb-icon', title);
      u.el('span', 'tb-title', title, 'Untitled Document - Text Editor');
      const wc = u.el('span', 'tb-win', title);
      u.el('i', 'min', wc);
      u.el('i', 'max', wc);
      u.el('i', 'cls', wc, '✕');
      const aside = u.el('aside', 'ed-aside');
      const heading = u.el('h2', 'ed-task-h', aside, 'Task');
      heading.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, aside, header: aside });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      const left = u.el('div', 'ed-left', body);
      const menu = u.el('nav', 'ed-menu', left);
      for (const m of ['File', 'Edit', 'Format', 'View', 'Help']) u.el('span', '', menu, m);
      body.appendChild(_c.aside);
      Object.assign(_c, { body, left, menu });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.aside.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('footer-label');
      text.textContent = 'Ln 4, Col 1';
      _c.util.el('span', 'footer-cell', foot, 'UTF-8');
      _c.util.el('span', 'footer-cell', foot, 'Plain Text');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      // Give the floating control its own corner without covering the editor.
      if (dock) _c.foot.insertBefore(dock, _c.foot.firstChild);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const focused = document.activeElement;
      const dismissOverlay = () => {
        ctx.dismiss();
        if (focused && focused.isConnected && focused !== document.body) focused.focus({ preventScroll: true });
      };
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
        accept.addEventListener('click', dismissOverlay);
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
      dismiss.addEventListener('click', dismissOverlay);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-desktop-tools-editor-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#5aa0ff'],
      LOW_ACCENTS: ['#5aa0ff'],
      parts,
    },
  });
})();
