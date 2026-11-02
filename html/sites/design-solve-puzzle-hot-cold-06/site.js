(function () {
  'use strict';
  const palette = { bg: '#dbe3ea', panel: '#f7f8f8', fg: '#101b2c', muted: '#526b82', line: '#879db4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.body.className = 'industrial instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const rail = u.el('aside', 'command-rail', app);
      for (const [i, label] of ['Home', 'Inventory', 'Orders', 'Facilities', 'Reports', 'Support'].entries()) {
        const row = u.el('div', 'rail-item' + (!i ? ' active' : ''), rail, label);
        if (label === 'Facilities') u.el('span', 'rail-arrow', row, '▶');
      }
      const shell = u.el('div', 'workspace', app);
      const top = u.el('header', 'top', shell);
      u.el('strong', 'brand', top, 'Acme Supply Co.');
      u.el('span', 'partner', top, 'Partner Extranet');
      const links = u.el('div', 'top-links', top);
      u.el('span', '', links, 'Help');
      u.el('i', '', links, '|');
      u.el('span', '', links, 'Contact');
      u.el('i', '', links, '|');
      u.el('span', '', links, 'Sign Out');
      u.el('span', 'date', top, 'Tue, Apr 13, 1999');
      const menu = u.el('nav', 'menu', shell);
      for (const [i, label] of 'Site Map|Asset Search|Maintenance|Safety|Administration'.split('|').entries()) {
        u.el('span', 'tab' + (!i ? ' selected' : ''), menu, label);
      }
      const center = u.el('div', 'center', shell);
      const brief = u.el('div', 'brief', center);
      if (_c.display === 'hidden') {
        brief.textContent = 'Location search ready.';
        brief.classList.add('status-brief');
      }
      Object.assign(_c, { shell, menu, center, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task Instructions';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const recent = u.el('section', 'recent', _c.shell);
      const recentTitle = u.el('div', 'recent-title', recent, 'Recent Clicks');
      const table = u.el('div', 'recent-table', recent);
      for (const x of ['#', 'Time', 'Location', 'Hint', 'Distance']) u.el('span', 'th', table, x);
      for (const [text, cls] of [['1', ''], ['10:24 AM', ''], ['Conference 101', ''], ['COLD', ' cold-text'], ['Farther away', '']]) {
        u.el('span', 'td' + cls, table, text);
      }
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      recentTitle.appendChild(foot);
      Object.assign(_c, { recentTitle, foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.recentTitle.appendChild(dock);
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
    name: 'design-solve-puzzle-hot-cold-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-hot-cold-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#173c71'],
      LOW_ACCENTS: ['#173c71'],
      parts,
    },
  });
})();
