(function () {
  'use strict';
  const palette = { bg: '#008b90', panel: '#fff', fg: '#111', muted: '#666', line: '#173b93' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('directory', 'stagger', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const header = u.el('header', 'top', app);
      u.el('span', 'brand', header, 'WorldGuide');
      u.el('nav', 'menu', header, 'Your Guide to the World Wide Web');
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'My Notes');
      const asideCopy = u.el('p', 'aside-copy', aside, 'Notes:');
      Object.assign(_c, { app, header, aside, asideCopy });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'center', _c.app);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      if (_c.display === 'panel') _c.asideCopy.remove();
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-read-figure-greatest-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-greatest-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#143e9d'],
      LOW_ACCENTS: ['#143e9d'],
      parts,
    },
  });
})();
