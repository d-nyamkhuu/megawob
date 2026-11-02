(function () {
  'use strict';
  const palette = { bg: '#008b88', panel: '#c0c0c0', fg: '#090909', muted: '#333', line: '#777' };
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
      document.body.classList.add('ds-desktop');
      const shell = u.el('div', 'ds-shell', document.body);
      const work = u.el('main', 'ds-work', shell);
      const icons = u.el('aside', 'ds-icons', work);
      [
        ['▣', 'Program Manager'],
        ['▤', 'File Manager'],
        ['✎', 'Write'],
        ['▦', 'Paintbrush'],
        ['▣', 'Minesweeper'],
      ].forEach(([i, t]) => {
        const item = u.el('div', 'ds-icon', icons);
        u.el('b', '', item, i);
        u.el('span', '', item, t);
      });
      const win = u.el('section', 'ds-appwin', work);
      const title = u.el('header', 'ds-app-title', win);
      u.el('span', 'ds-app-glyph', title, 'T');
      u.el('strong', '', title, 'Company Login');
      u.el('span', 'ds-window-controls', title, '▁  ×');
      const menu = u.el('nav', 'ds-app-menu', win);
      ['File', 'Edit', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const content = u.el('div', 'ds-app-content', win);
      const brand = u.el('div', 'ds-company', content);
      u.el('i', 'ds-factory', brand, '');
      const brandText = u.el('div', '', brand);
      u.el('b', '', brandText, 'Riverton Systems');
      u.el('span', '', brandText, 'Employee Access');
      u.el('div', 'ds-rule', content);
      const status = u.el('footer', 'ds-status', win);
      const task = u.el('aside', 'ds-taskwin', shell);
      const taskbar = u.el('header', 'ds-task-title', task);
      u.el('b', '', taskbar, 'Task');
      u.el('span', 'ds-task-close', taskbar, '×');
      if (_c.display === 'header') taskbar.classList.add('ds-task-title-note');
      const taskBottom = u.el('div', 'ds-task-bottom', task);
      Object.assign(_c, { shell, content, status, task, taskbar, taskBottom, header: taskbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-task-note', 'ds-note-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.taskBottom;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.task;
      base(_c);
      _c.body = body;
      const panel = _c.task.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-task-note', 'ds-note-panel');
        _c.task.insertBefore(panel, _c.taskBottom);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'ds-stage', _c.content);
      _c.util.el('div', 'ds-stage-rule', _c.content);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-task-note', 'ds-note-toast');
        _c.task.insertBefore(note, _c.taskBottom);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.status.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.task.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', `ds-overlay ds-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', 'ds-overlay-title', el, ctx.kind === 'cookie' ? 'Cookie Notice' : 'Reminder');
      u.el('div', 'ds-overlay-copy', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-popup-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-popup-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#090878'],
      LOW_ACCENTS: ['#090878'],
      parts,
    },
  });
})();
