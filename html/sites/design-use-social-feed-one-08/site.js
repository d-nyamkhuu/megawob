(function () {
  'use strict';
  const palette = { bg: '#eef0f6', panel: '#ffffff', fg: '#1b2033', muted: '#6a7388', line: '#e4e7ef' };
  const targetIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12l7-7M16 4.500V8h3.500"/></svg>';
  function decorateNote(_c, note, text) {
    note.classList.add('task-note', 'mode-' + _c.display);
    text.classList.add('task-copy');
    const icon = _c.util.el('span', 'task-clipboard');
    icon.innerHTML = targetIcon;
    note.prepend(icon);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated instruction position in every mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Roboto,"Helvetica Neue",Arial,sans-serif');
      document.body.classList.add('bottom', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const chrome = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', chrome);
      brand.innerHTML = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M23 4.6a9 9 0 0 1-2.6.7 4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.9 1.1 4.5 4.5 0 0 0-7.7 4.1A12.800 12.800 0 0 1 2.5 3.300a4.500 4.500 0 0 0 1.400 6 4.500 4.500 0 0 1-2-.6v.1a4.500 4.500 0 0 0 3.600 4.400 4.500 4.500 0 0 1-2 .1 4.500 4.500 0 0 0 4.200 3.100A9 9 0 0 1 1 18.300a12.800 12.800 0 0 0 6.900 2c8.300 0 12.800-6.900 12.800-12.800v-.6A9 9 0 0 0 23 4.600z"/></svg>';
      u.el('span', '', brand, 'Chirp');
      const nav = u.el('nav', 'design-nav', chrome);
      ['Home', 'Explore', 'Notifications', 'Messages'].forEach((n, i) => {
        const a = u.el('span', 'nav-item' + (i === 0 ? ' on' : ''), nav, n);
        if (i) a.addEventListener('click', () => env.log('decoy', { what: n }));
      });
      const me = u.el('div', 'design-me', chrome);
      me.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#e8eaf6"/><circle cx="12" cy="9.500" r="3.800" fill="#3f51b5"/><path d="M4.500 19.500c1.500-3.600 4.300-5 7.500-5s6 1.400 7.500 5a10 10 0 0 1-15 0z" fill="#3f51b5"/></svg>';
      const noteSlot = u.el('div', 'note-slot');
      Object.assign(_c, { shell, chrome, header: noteSlot, noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const text = _c.util.el('p', '', null, note.textContent);
        note.textContent = '';
        note.appendChild(text);
        decorateNote(_c, note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.chrome;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'design-body', _c.shell);
      body.appendChild(_c.noteSlot);
      // The feed painter updates these hidden compatibility fields.
      const meta = _c.util.el('dl', 'task-meta', body);
      meta.hidden = true;
      for (const c of ['action', 'target-author', 'post-starts-with', 'status']) {
        _c.util.el('dd', 'detail-' + c, meta);
      }
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const note = _c.noteSlot.querySelector('.ref-panel');
      if (note) decorateNote(_c, note, note.querySelector('.ref-panel-text'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.noteSlot.appendChild(note);
        decorateNote(_c, note, note.querySelector('.ref-note-text'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.shell.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      const [title, copy, label] = texts[ctx.kind];
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-social-feed-one-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-social-feed-one-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3f51b5'],
      LOW_ACCENTS: ['#3f51b5'],
      parts,
    },
  });
})();
