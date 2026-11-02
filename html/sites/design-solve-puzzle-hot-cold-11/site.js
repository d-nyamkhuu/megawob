(function () {
  'use strict';
  const palette = { bg: '#a9d5ff', panel: '#fffce1', fg: '#101a3b', muted: '#4879aa', line: '#183971' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'human brief-left instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#d7e2e8', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      const brand = u.el('span', 'brand-name', top);
      u.el('span', 'brand-discovery', brand, 'DISCOVERY');
      u.el('span', 'brand-zone', brand, 'ZONE');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', { d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      u.el('small', '', top, 'EXPLORE • LEARN • FIND');
      u.el('nav', 'menu', top, 'HELP     |     SETTINGS     |     EXIT');
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      Object.assign(_c, { app, top, center, brief, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.brief.querySelector('.ref-instruction');
      if (note) note.prepend(_c.util.el('b', 'task-title', null, 'Find the Hot Spot'));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      const note = _c.brief.querySelector('.ref-panel-text');
      if (note) note.prepend(_c.util.el('b', 'task-title', null, 'Find the Hot Spot'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-text').prepend(_c.util.el('b', 'task-title', null, 'Find the Hot Spot'));
        _c.brief.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const bottom = _c.util.el('footer', 'bottom', _c.app);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) bottom.appendChild(foot);
      _c.bottom = bottom;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const secondary = ctx.kind === 'promo' && !ctx.initial && !!document.querySelector('.overlay.promo');
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind + (secondary ? ' secondary-overlay' : ''), document.body);
      if (ctx.kind === 'promo' && !secondary) {
        u.el('span', 'newsletter-copy', el, '');
        const email = u.el('input', 'newsletter-email', el);
        email.type = 'email';
        email.placeholder = 'Your email address';
        const signup = u.el('button', 'newsletter-signup', el, 'Sign Up');
        signup.type = 'button';
        const dismiss = u.el('button', 'newsletter-close', el, 'Close');
        dismiss.setAttribute('aria-label', 'Close newsletter');
        dismiss.addEventListener('click', ctx.dismiss);
        const decline = u.el('button', 'newsletter-decline', el, 'No thanks');
        decline.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const messages = {
        promo: 'Park news and practice updates are available.',
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind] || '');
      const dismiss = u.el('button', '', el, 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-hot-cold-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1264cf'], LOW_ACCENTS: ['#1264cf'], parts,
    },
  });
})();
