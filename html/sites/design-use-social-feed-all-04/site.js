// Motif workstation frame on the shared site template.
(function () {
  'use strict';
  const palette = {
    bg: '#d9d8d2', panel: '#dedcd6', fg: '#111', accent: '#2a3a6a',
    font: 'Helvetica,Arial,sans-serif', line: '#8e8c86', muted: '#444',
  };
  const ICON = {
    home: '<path d="M3 11L12 3l9 8M5 10v11h14V10M10 21v-7h4v7"/>',
    back: '<path d="M20 9H11V5l-8 7 8 7v-4h9z" fill="currentColor" stroke="none"/>',
    fwd: '<path d="M4 9h9V5l8 7-8 7v-4H4z" fill="currentColor" stroke="none"/>',
    reload: '<path d="M4 10a8 8 0 0 1 14-4M20 14a8 8 0 0 1-14 4M18 2v5h-5M6 22v-5h5" stroke-width="2.4"/>',
    posts: '<rect x="1" y="3" width="22" height="18"/><path d="M4 7h16M4 11h16M4 15h16M4 18h16M8 4v16"/>',
    media:
      '<rect x="2" y="2" width="20" height="20"/><circle cx="8" cy="7" r="2" fill="currentColor"/><path d="M4 19l5-6 3 2 4-6 4 10z" fill="currentColor" stroke="none"/><path d="M13 4l5 2-2 3"/>',
    users:
      '<circle cx="8" cy="8" r="3.5" fill="currentColor"/><circle cx="16" cy="9" r="3" fill="currentColor"/><path d="M2 20c0-5 12-5 12 0M13 20c0-4 9-4 9 0" fill="currentColor"/>',
    search: '<circle cx="14" cy="9" r="6"/><path d="M10 14l-7 7" stroke-width="3"/>',
    like: '<path d="M12 21C4 14 2 10 2 7a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 3-2 7-10 14z" fill="currentColor"/>',
    repost: '<path d="M5 14V5h14M15 1l4 4-4 4M19 10v9H5M9 15l-4 4 4 4" stroke-width="2.2"/>',
    follow:
      '<circle cx="9" cy="8" r="4" fill="currentColor"/><path d="M1 21c0-7 16-7 16 0z" fill="currentColor"/><path d="M19 7v8M15 11h8" stroke-width="2.4"/>',
    mute: '<path d="M3 9h4l6-5v16l-6-5H3z" fill="currentColor"/><path d="M17 6v12"/><path d="M3 23L23 1" stroke="#cbc9c4" stroke-width="5"/><path d="M3 23L23 1" stroke-width="2.6"/>',
    win: '<rect x="4" y="4" width="16" height="16" stroke-width="2.2"/>',
    tear: '<rect x="4" y="4" width="16" height="16" stroke-width="2"/><path d="M4 9h16"/>',
    pref: '<path d="M10 1h4l1 4 3-2 3 3-2 3 4 1v4l-4 1 2 3-3 3-3-2-1 4h-4l-1-4-3 2-3-3 2-3-4-1v-4l4-1-2-3 3-3 3 2z" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="4" fill="#cbc9c4" stroke="none"/>',
  };
  const GROUPS = [
    [
      'Navigation',
      [
        ['Home', 'home'],
        ['Back', 'back'],
        ['Forward', 'fwd', 1],
        ['Reload', 'reload'],
      ],
    ],
    [
      'View',
      [
        ['Posts', 'posts', 2],
        ['Media', 'media'],
        ['Users', 'users'],
        ['Search', 'search'],
      ],
    ],
    ['Filter', null],
    [
      'Actions',
      [
        ['Like', 'like'],
        ['Repost', 'repost'],
        ['Follow', 'follow'],
        ['Mute', 'mute'],
      ],
    ],
    [
      'Window',
      [
        ['New Window', 'win'],
        ['Tear Off', 'tear'],
        ['Preferences', 'pref'],
      ],
    ],
  ];

  const parts = {
    'frame.layout': () => function (_c) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const display = _c.ctx.display || 'header';
      document.body.className = 'bottom instruction-' + display;
      Object.assign(_c, { W, H, display, roomy: W >= 1260, tall: H >= 700 });
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      // This workstation always has a status bar and a full-width feed.
      Object.assign(_c, { wantFooter: true, sidebar: false, nav: false });
    },
    'frame.header': () => function (_c) {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const tb = u.el('div', 'mw-title', header);
      const tl = u.el('span', 'mw-sys', tb);
      u.el('span', 'mw-sys-in', tl);
      u.el('span', 'mw-name', tb, 'Social Browser');
      const wc = u.el('span', 'mw-wc', tb);
      for (const g of ['_', '□', '×']) u.el('i', '', wc, g);
      const menu = u.el('nav', 'mw-menu', header);
      for (const m of ['File', 'Edit', 'View', 'Actions', 'Bookmarks', 'Tools', 'Help']) {
        const s = u.el('span', '', menu, m);
        s.addEventListener('click', () => env.log('decoy', { what: m }));
      }
      const rb = u.el('div', 'mw-ribbon', header);
      for (const [name, tools] of GROUPS) {
        const g = u.el('section', 'mw-group g-' + name.toLowerCase(), rb);
        u.el('span', 'mw-gname', g, name);
        const row = u.el('div', 'mw-row', g);
        if (!tools) {
          const f = u.el('div', 'mw-filter', row);
          for (const t of ['All Posts', 'Latest First']) {
            const s = u.el('div', 'mw-sel', f);
            u.el('span', '', s, t);
            u.el('b', '', s, '▼');
            s.addEventListener('click', () => env.log('decoy', { what: t }));
          }
          const c = u.el('label', 'mw-chk', f);
          const bx = u.el('span', 'mw-box', c, '✔');
          u.el('span', '', c, 'Show Images');
          continue;
        }
        for (const [label, key, flag] of tools) {
          const b = u.el('button', 'mw-tool' + (flag === 1 ? ' dis' : '') + (flag === 2 ? ' on' : ''), row);
          b.type = 'button';
          b.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + ICON[key] + '</svg>';
          u.el('span', '', b, label);
          b.addEventListener('click', () => env.log('decoy', { what: label }));
        }
      }

      Object.assign(_c, { shell, header, wc });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => function (_c) {
      base(_c);
      _c.headerTools.className = 'mw-header-tools';
      _c.wc.append(_c.headerTools);
      for (const b of _c.headerTools.children) b.className = 'mw-title-end';
    },
    'frame.body': () => function (_c) {
      const body = _c.util.el('div', 'design-body ref-body' +
        (_c.display === 'panel' ? ' with-task-panel' : ''), _c.shell);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.className = 'task-panel';
        panel.dataset.role = 'instruction';
      }
    },
    'frame.stage': () => function (_c) {
      const stage = _c.util.el('main', 'stage', _c.body);
      Object.assign(_c, { stage });
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const { shell, header, util: u } = _c;
      const footer = document.querySelector('.ref-foot');
      footer.className = 'design-footer';
      shell.append(footer);
      footer.querySelector('.ref-foot-text').remove();
      const acts = footer.querySelector('.ref-tools');
      acts.className = 'mw-acts';
      for (const b of acts.children) {
        b.className = b.dataset.role === 'submit'
          ? (_c.placement === 'link' ? 'end-link' : 'end-control') : 'clear-task';
      }
      const st = u.el('div', 'mw-status');
      for (const text of ['Posts shown', '', '']) u.el('span', '', st, text);
      footer.prepend(st);
      const note = u.el('section', 'task-note');
      note.dataset.role = 'instruction';
      note.hidden = _c.display !== 'header';
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) {
        const p = u.el('p', '', note);
        p.append(...instruction.childNodes);
        instruction.remove();
      }
      header.querySelector('.ref-spacer')?.remove();
      acts.before(note);
      const toast = document.querySelector('.ref-note');
      if (toast) {
        toast.className = 'task-toast';
        toast.dataset.role = 'instruction';
        acts.before(toast);
      }
      // Close is part of the depicted workstation chrome and remains inert.
      _c.decoyBtn(acts, _c.closeLabel);
      acts.lastElementChild.className = 'clear-task';
      Object.assign(_c, { acts });
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        // Keep the alternate end control in reserved status-bar space.
        dock.className = 'mw-end-dock';
        _c.submit.className = 'end-control';
        _c.acts.prepend(dock);
      }
    },
    overlay: () => function (ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
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
    name: 'design-use-social-feed-all-04',
    template: 'site/base',
    design: {
      THEMES: { motif: palette }, LOW_THEME: palette,
      ACCENTS: ['#2a3a6a'], LOW_ACCENTS: ['#2a3a6a'], LANGS: ['en'],
      parts,
    },
  });
})();
