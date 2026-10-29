// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-gantt-move-04',
  name: 'design',
  split: 'train',
  scenarios: ['gantt-move'],
  template: 'use-project-board/workspace',
  design: {
    inset: 0,
    radius: 0,
    font: '20px/1.35 Arial, Helvetica, sans-serif',
    metaMin: 120,
    metaMax: 205,
    metaRatio: .168,
    parts: {
      frame: (base, S) => (ctx) => {
        const root = base(ctx);
        root.classList.add('planner-workspace');
        return root;
      },
      timelineFrame: (base, S) => () => {
        base();
        const g = S.scene;
        g.AXIS = Math.round(108 * Math.min(1, S.ctx.size.width / 1210));
        g.PHASE = 0;
        g.ROW = (S.els.body.clientHeight - g.AXIS) / S.active.length;
        g.wrap.style.setProperty('--axis-height', `${g.AXIS}px`);
        g.wrap.style.setProperty('--row-height', `${g.ROW}px`);
        g.axisLabel.replaceChildren();
        S.ctx.util.el('strong', '', g.axisLabel, 'Task');
      },
      timelineRow: (base, S) => (it, index) => {
        const row = base(it, index);
        if (it.related) row.classList.add('planner-related');
        else {
          row.classList.add('planner-task-row');
          const owner = row.querySelector('.pj-owner');
          owner.textContent = it.team || it.lane || it.owner;
        }
        return row;
      },
      scheduleBar: (base, S) => (it, row) => {
        const result = base(it, row);
        if (!it.related) {
          const colors = ['#348fed', '#5cb876', '#ff9948', '#9e7cde', '#df5360', '#edc444'];
          result.bar.style.setProperty('--task', colors[S.active.findIndex(a => a.id === it.id) % colors.length]);
        }
        return result;
      },
      timelineCalendar: (base, S) => () => {
        base();
        const { dates } = S.scene;
        const year = S.spec.year || 2002;
        dates.querySelector('.pj-month').textContent = `${S.spec.month} ${year}`;
        dates.querySelectorAll('.pj-week').forEach(el => el.remove());
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const month = Math.max(1, months.indexOf(S.spec.month) + 1);
        const offsets = [0,3,2,5,0,3,5,1,4,6,2,4];
        const y = year - (month < 3 ? 1 : 0);
        const first = (y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) + offsets[month-1] + 1) % 7;
        const weekends = [];
        dates.querySelectorAll('.pj-date').forEach((el, i) => {
          const weekday = (first + i) % 7;
          el.classList.remove('today');
          el.classList.toggle('weekend', weekday === 0 || weekday === 6);
          el.replaceChildren();
          S.ctx.util.el('span', '', el, String(i + 1));
          S.ctx.util.el('span', '', el, ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][weekday]);
          if (weekday === 0 || weekday === 6) weekends.push(`linear-gradient(to right,transparent ${i*S.scene.dayW}px,#e6eff7 ${i*S.scene.dayW}px,#e6eff7 ${(i+1)*S.scene.dayW}px,transparent ${(i+1)*S.scene.dayW}px)`);
        });
        Object.values(S.scene.nodes).forEach(row => row.lastElementChild.style.setProperty('--weekends', weekends.join(',') || 'linear-gradient(transparent,transparent)'));
      },
      timelineRefresh: (base, S) => () => {
        base();
        const g = S.scene;
        g.phase.style.display = 'none';
        g.nextPhase.style.display = 'none';
        for (const it of S.related) g.nodes[it.id].style.display = 'none';
        S.active.forEach((it, i) => {
          g.nodes[it.id].style.display = '';
          g.positions[it.id] = g.AXIS + i * g.ROW;
          g.nodes[it.id].style.top = `${g.positions[it.id]}px`;
        });
        g.wrap.style.height = `${g.AXIS + S.active.length * g.ROW}px`;
        S.P.paint(S.ctx.model);
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        S.els.root.addEventListener('planner-layout', () => {
          const g = S.scene;
          g.ROW = (S.els.body.clientHeight - g.AXIS) / S.active.length;
          g.wrap.style.setProperty('--row-height', `${g.ROW}px`);
          S.P.refreshView();
          ctx.reanchor();
        });
      },
      footer: (base, S) => (m) => {
        const { util } = S.ctx;
        const foot = S.els.foot;
        foot.replaceChildren();
        const bars = S.active.map(it => m.bars[it.id]);
        const start = Math.min(...bars.map(b => b.start));
        const end = Math.max(...bars.map(b => b.start + b.duration));
        const year = S.spec.year || 2002;
        const month = S.spec.month.slice(0,3);
        for (const text of [`Tasks: ${S.active.length}`, `Milestones: ${bars.filter(b => b.duration === 0).length}`, `Total Duration: ${end-start} days`, `Project Window: ${month} 1, ${year} – ${month} ${S.spec.days}, ${year}`]) util.el('span', '', foot, text);
      },
    },
  },
});
