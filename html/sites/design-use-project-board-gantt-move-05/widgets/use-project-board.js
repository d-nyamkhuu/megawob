// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-gantt-move-05',
  name: 'design',
  split: 'train',
  scenarios: ['gantt-move'],
  template: 'use-project-board/workspace',
  design: {
    inset: 0, radius: 0, axisHeight: 98, rowHeight: 49, phaseHeight: 44,
    metaMin: 170, metaMax: 188, metaRatio: .14,
    font: '16px/1.3 "Segoe UI", Tahoma, Arial, sans-serif',
    parts: {
      heading: (base, S) => () => {
        base();
        const u = S.ctx.util;
        const summary = u.el('div', 'planner-summary', S.els.main);
        u.el('strong', '', summary, 'Product Release Plan');
        const roll = u.el('span', 'planner-rollups', summary);
        for (const [n, d] of [['Feature Freeze', 18], ['Beta Release', 25], ['General Release', 31]]) {
          const m = u.el('span', 'planner-roll', roll);
          u.el('i', '', m);
          u.el('b', '', m, n);
          u.el('em', '', m, `${S.spec.month.slice(0, 3)} ${d}`);
        }
      },
      timelineFrame: (base, S) => () => {
        base();
        const { axisLabel } = S.scene, u = S.ctx.util;
        axisLabel.replaceChildren();
        u.el('span', 'planner-id-heading', axisLabel, 'ID');
        u.el('span', '', axisLabel, 'Task');
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
        const colors = ['#8fb8e3', '#8cbc85', '#f1a96e', '#ab9ee0', '#8fb8e3', '#e5879a'];
        const outlines = ['#6f9fcd', '#6f9f68', '#d98a4e', '#8b7cc6', '#6f9fcd', '#c8677b'];
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
        const month = Math.max(0, months.indexOf(s.month)), year = 2023;
        const lengths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const shownDays = Math.max(s.days, lengths[month]);
        c.metaW = Math.max(155, Math.min(188, S.els.body.clientWidth * .14));
        c.axisLabel.style.width = `${c.metaW}px`;
        c.dayW = (S.els.body.clientWidth - c.metaW) / Math.max(s.days, 23);
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
          u.el('span', '', el, `${s.month.slice(0, 3)} ${d}`);
          el.style.left = `${(d - 1) * c.dayW}px`;
          el.style.width = `${c.dayW}px`;
          el.dataset.day = String(d);
          el.title = `${s.month} ${d}`;
        }
        const backgrounds = [];
        for (let d = 1; d <= shownDays; d++) {
          const weekday = (first + d - 1) % 7;
          if (weekday === 0 || weekday === 6) backgrounds.push(`linear-gradient(to right, transparent ${(d - 1) * c.dayW}px, transparent ${(d - 1) * c.dayW}px, transparent ${d * c.dayW}px, transparent ${d * c.dayW}px)`);
        }
        for (const row of Object.values(c.nodes)) {
          row.firstElementChild.style.width = `${c.metaW}px`;
          row.lastElementChild.style.setProperty('--day', `${c.dayW}px`);
          row.lastElementChild.style.backgroundImage = `repeating-linear-gradient(to right, transparent 0, transparent ${c.dayW - 1}px, #e8e1cc ${c.dayW - 1}px, #e8e1cc ${c.dayW}px), ${backgrounds.join(', ')}`;
        }
      },
      timelineRefresh: (base, S) => () => {
        base();
        const c = S.scene, u = S.ctx.util;
        c.wrap.querySelectorAll('.planner-team-band').forEach(el => el.remove());
        const titles = ['Platform', 'Product', 'Design', 'Operations'];
        const colors = ['#7fb3de', '#78ad7e', '#f5a361', '#aa97d0'];
        let y = c.AXIS;
        const place = (item, group) => {
          const row = c.nodes[item.id];
          if (!row || row.style.display === 'none') return;
          c.positions[item.id] = y;
          row.style.top = `${y}px`;
          row.dataset.visualTeam = String(group);
          row.style.setProperty('--task', colors[group % 4]);
          y += c.ROW;
        };
        titles.forEach((title, i) => {
          const phase = i === 0 ? c.phase : u.el('div', 'pj-phase planner-team-band', c.wrap);
          phase.style.top = `${y}px`;
          phase.style.background = ['#e8ecdf', '#e8ecdf', '#faead4', '#e7e0ef'][i];
          phase.replaceChildren();
          const arrow = u.el('span', 'planner-group-chevron', phase, '');
          arrow.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m2 5 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
          u.el('span', '', phase, title);
          y += c.PHASE;
          S.active.forEach((item, index) => {
            if (Math.min(3, Math.floor(index * 4 / S.active.length)) === i) place(item, i);
          });
        });
        const related = u.el('div', 'pj-phase planner-team-band', c.wrap, 'Related work');
        related.style.top = `${y}px`;
        y += c.PHASE;
        S.related.forEach((item, i) => place(item, Math.floor(i / 4)));
        c.wrap.style.height = `${y}px`;
        S.P.timelinePaint(S.ctx.model);
        S.P.timelineMirror();
      },
      timelinePaint: (base, S) => m => {
        base(m);
        const c = S.scene;
        const colors = ['#7fb3de', '#78ad7e', '#f5a361', '#aa97d0'];
        for (const row of Object.values(c.nodes)) {
          const item = S.active.find(x => c.nodes[x.id] === row) || S.related.find(x => c.nodes[x.id] === row);
          if (!item) continue;
          const b = item.related ? item : m.bars[item.id];
          if (!b) continue;
          const bar = row.querySelector('.pj-bar');
          if (!bar) continue;
          const group = Number(row.dataset.visualTeam || 0);
          bar.style.setProperty('--task', colors[group]);
          const label = bar.querySelector('.pj-bar-label');
          if (label) {
            const end = b.start + b.duration - 1;
            const width = b.duration * c.dayW;
            const full = `${S.spec.month.slice(0, 3)} ${b.start} – ${S.spec.month.slice(0, 3)} ${end}`;
            label.textContent = width < 85 ? `${b.start} – ${end}` : full;
            label.style.fontSize = `${Math.min(17, Math.max(11, (width - 18) / (label.textContent.length * .49)))}px`;
            label.style.paddingLeft = width < 150 ? '8px' : '17px';
            bar.title = full;
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
