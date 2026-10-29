// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      // Fixed Qt Plastik palette; retain the seeded theme draws above for stable episode streams.
      Object.entries({ bg: '#e7ebf2', panel: '#f5f7fa', fg: '#0b1026', muted: '#536176', line: '#adbaca', accent: '#3b8fe8' })
        .forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { ctx, display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'qt-titlebar', header);
      util.el('span', 'qt-appicon', titlebar, 'R');
      util.el('strong', 'qt-title', titlebar, 'Release Planner - Atlas Platform');
      const winbuttons = util.el('div', 'qt-winbuttons', titlebar);
      for (const symbol of ['–', '□', '×']) util.el('span', 'qt-winbutton', winbuttons, symbol);
      const menubar = util.el('nav', 'qt-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Project', 'Team', 'Tools', 'Help']) {
        const a = util.el('a', 'qt-menuitem', menubar, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'menu', label: item }); });
      }
      const tabs = util.el('nav', 'qt-tabs', header);
      for (const [i, item] of ['Overview', 'Tasks', 'Timeline', 'Team', 'Releases', 'Reports'].entries()) {
        const a = util.el('a', `qt-tab${i === 1 ? ' selected' : ''}`, tabs, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'tab', label: item }); });
      }
      const stats = util.el('div', 'qt-summary', header);
      util.el('b', 'qt-release-label', stats, 'Release:');
      util.el('span', 'qt-release-select', stats, 'Atlas Platform 1.0　▾');
      util.el('b', '', stats, 'Dates:');
      util.el('span', '', stats, 'Apr 7, 2003　–　May 30, 2003');
      util.el('b', 'qt-total', stats, 'Total:');
      util.el('span', '', stats, '6 tasks');
      util.el('b', '', stats, 'Ready:');
      util.el('span', '', stats, '2/3');
      util.el('b', '', stats, 'In progress:');
      util.el('span', '', stats, '2/3');
      util.el('b', '', stats, 'Done:');
      util.el('span', '', stats, '2/4');
      util.el('span', 'qt-milestone', stats, '◇ = Milestone');
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      Object.assign(_c, { header, menubar, stats, tabs, titlebar, winbuttons });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-project-board-wip-01',
    template: 'site/base',
    design: { parts },
  });
})();
