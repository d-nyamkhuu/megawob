(function () {
  'use strict';
  const palette = { bg: '#f8f6ef', panel: '#fcfbf6', fg: '#090b0b', muted: '#58605c', line: '#111414' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'modernist instruction-' + _c.display;
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
      u.el('strong', 'brand', top, 'NUMCORE');
      const nav = u.el('nav', 'menu', top);
      ['Focus', 'Practice', 'Improve'].forEach((label, i) => {
        if (i) u.el('span', 'slash', nav, '/');
        u.el('span', 'nav-item', nav, label);
      });
      u.el('i', 'status-dot', top);
      const center = u.el('div', 'center', app);
      const noteSlot = u.el('div', 'note-slot', center);
      const bottom = u.el('footer', 'bottom', app);
      Object.assign(_c, { app, center, noteSlot, bottom, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteSlot;
      base(_c);
      _c.header = header;
      const note = _c.noteSlot.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
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
        panel.querySelector('.ref-panel-title').textContent = 'EPISODE SETTINGS';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.noteSlot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.bottom.appendChild(foot);
        _c.bottom.classList.toggle('link-bottom', _c.placement === 'link');
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
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
    name: 'design-read-figure-greatest-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-greatest-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a0ff24'],
      LOW_ACCENTS: ['#a0ff24'],
      parts,
    },
  });
})();
