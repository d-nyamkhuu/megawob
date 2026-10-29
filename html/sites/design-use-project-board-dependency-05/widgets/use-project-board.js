// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-dependency-05',
  name: 'design',
  split: 'train',
  scenarios: ['dependency'],
  template: 'use-project-board/workspace',
  design: {
    rowHeight: 40,
    axisHeight: 68,
    // Keep compact rows below the sticky axis's 10px visibility clearance.
    phaseHeight: 10,
    sidebarWidth: 0,
    compactSidebarWidth: 0,
    metaMin: 260,
    metaMax: 445,
    metaRatio: .375,
    inset: 0,
    radius: 0,
    parts: {
      frame: (base, S) => (ctx) => {
        // Heading, full calendar, and top/bottom clearance must fit with all six ports.
        S.D.rowHeight = Math.max(24, Math.min(40, Math.floor((ctx.size.height - 124) / 6)));
        return base(ctx);
      },
      timelineRefresh: (base, S) => () => {
        S.P.timelineCalendar();
        const { AXIS, PHASE, ROW, phase, nextPhase, positions, nodes, wrap } = S.scene;
        let y = AXIS;
        phase.style.top = `${y}px`;
        y += PHASE;
        for (const it of S.active) {
          const show = S.filter === 'All work' || (S.filter === 'Completed work'
            ? it.state === 'Complete' : it.state !== 'Complete');
          nodes[it.id].style.display = show ? '' : 'none';
          if (!show) continue;
          positions[it.id] = y;
          nodes[it.id].style.top = `${y}px`;
          y += ROW;
        }
        for (const it of S.related) nodes[it.id].style.display = 'none';
        nextPhase.style.display = 'none';
        wrap.style.height = `${y + 10}px`;
        S.P.paint(S.ctx.model);
        if (S.scene.ready) S.ctx.reanchor();
      },
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
      timelineRow: (base, S) => (it, index) => {
        const row = base(it, index);
        const meta = row.firstElementChild;
        const colors = ['#509fff','#68c553','#ff922d','#ad78f2','#ffdc40','#ff4444'];
        row.style.setProperty('--task', colors[index % colors.length]);
        const name = meta.querySelector('.pj-name');
        const label = name ? name.textContent : it.title || it.name || '';
        const cells = S.ctx.util.el('div', 'plan-row-meta', meta);
        S.ctx.util.el('span', '', cells, String(index + 1));
        const title = S.ctx.util.el('span', 'plan-task-name', cells);
        S.ctx.util.el('i', '', title);
        S.ctx.util.el('b', '', title, label);
        S.ctx.util.el('span', 'plan-start', cells);
        S.ctx.util.el('span', 'plan-duration', cells);
        return row;
      },
      timelineRefresh: (base, S) => () => {
        S.P.timelineCalendar();
        const { AXIS, PHASE, ROW, phase, nextPhase, positions, nodes, wrap } = S.scene;
        let y = AXIS;
        phase.style.top = `${y}px`;
        y += PHASE;
        const sections = [S.active];
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
        for (const it of S.related) nodes[it.id].style.display = 'none';
        wrap.style.height = `${y + 10}px`;
        S.P.paint(S.ctx.model);
        if (S.scene.ready) S.ctx.reanchor();
      },
      timelineFrame: (base, S) => () => {
        base();
        const label = S.els.body.querySelector('.pj-axis-label');
        if (label) {
          const head = S.ctx.util.el('div', 'plan-table-head', label);
          for (const name of ['#', 'Task Name', 'Start', 'Duration']) S.ctx.util.el('span', '', head, name);
        }
      },
      footer: (base, S) => (m) => {
        base(m);
        const target = document.querySelector('.project-facts');
        if (target && S.els.foot) {
          const count = S.els.foot.textContent.match(/Dependencies:?\s*(\d+)/i);
          target.children[0].textContent = `Tasks: ${S.active.length}`;
          target.children[1].textContent = `Finish-to-start links: ${count ? count[1] : '0'}`;
        }
        for (const it of S.active) {
          const row = S.scene.nodes && S.scene.nodes[it.id];
          const date = S.scene.datesText && S.scene.datesText[it.id];
          if (!row || !date) continue;
          const text = date.textContent || '';
          const start = text.match(/[A-Z][a-z]{2}\s+\d{1,2}/);
          const days = text.match(/(\d+)\s*d(?:ays?)?/i);
          if (start) row.querySelector('.plan-start').textContent = start[0];
          if (days) row.querySelector('.plan-duration').textContent = `${days[1]}d`;
        }
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        S.scene.ready = true;
        const cards = document.querySelectorAll('.project-board-card');
        const indices = [0, 2, 3, 4, 5];
        cards.forEach((card, index) => {
          const it = S.active[indices[index]] || S.active[index % S.active.length];
          const row = S.scene.nodes[it.id];
          const name = row.querySelector('.plan-task-name b');
          card.textContent = name ? name.textContent : '';
        });
      },
    },
  },
});
