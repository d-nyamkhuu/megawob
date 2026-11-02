(function () {
  'use strict';
  const palette = { bg: '#cfcbc3', panel: '#cfcbc3', fg: '#111', muted: '#555', line: '#8a867e' };
  const ICO = {
    Open: '<svg viewBox="0 0 36 40"><path d="M3 7h11l4 5h15v25H3z" fill="#f4db77" stroke="#20395f" stroke-width="2"/><path d="M5 35V9h8l4 5h14" fill="none" stroke="#fff8cc" stroke-width="2"/></svg>',
    Up: '<svg viewBox="0 0 36 40"><path d="M18 2L6 17h8v16h8V17h8zM6 37h24" fill="#92918b" stroke="#92918b" stroke-width="2"/></svg>',
    'New Folder': '<svg viewBox="0 0 42 40"><path d="M2 5h13l4 5h18v25H2z" fill="#f4db77" stroke="#393424" stroke-width="2"/><path d="M4 33V7h10l4 5h17" fill="none" stroke="#fff5c4"/><path d="M27 22h7v7h7v7h-7v4h-7v-4h-7v-7h7z" fill="#285194" stroke="#e8e8da"/></svg>',
    Delete: '<svg viewBox="0 0 36 40"><path d="M6 10h24M13 7V3h10v4M8 13h20v24H8zM13 16v17M18 16v17M23 16v17" fill="none" stroke="#93928e" stroke-width="3"/></svg>',
    View: '<svg viewBox="0 0 36 40"><path d="M4 2h28v36H4z" fill="#d9d7cd" stroke="#222" stroke-width="2"/><path d="M8 8h4M8 15h4M8 22h4M8 29h4M16 8h12M16 15h12M16 22h12M16 29h12" stroke="#222" stroke-width="2"/></svg>',
  };
  function styleControls(parent, top) {
    for (const el of parent.querySelectorAll('.ref-submit, .ref-endlink, .ref-float')) {
      el.classList.add('end-control');
      if (top) el.classList.add('end-nav');
    }
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Helvetica,Arial,sans-serif');
      document.documentElement.style.setProperty('--button-fg', '#000');
      // Episodes reuse the body; discard the previous note mode before layout.
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('side-left', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      shell.classList.toggle('finish-mode', !!_c.ctx.finish);
      const title = u.el('header', 'design-header', shell);
      const ti = u.el('span', 'mx-ticon', title);
      for (let i = 0; i < 3; i++) u.el('i', '', ti);
      u.el('div', 'design-brand', title, 'File Browser');
      const wb = u.el('span', 'mx-wbtns', title);
      for (const g of ['_', '▢', '✕']) u.el('b', '', wb, g);
      const note = u.el('section', 'task-note');
      note.hidden = _c.display === 'hidden';
      if (!note.hidden) u.el('h2', '', note, 'Task');
      Object.assign(_c, { shell, header: note });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'design-nav', _c.shell);
      for (const t of ['File', 'Edit', 'View', 'Go', 'Bookmarks']) {
        const s = u.el('span', '', nav);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      }
      u.el('span', 'mx-help', nav).innerHTML = '<u>H</u>elp';
      _c.toolbar = nav;
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
      styleControls(_c.headerTools, true);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
      _c.body.appendChild(_c.header);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      if (_c.display === 'header' || _c.display === 'panel') {
        const u = _c.util;
        u.el('hr', '', _c.header);
        const l1 = u.el('div', 'mx-kv', _c.header);
        u.el('b', '', l1, 'Location:');
        u.el('span', '', l1, '/home/user');
        const l2 = u.el('div', 'mx-kv', _c.header);
        u.el('b', '', l2, 'Details:');
        u.el('span', '', l2, 'The file is inside one of the subfolders. Browse the tree on the right.');
      }
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
      const u = _c.util;
      const footer = u.el('footer', 'design-footer', _c.shell);
      const acts = u.el('div', 'mx-acts', footer);
      for (const t of ['Open', 'Up', 'New Folder', 'Delete', '|', 'View']) {
        if (t === '|') {
          u.el('i', 'mx-sep', acts);
          continue;
        }
        const b = u.el('button', 'mx-btn' + (t === 'Up' || t === 'Delete' ? ' dis' : ''), acts);
        b.type = 'button';
        b.innerHTML = ICO[t] + '<span>' + t + '</span>' + (t === 'View' ? '<em>▾</em>' : '');
        b.addEventListener('click', () => env.log && env.log('decoy', { what: t }));
      }
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      styleControls(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.footer.appendChild(dock);
        styleControls(dock);
      }
      _c.shell.classList.toggle('has-extra-tools', !!_c.footer.querySelector('.ref-xtra') && !!_c.footer.querySelector('.end-control'));
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
    name: 'design-use-desktop-tools-tree-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#2a3c8c'], LOW_ACCENTS: ['#2a3c8c'], parts,
    },
  });
})();
