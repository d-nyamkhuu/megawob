(function () {
  'use strict';
  const palette = { bg: '#f8f6e9', panel: '#fff', fg: '#111', muted: '#17427d', line: '#b9d1e6' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('dark', 'horizontal', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32', class: 'title-icon' }, top);
      u.svg('circle', { cx: 16, cy: 16, r: 14, fill: '#fff4c8', stroke: '#154eae', 'stroke-width': 2 }, icon);
      u.svg('text', { x: 3, y: 14, fill: '#154eae', 'font-size': 11, 'font-weight': 700 }, icon).textContent = '1 2';
      u.svg('text', { x: 11, y: 26, fill: '#154eae', 'font-size': 11, 'font-weight': 700 }, icon).textContent = '43';
      u.el('span', '', top, 'Number Guessing Game');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 13h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 2,
        }, svg);
      }
      const menu = u.el('nav', 'menu', top);
      ['Game', 'Options', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      u.el('div', 'overview-heading', brief, 'Overview');
      const copy = u.el('div', 'overview-copy', brief);
      u.el('span', 'overview-star', copy, '★');
      const noteSlot = u.el('div', 'note-slot', copy);
      const stats = u.el('div', 'overview-stats', copy);
      u.el('div', 'info-icon', stats, 'i');
      u.el('div', '', stats, 'Number range:');
      u.el('b', 'range-value', stats, '');
      u.el('div', '', stats, 'Total guesses:');
      u.el('b', 'budget-value', stats, '');
      u.el('div', '', stats, 'Guesses used:');
      u.el('b', 'used-value', stats, '0');
      u.el('div', '', stats, 'Guesses remaining:');
      u.el('b', 'remaining-value', stats, '');
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, '');
      u.el('p', 'aside-copy', aside, '');
      Object.assign(_c, { app, center, menu, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction-copy');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction-copy');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').classList.add('instruction-copy');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-solve-puzzle-guess-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-guess-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0755d9'],
      LOW_ACCENTS: ['#0755d9'],
      parts,
    },
  });
})();
