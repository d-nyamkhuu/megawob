(function () {
  'use strict';
  const palette = { bg: '#e7e1d4', panel: '#faf8f3', fg: '#241a12', muted: '#7d7060', line: '#c9bda2' };
  const bubble = '<svg viewBox="0 0 30 30" fill="none"><path d="M5 2h20a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H13l-7 5v-5H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z" fill="#e8dcc0" stroke="#ad9671"/><circle cx="11" cy="13" r="2" fill="#372b1c"/><circle cx="20" cy="13" r="2" fill="#372b1c"/><path d="M18 14l-3 3" stroke="#372b1c" stroke-width="2"/></svg>';
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('bottom', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const win = u.el('div', 'win', shell);
      const tb = u.el('div', 'win-title', win);
      u.el('span', 'ico', tb).innerHTML = bubble;
      u.el('span', '', tb, 'Chatter');
      u.el('span', 'ctl', tb).innerHTML = '<svg viewBox="0 0 20 20"><path d="M3 14h14" stroke="#eee6db" stroke-width="1.4"/></svg><svg viewBox="0 0 20 20"><rect x="4" y="4" width="13" height="13" fill="none" stroke="#eee6db" stroke-width="1.4"/></svg><svg viewBox="0 0 20 20"><path d="M4 4l12 12M16 4L4 16" stroke="#eee6db" stroke-width="1.4"/></svg>';
      const note = u.el('section', 'task-note', shell);
      note.hidden = _c.display === 'hidden';
      if (_c.display === 'panel') note.classList.add('episode-panel');
      if (_c.display === 'toast') note.classList.add('episode-toast');
      if (_c.display === 'header') u.el('h2', '', note, 'Your Task');
      Object.assign(_c, { shell, win, tb, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { _c.body = _c.win; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Your Task';
      _c.body = body;
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'stage', _c.win); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.util.el('h2', '', note, 'Your Task');
        note.insertBefore(note.lastChild, note.firstChild);
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = u.el('footer', 'design-footer', _c.shell);
      u.el('span', 'tb-orb', footer).innerHTML = '<svg viewBox="0 0 32 32"><path d="M3 4q7-3 12 0v11q-5-3-12 0z" fill="#dc7742"/><path d="M17 4q6 3 12 0v11q-6 3-12 0z" fill="#70ad66"/><path d="M3 17q7-3 12 0v11q-5-3-12 0z" fill="#5c9fd2"/><path d="M17 17q6 3 12 0v11q-6 3-12 0z" fill="#efc952"/></svg>';
      u.el('span', 'tb-folder', footer).innerHTML = '<svg viewBox="0 0 34 31"><path d="M1 2h12l3 4h16v23H1z" fill="#d4aa58" stroke="#efcf80"/><path d="M2 9h30v20H2z" fill="#efd082"/><path d="M12 17h12v12H12z" fill="#5f98b4"/><path d="M15 18h6v5h-6z" fill="#ddebf1"/></svg>';
      const app = u.el('span', 'tb-app', footer);
      u.el('i', '', app).innerHTML = bubble;
      u.el('span', '', app, 'Chatter');
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      u.el('span', 'tb-tray', footer).innerHTML = '<svg viewBox="0 0 24 24" fill="#eee"><path d="M3 8h5l6-5v18l-6-5H3z"/><path d="M17 8v8" stroke="#eee" stroke-width="2"/></svg><svg viewBox="0 0 24 24" fill="#eee"><path d="M2 8h5l6-5v18l-6-5H2z"/><path d="M16 7q7 5 0 10M19 3q10 9 0 18" fill="none" stroke="#eee" stroke-width="1.5"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="#eee" stroke-width="1.6"><path d="M2 3h20v15H2zM8 22h8M12 18v4M5 14l4-4 3 2 6-6"/></svg>';
      const clk = u.el('div', 'tb-clock', footer);
      u.el('div', '', clk, '10:24 AM');
      u.el('div', '', clk, 'Apr 12, 2011');
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-use-social-feed-menu-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#b8943f'], LOW_ACCENTS: ['#b8943f'], parts,
    },
  });
})();
