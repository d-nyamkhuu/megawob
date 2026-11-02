(function () {
  'use strict';
  const palette = { bg: '#eee8dc', panel: '#f7f1e4', fg: '#21170f', muted: '#927b67', line: '#d8cdb9' };
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
      for (const display of ['header', 'panel', 'toast', 'hidden']) {
        document.body.classList.remove('instruction-' + display);
      }
      document.body.classList.add('riso', 'horizontal', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Number Practice');
      u.el('nav', 'menu', top, 'My Work');
      const mountain = u.el('img', 'mountain-art', top);
      mountain.src = 'sites/design-solve-puzzle-odd-even-05/assets/mountain-sun.webp';
      mountain.alt = '';
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'A few notes:');
      const notes = u.el('div', 'aside-copy', aside);
      [
        'Make a little time for practice each day.',
        'Take a break whenever you need one.',
        'Work at a pace that feels comfortable.',
        'Enjoy a quiet moment of number practice.',
      ].forEach((text) => u.el('p', 'note-item', notes, text));
      u.el('div', 'aside-quote', aside, 'Small steps\nbuild big progress.');
      const toolbar = u.el('div', 'practice-tools', app);
      Object.assign(_c, { app, center, aside, toolbar, header: center });
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
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('brief', 'margin-instruction');
        _c.aside.insertBefore(panel, _c.aside.querySelector('.aside-copy'));
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'margin-instruction');
        _c.aside.insertBefore(note, _c.aside.querySelector('.aside-copy'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      if (footer) _c.app.appendChild(footer);
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
    name: 'design-solve-puzzle-odd-even-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-odd-even-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#315875'],
      LOW_ACCENTS: ['#315875'],
      parts,
    },
  });
})();
