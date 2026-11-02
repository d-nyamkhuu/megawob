(function () {
  'use strict';
  const palette = { bg: '#1b5595', panel: '#dededb', fg: '#090909', muted: '#666660', line: '#aaa' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'beos sheet instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const index = u.el('nav', 'sheet-index', app);
      index.setAttribute('aria-label', 'Sheet index');
      for (let i = 1; i <= 10; i++) u.el('div', i === 1 ? 'selected' : '', index, String(i));
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#d7e2e8', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Tic-Tac-Toe');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', { d: kind === 'min' ? 'M3 12h14' : 'M4 4l12 12M16 4L4 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      u.el('nav', 'menu', top, 'Game    Settings    Help');
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', app);
      const turn = u.el('section', 'sheet-panel turn-panel', aside);
      u.el('div', 'panel-heading', turn, 'Turn');
      u.el('div', 'turn-value', turn);
      const legendPanel = u.el('section', 'sheet-panel legend-panel', aside);
      u.el('div', 'panel-heading', legendPanel, 'Legend');
      const legend = u.el('div', 'beos-legend', legendPanel);
      [['X', ' = You'], ['O', ' = Computer']].forEach((row) => {
        const line = u.el('div', 'legend-line', legend);
        u.el('b', row[0] === 'X' ? 'x-mark' : 'o-mark', line, row[0]);
        u.el('span', '', line, row[1]);
      });
      const mark = u.el('div', 'beos-desktop-mark', document.body);
      mark.setAttribute('aria-label', 'BeOS');
      const logo = u.svg('svg', { width: 46, height: 34, viewBox: '0 0 46 34', 'aria-hidden': 'true' }, mark);
      const defs = u.svg('defs', {}, logo);
      const blue = u.svg('linearGradient', { id: 'beos-blue' }, defs);
      const yellow = u.svg('linearGradient', { id: 'beos-yellow' }, defs);
      u.svg('stop', { offset: 0, 'stop-color': '#1433d4' }, blue);
      u.svg('stop', { offset: 1, 'stop-color': '#2356f2' }, blue);
      u.svg('stop', { offset: 0, 'stop-color': '#ffde24' }, yellow);
      u.svg('stop', { offset: 1, 'stop-color': '#f5c82c' }, yellow);
      u.svg('rect', { x: 1, y: 1, width: 21, height: 31, fill: 'url(#beos-blue)', stroke: '#17225c' }, logo);
      u.svg('rect', { x: 25, y: 1, width: 20, height: 31, fill: 'url(#beos-yellow)', stroke: '#755e17' }, logo);
      u.svg('path', { d: 'M13 32V20Q13 18 16 18H32Q35 18 35 21V32Z', fill: '#d70006', stroke: '#101010', 'stroke-width': 1.6 }, logo);
      u.svg('path', { d: 'M12 32V21H22V32', fill: '#2938e5', stroke: '#141256', 'stroke-width': 1.2 }, logo);
      u.svg('path', { d: 'M24 19V32M35 32H44', fill: 'none', stroke: '#090909', 'stroke-width': 1.5 }, logo);
      u.el('span', '', mark, 'BeOS');
      const actions = u.el('section', 'sheet-panel sheet-actions', aside);
      const endSlot = u.el('div', 'end-slot', actions);
      u.el('div', 'sheet-reset-row', actions);
      Object.assign(_c, { app, center, endSlot, header: top });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.endSlot.appendChild(dock);
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
    name: 'design-solve-puzzle-tictactoe-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2444d7'],
      LOW_ACCENTS: ['#2444d7'],
      parts,
    },
  });
})();
