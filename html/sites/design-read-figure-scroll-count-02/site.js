(function () {
  'use strict';
  const palette = { bg: '#e8e4d9', panel: '#f5f3ed', fg: '#171612', muted: '#827b70', line: '#b8ae9d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This viewer keeps its note beside the legend on narrow, tall screens too.
      if (_c.W < 1250 && (_c.display === 'panel' || _c.display === 'toast')) _c.display = 'header';
      document.body.className = 'electron stagger instruction-' +
        (_c.display === 'panel' ? 'header' : _c.display) + (_c.ctx.finish ? ' finish-mode' : '');
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
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#d6b36a', stroke: '#2b1a11', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M6 6h14v5H6zM6 13h14v7H6z', fill: 'none', stroke: '#49301e', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Library');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      const notes = u.el('div', 'viewer-notes', aside);
      u.el('b', 'legend-title', aside, 'Icons');
      for (const [kind, label] of [['plus', 'Folder (collapsed)'], ['minus', 'Folder (expanded)'], ['folder', 'Folder'], ['file', 'File']]) {
        const row = u.el('div', 'legend-row', aside);
        const icon = u.el('span', 'legend-icon ' + kind, row);
        icon.textContent = kind === 'plus' ? '+' : kind === 'minus' ? '−' : kind === 'folder' ? '📁' : '▤';
        u.el('span', '', row, label);
      }
      Object.assign(_c, { app, top, center, aside, notes, header: top });
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
    'frame.tools': (base) => (_c) => { base(_c); },
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
      if (foot) {
        foot.classList.add('bottom');
        _c.app.appendChild(foot);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
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
    name: 'design-read-figure-scroll-count-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-scroll-count-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#527ca4'],
      LOW_ACCENTS: ['#527ca4'],
      parts,
    },
  });
})();
