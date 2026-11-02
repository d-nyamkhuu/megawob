(function () {
  'use strict';
  const palette = { bg: '#3b2314', panel: '#f6efe0', fg: '#141008', muted: '#8a6a40', line: '#b9a07a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'wood instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const globe = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'globe' }, top);
      u.svg('circle', { cx: 13, cy: 13, r: 11, fill: '#388aaf', stroke: '#bfa67a', 'stroke-width': 1.5 }, globe);
      u.svg('path', {
        d: 'M4 9l5-4 4 2-1 5 4 3-2 6-4-3-1-5-4-1M17 4l4 5-3 3-3-3',
        fill: '#bfa675', stroke: '#e2c397', 'stroke-width': 0.4,
      }, globe);
      u.svg('path', { d: 'M5 6Q10 1 16 4', stroke: '#d9e6d9', 'stroke-width': 2, fill: 'none' }, globe);
      u.el('span', '', top, 'Figure Identification');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      u.el('nav', 'menu', top, 'File        Edit        Tools        Help');
      const center = u.el('div', 'center', app);
      for (const corner of ['tl', 'tr', 'bl', 'br']) u.el('i', 'frame-screw ' + corner, center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Shape Identification');
      u.el('p', 'aside-copy', aside, '');
      Object.assign(_c, { app, center, header: top });
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
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const bottom = _c.util.el('footer', 'bottom', _c.app);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) bottom.appendChild(foot);
      _c.bottom = bottom;
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
    name: 'design-read-figure-identify-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#5a3d1c'], LOW_ACCENTS: ['#5a3d1c'], parts,
    },
  });
})();
