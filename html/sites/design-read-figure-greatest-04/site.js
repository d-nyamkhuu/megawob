(function () {
  'use strict';
  const palette = { bg: '#f8f5eb', panel: '#f8f5eb', fg: '#080b0c', muted: '#080b0c', line: '#080b0c' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('directory', 'stagger', 'instruction-' + _c.display);
      if (_c.ctx.finish) document.body.classList.add('finish-mode');
      const app = u.el('main', 'app', document.body);
      const header = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 84, height: 42, viewBox: '0 0 84 42', class: 'title-icon' }, header);
      u.svg('circle', { cx: 19, cy: 21, r: 17, fill: '#e32636' }, icon);
      u.svg('rect', { x: 44, y: 4, width: 38, height: 34, fill: '#080b0c' }, icon);
      u.el('span', '', header, 'MindLab');
      u.el('nav', 'menu', header, 'Practice     Tasks     Progress');
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      u.el('h2', '', aside, 'Instructions');
      const panelSlot = u.el('div', 'margin-task', aside);
      const steps = u.el('ol', 'margin-steps', aside);
      ['Look at the numbers on the cards.', 'Choose a card when you are ready.'].forEach(
        (text) => u.el('li', '', steps, text),
      );
      u.el('h2', 'notes-heading', aside, 'Notes');
      const notes = u.el('ul', 'margin-notes', aside);
      ['Numbers may be positive or negative.', 'Select one card only.', 'The card is not selected yet.'].forEach(
        (text) => u.el('li', '', notes, text),
      );
      Object.assign(_c, { app, header, center, aside, panelSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      _c.center.firstElementChild.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.panelSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.center.firstElementChild.remove();
        note.classList.add('brief', 'episode-toast');
        _c.center.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
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
    name: 'design-read-figure-greatest-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-greatest-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#e32636'],
      LOW_ACCENTS: ['#e32636'],
      parts,
    },
  });
})();
