(function () {
  'use strict';
  const palette = { bg: '#eaf7ef', panel: '#d5efe0', fg: '#071812', muted: '#4d7962', line: '#4d9672' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'op-notebook operational instruction-' + _c.display;
      if (_c.ctx.instruction.length > 100) document.body.classList.add('instruction-long');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', 'brand', top, 'WorkFlow');
      u.el('span', 'section-label', top, 'Tasks');
      const meta = u.el('div', 'top-meta', top);
      u.el('span', '', meta, 'User: jcarter');
      u.el('span', '', meta, 'Project: Q2 Plan');
      u.el('span', '', meta, 'Help');
      const tabs = u.el('nav', 'menu', app);
      [['1', 'Tasks'], ['2', 'Notes'], ['3', 'Files'], ['4', 'Activity'], ['5', 'Settings']].forEach((x, i) => {
        const tab = u.el('span', 'tab' + (i === 0 ? ' active' : ''), tabs);
        u.el('b', '', tab, x[0]);
        u.el('span', '', tab, x[1]);
      });
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, center, header: tabs });
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
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
      _c.util.el('aside', 'aside', document.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('bottom');
      _c.app.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const status = u.el('div', 'status');
      u.el('span', '', status, 'Task: Number Sequence');
      u.el('span', '', status, 'Targets: 10');
      u.el('span', '', status, 'Status: Not started');
      footer.prepend(status);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
    name: 'design-read-figure-ascending-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-ascending-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#279b5e'],
      LOW_ACCENTS: ['#279b5e'],
      parts,
    },
  });
})();
