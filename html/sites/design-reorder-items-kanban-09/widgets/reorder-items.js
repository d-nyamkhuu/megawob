// Five-column source tray, packed visible assignments, occupancy styling, and activity reset.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-09',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    kanbanWidth: .205,
    kanbanHead: [34, .114],
    parts: {
      trayFit: (base, S) => (ctx, size) => {
        const geo = S.geo;
        geo.binY = 0;
        geo.colH = Math.round(size.height * .555);
        geo.trayTop = geo.colH + Math.round(size.height * .048);
        geo.h = Math.min(geo.h, size.height * .119);
      },
      columnFit: (base, S) => () => {
        if (!S.spec.pane) S.geo.w = S.geo.colW - 2 * S.geo.pad;
      },
      tray: (base, S) => (ctx, wrap, L) => {
        const label = ctx.util.el('div', 'tray-label', S.board, 'Cards');
        label.style.top = S.geo.trayTop + 'px';
        S.P.trayPositions(ctx, L);
        return {};
      },
      trayPositions: (base, S) => (ctx, L) => {
        const { size } = L, { geo, spec } = S;
        const gap = Math.max(8, size.width * .01);
        const width = (size.width - gap * 4) / 5;
        spec.items.filter(id => S.staged.has(id)).forEach((id, i) => {
          S.trayPositions[id] = {
            x: (i % 5) * (width + gap),
            y: geo.trayTop + size.height * .109 + Math.floor(i / 5) * (geo.h + size.height * .032),
            w: width, h: geo.h,
          };
        });
      },
      counts: (base, S) => (ctx, cols, counts) => () => {
        for (const c of S.spec.columns) {
          const visible = (ctx.model.columns[c] || []).filter(id => !S.staged.has(id));
          counts[c].textContent = String((ctx.model.columns[c] || []).length);
          cols[c].classList.toggle('occupied', visible.length > 0);
        }
      },
      dragStart: (base, S) => (id) => {
        S.dragScrollStart = S.paneEl ? S.paneEl.scrollLeft : 0;
        S.trayDelta = { x: 0, y: 0 };
        const { spec, ctx } = S;
        const c = spec.columns.find(c => ctx.model.columns[c].includes(id));
        const items = ctx.model.columns[c];
        const p = S.P.cardPos(spec.columns.indexOf(c), items.indexOf(id), items.length);
        const visible = items.filter(item => !S.staged.has(item));
        const visual = S.staged.has(id) ? [S.trayPositions[id].x, S.trayPositions[id].y]
          : S.P.cardPos(spec.columns.indexOf(c), visible.indexOf(id), visible.length);
        S.trayDelta = { x: visual[0] - p[0], y: visual[1] - p[1] };
      },
      dragRect: (base, S) => (el, rect, info) => {
        rect = base(el, rect, info);
        if (!info.dragging && !info.placeholder && !S.staged.has(info.id)) {
          const { spec, ctx } = S;
          const c = spec.columns.find(c => ctx.model.columns[c].includes(info.id));
          if (c) {
            const visible = ctx.model.columns[c].filter(id => !S.staged.has(id));
            const p = S.P.cardPos(spec.columns.indexOf(c), visible.indexOf(info.id), visible.length);
            rect = { ...rect, x: p[0], y: p[1] };
          }
        }
        return rect;
      },
      place: (base) => (el, rect, info) => {
        el.style.width = rect.w + 'px';
        el.style.height = rect.h + 'px';
        base(el, rect, info);
      },
      columnsChanged: (base, S) => (columns, info) => {
        S.staged.delete(info.item);
        S.trayDelta = { x: 0, y: 0 };
        S.ctx.update({ ...S.ctx.model, columns });
        S.sortable.set(columns);
        S.showCounts();
      },
      kanbanReady: (base, S) => (ctx) => {
        const initialColumns = Object.fromEntries(S.spec.columns.map(c => [c, [...ctx.model.columns[c]]]));
        const initialStaged = new Set(S.staged);
        ctx.stage.addEventListener('activity-reset', () => {
          S.staged = new Set(initialStaged);
          S.trayDelta = { x: 0, y: 0 };
          const columns = Object.fromEntries(S.spec.columns.map(c => [c, [...initialColumns[c]]]));
          ctx.update({ ...ctx.model, columns });
          S.sortable.set(columns);
          S.showCounts();
        });
      },
    },
  },
});
