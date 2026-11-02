(function () {
  'use strict';
  const palette = { bg: '#a7bacb', panel: '#d1d3d4', fg: '#111111', muted: '#4e555a', line: '#4e555a' };
  const pinNote = (u, note) => u.el('span', 'note-pin', note, '◆');
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'openlook instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const bar = u.el('header', 'desktopbar', app);
      u.el('span', 'workbench-mark', bar, '◈');
      u.el('strong', 'workbench-name', bar, 'Workbench');
      u.el('nav', 'desktop-menu', bar, 'File　 Edit　 View　 Options　 Help');
      u.el('span', 'desktop-clock', bar, 'Mon Apr 6 1992　10:24 AM');
      const icons = u.el('div', 'desktop-icons', app);
      [['▣', 'Workspace'], ['▱', 'Documents'], ['▤', 'Trash']].forEach(([glyph, label]) => {
        const item = u.el('div', 'desktop-icon', icons);
        u.el('span', 'desktop-glyph', item, glyph);
        u.el('span', '', item, label);
      });
      const win = u.el('section', 'workspace-dialog', app);
      const top = u.el('header', 'top', win);
      u.el('span', 'app-diamond', top, '◆');
      u.el('strong', 'window-title', top, 'Tic-Tac-Toe');
      u.el('button', 'window-minimize', top, '▬');
      Object.assign(_c, { app, win, header: app });
    },
    'frame.nav': () => (_c) => {
      const menu = _c.util.el('nav', 'menu', _c.win);
      _c.util.el('span', 'pin-gadget', menu, '◆');
      _c.util.el('span', 'window-menu-items', menu, 'Game    Options    Help');
      _c.menu = menu;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('episode-note', 'header-note');
        const text = _c.util.el('p', 'aside-copy');
        while (note.firstChild) text.appendChild(note.firstChild);
        note.appendChild(text);
        pinNote(_c.util, note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'center', _c.win);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.app;
      base(_c);
      _c.body = body;
      const note = _c.app.querySelector('.ref-panel');
      if (note) {
        note.classList.add('aside');
        note.querySelector('.ref-panel-text').classList.add('aside-copy');
        pinNote(_c.util, note);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('episode-note', 'toast-note');
        note.querySelector('.ref-note-text').classList.add('aside-copy');
        pinNote(_c.util, note);
        _c.app.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('bottom');
      _c.win.appendChild(footer);
      const clear = _c.util.el('button', 'clear-game', footer, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const reset = document.querySelector('.reference-reset');
        if (reset) reset.click();
      });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
    name: 'design-solve-puzzle-tictactoe-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-tictactoe-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b9c9e0'],
      LOW_ACCENTS: ['#b9c9e0'],
      parts,
    },
  });
})();
