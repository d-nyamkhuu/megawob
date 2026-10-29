// Design on reorder/cards; keeps the six column board and bottom staging tray geometry.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-04',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { dragScroll: true, staging: true },
  template: 'reorder-items/cards',
  design: {
    realStaging: true,
    roundBoard: true,
    roundPane: true,
    stagingLast: true,
    parts: {
      kanbanFit: (base, S) => (ctx, size) => {
        const { n, k } = { n: S.spec.items.length, k: S.spec.columns.length };
        const barH = S.spec.pane ? 22 : 0;
        const wordy = S.spec.items.some((id) => S.spec.labels[id].title.length > 16);
        S.P.staging(ctx);
        S.geo = { head: Math.max(32, size.height * .071), pad: Math.max(9, size.width * .01), binY: 0 };
        S.geo.h = Math.max(S.spec.ordered && wordy ? 42 : 34, size.height * .088);
        S.geo.pitchY = S.geo.h + Math.max(8, size.height * .021);
        const trayRows = Math.max(2, Math.ceil(n / 6));
        S.geo.trayHead = size.height * .071;
        S.geo.trayH = Math.min(size.height * .45, S.geo.trayHead + size.height * .025 + trayRows * S.geo.pitchY);
        const trayRoom = S.geo.trayH - S.geo.trayHead - size.height * .028;
        const trayGap = Math.min(Math.max(4, size.height * .021), trayRoom / (trayRows * 5));
        S.geo.h = Math.min(S.geo.h, (trayRoom - (trayRows - 1) * trayGap) / trayRows);
        S.geo.pitchY = S.geo.h + trayGap;
        S.geo.colH = size.height - S.geo.trayH - size.height * .025 - barH - 3;
        S.geo.trayW = size.width - (S.spec.pane ? 3 : 0);
        S.geo.w = (S.geo.trayW - size.width * .01 * 5 - 2 * S.geo.pad) / 6;
        S.geo.colW = S.spec.pane
          ? Math.max(S.geo.w + 2 * S.geo.pad, size.width * .316)
          : (size.width - size.width * .009 * (k - 1)) / k;
        S.geo.pitchX = S.geo.colW + size.width * .009;
        S.geo.trayTop = S.geo.colH + size.height * .025;
        const boardW = Math.round((k - 1) * S.geo.pitchX + S.geo.colW);
        return { size, n, k, barH, wordy, boardW, boardH: size.height - barH };
      },
      trayFit: () => () => {},
      paneColumns: (base, S) => () => ({
        ...Object.fromEntries(S.spec.columns.map((c, ci) => [c, [ci * S.geo.pitchX, ci * S.geo.pitchX + S.geo.colW]])),
        ...(S.spec.staging ? { [S.spec.staging]: [0, S.geo.trayW] } : {}),
      }),
      tray: (base, S) => (ctx, wrap, L) => {
        const { size } = L;
        const panel = ctx.util.el('div', 'tray-panel', S.board);
        Object.assign(panel.style, {
          left: '0px', top: S.geo.trayTop + 'px', width: S.geo.trayW + 'px', height: S.geo.trayH + 'px',
        });
        const label = ctx.util.el('div', 'tray-label', panel, 'Cards (drag to a column)');
        label.style.height = S.geo.trayHead + 'px';
        return S.spec.staging ? { [S.spec.staging]: panel } : {};
      },
      cardPos: (base, S) => (c, i, n) => {
        const room = S.geo.colH - S.geo.head - 2 * S.geo.pad - S.geo.h;
        const pitch = n > 1 ? Math.min(S.geo.pitchY, room / (n - 1)) : S.geo.pitchY;
        return [
          c * S.geo.pitchX + (S.spec.pane ? S.geo.pad : (S.geo.colW - S.geo.w) / 2),
          S.geo.binY + S.geo.head + S.geo.pad + i * pitch,
        ];
      },
      slotRect: (base, S) => (i, c, n) => c === S.spec.staging
        ? [S.geo.pad + (i % 6) * (S.geo.w + S.layout.size.width * .01), S.geo.trayTop + S.geo.trayHead + S.layout.size.height * .014 + Math.floor(i / 6) * S.geo.pitchY, S.geo.w, S.geo.h]
        : base(i, c, n),
      groupAt: (base, S) => (c) => {
        if (S.spec.staging && c[1] >= S.geo.trayTop) return S.spec.staging;
        const x = c[0] + S.P.dragScrollDelta();
        return S.spec.columns.reduce((best, col, i) => {
          const near = Math.max(i * S.geo.pitchX - x, x - (i * S.geo.pitchX + S.geo.colW), 0);
          return !best || near < best.distance ? { col, distance: near } : best;
        }, null).col;
      },
      dropRule: (base, S) => (c, slots) => {
        if (S.spec.staging && c[1] >= S.geo.trayTop) {
          let best = 0, distance = Infinity;
          slots.forEach((r, i) => {
            const d = Math.hypot(r.x + r.w / 2 - c[0], r.y + r.h / 2 - c[1]);
            if (d < distance) { distance = d; best = i; }
          });
          return best;
        }
        const x = c[0] + S.P.dragScrollDelta();
        let best = 0, distance = Infinity;
        slots.forEach((r, i) => {
          const d = Math.hypot(r.x + r.w / 2 - x, r.y + r.h / 2 - c[1]);
          if (d < distance) { distance = d; best = i; }
        });
        return best;
      },
    },
  },
});
