(function () {
  'use strict';
  const palette = { bg: '#315a91', panel: '#f2f2f2', fg: '#111827', muted: '#53555b', line: '#aeb4bd' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Match the original Help card and desktop notification breakpoints.
      const roomy = _c.W * 0.722 >= 850 && _c.H * 0.933 >= 680;
      const requested = _c.ctx.display || 'header';
      _c.display = !roomy && (requested === 'panel' || requested === 'toast') ? 'header' : requested;
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
      document.body.className = 'motif dialog instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#d7e2e8', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Pattern Trainer');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', { d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      const center = u.el('div', 'center', app);
      center.classList.toggle('without-brief', _c.display !== 'header');
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Instructions     Examples     Shortcuts');
      Object.assign(_c, { app, top, center, aside, header: center });
    },
    'frame.nav': () => (_c) => {
      _c.util.el('nav', 'menu', _c.top, 'File    Edit    View    Tools    Help');
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) {
        note.classList.add('brief', 'episode-panel');
        _c.aside.classList.add('has-episode-panel');
      }
      const u = _c.util;
      const help = u.el('div', 'aside-copy', _c.aside);
      u.el('h3', '', help, 'How to complete this task');
      const steps = u.el('ol', '', help);
      ['Look at the example on the left.', 'Click the checkboxes on the right to draw the same number.'].forEach((text) => u.el('li', '', steps, text));
      u.el('hr', '', help);
      u.el('h3', 'notes-title', help, 'Notes');
      const notes = u.el('ul', '', help);
      ['The grid is arranged in rows and columns.', 'Click a checkbox to toggle it on or off.', 'Use Clear All to reset your answer if needed.'].forEach((text) => u.el('li', '', notes, text));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('brief', 'episode-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
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
    name: 'design-read-figure-number-checkboxes-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#1b5caa'], LOW_ACCENTS: ['#1b5caa'], parts },
  });
})();
