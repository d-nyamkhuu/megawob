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
      util.el('span', 'qt-appicon', titlebar, '▦');
      util.el('strong', 'qt-title', titlebar, 'Beacon - Release Planner');
      const winbuttons = util.el('div', 'qt-winbuttons', titlebar);
      for (const symbol of ['–', '□', '×']) util.el('span', 'qt-winbutton', winbuttons, symbol);
      const menubar = util.el('nav', 'qt-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Project', 'Help']) {
        const a = util.el('a', 'qt-menuitem', menubar, item);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'menu', label: item }); });
      }
      const tabs = util.el('nav', 'qt-tabs', header);
      const stats = util.el('div', 'qt-summary', header);
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      Object.assign(_c, { header, menubar, stats, tabs, titlebar, winbuttons });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar || true) {
        const unusedNav = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        void unusedNav;
        const side = util.el('aside', 'ref-side', body);
        for (const [i, item] of ['Overview', 'Board', 'Timeline', 'Teams', 'Releases', 'Reports', 'Settings'].entries()) {
          const a = util.el('a', `ref-sidelink${i === 1 ? ' selected' : ''}`, side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      _c.titlebar.insertBefore(_c.headerTools, _c.winbuttons);
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const main = util.el('main', 'planner-main', body);
      const sheet = util.el('section', 'planner-sheet', main);
      const releaseStats = util.el('div', 'release-summary', sheet);
      util.el('h1', '', releaseStats, 'Q2 2018 Release');
      const metrics = util.el('div', 'release-metrics', releaseStats);
      for (const [icon, value, label] of [['▤','6','Total tasks'],['◉','3','To do'],['◉','2','In progress'],['◉','1','Done'],['◆','1','Milestone']]) {
        const m = util.el('div', 'release-metric', metrics);
        util.el('span', 'metric-icon', m, icon); util.el('b', '', m, value); util.el('small', '', m, label);
      }
      util.el('div', 'release-dates', releaseStats, 'Apr 2, 2018 – Jun 29, 2018');
      const progress = util.el('div', 'release-progress', releaseStats);
      util.el('i', '', progress);
      util.el('span', '', progress, '33% complete');
      const timeline = util.el('section', 'planner-timeline', sheet);
      util.el('h2', '', timeline, 'Timeline');
      const chart = util.el('div', 'timeline-chart', timeline);
      const names = util.el('div', 'timeline-names', chart);
      for (const n of ['Task','Schema update','API integration','Support playbook','Rollout checklist','Marketing site','Beta release']) util.el(n === 'Task' ? 'b' : 'span', '', names, n);
      const grid = util.el('div', 'timeline-grid', chart);
      const months = util.el('div', 'timeline-months', grid);
      for (const m of ['Apr 2018','May 2018','Jun 2018']) util.el('b','',months,m);
      const weeks = util.el('div', 'timeline-weeks', grid);
      for (const w of ['Apr 2','Apr 9','Apr 16','Apr 23','Apr 30','May 7','May 14','May 21','May 28','Jun 4','Jun 11','Jun 18','Jun 25']) util.el('span','',weeks,w);
      const bars = util.el('div', 'timeline-bars', grid);
      for (const [name, cls, left, width] of [['a','blue','3%','24%'],['b','green','29%','21%'],['c','blue','52%','13%'],['d','green','67%','13%'],['e','green','72%','17%'],['f','diamond','97%','2%']]) { const bar=util.el('i',`timeline-bar ${cls}`,bars); bar.style.left=left; bar.style.width=width; }
      util.el('h2', 'board-title', sheet, 'Delivery Board');
      const stage = util.el('div', 'ref-stage', sheet);
      S.frameAlign(_c, stage);
      const legend = util.el('aside', 'planner-legend', body);
      util.el('h2', '', legend, 'Legend');
      const legendItems = util.el('div', 'legend-items', legend);
      for (const [cl, label] of [['blue','Task (In progress)'],['green','Task (Not started)'],['gray','Task (Done)'],['orange','Milestone']]) { const row=util.el('span','',legendItems); util.el('i',cl,row); util.el('span','',row,label); }
      util.el('span', 'dependency-legend', legendItems, '↳　Dependency (finish to start)');
      util.el('hr', '', legend);
      util.el('h2', '', legend, 'Tips');
      const tips = util.el('ul', '', legend);
      for (const tip of ['Drag cards between columns to update status.','Keep each column at or below its WIP limit.','Dependencies on the timeline update automatically.','Use the timeline to view dates and task order.']) util.el('li','',tips,tip);
      Object.assign(_c, { bars, chart, grid, legend, legendItems, main, metrics, months, names, progress, releaseStats, sheet, stage, timeline, tips, weeks });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-project-board-wip-03',
    template: 'site/base',
    design: { parts },
  });
})();
