(function () {
  'use strict';
  const palette = { bg: '#f3f4f5', panel: '#ffffff', fg: '#1e2938', muted: '#5e6779', line: '#bebebe' };
  const D = {
    obstruction: [
      'Layout could not be restored',
      'Your previous layout could not be restored. Some panels may be out of place. Click Use default layout to continue using the workspace.',
      'Use default layout',
    ],
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'top instruction-' + _c.display;
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
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header, 'Social');
      u.el('span', '', brand, 'Flow');
      const nv = u.el('nav', 'design-nav', header);
      ['Inbox', 'Publish', 'Analytics', 'Settings'].forEach((t, i) =>
        u.el('span', 'nv' + (i === 0 ? ' on' : ''), nv, t),
      );
      const ut = u.el('div', 'design-util', header);
      u.el('span', 'nv help', ut, 'Help');
      u.el('span', 'nv', ut, 'Sign out');
      const sub = u.el('div', 'design-sub', shell);
      u.el('b', '', sub, 'Mentions');
      u.el('span', 'mbadge', sub, '5');
      ['All', 'Unread', 'Flagged'].forEach((t) => u.el('span', 'sf', sub, t));
      const sq = u.el('div', 'sq', sub);
      u.el('span', '', sq, 'Search posts...');
      sq.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#555" stroke-width="2"/><path d="M12 12l6 6" stroke="#555" stroke-width="2"/></svg>');
      const body = u.el('div', 'design-body', shell);
      const noteHost = u.el('div', 'note-host', body);
      Object.assign(_c, { shell, sub, body, header: noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.sub;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const label = foot.querySelector('.ref-foot-text');
      label.classList.add('footer-label');
      label.textContent = '0 of 5 selected';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.prepend(dock);
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
      const h2 = u.el('h2', '', el);
      h2.insertAdjacentHTML(
        'beforeend',
        '<svg viewBox="0 0 48 44" width="46" height="42"><path d="M24 3L46 41H2Z" fill="#f5b21a" stroke="#e29a0a" stroke-width="3" stroke-linejoin="round"/><rect x="21.5" y="15" width="5" height="14" rx="2" fill="#fff"/><circle cx="24" cy="34" r="3" fill="#fff"/></svg>',
      );
      h2.append(title);
      const cp = u.el('div', 'overlay-copy', el);
      if (named && copy === named[1]) {
        const i = copy.indexOf('Click ');
        u.el('p', '', cp, copy.slice(0, i).trim() || copy);
        const p2 = u.el('p', '', cp);
        p2.append('Click ');
        u.el('b', '', p2, label);
        p2.append(' to continue using the workspace.');
      } else cp.textContent = copy;
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
      if (named && copy === named[1] && ctx.kind !== 'cookie') {
        const nn = u.el('button', '', actions, 'Not now');
        nn.type = 'button';
        nn.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-social-feed-all-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-use-social-feed-all-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#337ab7'],
      LOW_ACCENTS: ['#337ab7'],
      parts,
    },
  });
})();
