(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-calendar-04',
    brand: 'ACME',
    tabs: ['Calendar', 'Documents', 'Projects', 'Tasks', 'Contacts', 'Reports', 'Administration'],
    links: ['Help', 'My Account', 'Contact Us', 'Log Out'],
    obstruction: ['ACME Partner Bulletin', 'Extranet maintenance is scheduled for this weekend.', 'Close'],
  };
  const palette = { bg: '#0b2f5c', panel: '#f2f4f8', fg: '#0a1038', muted: '#3a4352', line: '#b3bccb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This notebook has its own full-width instruction card and corner note.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Tahoma,Verdana,Arial,sans-serif');
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('notebook', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', chrome, D.brand);
      u.el('div', 'design-sub', chrome, 'Business Partner Extranet');
      const links = u.el('nav', 'design-links', chrome);
      D.links.forEach((l, i) => {
        if (i) u.el('span', 'sep', links, '|');
        u.el('span', 'lnk', links, l);
      });
      u.el('div', 'design-date', chrome, 'Mon, Apr 12, 1999');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden' || _c.display === 'toast';
      const toolbar = u.el('div', 'design-toolbar', shell);
      Object.assign(_c, { shell, chrome, notebookBody: body, header: note, toolbar });
    },
    'frame.nav': () => (_c) => {
      const tabs = _c.util.el('nav', 'nb-tabs', _c.shell);
      D.tabs.forEach((t, i) => {
        _c.util.el('div', 'nb-tab' + (i === 0 ? ' on' : ''), tabs, t);
        _c.util.el('i', 'ring', tabs).style.setProperty('--i', i);
      });
      for (let i = D.tabs.length; i < 14; i++) _c.util.el('i', 'ring', tabs).style.setProperty('--i', i);
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.notebookBody; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'stage', _c.body); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        if (_c.W < 1200) _c.body.insertBefore(note, _c.stage);
        else _c.shell.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('design-footer');
        const status = foot.querySelector('.ref-foot-text');
        if (status) status.textContent = 'Ready';
        _c.shell.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#8ec3f0'],
      LOW_ACCENTS: ['#8ec3f0'],
      parts,
    },
  });
})();
