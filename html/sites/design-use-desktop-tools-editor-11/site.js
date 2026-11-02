(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-editor-11',
    brand: 'Note Pad',
    nav: 'New Note    My Notes    Settings    Help    Sign Out',
    obstruction: [
      'System Maintenance This Weekend',
      'Our service will be unavailable Saturday 10:00 PM – Sunday 6:00 AM (PT). You can still work now. Save your changes regularly!',
      'Collapse announcement',
    ],
  };
  const palette = { bg: '#f1f8fd', panel: '#ffffff', fg: '#153958', muted: '#5f6a78', line: '#c8cdd5' };
  function announcement(u, onDismiss) {
    const el = u.el('section', 'reference-overlay banner', document.body);
    el.dataset.siteAnnouncement = '';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', D.obstruction[0]);
    u.el('h2', '', el, D.obstruction[0]);
    const copy = u.el('div', 'overlay-copy', el);
    D.obstruction[1].split(/(?<=\.) (?=You )/).forEach((line, i) => u.el('div', 'oc' + i, copy, line));
    const actions = u.el('div', 'overlay-actions', el);
    const dismiss = u.el('button', 'primary', actions, D.obstruction[2]);
    dismiss.type = 'button';
    dismiss.addEventListener('click', onDismiss);
    return { el, dismiss };
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This frame has its own left card and bottom note at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      document.documentElement.style.setProperty('--font', 'Trebuchet MS,Arial,sans-serif');
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
      const ribbon = announcement(u, () => ribbon.el.remove());
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const toolbar = u.el('div', 'site-toolbar', shell);
      Object.assign(_c, { shell, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('header-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('task-note');
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
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.kind === 'banner') {
        document.querySelector('[data-site-announcement]')?.remove();
        return announcement(u, () => ctx.dismiss());
      }
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
      const oc = u.el('div', 'overlay-copy', el);
      if (named && ctx.kind === 'banner') {
        copy.split(/(?<=\.) (?=You )/).forEach((p, i) => u.el('div', 'oc' + i, oc, p));
      } else oc.textContent = copy;
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
      THEMES: { 'design-use-desktop-tools-editor-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#609c35'],
      LOW_ACCENTS: ['#609c35'],
      parts,
    },
  });
})();
