(function () {
  'use strict';
  const palette = { bg: '#bdbdbd', panel: '#c4c4c4', fg: '#111111', muted: '#555555', line: '#777777' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'nextstep operational-stack instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 3, width: 24, height: 24, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M8 8h14v14H8z M11 11h8v8h-8z', fill: 'none', stroke: 'currentColor', 'stroke-width': 1 }, icon);
      u.el('span', 'window-title', top, 'Coordinate Practice');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32' }, wc);
        u.svg('rect', { x: 2, y: 2, width: 28, height: 28, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, svg);
        u.svg('path', {
          d: kind === 'min' ? 'M7 20h18' : kind === 'max' ? 'M8 8h16v16H8z' : 'M8 8l16 16M24 8L8 24',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 2,
        }, svg);
      }
      const center = u.el('div', 'center', app);
      const bottom = u.el('footer', 'bottom', app);
      const aside = u.el('aside', 'aside bottom-note mode-' + _c.display, bottom);
      if (_c.display === 'header' || _c.display === 'hidden') {
        u.el('p', 'aside-copy', aside, 'Click a point on the grid to select it.');
      }
      Object.assign(_c, { app, header: top, center, bottom, aside });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.header.insertBefore(_c.headerTools, _c.header.querySelector('.native-window-controls'));
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.aside.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.bottom.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
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
    name: 'design-read-figure-grid-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#222222'],
      LOW_ACCENTS: ['#222222'],
      parts,
    },
  });
})();
