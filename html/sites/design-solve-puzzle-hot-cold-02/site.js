(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#10294d', muted: '#556274', line: '#c8d9e9' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'web2 full-board instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const noteSlot = u.el('div', 'note-slot', app);
      const mast = u.el('header', 'masthead', app);
      const tabs = u.el('nav', 'file-tabs', mast);
      for (const [label, active] of [['Files', true], ['Photos', false], ['Music', false], ['Shared', false], ['Trash', false]]) {
        u.el('span', 'file-tab' + (active ? ' active' : ''), tabs, label);
      }
      const links = u.el('div', 'utility-links', mast);
      for (const label of ['Help', 'Settings', 'Sign Out']) u.el('span', 'utility-link', links, label);
      Object.assign(_c, { app, noteSlot, header: mast });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteSlot;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.header.classList.toggle('has-toolbar-end', _c.headerTools.children.length > 0);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const center = u.el('div', 'center', _c.app);
      u.el('div', 'page-title', center, 'My Files');
      u.el('div', 'page-subtitle', center, 'Browse and manage your files.');
      const search = u.el('div', 'search-row', center);
      u.el('div', 'search-field', search);
      u.el('button', 'search-button', search, '⌕　Search');
      _c.body = center;
    },
    'frame.panel': (base) => (_c) => { base(_c); },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.body.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'bottom', _c.app);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
      _c.util.el('button', 'reset-control', footer, 'Reset');
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.insertBefore(dock, _c.footer.querySelector('.reset-control'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.'
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    }
  };
  env.site({
    name: 'design-solve-puzzle-hot-cold-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-hot-cold-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#35a72e'],
      LOW_ACCENTS: ['#35a72e'],
      parts
    }
  });
})();
