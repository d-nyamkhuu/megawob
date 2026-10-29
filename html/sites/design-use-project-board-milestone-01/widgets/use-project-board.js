// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-milestone-01',
  name: 'design',
  split: 'train',
  scenarios: ['milestone'],
  template: 'use-project-board/workspace',
  design: {
    inset: 0, axisHeight: 68, rowHeight: 63, phaseHeight: 0,
    metaMin: 248, metaMax: 248, metaRatio: 0.16,
    parts: {
      timelineFrame(base, S) {
        return function() {
        const ctx = S.ctx, s = S.spec, u = S.ctx.util, P = S.P, active = S.active;
        const body = S.els.body;
        const summary = u.el('div', 'milestone-summary', body);
        body.before(summary);
        const counts = [
          ['Release:', 'v1.0'], ['Start:', `${s.month.slice(0, 3)} 01, 2024`], ['End:', `${s.month.slice(0, 3)} ${String(s.month === 'June' ? 30 : s.days).padStart(2, '0')}, 2024`],
          ['Total milestones:', String(active.length)], ['Completed:', '0'], ['In progress:', '0'], ['Upcoming:', String(active.length)],
        ];
        const left = u.el('div', 'milestone-summary-left', summary);
        const right = u.el('div', 'milestone-summary-right', summary);
        counts.slice(0, 3).forEach(([k,v]) => { const row=u.el('div','',left); u.el('b','',row,k); u.el('span','',row,v); });
        counts.slice(3).forEach(([k,v]) => { const row=u.el('div','',right); u.el('span','',row,k); u.el('span','',row,v); });
        S.zoom = 'Month';
        const wrap = u.el('div', 'pj-timeline milestone-timeline', body);
        wrap.style.minHeight = '100%';
        const metaW = Math.max(248, Math.min(248, body.clientWidth * .16));
        const positions = {}, nodes = {}, bars = {}, datesText = {}, ports = {}, captions = {};
        const axis = u.el('div', 'pj-axis', wrap), axisLabel = u.el('div', 'pj-axis-label', axis);
        axisLabel.style.width = `${metaW}px`;
        u.el('strong', '', axisLabel, 'Milestone');
        const dates = u.el('div', 'pj-dates', axis);
        const todayLine = u.el('div', 'pj-today', wrap);
        const phase = u.el('div', 'pj-phase', wrap); phase.style.display = 'none';
        const nextPhase = u.el('div', 'pj-phase', wrap); nextPhase.style.display = 'none';
        const lineLayer = u.svg('svg', { class: 'pj-edges' }, wrap), edgesG = u.svg('g', {}, lineLayer);
        const decorG = u.svg('g', { class: 'milestone-links' }, lineLayer);
        const rubber = u.svg('path', { class: 'pj-rubber' }, lineLayer);
        const strip = u.el('div', 'milestone-related', body);
        body.after(strip);
        const groups = [
          ['To Do', active.filter(x => x.state !== 'In progress' && x.state !== 'Complete')],
          ['In Progress', active.filter(x => x.state === 'In progress')],
          ['Blocked', []], ['Done', active.filter(x => x.state === 'Complete')],
        ];
        groups.forEach(([label, items]) => {
          const col = u.el('section', 'milestone-related-column', strip);
          u.el('strong', '', col, `${label} (${items.length})`);
          const list=u.el('div','milestone-related-list',col);
          items.forEach(it => {
            const card=u.el('div','milestone-related-item',list);
            const diamond=u.el('i','milestone-related-diamond',card); diamond.style.background=it.color;
            const text=u.el('span','',card,`${it.title}  ${s.month.slice(0,3)} ${ctx.model.bars[it.id].start}`);
            const owner=u.el('small','',card,it.owner.split(' ')[0]);
          });
        });
        // Keep each diamond clear of the sticky axis and its visibility guard.
        const rowHeight = ctx.size.height <= 720 ? 44 : 63;
        Object.assign(S.scene = {}, { AXIS:axis.offsetHeight, ROW:rowHeight, PHASE:0, wrap, metaW, positions, nodes, bars, datesText, ports, captions,
          axis, axisLabel, dates, todayLine, phase, nextPhase, lineLayer, edgesG, decorG, rubber, edgePoints:{}, dayW:0, shownDays:s.days, summary, strip });
        };
      },
      timelineRow(base, S) {
        return function(it, index) {
        const u = S.ctx.util, scene = S.scene;
        const row = u.el('div', `pj-row${it.related ? ' milestone-hidden-related' : ''}`, scene.wrap);
        scene.nodes[it.id] = row;
        if (it.related) { scene.datesText[it.id]=u.el('span','milestone-date-hidden',row,''); return row; }
        scene.positions[it.id] = index * scene.ROW;
        row.style.top = `${index * scene.ROW}px`;
        row.style.height = `${scene.ROW}px`;
        const meta=u.el('div','pj-meta milestone-label',row); meta.style.width=`${scene.metaW}px`;
        u.el('span','pj-name',meta,it.title);
        scene.datesText[it.id]=u.el('span','milestone-date-hidden',meta,String(it.start));
        return row;
        };
      },
      timelineRefresh(base, S) {
        return function() {
          const { scene, active, P, ctx } = S;
          P.timelineCalendar();
          let y = scene.AXIS;
          active.forEach((it, i) => {
            const row = scene.nodes[it.id];
            row.style.display = '';
            scene.positions[it.id] = y;
            row.style.top = `${y}px`;
            y += scene.ROW;
          });
          S.related.forEach(it => { scene.nodes[it.id].style.display = 'none'; });
          scene.wrap.style.height = `${y + 4}px`;
          P.paint(ctx.model);
        };
      },
      timelineCalendar(base, S) {
        return function() {
          base();
          const month=S.scene.dates.querySelector('.pj-month');
          if (month) month.textContent=`${S.spec.month} 2024`;
        };
      },
      timelinePaint(base, S) {
        return function(model) {
          base(model);
          const { scene, active, ctx } = S, util=ctx.util, g=scene.decorG;
          g.replaceChildren();
          [[0,1],[1,2],[2,3],[3,4],[4,5]].forEach(([a,b]) => {
            if (!active[a] || !active[b]) return;
            const point=(i) => { const it=active[i], bar=model.bars[it.id]; return [scene.metaW+(bar.start-.5)*scene.dayW,scene.positions[it.id]+scene.ROW/2]; };
            const p=point(a), q=point(b), mid=Math.max(p[0]+18,Math.min(q[0]-10,p[0]+Math.max(28,(q[0]-p[0])*.34)));
            util.svg('path',{d:`M${p[0]} ${p[1]} H${mid} V${q[1]} H${q[0]-12} m-6 -4 l6 4 -6 4`,fill:'none',stroke:'#111','stroke-width':'1.6'},g);
          });
        };
      },
    },
  },
});
