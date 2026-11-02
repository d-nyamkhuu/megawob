(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#f3f7fc', fg: '#0c2855', muted: '#536176', line: '#5489d6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'civic docked instruction-' + _c.display;
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
      const brand = u.el('div', 'brand', top);
      u.el('span', 'brand-mark', brand);
      u.el('span', '', brand, 'Number Practice');
      const toolbar = u.el('div', 'chrome-tools', top);
      const help = u.el('div', 'help', top);
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      u.el('span', '', help, 'Help');
      u.el('span', 'help-icon', help, '?');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, toolbar, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('brief');
        _c.util.el('div', 'brief-subtitle', _c.center, 'Practice at your own pace in this number workspace.');
      }
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
      _c.body = _c.center;
      base(_c);
      _c.body = body;
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
      foot.querySelector('.ref-foot-text').remove();
      const u = _c.util;
      const note = u.el('div', 'dock-note');
      foot.prepend(note);
      u.el('span', 'info-icon', note, 'i');
      const copy = u.el('div', 'dock-copy', note);
      u.el('b', '', copy, _c.display === 'hidden' ? 'Number Practice' : 'How to complete this task:');
      if (_c.display !== 'hidden') u.el('p', '', copy, 'Your progress is kept in this workspace.');
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
    name: 'design-read-figure-ascending-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-ascending-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0758ce'],
      LOW_ACCENTS: ['#0758ce'],
      parts,
    },
  });
})();
