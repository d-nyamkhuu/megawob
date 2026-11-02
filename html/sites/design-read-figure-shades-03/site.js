(function () {
  'use strict';
  const palette = { bg: '#e9f7f1', panel: '#f4f5fc', fg: '#10142e', muted: '#526176', line: '#c9ccdc' };
  const addHint = (u, note) => {
    if (note) u.el('div', 'sub', note, 'Click all tiles that are shades of the requested color. Do not select other colors.');
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('pastel', 'strip', 'instruction-' + _c.display);
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
      const icon = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30', class: 'title-icon' }, top);
      u.svg('rect', { x: 0, y: 0, width: 30, height: 30, rx: 6, fill: '#7c5cf0', stroke: 'none' }, icon);
      [[5, 5], [17, 5], [5, 17], [17, 17]].forEach((p) =>
        u.svg('rect', { x: p[0], y: p[1], width: 8, height: 8, rx: 2.6, fill: '#fff' }, icon));
      u.el('span', '', top, 'Pattern Practice');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      addHint(_c.util, _c.center.querySelector('.ref-instruction'));
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.top.insertBefore(_c.headerTools, _c.top.querySelector('.native-window-controls'));
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      addHint(_c.util, _c.body.querySelector('.ref-panel'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        addHint(_c.util, note);
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-read-figure-shades-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-shades-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#7454f2'],
      LOW_ACCENTS: ['#7454f2'],
      parts,
    },
  });
})();
