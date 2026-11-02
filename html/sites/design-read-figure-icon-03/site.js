(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-icon-03',
    title: 'Assets',
    menu: ['Home', 'Files', 'Icons', 'Photos', 'Documents', 'Shared'],
    note: 'Icon Sets',
    categories: [
      ['All Icons', '120'],
      ['Actions', '24'],
      ['Alerts', '12'],
      ['Arrows', '16'],
      ['Communication', '14'],
      ['Devices', '16'],
      ['Editing', '18'],
      ['Files & Folders', '20'],
      ['People', '12'],
      ['Status', '8'],
    ],
  };
  const palette = { bg: '#ffffff', panel: '#f7f9fa', fg: '#3e4063', muted: '#555d76', line: '#dde5eb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The category pane and corner note fit this frame at every viewport.
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
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('metro', 'instruction-' + _c.display);
      document.body.classList.toggle('finish-mode', !!_c.ctx.finish);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', 'app-title', top, C.title);
      const nav = u.el('nav', 'menu', top);
      C.menu.forEach((label) => {
        const item = u.el('span', 'nav-item' + (label === 'Icons' ? ' active' : ''), nav, label);
        item.setAttribute('role', 'presentation');
      });
      const utilities = u.el('div', 'utilities', top);
      u.el('span', 'search-icon', utilities, '⌕');
      u.el('span', 'utility-divider', utilities, '');
      u.el('span', 'settings-icon', utilities, '⚙');
      const wc = u.el('div', 'native-window-controls', top);
      for (const [kind, label] of [['min', '−'], ['max', '□'], ['close', '×']])
        u.el('span', 'window-' + kind, wc, label);
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      const bottom = u.el('footer', 'bottom', app);
      const tray = u.el('div', 'metro-actions', bottom);
      Object.assign(_c, { app, top, center, aside, bottom, tray, header: center });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      // Extra workspace actions use the original lower-left action area.
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) _c.tray.appendChild(button);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const u = _c.util;
      u.el('b', 'aside-heading', _c.aside, C.note);
      const list = u.el('div', 'category-list', _c.aside);
      C.categories.forEach(([name, count], i) => {
        const row = u.el('div', 'category-row' + (!i ? ' selected' : ''), list);
        u.el('span', '', row, name);
        u.el('span', 'count', row, count);
      });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.aside.appendChild(note);
        const title = _c.util.el('b', 'metro-note-title', note, 'Task note');
        note.prepend(title);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.bottom.appendChild(foot);
        for (const button of foot.querySelectorAll('.ref-xtra')) _c.tray.appendChild(button);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
      const note = _c.aside.querySelector('.ref-note');
      const actions = Array.from(_c.bottom.querySelectorAll('button, a'));
      if (note && actions.length) {
        const top = Math.min(...actions.map((button) => button.getBoundingClientRect().top));
        note.style.bottom = (_c.H - top + 12) + 'px';
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-icon-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0873cc'],
      LOW_ACCENTS: ['#0873cc'],
      parts,
    },
  });
})();
