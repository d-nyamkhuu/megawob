(function () {
  'use strict';
  const palette = { bg: '#092237', panel: '#172b3b', fg: '#ecf3ff', muted: '#add1f1', line: '#315064' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('cad', 'instruction-' + _c.display);
      const app = u.el('main', 'cad-app', document.body);
      const title = u.el('header', 'titlebar', app);
      u.el('span', 'appmark', title, '◉');
      u.el('span', 'window-title', title, 'VertexCAD 2014 - Project Editor');
      const windowButtons = u.el('div', 'window-buttons', title);
      for (const [c, t] of [['min', '—'], ['max', '□'], ['close', '×']])
        u.el('span', 'window-button ' + c, windowButtons, t);
      const menu = u.el('nav', 'menubar', app);
      u.el('span', 'menu-caption', menu, 'File    Edit    View    Draw    Modify    Annotate    Tools    Window    Help');
      const toolbar = u.el('div', 'toolbar', app);
      const icons = ['➤', '✋', '⌕', '⌕', '⌕', '／', '╱', '◯', '□', '＋', '⊕', '⌖', '✎', '⚙', '▣'];
      icons.forEach((x, i) => {
        if ([2, 5, 9, 11, 13].includes(i)) {
          const sep = u.el('i', 'tool-sep', toolbar);
          sep.setAttribute('aria-hidden', 'true');
        }
        const b = u.el('button', 'tool-icon' + (i === 0 ? ' active' : ''), toolbar, x);
        b.type = 'button';
        b.tabIndex = -1;
      });
      const work = u.el('div', 'workarea', app);
      const rail = u.el('nav', 'rail', work);
      [['▯', 'Projects'], ['▤', 'Drawings'], ['⬡', 'Materials'], ['▥', 'Libraries'], ['▥', 'Reports'], ['⚙', 'Settings']].forEach((it, i) => {
        const a = u.el('div', 'navitem' + (!i ? ' selected' : ''), rail);
        u.el('span', 'navglyph', a, it[0]);
        u.el('span', 'navlabel', a, it[1]);
      });
      const info = u.el('aside', 'help-panel', work);
      const heading = u.el('div', 'help-heading', info, 'Project Information');
      Object.assign(_c, { app, toolbar, work, info, header: heading });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const info = u.el('div', 'help-content', _c.info);
      u.el('p', 'help-intro', info, 'Enter the basic details for the project. All fields are required and must be valid.');
      u.el('div', 'rule', info);
      u.el('h3', '', info, 'Field Guidelines');
      [
        ['Project Name', '3–50 characters. Letters, numbers, spaces, hyphens and underscores only.'],
        ['Project Code', '2–10 uppercase letters or numbers only.'],
        ['Start Date', 'Use format YYYY-MM-DD.'],
        ['End Date', 'Use format YYYY-MM-DD. Must be on or after the start date.'],
        ['Budget (USD)', 'Whole numbers only.'],
      ].forEach(([h, p]) => {
        u.el('b', 'guideline-title', info, h);
        u.el('p', 'guideline-copy', info, p);
      });
      u.el('div', 'rule', info);
      u.el('h3', 'example-title', info, 'Example');
      u.el('p', 'example-copy', info, 'Project Name:  River Bend\nProject Code:  RB100\nStart Date:  2014-03-01\nEnd Date:  2014-12-15\nBudget (USD):  250000');
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.info;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.work);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.app.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.app.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) (_c.app.querySelector('.ref-foot') || _c.app).appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Workspace notification',
          chat: 'Need help with this project?',
          promo: 'VertexCAD project tools',
          banner: 'Project workspace notice',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      b.addEventListener('click', ctx.dismiss);
      return { el, dismiss: b };
    },
  };
  env.site({
    name: 'design-solve-puzzle-fix-error-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-fix-error-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#80bff0'],
      LOW_ACCENTS: ['#80bff0'],
      parts,
    },
  });
})();
