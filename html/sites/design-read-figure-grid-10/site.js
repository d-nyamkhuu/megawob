(function () {
  'use strict';
  const palette = { bg: '#9b9daf', panel: '#aeb0c0', fg: '#101322', muted: '#62677e', line: '#62677e' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The workstation has a dedicated instruction card even at small sizes.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'irix instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', 'irix-mark', top, 'IRIX');
      u.el('span', 'window-title', top, 'Graph Workbench');
      u.el('span', 'window-min', top, '−');
      u.el('span', 'clock', top, 'Mon Apr 21  10:24 AM');
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const aside = u.el('aside', 'aside');
      const header = u.el('div', 'note-slot', aside);
      Object.assign(_c, { app, menu, aside, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'center', _c.app);
      body.appendChild(_c.aside);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
      const u = _c.util, aside = _c.aside;
      u.el('div', 'panel-heading', aside, 'Point Tool');
      u.el('div', 'panel-label', aside, 'Current Position');
      const coords = u.el('div', 'coord-fields', aside);
      ['X', 'Y'].forEach((axis) => {
        const row = u.el('div', 'coord-row', coords);
        u.el('span', '', row, axis + ':');
        u.el('div', 'coord-value', row, '—');
      });
      u.el('div', 'panel-heading', aside, 'Point Style');
      const style = u.el('div', 'style-row', aside);
      u.el('span', 'color-chip', style, '');
      const select = u.el('div', 'style-select', style);
      u.el('span', '', select, 'Solid');
      u.el('span', 'drop-arrow', select, '▼');
      u.el('div', 'panel-heading', aside, 'Point Size');
      const size = u.el('div', 'size-row', aside);
      u.el('span', '', size, '8');
      const spin = u.el('span', 'spinner', size);
      u.el('i', '', spin, '▲');
      u.el('i', '', spin, '▼');
      _c.bottom = u.el('footer', 'bottom', aside);
      _c.strip = u.el('div', 'bottom-strip', _c.app);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
      _c.body.insertBefore(_c.stage, _c.aside);
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
      if (_c.placement === 'footer') _c.bottom.appendChild(foot);
      else _c.strip.appendChild(foot);
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
    name: 'design-read-figure-grid-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#8d83c2'],
      LOW_ACCENTS: ['#8d83c2'],
      parts,
    },
  });
})();
