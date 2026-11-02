(function () {
  'use strict';
  const palette = { bg: '#bcbcbc', panel: '#ddd', fg: '#080808', muted: '#555', line: '#111' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('gem', 'framed', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 36, height: 38, viewBox: '0 0 36 38', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 32, height: 34, fill: '#d1d1d1', stroke: '#111', 'stroke-width': 2 }, icon);
      u.svg('path', { d: 'M8 18h20', fill: 'none', stroke: '#111', 'stroke-width': 4 }, icon);
      u.el('span', 'window-title', top, 'Number Select');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const b = u.el('button', 'window-control ' + kind, wc);
        b.type = 'button';
        const svg = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30' }, b);
        u.svg('path', {
          d: kind === 'min' ? 'M5 20h20' : kind === 'max' ? 'M6 5h18v20H6z' : 'M5 5l20 20M25 5L5 25',
          fill: 'none', stroke: '#111', 'stroke-width': 3,
        }, svg);
      }
      const menu = u.el('nav', 'menu', app);
      for (const label of ['File', 'Edit', 'Options', 'Help']) u.el('span', 'menu-item', menu, label);
      const noteHost = u.el('div', 'note-host');
      Object.assign(_c, { app, menu, noteHost, header: menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteHost;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'center', _c.app);
      body.appendChild(_c.noteHost);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.body.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      const statusIcon = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 34 34', class: 'status-icon' }, footer);
      u.svg('rect', { x: 3, y: 3, width: 28, height: 28, fill: '#ddd', stroke: '#111', 'stroke-width': 2 }, statusIcon);
      u.svg('path', { d: 'M9 9h16v16H9zM12 12h10v10H12z', fill: 'none', stroke: '#111', 'stroke-width': 1.5 }, statusIcon);
      u.el('span', 'status-text', footer, 'Ready');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      const time = u.el('span', 'status-time', footer, '10:24 AM');
      Object.assign(_c, { footer, time });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.insertBefore(dock, _c.footer.querySelector('.ref-foot'));
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
    name: 'design-read-figure-greatest-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-greatest-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
