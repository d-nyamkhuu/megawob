(function () {
  'use strict';
  const palette = { bg: '#78a5f2', panel: '#ffffff', fg: '#101014', muted: '#555555', line: '#456bb5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has dedicated note locations even at the smallest viewport.
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
      document.body.className = 'directory stagger instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Number Challenge');
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      const header = brief;
      const toolbar = u.el('footer', 'bottom end-placement-' + _c.placement, app);
      Object.assign(_c, { app, center, brief, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('header-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const aside = _c.util.el('aside', 'aside', document.body);
      _c.util.el('b', '', aside, 'Task');
      _c.util.el('p', 'aside-copy', aside, 'Practice with number cards. Each card shows a single value.');
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('instruction-note');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.toolbar.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
      const extras = _c.toolbar.querySelectorAll('.ref-xtra');
      extras.forEach((button, i) => {
        button.style.left = '64.5%';
        button.style.top = (extras.length === 1 ? 26 : 12 + i * (76 / extras.length)) + '%';
        button.style.height = (extras.length === 1 ? 48 : 68 / extras.length) + '%';
      });
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
    name: 'design-read-figure-greatest-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-greatest-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2854a5'],
      LOW_ACCENTS: ['#2854a5'],
      parts,
    },
  });
})();
