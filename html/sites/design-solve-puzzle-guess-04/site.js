(function () {
  'use strict';
  const palette = { bg: '#77cfff', panel: '#ffffff', fg: '#123b77', muted: '#536884', line: '#c9e5fb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'dark horizontal instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      u.el('div', 'number-badge', brand, '123');
      const titles = u.el('div', 'brand-copy', brand);
      u.el('strong', 'brand-title', titles, 'Number Guess');
      u.el('span', 'brand-subtitle', titles, 'Think • Guess • Figure It Out');
      u.el('div', 'tagline', top, 'A small challenge for a sharper you');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-panel');
      if (note) {
        note.classList.add('brief');
        note.querySelector('.ref-panel-title').textContent = 'Episode settings';
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('bottom');
      const tools = footer.querySelector('.ref-tools');
      if (!_c.ctx.finish) tools.classList.add('dock-actions');
      if (['footer', 'link', 'floating'].includes(_c.placement)) u.el('span', 'dock-divider', tools);
      _c.app.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const dockInfo = u.el('div', 'dock-info');
      footer.prepend(dockInfo);
      const game = u.el('div', 'dock-card game-card', dockInfo);
      const progress = u.el('div', 'dock-card progress-card', dockInfo);
      u.el('b', 'dock-heading', game, 'Game Info');
      u.el('div', 'dock-value range-value', game, 'Number range:');
      u.el('div', 'dock-value total-value', game, 'Total guesses:');
      u.el('b', 'dock-heading', progress, 'Your Progress');
      u.el('div', 'progress-dots', progress);
      u.el('div', 'progress-label', progress, '0 guesses used');
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
    name: 'design-solve-puzzle-guess-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1384d4'], LOW_ACCENTS: ['#1384d4'], parts,
    },
  });
})();
