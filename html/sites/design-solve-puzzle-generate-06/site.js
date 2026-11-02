(function () {
  'use strict';
  const palette = { bg: '#858585', panel: '#ffffff', fg: '#050505', muted: '#555555', line: '#222222' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Each note mode has its own space in the notebook, even on smaller screens.
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
      document.body.classList.add('macintosh', 'notebook', 'instruction-' + _c.display);
      document.body.classList.add('end-' + (_c.placement || 'none'));
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Number Practice');
      u.el('nav', 'menu', top, '    File    Edit    Goodies    Font    Style    Windows');
      const center = u.el('div', 'center', app);
      const noteSlot = u.el('div', 'note-slot', center);
      const aside = u.el('aside', 'aside', document.body);
      ['Task', 'Notes', 'Examples', 'About'].forEach((label, i) => u.el('div', 'notebook-tab tab-' + i, aside, label));
      Object.assign(_c, { app, top, center, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.noteSlot.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
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
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const panel = _c.noteSlot.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('brief');
        panel.setAttribute('aria-label', 'Task notes');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        note.setAttribute('role', 'status');
        _c.noteSlot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.app.appendChild(foot);
      _c.foot = foot;
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
    name: 'design-solve-puzzle-generate-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#111111'],
      LOW_ACCENTS: ['#111111'],
      parts,
    },
  });
})();
