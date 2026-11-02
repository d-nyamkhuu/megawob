(function () {
  'use strict';
  const D = {
    site: 'design-use-desktop-tools-files-01', brand: 'WorkHub',
    obstruction: ['WorkHub News', 'Be the first to know. Get news, tips and updates from the WorkHub team.', 'Close']
  };
  const palette = { bg: '#FBF8F1', panel: '#fff', fg: '#080D49', muted: '#585C91', line: '#D8D8DE' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Each display has its own established spot, including on small screens.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('memphis', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      u.el('div', 'memphis-decor', shell);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      u.el('i', 'logo-triangle', brand); u.el('i', 'logo-circle', brand); u.el('i', 'logo-square', brand);
      u.el('b', '', brand, D.brand);
      const account = u.el('div', 'account', header);
      u.el('span', 'bell', account, '♧'); u.el('span', 'avatar', account, 'JD');
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const text = note.textContent;
        note.textContent = '';
        _c.util.el('p', '', note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('header-actions');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      const tabs = u.el('nav', 'hub-tabs', body);
      for (const [label, icon] of [['Files','▰'],['Editor','▣'],['Terminal','›_'],['Calendar','▦'],['Preferences','⚙']]) {
        const t = u.el('div', 'hub-tab' + (label === 'Files' ? ' active' : ''), tabs);
        u.el('strong', '', t, icon); u.el('span', '', t, label);
      }
      const workarea = u.el('div', 'workarea', body);
      const stats = u.el('aside', 'left-stats', workarea);
      u.el('b', '', stats, '▯  8'); u.el('span', '', stats, 'Files');
      u.el('b', '', stats, '▱  4'); u.el('span', '', stats, 'Folders');
      u.el('b', '', stats, '◷  12'); u.el('span', '', stats, 'Total items');
      Object.assign(_c, { body, workarea });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.workarea);
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
      foot.querySelector('.ref-foot-text').classList.add('footer-label');
      _c.shell.appendChild(foot);
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
      THEMES: { 'design-use-desktop-tools-files-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#238CFF'],
      LOW_ACCENTS: ['#238CFF'],
      parts
    }
  });
})();
