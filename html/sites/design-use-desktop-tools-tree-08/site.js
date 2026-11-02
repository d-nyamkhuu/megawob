(function () {
  'use strict';
  const palette = { bg: '#f1ede7', panel: '#fffefb', fg: '#2e2a25', muted: '#6b645a', line: '#d6cfc0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let display = _c.ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && _c.W < 1200) display = 'header';
      _c.display = display;
      document.body.className = 'instruction-' + display;
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
      const tt = u.el('div', 'g-title', shell);
      u.el('span', 'logo', tt).innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linejoin="round"><path d="M12 4l7 4v8l-7 4-7-4V8Z M5 8l7 4 7-4 M12 12v8 M9 6l7 4"/></svg>';
      u.el('span', 'ttl', tt, 'Files - Projects');
      const wb = u.el('span', 'wb', tt);
      u.el('i', 'mn', wb);
      u.el('i', 'mx', wb);
      u.el('i', 'cl', wb);
      const menu = u.el('nav', 'g-menu', shell);
      for (const t of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help']) u.el('span', '', menu, t);
      const body = u.el('div', 'design-body', shell);
      const tool = u.el('div', 'g-tool', body);
      const ar = (c, d) => '<svg viewBox="0 0 34 30"><path d="' + d + '" fill="' + c + '" stroke="#a05a10" stroke-width="1.5" stroke-linejoin="round"/></svg>';
      const b1 = u.el('span', 'tb', tool);
      b1.innerHTML = ar('#f0a14b', 'M2 15l13-12v7h17v10H15v7z') + 'Back';
      const b2 = u.el('span', 'tb dis', tool);
      b2.innerHTML = ar('#d8d3c8', 'M32 15L19 3v7H2v10h17v7z') + 'Forward';
      const b3 = u.el('span', 'tb', tool);
      b3.innerHTML = ar('#f0a14b', 'M17 1l14 13h-8v15H11V14H3z') + 'Up';
      const loc = u.el('span', 'loc', tool);
      u.el('span', '', loc, '/home/user/projects');
      u.el('span', 'tb', tool).innerHTML = '<svg viewBox="0 0 34 30"><circle cx="14" cy="13" r="8" fill="#fff" stroke="#555" stroke-width="2.5"/><path d="M20 19l9 8" stroke="#555" stroke-width="3.5" stroke-linecap="round"/></svg>Search';
      const vw = u.el('span', 'vw', tool);
      u.el('b', 'on', vw);
      u.el('b', '', vw);
      const cols = u.el('div', 'g-cols', body);
      [['Name', '1%'], ['Size', '54.5%'], ['Type', '63.5%'], ['Modified', '81.5%']].forEach((c) => {
        const s = u.el('span', '', cols, c[0]);
        s.style.left = c[1];
      });
      const note = u.el('section', 'task-note mode-' + _c.display, body);
      Object.assign(_c, { shell, menu, body, tool, note, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const act = u.el('div', 'g-act', _c.note);
      u.el('h3', '', act, 'Actions');
      u.el('div', '', act).innerHTML = '<i></i><span>Use the pointer to click items</span>';
      u.el('div', '', act).innerHTML = '<i class="kb"></i><span>You can use the keyboard (shortcuts work)</span>';
      u.el('div', '', act).innerHTML = '<i></i><span>Use the mouse wheel to scroll if needed</span>';
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'stage', _c.body); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.note.prepend(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('g-foot');
      _c.note.appendChild(foot);
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
    name: 'design-use-desktop-tools-tree-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#e8761a'], LOW_ACCENTS: ['#e8761a'], parts },
  });
})();
