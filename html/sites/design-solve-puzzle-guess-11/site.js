(function () {
  'use strict';
  const palette = { bg: '#91a9ac', panel: '#fffdfa', fg: '#172538', muted: '#55585b', line: '#d5d1c9' };
  const help = '1. Enter a number in the allowed range.\n2. Click Guess to see if the hidden number is higher or lower.\n3. You have a limited number of guesses.';
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'dark horizontal fluent-notebook instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#8266ce', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Number Quest');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', { d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      if (_c.display !== 'panel') {
        u.el('b', '', aside, 'Instructions');
        u.el('p', 'aside-copy', aside, help);
      }
      Object.assign(_c, { app, top, center, aside, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('brief');
        note.classList.toggle('long-note', _c.ctx.instruction.length > 90);
      }
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
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const title = _c.aside.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Instructions';
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('bottom');
        _c.app.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      if (ctx.kind === 'cookie') {
        u.el('span', 'privacy-shield', el, '◈');
        const copy = u.el('div', 'consent-copy', el);
        u.el('b', 'consent-title', copy, 'We value your privacy');
        u.el(
          'p',
          '',
          copy,
          'We use optional cookies to improve your experience, understand how the app is used, and show relevant content. You can accept all cookies or reject optional ones. Required cookies are always active.',
        );
        u.el('a', 'learn-more', copy, 'Learn more');
        const actions = u.el('div', 'consent-actions', el);
        const dismiss = u.el('button', 'reject', actions, 'Reject optional');
        dismiss.addEventListener('click', ctx.dismiss);
        u.el('button', 'manage', actions, 'Manage settings').addEventListener('click', ctx.dismiss);
        u.el('button', 'accept', actions, 'Accept all').addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const messages = {
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-guess-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'cookie' },
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#1675d1'], LOW_ACCENTS: ['#1675d1'], parts },
  });
})();
