/* use-project-board/_timeline: Timeline rows, schedule bars, dependency ports and pointer gestures.
 * install(BASE, W) retains the workspace's design parts; W is its live per-page state. */
(function () {
  'use strict';
  function install(BASE, W) {
    BASE.timelineFrame = () => {
      const AXIS = W.D.axisHeight, ROW = W.D.rowHeight, PHASE = W.D.phaseHeight;
      const wrap = W.u.el('div', 'pj-timeline', W.body);
      const metaW = Math.max(W.D.metaMin, Math.min(W.D.metaMax, W.body.clientWidth * W.D.metaRatio));
      let dayW, shownDays;
      const positions = {}, nodes = {}, bars = {}, datesText = {}, ports = {}, captions = {};
      const axis = W.u.el('div', 'pj-axis', wrap), axisLabel = W.u.el('div', 'pj-axis-label', axis);
      axisLabel.style.width = `${metaW}px`;
      W.u.el('strong', '', axisLabel, W.s.scenario === 'milestone' ? 'Milestone plan' : 'Work item / Assignee');
      W.u.el('span', '', axisLabel, 'Status / Start / Duration');
      const dates = W.u.el('div', 'pj-dates', axis);
      const todayLine = W.u.el('div', 'pj-today', wrap);
      const phase = W.u.el('div', 'pj-phase', wrap); W.P.icon(phase, 'down'); W.u.el('span', '', phase, 'Current release / Delivery plan');
      const nextPhase = W.u.el('div', 'pj-phase', wrap); W.P.icon(nextPhase, 'down'); W.u.el('span', '', nextPhase, 'Operations / Upcoming work');
      const lineLayer = W.u.svg('svg', { class: 'pj-edges' }, wrap), edgesG = W.u.svg('g', {}, lineLayer);
      const rubber = W.u.svg('path', { class: 'pj-rubber' }, lineLayer);
      let edgePoints = {};

      W.scene = { AXIS, ROW, PHASE, wrap, metaW, positions, nodes, bars, datesText, ports, captions,
        axis, axisLabel, dates, todayLine, phase, nextPhase, lineLayer, edgesG, rubber, edgePoints,
        dayW, shownDays };
    };

    BASE.timelineRow = (it, index) => {
      const { wrap, nodes, metaW, datesText } = W.scene;
      const row = W.u.el('div', 'pj-row', wrap); nodes[it.id] = row;
      const meta = W.u.el('div', 'pj-meta', row); meta.style.width = `${metaW}px`;
      const title = W.u.el('div', 'pj-task-top', meta); W.u.el('span', 'pj-id', title, `DLV-${it.number || 301 + index - W.active.length}`);
      const name = W.u.el('button', 'pj-name', title, it.title); name.type = 'button'; name.onclick = () => W.P.drawer('Work item details', it);
      const sub = W.u.el('div', 'pj-row-bottom', meta); W.P.avatar(sub, it.owner, it.color); W.u.el('span', 'pj-owner', sub, it.owner.split(' ')[0]);
      const chip = W.u.el('span', 'pj-chip', sub, it.state); chip.style.setProperty('--state', W.P.stateColor(it.state));
      datesText[it.id] = W.u.el('span', '', sub);

      return row;
    };

    BASE.scheduleBar = (it, row) => {
      const { bars, captions } = W.scene;
      const grid = W.u.el('div', 'pj-grid', row);
      const milestone = !it.related && W.s.scenario === 'milestone';
      const bar = W.u.el('div', milestone ? 'pj-diamond' : `pj-bar${it.related ? ' background' : ''}`, grid);
      bar.style.setProperty('--task', it.color); bars[it.id] = bar;
      if (!milestone) captions[it.id] = W.u.el('span', 'pj-bar-label', bar);

      if (!it.related) {
        bar.setAttribute('role', 'button'); bar.setAttribute('aria-label', `${it.title}: ${milestone ? 'milestone date' : 'start date'}`);
      }
      return { bar, milestone };
    };

    BASE.resizeGrip = (it, bar, milestone) => {
      const grip = milestone || W.s.scenario === 'dependency' ? null : W.u.el('div', 'pj-resize', bar);
      if (grip) grip.setAttribute('aria-label', `${it.title}: duration`);
      if (W.s.scenario === 'dependency') bar.style.cursor = 'default';

      return grip;
    };

    BASE.port = (it, bar, side) => {
      const port = W.u.el('span', `pj-port ${side}`, bar); W.scene.ports[it.id][side] = port;
      port.setAttribute('aria-label', `${it.title}: ${side === 'out' ? 'finish' : 'start'} port`);

      return port;
    };

    BASE.timelineAt = (id, side, m = W.ctx.model) => {
      const { metaW, positions, ROW, dayW } = W.scene;
      const b = m.bars[id];
      return [metaW + (b.start - 1 + (W.s.scenario === 'milestone' ? .5 : side === 'out' ? b.duration : 0)) * dayW, positions[id] + ROW / 2];
    };

    BASE.timeline = () => {
      W.P.timelineFrame();
      const { wrap, ports, rubber } = W.scene;
      for (const [index, it] of W.all.entries()) {
        const row = W.P.timelineRow(it, index);
        const { bar, milestone } = W.P.scheduleBar(it, row);
        if (it.related) { bar.onclick = () => W.P.drawer('Work item details', it); W.P.item(W.ctx, bar, it); continue; }
        const grip = W.P.resizeGrip(it, bar, milestone);
        ports[it.id] = {};
        if (W.s.scenario === 'dependency') for (const side of ['in', 'out']) {
          const port = W.P.port(it, bar, side);
          if (side === 'out') env.ui.track(port, {
            start(p, e) { e.stopPropagation(); rubber.setAttribute('d', ''); },
            move(p) { const r = wrap.getBoundingClientRect(), a = W.P.timelineAt(it.id, 'out'); rubber.setAttribute('d', `M${a} L${p.x - r.left},${p.y - r.top}`); },
            end(p) {
              rubber.setAttribute('d', '');
              const dest = W.active.find(({ id }) => { const r = ports[id].in.getBoundingClientRect(); return Math.hypot(p.x - r.left - r.width / 2, p.y - r.top - r.height / 2) < 18; });
              if (dest) W.P.update({ add: [it.id, dest.id] });
            },
          }, `dependency-${it.id}`);
        }
        let before, ghost;
        const gesture = (resize) => ({
          start(p, e) {
            if (e.target.closest('.pj-port')) return false;
            e.stopPropagation(); before = { ...W.ctx.model.bars[it.id] };
            ghost = W.P.ghost(it); ghost.style.left = `${p.x + 12}px`; ghost.style.top = `${p.y + 12}px`;
          },
          move(p) {
            const delta = Math.round(p.dx / W.scene.dayW);
            const value = resize ? env.util.clamp(before.duration + delta, 1, W.s.days + 1 - before.start)
              : env.util.clamp(before.start + delta, 1, W.s.days + 1 - Math.max(1, before.duration));
            if (resize) bar.style.width = `${value * W.scene.dayW}px`; else bar.style.left = `${(value - 1 + (milestone ? .5 : 0)) * W.scene.dayW}px`;
            ghost.textContent = `${it.title} / ${resize ? `${value} days` : W.F.helpers.date(W.s, value)}`;
            ghost.style.left = `${p.x + 12}px`; ghost.style.top = `${p.y + 12}px`;
          },
          end(p) {
            ghost.remove(); const delta = Math.round(p.dx / W.scene.dayW);
            W.P.update(resize ? { bar: it.id, duration: env.util.clamp(before.duration + delta, 1, W.s.days + 1 - before.start) }
              : { bar: it.id, start: env.util.clamp(before.start + delta, 1, W.s.days + 1 - Math.max(1, before.duration)) });
            W.P.paint(W.ctx.model);
          },
        });
        if (W.s.scenario !== 'dependency') env.ui.track(bar, gesture(false), `schedule-${it.id}`);
        if (grip) env.ui.track(grip, gesture(true), `duration-${it.id}`);
        W.P.item(W.ctx, bar, it);
      }
      W.today.onclick = () => { W.body.scrollTop = 0; W.zoom = 'Day'; Object.entries(W.zoomButtons).forEach(([k, b]) => b.classList.toggle('active', k === W.zoom)); W.P.refreshView(); };
    };

    BASE.ghost = (it) => {
      return W.u.el('div', 'pj-ghost', W.root, it.title);
    };
  }
  env.template('use-project-board/_timeline', () => ({ install }));
})();
