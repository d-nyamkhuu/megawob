(function () {
  'use strict';
  const palette = { bg: '#e6edf6', panel: '#fdfbf0', fg: '#080c39', muted: '#0c3a8c', line: '#a6c0e3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated inspector and an in-page toast at every size.
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
      document.body.className = 'design xp';
      const shell = u.el('div', 'shell', document.body);
      const tb = u.el('div', 'titlebar', shell);
      const icon = u.el('span', 'tb-icon', tb);
      icon.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#f6f5de" stroke="#596b80" d="M3 2h18v20H3z"/><path fill="#6d8594" stroke="#334c62" d="m7 5 7-2 3 11-7 2z"/><path fill="#fff" stroke="#536e73" d="m5 8 7-2 3 11-7 2z"/><path fill="#809461" d="m9 9 6-1 1 5-6 2z"/><path stroke="#405968" d="m7 16 5-1m-4 3 5-1m3-12 3 1m-2 2 2 1"/></svg>';
      u.el('span', 'tb-title', tb, 'Sort the Cards');
      const btns = u.el('div', 'tb-btns', tb);
      u.el('span', 'tb-btn', btns, '_');
      u.el('span', 'tb-btn', btns, '□');
      u.el('span', 'tb-btn close', btns, '×');
      const menu = u.el('div', 'menubar', shell);
      for (const m of ['File', 'Edit', 'View', 'Help']) u.el('span', 'menu-item', menu, m);
      const toolbar = u.el('div', 'menu-tools', menu);
      const page = u.el('div', 'page');
      Object.assign(_c, { shell, toolbar, page, header: page });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note', 'instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'xp-body', _c.shell);
      body.appendChild(_c.page);
      const side = u.el('aside', 'inspector', body);
      u.el('div', 'insp-head', side, 'Task Details');
      const inspectorBody = u.el('div', 'insp-body', side);
      const actions = u.el('div', 'insp-actions', side);
      Object.assign(_c, { body, inspectorBody, actions });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.inspectorBody;
      base(_c);
      _c.body = body;
      const title = _c.inspectorBody.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Instruction:';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.page);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        _c.page.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.actions.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.prepend(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = {
        cookie: 'Privacy notice',
        toast: 'Changes saved',
        chat: 'Help',
        promo: 'Notebook news',
        banner: 'Notice',
      };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el(
        'p',
        '',
        box,
        ctx.kind === 'cookie'
          ? 'Allow optional cookies for this page?'
          : 'You can close this note to return to the activity.',
      );
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-reorder-items-kanban-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-kanban-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1455e5'],
      LOW_ACCENTS: ['#1455e5'],
      parts,
    },
  });
})();
