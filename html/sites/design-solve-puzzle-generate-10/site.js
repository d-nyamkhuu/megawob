(function () {
  'use strict';
  const palette = { bg: '#f1f3f7', panel: '#fff', fg: '#1b2430', muted: '#68788e', line: '#d6dce5' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'gnome floating instruction-' + _c.display + (_c.display === 'toast' ? ' ref-has-note' : '');
      const desktop = u.el('div', 'desktop-bar', document.body);
      u.el('span', 'activities', desktop, 'Activities');
      u.el('span', 'desktop-appmark', desktop, '▦');
      u.el('span', 'desktop-appname', desktop, 'Number Checker');
      u.el('span', 'desktop-date', desktop, 'Apr 24   10:17 AM');
      u.el('span', 'desktop-status', desktop, '◈   ◖))   ▣');
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 36, height: 36, viewBox: '0 0 36 36', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 32, height: 32, rx: 9, fill: '#287bf0' }, icon);
      u.svg('rect', { x: 9, y: 10, width: 18, height: 16, rx: 4, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, icon);
      u.svg('circle', { cx: 13, cy: 15, r: 1.5, fill: '#fff' }, icon);
      u.svg('circle', { cx: 23, cy: 15, r: 1.5, fill: '#fff' }, icon);
      u.svg('path', { d: 'M13 21h10', stroke: '#fff', 'stroke-width': 2, 'stroke-linecap': 'round' }, icon);
      u.el('span', '', top, 'Number Checker');
      u.el('div', 'header-spacer', top);
      const toolbar = u.el('div', 'header-tools', top);
      u.el('div', 'hamburger', top, '☰');
      const win = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        u.el('span', 'window-button ' + kind, win, kind === 'min' ? '−' : kind === 'max' ? '□' : '×');
      }
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, center, toolbar, header: toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = h;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
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
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.app.appendChild(foot);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
    },
  };
  env.site({
    name: 'design-solve-puzzle-generate-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-generate-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#287bf0'],
      LOW_ACCENTS: ['#287bf0'],
      parts,
    },
  });
})();
