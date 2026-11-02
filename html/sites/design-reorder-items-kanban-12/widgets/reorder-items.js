// Preserves the offset column board, visually staged incorrect assignments, and card metadata.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-12',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { cardMeta: true, wheelPane: true },
  template: 'reorder-items/cards',
  design: {
    tray: true,
    avatars: false,
    parts: {
      kanbanFit: (base, S) => (ctx, size) => {
        const { rng } = ctx;
        const spec = S.spec;
        const n = spec.items.length;
        const k = spec.columns.length;
        const barH = spec.pane ? 22 : 0;
        const geo = { head: Math.max(34, size.height * .082), pad: Math.max(9, size.width * .012), binY: 0 };
        const wordy = spec.items.some((id) => spec.labels[id].title.length > 16);
        geo.h = Math.max(34, size.height * .070);
        geo.pitchY = geo.h + Math.max(6, size.height * .02);
        geo.offX = spec.pane ? 0 : size.width * .3224;
        S.geo = geo;
        S.P.staging(ctx);
        const trayRows = Math.max(2, Math.ceil(S.staged.size / 4));
        geo.binY = spec.pane ? (S.staged.size
          ? Math.min(size.height * .49, Math.max(size.height * .392, size.height * .07 + trayRows * geo.pitchY))
          : geo.head) : 0;
        geo.colH = spec.pane ? size.height - geo.binY - barH - 3 : size.height * .821;
        if (spec.pane) geo.w = Math.min(260, Math.max(170, size.width * .205));
        else {
          geo.colW = (size.width - geo.offX - size.width * .019 * (k - 1)) / k;
          geo.w = Math.min((geo.offX - size.width * .0226) * .795, geo.colW - 2 * geo.pad);
        }
        if (spec.pane) geo.colW = geo.w + 2 * geo.pad;
        geo.pitchX = geo.colW + size.width * (spec.pane ? .026 : .019);
        const boardW = spec.pane ? (k - 1) * geo.pitchX + geo.colW : size.width;
        return { size, n, k, barH, wordy, boardW, boardH: size.height - barH };
      },
      trayPositions: (base, S) => (ctx, L) => {
        const { geo, spec, staged } = S;
        const stagedItems = spec.items.filter((id) => staged.has(id));
        const tNum = stagedItems.length;
        const trayW = geo.w;
        const tW = geo.offX - L.size.width * .0226;
        const tRoom = geo.colH - geo.head * .8 - 2 * geo.pad - geo.h;
        const tPitch = tNum > 1 ? Math.min(geo.pitchY, tRoom / (tNum - 1)) : geo.pitchY;
        S.trayPositions = {};
        stagedItems.forEach((id, i) => {
          S.trayPositions[id] = spec.pane
            ? { x: L.size.width * .012 + (i % 4) * L.size.width * .227, y: L.size.height * .07 + Math.floor(i / 4) * geo.pitchY, w: geo.w, h: geo.h }
            : { x: (tW - trayW) / 2, y: geo.head * .8 + geo.pad + i * tPitch, w: trayW, h: geo.h };
        });
      },
      tray: (base, S) => (ctx, wrap, L) => {
        const { util } = ctx;
        const { geo, spec, board } = S;
        if (spec.pane) util.el('div', 'tray-label', board, 'Cards (drag to a column):');
        else {
          const tp = util.el('div', 'tray-panel', board);
          Object.assign(tp.style, { left: '0px', top: '0px', width: (geo.offX - L.size.width * .0226) + 'px', height: geo.colH + 'px' });
          util.el('div', 'tray-head', tp, 'Cards to sort').style.height = (geo.head * .8) + 'px';
        }
        S.P.trayPositions(ctx, L);
        return {};
      },
      columnBegin: (base, S) => (ctx, col, c, ci, L) => {
        const { geo, spec, extra } = S;
        extra.drops = extra.drops || {};
        col.style.left = (geo.offX + ci * geo.pitchX) + 'px';
        col.style.top = geo.binY + 'px';
        col.style.height = geo.colH + 'px';
        if (!spec.pane) {
          const d = ctx.util.el('div', 'ro-drop', col, 'Drop cards here');
          d.style.top = (geo.head + geo.pad) + 'px';
          extra.drops[c] = d;
        }
      },
      counts: (base, S) => (ctx, cols, counts) => () => {
        for (const c of S.spec.columns) {
          const items = ctx.model.columns[c] || [];
          counts[c].textContent = String(items.length);
          if (S.extra.drops[c]) S.extra.drops[c].hidden = items.some((id) => !S.staged.has(id));
        }
      },
      slotRect: (base, S) => (i, c, n) => {
        const { geo, spec } = S;
        const room = geo.colH - geo.head - 2 * geo.pad - geo.h;
        const pitch = n > 1 ? Math.min(geo.pitchY, room / (n - 1)) : geo.pitchY;
        const ci = spec.columns.indexOf(c);
        return [geo.offX + ci * geo.pitchX + geo.pad, geo.binY + geo.head + geo.pad + i * pitch, geo.w, geo.h];
      },
      groupAt: (base, S) => (c) => {
        const { geo, spec } = S;
        const x = c[0] + S.P.dragScrollDelta() + S.trayDelta.x;
        return spec.columns.reduce((best, col, i) => {
          const near = Math.max(geo.offX + i * geo.pitchX - x, x - (geo.offX + i * geo.pitchX + geo.colW), 0);
          return !best || near < best.distance ? { col, distance: near } : best;
        }, null).col;
      },
      dragStart: (base, S) => (id) => {
        const { paneEl, staged, spec, ctx } = S;
        S.dragScrollStart = paneEl ? paneEl.scrollLeft : 0;
        S.trayDelta = { x: 0, y: 0 };
        if (staged.has(id)) {
          const c = spec.columns.find((col) => ctx.model.columns[col].includes(id));
          const items = ctx.model.columns[c];
          const p = S.P.slotRect(items.indexOf(id), c, items.length);
          S.trayDelta = { x: S.trayPositions[id].x - p[0], y: S.trayPositions[id].y - p[1] };
        }
      },
      kanbanTitle: (base, S) => (ctx, card, lab, L) => {
        const t = ctx.util.el('span', 'ro-t' + (lab.title.length > 22 ? ' wrap' : ''), card, lab.title);
        if (L.wordy) t.style.fontSize = '13px';
        return t;
      },
      kanbanCard: (base, S) => (ctx, card, lab) => {
        for (const line of (lab.meta || []).slice(0, 1)) ctx.util.el('div', 'ro-meta', card, line);
        if (lab.badges && lab.badges.length) {
          const badges = ctx.util.el('div', 'ro-badges', card);
          for (const badge of lab.badges.slice(0, 2)) {
            const b = ctx.util.el('span', '', badges, badge.text);
            b.style.background = badge.color || '#526d96';
          }
        }
      },
    },
  },
});
