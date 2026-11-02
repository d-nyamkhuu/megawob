(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shape-10',
    'task': 'read-figure',
    'scenario': 'shape',
    'style': 'swiss',
    'title': 'Task 01',
    'menu': 'Play    Instructions    Settings    Help',
    'note': 'Task Guide',
    'layout': 'stagger',
    'subtitle': '',
    'aside': '02\n\nWhat to do\n\n1. Look at the shapes and letters.\n2. Read the task.\n3. Click on it.',
  };
  function railIcon(u, p, name) {
    const svg = u.svg('svg', { viewBox: '0 0 64 64', 'aria-hidden': 'true' }, p),
      defs = u.svg('defs', {}, svg);
    const grad = u.svg('linearGradient', { id: 'icon-' + name, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    u.svg('stop', { offset: 0, 'stop-color': '#fff', 'stop-opacity': 0.65 }, grad);
    u.svg('stop', { offset: 1, 'stop-color': '#fff', 'stop-opacity': 0 }, grad);
    const path = (d, fill, stroke = '#254761', sw = 2) =>
      u.svg('path', { d, fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'round' }, svg);
    if (name === 'Home') {
      path('M11 29V58H53V28L32 10Z', '#e7f0f5');
      path('M44 20V7H51V26', '#f16d20');
      path('M5 32L32 4L59 31L55 35L32 13L9 36Z', '#d74718');
      path('M27 40H37V58H27Z', '#eaa834');
      path('M16 34H24V44H16ZM40 34H48V44H40Z', '#8dc7ef');
      path('M32 15V56M13 30H51', 'none', '#9db5c9', 1);
    } else if (name === 'Open') {
      path('M7 20V13Q7 9 13 9H25L31 16H54Q59 16 59 21V54H7Z', '#efc249', '#96782a');
      path('M5 23Q5 20 10 20H56Q60 20 59 25L57 55H8Z', '#ffd453', '#96782a');
      path('M9 25H55', 'none', '#fff6b7', 2);
    } else if (name === 'Find') {
      path('M39 41L47 36L60 52Q63 58 57 60L52 58Z', '#b8a573');
      u.svg('circle', { cx: 27, cy: 26, r: 20, fill: '#74bce8', stroke: '#234864', 'stroke-width': 2.5 }, svg);
      u.svg('circle', { cx: 27, cy: 26, r: 15, fill: '#c3e8ff', stroke: '#549bca', 'stroke-width': 2 }, svg);
      path('M15 23Q18 12 30 13', 'none', '#fff', 3);
    } else if (name === 'Settings') {
      let d = '';
      for (let i = 0; i < 40; i++) {
        const a = ((i * 9 - 90) * Math.PI) / 180,
          r = [28, 28, 23, 23][i % 4];
        d += (i ? 'L' : 'M') + (32 + Math.cos(a) * r) + ',' + (32 + Math.sin(a) * r);
      }
      path(d + 'Z', '#afc6d6');
      u.svg('circle', { cx: 32, cy: 32, r: 16, fill: '#dfebf0', stroke: '#526e85', 'stroke-width': 2 }, svg);
      u.svg('circle', { cx: 32, cy: 32, r: 8, fill: '#809caf', stroke: '#3e5d73', 'stroke-width': 2 }, svg);
    } else {
      u.svg('circle', { cx: 32, cy: 32, r: 28, fill: '#2c80cd', stroke: '#234866', 'stroke-width': 2 }, svg);
      const t = u.svg(
        'text',
        {
          x: 32,
          y: 50,
          'text-anchor': 'middle',
          fill: '#fff',
          stroke: '#28527d',
          'stroke-width': 1,
          'font-family': 'Arial',
          'font-weight': 700,
          'font-size': 48,
        },
        svg,
      );
      t.textContent = '?';
    }
    u.svg(
      'rect',
      {
        x: 7,
        y: 7,
        width: 50,
        height: 47,
        rx: 15,
        fill: 'url(#icon-' + name + ')',
        opacity: 0.35,
        'pointer-events': 'none',
      },
      svg,
    );
  }
  const palette = { bg: '#0a3fd0', panel: '#fcfbf4', fg: '#111111', muted: '#536579', line: '#7f9db9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let display = _c.ctx.display || 'header';
      if (display === 'panel' && _c.W < 1120) display = 'header';
      if (display === 'toast' && _c.H < 690) display = 'header';
      _c.display = display;
      document.body.classList.toggle('ref-has-note', display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('xp', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const ic = u.svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24' }, top);
      u.svg('path', { d: 'M2 3L9 2L12 8L8 13L2 11Z', fill: '#ffda2b', stroke: '#d3a71b', 'stroke-width': 0.7 }, ic);
      u.svg('path', { d: 'M16 3L22 7L20 13L14 13L12 7Z', fill: '#288fee', stroke: '#06458d', 'stroke-width': 0.8 }, ic);
      u.svg('path', { d: 'M13 14L19 12L23 18L19 23L12 20Z', fill: '#13ad76', stroke: '#075f59', 'stroke-width': 0.8 }, ic);
      u.svg('path', { d: 'M3 13L8 12L11 18L7 23L2 20Z', fill: '#f53b36', stroke: '#b32633', 'stroke-width': 0.8 }, ic);
      u.el('span', '', top, 'Shape Finder');
      const wc = u.el('div', 'xpwc', top);
      for (const k of ['min', 'max', 'close']) {
        const b = u.el('i', k === 'close' ? 'cl' : k, wc);
        b.setAttribute('aria-hidden', 'true');
      }
      Object.assign(_c, { app, top, header: top });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const menu = u.el('nav', 'menu', _c.app);
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Help']) u.el('span', '', menu, m);
      const xb = u.el('div', 'xpbody', _c.app);
      const rail = u.el('div', 'rail', xb);
      for (const n of ['Home', 'Open', 'Find', 'Settings', 'Help']) {
        const r = u.el('div', 'ri', rail);
        railIcon(u, r, n);
        u.el('span', '', r, n);
      }
      const main = u.el('div', 'xpmain', xb);
      const center = u.el('div', 'center', main);
      Object.assign(_c, { main, center, header: center });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief', 'instruction-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-panel');
      if (note) note.classList.add('brief', 'instruction-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'instruction-note');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.main.appendChild(foot);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-shape-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0a3fd0'],
      LOW_ACCENTS: ['#0a3fd0'],
      parts,
    },
  });
})();
