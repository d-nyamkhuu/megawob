(function () {
  'use strict';
  const palette = { bg: '#faf8f4', panel: '#fbfaf7', fg: '#101722', muted: '#5c6574', line: '#e5e1dc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This workspace already reserves a note card at every viewport.
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
      document.body.classList.add('bauhaus', 'compute', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('strong', 'brand', top, 'NEXA');
      const nav = u.el('nav', 'menu', top);
      for (const item of ['Orders', 'Products', 'Customers', 'Reports'])
        u.el('span', item === 'Orders' ? 'active' : '', nav, item);
      u.el('span', 'search', top, '⌕');
      u.el('span', 'avatar', top, '●');
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      brief.hidden = _c.display === 'hidden';
      Object.assign(_c, { app, top, center, brief, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('section', 'stage', _c.center);
      const stats = u.el('section', 'stats', _c.center);
      for (const [name, n, color] of [
        ['All Orders', '12', '#96999b'],
        ['Shipped', '5', '#53b875'],
        ['Processing', '4', '#f5c644'],
        ['Cancelled', '3', '#df302d'],
      ]) {
        const box = u.el('div', 'stat', stats);
        u.el('b', '', box, name);
        u.el('strong', '', box, n);
        u.el('i', '', box).style.background = color;
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.brief.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const bottom = _c.util.el('footer', 'bottom', _c.app);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) bottom.appendChild(foot);
      _c.bottom = bottom;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
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
      const d = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      d.addEventListener('click', ctx.dismiss);
      return { el, dismiss: d };
    },
  };
  env.site({
    name: 'design-solve-puzzle-compute-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-compute-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#cb2524'],
      LOW_ACCENTS: ['#cb2524'],
      parts,
    },
  });
})();
