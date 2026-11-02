(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-10',
    'brand': 'Oakridge',
    'sub': 'Workspace',
    'tokens': {
      'bg': '#f7f6f0',
      'panel': '#faf9f6',
      'fg': '#10110b',
      'accent': '#ae891f',
      'font': "Georgia,'Times New Roman',serif",
      'line': '#d1cbb9',
      'muted': '#625f58',
      'button-fg': '#fff',
    },
    obstruction: ['Oakridge Notes', 'A short note from the Oakridge team about this workspace.', 'Close'],
  };
  const P = (d) =>
    '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#2f2f1c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    d +
    '</svg>';
  const IC = {
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    folder: '<path d="M3 5h7l2 3h9v13H3z" fill="#dfc16a" stroke="#9f7b16"/><path d="M3 9h18" stroke="#9f7b16"/>',
    upload: '<path d="M12 18V5M6 11l6-6 6 6M5 20h14"/>',
    download: '<path d="M12 4v13M6 11l6 6 6-6M5 20h14"/>',
    cut: '<circle cx="7" cy="18" r="3"/><circle cx="17" cy="18" r="3"/><path d="M8.5 15.5L17 3M15.5 15.5L7 3"/>',
    copy: '<rect x="9" y="9" width="11" height="12" rx="1"/><path d="M5 15V4h10"/>',
    paste: '<rect x="5" y="5" width="14" height="16" rx="1"/><path d="M9 3h6v4H9z"/>',
    del: '<path d="M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12M4 6h1M4 12h1M4 18h1"/>',
    grid: '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>',
    sort: '<path d="M7 20V5M4 8l3-3 3 3M17 4v15M14 16l3 3 3-3"/>',
    gear: '<path d="M10 2h4l.6 3 2 .9 2.6-1.5 2 3.5-2.2 2 .2 2.2 2.4 1.8-2 3.5-2.8-1-1.8 1.2-.4 3.4h-4l-.6-3-2-.9-2.6 1.5-2-3.5 2.2-2-.2-2.2L1 9.1l2-3.5 2.8 1 1.8-1.2z"/><circle cx="12" cy="12" r="3"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 015 .3c0 1.7-2.5 2-2.5 3.7M12 17v.5"/>',
    leaf: '<path d="M10 11C5 9 4 4 9 1c4 4 4 7 1 10" fill="#96894b" stroke="none"/><path d="M10 21C3 21 1 14 1 9c7 0 10 5 9 12M10 20C9 8 15 5 23 3c-1 12-5 18-13 17" fill="#4f5737" stroke="none"/><path d="M10 22 18 8M10 21 4 12M10 12 9 5M12 17 19 14" stroke="#e9e7d4" stroke-width=".6"/>',
    book: '<path d="M3 5h7a2 2 0 012 2v13a2 2 0 00-2-2H3zM21 5h-7a2 2 0 00-2 2v13a2 2 0 012-2h7z"/>',
  };
  const GROUPS = [
    [
      'File',
      [
        ['New File', 'file'],
        ['New Folder', 'folder'],
        ['Upload', 'upload'],
        ['Download', 'download'],
      ],
    ],
    [
      'Edit',
      [
        ['Cut', 'cut'],
        ['Copy', 'copy'],
        ['Paste', 'paste'],
        ['Delete', 'del'],
      ],
    ],
    [
      'View',
      [
        ['List View', 'list'],
        ['Grid View', 'grid'],
      ],
    ],
    [
      'Sort',
      [
        ['Sort A–Z', 'sort'],
        ['Sort Z–A', 'sort'],
      ],
    ],
    [
      'More',
      [
        ['Preferences', 'gear'],
        ['Help', 'help'],
      ],
    ],
  ];
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
      const display = _c.display;
      document.body.className = 'q-shell q-display-' + display + (display === 'hidden' ? ' q-hidden' : '');
      const shell = u.el('div', 'site-shell q-display-' + display, document.body);
      const header = u.el('header', 'q-header', shell);
      const br = u.el('div', 'q-brand', header);
      br.innerHTML = P(IC.leaf)
        .replace('width="30" height="30"', 'width="38" height="38"')
        .replace(/#2f2f1c/, '#4a5a20');
      u.el('span', 'q-name', br, D.brand);
      u.el('span', 'q-sub', br, D.sub);
      const right = u.el('div', 'q-right', header);
      u.el('span', '', right, 'Project Explorer');
      u.el('i', 'q-sep', right);
      u.el('span', 'q-av', right, 'JD');
      u.el('span', 'q-chev', right, '⌄');
      Object.assign(_c, { shell, right, header });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const rib = u.el('nav', 'q-ribbon', _c.shell);
      for (const [g, items] of GROUPS) {
        const grp = u.el('div', 'q-group', rib);
        const row = u.el('div', 'q-items', grp);
        for (const [n, ic] of items) {
          const b = u.el('div', 'q-tool', row);
          b.innerHTML = P(IC[ic]);
          u.el('span', '', b, n);
        }
        u.el('div', 'q-gname', grp, g);
      }
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'header') {
        _c.header = _c.util.el('div', 'q-header-note', _c.shell);
        _c.util.el('span', 'q-note-kicker', _c.header, 'Project note');
      }
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('q-header-copy');
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.right;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      const footer = u.el('footer', 'q-footer', _c.shell);
      const st = u.el('div', 'q-status', footer);
      u.el('i', 'q-dot', st);
      u.el('span', '', st, 'Ready');
      u.el('em', '', st, '|');
      u.el('span', '', st, 'Project: learning-project');
      u.el('em', '', st, '|');
      u.el('span', '', st, '0 files open');
      Object.assign(_c, { body, footer });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('q-task-panel');
        const title = panel.querySelector('.ref-panel-title');
        title.classList.add('q-panel-title');
        title.textContent = 'Project note';
        panel.querySelector('.ref-panel-text').classList.add('q-panel-copy');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note', 'q-note-toast');
        const ic = _c.util.el('span', 'q-bk');
        ic.innerHTML = P(IC.book).replace('width="30" height="30"', 'width="26" height="26"');
        note.prepend(ic);
        _c.footer.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.footer.appendChild(foot);
      foot.querySelector('.ref-foot-text').hidden = true;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  const palette = { bg: '#f7f6f0', panel: '#faf9f6', fg: '#10110b', muted: '#625f58', line: '#d1cbb9' };
  env.site({
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#ae891f'],
      LOW_ACCENTS: ['#ae891f'],
      parts,
    },
  });
})();
