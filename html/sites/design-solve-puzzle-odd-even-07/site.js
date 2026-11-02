(function () {
  'use strict';
  const palette = { bg: '#faf9f4', panel: '#fffefa', fg: '#080908', muted: '#343434', line: '#090a08' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('riso', 'horizontal', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Number Check');
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Tools');
      const tools = u.el('p', 'aside-copy', aside, '');
      const keyboard = u.el('div', 'tool-row', tools);
      u.el('span', 'tool-icon keyboard-icon', keyboard, '▦');
      u.el('span', '', keyboard, 'Keyboard Shortcuts');
      const pointer = u.el('div', 'tool-row', tools);
      u.el('span', 'tool-icon pointer-icon', pointer, '➤');
      u.el('span', '', pointer, 'Pointer Ready');
      const panelHost = u.el('div', 'panel-host', document.body);
      Object.assign(_c, { app, top, center, panelHost, header: top });
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
      _c.body = _c.panelHost;
      base(_c);
      _c.body = body;
      const panel = _c.panelHost.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief');
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
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-solve-puzzle-odd-even-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-odd-even-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffe335'],
      LOW_ACCENTS: ['#ffe335'],
      parts,
    },
  });
})();
