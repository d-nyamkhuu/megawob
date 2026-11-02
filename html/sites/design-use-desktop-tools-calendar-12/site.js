(function () {
  'use strict';
  const D = { obstruction: null };
  const palette = {
    bg: '#ffdf52', panel: '#ffffff', fg: '#000000', muted: '#5e6779', line: '#bebebe',
  };
  function styleNote(note, display, ctx) {
    if (!note) return;
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    note.dataset.display = display;
    if (ctx.instruction.length > 90) note.classList.add('long-instruction');
  }
  function styleControls(parent) {
    for (const el of parent.querySelectorAll('.ref-submit, .ref-endlink, .ref-float')) {
      el.classList.add('end-control');
      if (el.classList.contains('ref-endlink')) el.classList.add('end-link');
      if (el.getAttribute('aria-label').length > 10) el.classList.add('end-long');
    }
    for (const el of parent.querySelectorAll('.ref-xtra')) el.classList.add('chrome-xtra');
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.display === 'panel' && _c.H < 760) _c.display = 'header';
      document.body.classList.remove(
        'instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden',
        'end-header', 'end-footer', 'end-link', 'end-icon', 'end-floating', 'end-none',
        'finish-mode', 'has-chrome-xtra',
      );
      document.body.classList.add('bottom', 'instruction-' + _c.display);
      document.body.classList.toggle('finish-mode', !!_c.ctx.finish);
      document.documentElement.style.setProperty('--font', 'monospace');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
      document.body.classList.add('end-' + (_c.placement || 'none'));
      if (_c.placement === 'icon') document.body.classList.add('end-header');
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, 'GOOD PLANS TODAY');
      u.el('nav', 'design-nav', header, 'A BRIGHTER DAY AHEAD');
      Object.assign(_c, { shell, chrome: header, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      // The original header display is the wide note along the bottom perimeter.
      base({ ..._c, header: _c.shell });
      const note = _c.shell.querySelector('.ref-instruction');
      styleNote(note, 'header', _c.ctx);
      if (note) {
        const p = _c.util.el('p', '', null);
        while (note.firstChild) p.appendChild(note.firstChild);
        note.appendChild(p);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      styleControls(_c.headerTools);
      _c.chrome.classList.toggle('has-tools', !!_c.headerTools.children.length);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.chrome });
      const panel = _c.chrome.querySelector('.ref-panel');
      styleNote(panel, 'panel', _c.ctx);
      if (panel) panel.querySelector('.ref-panel-title').textContent = 'YOUR TASK';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        styleNote(note, 'toast', _c.ctx);
        _c.shell.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('footer-label');
      text.textContent = 'Ready';
      // The original neutral buttons live beside the status-bar controls.
      const tools = foot.querySelector('.ref-tools');
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) tools.prepend(button);
      _c.chrome.classList.toggle('has-tools', !!_c.headerTools.children.length);
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
      const tools = _c.foot.querySelector('.ref-tools');
      const width = tools.getBoundingClientRect().width + (dock ? dock.getBoundingClientRect().width : 0);
      _c.shell.style.setProperty('--footer-space', width ? (width + (_c.W <= 1250 ? 85 : 115)) + 'px' : '32px');
      _c.chrome.style.setProperty('--tools-space', (_c.headerTools.getBoundingClientRect().height + 24) + 'px');
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
    name: 'design-use-desktop-tools-calendar-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#ffe246'], LOW_ACCENTS: ['#ffe246'], parts,
    },
  });
})();
