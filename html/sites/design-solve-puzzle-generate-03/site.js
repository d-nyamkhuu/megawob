(function () {
  'use strict';
  const palette = { bg: '#faf9f5', panel: '#fffefa', fg: '#101010', muted: '#555555', line: '#aaaaaa' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'plain floating instruction-' + _c.display;
      document.body.classList.toggle('finish-mode', !!_c.ctx.finish);
      document.body.classList.add('end-' + _c.placement);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'The Daily Chronicle');
      u.el('nav', 'menu', top,
        'Home       News       Business       Opinion       Life       Sports       Arts                                      Log In   │   Register   │   Help');
      const aside = u.el('aside', 'aside', document.body);
      const header = u.el('div', 'task-note', aside);
      Object.assign(_c, { app, top, aside, header });
    },
    'frame.nav': () => () => {},
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
      _c.body = _c.util.el('div', 'center', _c.app);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
      _c.util.el('b', '', _c.aside, 'Notes');
      _c.util.el('p', 'aside-copy', _c.aside,
        '•  Click Generate to get a new number.\n\n•  The number must meet the requested condition.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = _c.ctx.finish ? 'The Daily Chronicle · Daily exercises' : '';
      text.classList.add('edition-note');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      const link = _c.foot.querySelector('.ref-endlink');
      if (link) _c.aside.appendChild(link);
      // The existing widget leaves frame controls with this class in place.
      if (_c.submit) _c.submit.classList.add('chrome-end');
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
    name: 'design-solve-puzzle-generate-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-generate-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#bd211d'],
      LOW_ACCENTS: ['#bd211d'],
      parts,
    },
  });
})();
