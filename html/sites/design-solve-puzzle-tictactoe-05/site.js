(function () {
  'use strict';
  const palette = { bg: '#e5d5ae', panel: '#efe2c3', fg: '#241c13', muted: '#514431', line: '#9d8b68' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Each note has its own reserved location, even on the smallest frame.
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
      document.body.className = 'cdrom instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('div', 'cd-disc', top);
      const brand = u.el('div', 'brand', top);
      u.el('div', 'brand-title', brand, 'Mind Games');
      u.el('div', 'brand-subtitle', brand, 'A CD-ROM COMPANION');
      const nav = u.el('nav', 'menu', top);
      ['Games', 'Puzzles', 'Reference', 'Options', 'Help'].forEach((x, i) =>
        u.el('div', i === 0 ? 'active' : '', nav, x),
      );
      const center = u.el('div', 'center', app);
      const tabs = u.el('nav', 'tabs', center);
      ['Tic-Tac-Toe', 'Instructions', 'High Scores'].forEach((x, i) => u.el('div', i === 0 ? 'active' : '', tabs, x));
      const toolbar = u.el('div', 'toolbar', center);
      Object.assign(_c, { app, center, toolbar, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      _c.header.querySelector('.ref-instruction')?.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      _c.center.querySelector('.ref-panel')?.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      u.el('div', 'think-further', footer, 'Think Further');
      u.el('div', 'gold-rule', footer);
      const fresh = u.el('button', 'control new-game', footer, 'New Game');
      fresh.type = 'button';
      const clear = u.el('button', 'control clear-board', footer, 'Clear Board');
      clear.type = 'button';
      const reset = () => document.querySelector('.reference-reset')?.click();
      fresh.addEventListener('click', reset);
      clear.addEventListener('click', reset);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
    name: 'design-solve-puzzle-tictactoe-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-tictactoe-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0a397f'],
      LOW_ACCENTS: ['#0a397f'],
      parts,
    },
  });
})();
