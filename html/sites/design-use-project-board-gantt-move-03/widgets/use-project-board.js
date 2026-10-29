// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-gantt-move-03',
  name: 'design',
  split: 'train',
  scenarios: ['gantt-move'],
  template: 'use-project-board/workspace',
  design: {
    axisHeight: 106,
    rowHeight: 78,
    phaseHeight: 0,
    metaMin: 184,
    metaMax: 184,
    metaRatio: 0,
    parts: {
      sidebar(base) { return () => {}; },
      navigation(base) { return () => {}; },
      heading(base, S) {
        return (...args) => {
          base(...args);
          const { main } = S.els, head = main.querySelector('.pj-head');
          head.querySelector('.pj-muted').remove();
          const title = head.querySelector('.pj-title');
          title.textContent = 'Release Plan';
          const period = S.ctx.util.el('div', 'gantt-period', title.parentElement);
          const monthEnd = { January:31, February:28, March:31, April:30, May:31, June:30, July:31, August:31, September:30, October:31, November:30, December:31 }[S.spec.month] || 30;
          S.ctx.util.el('span', '', period, `${S.spec.month} 1, 2021 – ${S.spec.month} ${monthEnd}, 2021`);
          head.querySelector('.pj-saved').remove();
          const summary = S.ctx.util.el('div', 'gantt-summary', head);
          for (const [value, label] of [[S.active.length, 'Tasks'], [S.active.filter((it) => it.milestone).length || 1, 'Milestone'],
            [S.active.reduce((n, it) => n + (S.ctx.model.bars[it.id]?.duration || 0), 0), 'Total days']]) {
            const cell = S.ctx.util.el('div', 'gantt-summary-cell', summary);
            S.ctx.util.el('strong', '', cell, String(value)); S.ctx.util.el('span', '', cell, label);
          }
          S.els.notifications.style.display = 'none'; S.els.details.style.display = 'none';
        };
      },
      tabs(base) { return () => {}; },
      toolbar(base, S) {
        return (...args) => {
          base(...args);
          const { main, today } = S.els;
          const tools = main.querySelector('.pj-tools');
          tools.classList.add('gantt-controls');
          S.ctx.util.el('span', 'gantt-controls-spacer', tools);
          today.textContent = 'Today';
          today.classList.add('gantt-today');
        };
      },
      viewMeta(base) { return (...args) => base(...args); },
      body(base, S) {
        return (...args) => {
          base(...args);
          const { hint, foot } = S.els;
          hint.remove(); foot.remove();
        };
      },
      timelineFrame(base, S) {
        return (...args) => {
          base(...args);
          const { scene } = S, { wrap } = scene, u = S.ctx.util;
          const compact = S.ctx.size.width < 1260;
          if (compact) S.els.root.classList.add('gantt-compact');
          if (S.ctx.size.height < 800) {
            S.els.root.classList.add('gantt-short');
            scene.AXIS = 78; scene.ROW = 46; scene.axis.style.height = '78px';
          }
          scene.metaW = 184;
          scene.axisLabel.style.width = '184px';
          scene.axisLabel.querySelector('strong').textContent = 'Task';
          const index = u.el('aside', 'gantt-index', S.els.root);
          if (compact) index.classList.add('gantt-index-compact');
          u.el('h2', '', index, `Tasks (${S.active.length})`);
          const rows = u.el('div', 'gantt-index-rows', index);
          for (const it of S.active) {
            const row = u.el('div', 'gantt-index-row', rows);
            const dot = u.el('span', 'gantt-index-dot', row); dot.style.background = it.color;
            const text = u.el('div', 'gantt-index-copy', row);
            u.el('strong', '', text, it.title);
            u.el('span', 'gantt-index-team', text, it.team || it.owner);
            const duration = u.el('span', 'gantt-index-duration', text, `${it.duration} days`);
            const date = u.el('span', 'gantt-index-date', text);
            row.dataset.task = it.id;
          }
          wrap.style.width = '100%';
          scene.index = index;
        };
      },
      timelineRow(base, S) {
        return (...args) => {
          const row = base(...args);
          const it = args[0], title = row.querySelector('.pj-task-top');
          const dot = S.ctx.util.el('span', 'gantt-task-dot');
          dot.style.background = it.color; title.prepend(dot);
          row.querySelector('.pj-id').remove();
          row.querySelector('.pj-row-bottom .pj-avatar').remove();
          row.querySelector('.pj-row-bottom .pj-owner').remove();
          row.querySelector('.pj-chip').remove();
          return row;
        };
      },
      timelineCalendar(base, S) {
        return (...args) => {
          base(...args);
          const { scene } = S, u = S.ctx.util, dayW = (scene.wrap.clientWidth - scene.metaW) / scene.shownDays;
          scene.dayW = dayW;
          for (const node of scene.dates.children) {
            if (node.classList.contains('pj-month')) continue;
            const day = Number(node.textContent.match(/\d+/)?.[0]);
            if (!day) continue;
            node.style.left = `${(day - 1) * dayW}px`;
            if (node.classList.contains('pj-date')) node.style.width = `${dayW}px`;
            else if (node.classList.contains('pj-week')) node.style.width = `${Math.min(7, scene.shownDays - day + 1) * dayW}px`;
          }
          Object.values(scene.nodes).forEach((row) => row.lastElementChild.style.setProperty('--day', `${dayW}px`));
          scene.todayLine.style.left = `${scene.metaW + (S.todayDay - .5) * dayW}px`;
          scene.dates.querySelector('.pj-month').textContent = `${S.spec.month} ${S.spec.year || 2021}`;
          const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
          const mi = Math.max(0, months.indexOf(S.spec.month)), year = S.spec.year || 2021;
          const daysBefore = (y) => 365 * (y - 1) + Math.floor((y - 1) / 4) - Math.floor((y - 1) / 100) + Math.floor((y - 1) / 400);
          const monthDays = [31,year%4===0&&(year%100!==0||year%400===0)?29:28,31,30,31,30,31,31,30,31,30,31];
          for (const node of scene.dates.querySelectorAll('.pj-date')) {
            const day = Number(node.textContent.match(/\d+/)?.[0]);
            const offset = daysBefore(year) + monthDays.slice(0,mi).reduce((a,b)=>a+b,0) + day;
            const weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][(offset % 7)];
            u.el('span', 'gantt-weekday', node, weekday);
          }
        };
      },
      timelineRefresh(base, S) {
        return (...args) => {
          base(...args);
          const { scene, ctx, active, spec } = S;
          for (const it of active) {
            const row = scene.nodes[it.id];
            if (row) {
              row.style.display = '';
              scene.positions[it.id] = scene.AXIS + scene.PHASE + active.indexOf(it) * scene.ROW;
              row.style.top = `${scene.positions[it.id]}px`;
            }
          }
          for (const it of S.related) if (scene.nodes[it.id]) scene.nodes[it.id].style.display = 'none';
          scene.wrap.style.height = `${scene.AXIS + scene.PHASE + scene.ROW * active.length}px`;
          S.P.paint(ctx.model);
          for (const it of active) {
            const rec = scene.index.querySelector(`[data-task="${it.id}"]`);
            if (!rec) continue;
            const b = ctx.model.bars[it.id], start = `${spec.month.slice(0, 3)} ${b.start}`;
            rec.querySelector('.gantt-index-duration').textContent = `${b.duration} days`;
            rec.querySelector('.gantt-index-date').textContent = `${start} – ${spec.month.slice(0, 3)} ${b.start + b.duration - 1}`;
          }
        };
      },
      timelinePaint(base, S) {
        return (...args) => {
          base(...args);
          const { scene, ctx, spec, active } = S;
          for (const it of active) {
            const caption = scene.captions[it.id], b = ctx.model.bars[it.id];
            if (caption) caption.textContent = `${spec.month.slice(0, 3)} ${b.start} – ${spec.month.slice(0, 3)} ${b.start + b.duration - 1}`;
          }
        };
      },
    },
  },
});
