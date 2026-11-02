(function () {
  'use strict';
  const palette = {
    bg: '#5d4631', panel: '#fffdf7', fg: '#332316', muted: '#79654c', line: '#b9ab97',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('organizer', 'stagger', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      document.body.classList.add('end-' + _c.placement);
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const header = u.el('header', 'top', app);
      u.el('span', '', header, 'Math Practice');
      u.el('nav', 'menu', header, 'Notebook    Problems    Draw    Highlight    Erase');
      const center = u.el('div', 'center ref-body', app);
      Object.assign(_c, { app, header, center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const note = _c.center.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
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
      if (foot) _c.app.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.center.appendChild(dock);
      // The addition widget moves submitEl into its scene during setup. Finish
      // setup by restoring the template control to its toolbar, footer or dock.
      if (_c.submit) {
        const submit = _c.submit;
        const home = submit.parentNode;
        queueMicrotask(() => home.appendChild(submit));
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
    name: 'design-read-figure-addition-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-addition-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#75431f'],
      LOW_ACCENTS: ['#75431f'],
      parts,
    },
  });
})();
