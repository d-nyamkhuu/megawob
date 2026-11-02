(function () {
  'use strict';
  const palette = { bg: '#c9ccd3', panel: '#fdfdfd', fg: '#080808', muted: '#454545', line: '#b7bbc5' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('openlook', 'ol', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const gadget = u.el('div', 'window-gadget', top);
      const arrow = u.svg('svg', { viewBox: '0 0 36 36', width: 30, height: 30 }, gadget);
      u.svg('path', { d: 'M8 18h19m-6-6 6 6-6 6', fill: 'none', stroke: '#080909', 'stroke-width': 3 }, arrow);
      u.el('span', '', top, 'Shape Viewer');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: center });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const menu = u.el('nav', 'menu', _c.top);
      ['File', 'Edit', 'View', 'Options', 'Help'].forEach((label) => {
        const item = u.el('span', 'menu-item' + (label === 'Help' ? ' menu-help' : ''), menu);
        const pin = u.svg('svg', { viewBox: '0 0 24 28', width: 24, height: 28, 'aria-hidden': 'true' }, item);
        u.svg('path', {
          d: 'M7 2h10v3h-2v11l5 3v2H4v-2l5-3V5H7zM12 21v7',
          fill: '#080909', stroke: '#080909', 'stroke-width': 1.5,
        }, pin);
        u.el('span', '', item, label);
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const workspace = u.el('div', 'workspace', _c.body);
      const stage = u.el('section', 'stage', workspace);
      const tools = u.el('div', 'tool-strip', workspace);
      tools.setAttribute('aria-hidden', 'true');
      const paths = [
        'M8 4v33l9-9 7 15 6-3-7-15 14-1z',
        'M8 13h30v24H8z',
        'M38 25a15 15 0 1 0-30 0 15 15 0 1 0 30 0',
        'M23 10l16 28H7z',
        null,
        'M9 39l29-29',
        'M9 12h29v29H9z',
      ];
      paths.forEach((path, i) => {
        const cell = u.el('div', 'tool-cell', tools);
        const svg = u.svg('svg', { viewBox: '0 0 48 48', width: 48, height: 48 }, cell);
        if (path) {
          u.svg('path', {
            d: path, fill: i === 0 ? '#050505' : i === 6 ? '#454545' : 'none',
            stroke: i === 6 ? '#454545' : '#080909', 'stroke-width': i === 0 ? 1 : 2.5,
          }, svg);
        } else {
          const t = u.svg('text', {
            x: 24, y: 41, 'text-anchor': 'middle', 'font-size': 45,
            'font-family': 'Times New Roman', 'font-weight': 700, fill: '#080909',
          }, svg);
          t.textContent = 'T';
        }
      });
      const status = u.el('div', 'document-status', workspace);
      u.el('div', 'page-status', status, 'Page 1 of 1');
      u.el('div', 'zoom-status', status, '100%');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.appendChild(note);
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
    name: 'design-read-figure-shape-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'ol.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-shape-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ed2d16'],
      LOW_ACCENTS: ['#ed2d16'],
      parts,
    },
  });
})();
