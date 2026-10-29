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
          bg: '#e7ebf2',
          panel: '#f5f7fa',
          fg: '#0b1026',
          muted: '#536176',
          line: '#adbaca',
          accent: '#3b8fe8',
        }).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { ctx, display, label, name, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const titlebar = util.el('div', 'qt-titlebar', header);
        util.el('strong', 'qt-title', titlebar, 'Website Redesign');
        util.el('span', 'qt-subtitle', titlebar, 'Q3 2024 Release');
        const dates = util.el('div', 'qt-dates', titlebar);
        const dateIcon = (parent) => {
          const icon = util.el('span', 'qt-calendar-icon-wrap', parent);
          icon.innerHTML =
            '<svg class="qt-calendar-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="1.5"/><path d="M7 3v4M17 3v4M4 10h16"/></svg>';
        };
        const startDate = util.el('span', 'qt-date', dates);
        dateIcon(startDate);
        util.el('span', 'qt-date-copy', startDate, 'Start\nMon, Jul 1, 2024');
        const targetDate = util.el('span', 'qt-date', dates);
        dateIcon(targetDate);
        const targetCopy = util.el('span', 'qt-date-copy', targetDate);
        util.el('span', '', targetCopy, 'Target release\nMon, Sep 30, 2024');
        util.el('small', '', targetCopy, '91 days');
        const progress = util.el('span', 'qt-progress', dates);
        util.el('b', '', progress, '58%');
        util.el('span', '', dates, 'Overall progress　 7 of 12 tasks');
        const menubar = util.el('nav', 'qt-menubar', header);
        for (const item of ['File', 'Edit', 'View', 'Project', 'Team', 'Tools', 'Help']) {
          const a = util.el('a', 'qt-menuitem', menubar, item);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'menu', label: item });
          });
        }
        const tabs = util.el('nav', 'qt-tabs', header);
        for (const [i, item] of ['Overview', 'Tasks', 'Timeline', 'Team', 'Releases', 'Reports'].entries()) {
          const a = util.el('a', `qt-tab${i === 1 ? ' selected' : ''}`, tabs, item);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'tab', label: item });
          });
        }
        const stats = util.el('div', 'qt-summary', header);
        util.el('b', 'qt-total', stats, '◷　 Total 6 tasks');
        for (const [label, count] of [
          ['Backlog', '0 / 3'],
          ['Ready', '2 / 3'],
          ['In progress', '1 / 3'],
          ['Done', '3 / 3'],
        ]) {
          const item = util.el('span', 'qt-count', stats);
          util.el('i', `qt-swatch ${label.toLowerCase().replaceAll(' ', '-')}`, item);
          util.el('span', '', item, `${label}　 ${count}`);
        }
        const gantt = util.el('section', 'qt-gantt', header);
        util.el('strong', 'qt-gantt-title', gantt, 'Release timeline');
        const axis = util.el(
          'div',
          'qt-axis',
          gantt,
          'Jul 2024　　　　　　　　　　　　　Aug 2024　　　　　　　　　　　　　Sep 2024',
        );
        const chart = util.el('div', 'qt-chart', gantt);
        for (const [lane, blocks] of [
          [
            'Platform',
            [
              ['Import pipeline', 5, 30, 'blue'],
              ['Rollout checklist', 53, 19, 'purple'],
            ],
          ],
          [
            'Content',
            [
              ['Content audit', 9, 34, 'green'],
              ['Launch prep', 68, 21, 'pink'],
            ],
          ],
          ['Data', [['Data migration', 17, 45, 'yellow']]],
          ['Marketing', [['Campaign assets', 52, 28, 'purple']]],
        ]) {
          const row = util.el('div', 'qt-lane', chart);
          util.el('span', '', row, lane);
          const track = util.el('div', 'qt-track', row);
          for (const [name, left, width, color] of blocks) {
            const bar = util.el('span', `qt-bar ${color}`, track, name);
            bar.style.left = `${left}%`;
            bar.style.width = `${width}%`;
          }
        }
        const links = util.el('div', 'qt-dependencies', chart);
        links.innerHTML =
          '<svg viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="qt-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7z" fill="#8295b1"/></marker></defs><path d="M400 25H500Q510 25 510 35V50H565" marker-end="url(#qt-arrow)"/><path d="M475 75H680Q690 75 690 85V100H705" marker-end="url(#qt-arrow)"/></svg>';
        const milestone = util.el('div', 'qt-milestone', chart);
        util.el('i', '', milestone);
        util.el('span', '', milestone, 'Go live');
        util.el('small', '', milestone, 'Sep 30');
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        Object.assign(_c, {
          axis,
          chart,
          dateIcon,
          dates,
          gantt,
          header,
          links,
          menubar,
          milestone,
          progress,
          startDate,
          stats,
          tabs,
          targetCopy,
          targetDate,
          titlebar,
        });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, dates, display, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        const index = util.el('aside', 'qt-task-index', body);
        const ih = util.el('div', 'qt-index-head', index);
        util.el('strong', '', ih, 'Tasks');
        util.el('span', '', ih, '6 of 12');
        util.el('div', 'qt-search', index, '⌕　 Search tasks…');
        for (const [title, team, dates, color] of [
          ['Import pipeline', 'Platform', 'Jul 1 – Aug 9', 'blue'],
          ['Content audit', 'Content', 'Jul 8 – Aug 16', 'green'],
          ['Data migration', 'Data', 'Jul 15 – Aug 30', 'yellow'],
          ['Campaign assets', 'Marketing', 'Aug 12 – Sep 20', 'purple'],
          ['Launch prep', 'Marketing', 'Sep 2 – Sep 27', 'pink'],
          ['Rollout checklist', 'Platform', 'Aug 19 – Sep 6', 'purple'],
        ]) {
          const row = util.el('div', 'qt-index-row', index);
          util.el('i', `qt-dot ${color}`, row);
          const info = util.el('div', '', row);
          util.el('b', '', info, title);
          util.el('span', '', info, team);
          util.el('span', '', info, dates);
        }
        Object.assign(_c, { ih, index });
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.instruction': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-project-board-wip-04',
    template: 'site/base',
    design: { parts },
  });
})();
