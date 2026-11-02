(function () {
  'use strict';
  const palette = { bg: '#d4d0c8', panel: '#d8d5ce', fg: '#111116', muted: '#77756f', line: '#77756f' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated side pane has room for every instruction display.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'industrial wide-source instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 22, height: 22, fill: '#c5c4bf', stroke: '#292929', 'stroke-width': 2 }, icon);
      u.svg('path', { d: 'M6 7h14M6 11h14M6 15h14M6 19h10', fill: 'none', stroke: '#292929', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Screen Calibration Utility');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: '#111', 'stroke-width': 2,
        }, svg);
      }
      const menu = u.el('nav', 'menu', top, 'File    Tools    Help');
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Task');
      const notes = u.el('div', 'task-notes', aside);
      const progress = u.el('section', 'response-section progress-section', aside);
      u.el('b', '', progress, 'Progress');
      u.el('p', 'progress-copy', progress, 'Numbers clicked: 0 / 13');
      u.el('div', 'progress-track', progress);
      const target = u.el('section', 'response-section target-section', aside);
      u.el('b', '', target, 'Current target');
      u.el('div', 'target-readout', target, '–');
      u.el('footer', 'bottom', app);
      Object.assign(_c, { app, top, menu, center, aside, notes, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.notes;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.notes.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.aside.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
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
    name: 'design-read-figure-ascending-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-ascending-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#771b2b'],
      LOW_ACCENTS: ['#771b2b'],
      parts,
    },
  });
})();
