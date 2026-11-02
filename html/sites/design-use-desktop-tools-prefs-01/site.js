(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-prefs-01', brand: 'DeskMate',
    nav: 'File    Edit    View    Tools    Window    Help',
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close']
  };
  const palette = { bg: '#fff', panel: '#fff', fg: '#111', muted: '#333', line: '#111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'desktop instruction-' + _c.display;
      _c.root.style.setProperty('--font', '"Courier New",monospace');
      _c.root.style.setProperty('--button-fg', '#111');
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
      const titleline = u.el('div', 'titleline', header);
      u.el('span', 'app-mark', titleline, '▤');
      u.el('div', 'design-brand', titleline, D.brand);
      u.el('div', 'window-controls', titleline, '□ □ ×');
      u.el('nav', 'design-nav', header, D.nav);
      const toolbar = u.el('div', 'desktop-toolbar', shell);
      for (const [icon, label] of [['▯','New'],['▱','Open'],['▣','Save'],['✂','Cut'],['▤','Copy'],['▣','Paste'],['▥','Delete'],['⌕','Find'],['▦','Preferences']]) {
        const item = u.el('div', 'toolbar-item', toolbar);
        u.el('b', '', item, icon); u.el('span', '', item, label);
      }
      const note = u.el('section', 'task-note');
      note.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, titleline, toolbar, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.titleline;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'desktop-body', _c.shell);
      const left = u.el('aside', 'workspace-left', body);
      const tree = u.el('section', 'workspace-tree', left);
      u.el('h2', '', tree, 'Workspace');
      u.el('div', 'tree-content', tree, '▾ ▣ DeskMate\n　▸ ▰ Documents\n　　└ ▤ Notes.txt\n　　└ ▤ Plans.txt\n　　└ ▤ Budget.txt\n　▸ ▰ Projects\n　　└ ▤ App Ideas.txt\n　　└ ▤ Readme.txt\n　▸ ▰ Calendar\n　　└ ▦ Daily\n　　└ ▦ Weekly\n　▸ ▰ Utilities\n　　└ ▧ Terminal\n　　└ ▧ Calculator');
      const cal = u.el('section', 'workspace-calendar', left);
      u.el('h2', '', cal, 'Calendar - April 1988');
      u.el('div', 'calendar-content', cal, '◀　　 April 1988　　 ▶\nSun  Mon  Tue  Wed  Thu  Fri  Sat\n　　 　　 　　 　　 　　  1　 2\n 3　 4　 5　 6　 7　 8　 9\n10　11　12　13　14　15　16\n17　18　19　20　21　22　23\n24　25　26　27　28　29　30');
      body.appendChild(_c.header);
      const center = u.el('div', 'workspace-center', body);
      u.el('div', 'document-tab', center, '▤　Notes.txt　×');
      Object.assign(_c, { body, center });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'desktop-stage', _c.center);
      const terminal = u.el('section', 'workspace-terminal', _c.center);
      u.el('h2', '', terminal, 'Terminal');
      u.el('pre', '', terminal, "Welcome to DeskMate.\nType 'help' for a list of commands.\n\n> ▋");
      const inspector = u.el('aside', 'workspace-inspector', _c.body);
      u.el('h2', '', inspector, 'File Info');
      u.el('div', 'inspector-file', inspector, '▤　Notes.txt\n\nKind:　　 Text Document\nSize:　　 2 KB\nModified: Apr 14, 1988  9:12 AM\nCreated:　Apr 10, 1988  4:36 PM');
      u.el('div', 'inspector-attrs', inspector, 'Attributes:\n☒ Locked\n□ Read only');
      u.el('div', 'inspector-comments', inspector, 'Comments:\nGeneral notes and ideas\nfor the project.');
      u.el('div', 'inspector-related', inspector, 'Related Files:\n▤ Plans.txt\n▤ Budget.txt\n▤ App Ideas.txt\n▤ Readme.txt');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  env.site({
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-desktop-tools-prefs-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts
    }
  });
})();
