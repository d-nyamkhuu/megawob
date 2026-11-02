(function () {
  'use strict';
  const palette = { bg: '#dce8e0', panel: '#f4f7f3', fg: '#23332f', muted: '#456158', line: '#a9c0b5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'electron intranet instruction-' + _c.display + (_c.ctx.finish ? ' finish-mode' : '');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const menu = u.el('nav', 'menu', top, 'Workspace      Documents      Projects      Reports      Admin      Help');
      const center = u.el('div', 'center', app);
      // At training sizes the original used this strip for all visible note modes.
      const noteSlot = u.el('div', 'instruction-slot', app);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Properties');
      u.el('p', 'aside-copy', aside);
      const footer = u.el('div', 'bottom', app);
      Object.assign(_c, { app, menu, center, noteSlot, aside, footer, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
      _c.menu.classList.toggle('has-tools', !!_c.headerTools.children.length);
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
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
    name: 'design-read-figure-spatial-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-spatial-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#17664c'],
      LOW_ACCENTS: ['#17664c'],
      parts,
    },
  });
})();
