(function () {
  'use strict';
  const palette = { bg: '#bdbdbd', panel: '#f0f0f0', fg: '#080808', muted: '#555555', line: '#111111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original instruction row accommodates every display at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      document.body.classList.add('gem', 'horizontal', 'instruction-' + _c.display);
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const system = u.el('header', 'system', app);
      const sysicon = u.svg('svg', { width: 30, height: 32, viewBox: '0 0 30 32' }, system);
      u.svg('rect', { x: 5, y: 3, width: 20, height: 25, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, sysicon);
      u.svg('path', { d: 'M9 9h12M9 13h12M9 17h12M9 21h8', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, sysicon);
      u.el('nav', 'menu', system, 'File    Edit    Options    Help');
      u.el('span', 'clock', system, 'Mon Apr 6 1987   10:24 AM');
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 38, height: 38, viewBox: '0 0 38 38', class: 'title-icon' }, top);
      u.svg('rect', { x: 4, y: 4, width: 30, height: 30, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, icon);
      u.svg('path', { d: 'M10 11h18v16H10z M13 15h12M13 19h12M13 23h8', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, icon);
      u.el('span', 'window-title', top, 'Tic-Tac-Toe');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', { d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      const center = u.el('div', 'center', app);
      const noteSlot = u.el('div', 'note-slot', center);
      Object.assign(_c, { app, top, center, noteSlot, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteSlot;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'bottom', _c.app);
      for (const [label, cls] of [['↶　Undo', 'strip-action undo-action'], ['▣　Hint', 'strip-action hint-action']]) {
        const button = _c.util.el('button', cls, footer, label);
        button.type = 'button';
      }
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
    name: 'design-solve-puzzle-tictactoe-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#111111'], LOW_ACCENTS: ['#111111'], parts,
    },
  });
})();
