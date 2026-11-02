(function () {
  'use strict';
  const palette = { bg: '#f5f5f5', panel: '#fafafa', fg: '#24252a', muted: '#55565b', line: '#a5a6aa' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = `yosemite margin instruction-${_c.display === 'toast' ? 'toast-mode' : _c.display}`;
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
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Tic-Tac-Toe');
      const wc = u.el('div', 'native-window-controls', top);
      for (const d of ['min', 'max', 'close']) {
        const s = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        const path = d === 'min' ? 'M3 12h14' : d === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16';
        u.svg('path', { d: path, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, s);
      }
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      const aside = u.el('aside', 'aside', document.body);
      Object.assign(_c, { app, top, center, aside, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const title = _c.aside.querySelector('.ref-panel-title');
      if (title) title.textContent = 'How to play';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.app.appendChild(note);
        const title = _c.util.el('b', 'note-title', null, 'How to play');
        note.prepend(title);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      const summary = u.el('div', 'dock-summary', footer);
      [['Current turn', 'X (you)'], ['Computer', 'O'], ['Moves', '']].forEach(([label, value], i) => {
        const item = u.el('div', `dock-item dock-item-${i}`, summary);
        u.el('span', 'dock-label', item, label);
        u.el('strong', 'dock-value', item, value);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('div', `overlay ${ctx.kind}`, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.', toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?', promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.'
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    }
  };
  env.site({
    name: 'design-solve-puzzle-tictactoe-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-tictactoe-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3478ed'],
      LOW_ACCENTS: ['#3478ed'],
      parts,
    },
  });
})();
