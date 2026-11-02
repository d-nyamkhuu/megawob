// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-gantt-move-01',
  name: 'design',
  split: 'train',
  scenarios: ['gantt-move'],
  template: 'use-project-board/workspace',
  design: {
    inset: 0, radius: 0, axisHeight: 84, rowHeight: 56, phaseHeight: 0,
    metaMin: 258, metaMax: 258, metaRatio: .16,
    font: '16px/1.3 "Segoe UI", Tahoma, Arial, sans-serif',
    parts: {
      heading: (base, S) => () => {
        base();
        const u = S.ctx.util;
        const summary = u.el('div', 'planner-summary', S.els.main);
        u.el('strong', '', summary, 'Product Release Plan');
        u.el('span', '', summary, `${S.active.length} tasks　 │　 ${S.spec.month} 1, 2008 – ${S.spec.month} ${S.spec.month === 'June' ? 30 : 31}, 2008`);
      },
      timelineFrame: (base, S) => () => {
        base();
        const { axisLabel } = S.scene, u = S.ctx.util;
        axisLabel.replaceChildren();
        u.el('span', 'planner-id-heading', axisLabel, 'ID');
        u.el('span', '', axisLabel, 'Task Name');
      },
      timelineRow: (base, S) => (it, index) => {
        const row = base(it, index);
        row.classList.toggle('planner-related', !!it.related);
        row.querySelector('.pj-id').textContent = String(index + 1);
        const name = row.querySelector('.pj-name');
        name.onclick = () => {
          S.scene.selected = it;
          S.P.timelinePaint(S.ctx.model);
        };
        return row;
      },
      scheduleBar: (base, S) => (it, row) => {
        const result = base(it, row);
        const colors = ['#64b5f6', '#6abf65', '#ff9b39', '#9c7bdf', '#64b5f6', '#ff617e'];
        const outlines = ['#008bf2', '#209b23', '#f17900', '#643cc4', '#008bf2', '#d82343'];
        const i = S.active.findIndex(x => x.id === it.id);
        if (i >= 0) {
          result.bar.style.setProperty('--task', colors[i % colors.length]);
          result.bar.style.setProperty('--task-outline', outlines[i % outlines.length]);
          result.bar.addEventListener('pointerdown', () => { S.scene.selected = it; });
        }
        return result;
      },
      timelineCalendar: (base, S) => () => {
        const { scene: c, spec: s, ctx } = S, u = ctx.util;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = Math.max(0, months.indexOf(s.month)), year = 2008;
        const lengths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const shownDays = Math.max(s.days, lengths[month]);
        c.metaW = Math.max(205, Math.min(258, S.els.body.clientWidth * .158));
        c.axisLabel.style.width = `${c.metaW}px`;
        c.dayW = (S.els.body.clientWidth - c.metaW) / shownDays;
        c.shownDays = shownDays;
        c.dates.replaceChildren();
        u.el('div', 'pj-month', c.dates, `${s.month} ${year}`);
        const offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
        const y = month < 2 ? year - 1 : year;
        const first = (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + offsets[month] + 1) % 7;
        c.firstWeekday = first;
        const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let d = 1; d <= shownDays; d++) {
          const weekday = (first + d - 1) % 7;
          const el = u.el('div', `pj-date${weekday === 0 || weekday === 6 ? ' weekend' : ''}`, c.dates);
          u.el('span', '', el, names[weekday]);
          u.el('span', '', el, String(d));
          el.style.left = `${(d - 1) * c.dayW}px`;
          el.style.width = `${c.dayW}px`;
          el.title = `${s.month} ${d}`;
        }
        const backgrounds = [];
        for (let d = 1; d <= shownDays; d++) {
          const weekday = (first + d - 1) % 7;
          if (weekday === 0 || weekday === 6) backgrounds.push(`linear-gradient(to right, transparent ${(d - 1) * c.dayW}px, #edf3f7 ${(d - 1) * c.dayW}px, #edf3f7 ${d * c.dayW}px, transparent ${d * c.dayW}px)`);
        }
        for (const row of Object.values(c.nodes)) {
          row.firstElementChild.style.width = `${c.metaW}px`;
          row.lastElementChild.style.setProperty('--day', `${c.dayW}px`);
          row.lastElementChild.style.backgroundImage = `repeating-linear-gradient(to right, transparent 0, transparent ${c.dayW - 1}px, #d8e3ed ${c.dayW - 1}px, #d8e3ed ${c.dayW}px), ${backgrounds.join(', ')}`;
        }
      },
      timelinePaint: (base, S) => m => {
        base(m);
        const c = S.scene, u = S.ctx.util;
        // The release chain is visual context; actual dependency hit targets remain untouched.
        if (!m.edges.length) {
          for (let i = 1; i < S.active.length; i++) {
            const a = S.P.timelineAt(S.active[i - 1].id, 'out', m);
            const b = S.P.timelineAt(S.active[i].id, 'in', m);
            const mid = a[0] + 16;
            u.svg('path', { class: 'pj-link planner-chain', d: `M${a} H${mid} V${b[1]} H${b[0]}` }, c.edgesG);
            u.svg('path', { class: 'planner-arrowhead', d: `M${b[0] - 8},${b[1] - 5} l8,5 -8,5 z` }, c.edgesG);
          }
        }
        const it = c.selected || S.active[1] || S.active[0], b = it.related ? it : m.bars[it.id];
        const fields = document.querySelectorAll('.planner-property input');
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = day => `${weekdays[(c.firstWeekday + day - 1) % 7]}  ${S.spec.month.slice(0, 3)} ${day}, 2008`;
        const prev = S.active[S.active.indexOf(it) - 1];
        const number = it.related ? S.active.length + S.related.indexOf(it) + 1 : S.active.indexOf(it) + 1;
        const values = [String(number), it.title, date(b.start), `${b.duration} days`, date(b.start + b.duration - 1), prev ? `${S.active.indexOf(it)}  ${prev.title}` : 'None', it.owner, it.state, '0%'];
        fields.forEach((field, i) => { field.value = values[i] || ''; });
      },
      rendered: (base, S) => ctx => {
        base(ctx);
        S.els.main.querySelector('.planner-summary').appendChild(S.els.clearBtn);
        S.els.root.addEventListener('planner-layout', () => {
          S.P.refreshView();
          S.ctx.reanchor();
        });
      },
      drawer: (base, S) => (kind, it) => {
        if (!it) return base(kind, it);
        S.scene.selected = it;
        S.P.timelinePaint(S.ctx.model);
      },
    },
  },
});
