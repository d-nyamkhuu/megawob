// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-dependency-01',
  name: 'design',
  split: 'train',
  scenarios: ['dependency'],
  template: 'use-project-board/workspace',
  design: {
    rowHeight: 32,
    inset: 4,
    parts: {
      heading: (base, S) => () => {
        base();
        // Keep room for a complete dependency gesture in short workspaces.
        if (S.ctx.size.height < 600) {
          const head = S.els.main.firstElementChild;
          head.style.height = '28px';
          Object.assign(head.firstElementChild.style, {
            display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden',
          });
        }
      },
      tabs: (base, S) => () => {
        base();
        if (S.ctx.size.height < 600) S.els.main.lastElementChild.style.height = '24px';
      },
      toolbar: (base, S) => () => {
        base();
        if (S.ctx.size.height < 600)
          Object.assign(S.els.tools.style, { height: '52px', padding: '2px 8px', gap: '2px' });
      },
      body: (base, S) => () => {
        base();
        if (S.ctx.size.height < 600) {
          S.els.hint.style.height = '18px';
          S.els.foot.style.height = '22px';
        }
      },
      timelineRow: (base) => (it, index) => {
        const row = base(it, index);
        const meta = row.firstElementChild;
        meta.style.padding = '1px 9px';
        meta.style.gap = '1px';
        const avatar = meta.querySelector('.pj-avatar');
        if (avatar) Object.assign(avatar.style, { width: '12px', height: '12px' });
        const chip = meta.querySelector('.pj-chip');
        if (chip) chip.style.padding = '1px 5px';
        return row;
      },
      timelineRefresh: (base, S) => () => {
        S.P.timelineCalendar();
        const { AXIS, PHASE, ROW, phase, nextPhase, positions, nodes, wrap } = S.scene;
        let y = AXIS;
        phase.style.top = `${y}px`;
        y += PHASE;
        // The release tasks form one contiguous section; related work remains
        // available below it, with the same filters, grouping and detail actions.
        const sections = [S.active, S.related];
        let second = false;
        for (const section of sections) {
          const ordered = S.grouping === 'Assignee'
            ? [...section].sort((a, b) => a.owner.localeCompare(b.owner, 'en')) : section;
          for (const it of ordered) {
            const show = S.filter === 'All work' || (S.filter === 'Completed work'
              ? it.state === 'Complete' : it.state !== 'Complete');
            nodes[it.id].style.display = show ? '' : 'none';
            if (!show) continue;
            if (section === S.related && !second) {
              nextPhase.style.top = `${y}px`;
              y += PHASE;
              second = true;
            }
            positions[it.id] = y;
            nodes[it.id].style.top = `${y}px`;
            y += ROW;
          }
        }
        nextPhase.style.display = second ? '' : 'none';
        wrap.style.height = `${y + 10}px`;
        S.P.paint(S.ctx.model);
        if (S.scene.ready) S.ctx.reanchor();
      },
      rendered: (base, S) => (ctx) => { base(ctx); S.scene.ready = true; },
    },
  },
});
