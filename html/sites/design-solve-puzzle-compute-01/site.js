(function () {
  'use strict';
  const palette = { bg: '#f0efed', panel: '#ffffff', fg: '#252c35', muted: '#657080', line: '#d5d7d9' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('human', 'brief-left', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#ee8520', stroke: '#ee8520', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 13l4 4 8-9', fill: 'none', stroke: '#fff', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, icon);
      u.el('span', '', top, 'Task Manager');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', { d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      u.el('nav', 'menu', top, 'File    Edit    View    Tools    Help');
      const center = u.el('div', 'center', app);
      const noteHost = u.el('div', 'note-host', center);
      noteHost.hidden = _c.display === 'hidden';
      Object.assign(_c, { app, header: top, center, noteHost });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteHost;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Tasks');
      u.el('div', 'searchbox', aside, '⌕   Search tasks...');
      const list = u.el('div', 'task-list', aside);
      ['Vendor Payments', 'Project Budget', 'Staff Scheduling', 'Facility Requests', 'Inventory Check', 'Client Follow-ups', 'Travel Arrangements', 'Meeting Notes', 'Website Updates', 'Equipment Orders'].forEach((name, i) => {
        const row = u.el('div', 'task-row' + (!i ? ' active' : ''), list);
        u.el('span', '', row, name);
        u.el('small', '', row, ['Apr 23', 'Apr 21', 'Apr 20', 'Apr 19', 'Apr 18', 'Apr 17', 'Apr 16', 'Apr 13', 'Apr 12', 'Apr 11'][i] + ', 2018');
      });
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteHost.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const bottom = _c.util.el('footer', 'bottom', _c.app);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) bottom.appendChild(foot);
      _c.bottom = bottom;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
    name: 'design-solve-puzzle-compute-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-compute-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f47b20'],
      LOW_ACCENTS: ['#f47b20'],
      parts,
    },
  });
})();
