(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-files-05', brand: 'WorkSpace', mode: 'dock',
    tokens: { bg: '#0b1018', panel: '#121a24', fg: '#e6ebf2', accent: '#6fdc6f', font: 'Inter,"Segoe UI",Arial,sans-serif', line: '#243040', muted: '#8d99a8', 'button-fg': '#06210b' },
    nav: 'Terminal    Edit    Settings    Help',
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'], footer: ''
  };
  const parts = {
    'frame.theme': (base, S) => function (_c) {
      base(_c);
      for (const [k, v] of Object.entries(D.tokens)) _c.root.style.setProperty('--' + k, v);
    },
    'frame.header': (base, S) => function (_c) {
      const { ctx } = _c;
      const u = ctx.util, root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const NAVS = ['Files', 'Terminal', 'Notes', 'Calendar', 'Preferences'];
      const ICO = {
        Files: '<svg viewBox="0 0 24 24"><path d="M2 5h7l2 2h11v12H2z" fill="#6fdc6f"/></svg>',
        Terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6l6 6-6 6M12 19h8"/></svg>',
        Notes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h8l4 4v14H6zM9 12h6M9 16h6"/></svg>',
        Calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>',
        Preferences: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="m9 2-1 3-3-1-2 3 2 2-1 3-2 1 1 4 3 0 2 2 0 3 4 1 1-3 3-1 2 1 3-3-2-2 1-3 2-1-1-4-3 0-2-2 0-3z"/><circle cx="12" cy="12" r="3.5"/></svg>'
      };
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      brand.innerHTML = '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="8" height="8" rx="2" fill="#d1e3e9"/><rect x="14" y="2" width="8" height="8" rx="2" fill="#477f43" stroke="#86dd79"/><rect x="2" y="14" width="8" height="8" rx="2" fill="#7ce778"/><rect x="14" y="14" width="8" height="8" rx="3" fill="#223c29" stroke="#64b95d"/></svg><span>WorkSpace</span>';
      const body = u.el('div', 'design-body', shell);
      const side = u.el('nav', 'side-nav', body);
      NAVS.forEach(n => { const a = u.el('div', 'side-item' + (n === 'Files' ? ' on' : ''), side); a.innerHTML = ICO[n] + '<span>' + n + '</span>'; });
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const dock = u.el('div', 'dock', footer);
      NAVS.forEach(n => { const a = u.el('div', 'dock-item', dock); a.innerHTML = ICO[n] + '<span>' + n + '</span>'; });

      Object.assign(_c, { header, body, stage, side, footer });
    },
    'frame.nav': (base, S) => function (_c) {},
    'frame.instruction': (base, S) => function (_c) {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        note.dataset.role = 'instruction';
      }
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.headerTools.classList.add('chrome-actions', 'header-actions');
    },
    'frame.body': (base, S) => function (_c) {},
    'frame.panel': (base, S) => function (_c) {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const note = _c.side.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note');
        note.dataset.role = 'instruction';
      }
    },
    'frame.stage': (base, S) => function (_c) {},
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.dataset.role = 'instruction';
        _c.header.append(note);
      }
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
        _c.footer.append(foot);
      }
    },
    overlay: (base, S) => function (ctx) {
      const u = ctx.util, named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement']
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
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
    }
  };
  env.site({ name: D.site, template: 'site/base', design: { parts } });
})();
