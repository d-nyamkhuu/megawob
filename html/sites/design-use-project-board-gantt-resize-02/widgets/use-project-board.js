// Presentation helpers only; task data and gestures stay in the shared workspace.
const releaseTeams = ['Platform', 'Product', 'Support', 'Data', 'Design', 'Milestone'];
const releaseColors = ['#0788ff', '#8a3ffc', '#2ac553', '#ff9500', '#ff5053', '#8b9092'];
const releaseTeam = (it, i) => it.team || releaseTeams[i % releaseTeams.length];
const releaseColor = (i) => releaseColors[i % releaseColors.length];
function releaseDate(S, day) {
  return `${S.spec.month.slice(0, 3)} ${day}, ${S.spec.year || 2021}`;
}
function releaseInspector(S, it) {
  const u = S.ctx.util, side = S.els.sidebar;
  side.querySelector('.release-properties')?.remove();
  const panel = u.el('div', 'release-properties', side);
  const i = S.active.findIndex((x) => x.id === it.id), b = S.ctx.model.bars[it.id];
  const fields = u.el('div', 'release-fields', panel);
  for (const [label, value] of [['Name', it.title], ['Team', releaseTeam(it, i)], ['Status', it.state],
    ['Start date', releaseDate(S, b.start)], ['Duration', `${b.duration} days`], ['End date', releaseDate(S, b.start + b.duration - 1)]]) {
    u.el('span', 'release-field-label', fields, label);
    const v = u.el('span', `release-field-value field-${label.toLowerCase().replace(' ', '-')}`, fields);
    if (label === 'Team') { const dot = u.el('i', 'release-dot', v); dot.style.background = releaseColor(i); }
    u.el('span', label === 'Status' ? 'release-status' : '', v, value);
  }
  const description = u.el('section', 'release-description', panel);
  u.el('h3', '', description, 'Description');
  u.el('p', '', description, it.description || `Plan ${it.title.toLowerCase()} and coordinate delivery with the ${releaseTeam(it, i).toLowerCase()} team.`);
  const deps = u.el('section', 'release-dependencies', panel);
  u.el('h3', '', deps, 'Dependencies');
  const predecessors = S.ctx.model.edges.filter((edge) => edge[1] === it.id).map((edge) => S.active.find((x) => x.id === edge[0])?.title).filter(Boolean);
  u.el('p', '', deps, predecessors.join(', ') || 'None');
  const tags = u.el('section', 'release-tags', panel); u.el('h3', '', tags, 'Tags');
  for (const tag of [releaseTeam(it, i).toLowerCase(), 'documentation']) u.el('span', 'release-tag', tags, tag);
}
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-gantt-resize-02',
  name: 'design',
  split: 'train',
  scenarios: ['gantt-resize'],
  template: 'use-project-board/workspace',
  design: {
    brand: 'Product Release Planner',
    workspaceLabel: 'Product Release Planner',
    inset: 8,
    radius: 3,
    font: '18px/1.35 Arial, "Segoe UI", sans-serif',
    sidebarWidth: 350,
    compactSidebarWidth: 280,
    compactAt: 1120,
    axisHeight: 70,
    rowHeight: 51,
    phaseHeight: 24,
    metaMin: 290,
    metaMax: 335,
    metaRatio: .265,
    boardHeadHeight: 42,
    laneTitleHeight: 32,
    laneMin: 90,
    cardMin: 50,
    cardMax: 74,
    cardInset: 14,
    cardGap: 8,
    parts: {
      frame: (base, S) => (ctx) => {
        S.inspectedItem = null;
        return base(ctx);
      },
      heading: (base, S) => () => {
        base();
        const u = S.ctx.util, head = S.els.main.querySelector('.pj-head');
        const summary = u.el('div', 'release-summary', head);
        for (const [key, label] of [['tasks', 'Tasks'], ['milestones', 'Milestone'], ['days', 'Total days']]) {
          const stat = u.el('div', 'release-stat', summary);
          u.el('strong', `release-total-${key}`, stat); u.el('span', '', stat, label);
        }
        u.el('div', 'release-range', summary, `${releaseDate(S, 1)} – ${releaseDate(S, S.spec.days)}`);
        const note = document.querySelector('.ref-instruction');
        if (note) head.appendChild(note);
        const toast = document.querySelector('.ref-note');
        if (toast) u.el('div', 'release-toast-row', head).appendChild(toast);
      },
      toolbar: (base, S) => () => {
        base();
        S.els.clearBtn.classList.add('release-reset');
        S.els.main.querySelector('.pj-head').appendChild(S.els.clearBtn);
      },
      timelineFrame: (base, S) => () => {
        base();
        const u = S.ctx.util, label = S.scene.axisLabel;
        label.replaceChildren();
        for (const text of ['#', 'Task', 'Team']) u.el('strong', '', label, text);
      },
      timelineRow: (base, S) => (it, index) => {
        const row = base(it, index);
        if (it.related) return row;
        const u = S.ctx.util, meta = row.querySelector('.pj-meta');
        meta.classList.add('release-meta');
        const id = row.querySelector('.pj-id'); id.textContent = String(index + 1);
        const team = u.el('div', 'release-row-team', meta);
        const dot = u.el('i', 'release-dot', team); dot.style.background = releaseColor(index);
        u.el('span', '', team, releaseTeam(it, index));
        row.querySelector('.pj-name').addEventListener('click', () => { S.inspectedItem = it; releaseInspector(S, it); });
        return row;
      },
      scheduleBar: (base, S) => (it, row) => {
        const result = base(it, row);
        if (!it.related) result.bar.style.setProperty('--task', releaseColor(S.active.findIndex((x) => x.id === it.id)));
        return result;
      },
      timelineCalendar: (base, S) => () => {
        base();
        S.scene.dates.querySelector('.pj-month').textContent = `${S.spec.month.slice(0, 3)} ${S.spec.year || 2021}`;
      },
      timelineRefresh: (base, S) => () => {
        S.P.timelineCalendar();
        const scene = S.scene;
        scene.AXIS = Math.round(Math.min(70, Math.max(50, S.ctx.size.height * .0813)));
        const barHeight = scene.bars[S.active[0].id].getBoundingClientRect().height;
        const height = Math.max(Math.round(S.els.body.clientHeight * .512), scene.AXIS + (barHeight + 2) * S.active.length + 16);
        scene.ROW = (height - scene.AXIS - 16) / S.active.length;
        scene.PHASE = 0;
        S.els.root.style.setProperty('--release-axis', `${scene.AXIS}px`);
        S.els.root.style.setProperty('--release-row', `${scene.ROW}px`);
        S.els.root.style.setProperty('--release-timeline-height', `${height}px`);
        scene.phase.style.display = 'none'; scene.nextPhase.style.display = 'none';
        // Related records remain sampled and registered, but this overview shows the current release.
        S.related.forEach((it) => { scene.nodes[it.id].style.display = 'none'; scene.positions[it.id] = scene.AXIS; });
        let ordered = [...S.active];
        if (S.grouping === 'Assignee') ordered.sort((a, b) => a.owner.localeCompare(b.owner, 'en'));
        let visible = 0;
        ordered.forEach((it) => {
          const show = S.filter === 'All work' || (S.filter === 'Completed work' ? it.state === 'Complete' : it.state !== 'Complete');
          scene.nodes[it.id].style.display = show ? '' : 'none';
          scene.positions[it.id] = scene.AXIS + visible * scene.ROW;
          scene.nodes[it.id].style.top = `${scene.positions[it.id]}px`;
          if (show) visible++;
        });
        S.P.paint(S.ctx.model);
      },
      timelineMirror: (base, S) => () => {
        // This overview has compact rows and no phase strip or extra scroll gutter.
        // Report the actual visible bar bounds in the pane's content coordinates.
        const body = S.els.body, scene = S.scene;
        const origin = body.getBoundingClientRect().top - body.scrollTop;
        const rows = {};
        for (const { id } of S.active) {
          const rect = scene.bars[id].getBoundingClientRect();
          rows[id] = [rect.top - origin, rect.bottom - origin];
        }
        for (const [key, point] of Object.entries(scene.edgePoints)) rows[`edge:${key}`] = [point[1] - 10, point[1] + 10];
        const view = {
          top: scene.axis.getBoundingClientRect().bottom - origin,
          bottom: scene.wrap.getBoundingClientRect().top - origin + scene.wrap.clientHeight,
          rows, reset: S.P.currentViewReset(),
        };
        if (JSON.stringify(S.ctx.model.view) !== JSON.stringify(view)) S.ctx.update({ ...S.ctx.model, view });
      },
      timelinePaint: (base, S) => (m) => {
        base(m);
        for (const it of S.active) if (S.scene.captions[it.id]) S.scene.captions[it.id].textContent = `${m.bars[it.id].duration} days`;
        const root = S.els.root;
        root.querySelector('.release-total-tasks').textContent = S.active.length;
        root.querySelector('.release-total-milestones').textContent = S.active.filter((it) => m.bars[it.id].duration === 0).length;
        root.querySelector('.release-total-days').textContent = S.active.reduce((total, it) => total + m.bars[it.id].duration, 0);
        root.querySelectorAll('.release-card-duration').forEach((el) => { el.textContent = `${m.bars[el.dataset.item].duration} days`; });
        if (S.inspectedItem) releaseInspector(S, S.inspectedItem);
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const u = ctx.util;
        S.inspectedItem = S.active[Math.min(2, S.active.length - 1)];
        releaseInspector(S, S.inspectedItem);
        const board = u.el('section', 'release-board', S.els.body);
        u.el('h2', '', board, 'Delivery Board');
        const columns = u.el('div', 'release-columns', board);
        const assignments = [2, 1, 1, 0, 0, 3];
        for (const [c, title] of ['To Do', 'In Progress', 'Review', 'Done'].entries()) {
          const col = u.el('div', `release-column release-column-${c}`, columns);
          const items = S.active.filter((it, i) => assignments[i % assignments.length] === c);
          if (c === 1) items.reverse();
          const heading = u.el('div', 'release-column-heading', col);
          u.el('strong', '', heading, title); u.el('span', '', heading, `${items.length} / 3`); u.el('span', 'release-more', heading, '•••');
          for (const it of items) {
            const i = S.active.indexOf(it), card = u.el('button', 'release-card', col); card.type = 'button';
            const top = u.el('div', 'release-card-title', card); u.el('strong', '', top, it.title); u.el('span', 'release-card-more', top, '⋮');
            const bottom = u.el('div', 'release-card-bottom', card);
            const dot = u.el('i', 'release-dot', bottom); dot.style.background = releaseColor(i);
            u.el('span', '', bottom, releaseTeam(it, i));
            const duration = u.el('span', 'release-card-duration', bottom, `${ctx.model.bars[it.id].duration} days`); duration.dataset.item = it.id;
            card.onclick = () => { S.inspectedItem = it; releaseInspector(S, it); };
          }
        }
        document.documentElement.style.setProperty('--release-banner-top', `${S.els.main.querySelector('.pj-head').getBoundingClientRect().bottom}px`);
      },
    },
  },
});
