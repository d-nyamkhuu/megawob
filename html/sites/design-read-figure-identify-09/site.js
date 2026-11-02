(function () {
  'use strict';
  const palette = { bg: '#aaa89f', panel: '#eae7de', fg: '#222222', muted: '#555555', line: '#7a1230' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('dark', 'brief-left', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 23, height: 25, viewBox: '0 0 23 25', class: 'tico' }, top);
      u.svg('rect', { x: 1, y: 1, width: 21, height: 23, fill: '#c8c5b9', stroke: '#333' }, icon);
      u.svg('path', {
        d: 'M4 4L6 21H18L20 4M5 7L10 18L13 6L17 19M4 12L9 9L14 15L19 10',
        fill: 'none', stroke: '#344856', 'stroke-width': 1.4,
      }, icon);
      u.el('span', '', top, 'VisionCal 1.2.0  -  Object Identification');
      const wc = u.el('div', 'wc', top);
      ['_', '□', '✕'].forEach((t) => u.el('b', '', wc, t));
      const menu = u.el('nav', 'menu', app);
      ['File', 'Tools', 'View', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const center = u.el('div', 'center', app);
      const tabs = u.el('div', 'tabs', center);
      ['Task', 'Settings', 'Results', 'Reference', 'About'].forEach((t, i) =>
        u.el('div', 'tab' + (i ? '' : ' on'), tabs, t));
      const page = u.el('div', 'page', center);
      const rings = u.el('div', 'rings', page);
      for (let i = 0; i < 16; i++) {
        const ring = u.el('i', 'ring', rings);
        ring.style.top = (i * 100) / 15 + '%';
        u.el('b', '', ring);
      }
      const ph = u.el('div', 'ph', page);
      u.el('span', '', ph, 'Calibration Utility');
      u.el('span', 'mod', ph, 'Module: Shape Recognition');
      const workspace = _c.display === 'panel' ? u.el('div', 'workspace', page) : page;
      Object.assign(_c, { app, menu, page, workspace, header: workspace });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.workspace; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.body.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.page);
      const info = u.el('div', 'info', footer);
      u.el('span', '', info, 'Camera: CAM-01   640x480   30 fps');
      u.el('span', '', info, 'Frame: 012348   2004-05-14   10:27:16');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
      const st = u.el('div', 'status', _c.app);
      u.el('span', '', st, 'Ready');
      u.el('span', '', st, 'User: operator  |  Mode: Identification');
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
    name: 'design-read-figure-identify-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-identify-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#7a1230'],
      LOW_ACCENTS: ['#7a1230'],
      parts,
    },
  });
})();
