(function () {
  'use strict';
  const palette = { bg: '#063957', panel: '#f3e6c9', fg: '#111b2b', muted: '#a7833b', line: '#a7833b' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four displays use the original card above the source sheet.
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
      document.body.className = 'cdrom horizontal instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      app.classList.add(_c.ctx.finish ? 'finish-mode' : 'end-' + _c.placement);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#d7e2e8', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Mystery Numbers');
      u.el('small', '', top, 'A Mind Game for Curious People');
      const center = u.el('div', 'center', app);
      const header = u.el('div', 'note-slot', center);
      Object.assign(_c, { app, top, center, header });
    },
    'frame.nav': () => (_c) => {
      const menu = _c.util.el('nav', 'menu', _c.top);
      ['Game', 'How to Play', 'About'].forEach((label, i) => _c.util.el('span', 'tab tab-' + i, menu, label));
      _c.menuTools = _c.util.el('div', 'menu-tools', menu);
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.querySelectorAll('.ref-xtra').forEach((el) => _c.menuTools.appendChild(el));
    },
    'frame.body': () => (_c) => {
      const aside = _c.util.el('aside', 'aside', document.body);
      _c.util.el('b', '', aside, '');
      _c.util.el('p', 'aside-copy', aside, '');
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
      foot.querySelectorAll('.ref-xtra').forEach((el) => _c.menuTools.appendChild(el));
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
    name: 'design-solve-puzzle-guess-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-guess-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#12386e'],
      LOW_ACCENTS: ['#12386e'],
      parts,
    },
  });
})();
