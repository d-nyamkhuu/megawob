// Design on templates/reorder-items/cards.js.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-06',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { dragScroll: true, staging: true, boardSize: { columns: 2, perColumn: 6 } },
  template: 'reorder-items/cards',
  design: {
    realStaging: true,
    kanbanHead: [34, .086],
    columnGap: .006,
    kanbanWidth: .205,
    roundBoard: false,
    roundPane: false,
    parts: {
      staging: (base, S) => (ctx) => { S.extra.activeColumns = ctx.model.columns; base(ctx); },
      trayFit: (base, S) => (ctx, size) => {
        const { geo, spec } = S;
        geo.stageWidth = size.width;
        geo.h = Math.max(spec.ordered ? 60 : 36, size.height * .092);
        geo.pitchY = geo.h + Math.max(8, size.height * .023);
        const rows6 = Math.max(2, Math.ceil(S.staged.size / 6));
        geo.trayTop = size.height * .074;
        geo.trayH = geo.trayTop + rows6 * geo.pitchY + size.height * .013;
        geo.binY = 0;
        geo.head = Math.max(30, size.height * .064);
        geo.trayGap = Math.max(8, size.height * .02);
        geo.colH = size.height - geo.trayH - (spec.pane ? 22 : 0) - geo.trayGap;
        geo.tp = (size.width - 2 * size.width * .012) / 6;
      },
      columnFit: (base, S) => (ctx, size) => {
        const { geo, spec } = S;
        if (!spec.pane) geo.w = Math.min(geo.w, (size.width - 2 * size.width * .012) / 6 - 17);
        else geo.colW = Math.max(geo.w + 2 * geo.pad, (size.width - size.width * .006) / 2);
        geo.pitchX = geo.colW + size.width * .006;
      },
      cardPos: (base, S) => (c, i, n) => {
        const { geo, spec, staged } = S;
        if (spec.staging && c === spec.columns.length) return [geo.stageWidth * .012 + (i % 6) * geo.tp + 6,
          geo.colH + geo.trayGap + geo.trayTop + Math.floor(i / 6) * geo.pitchY];
        if (!spec.pane && !spec.ordered && S.extra.activeColumns) {
          const ids = S.extra.activeColumns[spec.columns[c]] || [];
          i -= ids.slice(0, i).filter((id) => staged.has(id)).length;
          n -= ids.filter((id) => staged.has(id)).length;
        }
        const room = geo.colH - geo.head - 2 * geo.pad - geo.h;
        const rowsFit = Math.max(1, Math.floor((room + geo.h + 6) / (geo.h + 6)));
        const tracksFit = Math.max(1, Math.floor((geo.colW - 2 * geo.pad + 8) / (geo.w + 8)));
        const tracks = Math.min(tracksFit, Math.max(1, Math.ceil(n / rowsFit)));
        const rows = Math.ceil(n / tracks);
        const pitch = rows > 1 ? Math.min(geo.pitchY, room / (rows - 1)) : geo.pitchY;
        return [c * geo.pitchX + geo.pad + (i % tracks) * (geo.w + 8), geo.binY + geo.head + geo.pad + Math.floor(i / tracks) * pitch];
      },
      paneColumns: (base, S) => () => {
        const cols = base();
        if (S.spec.staging) cols[S.spec.staging] = [0, S.geo.stageWidth];
        return cols;
      },
      trayPositions: (base, S) => (ctx, L) => {
        const { spec, geo } = S, { size } = L;
        S.trayPositions = {};
        spec.items.filter((id) => S.staged.has(id)).forEach((id, i) => {
          S.trayPositions[id] = spec.pane ? { x: size.width * .012 + (i % 4) * size.width * .227,
            y: size.height * .07 + Math.floor(i / 4) * geo.pitchY, w: geo.w, h: geo.h }
            : { x: size.width * .012 + (i % 6) * geo.tp + 6,
              y: geo.colH + geo.trayGap + geo.trayTop + Math.floor(i / 6) * geo.pitchY, w: geo.w, h: geo.h };
        });
      },
      tray: (base, S) => (ctx, wrap, L) => {
        const { geo } = S, { size, barH } = L, { util } = ctx;
        const panel = util.el('div', 'tray-panel', S.board);
        Object.assign(panel.style, { top: (geo.colH + geo.trayGap) + 'px', height: (size.height - geo.colH - geo.trayGap - barH) + 'px' });
        const lab = util.el('div', 'tray-label', S.board);
        util.el('span', 'tray-caption', lab, 'Cards');
        lab.style.top = (geo.colH + geo.trayGap) + 'px';
        lab.style.height = (geo.trayTop * .67) + 'px';
        S.P.trayPositions(ctx, L);
        if (S.spec.staging) { panel.dataset.role = 'column'; return { [S.spec.staging]: panel }; }
        return {};
      },
      kanbanTitle: (base, S) => (ctx, card, lab, L) => {
        const t = ctx.util.el('span', 'ro-t' + (L.wordy ? ' wrap' : ''), card, lab.title);
        if (L.wordy) {
          let font = Math.min(25, L.size.width * .015);
          for (; font > 11; font -= .5) {
            const capacity = Math.floor((S.geo.w - 14) / (font * .6));
            let lines = 1, used = 0;
            for (const word of lab.title.split(/\s+/)) {
              if (used && used + 1 + word.length > capacity) { lines++; used = 0; }
              lines += Math.max(0, Math.ceil(word.length / Math.max(1, capacity)) - 1);
              used = used ? used + 1 + word.length : word.length;
            }
            if (lines * font * 1.21 <= S.geo.h - 6 - (lab.value && S.spec.ordered ? 18 : 0)) break;
          }
          t.style.setProperty('--card-font', font + 'px');
        }
        return t;
      },
      slotRect: (base, S) => (i, c, n) => [...S.P.cardPos(S.spec.staging && c === S.spec.staging ? S.spec.columns.length : S.spec.columns.indexOf(c), i, n), S.geo.w, S.geo.h],
      groupAt: (base, S) => (c) => {
        if (S.spec.staging && c[1] + S.trayDelta.y >= S.geo.colH + S.geo.trayGap) return S.spec.staging;
        return base(c);
      },
      columnsChanged: (base, S) => (columns) => {
        S.staged = new Set(S.spec.staging ? (columns[S.spec.staging] || []) : []);
        S.P.trayPositions(S.ctx, S.layout);
        S.trayDelta = { x: 0, y: 0 };
        S.extra.activeColumns = columns;
        S.sortable.set(columns);
        S.ctx.update({ ...S.ctx.model, columns });
        S.showCounts();
      },
      paneReady: (base, S) => (ctx) => { S.paneEl.scrollLeft = Math.max(0, Math.min(S.paneGeo.max, ctx.model.pane && ctx.model.pane.scroll || 0)); },
    },
  },
});
