(function () {
  'use strict';
  const palette = { bg: '#d7d7d4', panel: '#dededb', fg: '#090909', muted: '#666666', line: '#777777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The document has a dedicated instruction pane at every size.
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
      document.body.className = 'beos offset instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 0, fill: '#fff', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Number Order');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      u.el('nav', 'menu', top, 'File     Edit     Options     Help');
      const toolbar = u.el('div', 'chrome-actions', top);
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      Object.assign(_c, { app, top, toolbar, center, brief, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.brief;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('section', 'stage', _c.center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside);
      u.el('p', 'aside-copy', aside);
      const tools = u.el('div', 'document-tools', _c.app);
      for (const [kind, label] of [['pointer', 'Pointer'], ['select', 'Selection'], ['eraser', 'Eraser']]) {
        const tool = u.el('button', 'document-tool ' + kind, tools);
        tool.type = 'button';
        tool.title = label;
        tool.setAttribute('aria-label', label);
        const svg = u.svg('svg', { width: 30, height: 34, viewBox: '0 0 30 34', 'aria-hidden': 'true' }, tool);
        if (kind === 'pointer') u.svg('path', { d: 'M7 3v25l6-7 5 11 5-3-6-10h9Z', fill: '#fff', stroke: '#111', 'stroke-width': 1.3 }, svg);
        else if (kind === 'select') u.svg('rect', { x: 4, y: 6, width: 22, height: 22, fill: 'none', stroke: '#111', 'stroke-width': 1.5, 'stroke-dasharray': '4 2' }, svg);
        else {
          u.svg('path', { d: 'M3 21 19 4q2-2 4 0l5 5q2 2 0 4L13 30H8Z', fill: '#ddd', stroke: '#111', 'stroke-width': 1.5 }, svg);
          u.svg('path', { d: 'm7 17 10 10M10 30l3-4', fill: 'none', stroke: '#111', 'stroke-width': 1.2 }, svg);
        }
        tool.addEventListener('click', () => env.log('decoy', { label }));
      }
      _c.bottom = u.el('div', 'bottom', _c.app);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.brief.appendChild(note);
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
    name: 'design-read-figure-ascending-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-ascending-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#18488f'],
      LOW_ACCENTS: ['#18488f'],
      parts,
    },
  });
})();
