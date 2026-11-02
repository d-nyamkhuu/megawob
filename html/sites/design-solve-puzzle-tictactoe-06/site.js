(function () {
  'use strict';
  const palette = { bg: '#c9c7bf', panel: '#d2d0c9', fg: '#171715', muted: '#77766f', line: '#8f8d86' };
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
      document.body.className = 'industrial instruction-' + _c.display + ' end-' + _c.placement;
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', 'app-mark', top, '▧');
      u.el('span', 'app-title', top, 'Calibrix 1.2.0  -  Sensor Calibration Utility');
      const wc = u.el('div', 'native-window-controls', top);
      [
        ['−', 'Minimize'],
        ['□', 'Maximize'],
        ['×', 'Close'],
      ].forEach(([x, label]) => u.el('span', 'window-control', wc, x).setAttribute('aria-label', label));
      const menu = u.el('nav', 'menu', app, 'File    Edit    Tools    Help');
      const workspace = u.el('div', 'workspace', app),
        rail = u.el('aside', 'command-rail', workspace);
      [
        ['◎', 'Calibrate'],
        ['▥', 'Sensors'],
        ['▤', 'Profiles'],
        ['▱', 'Diagnostics'],
        ['⚙', 'Settings'],
      ].forEach(([icon, label], i) => {
        const item = u.el('div', 'rail-item' + (i === 0 ? ' active' : ''), rail);
        u.el('span', 'rail-icon', item, icon);
        u.el('span', '', item, label);
      });
      const exit = u.el('div', 'rail-item rail-exit', rail);
      u.el('span', 'rail-icon', exit, '⇥');
      u.el('span', '', exit, 'Exit');
      const work = u.el('section', 'workbench', workspace),
        meta = u.el('header', 'system-status', work);
      u.el('strong', '', meta, 'Calibration Task');
      u.el('span', 'system-readout', meta,
        'System: LX-300   |   Mode: Manual   |   User: operator   |   2004-11-03 14:27');
      const noteSlot = u.el('div', 'instruction-slot', work);
      Object.assign(_c, { app, menu, work, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('section', 'stage', _c.work);
      const log = u.el('section', 'log-panel', _c.work);
      _c.logTitle = u.el('div', 'log-title', log, 'Log');
      const logbody = u.el('div', 'log-body', log);
      u.el('div', '', logbody, '[14:27:01]  Calibration utility ready.');
      u.el('div', '', logbody, '[14:27:03]  Game initialized. X to move.');
      u.el('div', '', logbody, '[14:27:03]  Board state recorded.');
      u.el('footer', 'bottom', _c.work);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.logTitle.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.logTitle.appendChild(dock);
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
    name: 'design-solve-puzzle-tictactoe-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-tictactoe-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#711b22'],
      LOW_ACCENTS: ['#711b22'],
      parts,
    },
  });
})();
