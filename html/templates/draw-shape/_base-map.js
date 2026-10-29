/* draw-shape/_base-map: map implementations delegated by the matching reference units.
 * Their scope S keeps every existing design override live, including keyHandler writes. */
(function () {
  'use strict';

  function drawMap(S, B) {
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const land = rng.pick(['#f3f1ea', '#eef0e6', '#f1efe9']);
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: land }, svg);
        // Blocks.
        const blocks = util.svg('g', { opacity: 0.55 }, svg);
        for (let i = 0; i < 14; i++) {
          const x = rng.float(0, W - 40);
          const y = rng.float(0, H - 30);
          util.svg('rect', { x, y, width: rng.float(24, 70), height: rng.float(18, 50), rx: 3, fill: rng.pick(['#e2ddd2', '#dcd8cd', '#e6e1d6']) }, blocks);
        }
        if (spec.river) {
          const pts = [];
          for (let i = 0; i <= 40; i++) {
            const x = (i / 40) * spec.board.w;
            pts.push([x, spec.river.y0 + spec.river.amp * Math.sin(x * 4 + spec.river.phase)]);
          }
          util.svg('polyline', { points: S.fmtPx(pts, px), fill: 'none', stroke: '#a5cbe6', 'stroke-width': 0.05 * scale, 'stroke-linecap': 'round', 'pointer-events': 'none' }, svg);
        }
        // A decorative park.
        const [pxx, pyy] = [rng.float(0.1, 0.9) * W, rng.float(0.1, 0.9) * H];
        util.svg('ellipse', { cx: pxx, cy: pyy, rx: rng.float(30, 60), ry: rng.float(20, 40), fill: '#cfe3c1', opacity: 0.8 }, svg);
        for (const s of spec.streets) {
          const a = px(s.a);
          const b = px(s.b);
          util.svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#ffffff', 'stroke-width': rng.pick([7, 9, 11]), 'stroke-linecap': 'round' }, svg);
          const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
          const t = rng.float(0.15, 0.3);
          const at = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
          const rot = Math.abs(ang) > 90 ? ang + 180 : ang;
          util.svg('text', { x: at[0], y: at[1] - 7, class: 'dw-street', transform: `rotate(${rot.toFixed(1)} ${at[0].toFixed(1)} ${at[1].toFixed(1)})` }, svg).textContent = s.name;
        }
      }

  function drawTileMap(S, B) {
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: rng.pick(['#f1efe6', '#eeeee3', '#f3f0e8']) }, svg);
        const cols = 5;
        const tw = W / cols;
        const rows = Math.ceil(H / tw);
        const tiles = util.svg('g', {}, svg);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = c * tw;
            const y = r * tw;
            const w = Math.min(tw, W - x);
            const h = Math.min(tw, H - y);
            util.svg('rect', { x, y, width: w, height: h, fill: rng.bool(0.5) ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.03)' }, tiles);
            for (let k = 0, n = rng.int(3, 6); k < n; k++) {
              const bw = rng.float(16, 40);
              const bh = rng.float(12, 30);
              util.svg('rect', { x: x + rng.float(4, Math.max(5, w - bw - 4)), y: y + rng.float(4, Math.max(5, h - bh - 4)), width: bw, height: bh, rx: 2,
                fill: rng.pick(['#e1dccd', '#dad6c9', '#e6e0d1']), opacity: 0.8 }, tiles);
            }
            if (rng.bool(0.25)) util.svg('ellipse', { cx: x + rng.float(0.25, 0.75) * w, cy: y + rng.float(0.25, 0.75) * h, rx: rng.float(16, 32), ry: rng.float(12, 22), fill: '#c9e0b9', opacity: 0.85 }, tiles);
          }
        }
        if (spec.river) {
          const pts = [];
          for (let i = 0; i <= 40; i++) {
            const x = (i / 40) * spec.board.w;
            pts.push([x, spec.river.y0 + spec.river.amp * Math.sin(x * 4 + spec.river.phase)]);
          }
          util.svg('polyline', { points: S.fmtPx(pts, px), fill: 'none', stroke: '#a9cde6', 'stroke-width': 0.05 * scale, 'stroke-linecap': 'round', 'pointer-events': 'none' }, svg);
        }
        const seams = util.svg('g', { stroke: 'rgba(60,70,80,.16)', 'stroke-width': 1, 'pointer-events': 'none' }, svg);
        for (let c = 1; c < cols; c++) util.svg('line', { x1: c * tw, y1: 0, x2: c * tw, y2: H }, seams);
        for (let r = 1; r < rows; r++) util.svg('line', { x1: 0, y1: r * tw, x2: W, y2: r * tw }, seams);
        for (const s of spec.streets) {
          const a = px(s.a);
          const b = px(s.b);
          util.svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#b9b4a4', 'stroke-width': rng.pick([9, 11, 13]), 'stroke-linecap': 'round', 'pointer-events': 'none' }, svg);
          util.svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#ffffff', 'stroke-width': rng.pick([6, 8, 10]), 'stroke-linecap': 'round', 'pointer-events': 'none' }, svg);
          const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
          const t = rng.float(0.15, 0.3);
          const at = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
          const rot = Math.abs(ang) > 90 ? ang + 180 : ang;
          util.svg('text', { x: at[0], y: at[1] - 7, class: 'dw-street', transform: `rotate(${rot.toFixed(1)} ${at[0].toFixed(1)} ${at[1].toFixed(1)})` }, svg).textContent = s.name;
        }
      }

  function buildPolygon(S, B) {
        const { ctx, svg, px, W, H } = B;
        const { util, rng, spec } = ctx;
        if (B.flavor === 'atlas') S.drawTileMap(B);
        else S.drawMap(B);
        if (spec.mode === 'outline') {
          const fill = { lake: '#9cc7e8', park: '#b9dba5', campus: '#d6d0e8', lot: '#d9d6d0' }[spec.regionKind];
          const edge = { lake: '#6aa3cf', park: '#7fb86a', campus: '#a499c9', lot: '#a8a49c' }[spec.regionKind];
          util.svg('polygon', { points: S.fmtPx(spec.region, px), fill, stroke: edge, 'stroke-width': 1.5, 'pointer-events': 'none' }, svg);
          const cx = spec.region.reduce((a, p) => a + p[0], 0) / spec.region.length;
          const cy = spec.region.reduce((a, p) => a + p[1], 0) / spec.region.length;
          const [lx, ly] = px([cx, cy]);
          util.svg('text', { x: lx, y: ly + 4, class: 'dw-area' }, svg).textContent = spec.name;
          const ink = rng.pick(['#d6336c', '#e8590c', '#7048e8']);
          const pen = util.svg('polyline', { fill: 'none', stroke: ink, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', points: '' }, svg);
          const stroke = S.env.ui.stroke(svg, {
            ...B.frame,
            strokes: ctx.model.strokes,
            render: (points) => pen.setAttribute('points', S.fmtPx(points, px)),
            onStroke: (points, strokes) => ctx.update({ strokes }),
            onChange: (strokes) => ctx.update({ strokes }),
            label: 'outline',
          });
          B.hint(rng.pick(['Hold the mouse button and draw a loop around the area. A new loop replaces the old one.', 'Draw around the area in one stroke.']));
          return { sync: (m) => stroke.set(m.strokes), locate: (t) => (t.point ? stroke.locate(t.point) : null) };
        }
        // Pins mode.
        const shapeG = util.svg('g', {}, svg);
        const pinsG = util.svg('g', {}, svg);
        spec.pins.forEach((p, i) => {
          const [x, y] = px(p);
          const g = util.svg('g', { class: 'dw-pin' }, pinsG);
          util.svg('path', { d: `M${x},${y} c-4,-7 -11,-11 -11,-18 a11,11 0 1,1 22,0 c0,7 -7,11 -11,18z`, fill: '#d6336c', stroke: '#fff', 'stroke-width': 1.5 }, g);
          util.svg('text', { x, y: y - 19 }, g).textContent = String(i + 1);
          util.svg('circle', { cx: x, cy: y, r: 2.2, fill: '#3b0b1f' }, g);
        });
        const drawBtn = S.button(util, B.bar, 'polygon', rng.pick(['Draw area', 'New zone', 'Draw shape']), { role: 'tool' });
        util.el('span', 'sep', B.bar);
        const undoBtn = S.button(util, B.bar, 'undo', 'Undo point', { role: 'control', kbd: spec.keys ? '⌫' : null });
        const clearBtn = S.button(util, B.bar, 'clear', 'Clear', { role: 'control' });
        drawBtn.addEventListener('click', () => { if (!ctx.model.drawing) { ctx.log('draw-area'); B.up({ ...ctx.model, drawing: true }); } });
        const undoPt = () => { const m = ctx.model; if (m.pts.length && !m.closed) B.up({ ...m, pts: m.pts.slice(0, -1) }); };
        undoBtn.addEventListener('click', undoPt);
        clearBtn.addEventListener('click', () => B.up({ ...ctx.model, pts: [], closed: false }));
        const close = () => { const m = ctx.model; if (m.drawing && !m.closed && m.pts.length >= 3) { ctx.log('close'); B.up({ ...m, closed: true }); } };
        const toBoard = B.toBoard;
        svg.addEventListener('click', (e) => {
          const m = ctx.model;
          if (!m.drawing || m.closed) return;
          const p = toBoard([e.clientX, e.clientY]);
          const pxd = (q) => { const a = px(q); const r = svg.getBoundingClientRect(); return Math.hypot(a[0] + r.left - e.clientX, a[1] + r.top - e.clientY); };
          if (m.pts.length >= 3 && pxd(m.pts[0]) <= 10) { close(); return; }
          if (m.pts.length && pxd(m.pts[m.pts.length - 1]) <= 4) return; // second click of a double-click
          B.up({ ...m, pts: m.pts.concat([p]) });
        });
        svg.addEventListener('dblclick', close);
        if (spec.keys) {
          S.keyHandler = (e) => {
            if (e.key === 'Enter') { e.preventDefault(); close(); } else if (e.key === 'Backspace' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z')) { e.preventDefault(); undoPt(); }
          };
        }
        const col = rng.pick(['#1c63d6', '#7048e8', '#0b7285']);
        function sync(m) {
          drawBtn.setAttribute('aria-pressed', String(!!m.drawing));
          svg.style.cursor = m.drawing && !m.closed ? 'crosshair' : 'grab';
          shapeG.replaceChildren();
          if (m.pts.length) {
            const pts = S.fmtPx(m.pts, px);
            if (m.closed) util.svg('polygon', { points: pts, fill: col, 'fill-opacity': 0.22, stroke: col, 'stroke-width': 2.5 }, shapeG);
            else util.svg('polyline', { points: pts, fill: 'none', stroke: col, 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, shapeG);
            for (const q of m.pts) { const [x, y] = px(q); util.svg('circle', { cx: x, cy: y, r: 4.5, fill: '#fff', stroke: col, 'stroke-width': 2, 'pointer-events': 'none' }, shapeG); }
          }
          undoBtn.disabled = !m.pts.length || m.closed;
          clearBtn.disabled = !m.pts.length;
        }
        B.hint(rng.pick(['Click to add corners; click the first corner, double-click or press Enter to finish.',
          'Start with "Draw area", then click the map to place corners. Close the shape on the first corner or with a double-click.']));
        void W; void H;
        return {
          sync,
          locate(t) {
            const r = svg.getBoundingClientRect();
            const at = (q) => { const a = px(q); return [r.left + a[0], r.top + a[1]]; };
            if (t.pin !== undefined) return at(spec.pins[t.pin]);
            if (t.point) return at(t.point);
            if (t.tool) return S.env.util.center(drawBtn);
            if (t.control === 'undo') return S.env.util.center(undoBtn);
            if (t.control === 'clear') return S.env.util.center(clearBtn);
            return null;
          },
        };
      }

  env.template('draw-shape/_base-map', () => ({ drawMap, drawTileMap, buildPolygon }));
})();
