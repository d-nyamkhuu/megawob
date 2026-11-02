(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-shape-04',
    title: 'Shape Finder',
    menu: ['File', 'Edit', 'View', 'Window', 'Help'],
  };
  const palette = { bg: '#d9e4f2', panel: '#f6f9fd', fg: '#20252d', muted: '#6b81a2', line: '#b9c6d8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Both the inspector and the workspace note fit at every supported size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      document.body.className = 'aqua workbench instruction-' + _c.display + ' end-' + (_c.placement || 'finish');
      const u = _c.util;
      const bar = u.el('div', 'menubar', document.body);
      const apple = u.svg('svg', { class: 'apple', width: 25, height: 29, viewBox: '0 0 26 30', 'aria-hidden': 'true' }, bar);
      u.svg('path', {
        d: 'M17 5c2-1 3-3 3-5-3 0-5 2-5 5zM22 16c-3-2-4-6 0-9-3-3-6-2-8-1-2 1-4-2-7 0-7 4-5 16 0 21 2 2 4-1 6-1s5 3 7 0c2-2 3-4 4-7-1 0-2-1-2-3z',
        fill: '#34434f',
      }, apple);
      u.el('b', '', bar, C.title);
      for (const m of C.menu) u.el('span', 'mi', bar, m);
      u.el('span', 'sp', bar);
      const sound = u.svg('svg', { class: 'sound', width: 27, height: 25, viewBox: '0 0 28 26', 'aria-hidden': 'true' }, bar);
      u.svg('path', { d: 'M2 9h5l7-6v20l-7-6H2z', fill: '#293744' }, sound);
      u.svg('path', { d: 'M17 7q7 6 0 12M21 3q11 10 0 20', fill: 'none', stroke: '#293744', 'stroke-width': 2 }, sound);
      u.el('span', 'clock', bar, 'Mon 10:24 AM');
      const mag = u.el('span', 'mag', bar);
      const glass = u.svg('svg', { width: 25, height: 25, viewBox: '0 0 25 25', 'aria-hidden': 'true' }, mag);
      u.svg('path', { d: 'M16 15l6 6M18 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0', fill: 'none', stroke: 'white', 'stroke-width': 2.8 }, glass);
      const app = u.el('main', 'app', document.body);
      const win = u.el('div', 'win', app);
      const header = u.el('header', 'top', win);
      const lights = u.el('div', 'lights', header);
      for (const c of ['r', 'y', 'g']) u.el('i', c, lights);
      u.el('span', 'ttl', header, C.title);
      const center = u.el('div', 'center', win);
      Object.assign(_c, { app, center, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
      const spacer = _c.center.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('header-end-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'aside', _c.app);
      u.el('div', 'tb2', aside);
      u.el('div', 'phead', aside, 'Task Details');
      const well = u.el('div', 'well', aside);
      const row = u.el('div', 'row', well);
      u.el('span', 'k', row, 'Task');
      u.el('span', 'v', row, 'Identify a shape');
      Object.assign(_c, { aside, well, body: _c.center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.well;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const panel = _c.well.querySelector('.ref-panel');
      if (panel) panel.querySelector('.ref-panel-title').textContent = 'Instruction';
      else if (_c.display !== 'hidden') {
        const row = u.el('div', 'row workspace-row', _c.well);
        u.el('span', 'k', row, 'Workspace');
        u.el('span', 'v', row, 'Shape practice');
      }
      for (const [key, value] of [['Input method', 'Mouse click'], ['Status', 'Not submitted']]) {
        const row = u.el('div', 'row', _c.well);
        u.el('span', 'k', row, key);
        u.el('span', 'v', row, value);
      }
      u.el('div', 'phead p2', _c.aside, 'Shape Info');
      const info = u.el('div', 'well info', _c.aside);
      u.el('div', '', info, 'No selection');
      u.el('div', 'dim', info, 'Click a shape to see its details.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.center.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.aside.appendChild(foot);
      // The original inspector reserves its bottom slot for the end control.
      for (const button of foot.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(button);
      _c.foot = foot;
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-shape-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2a74e0'],
      LOW_ACCENTS: ['#2a74e0'],
      parts,
    },
  });
})();
