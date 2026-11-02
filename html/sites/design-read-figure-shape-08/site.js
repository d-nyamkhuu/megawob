(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shape-08',
    'task': 'read-figure',
    'scenario': 'shape',
    'title': 'Shape Finder',
    'menu': ['File', 'Edit', 'Options', 'Help'],
    'icons': ['My Computer', 'Network Neighborhood', 'Recycle Bin', 'Control Panel'],
  };
  function desktopIcon(u, parent, kind) {
    const svg = u.svg('svg', { viewBox: '0 0 56 56', 'aria-hidden': 'true' }, parent);
    const path = (d, fill, stroke = '#202020') => u.svg('path', { d, fill, stroke, 'stroke-width': 1.2 }, svg);
    const rect = (x, y, w, h, fill, stroke = '#222') =>
      u.svg('rect', { x, y, width: w, height: h, fill, stroke, 'stroke-width': 1 }, svg);
    function computer(x, y, k = 1) {
      const g = u.svg('g', { transform: `translate(${x} ${y}) scale(${k})` }, svg);
      u.svg('path', { d: 'M9 1L39 1 42 4 40 32 6 32 7 5Z', fill: '#c0c0c0', stroke: '#111' }, g);
      u.svg('path', { d: 'M9 2H38V28H9Z', fill: '#fff', stroke: '#555' }, g);
      u.svg('rect', { x: 12, y: 5, width: 24, height: 20, fill: '#000080', stroke: '#111' }, g);
      u.svg('path', { d: 'M18 11L31 9 30 20 18 22Z', fill: '#00a0b0', stroke: '#aaa' }, g);
      u.svg('path', { d: 'M20 13L27 12 24 17 28 17 21 20Z', fill: '#4cff00' }, g);
      u.svg('path', { d: 'M8 33H39L44 42H2L5 35ZM4 43H44V47H2Z', fill: '#c0c0c0', stroke: '#111' }, g);
      u.svg('path', { d: 'M9 36H34M7 39H38M7 44H30', stroke: '#fff', 'stroke-width': 2 }, g);
      u.svg('path', { d: 'M30 44H37', stroke: '#555' }, g);
    }
    if (kind === 0) computer(2, 2);
    else if (kind === 1) {
      computer(0, 0, 0.67);
      computer(22, 20, 0.67);
      path('M6 39H17V33M17 39H27M17 39V46H37', 'none', '#555');
    } else if (kind === 2) {
      path('M5 10L27 2 50 13 42 49 25 54 10 43Z', '#c0c0c0');
      path('M5 10L26 20 50 13 27 2Z', '#eee');
      path('M26 20L25 54 42 49 50 13Z', '#999');
      path('M12 12L27 6 43 13 26 17Z', '#888');
      path(
        'M17 24L21 21 25 27 21 27 19 31 15 29ZM31 29L34 23 38 28 37 35 33 34 34 30ZM23 38L26 34 29 39 27 43 20 40 21 36Z',
        '#008000',
        '#008000',
      );
    } else {
      rect(3, 5, 47, 37, '#ccc');
      rect(6, 8, 41, 5, '#000080');
      rect(7, 16, 38, 22, '#fff');
      rect(10, 19, 10, 13, '#000080');
      rect(25, 19, 15, 13, '#000080');
      path('M14 21V29M10 25H18M29 20V31M35 20V31', 'none', '#ffff00');
      path('M38 31C46 31 47 42 45 50L39 53 32 50 32 41Z', '#ddd');
      path('M38 35V42M38 31V25', 'none');
    }
    return svg;
  }
  const palette = { bg: '#008080', panel: '#c0c0c0', fg: '#000000', muted: '#808080', line: '#808080' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('win', 'instruction-' + _c.display);
      const desk = u.el('div', 'desk', document.body);
      C.icons.forEach((n, i) => {
        const ic = u.el('div', 'dicon', desk);
        desktopIcon(u, u.el('i', 'dglyph g' + i, ic), i);
        u.el('span', '', ic, n);
      });
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      desktopIcon(u, u.el('i', 'tico', top), 3);
      u.el('span', 'ttl', top, C.title);
      const wc = u.el('div', 'wctl', top);
      ['_', '□', '×'].forEach((t) => u.el('b', '', wc, t));
      const menu = u.el('nav', 'menu', app);
      C.menu.forEach((m) => {
        const item = u.el('span', '', menu);
        u.el('u', '', item, m[0]);
        item.append(m.slice(1));
      });
      const center = u.el('div', 'center', app);
      const left = u.el('div', 'left', center);
      let header = left;
      if (_c.display === 'header') {
        const zone = u.el('div', 'taskzone', left);
        const tg = u.el('fieldset', 'grp taskgrp', zone);
        u.el('legend', '', tg, 'Task');
        header = u.el('div', 'task-inner', tg);
      }
      Object.assign(_c, { app, top, menu, center, left, header });
      const tb = u.el('div', 'taskbar', document.body);
      const pm = u.el('div', 'tbtn', tb);
      desktopIcon(u, u.el('i', 'bar-icon', pm), 3);
      pm.append('Program Manager');
      const active = u.el('div', 'tbtn active', tb);
      desktopIcon(u, u.el('i', 'bar-icon', active), 3);
      active.append('Shape Finder');
      u.el('div', 'clock', tb, '10:24 AM');
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief', 'long');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const sg = u.el('fieldset', 'grp shapegrp', _c.left);
      u.el('legend', '', sg, 'Shapes');
      const aside = u.el('aside', 'aside', _c.center);
      const fg = u.el('fieldset', 'grp fbgrp', aside);
      u.el('legend', '', fg, 'Feedback');
      const footer = u.el('div', 'bottom', aside);
      Object.assign(_c, { body: _c.center, sg, fg, footer });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.fg;
      base(_c);
      _c.body = body;
      _c.util.el('div', 'fbbox', _c.fg, 'No shape selected.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.sg);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('toast-note');
        _c.top.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.footer.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.before(dock);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['win.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-shape-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
