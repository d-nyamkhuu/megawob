(function () {
  'use strict';
  const palette = { bg: '#eaf4fb', panel: '#ffffff', fg: '#13263d', muted: '#294361', line: '#bed5e8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('vista', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#e6f3fb', stroke: '#5d7891', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: '#365a78', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Practice Problems');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const btn = u.el('button', 'window-' + kind, wc);
        btn.type = 'button';
        const svg = u.svg('svg', { width: kind === 'close' ? 20 : 16, height: 16, viewBox: '0 0 20 16', 'aria-hidden': 'true' }, btn);
        if (kind === 'min') u.svg('path', { d: 'M3 12h14', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, svg);
        else if (kind === 'max') u.svg('rect', { x: 4, y: 2, width: 12, height: 12, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, svg);
        else u.svg('path', { d: 'M4 3l12 10M16 3L4 13', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, svg);
      }
      const toolbar = u.el('nav', 'menu', top, 'File     Edit     View     Tools     Help');
      const center = u.el('div', 'center', app);
      u.el('div', 'document-title', center, 'Math Practice');
      const aside = u.el('aside', 'aside', document.body);
      const noteSlot = u.el('div', 'side-note', aside);
      if (_c.display === 'header') {
        u.el('b', 'side-heading', noteSlot, 'Practice');
        u.el('p', 'aside-copy', noteSlot, 'Work at your own pace.\n\nReview your work carefully.');
      }
      const footer = u.el('footer', 'bottom', app);
      Object.assign(_c, { app, toolbar, center, aside, noteSlot, footer, header: center });
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
      if (_c.submit) {
        _c.submit.classList.add('episode-header');
        _c.headerTools.style.paddingRight = (_c.submit.getBoundingClientRect().width + 8) + 'px';
      }
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      _c.util.el('b', 'notes-title', _c.aside, 'Notes');
      _c.util.el('p', 'notes-copy', _c.aside, 'Use the standard order of operations.');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('episode-note');
        _c.util.el('b', 'toast-title', note, 'Instructions');
        _c.aside.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
      if (_c.submit && (_c.placement === 'footer' || _c.placement === 'link')) _c.submit.classList.add('episode-footer');
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-solve-puzzle-arithmetic-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1686df'], LOW_ACCENTS: ['#1686df'], parts,
    },
  });
})();
