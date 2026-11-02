(function () {
  'use strict';
  const palette = { bg: '#4a4a4e', panel: '#bdbdbd', fg: '#000000', muted: '#555555', line: '#777777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This window reserves a complete row for every instruction display.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      document.body.classList.add('nx', 'instruction-' + _c.display);
      const u = _c.util;
      const bar = u.el('header', 'nxbar', document.body);
      const lg = u.svg('svg', { width: 38, height: 44, viewBox: '0 0 38 44', class: 'nxlogo' }, bar);
      u.svg('path', { d: 'M4 13L26 2L36 25L14 42L2 28Z', fill: '#09090a', stroke: '#333' }, lg);
      u.svg('path', { d: 'M4 13L14 30L36 25M14 30V42M4 13L26 2L36 25M26 2L22 18', fill: 'none', stroke: '#999', 'stroke-width': 0.9 }, lg);
      const nt = u.svg('text', { x: 8, y: 25, fill: '#bbb', 'font-size': 12, 'font-family': 'Times New Roman', transform: 'rotate(-24 18 20)' }, lg);
      nt.textContent = 'NeXT';
      u.svg('path', { d: 'M15 16l8 10M20 13l-4 15', stroke: '#81658c', 'stroke-width': 0.7 }, lg);
      u.el('b', '', bar, 'Workspace');
      ['File', 'Edit', 'Tasks', 'Windows', 'Help'].forEach((t) => u.el('span', '', bar, t));
      u.el('em', '', bar, 'Mon Apr 12  9:24 AM');
      const speaker = u.svg('svg', { width: 29, height: 29, viewBox: '0 0 29 29', class: 'nxspk' }, bar);
      u.svg('path', { d: 'M3 11H8L15 5V24L8 18H3Z', fill: '#111' }, speaker);
      u.svg('path', { d: 'M19 8Q26 14 19 21M22 4Q33 14 22 25', fill: 'none', stroke: '#111', 'stroke-width': 1.5 }, speaker);
      const win = u.el('main', 'nxwin', document.body);
      const tb = u.el('div', 'nxtitle', win);
      u.el('i', 'nxmini nxmini-left', tb, '▧');
      u.el('span', '', tb, 'Color Match');
      u.el('i', 'nxmini nxmini-right', tb, '↗');
      const noteArea = u.el('div', 'nxbrief-area', win);
      Object.assign(_c, { win, tb, noteArea, header: tb });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteArea;
      base(_c);
      _c.header = header;
      const note = _c.noteArea.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.win;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteArea;
      base(_c);
      _c.body = body;
      const note = _c.noteArea.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.win);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.noteArea.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.win.appendChild(foot);
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
    name: 'design-read-figure-color-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#222222'],
      LOW_ACCENTS: ['#222222'],
      parts,
    },
  });
})();
