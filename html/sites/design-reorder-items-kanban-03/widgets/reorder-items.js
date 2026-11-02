// Design on templates/reorder-items/cards.js.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-kanban-03',
  name: 'design',
  split: 'train',
  scenarios: ['kanban'],
  traits: { dragScroll: true, staging: true },
  template: 'reorder-items/cards',
  design: {
    realStaging: true,
    kanbanHead: [34, .086],
    kanbanWidth: .264,
    columnGap: .019,
    roundBoard: true,
    roundPane: true,
    stagingLast: true,
    parts: {
      begin: (base, S) => () => { S.extra.sourceGrip = null; },
      trayFit: (base, S) => (ctx, size) => {
        if (!S.spec.pane) {
          S.geo.h = Math.max(40, size.height * .088);
          S.geo.pitchY = size.height * .103;
          S.geo.binY = size.height * .238;
          S.geo.head = Math.max(34, size.height * .0935);
          S.geo.colH = size.height - S.geo.binY - 3;
        }
      },
      columnFit: (base, S) => (ctx, size) => {
        S.geo.pitchX = S.geo.colW + size.width * (S.spec.pane ? .026 : .019);
      },
      tray: (base, S) => (ctx, wrap, L) => {
        const { size } = L, { util } = ctx, { spec, geo, board } = S;
        let pal = null, trayBody = null;
        if (!spec.pane || spec.staging) {
          pal = util.el('div', 'palette', spec.pane ? wrap : board);
          pal.dataset.role = 'staging';
          pal.classList.toggle('ordered', !!spec.ordered);
          Object.assign(pal.style, { left: size.width * 1.035 + 'px', top: '-4px', width: size.width * .294 + 'px',
            height: (spec.pane ? size.height * .75 : Math.max(size.height * .1 + S.staged.size * geo.pitchY, size.height * .75)) + 'px' });
          const ph = util.el('div', 'palette-h', pal);
          util.el('span', '', ph, 'Cards');
          util.el('i', '', ph);
          ph.style.height = size.height * .07 + 'px';
          if (spec.pane) {
            trayBody = util.el('div', 'palette-body', pal);
            Object.assign(trayBody.style, { left: size.width * .015 + 'px', right: size.width * .015 + 'px', top: size.height * .088 + 4 + 'px', bottom: '10px' });
          }
        }
        S.extra.trayBody = trayBody;
        return spec.staging ? { [spec.staging]: trayBody || pal } : {};
      },
      columnReady: (base, S) => (ctx, col, h, c, ci) => { col.classList.add('c' + (ci % 2)); },
      slotRect: (base, S) => (i, c, n) => {
        if (c !== S.spec.staging) return base(i, c, n);
        const { geo, layout: { size } } = S, trayBody = S.extra.trayBody;
        if (trayBody) {
          const br = S.board.getBoundingClientRect(), tr = trayBody.getBoundingClientRect();
          return [tr.left - br.left, tr.top - br.top + i * geo.pitchY - trayBody.scrollTop, trayBody.clientWidth - 2, geo.h];
        }
        return [size.width * 1.05, size.height * .088 + i * geo.pitchY, geo.w, geo.h];
      },
      dragStart: (base, S) => (id) => {
        S.dragScrollStart = S.paneEl ? S.paneEl.scrollLeft : 0;
        if (S.paneEl) {
          const card = S.cards[id], r = card.getBoundingClientRect(), wr = S.wrap.getBoundingClientRect();
          S.wrap.append(card);
          card.style.left = r.left - wr.left + 'px';
          card.style.top = r.top - wr.top + 'px';
        }
      },
      dragRect: () => (el, rect) => rect,
      pan: (base, S) => (el, rect, info) => {
        const { paneEl, paneGeo, board, EDGE_BAND, P } = S;
        if (info.dragging && paneEl) {
          const br = board.getBoundingClientRect(), pr = paneEl.getBoundingClientRect();
          const x = br.left + rect.x + rect.w / 2 + P.dragScrollDelta() - pr.left;
          const pw = pr.width;
          if (x <= pw + 1 && x > pw - EDGE_BAND) {
            const fraction = Math.min(1, (x - pw + EDGE_BAND) / EDGE_BAND);
            paneEl.scrollLeft = Math.max(paneEl.scrollLeft, S.dragScrollStart + fraction * (paneGeo.max - S.dragScrollStart));
          } else if (x >= -1 && x < EDGE_BAND) {
            const fraction = Math.min(1, (EDGE_BAND - x) / EDGE_BAND);
            paneEl.scrollLeft = Math.min(paneEl.scrollLeft, S.dragScrollStart * (1 - fraction));
          }
          P.mirrorPane(S.ctx);
          rect = { ...rect, x: rect.x + P.dragScrollDelta() };
        }
        return rect;
      },
      place: (base, S) => (el, rect, info) => {
        if (S.paneEl) {
          const parent = info.dragging ? S.wrap : info.group === S.spec.staging ? S.extra.trayBody : S.board;
          if (el.parentElement !== parent) parent.append(el);
          if (parent !== S.board) {
            const br = S.board.getBoundingClientRect(), pr = parent.getBoundingClientRect();
            rect = { ...rect, x: rect.x + br.left - pr.left + parent.scrollLeft, y: rect.y + br.top - pr.top + parent.scrollTop };
          }
          el.style.width = rect.w + 'px';
          el.style.height = rect.h + 'px';
        }
        base(el, rect, info);
      },
      groupAt: (base, S) => (c) => {
        const x = c[0] + S.P.dragScrollDelta();
        if (S.spec.staging && x - (S.paneEl ? S.paneEl.scrollLeft : 0) >= S.layout.size.width * 1.035) return S.spec.staging;
        return base(c);
      },
      columnsChanged: (base, S) => (columns) => {
        S.ctx.update({ ...S.ctx.model, columns });
        S.showCounts();
      },
      locate: (base, S) => (t) => {
        const { paneEl, paneGeo, sortable, geo, spec } = S;
        if (t.edge !== undefined) {
          const p = base(t), r = paneEl.getBoundingClientRect();
          return [p[0], Math.max(r.top + geo.binY + geo.head + 8, Math.min(r.bottom - 8, Number.isFinite(p[1]) ? p[1] : r.top + r.height / 2))];
        }
        if (t.pane !== undefined) {
          const r = paneEl.getBoundingClientRect();
          return [r.left + r.width / 2, r.top + r.height / 2];
        }
        if (t.column !== undefined) {
          const p = base(t), sourceGrip = S.extra.sourceGrip;
          if (sourceGrip && (t.item === undefined || t.item === sourceGrip.id)) { p[0] += sourceGrip.dx; p[1] += sourceGrip.dy; }
          return p;
        }
        if (t.item === undefined || t.slot !== undefined || t.thumb !== undefined || t.thumbAt !== undefined) return base(t);
        if (paneEl && spec.staging) {
          const pal = document.querySelector('.palette-body');
          const items = S.ctx.model.columns[spec.staging] || [];
          const i = items.indexOf(t.item);
          if (pal && i >= 0) {
            const y = i * geo.pitchY;
            if (y < pal.scrollTop) pal.scrollTop = y;
            else if (y + geo.h > pal.scrollTop + pal.clientHeight) pal.scrollTop = y + geo.h - pal.clientHeight;
          }
        }
        const point = sortable.locate(t.item), card = S.cards[t.item];
        S.extra.sourceGrip = null;
        if (!card) return point;
        const exposed = (x, y) => { const hit = document.elementFromPoint(x, y); return hit && (hit === card || card.contains(hit)); };
        if (exposed(point[0], point[1])) return point;
        const r = card.getBoundingClientRect();
        for (let y = r.top + 2; y < r.bottom - 1; y += 2) {
          for (const x of [r.left + r.width / 2, r.left + 18, r.right - 8]) {
            if (exposed(x, y)) {
              S.extra.sourceGrip = { id: t.item, dx: x - (r.left + r.width / 2), dy: y - (r.top + r.height / 2) };
              return [x, y];
            }
          }
        }
        return point;
      },
    },
  },
});
