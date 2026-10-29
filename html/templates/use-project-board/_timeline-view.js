/* use-project-board/_timeline-view: Committed timeline layout, calendar, drawing, mirror and target locations.
 * install(BASE, W) retains the workspace's design parts; W is its live per-page state. */
(function () {
  'use strict';
  function install(BASE, W) {
    BASE.timelineCalendar = () => {
      const { metaW, dates, todayLine, nodes } = W.scene;
      let { shownDays, dayW } = W.scene;
      shownDays = W.zoom === 'Day' ? W.s.days : W.zoom === 'Week' ? 28 : W.s.month === 'June' ? 30 : 31;
      dayW = (W.body.clientWidth - metaW) / shownDays;
      dates.replaceChildren(); W.u.el('div', 'pj-month', dates, `${W.s.month} / ${W.zoom === 'Day' ? 'Daily schedule' : W.zoom === 'Week' ? 'Weekly overview' : 'Month overview'}`);
      for (let d = 1; d <= shownDays; d += 7) {
        const el = W.u.el('div', 'pj-week', dates, `Week ${Math.floor((d - 1) / 7) + 1} / ${W.s.month.slice(0, 3)} ${d}-${Math.min(d + 6, shownDays)}`);
        el.style.left = `${(d - 1) * dayW}px`; el.style.width = `${Math.min(7, shownDays - d + 1) * dayW}px`;
      }
      for (let d = 1; d <= shownDays; d++) {
        const el = W.u.el('div', `pj-date${d % 7 === 0 || d % 7 === 6 ? ' weekend' : ''}${d === W.todayDay ? ' today' : ''}`, dates, String(d));
        el.style.left = `${(d - 1) * dayW}px`; el.style.width = `${dayW}px`; el.title = `${W.s.month} ${d}${d === W.todayDay ? ' / Today' : ''}`;
      }
      todayLine.style.left = `${metaW + (W.todayDay - .5) * dayW}px`;
      Object.values(nodes).forEach((row) => row.lastElementChild.style.setProperty('--day', `${dayW}px`));

      Object.assign(W.scene, { shownDays, dayW });
    };

    BASE.timelineMirror = () => {
      const { positions, ROW, edgePoints, AXIS } = W.scene;
      const rows = {};
      W.active.forEach(({ id }) => { rows[id] = [positions[id] + ROW / 2 - 12, positions[id] + ROW / 2 + 12]; });
      for (const [k, a] of Object.entries(edgePoints)) rows[`edge:${k}`] = [a[1] - 10, a[1] + 10];
      const view = { top: W.body.scrollTop + AXIS + 10, bottom: W.body.scrollTop + W.body.clientHeight - 10, rows, reset: W.P.currentViewReset() };
      if (JSON.stringify(W.ctx.model.view) !== JSON.stringify(view)) W.ctx.update({ ...W.ctx.model, view });
    };

    BASE.timelinePaint = (m) => {
      const { bars, dayW, captions, datesText, edgesG, nodes } = W.scene;
      let { edgePoints } = W.scene;
      for (const it of W.all) {
        const b = it.related ? it : m.bars[it.id], milestone = !it.related && W.s.scenario === 'milestone';
        bars[it.id].style.left = `${(b.start - 1 + (milestone ? .5 : 0)) * dayW}px`;
        if (!milestone) bars[it.id].style.width = `${b.duration * dayW}px`;
        if (captions[it.id]) captions[it.id].textContent = b.duration * dayW > 130 ? `${it.title} / ${b.duration}d` : `${b.duration}d`;
        bars[it.id].title = `${it.title}: ${W.F.helpers.date(W.s, b.start)} / ${b.duration} days`;
        datesText[it.id].textContent = `${W.s.month.slice(0, 3)} ${b.start}${b.duration ? ` / ${b.duration}d` : ''}`;
      }
      edgesG.replaceChildren(); edgePoints = {};
      for (const e of m.edges) {
        const a = W.P.timelineAt(e[0], 'out', m), b = W.P.timelineAt(e[1], 'in', m), mid = Math.min(W.body.clientWidth - 8, a[0] + 12);
        if (nodes[e[0]].style.display === 'none' || nodes[e[1]].style.display === 'none') continue;
        const x = mid, y = (a[1] + b[1]) / 2; edgePoints[e.join('>')] = [x, y];
        W.P.edge(e, a, b, mid, x, y);
      }

      W.scene.edgePoints = edgePoints;
    };

    BASE.edge = (e, a, b, mid, x, y) => {
      const { edgesG } = W.scene;
      W.u.svg('path', { class: 'pj-link', d: `M${a} H${mid} V${b[1]} H${b[0]} m-5,-4 l5,4 -5,4` }, edgesG);
      if (W.s.scenario === 'dependency') {
        const del = W.u.svg('g', { class: 'pj-edge-delete', 'aria-label': `Remove dependency ${e.join(' to ')}` }, edgesG);
        W.u.svg('circle', { cx: x, cy: y, r: 8 }, del); W.u.svg('path', { d: `M${x - 3},${y - 3} l6,6 m-6,0 l6,-6` }, del);
        del.addEventListener('click', () => W.P.update({ remove: e }));
      }
    };

    BASE.timelineRefresh = () => {
      W.P.timelineCalendar();
      const { AXIS, PHASE, ROW, phase, nextPhase, positions, nodes, wrap } = W.scene;
      let y = AXIS; phase.style.top = `${y}px`; y += PHASE;
      const sequence = [W.related[0], W.related[1]];
      W.active.forEach((it, i) => sequence.push(it, W.related[i + 2]));
      const rest = W.related.slice(W.active.length + 2);
      let ordered = [...sequence, ...rest];
      if (W.grouping === 'Assignee') ordered = ordered.sort((a, b) => a.owner.localeCompare(b.owner, 'en'));
      let second = false;
      for (const it of ordered) {
        const show = W.filter === 'All work' || (W.filter === 'Completed work' ? it.state === 'Complete' : it.state !== 'Complete');
        nodes[it.id].style.display = show ? '' : 'none';
        if (!show) continue;
        if (!second && rest.includes(it)) { nextPhase.style.top = `${y}px`; y += PHASE; second = true; }
        positions[it.id] = y; nodes[it.id].style.top = `${y}px`; y += ROW;
      }
      nextPhase.style.display = second ? '' : 'none'; wrap.style.height = `${y + 10}px`;
      W.P.paint(W.ctx.model);
    };

    BASE.timelineLocate = (t) => {
      const { wrap, ports, edgePoints, dayW } = W.scene;
      const r = wrap.getBoundingClientRect();
      if (t.port) return W.u.center(ports[t.port][t.side]);
      if (t.edge) { const a = edgePoints[t.edge.join('>')]; return [r.left + a[0], r.top + a[1]]; }
      if (t.end) { const b = W.ctx.model.bars[t.end], a = W.P.timelineAt(t.end, 'out'); return [r.left + a[0] - 2 + ((t.duration ?? b.duration) - b.duration) * dayW, r.top + a[1]]; }
      const b = W.ctx.model.bars[t.bar], a = W.P.timelineAt(t.bar, 'in');
      return [r.left + a[0] + (W.s.scenario === 'milestone' ? 0 : b.duration * dayW / 2) + ((t.date ?? b.start) - b.start) * dayW, r.top + a[1]];
    };
  }
  env.template('use-project-board/_timeline-view', () => ({ install }));
})();
