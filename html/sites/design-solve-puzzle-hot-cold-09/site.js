(function () {
  'use strict';
  const palette = { bg: '#f5f5f3', panel: '#f5f5f3', fg: '#101827', muted: '#788397', line: '#d5dbe4' };
  function drawTitle(u, center) {
    const hero = u.svg('svg', { class: 'kinetic-title', viewBox: '0 0 1208 941', preserveAspectRatio: 'none', 'aria-hidden': 'true' }, center);
    const glyphs = {
      I: 'M0 0H100V1000H0Z',
      N: 'M0 0H38L65 550V0H100V1000H65L35 460V1000H0Z',
      T: 'M0 0H100V140H72V1000H28V140H0Z',
      E: 'M0 0H100V140H53V405H90V545H53V860H100V1000H0Z',
      O: 'M50 0C15 0 0 65 0 170V830C0 935 15 1000 50 1000S100 935 100 830V170C100 65 85 0 50 0Z M50 145C44 145 43 160 43 185V815C43 840 44 855 50 855S57 840 57 815V185C57 160 56 145 50 145Z',
      A: 'M0 1000L23 0H77L100 1000H60L56 795H43L40 1000Z M46 660H54L50 235Z',
      R: 'M0 0H52Q100 0 100 170V350Q100 470 73 500Q92 530 93 640L100 1000H58L52 630Q51 575 42 575V1000H0Z M42 145V435H48Q58 435 58 380V200Q58 145 48 145Z',
      C: 'M50 0C15 0 0 65 0 170V830C0 935 15 1000 50 1000S100 935 100 830V680H57V815C57 840 56 855 50 855S43 840 43 815V185C43 160 44 145 50 145S57 160 57 185V320H100V170C100 65 85 0 50 0Z',
    };
    for (const [word, y, h, positions, color] of [
      ['INTER', 30, 215, [[54, 34], [104, 115], [236, 100], [354, 100], [471, 106]], '#0c1423'],
      ['ACTION', 265, 242, [[54, 105], [172, 105], [290, 100], [403, 42], [458, 121], [592, 135]], '#0649e8'],
    ]) {
      [...word].forEach((letter, i) => {
        const [x, w] = positions[i];
        u.svg('path', { d: glyphs[letter], transform: `translate(${x} ${y}) scale(${w / 100} ${h / 1000})`, fill: color, 'fill-rule': 'evenodd' }, hero);
      });
    }
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // A dedicated right pane fits all four note displays at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'kinetic wide-source instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const center = u.el('div', 'center', app);
      const header = u.el('header', 'task-area', app);
      const aside = u.el('aside', 'aside', app);
      u.el('b', '', aside, 'SEARCH (OPTIONAL)');
      const search = u.el('div', 'search-field', aside);
      const icon = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28', class: 'search-icon' }, search);
      u.svg('circle', { cx: 11, cy: 11, r: 7.5, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, icon);
      u.svg('path', { d: 'm17 17 6 6', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, icon);
      u.el('span', 'search-caret', search);
      u.el('p', 'aside-copy', aside, 'You can use the search box to look for something on the page.');
      const toolbar = u.el('div', 'toolbar', aside);
      const bottom = u.el('div', 'bottom', app);
      Object.assign(_c, { app, center, header, aside, toolbar, bottom });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
      drawTitle(_c.util, _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.aside.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.bottom.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
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
    name: 'design-solve-puzzle-hot-cold-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#1557ed'], LOW_ACCENTS: ['#1557ed'], parts },
  });
})();
