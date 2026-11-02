(function () {
  'use strict';
  const palette = { bg: '#f7f7f7', panel: '#fff', fg: '#333', muted: '#737a81', line: '#c4c9ce' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let display = _c.ctx.display || 'header';
      if ((display === 'panel' && !(_c.W >= 1180 && _c.H >= 700)) ||
          (display === 'toast' && _c.H < 700)) display = 'header';
      _c.display = display;
      document.body.className = 'bootstrap-admin operational instruction-' + _c.ctx.display + ' display-' + display;
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
      const top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      u.el('strong', '', brand, 'Acme Admin');
      u.el('small', '', brand, 'Project Management');
      const nav = u.el('nav', 'menu', top);
      for (const [name, active] of [
        ['Home', false], ['Projects', true], ['Tasks', false],
        ['Reports', false], ['People', false], ['Settings', false],
      ]) u.el('span', active ? 'active' : '', nav, name);
      const utility = u.el('div', 'utility', top);
      u.el('span', '', utility, 'Help');
      u.el('i', '', utility, '|');
      u.el('span', '', utility, 'Sign out');
      const center = u.el('section', 'center', app);
      const heading = u.el('div', 'page-heading', center);
      u.el('h1', '', heading, 'Project Search');
      u.el('p', '', heading, 'Find and view projects by name, owner, or keyword.');
      Object.assign(_c, { app, top, utility, center, header: heading });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief', 'chrome-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.utility;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const recent = u.el('section', 'recent', _c.center);
      u.el('h2', '', recent, 'Recent Projects');
      const table = u.el('table', 'project-table', recent);
      const head = u.el('tr', '', u.el('thead', '', table));
      for (const title of ['Name', 'Owner', 'Status', 'Last Updated']) u.el('th', '', head, title);
      const tbody = u.el('tbody', '', table);
      for (const row of [
        ['Website Redesign', 'Taylor Kim', 'In Progress', 'Apr 12, 2013'],
        ['Mobile App', 'Jordan Lee', 'Planning', 'Apr 10, 2013'],
        ['Customer Portal', 'Morgan Diaz', 'On Hold', 'Apr 2, 2013'],
        ['Internal Tools', 'Riley Chen', 'Completed', 'Mar 28, 2013'],
      ]) {
        const tr = u.el('tr', '', tbody);
        for (const value of row) u.el('td', '', tr, value);
      }
      Object.assign(_c, { body: _c.center, recent });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.recent;
      base(_c);
      _c.body = body;
      const note = _c.recent.querySelector('.ref-panel');
      if (note) note.classList.add('brief', 'chrome-panel');
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('section', 'stage', _c.center);
      _c.center.insertBefore(stage, _c.recent);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => { base(_c); },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('workspace-status');
      text.textContent = _c.ctx.finish ? 'Acme Admin · Project workspace' : '';
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'chrome-toast');
        foot.prepend(note);
      }
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
    name: 'design-solve-puzzle-hot-cold-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-hot-cold-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2879c9'],
      LOW_ACCENTS: ['#2879c9'],
      parts,
    },
  });
})();
