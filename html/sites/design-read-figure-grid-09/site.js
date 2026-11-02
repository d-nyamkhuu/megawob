(function () {
  'use strict';
  const palette = { bg: '#c8c8c8', panel: '#e5e5e5', fg: '#111111', muted: '#555555', line: '#8d8d8d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All instruction modes have a dedicated card in the left pane.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'riscos utility instruction-' + _c.display;
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
      u.el('span', 'window-title', top, 'RISC OS 4 · Coordinate Plotter');
      const close = u.el('button', 'window-close', top, '×');
      close.type = 'button';
      close.addEventListener('click', () => env.log('decoy', { label: 'Close' }));
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Coordinate Plotter');
      u.el('p', 'aside-copy', aside,
        'A Cartesian grid is shown on the right.\n\nAxes are numbered.\nThe origin (0,0) is marked.\nNegative coordinates are shown.');
      Object.assign(_c, { app, top, center, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.top.insertBefore(_c.headerTools, _c.top.querySelector('.window-close'));
      _c.top.classList.add('has-end-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-panel');
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
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      const tools = u.el('div', 'tool-cluster', footer);
      [
        ['Select', '➤', 'active'],
        ['Add Point', '●', ''],
        ['Erase', '◩', ''],
        ['Show Grid', '▦', 'active'],
      ].forEach(([label, icon, active]) => {
        const b = u.el('button', 'tool ' + active, tools);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label }));
        u.el('span', 'tool-icon', b, icon);
        u.el('span', 'tool-label', b, label);
      });
      const coords = u.el('div', 'coordinate-cluster', footer);
      ['X', 'Y'].forEach((axis) => {
        const group = u.el('label', 'coordinate', coords);
        u.el('b', '', group, axis + ':');
        const field = u.el('span', 'readout', group, '-');
        field.setAttribute('aria-hidden', 'true');
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      Object.assign(_c, { footer, foot });
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
    name: 'design-read-figure-grid-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-grid-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#183d9b'],
      LOW_ACCENTS: ['#183d9b'],
      parts,
    },
  });
})();
