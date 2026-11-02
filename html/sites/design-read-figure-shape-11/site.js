(function () {
  'use strict';
  const palette = { bg: '#f1f2f6', panel: '#ffffff', fg: '#2a2f3a', muted: '#656b77', line: '#d1d5de' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('mat', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', 'apptitle', top, 'Shape Practice');
      const nav = u.el('nav', 'menu', top);
      ['Home', 'Practice', 'Results'].forEach((m, i) => u.el('span', i ? '' : 'on', nav, m));
      const av = u.svg('svg', { width: 48, height: 48, viewBox: '0 0 48 48', class: 'avatar' }, top);
      u.svg('circle', { cx: 24, cy: 24, r: 24, fill: '#fff' }, av);
      u.svg('circle', { cx: 24, cy: 19, r: 7, fill: '#3f51b5' }, av);
      u.svg('ellipse', { cx: 24, cy: 35, rx: 11, ry: 6, fill: '#3f51b5' }, av);
      const center = u.el('div', 'center', app);
      const head = u.el('div', 'head mode-' + _c.display, center);
      Object.assign(_c, { app, top, center, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
      // Retain the instruction band's spacing without repeating the task goal.
      _c.util.el('div', 'sub', _c.header).setAttribute('aria-hidden', 'true');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      const clk = u.svg('svg', { width: 44, height: 44, viewBox: '0 0 44 44', class: 'clock' }, footer);
      u.svg('circle', { cx: 22, cy: 22, r: 19, fill: 'none', stroke: '#444', 'stroke-width': 3 }, clk);
      u.svg('path', { d: 'M22 10v12l7 5', fill: 'none', stroke: '#444', 'stroke-width': 3 }, clk);
      const tm = u.el('div', 'timer', footer);
      u.el('b', 'timer-title', tm, 'Time: Ready');
      u.el('span', 'timer-note', tm, 'Your practice session is ready.');
      u.el('button', 'clear', footer, 'Clear').type = 'button';
      base(_c);
      const foot = document.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').remove();
      footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const ic = u.el('div', 'upic', el);
      const arrow = u.svg('svg', { viewBox: '0 0 48 48', 'aria-hidden': 'true' }, ic);
      u.svg(
        'path',
        {
          d: 'M20 43V22H9a2 2 0 0 1-1.4-3.4L22.6 3.5a2 2 0 0 1 2.8 0l15 15.1A2 2 0 0 1 39 22H28v21z',
          fill: 'currentColor',
        },
        arrow,
      );
      const x = u.el('button', 'upx', el);
      x.type = 'button';
      x.setAttribute('aria-label', 'Close update reminder');
      const cross = u.svg('svg', { viewBox: '0 0 30 30', 'aria-hidden': 'true' }, x);
      u.svg(
        'path',
        {
          d: 'M6 6l18 18M24 6L6 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 3,
          'stroke-linecap': 'round',
        },
        cross,
      );
      const timerTitle = document.querySelector('.timer-title'),
        timerNote = document.querySelector('.timer-note');
      if (timerTitle) timerTitle.textContent = 'Time: Paused';
      if (timerNote) timerNote.textContent = 'The timer will start after the update reminder is closed.';
      const close = () => {
        ctx.dismiss();
        if (timerTitle) timerTitle.textContent = 'Time: Ready';
        if (timerNote) timerNote.textContent = 'Choose a shape to record your answer.';
      };
      x.addEventListener('click', close);
      const b = u.el('div', 'upbody', el);
      u.el('h3', '', b, 'A new version is available');
      u.el('p', '', b, 'Get the latest features and security improvements.');
      const row = u.el('div', 'uprow', b);
      const dismiss = u.el('button', 'later', row, 'Remind me later');
      dismiss.addEventListener('click', close);
      const now = u.el('button', 'now', row, 'Update now');
      now.addEventListener('click', close);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-shape-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'templates/site/css/read-figure-shape-eab2f8.css', 'mat.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-read-figure-shape-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1b6de7'],
      LOW_ACCENTS: ['#1b6de7'],
      parts,
    },
  });
})();
