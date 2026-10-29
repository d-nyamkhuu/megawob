// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-dependency-02',
  name: 'design',
  split: 'train',
  scenarios: ['dependency'],
  template: 'use-project-board/workspace',
  design: {
    rowHeight: 40,
    inset: 6,
    parts: {
      frame: (base, S) => (ctx) => {
        const root = base(ctx);
        // Leave enough timeline height for dependencies spanning the release.
        const tight = ctx.size.height < 520;
        S.D.rowHeight = tight ? 36 : 40;
        ctx.css('planner-compact-shell', `
          .pj-row { height:${S.D.rowHeight}px; }
          ${tight ? '.pj-meta { padding:3px 9px; gap:2px; }' : ''}
        ` + (ctx.size.height < 600 ? `
          .pj-head { height:34px; }
          .pj-tabs { height:25px; }
          .pj-tools { height:50px; padding-top:3px; padding-bottom:3px; gap:3px; }
          .pj-foot { height:24px; }
          .pj-hint { height:18px; }
        ` : ''));
        return root;
      },
      timelineRefresh: (base, S) => {
        let previousRoot;
        return () => {
          if (S.grouping !== 'Project section') {
            base();
            if (previousRoot === S.els.root) S.ctx.reanchor();
            previousRoot = S.els.root;
            return;
          }
          // Commit one layout and one visibility mirror per refresh. Painting
          // the template's interleaved rows first publishes a transient view.
          S.P.timelineCalendar();
          const { AXIS, PHASE, ROW, phase, nextPhase, positions, nodes, wrap } = S.scene;
          let y = AXIS;
          phase.style.top = `${y}px`;
          y += PHASE;
          const visible = (it) => S.filter === 'All work' ||
            (S.filter === 'Completed work' ? it.state === 'Complete' : it.state !== 'Complete');
          for (const it of S.active) {
            const show = visible(it);
            nodes[it.id].style.display = show ? '' : 'none';
            if (!show) continue;
            positions[it.id] = y; nodes[it.id].style.top = `${y}px`; y += ROW;
          }
          const related = S.related.filter(visible);
          nextPhase.style.display = related.length ? '' : 'none';
          nextPhase.style.top = `${y}px`;
          if (related.length) y += PHASE;
          for (const it of S.related) {
            const show = visible(it);
            nodes[it.id].style.display = show ? '' : 'none';
            if (!show) continue;
            positions[it.id] = y; nodes[it.id].style.top = `${y}px`; y += ROW;
          }
          wrap.style.height = `${y + 10}px`;
          S.P.paint(S.ctx.model);
          // The initial anchors are registered after render returns.
          if (previousRoot === S.els.root) S.ctx.reanchor();
          previousRoot = S.els.root;
        };
      },
    },
  },
});
