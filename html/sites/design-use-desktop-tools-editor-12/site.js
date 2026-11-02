(function () {
  'use strict';
  const palette = { bg: '#0d2332', panel: '#122c40', fg: '#c9e9fd', muted: '#a0c3da', line: '#4c6375' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has dedicated note locations at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('top', 'instruction-' + _c.display);
      document.documentElement.style.setProperty('--font', 'Arial,sans-serif');
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
      const chrome = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', chrome, 'DraftPro 2014 — Drawing1.dwg');
      const icon = u.el('span', 'draft-icon', brand);
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18L8 4l4 15 5-11 4 12M3 11l16 4M8 4v17"/></svg>';
      u.el('nav', 'design-nav', chrome, 'File    Edit    View    Draw    Modify    Format    Tools    Window    Help');
      const body = u.el('div', 'design-body', shell);
      const noteSlot = u.el('div', 'note-slot', body);
      noteSlot.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, chrome, body, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.chrome;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      // Keep the original large preview styling for a template-provided extra action.
      const extra = _c.headerTools.querySelector('.ref-xtra');
      if (extra) {
        extra.classList.add('design-xtra');
        const lens = _c.util.el('span', 'preview-icon', extra);
        lens.innerHTML = '<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="6" stroke-linecap="round"><circle cx="24" cy="24" r="17"/><path d="M37 37L54 54"/></svg>';
        extra.insertBefore(lens, extra.firstChild);
        _c.body.appendChild(extra);
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('footer-label');
      text.textContent = 'X: 182.420    Y: 77.315    Z: 0.000  |  ORTHO  OFF  |  SNAP  ON  |  GRID  ON  |  OSNAP  ON';
      const tabs = _c.util.el('div', 'layout-tabs', foot);
      for (const item of ['MODEL', 'LAYOUT1', 'LAYOUT2']) _c.util.el('span', '', tabs, item);
      _c.util.el('b', '', tabs, '▦');
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
    name: 'design-use-desktop-tools-editor-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#547693'], LOW_ACCENTS: ['#547693'], parts },
  });
})();
