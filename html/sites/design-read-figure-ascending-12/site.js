(function () {
  'use strict';
  const palette = { bg: '#078b88', panel: '#c6c6c6', fg: '#050505', muted: '#555555', line: '#ffffff' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated task pane even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.add('win31', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const desk = u.el('div', 'desktop', document.body);
      const icons = u.el('div', 'desktop-icons', desk);
      [
        ['▣', 'Program Manager'],
        ['📁', 'My Documents'],
        ['▤', 'Notepad'],
        ['♲', 'Recycle Bin'],
      ].forEach(([icon, label]) => {
        const it = u.el('div', 'desktop-icon', icons);
        u.el('span', 'desktop-glyph', it, icon);
        u.el('span', '', it, label);
      });
      const app = u.el('main', 'app-window', desk);
      const title = u.el('header', 'titlebar', app);
      u.el('span', 'app-icon', title, '▣');
      u.el('span', 'window-title', title, 'Number Sequence');
      const wc = u.el('div', 'window-controls', title);
      [['−', 'minimize'], ['□', 'maximize'], ['×', 'close']].forEach(([t, c]) => u.el('span', c, wc, t));
      const upper = u.el('div', 'upper-row', app);
      const task = u.el('section', 'task-panel', upper);
      u.el('div', 'section-title', task, 'Task');
      const taskbody = u.el('div', 'task-body', task);
      const work = u.el('section', 'workspace-panel', upper);
      u.el('div', 'section-title workspace-title', work, 'Workspace');
      const stage = u.el('div', 'stage', work);
      const actions = u.el('section', 'actions-panel', app);
      const actionhead = u.el('div', 'section-title actions-title', actions, 'Actions');
      u.el('div', 'action-title-tools', actionhead);
      const strip = u.el('div', 'action-strip', actions);
      const taskbar = u.el('footer', 'taskbar', document.body);
      const start = u.el('div', 'start-button', taskbar);
      u.el('span', 'windows-mark', start, '▦');
      u.el('b', '', start, 'Start');
      const tasktab = u.el('div', 'task-tab', taskbar);
      u.el('span', 'task-tab-icon', tasktab, '▣');
      u.el('b', '', tasktab, 'Number Sequence');
      const clock = u.el('div', 'clock', taskbar, '10:24 AM');
      Object.assign(_c, { app, upper, taskbody, strip, taskbar, clock, stage, header: taskbody });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.strip;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.upper; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.taskbody;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        _c.taskbody.appendChild(document.body.querySelector('.ref-note'));
      }
      _c.util.el('div', 'separator', _c.taskbody);
      _c.util.el('div', 'task-copy', _c.taskbody, 'Number Sequence\nWorkspace ready.');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.taskbar.insertBefore(foot, _c.clock);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.strip.appendChild(dock);
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
    name: 'design-read-figure-ascending-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-ascending-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#102a83'],
      LOW_ACCENTS: ['#102a83'],
      parts,
    },
  });
})();
