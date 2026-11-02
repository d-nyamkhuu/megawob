(function () {
  'use strict';
  const palette = { bg: '#170f1d', panel: '#30233a', fg: '#f3edf7', muted: '#b5a9bf', line: '#574762' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('precision', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const glyph = u.el('span', 'app-glyph', top, '⠿');
      glyph.setAttribute('aria-hidden', 'true');
      u.el('span', 'window-title', top, 'Number Sequence');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      const body = u.el('div', 'workspace', app);
      const nav = u.el('nav', 'side-nav', body);
      [['◉', 'Exercise'], ['▥', 'Progress'], ['⚙', 'Settings'], ['ⓘ', 'Help']].forEach((x, i) => {
        const item = u.el('div', 'nav-item' + (!i ? ' active' : ''), nav);
        u.el('span', 'nav-icon', item, x[0]);
        u.el('span', '', item, x[1]);
      });
      const center = u.el('section', 'center', body);
      const aside = u.el('aside', 'aside', document.body);
      const paletteHead = u.el('div', 'palette-head', aside);
      u.el('span', 'palette-grip', paletteHead, '⠿');
      u.el('span', 'palette-title', paletteHead, 'Tools');
      const close = u.el('span', 'palette-close', paletteHead, '×');
      close.setAttribute('aria-hidden', 'true');
      const tools = u.el('div', 'palette-tools', aside);
      [['➤', 'Pointer', true], ['▦', 'Keyboard Shortcuts', false], ['☼', 'Appearance', false]].forEach((x) => {
        const row = u.el('div', 'tool-row' + (x[2] ? ' active' : ''), tools);
        u.el('span', 'tool-icon', row, x[0]);
        u.el('span', '', row, x[1]);
        if (x[1] === 'Appearance') u.el('span', 'tool-chevron', row, '⌄');
      });
      Object.assign(_c, { app, top, body, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
      // Preserve the original subtitle's spacing without repeating the goal.
      if (_c.display !== 'hidden') _c.util.el('div', 'instruction-sub', _c.center);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
      _c.bottom = _c.util.el('footer', 'bottom', _c.center);
      _c.util.el('button', 'clear-visual', _c.bottom, 'Clear').type = 'button';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
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
    name: 'design-read-figure-ascending-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-ascending-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff6470'],
      LOW_ACCENTS: ['#ff6470'],
      parts,
    },
  });
})();
