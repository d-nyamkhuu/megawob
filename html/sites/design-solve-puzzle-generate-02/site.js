(function () {
  'use strict';
  const palette = { bg: '#1b60ad', panel: '#d5d5d2', fg: '#111111', muted: '#777777', line: '#a6a6a6' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('beos', 'inspector', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32', class: 'title-icon' }, top);
      u.svg('path', { d: 'M15 2 25 11 27 20 23 27 14 25 5 18 4 10Z', fill: '#55c400', stroke: '#073e00', 'stroke-width': 2 }, icon);
      u.svg('path', { d: 'm10 8 3 7-4 3 8 2 5 9', fill: 'none', stroke: '#073e00', 'stroke-width': 2 }, icon);
      u.el('span', '', top, 'Number Checker');
      u.el('span', 'tab-close', top, '×');
      const logo = u.el('div', 'beos-logo', document.body);
      u.el('span', '', logo, 'Be');
      u.el('span', '', logo, 'OS');
      const center = u.el('div', 'center', app);
      const header = u.el('div', 'brief-slot', center);
      const aside = u.el('aside', 'aside', document.body);
      const title = u.el('div', 'inspector-title', aside);
      u.el('span', '', title, 'Inspector');
      u.el('span', 'inspector-close', title, '×');
      const windows = u.el('span', 'inspector-windows', title);
      u.el('span', 'window-zoom', windows);
      u.el('span', 'window-close', windows);
      u.el('p', 'aside-copy', aside);
      const taskSlot = u.el('div', 'inspector-task', aside);
      Object.assign(_c, { app, center, header, aside, title, taskSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.taskSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'brief-toast');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready';
      _c.util.el('span', 'version', foot, 'Number Checker  v1.0');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util, el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el('span', '', el, {
        cookie: 'This application stores preferences on your device.', toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?', promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.'
      }[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    }
  };
  env.site({
    name: 'design-solve-puzzle-generate-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-solve-puzzle-generate-02': palette }, LOW_THEME: palette,
      ACCENTS: ['#164eb5'], LOW_ACCENTS: ['#164eb5'], parts }
  });
})();
