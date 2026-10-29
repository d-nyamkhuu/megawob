// Keeps this site's compact board, bottom staging tray, and live sidebar progress display.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-05',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { dragScroll: true, staging: true },
  template: 'reorder-items/cards',
  design: {
    chromeHints: false,
    tray: false,
    realStaging: true,
    avatars: false,
    parts: {
      kanbanSize: (base, S) => (ctx, wrap) => {
        const size = {
          width: Math.min(ctx.size.width, ctx.stage.clientWidth) - 34,
          height: Math.min(ctx.size.height, ctx.stage.clientHeight) - 40,
        };
        Object.assign(wrap.style, { position: 'absolute', left: '16px', top: '14px',
          width: size.width + 'px', height: size.height + 'px' });
        return size;
      },
      kanbanFit: (base, S) => (ctx, size) => {
        const { spec } = S;
        const geo = S.geo = {};
        const n = spec.items.length;
        const k = (spec.pane ? (spec.staging ? 1 : 0) : 0) + spec.columns.length;
        const barH = spec.pane ? 22 : 0;
        geo.head = Math.max(34, size.height * .083);
        geo.pad = Math.max(9, size.width * .012);
        geo.binY = 0;
        const wordy = spec.items.some((id) => spec.labels[id].title.length > 16);
        geo.h = Math.max(34, size.height * .086);
        geo.pitchY = geo.h + Math.max(8, size.height * .026);
        const trayRows = Math.max(3, Math.ceil(n / 4));
        geo.trayTop = size.height - barH - 3 - (size.height * .088 + trayRows * geo.pitchY);
        geo.trayInset = size.width * .015;
        geo.trayPitchX = size.width * .247;
        geo.trayHead = size.height * .077;
        geo.colH = spec.pane || !spec.staging ? size.height - barH : geo.trayTop - size.height * .038;
        // Crowded columns must leave each card's center clear of the next card.
        if (spec.pane) geo.h = Math.min(geo.h,
          Math.floor(2 * (geo.colH - geo.head - 2 * geo.pad - 2 * (n - 1)) / (n + 1)));
        geo.w = spec.pane ? Math.min(260, Math.max(170, size.width * .205))
          : Math.min(size.width * .231, (size.width - 21 * (k - 1)) / k - 2 * geo.pad);
        geo.colW = spec.pane ? Math.max(geo.w + 2 * geo.pad, size.width * .316)
          : (size.width - size.width * .017 * (k - 1)) / k;
        geo.pitchX = geo.colW + size.width * .017;
        const count = spec.pane ? k : spec.columns.length;
        const boardW = (count - 1) * geo.pitchX + geo.colW;
        return { size, n, k, barH, wordy, boardW, boardH: size.height - barH };
      },
      paneWidth: (base, S) => (ctx, L) => Math.min(L.size.width - 3, L.boardW - 40),
      tray: (base, S) => (ctx, wrap, L) => {
        if (S.spec.pane || !S.spec.staging) return {};
        const { util } = ctx;
        const { board, geo, spec } = S;
        const { size } = L;
        const label = util.el('div', 'tray-label', board, 'Cards (drag to a column)');
        label.style.top = (geo.trayTop + size.height * .029) + 'px';
        const box = util.el('div', 'tray-box', board);
        box.dataset.role = 'staging';
        Object.assign(box.style, { left: '0px', top: geo.trayTop + 'px', width: L.boardW + 'px',
          height: (size.height - L.barH - 3 - geo.trayTop) + 'px' });
        S.extra.stagingEl = box;
        return { [spec.staging]: box };
      },
      columnIds: (base, S) => () => S.spec.pane && S.spec.staging
        ? [S.spec.staging, ...S.spec.columns] : S.spec.columns,
      paneColumns: (base, S) => () => Object.fromEntries(
        (S.spec.staging ? [S.spec.staging, ...S.spec.columns] : S.spec.columns)
          .map((c, i) => [c, [i * S.geo.pitchX, i * S.geo.pitchX + S.geo.colW]])),
      column: (base, S) => (ctx, col, h, c) =>
        ctx.util.el('span', '', h, c === S.spec.staging ? 'Unassigned' : S.spec.colLabels[c]),
      cardPos: (base, S) => (c, i, n) => {
        const { geo, spec, layout: L } = S;
        if (c === spec.staging && !spec.pane) {
          return [geo.trayInset + (i % 4) * geo.trayPitchX,
            geo.trayTop + geo.trayHead + Math.floor(i / 4) * geo.pitchY];
        }
        const index = c === spec.staging ? 0 : (spec.columns.indexOf(c) + (spec.staging && spec.pane ? 1 : 0));
        const room = geo.colH - geo.head - 2 * geo.pad - geo.h;
        const pitch = n > 1 ? Math.min(geo.pitchY, room / (n - 1)) : geo.pitchY;
        return [index * geo.pitchX + geo.pad, geo.binY + geo.head + geo.pad + i * pitch];
      },
      slotRect: (base, S) => (i, c, n) => [...S.P.cardPos(c, i, n), S.geo.w, S.geo.h],
      groupAt: (base, S) => (point) => {
        const { spec, geo, paneEl, layout } = S;
        if (spec.staging && !spec.pane && point[1] >= geo.trayTop) return spec.staging;
        const x = point[0] + S.P.dragScrollDelta();
        const groups = spec.pane && spec.staging ? [spec.staging, ...spec.columns] : spec.columns;
        return groups.reduce((best, c, i) => {
          const near = Math.max(i * geo.pitchX - x, x - (i * geo.pitchX + geo.colW), 0);
          return !best || near < best.distance ? { col: c, distance: near } : best;
        }, null).col;
      },
      columnsReady: (base, S) => (ctx) => {
        const progress = document.querySelector('.progress-categories');
        S.extra.progressCounts = {};
        for (const c of S.spec.columns) {
          const row = ctx.util.el('div', 'progress-row', progress);
          ctx.util.el('span', 'progress-circle', row);
          ctx.util.el('span', 'progress-name', row, S.spec.colLabels[c]);
          S.extra.progressCounts[c] = ctx.util.el('span', 'progress-count', row);
        }
      },
      columnsChanged: (base, S) => (columns) => {
        S.sortable.set(columns);
        S.ctx.update({ ...S.ctx.model, columns });
        S.showCounts();
      },
      counts: (base, S) => (ctx, cols, counts, L) => {
        const updateBase = base(ctx, cols, counts, L);
        return () => {
          updateBase();
          const { spec } = S;
          let placed = 0;
          for (const c of spec.columns) {
            const visible = ctx.model.columns[c] || [];
            cols[c].classList.toggle('occupied', visible.length > 0);
            counts[c].textContent = String(visible.length);
            S.extra.progressCounts[c].textContent = String(visible.length);
            placed += visible.length;
          }
          if (spec.staging && spec.pane) {
            const unassigned = (ctx.model.columns[spec.staging] || []).length;
            counts[spec.staging].textContent = String(unassigned);
            cols[spec.staging].classList.toggle('occupied', unassigned > 0);
          }
          document.querySelector('.side-count').textContent = placed + ' / ' + spec.items.length + ' placed';
          document.querySelector('.side-fill').style.width = (placed / spec.items.length * 100) + '%';
        };
      },
    },
  },
});
