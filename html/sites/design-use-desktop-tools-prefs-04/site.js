(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#151521', muted: '#8d929b', line: '#cdd1d6', font: 'Arial, "Helvetica Neue", sans-serif', 'button-fg': '#151521' };
  const D = { obstruction: null };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'desktop instruction-' + _c.display;
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
      const header = u.el('header', 'design-header', shell);
      const titlebar = u.el('div', 'desktop-titlebar', header);
      u.el('span', 'window-dots', titlebar, '●  ●  ●');
      const title = u.el('div', 'design-brand', titlebar, 'MyWorkspace  ▾');
      title.title = 'Workspace menu';
      title.addEventListener('click', () => document.querySelector('.at-appmenu')?.click());
      const toolbar = u.el('div', 'desktop-toolbar', header);
      const nav = u.el('nav', 'design-nav', toolbar);
      for (const [icon, label] of [['▰','Files'],['✎','Editor'],['◉','Tasks'],['▦','Calendar'],['▣','Terminal']]) {
        const tab = u.el('div', 'desktop-tab', nav);
        u.el('span', 'desktop-tab-icon', tab, icon);
        u.el('span', '', tab, label);
      }
      u.el('div', 'desktop-search', toolbar, '⌕　Search');
      const gear = u.el('button', 'desktop-gear', toolbar, '⚙');
      gear.type = 'button';
      gear.title = 'Settings';
      gear.addEventListener('click', () => document.querySelector('.at-rail .end')?.click());
      const body = u.el('div', 'design-body');
      Object.assign(_c, { shell, header: toolbar, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.body;
      base(_c);
      _c.header = header;
      const note = _c.body.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.body': () => (_c) => { _c.shell.appendChild(_c.body); },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
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
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('footer-label');
      text.textContent = 'Ready';
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
    name: 'design-use-desktop-tools-prefs-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'yosemite.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#0095ff'], LOW_ACCENTS: ['#0095ff'], parts
    }
  });
})();
