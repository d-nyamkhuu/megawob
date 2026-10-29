// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-orgchart-02',
  name: 'design',
  split: 'train',
  scenarios: ['orgchart'],
  template: 'use-hr/workspace',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const root = base(ctx);
        root.classList.add('rivet-app');
        return root;
      },
      shell: (base, S) => (ctx) => {
        const state = S.current, P = S.P;
        state.rivetDirectory = P.element(ctx, 'div', 'rivet-directory', state.root);
        state.main = P.element(ctx, 'div', 'rivet-main', state.root);
        P.toolbar(ctx);
        const taskPanel = ctx.stage.parentElement.querySelector('.ref-panel');
        if (taskPanel) state.rivetDirectory.append(taskPanel);
        state.work = P.element(ctx, 'div', 'hr-work rivet-work', state.main);
        state.footer = P.element(ctx, 'div', 'hr-stats', state.root);
      },
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const state = S.current, P = S.P;
        const original = state.main.querySelector('.hr-toolbar');
        const head = P.element(ctx, 'div', 'rivet-rail-head', state.rivetDirectory);
        P.element(ctx, 'div', 'rivet-rail-title', head, 'Find an employee');
        head.append(original.querySelector('.hr-search'));
        state.search.placeholder = 'Search by name, title, or team...';
        state.search.setAttribute('aria-label', state.search.placeholder);
        original.remove();
        const tools = P.element(ctx, 'div', 'rivet-zoom', state.main);
        const group = P.element(ctx, 'div', 'rivet-zoom-group', tools);
        const change = (delta) => {
          state.ui.rivetZoom = Math.max(.5, Math.min(1.5, (state.ui.rivetZoom || 1) + delta));
          P.draw(ctx);
          percent.textContent = Math.round(state.ui.rivetZoom * 100) + '%';
        };
        const minus = P.button(ctx, group, '−', () => change(-.1));
        minus.setAttribute('aria-label', 'Zoom out');
        const percent = P.button(ctx, group, '100%', () => {
          state.ui.rivetZoom = 1; P.draw(ctx); percent.textContent = '100%';
        });
        percent.setAttribute('aria-label', 'Reset zoom');
        const plus = P.button(ctx, group, '+', () => change(.1));
        plus.setAttribute('aria-label', 'Zoom in');
        const fit = P.button(ctx, tools, '⛶', () => {
          state.ui.collapsed.clear(); state.ui.rivetZoom = 1;
          P.draw(ctx); percent.textContent = '100%';
        });
        fit.title = 'Expand all'; fit.setAttribute('aria-label', 'Expand all');
        fit.textContent = '';
        const glyph = ctx.util.svg('svg', { class: 'hr-svg', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, fit);
        ctx.util.svg('path', { d: 'M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M8 8h2v2H8zm6 0h2v2h-2zm-6 6h2v2H8zm6 0h2v2h-2z' }, glyph);
      },
      icon: (base) => (ctx, parent, name) => {
        if (name !== 'people') return base(ctx, parent, name);
        const svg = ctx.util.svg('svg', { class: 'hr-svg rivet-people-icon', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, parent);
        ctx.util.svg('path', { d: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m9-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6M2 21v-4a6 6 0 0 1 12 0v4zm14 0v-4c0-2-.6-3.7-1.8-5a5 5 0 0 1 7.8 4v5z', fill: 'currentColor' }, svg);
        return svg;
      },
      avatar: (base) => (ctx, parent, person) => {
        const avatar = base(ctx, parent, person);
        const colors = ['#65bdf0', '#ffdb43', '#91d9bf', '#f6b2c9', '#21c5a3', '#b695ed', '#9bcfe9', '#ffac66', '#bfc4cc'];
        const index = Number((person.id || '').replace(/\D/g, '')) || 0;
        avatar.style.setProperty('background', colors[index % colors.length], 'important');
        return avatar;
      },
      orgLayout: (base, S) => (ctx, all) => {
        const geo = base(ctx, all), state = S.current;
        const width = Math.max(1220, state.work.clientWidth - 2);
        const columns = Math.max(1, geo.direct.length);
        const gap = (width - 56) / columns;
        geo.cardWidth = Math.min(366, gap - 35);
        geo.cardHeight = 96;
        geo.positions.p0 = { x: (width - geo.cardWidth) / 2, y: 64 };
        let bottom = 0;
        geo.direct.forEach((boss, column) => {
          let y = 216;
          const visit = (id, depth) => {
            if (!geo.positions[id]) return;
            geo.positions[id] = { x: 28 + column * gap + Math.min(depth, 2) * 25, y };
            y += depth === 0 ? 140 : 110;
            all.filter((p) => geo.parents[p.id] === id).forEach((p) => visit(p.id, depth + 1));
          };
          visit(boss.id, 0); bottom = Math.max(bottom, y + 12);
        });
        geo.width = width; geo.height = Math.max(state.work.clientHeight - 4, bottom);
        state.root.style.setProperty('--rivet-card-width', geo.cardWidth + 'px');
        return geo;
      },
      orgConnectors: (base, S) => (ctx, canvas, geo) => {
        const svg = ctx.util.svg('svg', { class: 'hr-connectors', 'aria-hidden': 'true' }, canvas);
        for (const [id, pos] of Object.entries(geo.positions)) {
          const parent = geo.positions[geo.parents[id]];
          if (!parent) continue;
          const path = geo.parents[id] === 'p0'
            ? `M${parent.x + geo.cardWidth / 2},${parent.y + geo.cardHeight} V192 H${pos.x + geo.cardWidth / 2} V${pos.y}`
            : `M${parent.x + 19},${parent.y + geo.cardHeight} V${pos.y + geo.cardHeight / 2} H${pos.x}`;
          ctx.util.svg('path', { d: path }, svg);
        }
      },
      orgCard: (base, S) => (ctx, canvas, person, position, count, editable) => {
        const card = base(ctx, canvas, person, position, count, editable);
        card.dataset.branchLevel = person.id === 'p0' ? 'root' : S.current.geo.parents[person.id] === 'p0' ? 'manager' : 'employee';
        let depth = 0, ancestor = S.current.geo.parents[person.id];
        while (ancestor && ancestor !== 'p0') { depth++; ancestor = S.current.geo.parents[ancestor]; }
        card.style.setProperty('--rivet-node-width', (S.current.geo.cardWidth - Math.min(depth, 2) * 25) + 'px');
        const meta = S.P.element(ctx, 'div', 'rivet-count', card);
        S.P.icon(ctx, meta, 'people');
        S.P.element(ctx, 'span', '', meta, String(count));
        return card;
      },
      orgchart: (base, S) => (ctx) => {
        base(ctx);
        const state = S.current, P = S.P;
        state.rivetDirectory.querySelector('.rivet-roster')?.remove();
        const roster = P.pane(ctx, state.rivetDirectory, 'directory', 'rivet-roster');
        const all = [...state.s.people, ...(state.s.directory || [])];
        P.element(ctx, 'div', 'rivet-roster-label', roster, `ALL EMPLOYEES (${all.length})`);
        for (const person of all.filter((p) => p.id !== 'p0' && P.match(ctx, p))) {
          const row = P.element(ctx, 'div', 'rivet-person', roster);
          P.identity(ctx, row, person);
          row.addEventListener('click', () => {
            const entry = state.refs['manager/' + person.id];
            if (entry) entry.node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          });
        }
        state.work.querySelector('.hr-canvas').style.zoom = state.ui.rivetZoom || 1;
      },
      orgRail: () => () => {},
    },
  },
});
