(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#090909', muted: '#555', line: '#888' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Each note mode shares the worksheet's original note row.
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
      document.body.classList.add('academic', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      u.el('strong', '', brand, 'Eastbrook College');
      u.el('span', '', brand, 'Computer Skills Practice');
      const toolbar = u.el('div', 'end-tools', top);
      const links = u.el('nav', 'header-links', top);
      ['Home', 'Help', 'Log out'].forEach((t) => u.el('a', '', links, t));
      const banner = u.el('section', 'banner', app);
      const motto = u.el('div', 'motto', banner);
      u.el('span', '', motto, 'Learning Today');
      u.el('span', '', motto, 'A Brighter Tomorrow');
      const campus = u.el('div', 'campus', banner);
      u.el('i', 'tree', campus);
      u.el('i', 'building', campus);
      u.el('i', 'tree tree-two', campus);
      const fold = u.el('div', 'fold-tools', banner),
        toggle = u.el('button', 'tools-toggle', fold, '▶  Expand tools');
      toggle.type = 'button';
      u.el('p', 'fold-note', fold, 'Tools are hidden to keep the workspace focused.');
      const toolDetails = u.el('div', 'tool-details', fold, 'Worksheet controls are available here.');
      toggle.addEventListener('click', () => {
        const opened = document.body.classList.toggle('tools-open');
        toggle.textContent = opened ? '▼  Hide tools' : '▶  Expand tools';
        toolDetails.hidden = !opened;
      });
      toolDetails.hidden = true;
      const index = u.el('nav', 'index', app);
      for (let i = 1; i <= 10; i++) u.el('a', i === 6 ? 'current' : '', index, String(i));
      const center = u.el('div', 'center', app);
      const noteSlot = u.el('div', 'task-note', center);
      Object.assign(_c, { app, top, toolbar, center, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      _c.footer = _c.util.el('footer', 'bottom', _c.app);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
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
    name: 'design-read-figure-number-checkboxes-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-number-checkboxes-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#071b79'],
      LOW_ACCENTS: ['#071b79'],
      parts,
    },
  });
})();
