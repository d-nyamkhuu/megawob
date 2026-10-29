// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-gantt-resize-05',
  name: 'design',
  split: 'train',
  scenarios: ['gantt-resize'],
  template: 'use-project-board/workspace',
  design: {
    brand: 'Product Release Planner',
    workspaceLabel: 'Product Release Planner',
    statuses: ['Complete', 'In progress', 'In progress', 'In progress', 'In progress', 'At risk'],
    inset: 10,
    radius: 11,
    font: '15px/1.4 Arial, "Segoe UI", sans-serif',
    sidebarWidth: 158,
    compactSidebarWidth: 130,
    compactAt: 920,
    axisHeight: 80,
    rowHeight: 60,
    phaseHeight: 26,
    metaMin: 210,
    metaMax: 250,
    metaRatio: .22,
    boardHeadHeight: 52,
    laneTitleHeight: 30,
    laneMin: 86,
    cardMin: 48,
    cardMax: 80,
    cardInset: 34,
    cardGap: 7,
    parts: {
      toolbar(base, S) {
        return () => {
        base();
        const { tools, findBtn, filterBtn, groupBtn, today, zoomButtons } = S.els;
        const icons = {
          plus: '<rect x="2" y="2" width="20" height="20" rx="4" fill="#43a0ff" stroke="#258eff"/><path d="M12 5v14M5 12h14" stroke="white"/>',
          link: '<path d="M10 7l3-3a5 5 0 017 7l-3 3M14 17l-3 3a5 5 0 01-7-7l3-3M8 16l8-8"/>',
          diamond: '<path d="M12 2L22 12 12 22 2 12z" fill="#b5dcff" stroke="#1685ff"/>',
          trash: '<path d="M4 6h16M9 3h6l1 3M6 6l1 15h10l1-15M10 9v9m4-9v9"/>',
          fit: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
          in: '<circle cx="10" cy="10" r="7"/><path d="M15 15l7 7M6 10h8m-4-4v8"/>',
          out: '<circle cx="10" cy="10" r="7"/><path d="M15 15l7 7M6 10h8"/>'
        };
        const icon = (button, name) => {
          button.querySelector('svg')?.remove();
          const svg = S.ctx.util.svg('svg', {class:'pj-icon',viewBox:'0 0 24 24'}, button);
          svg.innerHTML = icons[name]; button.prepend(svg);
        };
        icon(findBtn, 'plus'); icon(filterBtn, 'link'); icon(groupBtn, 'diamond');
        const del = S.P.button(tools.querySelector('.pj-toolbar'), 'Delete', null, 'ref-delete');
        icon(del, 'trash'); tools.querySelector('.pj-zoom').before(del);
        del.onclick = () => S.P.drawer('Work item details');
        today.classList.add('ref-today');
        for (const [key, label, glyph] of [['Day','Fit Timeline','fit'], ['Week','Zoom In','in'], ['Month','Zoom Out','out']]) {
          zoomButtons[key].textContent = label; icon(zoomButtons[key], glyph);
        }
        };
      },
      body(base, S) {
        return () => {
        base();
        const u = S.ctx.util;
        const band = u.el('section', 'ref-project-band');
        S.els.body.before(band);
        const copy = u.el('div', 'ref-project-copy', band);
        u.el('h1', '', copy, 'Website 2.0 Release');
        u.el('p', '', copy, 'Plan and track work across teams to deliver the next major release.');
        const dates = u.el('div', 'ref-project-dates', copy);
        for (const [label, value] of [['Start', `${S.spec.month} 1, 2020`], ['Target Release', `${S.spec.month} ${S.spec.days}, 2020`]]) {
          const date = u.el('div', 'ref-project-date', dates);
          S.P.icon(date, 'calendar');
          const text = u.el('span', '', date); u.el('small', '', text, label); u.el('span', '', text, value);
        }
        const summary = document.querySelector('.ref-summary');
        if (summary) band.append(summary);
        const states = S.active.map(it => it.state);
        const values = [S.active.length, states.filter(s => s === 'In progress').length, states.filter(s => s === 'Complete').length, S.spec.scenario === 'milestone' ? S.active.length : 0];
        summary?.querySelectorAll('strong').forEach((el, i) => el.textContent = values[i]);
        const note = document.querySelector('.ref-instruction');
        if (note) { document.querySelector('.ref-task').append(note); copy.querySelector('p').remove(); }
        const panel = document.querySelector('.ref-panel');
        if (panel) copy.querySelector('p').remove();
        const toast = document.querySelector('.ref-note');
        if (toast) { S.els.main.before(toast); copy.querySelector('p').remove(); }
        };
      },
      timelineFrame(base, S) {
        return () => {
        base();
        const u = S.ctx.util;
        const board = u.el('aside', 'ref-delivery', S.els.body);
        const panel = document.querySelector('.ref-panel');
        // Keep the task note in its own paper column beside the workspace.
        u.el('h2', '', board, 'Project Summary');
        const states = S.active.map(it => it.state);
        const rows = [['Total Tasks', S.active.length], ['Completed', states.filter(x => x === 'Complete').length], ['In Progress', states.filter(x => x === 'In progress').length], ['Not Started', states.filter(x => x === 'Planned' || x === 'At risk').length]];
        const stats = u.el('section', 'ref-summary-stats', board);
        for (const [label, value] of rows) { const row = u.el('div', 'ref-stat-row', stats); u.el('span', '', row, label); u.el('strong', '', row, String(value)); }
        const info = u.el('section', 'ref-summary-duration', board);
        const span = 24;
        const duration = u.el('div', 'ref-stat-row', info); u.el('strong', '', duration, 'Project Duration'); u.el('b', '', duration, `${span} days`);
        u.el('p', '', info, 'Apr 22, 2010 – May 16, 2010');
        const team = u.el('section', 'ref-team', board); u.el('h3', '', team, 'Team Allocation');
        for (const [name, color, count] of [['Platform','#458bd2',2],['Internationalization','#59ad61',1],['Analytics','#edbd32',1],['Payments','#8c56ba',1],['Operations','#d6534d',1]]) { const row=u.el('div','ref-team-row',team); const dot=u.el('i','',row); dot.style.background=color; u.el('span','',row,name); u.el('b','',row,String(count)); }
        const milestones = u.el('section', 'ref-team ref-milestones', board); u.el('h3', '', milestones, 'Milestones');
        for (const [name,date] of [['Beta Release','May 10, 2010'],['General Availability','May 16, 2010']]) { const row=u.el('div','ref-milestone-row',milestones); u.el('i','',row); u.el('span','',row,name); u.el('b','',row,date); }
        S.scene.metaW = Math.max(300, Math.min(420, S.scene.wrap.clientWidth * .315));
        S.scene.axisLabel.style.width = `${S.scene.metaW}px`;
        S.scene.axisLabel.replaceChildren(); u.el('strong', '', S.scene.axisLabel, 'Task Name');
        const height = S.els.body.clientHeight - 44;
        S.scene.AXIS = Math.max(62, Math.min(84, height * .10));
        S.scene.PHASE = Math.max(32, Math.min(49, height * .058));
        S.scene.ROW = Math.max(48, (height - S.scene.AXIS - S.scene.PHASE) / (S.active.length + 3));
        for (const [key,value] of Object.entries({axis:S.scene.AXIS,row:S.scene.ROW,phase:S.scene.PHASE,meta:S.scene.metaW})) S.scene.wrap.style.setProperty(`--gantt-${key}`, `${value}px`);
        S.els.body.style.setProperty('--summary-height', `${S.els.body.clientHeight - 7}px`);
        S.scene.phase.replaceChildren(); u.el('strong', '', S.scene.phase, 'Project Rollups');
        S.scene.nextPhase.replaceChildren(); u.el('strong', '', S.scene.nextPhase, 'Upcoming Work');
        S.scene.rollups = ['Product Release', 'Core Platform', 'Reporting'].map((name, i) => {
          const row = u.el('div', `ref-rollup ref-rollup-${i}`, S.scene.wrap);
          const meta = u.el('div', 'ref-rollup-meta', row);
          u.el('span', 'ref-rollup-name', meta, i ? name : `▾  ${name}`);
          const start = u.el('span', 'ref-row-start', meta);
          const duration = u.el('span', 'ref-row-duration', meta);
          const grid = u.el('div', 'ref-rollup-grid', row);
          const bar = u.el('div', 'ref-rollup-bar', grid); u.el('i', 'ref-rollup-grip', bar);
          return {row, start, duration, bar, grid};
        });
        const fill = u.el('div', 'ref-grid-fill', S.scene.wrap);
        fill.style.left = `${S.scene.metaW}px`;
        S.scene.gridFill = fill;
        };
      },
      timelineRow(base, S) {
        return (it, index) => {
          const row = base(it, index);
          row.classList.toggle('ref-related', !!it.related);
          row.style.setProperty('--bar-color', ['#548bcb','#69ad64','#f0c33f','#9160bb','#df5852','#51b7c3'][index % 6]);
          row.firstElementChild.style.width = `${S.scene.metaW}px`;
          row._metaStart = S.ctx.util.el('span', 'ref-row-start', row.firstElementChild);
          row._metaDuration = S.ctx.util.el('span', 'ref-row-duration', row.firstElementChild);
          return row;
        };
      },
      timelineCalendar(base, S) {
        return () => {
        base();
        const sc = S.scene;
        sc.dayW = sc.dates.clientWidth / sc.shownDays;
        sc.dates.querySelector('.pj-month').textContent = `${S.spec.month} 2020`;
        sc.dates.querySelectorAll('.pj-date').forEach((el, i) => {
          el.style.left = `${i * sc.dayW}px`; el.style.width = `${sc.dayW}px`;
        });
        Object.values(sc.nodes).forEach(row => row.lastElementChild.style.setProperty('--day', `${sc.dayW}px`));
        sc.gridFill.style.setProperty('--day', `${sc.dayW}px`);
        sc.todayLine.style.left = `${sc.metaW + (S.todayDay - .5) * sc.dayW}px`;
        for (const rollup of sc.rollups) rollup.grid.style.setProperty('--day', `${sc.dayW}px`);
        };
      },
      timelineAt(base) {
        return (...args) => base(...args);
      },
      timelineRefresh(base, S) {
        return () => {
          base();
          const sc = S.scene;
          let y = sc.AXIS;
          for (const it of S.active) {
            if (sc.nodes[it.id].style.display === 'none') continue;
            sc.positions[it.id] = y; sc.nodes[it.id].style.top = `${y}px`; y += sc.ROW;
          }
          sc.phase.style.top = `${y}px`; y += sc.PHASE;
          for (const group of sc.rollups) { group.row.style.top = `${y}px`; y += sc.ROW; }
          y += 32;
          sc.nextPhase.style.display = ''; sc.nextPhase.style.top = `${y}px`; y += sc.PHASE;
          for (const it of S.related) { sc.positions[it.id] = y; sc.nodes[it.id].style.top = `${y}px`; y += sc.ROW; }
          sc.wrap.style.height = `${y}px`;
          S.P.paint(S.ctx.model);
        };
      },
      timelinePaint(base, S) {
        return m => {
          base(m);
          for (const it of [...S.active, ...S.related]) {
            const b = it.related ? it : m.bars[it.id];
            const bar = S.scene.bars[it.id];
            bar.classList.toggle('ref-muted-bar', it.state !== 'In progress' && it.state !== 'Complete');
            bar.classList.toggle('ref-complete-bar', it.state === 'Complete');
            bar.classList.toggle('ref-label-inside', b.duration * S.scene.dayW > 65);
            if (S.scene.captions[it.id]) S.scene.captions[it.id].textContent = `${b.duration} days`;
            const row = S.scene.nodes[it.id];
            if (row?._metaStart && Number.isFinite(b.start)) {
              row._metaStart.textContent = `${String(S.spec.month).slice(0,3)} ${String(Math.max(1,Math.floor(b.start))).padStart(2,'0')}, 2020`;
              row._metaDuration.textContent = `${b.duration} days`;
            }
          }
        };
      },
      footer(base, S) {
        return m => {
          base(m);
          const active = S.active.map(it => m.bars[it.id]);
          const first = Math.min(...active.map(b => b.start));
          const last = Math.max(...active.map(b => b.start + b.duration));
          const ranges = [[first,last],[first,Math.max(...active.slice(0,2).map(b=>b.start+b.duration))],[active[2].start,Math.max(...active.slice(2).map(b=>b.start+b.duration))]];
          S.scene.rollups.forEach((group,i) => {
            const [start,end] = ranges[i];
            group.start.textContent = `${S.spec.month.slice(0,3)} ${String(start).padStart(2,'0')}, 2020`;
            group.duration.textContent = `${end-start} days`;
            group.bar.style.left = `${(start-1)*S.scene.dayW}px`;
            group.bar.style.width = `${(end-start)*S.scene.dayW}px`;
          });
          const foot = S.els.foot;
          foot.firstElementChild.textContent = 'Timeline Summary';
          const bars = Object.values(m.bars);
          const work = bars.reduce((sum, b) => sum + b.duration, 0);
          const duration = Math.max(...bars.map(b => b.start + b.duration - 1)) - Math.min(...bars.map(b => b.start)) + 1;
          const values = [['Project Duration', `${duration} days`], ['Task Work', `${work} days`], ['Dependencies', String(m.edges.length)], ['Milestones', '0']];
          foot.replaceChildren(foot.firstElementChild);
          for (const [label, value] of values) {
            const metric = S.ctx.util.el('span', 'ref-footer-metric', foot, label);
            S.ctx.util.el('strong', '', metric, value);
          }
        };
      },
    },
  },
});
