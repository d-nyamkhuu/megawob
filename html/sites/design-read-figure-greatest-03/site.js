(function () {
  'use strict';
  const palette = { bg: '#e9edf0', panel: '#fff', fg: '#18212b', muted: '#536273', line: '#cbd2da' };
  function tool(u, parent, label, path) {
    const item = u.el('div', 'tool', parent);
    const svg = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 32 32', class: 'tool-icon' }, item);
    u.svg('path', { d: path, fill: 'none', stroke: 'currentColor', 'stroke-width': 2.1,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    u.el('span', '', item, label);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'yosemite-center-stage instruction-' + _c.display;
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
      const lights = u.el('div', 'traffic-lights', top);
      [['red', '#ff5f57'], ['yellow', '#febc2e'], ['green', '#28c840']].forEach(([n, c]) => {
        const d = u.el('i', n, lights);
        d.style.background = c;
      });
      u.el('strong', 'app-name', top, 'Number Practice');
      const menubar = u.el('nav', 'mac-menus', top);
      ['File', 'Edit', 'View', 'Window', 'Help'].forEach((x) => u.el('span', 'menu-item', menubar, x));
      const titlebar = u.el('div', 'titlebar', app);
      u.el('span', 'window-title', titlebar, 'Number Practice');
      const search = u.el('div', 'search', titlebar);
      u.svg('svg', { width: 17, height: 17, viewBox: '0 0 20 20', class: 'search-icon' }, search).innerHTML =
        '<circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m12 12 5 5" stroke="currentColor" stroke-width="1.8"/>';
      u.el('span', '', search, 'Search');
      const work = u.el('div', 'work-area', app);
      const center = u.el('section', 'center', work);
      const noteSlot = u.el('div', 'note-slot', center);
      Object.assign(_c, { app, work, center, noteSlot, header: titlebar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteSlot;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const left = u.el('div', 'perimeter-tools left-tools', _c.work);
      const right = u.el('div', 'perimeter-tools right-tools', _c.work);
      tool(u, left, 'Settings', 'M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.9 2.9m12.6 12.6 2.9 2.9m0-18.4-2.9 2.9M9.7 22.3l-2.9 2.9M16 10a6 6 0 1 0 0 12 6 6 0 0 0 0-12z');
      tool(u, left, 'Help', 'M16 28a12 12 0 1 0 0-24 12 12 0 0 0 0 24zm-3-16a3.2 3.2 0 1 1 5.3 2.4c-1.6 1.4-2.3 2-2.3 4m0 3v.2');
      tool(u, right, 'Notes', 'M8 4h15v24H8zM12 10h8M12 15h8M12 20h6M5 8v20h15');
      tool(u, right, 'Keyboard Shortcuts', 'M3 8h26v16H3zM7 12h2m3 0h2m3 0h2m3 0h2M7 16h2m3 0h2m3 0h2m3 0h2M9 20h14');
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
      _c.bottom = _c.util.el('footer', 'bottom', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.bottom.appendChild(foot);
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
    name: 'design-read-figure-greatest-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-greatest-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#287bea'],
      LOW_ACCENTS: ['#287bea'],
      parts,
    },
  });
})();
