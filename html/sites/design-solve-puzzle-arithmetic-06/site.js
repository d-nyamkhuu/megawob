(function () {
  'use strict';
  const palette = { bg: '#e9e9e6', panel: '#ffffff', fg: '#091c3d', muted: '#71889b', line: '#8295a6' };
  function styleNote(note, display) {
    if (!note) return;
    note.classList.add('brief');
    note.dataset.display = display;
    note.classList.toggle('long-note', note.textContent.length > 120);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has its own card and corner note at the compact sizes too.
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
      document.body.className = 'homepage notebook instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Maple Creek');
      u.el('small', '', top, 'My Personal Homepage');
      u.el('nav', 'menu', top, 'Notes  *  Friends  *  Photos  *  Little Things  *  A Brighter Day');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c.header.querySelector('.ref-instruction'), _c.display);
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('end-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      styleNote(_c.center.querySelector('.ref-panel'), _c.display);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.center.appendChild(note);
        styleNote(note, _c.display);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.app.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
      if (_c.submit) _c.submit.classList.add('end-' + _c.placement);
      const note = _c.center.querySelector('.brief');
      if (note && (_c.display !== 'panel' || _c.center.clientWidth < 1100)) {
        _c.center.style.setProperty('--episode-note-height', note.getBoundingClientRect().height + 'px');
      }
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
    name: 'design-solve-puzzle-arithmetic-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-arithmetic-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#173e70'],
      LOW_ACCENTS: ['#173e70'],
      parts,
    },
  });
})();
