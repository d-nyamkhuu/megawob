(function () {
  'use strict';
  const palette = { bg: '#e7ecef', panel: '#f7f8f8', fg: '#10264b', muted: '#536276', line: '#aebbc4' };
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
      const body = u.el('div', 'nb-body', document.body);
      const mast = u.el('header', 'nb-mast', body);
      const brand = u.el('div', 'nb-brand', mast);
      u.el('span', 'nb-globe', brand, '◉');
      const word = u.el('div', 'nb-word', brand);
      u.el('b', '', word, 'NorthBridge');
      u.el('span', '', word, 'Extranet');
      const primary = u.el('nav', 'nb-primary', mast);
      u.el('b', '', primary, 'Projects');
      ['Teams', 'Documents', 'Reports'].forEach((x) => u.el('span', '', primary, x));
      const utility = u.el('div', 'nb-utility', mast);
      ['Help', 'My Profile', 'Sign Out'].forEach((x) => u.el('span', '', utility, x));
      const tabs = u.el('nav', 'nb-tabs', body);
      ['Home', 'Projects', 'Tasks', 'Milestones', 'Time & Expenses', 'Resources', 'Administration'].forEach((x, i) =>
        u.el('div', 'nb-tab' + (i === 1 ? ' active' : ''), tabs, x),
      );
      const shell = u.el('div', 'nb-shell', body);
      const left = u.el('aside', 'nb-left', shell);
      u.el('h2', '', left, 'Project Phoenix');
      ['Overview', 'Plan', 'Tasks', 'Issues', 'Risks', 'Team', 'Documents', 'Status Reports'].forEach((x, i) =>
        u.el('div', 'nb-navitem' + (i === 1 ? ' selected' : ''), left, x),
      );
      const related = u.el('section', 'nb-related', left);
      u.el('h2', '', related, 'Related Projects');
      ['Mercury', 'Orion', 'Apollo', 'Gemini'].forEach((x) => u.el('div', '', related, x));
      const work = u.el('main', 'nb-work', shell);
      const head = u.el('section', 'nb-project', work);
      u.el('div', 'nb-projectname', head, 'Project Phoenix');
      u.el('div', 'nb-subtitle', head, 'Product Launch Initiative');
      const facts = u.el('div', 'nb-facts', head);
      [
        ['Project ID:', 'PHX-1003'], ['Status:', 'In Progress'],
        ['Start Date:', 'Sep 1, 2026'], ['Target Date:', 'Mar 31, 2027'],
      ].forEach(([a, b]) => {
        const row = u.el('div', '', facts);
        u.el('span', '', row, a);
        u.el('b', '', row, b);
      });
      const right = u.el('aside', 'nb-summary', shell);
      u.el('h2', '', right, 'Status Summary');
      [
        ['Total Tasks:', '24'], ['Completed:', '9'], ['In Progress:', '11'],
        ['Not Started:', '4'], ['Overdue:', '0'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'nb-stat', right);
        u.el('span', '', row, a);
        u.el('b', '', row, b);
      });
      const bottom = u.el('div', 'nb-bottom', work);
      const form = u.el('section', 'nb-form', bottom);
      u.el('h2', '', form, 'Sprint Details');
      Object.assign(_c, { shell, left, work, right, form, outer: body, toolbar: head, header: form });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('nb-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'nb-main', _c.form);
      const taskArea = u.el('div', 'nb-task', main);
      const taskHead = u.el('div', 'nb-taskhead', taskArea);
      u.el('b', '', taskHead, 'Sprint 6');
      const staticrows = u.el('div', 'nb-staticrows', taskArea);
      [
        ['Sprint Name:', 'Sprint 6', 'input'],
        ['Project:', 'Project Phoenix (PHX-1003)', 'value'],
        ['Team:', 'Core Product Team', 'select'],
        ['Sprint Goal:', 'User interface polish and performance improvements', 'input'],
      ].forEach(([a, b, k]) => {
        const r = u.el('div', 'nb-staticrow', staticrows);
        u.el('span', '', r, a);
        const v = u.el('div', k === 'value' ? 'nb-staticvalue' : 'nb-staticcontrol', r, b);
        if (k === 'select') u.el('i', '', v, '▼');
      });
      const sprint = u.el('section', 'nb-sprint', _c.right);
      u.el('h2', '', sprint, 'Sprint Tasks (0)');
      const th = u.el('div', 'nb-th', sprint);
      ['ID', 'Title', 'Status'].forEach((x) => u.el('b', '', th, x));
      u.el('div', 'nb-empty', sprint, 'No tasks in this sprint.');
      Object.assign(_c, { body: main, taskArea });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'ds-stage', _c.taskArea);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.outer.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('nb-footer');
      _c.work.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const m = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, m[ctx.kind]);
      const d = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      d.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: d, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-set-date-week-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-week-04': palette }, LOW_THEME: palette,
      ACCENTS: ['#a94720'], LOW_ACCENTS: ['#a94720'], parts,
    },
  });
})();
