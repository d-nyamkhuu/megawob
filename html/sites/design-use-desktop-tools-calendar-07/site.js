(function () {
  'use strict';
  const palette = { bg: '#271e3a', panel: '#271e3a', fg: '#f1edf8', muted: '#a89fbd', line: '#3d3354' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.dataset.display = _c.display;
      document.body.className = 'dock instruction-' + _c.display;
      document.documentElement.style.setProperty('--font', "'Segoe UI Variable','Segoe UI',Inter,Arial,sans-serif");
      document.documentElement.style.setProperty('--button-fg', '#1d1020');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const toolbar = u.el('header', 'design-header', shell);
      const lg = u.el('span', 'design-logo', toolbar);
      lg.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4M12 12v5M9.5 14.5h5"/></svg>';
      u.el('div', 'design-brand', toolbar, 'CalDesk');
      const nav = u.el('nav', 'design-nav', toolbar);
      for (const t of ['File', 'Edit', 'View', 'Help']) u.el('span', '', nav, t);
      const wc = u.el('span', 'win-ctl', toolbar);
      wc.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 8h10"/></svg><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3.5" y="5" width="7.5" height="7.5"/><path d="M5.5 5V3.5h7V10.5H11"/></svg><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>';
      const body = u.el('div', 'design-body');
      Object.assign(_c, { shell, toolbar, body, header: body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.shell.appendChild(_c.body); },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'stage', _c.body); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.body.appendChild(note);
      }
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
      const u = ctx.util;
      const named = ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'];
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
    name: 'design-use-desktop-tools-calendar-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-desktop-tools-calendar-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#fa6272'],
      LOW_ACCENTS: ['#fa6272'],
      parts,
    },
  });
})();
