(function () {
  'use strict';
  const palette = { bg: '#07565d', panel: '#f2ead5', fg: '#17130d', muted: '#665b45', line: '#aaa18a' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('human', 'inspector', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 48, height: 48, viewBox: '0 0 48 48', class: 'title-icon' }, top);
      u.svg('rect', { x: 4, y: 4, width: 40, height: 40, fill: '#bd8b20', stroke: '#ffe08a', 'stroke-width': 3 }, icon);
      u.svg('path', { d: 'M10 13h22l6 5v18H10zM7 18h25v16H7zM14 10h21v7', fill: '#e5c46b', stroke: '#5a3810', 'stroke-width': 2 }, icon);
      u.el('span', 'ledger-title', top, 'Account Records');
      Object.assign(_c, { app, header: top });
    },
    'frame.nav': () => () => {},
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'center', _c.app);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Record Details');
      u.el('p', 'aside-copy', aside, '');
      Object.assign(_c, { body, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      _c.aside.classList.toggle('has-task', _c.display === 'panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.app.appendChild(foot);
      _c.foot = foot;
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
    name: 'design-solve-puzzle-compute-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-compute-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#15356c'],
      LOW_ACCENTS: ['#15356c'],
      parts,
    },
  });
})();
