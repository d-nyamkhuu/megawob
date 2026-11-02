(function () {
  'use strict';
  const palette = { bg: '#f1f0eb', panel: '#f7f6f1', fg: '#171717', muted: '#555', line: '#292929' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has a dedicated instruction strip, including at narrow sizes.
      const size = _c.ctx.size || {};
      let display = _c.ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && (size.width < 1180 || size.height < 680)) display = 'header';
      _c.display = display;
      document.body.className = 'eink dialog instruction-' + display;
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
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 22, height: 22, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7 }, icon);
      for (let i = 1; i < 3; i++) {
        u.svg('path', { d: `M${2 + i * 5.5} 2v22M2 ${2 + i * 5.5}h22`, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      }
      u.el('span', '', top, 'Number Practice');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5,
        }, svg);
      }
      const center = u.el('div', 'center', app);
      const noteHost = u.el('div', 'note-host', center);
      Object.assign(_c, { app, header: top, center, noteHost });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteHost;
      base(_c);
      _c.header = header;
      const note = _c.noteHost.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.header.insertBefore(_c.headerTools, _c.header.querySelector('.native-window-controls'));
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      const panel = _c.noteHost.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.noteHost.appendChild(note);
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
    name: 'design-read-figure-number-checkboxes-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-number-checkboxes-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#171717'],
      LOW_ACCENTS: ['#171717'],
      parts,
    },
  });
})();
