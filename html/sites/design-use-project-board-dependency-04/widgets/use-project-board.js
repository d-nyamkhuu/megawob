// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-dependency-04',
  name: 'design',
  split: 'train',
  scenarios: ['dependency'],
  template: 'use-project-board/workspace',
  design: {
    inset: 0, radius: 0, axisHeight: 66, rowHeight: 52, phaseHeight: 0,
    metaMin: 205, metaMax: 340, metaRatio: .205,
    font: '22px/1.2 Georgia, "Times New Roman", serif',
    statuses: ['In progress', 'In progress', 'Complete', 'Planned', 'Planned', 'Complete'],
    parts: {
      toolbar(base, S) {
        return () => {
          base();
          // The existing recovery target stays available when a detail drawer is open.
          document.querySelector('.gtk-toolbar').append(S.els.clearBtn);
        };
      },
      heading(base, S) {
        return () => {
        base();
        const u = S.ctx.util;
        const head = u.el('div', 'lib-schedule-head', S.els.main);
        u.el('h2', '', head, 'Release Timeline');
        S.els.libraryCounts = u.el('div', 'lib-counts', head);
        };
      },
      body(base, S) {
        return () => {
        base();
        const u = S.ctx.util;
        const board = u.el('section', 'lib-delivery', S.els.main);
        u.el('h2', 'lib-section-title', board, 'Delivery Board');
        S.els.libraryBoard = u.el('div', 'lib-columns', board);
        };
      },
      frame(base, S) {
        return (ctx) => {
        const root = base(ctx);
        root.style.setProperty('--lib-scale', Math.min(1, S.ctx.size.width / 1654, S.ctx.size.height / 780));
        return root;
        };
      },
      timelineFrame(base, S) {
        return () => {
        base();
        const g = S.scene, u = S.ctx.util;
        g.AXIS = Math.max(44, Math.min(66, S.els.body.clientHeight * .16));
        g.ROW = Math.max(18, (S.els.body.clientHeight - g.AXIS - 34) / S.active.length);
        g.scrollLead = 96;
        g.wrap.style.paddingTop = `${g.scrollLead}px`;
        g.axis.style.height = `${g.AXIS}px`;
        g.axisLabel.replaceChildren();
        u.el('div', 'lib-row-number', g.axisLabel, '#');
        u.el('div', 'lib-task-label', g.axisLabel, 'Task');
        g.tail = u.el('div', 'lib-grid-tail', g.wrap);
        g.tail.style.left = `${g.metaW}px`;
        g.phase.hidden = true; g.nextPhase.hidden = true; g.todayLine.hidden = true;
        };
      },
      timelineRow(base, S) {
        return (it, index) => {
          const row = base(it, index);
          const meta = row.firstElementChild;
          meta.replaceChildren();
          S.ctx.util.el('div', 'lib-row-number', meta, String(index + 1));
          const name = S.ctx.util.el('button', 'lib-task-label', meta, it.title);
          name.type = 'button'; name.onclick = () => S.P.drawer('Work item details', it);
          S.scene.datesText[it.id] = S.ctx.util.el('span', 'lib-unused-date', meta);
          return row;
        };
      },
      scheduleBar(base, S) {
        return (it, row) => {
          const result = base(it, row);
          if (!it.related) {
            const colors = ['#3885ed', '#55a75c', '#a37ce5', '#ee9844', '#e45555', '#f3ca0d'];
            result.bar.style.setProperty('--task', colors[S.active.findIndex(a => a.id === it.id) % colors.length]);
          }
          return result;
        };
      },
      timelineCalendar(base, S) {
        return () => {
        base();
        const { dates, dayW, shownDays } = S.scene, u = S.ctx.util;
        dates.replaceChildren();
        u.el('div', 'lib-month', dates, S.spec.month + (S.spec.year ? ` ${S.spec.year}` : ''));
        const step = shownDays > 35 ? 7 : shownDays > 24 ? 4 : 3;
        for (let d = 1; d <= shownDays; d += step) {
          const tick = u.el('div', 'lib-week', dates, String(d));
          tick.style.left = `${(d - 1) * dayW}px`;
          tick.style.width = `${Math.min(step, shownDays - d + 1) * dayW}px`;
        }
        dates.style.setProperty('--lib-tick', `${dayW * step}px`);
        S.scene.tail.style.setProperty('--day', `${dayW}px`);
        };
      },
      timelineRefresh(base, S) {
        return () => {
        S.P.timelineCalendar();
        const g = S.scene;
        S.related.forEach(it => { g.nodes[it.id].style.display = 'none'; });
        S.active.forEach((it, i) => {
          g.positions[it.id] = g.AXIS + i * g.ROW + g.scrollLead;
          Object.assign(g.nodes[it.id].style, { display: '', top: `${g.positions[it.id]}px`, height: `${g.ROW}px` });
        });
        g.wrap.style.height = `${g.AXIS + S.active.length * g.ROW + 34 + g.scrollLead}px`;
        S.els.body.scrollTop = g.scrollLead;
        S.P.paint(S.ctx.model);
        };
      },
      footer(base, S) {
        return (m) => {
          base(m);
          const u = S.ctx.util, counts = S.els.libraryCounts;
          counts.replaceChildren();
          const milestones = S.active.filter(it => m.bars[it.id].duration === 0).length;
          const teams = new Set(S.active.map(it => it.team || it.lane || it.owner)).size;
          for (const [label, value] of [['Tasks', S.active.length], ['Milestones', milestones], ['Dependencies', m.edges.length], ['Teams', teams]]) {
            const fact = u.el('div', 'lib-fact', counts);
            u.el('b', '', fact, label); u.el('span', '', fact, String(value));
          }
          const duration = u.el('div', 'lib-fact lib-duration', counts);
          u.el('b', '', duration, 'Duration');
          u.el('span', '', duration, `${env.taskDef.helpers.date(S.spec, 1)} – ${env.taskDef.helpers.date(S.spec, S.spec.days)}`);
          const board = S.els.libraryBoard;
          board.replaceChildren();
          const groups = [
            ['To Do', S.active.filter(it => it.state !== 'In progress' && it.state !== 'Complete')],
            ['In Progress', S.active.filter(it => it.state === 'In progress')],
            ['Done', S.active.filter(it => it.state === 'Complete')],
          ];
          groups.forEach(([label, items], index) => {
            const column = u.el('section', `lib-column lib-column-${index}`, board);
            const heading = u.el('div', 'lib-column-head', column);
            u.el('b', '', heading, `${label} (${items.length})`);
            u.el('span', '', heading, `WIP  ${items.length} / 3`);
            const list = u.el('div', 'lib-card-list', column);
            items.forEach(it => {
              const card = u.el('button', 'lib-card', list);
              card.type = 'button'; card.onclick = () => S.P.drawer('Work item details', it);
              card.style.setProperty('--task', S.scene.bars[it.id].style.getPropertyValue('--task'));
              u.el('b', '', card, it.title);
              const b = m.bars[it.id];
              u.el('div', '', card, `${it.team || it.owner} • ${env.taskDef.helpers.date(S.spec, b.start)}${b.duration ? ` – ${env.taskDef.helpers.date(S.spec, b.start + b.duration - 1)}` : ''}`);
            });
          });
        };
      },
    },
  },
});
