// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-swimlane-04',
  name: 'design',
  split: 'train',
  scenarios: ['swimlane'],
  template: 'use-project-board/workspace',
  design: {
    parts: {
      sidebar(base, S) { return () => {
        const nav = S.ctx.util.el('nav', 'pj-sidebar', S.els.root);
        nav.setAttribute('aria-label', 'Release board legend');
        const scroll = S.ctx.util.el('div', 'pj-sidebar-scroll', nav);
        S.els.sidebar = nav;
        S.els.nav = scroll;
        const title = S.ctx.util.el('h3', 'orion-legend-title', scroll, 'Legend');
        const card = S.ctx.util.el('div', 'orion-legend-row', scroll);
        S.ctx.util.el('i', 'orion-swatch orion-card-swatch', card);
        S.ctx.util.el('span', '', card, 'Task card');
        const milestone = S.ctx.util.el('div', 'orion-legend-row', scroll);
        S.ctx.util.el('i', 'orion-diamond', milestone);
        S.ctx.util.el('span', '', milestone, 'Milestone');
        const dependency = S.ctx.util.el('div', 'orion-legend-row', scroll);
        S.ctx.util.el('i', 'orion-arrow', dependency);
        S.ctx.util.el('span', '', dependency, 'Dependency (finish to start)');
        S.ctx.util.el('h3', 'orion-legend-title orion-priority-title', scroll, 'Priority');
        for (const [label, cls] of [['High', 'high'], ['Medium', 'medium'], ['Low', 'low']]) {
          const row = S.ctx.util.el('div', 'orion-legend-row', scroll);
          S.ctx.util.el('i', `orion-swatch orion-priority-${cls}`, row);
          S.ctx.util.el('span', '', row, label);
        }
      }; },
      heading(base, S) { return () => {
        const u = S.ctx.util;
        const main = u.el('div', 'pj-main', S.els.root);
        S.els.main = main;
        const head = u.el('div', 'pj-head orion-summary', main);
        const release = u.el('section', 'orion-release', head);
        u.el('h1', '', release, 'Q2 2024 Release');
        u.el('div', 'orion-dates', release, 'Apr 1, 2024 – Jun 30, 2024');
        u.el('p', '', release, 'Deliver key product and platform updates for the Q2 2024 release, with a focus on content, developer experience, and go-to-market readiness.');
        const progress = u.el('section', 'orion-progress', head);
        u.el('h3', '', progress, 'Overall Progress');
        u.el('div', 'orion-progress-track', progress).innerHTML = '<i></i>';
        u.el('strong', '', progress, '50%');
        u.el('div', 'orion-progress-caption', progress, '3 of 6 tasks complete');
        const totals = u.el('section', 'orion-totals', head);
        u.el('h3', '', totals, 'Task Totals by Status');
        const grid = u.el('div', 'orion-total-grid', totals);
        for (const [label, count] of [['Ready', '2'], ['In progress', '2'], ['Done', '2']]) {
          const item = u.el('div', 'orion-total', grid);
          u.el('span', '', item, label); u.el('strong', '', item, count);
        }
        const milestones = u.el('section', 'orion-milestones', head);
        u.el('h3', '', milestones, 'Milestones');
        for (const [name, date] of [['Beta release', 'Apr 30, 2024'], ['Feature complete', 'May 31, 2024'], ['Public release', 'Jun 30, 2024']]) {
          const row = u.el('div', 'orion-milestone', milestones);
          u.el('i', '', row); u.el('span', '', row, name); u.el('time', '', row, date);
        }
        S.els.notifications = u.el('button', 'orion-hidden-control', head);
        S.els.details = u.el('button', 'orion-hidden-control', head);
      }; },
    },
  },
});
