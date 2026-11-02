(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#123e70', muted: '#748ba5', line: '#c8d9eb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original task pane has room for each note mode at every viewport.
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
      document.body.className = 'gloss wide instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const rail = u.el('nav', 'menu', app);
      [
        ['⌂', 'Home'], ['▤', 'Tasks'], ['▦', 'Calendar'],
        ['▰', 'Files'], ['♣', 'People'], ['⚙', 'Settings'],
      ].forEach((it, i) => {
        const row = u.el('div', 'rail-item' + (!i ? ' active' : ''), rail);
        const box = u.el('span', 'rail-icon', row);
        if (i === 5) box.textContent = it[0];
        else {
          const icon = u.svg('svg', { width: 29, height: 29, viewBox: '0 0 32 32', fill: 'currentColor' }, box);
          if (i === 0) u.svg('path', { d: 'M2 14 16 2l14 12v16H19V20h-6v10H2z' }, icon);
          else if (i === 1) {
            u.svg('rect', { x: 4, y: 3, width: 24, height: 26, rx: 2 }, icon);
            [9, 15, 21].forEach((y) => {
              u.svg('path', { d: 'M12 ' + y + 'h12', stroke: '#fff', 'stroke-width': 2 }, icon);
              u.svg('rect', { x: 7, y: y - 2, width: 2, height: 2, fill: '#fff' }, icon);
            });
          } else if (i === 2) {
            u.svg('rect', { x: 3, y: 5, width: 26, height: 25, rx: 2 }, icon);
            u.svg('path', { d: 'M3 11h26M10 2v7M22 2v7', stroke: '#fff', 'stroke-width': 2.5 }, icon);
            [8, 14, 20].forEach((x) => u.svg('path', { d: 'M' + x + ' 15v2m0 4v2', stroke: '#fff', 'stroke-width': 2 }, icon));
          } else if (i === 3) u.svg('path', { d: 'M2 8h11l3 4h14v16H2zM2 8V4h11l3 4' }, icon);
          else {
            u.svg('circle', { cx: 11, cy: 10, r: 5 }, icon);
            u.svg('circle', { cx: 23, cy: 11, r: 4 }, icon);
            u.svg('path', { d: 'M2 29c0-7 4-11 9-11s9 4 9 11zM18 20c6-2 12 2 12 9H22' }, icon);
          }
        }
        u.el('span', '', row, it[1]);
      });
      const top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      u.el('strong', '', brand, 'My Workspace');
      u.el('small', '', brand, 'Organize  ·  Focus  ·  Get Things Done');
      const search = u.el('div', 'search', top);
      u.el('span', 'search-icon', search, '⌕');
      u.el('span', '', search, 'Search');
      const center = u.el('div', 'center', app);
      const toolbar = u.el('div', 'section-title', center, 'Number Order');
      Object.assign(_c, { app, center, toolbar, header: center });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      _c.body.classList.remove('ref-panel-right');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
      _c.foot = _c.util.el('footer', 'bottom', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.foot.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
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
    name: 'design-read-figure-ascending-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-ascending-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1769b0'],
      LOW_ACCENTS: ['#1769b0'],
      parts,
    },
  });
})();
