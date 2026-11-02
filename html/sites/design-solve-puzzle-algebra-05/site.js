(function () {
  'use strict';
  const palette = { bg: '#c8d2dc', panel: '#ffffff', fg: '#111827', muted: '#687b8c', line: '#687b8c' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('qt-plastik', 'horizontal', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 1, fill: '#dce6ed', stroke: '#43576a', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: '#294e7d', 'stroke-width': 1.5 }, icon);
      u.el('span', 'window-title', top, 'Math Practice - Linear Equations');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const b = u.el('button', 'window-control ' + kind, wc, kind === 'min' ? '_' : kind === 'max' ? '□' : '×');
        b.type = 'button';
      }
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((label) => u.el('span', 'menu-item', menu, label));
      const toolbar = u.el('div', 'toolbar', app);
      [['▧', 'New'], ['📁', 'Open'], ['▣', 'Save'], ['▤', 'Print'], ['?', 'Help']].forEach((v, i) => {
        if (i === 3) u.el('i', 'tool-separator', toolbar);
        const b = u.el('button', 'tool-button', toolbar, '');
        b.type = 'button';
        u.el('span', 'tool-glyph', b, v[0]);
        u.el('span', '', b, v[1]);
      });
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, center, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'problem-list', _c.center);
      u.el('div', 'dock-title', aside, 'Problems');
      ['2x + 3 = 11', '3x + 5 = 26', 'x − 7 = 4', '5x + 1 = 16', '4x − 3 = 9'].forEach((v, i) => {
        const row = u.el('div', 'problem-row' + (i === 1 ? ' current' : ''), aside);
        u.el('span', 'problem-number', row, String(i + 1));
        u.el('span', '', row, v);
      });
      const meta = u.el('div', 'meta-strip', _c.center);
      u.el('div', 'meta-left', meta, '');
      u.el('b', '', meta, 'Topic:');
      u.el('span', 'topic-value', meta, 'Linear Equations');
      const problem = u.el('div', 'problem-meta', meta);
      u.el('b', '', problem, 'Problem:');
      u.el('span', '', problem, '2 of 5');
      const metaRight = u.el('div', 'meta-right', meta);
      u.el('div', '', metaRight, 'Level:　 Practice');
      u.el('div', '', metaRight, 'Time:　 --:--');
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => { base(_c); },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      for (const label of ['Clear', 'Check Answer']) {
        const b = u.el('button', 'task-action', footer, label);
        b.type = 'button';
        if (label === 'Clear') b.addEventListener('click', () => {
          const input = document.querySelector('.answer input');
          if (input) {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.focus();
          }
        });
      }
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
      const status = u.el('div', 'status-bar', _c.app);
      u.el('span', '', status, 'Ready');
      u.el('span', 'status-spacer', status, '');
      u.el('span', 'num-indicator', status, 'Num');
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
      if (_c.submit) {
        _c.submit.classList.add('end-' + _c.placement);
        if (_c.placement === 'header' || _c.placement === 'icon') _c.headerTools.classList.add('has-end');
      }
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
    name: 'design-solve-puzzle-algebra-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#2879d0'], LOW_ACCENTS: ['#2879d0'], parts },
  });
})();
