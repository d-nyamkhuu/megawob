(function () {
  'use strict';
  const palette = { bg: '#eaf0f3', panel: '#fff', fg: '#080808', muted: '#666', line: '#dce1e4' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('swiss', 'stagger', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Task 01');
      u.el('nav', 'menu', top, 'Play    Instructions    Settings    Help');
      const center = u.el('div', 'center', app);
      const bottom = u.el('footer', 'bottom', app);
      const toolbar = u.el('div', 'toolbar', bottom);
      const aside = u.el('aside', 'aside', document.body);
      if (_c.display !== 'panel') {
        u.el('b', '', aside, 'Task Guide');
        if (_c.display !== 'hidden') {
          u.el('p', 'aside-copy', aside, '02\n\nWhat to do\n\n1. Look at the shapes and letters.\n2. Read the task.\n3. Click on it.');
        }
      }
      Object.assign(_c, { app, center, bottom, aside, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.firstElementChild;
      note.classList.add('brief');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.center.querySelector('.ref-spacer').remove();
        note.classList.add('brief');
        _c.center.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.bottom.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
    name: 'design-read-figure-shape-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-shape-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ed2d16'],
      LOW_ACCENTS: ['#ed2d16'],
      parts,
    },
  });
})();
