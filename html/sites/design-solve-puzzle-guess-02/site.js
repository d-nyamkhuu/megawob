(function () {
  'use strict';
  const palette = { bg: '#f7f4e8', panel: '#f7f4e8', fg: '#111111', muted: '#777777', line: '#161616' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original document reserves the same note area in every viewport.
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
      document.body.className = 'lisa document instruction-' + _c.display;
      if (_c.ctx.finish) document.body.classList.add('finish-mode');
      document.body.classList.add('end-' + _c.placement);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Number Guess');
      u.el('nav', 'menu', top, 'File     Edit     Document     Special     Help');
      const center = u.el('div', 'center', app);
      const noteSlot = u.el('div', 'document-note', center);
      Object.assign(_c, { app, top, center, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'How to Play');
      u.el('p', 'aside-copy', aside, '1. Enter a whole number\n   from the allowed range.\n2. Click the Guess button.\n3. Read the hint (higher\n   or lower).\n4. You have 7 guesses total.');
      u.el('b', 'aside-subhead', aside, 'Action Notes');
      u.el('p', 'aside-actions', aside, '• Use the hints to narrow\n  the range.\n• The number is within the allowed range.\n• You can guess up to 7 times.');
      _c.body = _c.center;
      _c.bottom = u.el('div', 'bottom end-' + _c.placement, document.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.bottom.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
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
    name: 'design-solve-puzzle-guess-02',
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
