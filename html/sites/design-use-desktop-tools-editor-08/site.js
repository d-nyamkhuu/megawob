(function () {
  'use strict';
  const palette = { bg: '#f1f1ef', panel: '#f1f1ef', fg: '#000', muted: '#444', line: '#999' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The editor has room for its original inline notes at every training size.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('bottom', 'instruction-' + _c.display);
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
      const brand = u.el('div', 'design-brand', title);
      brand.innerHTML =
        '<svg viewBox="0 0 22 26" fill="none" stroke="#000" stroke-width="1.6"><path d="M3 1.5h11l5 5v18H3z"/><path d="M14 1.5v5h5M7 12h8M7 16h8M7 20h8" stroke-width="1.2"/></svg>';
      u.el('span', '', brand, 'Text Editor');
      u.el('div', 'win-ctl', title).innerHTML = '<span></span><span></span><span></span>';
      const menu = u.el('nav', 'design-menu', shell);
      for (const m of ['File', 'Edit', 'Format', 'View', 'Help']) u.el('span', '', menu, m);
      const header = u.el('section', 'task-note');
      header.hidden = _c.display === 'hidden';
      header.dataset.mode = _c.display;
      Object.assign(_c, { shell, menu, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      body.appendChild(_c.header);
      _c.body = body;
    },
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
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('design-footer');
      _c.shell.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const reset = _c.util.el('button', 'foot-btn', null, 'Reset');
      reset.type = 'button';
      const spacer = _c.util.el('span', 'sp');
      const cancel = _c.util.el('button', 'foot-btn', null, 'Cancel');
      cancel.type = 'button';
      footer.prepend(reset, spacer, cancel);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'];
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
    name: 'design-use-desktop-tools-editor-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();
