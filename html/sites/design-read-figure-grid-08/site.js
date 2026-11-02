// GNOME Graph Plotter design on the shared site frame.
(function () {
  'use strict';
  const palette = { bg: '#f1f3f5', panel: '#ffffff', fg: '#20242a', muted: '#596574', line: '#d9dee3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated task pane fits all supported viewports.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = `gnome ribbon-stage instruction-${_c.display}`;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 38, height: 38, viewBox: '0 0 38 38', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 34, height: 34, rx: 7, fill: '#3584e4' }, icon);
      u.svg('path', { d: 'M8 26l7-8 5 4 9-11M8 10v18h21', fill: 'none', stroke: '#fff', 'stroke-width': 1.7 }, icon);
      const title = u.el('div', 'title-stack', top);
      u.el('strong', '', title, 'Graph Plotter');
      u.el('small', '', title, 'Explore coordinates and points');
      const controls = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, controls);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: '#30343a', 'stroke-width': 1.8
        }, svg);
      }
      Object.assign(_c, { app, header: top });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const ribbon = u.el('nav', 'ribbon', _c.app);
      const groups = [
        ['Select', [['➤', 'Pointer', true], ['●', 'Point'], ['✣', 'Move'], ['✋', 'Pan']]],
        ['View', [['☑', 'Show Grid', true], ['☑', 'Show Coordinates', true], ['☑', 'Show Axes', true], ['☐', 'Equal Scale']]],
        ['Tools', [['▱', 'Clear All'], ['↶', 'Undo'], ['↷', 'Redo', false]]],
        ['Style', [['●', 'Point Color', 'color'], ['8', 'Point Size', 'size']]]
      ];
      groups.forEach(([head, items]) => {
        const group = u.el('section', 'ribbon-group', ribbon);
        u.el('b', '', group, head);
        const row = u.el('div', 'ribbon-items', group);
        if (head === 'Tools') _c.toolsRow = row;
        items.forEach(([symbol, label, state]) => {
          const control = u.el('div', `ribbon-control${state === true ? ' active' : ''}`, row);
          if (state === 'color') control.classList.add('color-control');
          if (state === 'size') control.classList.add('size-control');
          u.el('span', 'ribbon-symbol', control, symbol);
          u.el('span', 'ribbon-label', control, label);
        });
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) _c.header.insertBefore(note, _c.header.querySelector('.native-window-controls'));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolsRow;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'center', _c.app);
      const stage = u.el('section', 'stage', body);
      const aside = u.el('aside', `aside${_c.display === 'toast' ? ' instruction-toast' : ''}`, body);
      const copy = u.el('p', 'aside-copy', aside, 'Click on the point shown in the instruction on the grid. The axes show integer coordinates, including negative values.');
      u.el('div', 'instruction-detail', aside, 'The axes show integer coordinates, including negative values.');
      Object.assign(_c, { body, stage, aside, copy });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) _c.aside.insertBefore(panel, _c.copy);
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.aside.insertBefore(note, _c.copy);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      const status = u.el('div', 'status', footer);
      u.el('i', 'status-dot', status);
      u.el('span', '', status, 'No point placed');
      u.el('div', 'coords', footer, 'x: —　　y: —');
      base(_c);
      footer.appendChild(document.body.querySelector('.ref-foot'));
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('div', `overlay ${ctx.kind}`, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.'
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    }
  };
  env.site({
    name: 'design-read-figure-grid-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-grid-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3584e4'],
      LOW_ACCENTS: ['#3584e4'],
      parts
    }
  });
})();
