(function () {
  'use strict';
  const cfg = {
    theme: 'pixel',
    title: 'File Manager',
    menus: ['File', 'Edit', 'View', 'Tools', 'Help'],
    tabs: ['Instructions', 'Details'],
  };
  const CTRL =
    '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
  const FOLDER =
    '<svg class="ti" viewBox="0 0 32 30"><path d="M2 5h10l3 3h14v20H2Z" fill="#f8df75" stroke="#10234b" stroke-width="2"/><path d="M4 11h25v15H4Z" fill="#f0cb48"/><path d="M4 12h24M4 13v12" fill="none" stroke="#fff7ca" stroke-width="2"/><path d="m4 12 9-7h12l3 7" fill="#dbe9ed" stroke="#7692aa"/></svg>';
  const TASKICO =
    '<svg class="ti" viewBox="0 0 24 20"><path d="M4 1h10l4 4v14H4Z" fill="#fff" stroke="#dfe9fb"/><path d="M7 8h7M7 12h7" stroke="#2a5db0" stroke-width="2"/></svg>';
  const palette = { bg: '#3267a6', panel: '#f8f5eb', fg: '#07133c', muted: '#2a4478', line: '#12346b' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated task window at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', cfg.theme);
      const shell = u.el('main', 'shell', document.body);
      const fm = u.el('section', 'win fm', shell);
      const t1 = u.el('div', 'titlebar', fm);
      const ic = u.el('span', 'ico', t1);
      ic.innerHTML = FOLDER;
      u.el('span', 'cap', t1, cfg.title);
      const c1 = u.el('span', 'window-controls', t1);
      c1.innerHTML = CTRL;
      const menu = u.el('div', 'menubar', fm);
      cfg.menus.forEach((m) => u.el('span', 'mi', menu, m));
      const task = u.el('aside', 'win task inspector', shell);
      task.dataset.display = _c.display;
      const t2 = u.el('div', 'titlebar', task);
      const ic2 = u.el('span', 'ico', t2);
      ic2.innerHTML = TASKICO;
      u.el('span', 'cap', t2, 'Task');
      const c2 = u.el('span', 'window-controls', t2);
      c2.innerHTML = CTRL;
      const tabs = u.el('div', 'tabs', task);
      cfg.tabs.forEach((t, i) => u.el('span', 'tab' + (i === 0 ? ' on' : ''), tabs, t));
      const pane = u.el('div', 'pane', task);
      Object.assign(_c, { shell, fm, task, pane, header: pane });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.pane.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction', 'header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.task;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('tasktools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'center', _c.fm);
      const status = u.el('div', 'statusbar', _c.fm);
      u.el('span', '', status, '6 items (1 selected)');
      const disk = u.el('span', 'disk', status);
      u.el('i', '', disk);
      u.el('span', '', disk, 'Local Disk (C:)');
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.pane;
      base(_c);
      _c.body = body;
      const note = _c.pane.querySelector('.ref-panel-text');
      if (note) note.classList.add('instruction', 'panel-note');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.pane.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('taskfoot');
        _c.task.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.task.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-dialog-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-dialog-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#12346b'],
      LOW_ACCENTS: ['#12346b'],
      parts,
    },
  });
})();
