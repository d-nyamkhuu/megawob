(function () {
  'use strict';
  const palette = { bg: '#f7f7f7', panel: '#ffffff', fg: '#263445', muted: '#39495b', line: '#c7ced4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('human', 'brief-left', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
      document.body.dataset.endplace = _c.placement || 'none';
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Math Practice');
      const nav = u.el('nav', 'menu', top);
      [['Home', false], ['Exercises', true], ['Progress', false], ['Resources', false]]
        .forEach(([label, active]) => u.el('span', active ? 'active' : '', nav, label));
      u.el('span', 'nav-spacer', nav);
      u.el('span', 'utility-link', nav, 'Help');
      u.el('span', 'utility-link', nav, 'Sign Out');
      const center = u.el('div', 'center', app);
      const briefing = u.el('div', 'briefing', center);
      u.el('b', '', briefing, 'Algebra');
      u.el('p', '', briefing, 'Solve linear equations with one variable.');
      const toolbar = u.el('div', 'practice-toolbar', briefing);
      const aside = u.el('aside', 'aside', document.body);
      if (_c.display !== 'panel') {
        u.el('b', '', aside, 'Feedback');
        u.el('p', 'aside-copy', aside, 'Your answer will appear here after you submit.');
      }
      Object.assign(_c, { app, center, aside, toolbar, header: aside });
    },
    'frame.nav': () => () => {},
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
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.app.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.app.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = '';
      }
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
    name: 'design-solve-puzzle-algebra-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-algebra-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#287bd5'],
      LOW_ACCENTS: ['#287bd5'],
      parts,
    },
  });
})();
