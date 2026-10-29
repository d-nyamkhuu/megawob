// Restores the six card tray, inset columns, and drop frames used by this kanban design.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-10',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { dragScroll: true },
  template: 'reorder-items/cards',
  design: {
    tray: true,
    avatars: false,
    parts: {
      kanbanSize: (base, S) => (ctx) => {
        const count = document.querySelector('.note-count');
        if (count) count.textContent = S.spec.items.length + ' cards';
        return {
          width: Math.min(ctx.size.width, ctx.stage.clientWidth),
          height: Math.min(ctx.size.height, ctx.stage.clientHeight),
        };
      },
      kanbanFit: (base, S) => (ctx, size) => {
        const { spec } = S;
        const n = spec.items.length;
        const k = spec.columns.length;
        const barH = spec.pane ? 22 : 0;
        const wordy = spec.items.some((id) => spec.labels[id].title.length > 16);
        S.geo = {
          head: Math.max(34, size.height * .086),
          pad: Math.max(9, size.width * .012),
          binY: 0,
          inset: size.width * .024,
        };
        const geo = S.geo;
        geo.h = Math.max(40, size.height * .091);
        geo.pitchY = geo.h + Math.max(10, size.height * .028);
        S.P.staging(ctx);
        const perRow = 6;
        const trayRows = Math.max(2, Math.ceil(S.staged.size / perRow));
        geo.binY = Math.min(size.height * .49, Math.max(size.height * .342, size.height * .06 + trayRows * geo.pitchY));
        geo.colH = size.height - geo.binY - barH - 3;
        geo.w = spec.pane
          ? Math.min(260, Math.max(170, size.width * .205))
          : Math.min(size.width * .147, (size.width - 28 * (k - 1)) / k - 2 * geo.pad);
        geo.colW = spec.pane
          ? Math.max(geo.w + 2 * geo.pad, size.width * .316)
          : (size.width - 2 * geo.inset - size.width * .013 * (k - 1)) / k;
        geo.pitchX = geo.colW + size.width * .013;
        const boardW = (k - 1) * geo.pitchX + geo.colW + 2 * geo.inset;
        return { size, n, k, barH, wordy, boardW, boardH: size.height - barH };
      },
      boardWidth: (base, S) => () => {
        const { geo, spec } = S;
        return (spec.columns.length - 1) * geo.pitchX + geo.colW + 2 * geo.inset;
      },
      paneColumns: (base, S) => () => Object.fromEntries(
        S.spec.columns.map((c, i) => [c, [S.geo.inset + i * S.geo.pitchX, S.geo.inset + i * S.geo.pitchX + S.geo.colW]]),
      ),
      tray: (base, S) => (ctx, wrap, L) => {
        const { size, boardW } = L;
        const { util } = ctx;
        const { geo, spec, board } = S;
        const bg = util.el('div', 'tray-bg', board);
        bg.style.height = Math.max(0, geo.binY - size.height * .028) + 'px';
        util.el('div', 'tray-label', board, 'Cards to sort (drag from here):');
        S.P.trayPositions(ctx, L);
        return {};
      },
      trayPositions: (base, S) => (ctx, L) => {
        const { size } = L;
        const { spec, geo, staged } = S;
        S.trayPositions = {};
        const gap = (size.width * .952 - 6 * geo.w) / 5 + geo.w;
        spec.items.filter((id) => staged.has(id)).forEach((id, i) => {
          S.trayPositions[id] = {
            x: size.width * .024 + (i % 6) * gap,
            y: size.height * .066 + Math.floor(i / 6) * geo.pitchY,
            w: geo.w,
            h: geo.h,
          };
        });
      },
      columnBegin: (base, S) => (ctx, col, c, ci) => {
        const { geo } = S;
        col.style.left = geo.inset + ci * geo.pitchX + 'px';
        col.style.setProperty('--column-head', geo.head + 'px');
        const frame = ctx.util.el('div', 'drop-frame', col);
        const x = geo.colW * .035;
        const y = geo.head + 16;
        frame.innerHTML = `<svg viewBox="0 0 ${geo.colW} ${geo.colH}" aria-hidden="true"><rect x="${x}" y="${y}" width="${geo.colW - 2 * x}" height="${Math.max(1, geo.colH * .96 - y)}" rx="7" fill="none" stroke="#6a597e" stroke-width="1" stroke-dasharray="7 5"/></svg>`;
      },
      counts: (base, S) => (ctx, cols, counts) => () => {
        for (const c of S.spec.columns) {
          const ids = ctx.model.columns[c] || [];
          counts[c].textContent = String(ids.length);
          cols[c].classList.toggle('occupied', ids.some((id) => !S.staged.has(id)));
        }
      },
      cardPos: (base, S) => (c, i, n) => {
        const { geo } = S;
        const room = geo.colH - geo.head - 2 * geo.pad - geo.h;
        const pitch = n > 1 ? Math.min(geo.pitchY, room / (n - 1)) : geo.pitchY;
        return [geo.inset + c * geo.pitchX + geo.pad, geo.binY + geo.head + geo.pad + i * pitch];
      },
      groupAt: (base, S) => (point) => {
        const { geo, spec, P } = S;
        const x = point[0] + P.dragScrollDelta() + S.trayDelta.x;
        return spec.columns.reduce((best, col, i) => {
          const near = Math.max(geo.inset + i * geo.pitchX - x, x - (geo.inset + i * geo.pitchX + geo.colW), 0);
          return !best || near < best.distance ? { col, distance: near } : best;
        }, null).col;
      },
      dropRule: (base, S) => (point, slots) => {
        const x = point[0] + S.P.dragScrollDelta() + S.trayDelta.x;
        let best = 0;
        let distance = Infinity;
        slots.forEach((r, i) => {
          const d = Math.hypot(r.x + r.w / 2 - x, r.y + r.h / 2 - point[1] - S.trayDelta.y);
          if (d < distance) { distance = d; best = i; }
        });
        return best;
      },
    },
  },
});
