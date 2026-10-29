// Design on templates/reorder-items/cards.js; keeps this site's bottom source tray and deterministic board fit.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-08',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { dragScroll: true, staging: true },
  template: 'reorder-items/cards',
  design: {
    realStaging: true,
    roundBoard: true,
    roundPane: true,
    parts: {
      kanbanFit: (base, S) => (ctx, size) => {
        const { spec, geo } = S;
        const k = spec.columns.length;
        const barH = spec.pane ? 22 : 0;
        const wordy = spec.items.some((id) => spec.labels[id].title.length > 16);
        S.geo = { head: Math.max(34, size.height * .075), pad: Math.max(9, size.width * .01), binY: 0 };
        const g = S.geo;
        S.P.staging(ctx);
        g.h = Math.max(46, size.height * .122);
        g.pitchY = g.h + Math.max(10, size.height * .028);
        const stagingItems = ctx.model.columns[spec.staging] || [];
        const trayRows = Math.max(2, Math.ceil(stagingItems.length / 4));
        const columnGap = 6;
        const lowTray = !spec.pane;
        if (lowTray) {
          g.h = Math.max(spec.ordered ? 78 : 42, size.height * .081);
          g.pitchY = g.h + Math.max(12, size.height * .027);
          g.trayCols = wordy && size.width < 1000 ? 4 : 6;
          const lowTrayRows = Math.max(2, Math.ceil(stagingItems.length / g.trayCols));
          g.trayHead = Math.max(32, size.height * .061);
          g.trayInset = Math.max(10, size.width * .01);
          const trayGap = Math.max(12, size.height * .027);
          const bottomGap = Math.max(30, size.height * .048);
          const sectionGap = Math.max(14, size.height * .027);
          const columnCapacity = Math.max(1, ...spec.columns.map((c) => Math.max(
            (ctx.model.columns[c] || []).length,
            spec.items.filter((id) => spec.member[id] === c).length,
          )));
          const available = size.height - bottomGap - g.trayHead - sectionGap - g.head - 2 * g.pad
            - lowTrayRows * trayGap - (columnCapacity - 1) * columnGap;
          g.h = Math.min(g.h, available / (lowTrayRows + columnCapacity));
          g.pitchY = g.h + trayGap;
          g.trayTop = size.height - Math.max(30, size.height * .048) - lowTrayRows * g.pitchY - g.trayHead;
          g.binY = 0;
          g.colH = g.trayTop - Math.max(14, size.height * .027);
        } else {
          const columnCapacity = Math.max(1, ...spec.columns.map((c) => Math.max(
            (ctx.model.columns[c] || []).length,
            spec.items.filter((id) => spec.member[id] === c).length,
          )));
          g.binY = Math.min(size.height * .49, Math.max(size.height * .392, size.height * .07 + trayRows * g.pitchY));
          g.colH = size.height - g.binY - barH - 3;
          const columnRoom = g.colH - g.head - 2 * g.pad - (columnCapacity - 1) * columnGap;
          const trayRoom = g.binY - size.height * .07 - (trayRows - 1) * Math.max(10, size.height * .028);
          g.h = Math.min(g.h, columnRoom / columnCapacity, trayRoom / trayRows);
          g.pitchY = g.h + Math.max(10, size.height * .028);
        }
        if (spec.pane) g.w = Math.min(260, Math.max(170, size.width * .205));
        else {
          g.w = Math.min(size.width * .205, (size.width - 28 * (k - 1)) / k - 2 * g.pad);
          if (lowTray) g.w = Math.min(
            (size.width - 2 * g.trayInset - (g.trayCols - 1) * size.width * .012) / g.trayCols,
            (size.width - size.width * .026 * (k - 1)) / k - 2 * g.pad,
          );
        }
        g.colW = spec.pane ? Math.max(g.w + 2 * g.pad, size.width * .316)
          : (size.width - size.width * .026 * (k - 1)) / k;
        if (lowTray) {
          g.trayPitchX = g.w + size.width * .012;
          g.trayPad = Math.max(10, size.height * .021);
        } else {
          g.trayTop = 0;
          g.trayHead = size.height * .07;
          g.trayPad = 0;
          g.trayInset = size.width * .012;
          g.trayCols = 4;
          g.trayPitchX = size.width * .227;
        }
        g.pitchX = g.colW + size.width * .026;
        const boardW = Math.round((k - 1) * g.pitchX + g.colW);
        return { size, n: spec.items.length, k, barH, wordy, boardW, boardH: size.height - barH };
      },
      tray: (base, S) => (ctx, wrap, L) => {
        const { util } = ctx;
        const { spec, geo, board } = S;
        const label = util.el('div', 'tray-label', board, 'Cards (drag from here)');
        const surface = util.el('div', 'tray-surface', board);
        if (!spec.pane) {
          Object.assign(surface.style, {
            top: geo.trayTop + 'px', width: L.boardW + 'px', height: (L.size.height - geo.trayTop) + 'px',
          });
          Object.assign(label.style, {
            top: geo.trayTop + 'px', width: L.boardW + 'px', height: geo.trayHead + 'px',
          });
          label.classList.add('low');
        } else {
          Object.assign(surface.style, { top: '0px', width: L.boardW + 'px', height: geo.binY + 'px' });
        }
        board.insertBefore(surface, label);
        const groups = {};
        if (spec.staging) {
          groups[spec.staging] = surface;
          surface.dataset.role = 'staging';
        }
        return groups;
      },
      columnReady: (base, S) => (ctx, col, h) => {
        col.style.setProperty('--hh', S.geo.head + 'px');
      },
      paneColumns: (base, S) => () => {
        const cols = Object.fromEntries(S.spec.columns.map((c, ci) => [c, [ci * S.geo.pitchX, ci * S.geo.pitchX + S.geo.colW]]));
        if (S.spec.staging) cols[S.spec.staging] = [0, S.paneEl.clientWidth];
        return cols;
      },
      cardPos: (base, S) => (c, i, n) => {
        const { geo } = S;
        if (c === -1) return [
          geo.trayInset + (i % geo.trayCols) * geo.trayPitchX,
          geo.trayTop + geo.trayHead + geo.trayPad + Math.floor(i / geo.trayCols) * geo.pitchY,
        ];
        const room = geo.colH - geo.head - 2 * geo.pad - geo.h;
        const pitch = n > 1 ? Math.min(geo.pitchY, room / (n - 1)) : geo.pitchY;
        return [c * geo.pitchX + geo.pad, geo.binY + geo.head + geo.pad + i * pitch];
      },
      slotRect: (base, S) => (i, c, n) => [
        ...S.P.cardPos(S.spec.columns.indexOf(c), i, n), S.geo.w, S.geo.h,
      ],
      groupAt: (base, S) => (c) => {
        const { spec, geo, paneEl } = S;
        if (spec.staging && (spec.pane ? c[1] < geo.binY : c[1] >= geo.trayTop)) return spec.staging;
        const x = c[0] + S.P.dragScrollDelta();
        return spec.columns.reduce((best, column, i) => {
          const near = Math.max(i * geo.pitchX - x, x - (i * geo.pitchX + geo.colW), 0);
          return !best || near < best.distance ? { col: column, distance: near } : best;
        }, null).col;
      },
      kanbanReady: (base, S) => (ctx) => {
        const n = S.spec.items.length;
        const k = S.spec.columns.length;
        const insBody = document.querySelector('.insp-body');
        if (insBody && !insBody.querySelector('.insp-meta')) {
          const meta = ctx.util.el('div', 'insp-meta', insBody);
          ctx.util.el('div', '', meta, 'Total cards: ' + n);
          ctx.util.el('div', '', meta, 'Columns: ' + k);
        }
      },
    },
  },
});
