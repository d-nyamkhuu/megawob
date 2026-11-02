(function () {
  'use strict';
  const palette = { bg: '#faf8ef', panel: '#faf8ef', fg: '#191919', muted: '#383838', line: '#282828' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'library instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      const icon = u.svg('svg', { width: 126, height: 92, viewBox: '0 0 126 92', class: 'bookmark' }, brand);
      u.svg('path', {
        d: 'M8 18 Q34 8 61 20 L61 82 Q35 68 8 78 Z M64 20 Q91 8 118 18 L118 78 Q91 68 64 82 Z',
        fill: '#f5ead5', stroke: '#482b20', 'stroke-width': 4,
      }, icon);
      u.svg('path', {
        d: 'M14 22 Q36 14 55 23 M14 29 Q36 21 55 30 M14 36 Q36 28 55 37 M14 43 Q36 35 55 44 M14 50 Q36 42 55 51 M14 57 Q36 49 55 58 M71 23 Q92 14 112 22 M71 30 Q92 21 112 29 M71 37 Q92 28 112 36 M71 44 Q92 35 112 43 M71 51 Q92 42 112 50 M71 58 Q92 49 112 57',
        fill: 'none', stroke: '#70533e', 'stroke-width': 1.4,
      }, icon);
      const name = u.el('div', 'library-name', brand);
      u.el('strong', '', name, 'Rivermere Public Library');
      u.el('span', '', name, 'ONLINE CATALOG');
      u.el('nav', 'menu', top, 'Search　 |　 Browse　 |　 My Account　 |　 Help');
      u.el('i', 'motto', top, 'Books connect us.');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      if (_c.headerTools.children.length) _c.top.classList.add('has-tools');
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      const address = u.el('div', 'address', footer);
      u.el('div', '', address, 'Rivermere Public Library');
      u.el('div', '', address, '123 Maple Avenue　 |　 Rivermere, NY 10572');
      u.el('i', '', address, 'Knowledge for a brighter tomorrow.');
      u.el('div', 'footer-links', footer, 'Hours　 |　 Contact　 |　 Privacy　 |　 Site Map');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      if (_c.placement === 'link') footer.classList.add('end-at-right');
      Object.assign(_c, { footer, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-read-figure-number-checkboxes-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-number-checkboxes-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#790d1c'],
      LOW_ACCENTS: ['#790d1c'],
      parts,
    },
  });
})();
