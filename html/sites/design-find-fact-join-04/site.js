(function () {
  'use strict';
  const palette = { bg: '#c7e6fb', panel: '#f9fbfd', fg: '#12151a', muted: '#65748a', line: '#dce3ec' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let mode = _c.ctx.display || 'header';
      if ((mode === 'panel' || mode === 'toast') && _c.W < 1260) mode = 'header';
      _c.display = mode;
      document.body.classList.toggle('ref-has-note', mode === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      const u = _c.util;
      const win = u.el('div', 'window', document.body);
      const title = u.el('header', 'titlebar', win);
      const lights = u.el('div', 'lights', title);
      ['red', 'yellow', 'green'].forEach((c) => u.el('i', c, lights));
      u.el('span', 'app-icon', title, '♧');
      u.el('strong', 'app-title', title, 'Staff Directory');
      const task = u.el('section', 'task-column');
      Object.assign(_c, { win, task, header: task });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'menu', _c.win);
      ['File', 'Edit', 'View', 'Record', 'Window', 'Help'].forEach((t) => u.el('span', '', nav, t));
      const toolbar = u.el('div', 'toolbar', _c.win);
      const actions = [['＋', 'New'], ['▤', 'Open'], ['▤', 'Delete'], ['⌕', 'Search'], ['☷', 'Filter'], ['↕', 'Sort']];
      actions.forEach((a, i) => {
        if (i === 3) u.el('i', 'tool-divider', toolbar);
        const b = u.el('button', 'tool', toolbar);
        u.el('b', '', b, a[0]);
        u.el('span', '', b, a[1]);
      });
      const topSearch = u.el('div', 'global-search', toolbar);
      u.el('span', '', topSearch, '⌕');
      u.el('span', '', topSearch, 'Search people...');
      _c.toolbar = toolbar;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const content = u.el('div', 'content', _c.win);
      const main = u.el('div', 'main', content);
      main.appendChild(_c.task);
      const workarea = u.el('div', 'workarea', _c.task);
      const stage = u.el('main', 'ds-stage', workarea);
      const footer = u.el('footer', 'footer', _c.task);
      u.el('span', 'status', footer, '');
      const sidebar = u.el('aside', 'sidebar', main);
      const sh = u.el('div', 'side-heading', sidebar);
      u.el('span', 'people-icon', sh, '♧');
      u.el('strong', '', sh, 'All Staff (10)');
      const sbox = u.el('div', 'side-search', sidebar);
      u.el('span', '', sbox, '⌕');
      u.el('span', '', sbox, 'Search staff...');
      const list = u.el('div', 'staff-list', sidebar);
      const people = [
        ['PS', 'Priya Shah', 'Project Manager', 'S001', '#b6e8fb'],
        ['DK', 'Daniel Kim', 'Data Analyst', 'S002', '#a8e8bd'],
        ['AY', 'Amina Yusuf', 'HR Specialist', 'S003', '#ffc2a8'],
        ['LO', 'Luis Ortega', 'IT Support', 'S004', '#d9bdff'],
        ['KN', 'Kamau Ndiaye', 'Business Analyst', 'S005', '#a9c9ff'],
        ['CW', 'Chen Wei', 'Data Engineer', 'S006', '#a9e7d7'],
        ['SR', 'Sofia Rossi', 'Recruiter', 'S007', '#f4b2d0'],
        ['NP', 'Noah Patel', 'Systems Administrator', 'S008', '#ffdc83'],
        ['EW', 'Emma Wilson', 'Product Designer', 'S009', '#d9bdff'],
        ['HT', 'Hiro Tanaka', 'Research Analyst', 'S010', '#a5e4e9'],
      ];
      people.forEach((p) => {
        const row = u.el('div', 'staff-row', list);
        u.el('span', 'avatar', row, p[0]).style.background = p[4];
        const txt = u.el('div', 'staff-text', row);
        u.el('span', 'staff-name', txt, p[1]);
        u.el('span', 'staff-role', txt, p[2]);
        u.el('span', 'staff-id', row, p[3]);
      });
      Object.assign(_c, { body: workarea, stage, footer, content, main });
    },
    'frame.panel': (base) => (_c) => { base(_c); },
    'frame.stage': () => (_c) => { /* The original stage is already in the workarea. */ },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.main);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.toggle('directory-link-foot', _c.placement === 'link');
        _c.footer.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'overlay overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-join-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-join-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0674ff'],
      LOW_ACCENTS: ['#0674ff'],
      parts,
    },
  });
})();
