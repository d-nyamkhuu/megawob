(function () {
  'use strict';
  const palette = {
    bg: '#f5f1e5', panel: '#f8f4e9', fg: '#14575a', muted: '#4b8584', line: '#9db9b5',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated note card, even on the smaller viewports.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'riso utility instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Coordinate Plotter');
      u.el('nav', 'menu', top, 'PLOT   /   EXPLORE   /   LEARN');
      const center = u.el('div', 'center', app);
      const toolbar = u.el('div', 'completion-tools', app);
      Object.assign(_c, { app, center, toolbar, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
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
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('section', 'stage', _c.center);
      const tools = u.el('div', 'toolstrip', _c.center);
      ['Select Point', 'Clear Points', 'Reset Grid'].forEach((label, i) => {
        const b = u.el('button', 'tool-button' + (!i ? ' active' : ''), tools, label);
        b.type = 'button';
        if (i) b.addEventListener('click', () => {
          const reset = document.querySelector('.reference-reset');
          if (reset) reset.click();
        });
      });
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Coordinates');
      u.el('p', 'aside-copy', aside, 'No points plotted yet.');
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
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('bottom');
        _c.app.appendChild(foot);
      }
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
    name: 'design-read-figure-grid-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-grid-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#762338'],
      LOW_ACCENTS: ['#762338'],
      parts,
    },
  });
})();
