// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-dependency-03',
  name: 'design',
  split: 'train',
  scenarios: ['dependency'],
  template: 'use-project-board/workspace',
  design: {
    parts: {
      sidebar: (base, S) => () => {},
      navigation: (base, S) => () => {},
      heading: (base, S) => () => base(),
      tabs: (base, S) => () => base(),
      toolbar: (base, S) => () => base(),
      viewMeta: (base, S) => () => base(),
      controls: (base, S) => () => base(),
      body: (base, S) => () => base(),
      timelineFrame: (base, S) => () => {
        base();
        const u = S.ctx.util, scene = S.scene, main = S.els.main, body = S.els.body;
        const summary = u.el('section', 'kinetic-summary', main);
        main.insertBefore(summary, body);
        scene.axisLabel.replaceChildren();
        u.el('span', 'kinetic-axis-hash', scene.axisLabel, '#');
        u.el('strong', '', scene.axisLabel, 'TASK');
        const release = u.el('div', 'kinetic-release', summary);
        u.el('div', 'kinetic-kicker', release, 'RELEASE');
        u.el('strong', 'kinetic-quarter', release, 'Q2 2025');
        u.el('span', 'kinetic-date', release, 'APR 7, 2025 – JUN 13, 2025');
        const metric = (value, label) => {
          const box = u.el('div', 'kinetic-metric', summary);
          u.el('strong', '', box, value); u.el('span', '', box, label);
        };
        metric(String(S.spec.items.length), 'TASKS');
        metric(String(S.ctx.model.edges.length), 'DEPENDENCIES');
        metric('1', 'MILESTONE');
        const progress = u.el('div', 'kinetic-progress', summary);
        u.el('strong', '', progress, 'PROGRESS');
        const track = u.el('div', 'kinetic-progress-track', progress);
        u.el('span', '', track);
        u.el('b', '', progress, '33%');

        const columns = u.el('div', 'kinetic-task-area', main);
        main.insertBefore(columns, body);
        const timelineCol = u.el('div', 'kinetic-timeline-col', columns);
        timelineCol.append(body);
        const totals = u.el('div', 'kinetic-totals', timelineCol);
        u.el('b', '', totals, `${S.spec.items.length} TASKS`);
        u.el('b', '', totals, `${S.ctx.model.edges.length} DEPENDENCIES`);
        u.el('b', '', totals, '1 MILESTONE');
        u.el('span', '', totals, 'PROJECT DURATION: 68 DAYS');
        u.el('span', '', totals, 'APR 7, 2025 – JUN 13, 2025');
        const inspector = u.el('aside', 'kinetic-inspector', columns);
        u.el('h2', '', inspector, 'TASK DETAILS');
        const empty = u.el('div', 'kinetic-empty', inspector);
        u.el('span', 'kinetic-file-icon', empty, '▤');
        u.el('p', '', empty, 'Select a task to view details here.');

        const board = u.el('section', 'kinetic-board', main);
        u.el('h2', '', board, 'DELIVERY BOARD');
        const lanes = u.el('div', 'kinetic-lanes', board);
        const groups = [
          { name: 'TO DO', indices: [3, 4] }, { name: 'IN PROGRESS', indices: [0, 1] },
          { name: 'IN REVIEW', indices: [2] }, { name: 'DONE', indices: [5] },
        ];
        const tints = ['#ff9d19', '#08bdc7', '#167cf4', '#1db64d', '#9653f5', '#f34f9d'];
        for (const group of groups) {
          const lane = u.el('div', 'kinetic-lane', lanes);
          const heading = u.el('div', 'kinetic-lane-head', lane);
          u.el('b', '', heading, group.name);
          u.el('span', '', heading, `${group.indices.length} / 3`);
          for (const i of group.indices) {
            const it = S.active[i]; if (!it) continue;
            const card = u.el('div', 'kinetic-card', lane);
            const dot = u.el('i', '', card); dot.style.background = tints[i];
            const text = u.el('div', 'kinetic-card-text', card);
            u.el('strong', '', text, it.title);
            u.el('span', '', text, it.owner.split(' ')[0]);
            const bar = S.ctx.model.bars[it.id];
            const month = S.spec.month.slice(0, 3);
            u.el('time', '', card, `${month} ${bar.start} – ${month} ${bar.start + bar.duration}`);
          }
        }
      },
      timelineRefresh: (base, S) => () => {
        const scene = S.scene;
        scene.AXIS = scene.axis.clientHeight;
        scene.PHASE = 0;
        // Reserve the calendar's 10px visibility inset and the 24px interaction
        // bounds at both ends, so even a first-to-last dependency fits the pane.
        scene.ROW = Math.max(25, Math.min(48, Math.floor((S.els.body.clientHeight - scene.AXIS - 44) / (S.active.length - 1))));
        base();
        let y = scene.AXIS + Math.max(0, 22 - scene.ROW / 2);
        for (const it of [...S.active, ...S.related]) {
          const row = scene.nodes[it.id];
          scene.positions[it.id] = y;
          row.style.top = `${y}px`;
          row.style.height = `${scene.ROW}px`;
          y += scene.ROW;
        }
        scene.wrap.style.height = `${y + 2}px`;
        S.P.paint(S.ctx.model);
      },
      timelineRow: (base, S) => (it, index) => {
        const row = base(it, index);
        const id = row.querySelector('.pj-id');
        if (id && !it.related) id.textContent = String(index + 1);
        return row;
      },
      timelineCalendar: (base, S) => () => {
        const u = S.ctx.util, scene = S.scene, spec = S.spec;
        const metaW = Math.max(138, Math.min(230, scene.wrap.clientWidth * .245));
        const shownDays = spec.days;
        const dayW = (scene.wrap.clientWidth - metaW) / shownDays;
        scene.axisLabel.style.width = `${metaW}px`;
        scene.metaW = metaW; scene.shownDays = shownDays; scene.dayW = dayW;
        scene.dates.replaceChildren();
        u.el('div', 'pj-month', scene.dates, `${spec.month.toUpperCase()} 2025`);
        for (let d = 1; d <= shownDays; d += 7) {
          const week = u.el('div', 'pj-week', scene.dates, String(d));
          week.style.left = `${(d - 1) * dayW}px`; week.style.width = `${Math.min(7, shownDays - d + 1) * dayW}px`;
        }
        for (let d = 1; d <= shownDays; d++) {
          const date = u.el('div', `pj-date${d === S.todayDay ? ' today' : ''}`, scene.dates, String(d));
          date.style.left = `${(d - 1) * dayW}px`; date.style.width = `${dayW}px`;
        }
        scene.todayLine.style.left = `${metaW + (S.todayDay - .5) * dayW}px`;
        Object.values(scene.nodes).forEach((row) => row.lastElementChild.style.setProperty('--day', `${dayW}px`));
      },
    },
  },
});
