(function () {
  'use strict';
  const palette = {
    bg: '#f5f4e9', panel: '#fffef7', fg: '#092e65', muted: '#3f83b9', line: '#76a4d1',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('pixel', 'pixel-app', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Customer Records');
      const toolbar = u.el('div', 'bottom', top);
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, toolbar, center, header: top });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'menu', _c.app);
      ['Customers', 'Orders', 'Products', 'Reports'].forEach((label, i) => {
        const tab = _c.util.el('span', 'tab' + (i === 0 ? ' active' : ''), nav, label);
        tab.setAttribute('aria-hidden', 'true');
      });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
      const aside = _c.util.el('aside', 'aside', _c.app);
      _c.util.el('b', '', aside, 'Customer Details');
      _c.util.el('p', 'aside-copy', aside, '');
      _c.aside = aside;
    },
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
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.app.appendChild(foot);
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
    name: 'design-solve-puzzle-fix-error-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-fix-error-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#13b8bd'],
      LOW_ACCENTS: ['#13b8bd'],
      parts,
    },
  });
})();
