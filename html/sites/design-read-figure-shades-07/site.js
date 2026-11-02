(function () {
  'use strict';
  const palette = { bg: '#f5f7f9', panel: '#f5f7f9', fg: '#111111', muted: '#64717c', line: '#d0d4d8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'metro instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const tb = u.el('header', 'titlebar', app);
      const hb = u.el('div', 'hamb', tb);
      const ic = u.svg('svg', { width: 20, height: 16, viewBox: '0 0 20 16' }, hb);
      u.svg('path', { d: 'M1 2h18M1 8h18M1 14h18', fill: 'none', stroke: '#fff', 'stroke-width': 2 }, ic);
      u.el('span', 'ttl', tb, 'Tile Challenge');
      const wc = u.el('div', 'wc', tb);
      const g = u.svg('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, u.el('span', '', wc));
      u.svg('path', { d: 'M2 8h12', stroke: '#fff', 'stroke-width': 1.5 }, g);
      const g2 = u.svg('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, u.el('span', '', wc));
      u.svg('path', { d: 'M3 3h10v10H3z', fill: 'none', stroke: '#fff', 'stroke-width': 1.5 }, g2);
      const g3 = u.svg('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, u.el('span', '', wc));
      u.svg('path', { d: 'M3 3l10 10M13 3L3 13', stroke: '#fff', 'stroke-width': 1.5 }, g3);
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, toolbar: tb, center, header: center });
    },
    'frame.nav': () => (_c) => {
      const idx = _c.util.el('nav', 'index', _c.app);
      for (let i = 1; i <= 10; i++) _c.util.el('span', i === 1 ? 'on' : '', idx, String(i));
    },
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
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
      if (_c.display === 'header') {
        const note = _c.center.querySelector('.ref-instruction').getBoundingClientRect();
        const box = _c.center.getBoundingClientRect();
        _c.stage.style.top = Math.max(parseFloat(getComputedStyle(_c.stage).top), note.bottom - box.top + (18 * _c.app.clientHeight) / 941) + 'px';
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.center.appendChild(note);
        const box = _c.center.getBoundingClientRect();
        _c.stage.style.top = Math.max(parseFloat(getComputedStyle(_c.stage).top), note.getBoundingClientRect().bottom - box.top + (18 * _c.app.clientHeight) / 941) + 'px';
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'bottom', _c.app);
      const clear = _c.util.el('button', 'clear', footer, 'Clear');
      clear.type = 'button';
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
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
    name: 'design-read-figure-shades-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'metro.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-shades-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1478e8'],
      LOW_ACCENTS: ['#1478e8'],
      parts,
    },
  });
})();
