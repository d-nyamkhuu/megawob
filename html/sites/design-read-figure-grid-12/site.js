(function () {
  'use strict';
  const palette = { bg: '#eef3f7', panel: '#f7f9fb', fg: '#23384d', muted: '#52677a', line: '#c6d2dc' };
  function styleNote(_c, note) {
    note.classList.add('brief');
    if (_c.ctx.instruction.length > 90) note.classList.add('long-instruction');
    if (_c.display === 'header') {
      _c.util.el('p', 'brief-detail', note, 'Use the mouse pointer to click the correct point on the grid.');
      _c.util.el('p', 'brief-state', note, 'The point is not yet marked.');
    }
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'breeze split-grid instruction-' + _c.display;
      if (_c.ctx.finish) document.body.classList.add('finish-mode');
      const app = u.el('main', 'app', document.body);
      const title = u.el('header', 'window-title', app);
      const icon = u.svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24' }, title);
      u.svg('rect', { x: 1, y: 1, width: 22, height: 22, rx: 3, fill: '#168bd2' }, icon);
      u.svg('path', { d: 'M5 6h5v5H5zm8 0h6v3h-6zm0 5h6v7h-6zm-8 2h5v5H5z', fill: '#fff' }, icon);
      u.el('span', 'window-name', title, 'Coordinate Practice — KDE');
      const win = u.el('div', 'window-controls', title);
      ['−', '□', '×'].forEach((x) => u.el('span', '', win, x));
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'View', 'Settings', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const menuActions = u.el('div', 'menu-actions', menu);
      const overview = u.el('section', 'overview', app);
      u.el('h1', '', overview, 'Coordinate Practice');
      u.el('p', 'subheading', overview, 'Click the point on the grid described below.');
      const row = u.el('div', 'overview-row', overview);
      Object.assign(_c, { app, menuActions, row, header: row });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.row.querySelector('.ref-instruction');
      if (note) styleNote(_c, note);
      const spacer = _c.row.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const u = _c.util;
      const work = u.el('section', 'work-area', _c.app);
      const tools = u.el('aside', 'tool-panel', work);
      u.el('h2', '', tools, 'Tools');
      const select = u.el('button', 'tool-button active', tools);
      select.type = 'button';
      u.el('span', 'tool-icon cursor-icon', select, '➤');
      u.el('span', '', select, 'Select (click point)');
      const clear = u.el('button', 'tool-button clear-tool', tools);
      clear.type = 'button';
      u.el('span', 'tool-icon eraser-icon', clear, '◆');
      u.el('span', '', clear, 'Clear selection');
      clear.addEventListener('click', () => document.querySelector('.reference-reset')?.click());
      u.el('div', 'tool-divider', tools);
      u.el('h2', 'view-title', tools, 'View');
      const checks = u.el('div', 'check-row', tools);
      u.el('span', 'checkbox checked', checks, '✓');
      u.el('span', '', checks, 'Show grid');
      const checks2 = u.el('div', 'check-row', tools);
      u.el('span', 'checkbox checked', checks2, '✓');
      u.el('span', '', checks2, 'Show axis labels');
      const save = u.el('button', 'save-view', tools);
      save.type = 'button';
      u.el('span', 'gear', save, '⚙');
      u.el('span', 'save-label', save, 'Save view');
      u.el('small', 'save-note', save, 'Saves only display preferences\n(does not submit your answer).');
      save.addEventListener('click', () => env.log('decoy', { label: 'Save view' }));
      select.addEventListener('click', () => env.log('decoy', { label: 'Select (click point)' }));
      const header = _c.header;
      _c.header = tools;
      base(_c);
      _c.header = header;
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) _c.menuActions.appendChild(button);
      if (_c.submit) _c.submit.classList.add('submit', 'end-tools');
      Object.assign(_c, { work, tools });
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.row;
      base(_c);
      _c.body = body;
      const note = _c.row.querySelector('.ref-panel');
      if (note) styleNote(_c, note);
      const u = _c.util;
      const about = u.el('aside', 'about-grid', _c.row);
      u.el('b', '', about, 'About the grid');
      const list = u.el('ul', '', about);
      [
        'The horizontal axis is the x-axis (positive to the right).',
        'The vertical axis is the y-axis (positive upward).',
        'The origin is at (0, 0).',
        'Coordinates can be negative.',
      ].forEach((x) => u.el('li', '', list, x));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.work);
      _c.work.insertBefore(_c.stage, _c.tools);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        styleNote(_c, note);
        _c.row.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('status-bar');
      _c.app.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.util.el('span', 'status-right', foot, 'No point selected');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.menuActions.appendChild(dock);
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
    name: 'design-read-figure-grid-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-grid-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1976d2'],
      LOW_ACCENTS: ['#1976d2'],
      parts,
    },
  });
})();
