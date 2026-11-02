// Preserves the IRIX board's sampled geometry, real source tray, and icon led cards.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-02',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { dragScroll: true, staging: true },
  template: 'reorder-items/cards',
  design: {
    tray: true,
    realStaging: true,
    avatars: true,
    roundBoard: true,
    parts: {
      kanbanFit: (base, S) => (ctx, size) => {
        const { rng } = ctx, spec = S.spec;
        const n = spec.items.length, gids = spec.staging ? [spec.staging, ...spec.columns] : spec.columns;
        const k = spec.columns.length, barH = spec.pane ? 22 : 0;
        S.P.staging(ctx);
        // Keep the original scaffold's random draws, including values superseded by stage sizing.
        S.geo = { head: rng.int(34, 42), pad: rng.int(8, 10) };
        const wordy = spec.items.some((id) => spec.labels[id].title.length > 16);
        S.geo.h = wordy ? rng.int(48, 56) : rng.int(36, 44);
        S.geo.pitchY = S.geo.h + rng.int(6, 9);
        const maxColH = size.height - 36 - barH;
        const wantColH = S.geo.head + 2 * S.geo.pad + n * S.geo.pitchY;
        S.geo.colH = Math.min(maxColH, wantColH);
        if (spec.pane) S.geo.w = rng.int(180, 220);
        else {
          const maxW = Math.floor((size.width - 70) / k) - 56;
          S.geo.w = Math.min(maxW, rng.int(Math.min(190, maxW), Math.max(170, Math.min(250, maxW))));
        }
        S.geo.colW = S.geo.w + 2 * S.geo.pad;
        S.geo.pitchX = S.geo.colW + (spec.pane ? rng.int(12, 20) : rng.int(16, 36));

        const scale = size.width / 1020;
        const gap = Math.max(10, Math.round(16 * scale));
        S.geo.head = Math.max(34, Math.round(54 * scale));
        S.geo.pad = Math.max(8, Math.round(12 * scale));
        S.geo.colH = Math.max(120, Math.round(size.height * .56));
        if (!spec.pane) S.geo.colW = Math.floor((size.width - (k - 1) * gap) / k);
        // Leave three columns visible so source-to-destination drags need fewer pane trips.
        else S.geo.colW = Math.max(170, Math.round(280 * scale));
        S.geo.pitchX = S.geo.colW + gap;
        S.geo.w = Math.min(Math.round(225 * scale), S.geo.colW - 2 * S.geo.pad);
        S.geo.cardInsetX = Math.round((S.geo.colW - S.geo.w) / 2);
        S.geo.h = Math.max(32, Math.min(Math.round(60 * scale), Math.floor(size.height / 9)));
        S.geo.pitchY = S.geo.h + Math.max(4, Math.round(10 * scale));
        const groupCount = spec.pane ? gids.length : k;
        const boardW = Math.round((groupCount - 1) * S.geo.pitchX + S.geo.colW);
        S.geo.trayTop = S.geo.colH + Math.max(12, Math.round(16 * scale));
        S.geo.trayCols = 4;
        S.geo.trayPitchX = Math.floor(boardW / S.geo.trayCols);
        const trayRows = Math.max(2, Math.ceil(n / S.geo.trayCols));
        const groupSizes = gids.map((c) => (ctx.model.columns[c] || []).length);
        const maxStack = spec.pane ? Math.max(1, ...groupSizes) : Math.max(1, trayRows, ...groupSizes.filter((_, i) => gids[i] !== spec.staging));
        const fitCardH = Math.floor((size.height - 30 - S.geo.head - 2 * S.geo.pad) / maxStack) - 4;
        S.geo.h = Math.max(24, Math.min(S.geo.h, fitCardH));
        S.geo.pitchY = S.geo.h + 4;
        if (spec.pane) {
          S.geo.colH = size.height - 30;
          const stackRoom = S.geo.colH - S.geo.head - 2 * S.geo.pad;
          S.geo.h = Math.max(12, Math.min(S.geo.h, Math.floor(2 * stackRoom / (maxStack + 1)) - 4));
          S.geo.pitchY = S.geo.h + 4;
        }
        let trayH = S.geo.head + trayRows * S.geo.pitchY + S.geo.pad;
        if (spec.staging && !spec.pane) {
          const trayGap = Math.max(8, Math.round(12 * scale));
          S.geo.trayHead = Math.max(24, Math.round(42 * scale));
          const available = size.height - 8 - trayGap - S.geo.head - S.geo.trayHead - 3 * S.geo.pad;
          const destinationRows = Math.max(3, Math.ceil(n / k) + 1, ...groupSizes.filter((_, i) => gids[i] !== spec.staging));
          S.geo.h = Math.max(14, Math.min(S.geo.h, Math.floor(available / (trayRows + destinationRows)) - 4));
          S.geo.pitchY = S.geo.h + Math.max(4, Math.round(10 * scale));
          if ((trayRows + destinationRows) * S.geo.pitchY > available) S.geo.pitchY = S.geo.h + 4;
          S.geo.w = Math.min(S.geo.w, S.geo.trayPitchX - 2 * S.geo.pad);
          S.geo.cardInsetX = Math.round((S.geo.colW - S.geo.w) / 2);
          trayH = S.geo.trayHead + trayRows * S.geo.pitchY + S.geo.pad;
          S.geo.colH = size.height - trayGap - trayH - 8;
          S.geo.trayTop = S.geo.colH + trayGap;
        }
        const boardH = spec.staging && !spec.pane ? Math.min(size.height - 8, S.geo.trayTop + trayH) : S.geo.colH;
        S.geo.boardH = boardH;
        return { size, n, k, barH, wordy, boardW, boardH };
      },
      paneWidth: (base, S) => (ctx, L) => {
        const { size } = L, { rng } = ctx, { geo, spec } = S;
        const gids = spec.staging ? [spec.staging, ...spec.columns] : spec.columns;
        const boardW = Math.round((gids.length - 1) * geo.pitchX + geo.colW);
        // Preserve the draw, but use the full stage width for the scrolling workspace.
        rng.float(2.2, 3.4);
        return Math.floor(Math.min(size.width, boardW - 40));
      },
      kanbanBoard: (base, S) => (ctx, L) => {
        const { rng } = ctx;
        const fontSize = rng.int(14, 16);
        Object.assign(S.board.style, { width: L.boardW + 'px', height: L.boardH + 'px', fontSize: fontSize + 'px' });
      },
      tray: (base, S) => (ctx, wrap, L) => {
        const { util } = ctx, { geo, spec, board } = S;
        const groups = {};
        if (spec.staging && !spec.pane) {
          const tray = util.el('section', 'cards-tray', board);
          tray.dataset.role = 'column';
          Object.assign(tray.style, { left: '0px', top: geo.trayTop + 'px', width: L.boardW + 'px', height: (geo.trayHead + Math.max(2, Math.ceil(L.n / 4)) * geo.pitchY + geo.pad) + 'px' });
          const title = util.el('div', 'cards-tray-title', tray, 'Cards  (drag from here)');
          title.style.height = geo.trayHead + 'px';
          groups[spec.staging] = tray;
          S.extra.trayHeading = title;
        }
        return groups;
      },
      columnIds: (base, S) => () => S.spec.pane && S.spec.staging ? [S.spec.staging, ...S.spec.columns] : S.spec.columns,
      paneColumns: (base, S) => () => {
        const { geo, spec } = S;
        const groups = spec.staging ? [spec.staging, ...spec.columns] : spec.columns;
        return Object.fromEntries(groups.map((c, i) => [c, [i * geo.pitchX, i * geo.pitchX + geo.colW]]));
      },
      column: (base, S) => (ctx, col, h, c, ci, L) => {
        const { util } = ctx, { geo, spec } = S;
        if (c !== spec.staging) util.el('i', 'column-icon', h).innerHTML = env.irixIcon(env.irixCategoryIcon(spec.colLabels[c]));
        const caption = c === spec.staging ? 'Cards' : spec.colLabels[c];
        const heading = util.el('span', '', h, caption);
        const scale = L.size.width / 1020;
        heading.style.fontSize = Math.min(28 * scale, Math.max(12, (geo.colW - 105 * scale) / (caption.length * .44))) + 'px';
        return heading;
      },
      counts: (base, S) => (ctx, cols, counts) => () => {
        for (const c of S.spec.columns) counts[c].textContent = String((ctx.model.columns[c] || []).length);
      },
      slotRect: (base, S) => (i, c, n) => {
        const { geo, spec } = S;
        if (c === spec.staging && !spec.pane) return [geo.pad + (i % 4) * geo.trayPitchX, geo.trayTop + geo.trayHead + geo.pad + Math.floor(i / 4) * geo.pitchY, geo.w, geo.h];
        const room = geo.colH - geo.head - 2 * geo.pad - geo.h;
        const pitch = n > 1 ? Math.min(geo.pitchY, room / (n - 1)) : geo.pitchY;
        const ci = spec.pane && spec.staging ? [spec.staging, ...spec.columns].indexOf(c) : spec.columns.indexOf(c);
        return [ci * geo.pitchX + (geo.cardInsetX ?? geo.pad), geo.head + geo.pad + i * pitch, geo.w, geo.h];
      },
      groupAt: (base, S) => (c) => {
        const { geo, spec } = S, x = c[0] + S.P.dragScrollDelta(), y = c[1];
        if (spec.staging && !spec.pane && y >= geo.trayTop) return spec.staging;
        const destinations = spec.pane ? (spec.staging ? [spec.staging, ...spec.columns] : spec.columns) : spec.columns;
        return destinations.reduce((best, col, i) => {
          const distance = Math.max(i * geo.pitchX - x, x - (i * geo.pitchX + geo.colW), 0);
          return !best || distance < best.distance ? { col, distance } : best;
        }, null).col;
      },
      dropRule: (base, S) => (c, slots) => {
        const x = c[0] + S.P.dragScrollDelta();
        let best = 0, distance = Infinity;
        slots.forEach((r, i) => {
          const d = Math.hypot(r.x + r.w / 2 - x, r.y + r.h / 2 - c[1]);
          if (d < distance) { distance = d; best = i; }
        });
        return best;
      },
      kanbanCardBegin: (base, S) => (ctx, card, lab) => {
        if (S.geo.h < 30) card.classList.add('compact');
        ctx.util.el('i', 'card-icon', card).innerHTML = env.irixIcon(env.irixItemIcon(lab.title));
      },
    },
  },
});
