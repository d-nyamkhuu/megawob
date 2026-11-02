(function () {
  'use strict';
  const palette = { bg: '#fffefa', panel: '#fffefa', fg: '#111214', muted: '#616775', line: '#a8afbd' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated left pane has room for each note form at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'human brief-left instruction-' + _c.display;
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
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#d7e2e8', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Math Practice');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', { d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      u.el('nav', 'menu', top, 'File    Edit    View    Help');
      const center = u.el('div', 'center', app);
      const header = u.el('div', 'brief', center);
      const toolbar = u.el('div', 'toolbar', header);
      Object.assign(_c, { app, center, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const bottom = _c.util.el('footer', 'bottom', _c.app);
      bottom.classList.toggle('bottom-secondary', _c.placement !== 'footer' && _c.placement !== 'link');
      const foot = document.body.querySelector('.ref-foot');
      if (foot) bottom.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.header.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util, el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = { cookie: 'This application stores preferences on your device.', toast: 'Your workspace has been synced.', chat: 'Need help with this exercise?', promo: 'Try the new practice collection.', banner: 'An updated practice collection is available.' };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-hot-cold-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-hot-cold-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b8ff16'],
      LOW_ACCENTS: ['#b8ff16'],
      parts,
    },
  });
})();
