(function () {
  'use strict';
  const palette = { bg: '#2d60a0', panel: '#e4e2dc', fg: '#111111', muted: '#555555', line: '#777777' };
  function desktop(u) {
    const aside = u.el('aside', 'aside', document.body);
    u.el('b', '', aside, 'Shape Quiz');
    const tabMark = u.svg('svg', { viewBox: '0 0 24 24', class: 'tab-mark', 'aria-hidden': 'true' }, aside);
    u.svg('path', { d: 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M5 5l4 4m10-4-4 4m4 10-4-4M5 19l4-4', fill: 'none', stroke: '#b28d23', 'stroke-width': 1.5 }, tabMark);
    u.el('p', 'aside-copy', aside, '');
    ['BeOS', 'Home', 'Trash'].forEach((n, i) => {
      const item = u.el('div', 'dicon desktop-' + i, document.body);
      const svg = u.svg('svg', { viewBox: '0 0 60 60', width: 60, height: 60, 'aria-hidden': 'true' }, item);
      const path = (d, fill, stroke = '#252525') => u.svg('path', { d, fill, stroke, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, svg);
      if (i === 0) {
        path('M6 40L34 35L55 42L54 54L30 59L5 52Z', '#b5b8b6');
        path('M6 40L30 46L55 42L30 36Z', '#edf0eb');
        path('M30 46L54 42L54 53L30 58Z', '#727773');
        path('M11 5L35 2L50 6L50 37L34 44L11 36Z', '#d9dcd6');
        path('M15 9L35 7L43 10L43 31L34 35L15 30Z', '#8cabbc');
        path('M15 9L34 12L34 35L15 30Z', '#c1d5dc');
        path('M34 12L43 10L43 31L34 35Z', '#7393a3');
        path('M10 44L26 48L26 52L10 48Z', '#4b4e4b');
        path('M36 49L41 48L41 52L36 53Z', '#e6b93f');
      } else if (i === 1) {
        path('M5 15L7 8L20 9L27 15L51 17L53 49L8 46Z', '#e8be78');
        path('M4 18L50 23L50 53L7 48Z', '#ffe0a0');
        path('M50 23L54 19L54 52L50 53Z', '#ba8846');
        path('M7 20L48 25', 'none', '#fff1c4');
        path('M9 46L48 51', 'none', '#e2b96b');
      } else {
        path('M12 15L48 15L43 52Q30 61 18 52Z', '#b4b8b5');
        path('M15 18L20 49M23 21L25 54M31 22L31 55M39 21L37 53M45 18L41 49', 'none', '#626966');
        u.svg('ellipse', { cx: 30, cy: 15, rx: 22, ry: 7, fill: '#dce0db', stroke: '#252525', 'stroke-width': 1.6 }, svg);
        u.svg('ellipse', { cx: 30, cy: 15, rx: 16, ry: 4, fill: '#757b78', stroke: '#fff' }, svg);
        path('M25 9L25 6L36 6L36 10', 'none');
      }
      u.el('span', '', item, n);
    });
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'dark brief-left instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#8266ce', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, '');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', { d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      u.el('nav', 'menu', top, 'File   Edit   View   Help');
      const info = u.el('div', 'qinfo', app);
      u.el('span', '', info, 'Question 1 of 10');
      u.el('span', 'score', info, 'Score: 0');
      const center = u.el('div', 'center', app);
      desktop(u);
      Object.assign(_c, { app, center, header: top });
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
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      if (_c.display === 'panel') _c.body.classList.add('has-instruction-panel');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.body); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('status');
      status.textContent = 'Ready.';
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
    name: 'design-read-figure-identify-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'beos.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#075bd4'],
      LOW_ACCENTS: ['#075bd4'],
      parts,
    },
  });
})();
