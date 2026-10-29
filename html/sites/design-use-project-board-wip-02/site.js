// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
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
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        // Fixed Qt Plastik palette; retain the seeded theme draws above for stable episode streams.
        Object.entries({
          bg: '#f2f0e9',
          panel: '#faf9f5',
          fg: '#171614',
          muted: '#77736d',
          line: '#c9c5bc',
          accent: '#9e171b',
        }).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { ctx, display, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const titlebar = util.el('div', 'editorial-head', header);
        const titleblock = util.el('div', 'editorial-titleblock', titlebar);
        util.el('strong', 'editorial-title', titleblock, 'Website Redesign');
        util.el('span', 'editorial-subtitle', titleblock, 'Release Plan and Delivery Board');
        const release = util.el('div', 'editorial-release', titlebar);
        util.el('span', '', release, 'Target Release');
        util.el('strong', '', release, 'Apr 30, 2008');
        const artwork = util.el('span', 'editorial-tree', titlebar);
        artwork.innerHTML =
          '<svg viewBox="0 0 120 64" aria-hidden="true"><rect width="120" height="64" fill="#e9e5d9"/><path d="M0 43 18 32 36 39 54 24 72 40 94 29 120 41v23H0z" fill="#d0d0c2"/><path d="M0 51 21 42 41 48 63 37 84 48 104 38 120 44v20H0z" fill="#afb5a4"/><path d="M3 57 26 49 44 55 66 47 88 56 108 48 120 52v12H0z" fill="#9da58e"/><path d="M80 53 82 32 77 20 82 12 86 27 85 53" fill="#6e6248"/><g fill="#7b865f"><ellipse cx="78" cy="14" rx="10" ry="7"/><ellipse cx="89" cy="15" rx="11" ry="8"/><ellipse cx="72" cy="22" rx="10" ry="7"/><ellipse cx="84" cy="23" rx="12" ry="8"/><ellipse cx="96" cy="23" rx="10" ry="7"/><ellipse cx="77" cy="31" rx="11" ry="7"/><ellipse cx="90" cy="31" rx="12" ry="8"/><ellipse cx="101" cy="30" rx="8" ry="6"/></g><g fill="#9da27a"><circle cx="76" cy="14" r="2"/><circle cx="87" cy="12" r="2"/><circle cx="94" cy="18" r="2"/><circle cx="71" cy="22" r="2"/><circle cx="83" cy="21" r="2"/><circle cx="97" cy="25" r="2"/><circle cx="78" cy="29" r="2"/><circle cx="89" cy="31" r="2"/><circle cx="104" cy="29" r="2"/></g><path d="M10 55h28m57 2h17" stroke="#858b76" stroke-width="1"/></svg>';
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        Object.assign(_c, { artwork, header, release, titlebar, titleblock });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const timeline = util.el('section', 'editorial-timeline', body);
        util.el('h2', '', timeline, 'Timeline');
        const grid = util.el('div', 'timeline-grid', timeline);
        const labels = util.el('div', 'timeline-labels', grid);
        util.el('span', '', labels, 'Task');
        util.el('span', '', labels, 'Start');
        util.el('span', '', labels, 'End');
        const dates = util.el('div', 'timeline-dates', grid);
        util.el('div', 'timeline-month', dates, 'April 2008');
        const days = util.el('div', 'timeline-dayrow', dates);
        for (let d = 1; d <= 30; d++) util.el('span', '', days, String(d));
        const rows = util.el('div', 'timeline-rows', grid);
        for (const [name, start, end, left, width, color] of [
          ['Analytics integration', 'Apr 1', 'Apr 7', 0, 20, 'blue'],
          ['Design handoff', 'Apr 3', 'Apr 10', 7, 18, 'green'],
          ['Navigation polish', 'Apr 8', 'Apr 18', 18, 24, 'orange'],
          ['Support playbook', 'Apr 14', 'Apr 25', 31, 31, 'purple'],
          ['Beta release', 'Apr 28', 'Apr 28', 87, 0, 'milestone'],
          ['Public release', 'Apr 30', 'Apr 30', 95, 0, 'milestone'],
        ]) {
          const row = util.el('div', 'timeline-row', rows);
          util.el('span', '', row, name);
          util.el('span', '', row, start);
          util.el('span', '', row, end);
          const track = util.el('span', 'timeline-track', row);
          const bar = util.el('i', `timeline-bar ${color}`, track);
          bar.style.left = `${left}%`;
          bar.style.width = `${width}%`;
        }
        const inspector = util.el('aside', 'editorial-inspector', body);
        util.el('h2', '', inspector, 'Task Details');
        util.el('div', 'inspector-calendar-title', inspector, '‹　　April 2008　　›');
        util.el('div', 'inspector-week', inspector, 'Sun　 Mon　 Tue　 Wed　 Thu　 Fri　 Sat');
        const cal = util.el('div', 'inspector-calendar', inspector);
        for (const day of [
          '',
          '',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
          '24',
          '25',
          '26',
          '27',
          '28',
          '29',
          '30',
          '',
          '',
        ]) {
          util.el('span', day === '30' ? 'selected' : '', cal, day);
        }
        const empty = util.el('div', 'inspector-empty', inspector);
        util.el('strong', '', empty, 'No task selected');
        util.el('span', '', empty, 'Select a card to view its details, dependencies and team information.');
        const bottom = util.el('nav', 'editorial-dock', document.body);
        for (const [i, item] of ['Overview', 'Timeline', 'Board', 'People', 'Reports'].entries()) {
          const a = util.el('a', `dock-item${i === 0 ? ' active' : ''}`, bottom);
          util.el('span', 'dock-icon', a, ['▤', '▦', '▥', '♟', '▮'][i]);
          util.el('span', '', a, item);
        }
        util.el('span', 'dock-brand', bottom, 'Website Redesign\nTeam Workspace');
        Object.assign(_c, { bottom, cal, dates, days, empty, grid, inspector, labels, rows, stage, timeline });
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.instruction': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-project-board-wip-02',
    template: 'site/base',
    design: { parts },
  });
})();
