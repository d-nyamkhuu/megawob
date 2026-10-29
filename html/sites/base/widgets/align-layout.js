/*
 * reference / layout / canvas: a design-tool style editor card (title bar with inert tool buttons and a zoom
 * label, rulers along the canvas in canvas px, a dotted grid) drawn 1:1, so a canvas px is a viewport px.
 *   align, spacing   rounded cards on the canvas; a press on a card body drags it freely (clamped to the
 *                    canvas, integer px). Locked cards (the pinned reference card, the end cards) show a lock
 *                    and a dashed outline and do not move. align draws its dashed guide line with a label.
 *                    There is no readout of any edge, centre or gap.
 *   mockup           boxes with a corner handle on each corner (a handle layer above all boxes, so overlapping
 *                    boxes never hide each other's handles); dragging a body moves the box, a handle moves its
 *                    corner and keeps the opposite one. The mockup thumbnail sits beside the canvas at half scale
 *                    with rulers in canvas units.
 *   columns          a table (header, three rows of fixed-width cell chips) clipped to its frame; each header
 *                    cell has a divider on its right edge; dragging it sets that column's width and shifts the
 *                    columns after it. The chip offset is the stated padding, so a fitted column looks centred.
 * All geometry rules live in env.familyDef.helpers (moveRect, resizeRect, setCol); this file maps pointer events onto
 * them and redraws from the model. The card's box never changes during an episode (the anchor).
 * locate(): { grab: i, dx?, dy? } a visible spot on card / box i (checked with elementFromPoint) plus an offset,
 * { handle: i, h, dx?, dy? } the corner handle, { div: c, dx? } the divider of column c.
 */
(function () {
  'use strict';

  const CSS = `
  .lo-card { position: absolute; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px 14px; background: var(--panel);
    border: 1px solid var(--line); border-radius: var(--lo-r); box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 10px 26px rgba(0,0,0,.06);
    user-select: none; box-sizing: border-box; }
  .lo-bar { display: flex; align-items: center; gap: 8px; height: 26px; }
  .lo-title { font-size: 15px; font-weight: 650; margin-right: auto; white-space: nowrap; }
  .lo-tool { width: 26px; height: 24px; border: 1px solid var(--line); border-radius: 5px; background: var(--panel); color: var(--muted);
    display: flex; align-items: center; justify-content: center; }
  .lo-tool svg { width: 14px; height: 14px; }
  .lo-tool.on { color: var(--accent); border-color: var(--accent); }
  .lo-zoom { font-size: 12px; color: var(--muted); padding: 0 4px; font-variant-numeric: tabular-nums; }
  .lo-body { display: flex; gap: 16px; align-items: flex-start; }
  .lo-pane { display: flex; flex-direction: column; gap: 4px; }
  .lo-cap { font-size: 11.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); }
  .lo-frame { display: grid; grid-template-columns: 30px auto; grid-template-rows: 16px auto; }
  .lo-rt, .lo-rl { position: relative; font-size: 9.5px; color: var(--muted); font-variant-numeric: tabular-nums; overflow: hidden; }
  .lo-rt { grid-column: 2; grid-row: 1; border-bottom: 1px solid var(--line); }
  .lo-rl { grid-column: 1; grid-row: 2; border-right: 1px solid var(--line); }
  .lo-rt i, .lo-rl i { position: absolute; background: var(--line); }
  .lo-rt i { top: 10px; width: 1px; height: 6px; }
  .lo-rl i { right: 0; height: 1px; width: 6px; }
  .lo-rt b, .lo-rl b { position: absolute; font-weight: 500; }
  .lo-rt b { top: 0; transform: translateX(3px); }
  .lo-rl b { right: 8px; transform: translateY(-5px); }
  .lo-canvas { grid-column: 2; grid-row: 2; position: relative; overflow: hidden; outline: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    background-color: color-mix(in srgb, var(--fg) 2.5%, var(--panel));
    background-image: radial-gradient(circle, color-mix(in srgb, var(--fg) 22%, transparent) 1px, transparent 1.4px);
    background-size: 10px 10px; background-position: -5px -5px; touch-action: none; }
  .lo-item { position: absolute; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 5px;
    border: 1.5px solid var(--lo-b); background: var(--lo-f); border-radius: 6px; cursor: grab; font-size: 12.5px; font-weight: 600;
    color: color-mix(in srgb, var(--lo-b) 55%, var(--fg)); overflow: hidden; white-space: nowrap; touch-action: none; }
  .lo-item.dragging { cursor: grabbing; box-shadow: 0 6px 16px rgba(0,0,0,.18); }
  .lo-item.locked { cursor: not-allowed; border-style: dashed; background: color-mix(in srgb, var(--lo-f) 55%, var(--panel)); }
  .lo-item svg { flex: none; width: 12px; height: 12px; }
  .lo-item.box { align-items: flex-start; justify-content: flex-start; padding: 5px 7px; font-size: 11.5px; }
  .lo-guide { position: absolute; pointer-events: none; z-index: 900; border: 0 dashed var(--accent); }
  .lo-guide.v { top: 0; bottom: 0; border-left-width: 2px; margin-left: -1px; }
  .lo-guide.h { left: 0; right: 0; border-top-width: 2px; margin-top: -1px; }
  .lo-guide span { position: absolute; font-size: 10px; font-weight: 600; color: #fff; background: var(--accent); padding: 1px 5px;
    border-radius: 3px; white-space: nowrap; }
  .lo-guide.v span { top: 2px; left: 4px; }
  .lo-guide.h span { left: 4px; top: 4px; }
  .lo-hl { position: absolute; inset: 0; pointer-events: none; z-index: 1000; }
  .lo-h { position: absolute; width: 10px; height: 10px; margin: -5px 0 0 -5px; box-sizing: border-box; background: #fff;
    border: 1.5px solid var(--accent); border-radius: 2px; pointer-events: auto; touch-action: none; }
  .lo-h.nw, .lo-h.se { cursor: nwse-resize; }
  .lo-h.ne, .lo-h.sw { cursor: nesw-resize; }
  .lo-thumb { position: relative; overflow: hidden; outline: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); pointer-events: none; }
  .lo-tbox { position: absolute; box-sizing: border-box; border: 1px solid var(--lo-b); background: var(--lo-f); font-size: 9.5px;
    font-weight: 600; padding: 2px 3px; overflow: hidden; white-space: nowrap; color: color-mix(in srgb, var(--lo-b) 55%, var(--fg)); }
  .lo-table { position: relative; overflow: hidden; background: var(--panel); outline: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); }
  .lo-th, .lo-td { position: absolute; box-sizing: border-box; overflow: hidden; }
  .lo-th { top: 0; height: 36px; display: flex; align-items: center; padding: 0 10px; font-size: 12.5px; font-weight: 650;
    background: color-mix(in srgb, var(--fg) 5%, var(--panel)); border-bottom: 1px solid var(--line); border-right: 1px solid var(--line);
    white-space: nowrap; }
  .lo-th span { overflow: hidden; text-overflow: ellipsis; }
  .lo-td { height: 34px; display: flex; align-items: center; border-bottom: 1px solid color-mix(in srgb, var(--fg) 7%, transparent); }
  .lo-chip { flex: none; height: 20px; box-sizing: border-box; border-radius: 10px; background: color-mix(in srgb, var(--accent) 18%, var(--panel));
    border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--line)); }
  .lo-div { position: absolute; top: 0; bottom: 0; width: 10px; margin-left: -5px; cursor: col-resize; z-index: 5; touch-action: none; }
  .lo-div::after { content: ''; position: absolute; left: 4px; width: 2px; top: 6px; height: 24px; border-radius: 1px;
    background: color-mix(in srgb, var(--fg) 30%, var(--line)); }
  .lo-div:hover::after, .lo-div.on::after { background: var(--accent); }
  `;

  const ICONS = {
    lock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2"/></svg>',
    cursor: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 2l9 5-4 1-1.5 4z"/></svg>',
    hand: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 8V3.5a1 1 0 012 0V7m0-.5a1 1 0 012 0V8m0-1a1 1 0 012 0v3.5A3.5 3.5 0 018 14H7a3 3 0 01-2.4-1.2L3 10.5a1 1 0 011.6-1.2L5 10"/></svg>',
    frame: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 2v12M11 2v12M2 5h12M2 11h12"/></svg>',
  };

  let st = null;

  function ensureStyle(id, css) {
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    document.head.append(s);
  }
  const tint = (el, hue) => {
    el.style.setProperty('--lo-b', `hsl(${hue} 55% 48%)`);
    el.style.setProperty('--lo-f', `color-mix(in srgb, hsl(${hue} 70% 60%) 26%, var(--panel))`);
  };
  const hitOk = (el, x, y) => {
    const h = document.elementFromPoint(x, y);
    return !!h && (h === el || el.contains(h));
  };
  const req = (el, what) => {
    if (!el || !el.isConnected) throw new Error(`layout: ${what} is not rendered`);
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) throw new Error(`layout: ${what} is hidden`);
    return r;
  };

  // A point on el that is really el (not covered by another card), integer px.
  function visiblePoint(el, what) {
    const r = req(el, what);
    const fr = [[0.5, 0.5], [0.3, 0.5], [0.7, 0.5], [0.5, 0.3], [0.5, 0.7], [0.2, 0.3], [0.8, 0.7], [0.2, 0.7], [0.8, 0.3], [0.12, 0.5], [0.88, 0.5]];
    for (const [u, v] of fr) {
      const x = Math.round(r.left + r.width * u);
      const y = Math.round(r.top + r.height * v);
      if (hitOk(el, x, y)) return [x, y];
    }
    // A card dropped over another can leave only a sliver of it showing: scan a finer grid, edges included.
    for (let a = 0; a <= 12; a++) {
      for (let b = 0; b <= 12; b++) {
        const x = Math.round(r.left + 2 + (r.width - 4) * a / 12);
        const y = Math.round(r.top + 2 + (r.height - 4) * b / 12);
        if (hitOk(el, x, y)) return [x, y];
      }
    }
    return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)];
  }

  // Ruler along a canvas of `len` canvas px drawn at `scale`: a tick and a label every 50 canvas px.
  function ruler(util, parent, cls, len, scale) {
    const r = util.el('div', cls, parent);
    const horiz = cls === 'lo-rt';
    r.style[horiz ? 'width' : 'height'] = Math.round(len * scale) + 'px';
    for (let v = 0; v <= len; v += 50) {
      const pos = Math.round(v * scale) + 'px';
      const tick = util.el('i', '', r);
      tick.style[horiz ? 'left' : 'top'] = pos;
      const lab = util.el('b', '', r, String(v));
      lab.style[horiz ? 'left' : 'top'] = pos;
    }
    return r;
  }

  env.widget({
    task: 'align-layout',
    site: 'base',
    name: 'canvas',
    split: 'train',
    scenarios: ['align', 'spacing', 'mockup', 'columns'],

    render(ctx) {
      ensureStyle('lo-style', CSS);
      const { util, rng, spec, size } = ctx;
      const fam = env.taskDef.helpers;
      const v = spec.scenario;
      const s = (st = { ctx, els: [], hs: [], divs: [] });

      const card = util.el('div', 'lo-card', ctx.stage);
      card.dataset.role = 'form';
      card.style.setProperty('--lo-r', rng.int(6, 12) + 'px');
      const bar = util.el('div', 'lo-bar', card);
      util.el('div', 'lo-title', bar, rng.pick({
        align: ['Dashboard layout', 'Home screen', 'Widgets'],
        spacing: ['Toolbar spacing', 'Card row', 'Stack layout'],
        mockup: ['Landing page', 'Page layout', 'Screen design'],
        columns: ['Users table', 'Report columns', 'Data grid'],
      }[v]));
      ['cursor', 'hand', 'frame'].forEach((k, i) => {
        const b = util.el('span', 'lo-tool' + (i === 0 ? ' on' : ''), bar);
        b.innerHTML = ICONS[k];
      });
      util.el('span', 'lo-zoom', bar, '100%');

      const body = util.el('div', 'lo-body', card);
      const pane = util.el('div', 'lo-pane', body);
      util.el('div', 'lo-cap', pane, v === 'mockup' ? 'Canvas' : v === 'columns' ? 'Table' : 'Canvas');
      const frame = util.el('div', 'lo-frame', pane);
      ruler(util, frame, 'lo-rt', spec.W, 1);
      let canvas;
      if (v === 'columns') {
        canvas = util.el('div', 'lo-table', frame);
        canvas.style.gridColumn = '2';
        canvas.style.gridRow = '2';
        canvas.style.width = spec.W + 'px';
        canvas.style.height = spec.H + 'px';
        frame.style.gridTemplateColumns = '0 auto';
      } else {
        ruler(util, frame, 'lo-rl', spec.H, 1);
        canvas = util.el('div', 'lo-canvas', frame);
        canvas.style.width = spec.W + 'px';
        canvas.style.height = spec.H + 'px';
      }
      s.canvas = canvas;

      // ------------------------------------------------------------ cards and boxes
      const order = []; // bottom to top
      const raise = (i) => {
        order.splice(order.indexOf(i), 1);
        order.push(i);
        order.forEach((k, z) => { s.els[k].style.zIndex = String(z + 1); });
      };
      const setRect = (i, rect) => {
        const m = ctx.model;
        const r = m.r.slice();
        r[i] = rect;
        ctx.update({ ...m, r });
        paintItem(i);
      };
      function paintItem(i) {
        const r = ctx.model.r[i];
        const el = s.els[i];
        el.style.left = r.x + 'px';
        el.style.top = r.y + 'px';
        el.style.width = r.w + 'px';
        el.style.height = r.h + 'px';
        if (s.hs[i]) {
          const pts = { nw: [r.x, r.y], ne: [r.x + r.w, r.y], se: [r.x + r.w, r.y + r.h], sw: [r.x, r.y + r.h] };
          for (const [k, h] of Object.entries(s.hs[i])) {
            h.style.left = pts[k][0] + 'px';
            h.style.top = pts[k][1] + 'px';
          }
        }
      }

      if (v !== 'columns') {
        const n = spec.items.length;
        const hl = v === 'mockup' ? util.el('div', 'lo-hl', canvas) : null;
        for (let i = 0; i < n; i++) {
          const it = spec.items[i];
          const lockedItem = fam.locked(spec, i);
          const el = util.el('div', 'lo-item' + (lockedItem ? ' locked' : '') + (v === 'mockup' ? ' box' : ''), canvas);
          tint(el, it.hue);
          el.dataset.role = 'card';
          if (lockedItem) el.insertAdjacentHTML('beforeend', ICONS.lock);
          util.el('span', '', el, it.label);
          s.els.push(el);
          order.push(i);
          el.style.zIndex = String(i + 1);
          let start = null;
          env.ui.track(el, {
            start() {
              if (lockedItem) return false;
              start = { ...ctx.model.r[i] };
              raise(i);
              el.classList.add('dragging');
            },
            move(p) { setRect(i, fam.moveRect(spec, start, p.dx, p.dy)); },
            end() { el.classList.remove('dragging'); },
          }, 'layout-card');
          if (hl) {
            s.hs[i] = {};
            for (const k of ['nw', 'ne', 'se', 'sw']) {
              const h = util.el('div', `lo-h ${k}`, hl);
              s.hs[i][k] = h;
              let hs = null;
              env.ui.track(h, {
                start() { hs = { ...ctx.model.r[i] }; raise(i); },
                move(p) { setRect(i, fam.resizeRect(spec, hs, k, p.dx, p.dy)); },
              }, `layout-handle-${k}`);
            }
          }
        }
        if (v === 'align') {
          if (spec.anchor === 'guide') {
            const g = util.el('div', `lo-guide ${spec.axis === 'x' ? 'v' : 'h'}`, canvas);
            g.style[spec.axis === 'x' ? 'left' : 'top'] = spec.t + 'px';
            util.el('span', '', g, 'guide');
          }
        }
        if (v === 'mockup') {
          const tp = util.el('div', 'lo-pane', body);
          util.el('div', 'lo-cap', tp, 'Mockup');
          const tf = util.el('div', 'lo-frame', tp);
          tf.style.gridTemplateColumns = "30px auto";
          const sc = spec.scale;
          ruler(util, tf, 'lo-rt', spec.W, sc);
          ruler(util, tf, 'lo-rl', spec.H, sc);
          const thumb = util.el('div', 'lo-thumb', tf);
          thumb.style.gridColumn = '2';
          thumb.style.gridRow = '2';
          thumb.style.width = Math.round(spec.W * sc) + 'px';
          thumb.style.height = Math.round(spec.H * sc) + 'px';
          spec.boxes.forEach((b) => {
            const t = util.el('div', 'lo-tbox', thumb, b.label);
            tint(t, b.hue);
            t.style.left = Math.round(b.tx * sc) + 'px';
            t.style.top = Math.round(b.ty * sc) + 'px';
            t.style.width = Math.round(b.tw * sc) + 'px';
            t.style.height = Math.round(b.th * sc) + 'px';
          });
        }
      }

      // ------------------------------------------------------------ table
      let cells = [];
      if (v === 'columns') {
        spec.names.forEach((name, c) => {
          const th = util.el('div', 'lo-th', canvas);
          util.el('span', '', th, name);
          const col = { th, tds: [], div: null };
          spec.cells.forEach((row, r) => {
            const td = util.el('div', 'lo-td', canvas);
            td.style.top = 36 + r * 34 + 'px';
            td.style.background = r % 2 ? 'color-mix(in srgb, var(--fg) 2.5%, var(--panel))' : 'transparent';
            const chip = util.el('div', 'lo-chip', td);
            chip.style.width = row[c] + 'px';
            chip.style.marginLeft = spec.pad + 'px';
            col.tds.push(td);
          });
          const div = util.el('div', 'lo-div', canvas);
          div.setAttribute('role', 'separator');
          div.setAttribute('aria-label', `Resize ${name} column`);
          col.div = div;
          s.divs.push(div);
          let cs = null;
          env.ui.track(div, {
            start() { cs = ctx.model.cols.slice(); div.classList.add('on'); },
            move(p) {
              ctx.update({ ...ctx.model, cols: fam.setCol(spec, cs, c, cs[c] + p.dx) });
              paintCols();
            },
            end() { div.classList.remove('on'); },
          }, 'layout-divider');
          cells.push(col);
        });
      }
      function paintCols() {
        const cols = ctx.model.cols;
        cells.forEach((col, c) => {
          const left = fam.colLeft(cols, c);
          for (const el of [col.th, ...col.tds]) {
            el.style.left = left + 'px';
            el.style.width = cols[c] + 'px';
          }
          col.div.style.left = left + cols[c] + 'px';
        });
      }

      function paint() {
        if (v === 'columns') { paintCols(); return; }
        ctx.model.r.forEach((_, i) => paintItem(i));
      }
      paint();

      // Place the card inside the stage (seeded), then freeze its box.
      card.style.left = '0px';
      card.style.top = '0px';
      const cw = card.offsetWidth;
      const chh = card.offsetHeight;
      card.style.width = cw + 'px';
      card.style.height = chh + 'px';
      const fx = rng.pick([0, 0.5, 0.5, 1, rng.float()]);
      const fy = rng.pick([0.5, 0.5, 0, 1, rng.float()]);
      card.style.left = Math.round(12 + fx * Math.max(0, size.width - cw - 24)) + 'px';
      card.style.top = Math.round(8 + fy * Math.max(0, size.height - chh - 16)) + 'px';
      return { anchors: [card], sync: paint };
    },

    locate(t) {
      const s = st;
      const off = (p) => [p[0] + Math.round(t.dx || 0), p[1] + Math.round(t.dy || 0)];
      if (t.grab !== undefined) return off(visiblePoint(s.els[t.grab], `item ${t.grab}`));
      if (t.handle !== undefined) {
        const h = s.hs[t.handle][t.h];
        const r = req(h, `handle ${t.handle} ${t.h}`);
        const cx = Math.round(r.left + r.width / 2);
        const cy = Math.round(r.top + r.height / 2);
        for (const [x, y] of [[cx, cy], [cx - 2, cy - 2], [cx + 2, cy + 2], [cx - 2, cy + 2], [cx + 2, cy - 2]]) {
          if (hitOk(h, x, y)) return off([x, y]);
        }
        return off([cx, cy]);
      }
      if (t.div !== undefined) {
        const r = req(s.divs[t.div], `divider ${t.div}`);
        const tb = s.canvas.getBoundingClientRect();
        return off([Math.round(r.left + r.width / 2), Math.round(tb.top + 18)]);
      }
      throw new Error(`layout: unknown target ${JSON.stringify(t)}`);
    },
  });
})();

/*
 * reference / layout / gridstack: a dashboard editor whose widgets are GridStack 10.3.1 items (vendored gridstack-all
 * bundle with its own drag and resize layer). Scenarios align, spacing, mockup. The canvas is a grid of `q`-px cells
 * (traits.cell: the task snaps every size, position and goal to it) with no gutters and `float: true`, so a widget stays
 * where it is dropped; GridStack's own rules decide the rest: a drag starts after the pointer has moved a few px, a
 * moved or resized widget snaps to whole cells, a widget dropped on another pushes it down (boxes of the mockup never
 * start overlapping: traits.noOverlap), no widget leaves the canvas (`maxRow`), locked cards neither move nor resize.
 * The mockup's boxes have GridStack's corner resize handles (se, sw, ne, nw); the thumbnail sits beside the canvas at half
 * scale with rulers in canvas px. The model is read back from the grid's nodes after every drag or resize
 * (dragstop / resizestop) and written to the grid again by sync() (a corrupted or retargeted state).
 * GridStack positions items with attribute rules for a column count of at most 12; the widget generates the same rules for
 * its own column count (canvas width / q). The library's structural CSS is repeated here (gridstack.min.css is not loaded).
 * locate(): { grab: i, dx?, dy? } a visible spot on widget i plus an offset, { handle: i, h, dx?, dy? } its resize handle.
 */
(function () {
  'use strict';

  const CSS = `
  .gl-card { position: absolute; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px 14px; background: var(--panel);
    border: 1px solid var(--line); border-radius: var(--gl-r); box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 10px 26px rgba(0,0,0,.06);
    user-select: none; box-sizing: border-box; }
  .gl-bar { display: flex; align-items: center; gap: 8px; height: 26px; }
  .gl-title { font-size: 15px; font-weight: 650; margin-right: auto; white-space: nowrap; }
  .gl-chip { padding: 2px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 600; color: var(--muted); border: 1px solid var(--line); }
  .gl-body { display: flex; gap: 16px; align-items: flex-start; }
  .gl-pane { display: flex; flex-direction: column; gap: 4px; }
  .gl-cap { font-size: 11.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); }
  .gl-frame { display: grid; grid-template-columns: 30px auto; grid-template-rows: 16px auto; }
  .gl-rt, .gl-rl { position: relative; font-size: 9.5px; color: var(--muted); font-variant-numeric: tabular-nums; overflow: hidden; }
  .gl-rt { grid-column: 2; grid-row: 1; border-bottom: 1px solid var(--line); }
  .gl-rl { grid-column: 1; grid-row: 2; border-right: 1px solid var(--line); }
  .gl-rt i, .gl-rl i { position: absolute; background: var(--line); }
  .gl-rt i { top: 10px; width: 1px; height: 6px; }
  .gl-rl i { right: 0; height: 1px; width: 6px; }
  .gl-rt b, .gl-rl b { position: absolute; font-weight: 500; }
  .gl-rt b { top: 0; transform: translateX(3px); }
  .gl-rl b { right: 8px; transform: translateY(-5px); }
  .gl-canvas { grid-column: 2; grid-row: 2; position: relative; overflow: hidden; outline: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    background-color: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); touch-action: none; }
  .gl-guide { position: absolute; pointer-events: none; z-index: 900; border: 0 dashed var(--accent); }
  .gl-guide.v { top: 0; bottom: 0; border-left-width: 2px; margin-left: -1px; }
  .gl-guide.h { left: 0; right: 0; border-top-width: 2px; margin-top: -1px; }
  .gl-guide span { position: absolute; font-size: 10px; font-weight: 600; color: #fff; background: var(--accent); padding: 1px 5px; border-radius: 3px; white-space: nowrap; }
  .gl-guide.v span { top: 2px; left: 4px; }
  .gl-guide.h span { left: 4px; top: 4px; }
  .gl-thumb { position: relative; overflow: hidden; outline: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    background: color-mix(in srgb, var(--fg) 2.5%, var(--panel)); pointer-events: none; }
  .gl-tbox { position: absolute; box-sizing: border-box; border: 1px solid var(--gl-b); background: var(--gl-f); font-size: 9.5px; font-weight: 600; padding: 2px 3px;
    overflow: hidden; white-space: nowrap; color: color-mix(in srgb, var(--gl-b) 55%, var(--fg)); }

  /* GridStack structural rules (gridstack.min.css, repeated) */
  .grid-stack { position: relative; }
  .grid-stack > .grid-stack-item { position: absolute; padding: 0; }
  .grid-stack > .grid-stack-item > .grid-stack-item-content { margin: 0; position: absolute; inset: 0; width: auto; overflow: hidden; }
  .grid-stack > .grid-stack-item[gs-y="0"] { top: 0; }
  .grid-stack > .grid-stack-item[gs-x="0"] { left: 0; }
  .grid-stack-placeholder > .placeholder-content { background: color-mix(in srgb, var(--accent) 14%, transparent); border: 1px dashed var(--accent);
    margin: 0; position: absolute; inset: 0; width: auto; z-index: 0 !important; box-sizing: border-box; }
  .grid-stack-item > .ui-resizable-handle { position: absolute; display: block; font-size: .1px; touch-action: none; z-index: 5; }
  .grid-stack-item.ui-draggable-dragging, .ui-resizable-resizing { z-index: 10000; }
  .grid-stack-item.ui-draggable-dragging > .grid-stack-item-content, .ui-resizable-resizing > .grid-stack-item-content { box-shadow: 1px 4px 10px rgba(0,0,0,.25); opacity: .85; }
  .grid-stack-item > .ui-resizable-ne, .grid-stack-item > .ui-resizable-nw, .grid-stack-item > .ui-resizable-se, .grid-stack-item > .ui-resizable-sw {
    width: 14px; height: 14px; box-sizing: border-box; background: #fff; border: 1.5px solid var(--accent); border-radius: 2px; }
  .grid-stack-item > .ui-resizable-nw { cursor: nwse-resize; left: -7px; top: -7px; }
  .grid-stack-item > .ui-resizable-ne { cursor: nesw-resize; right: -7px; top: -7px; }
  .grid-stack-item > .ui-resizable-se { cursor: nwse-resize; right: -7px; bottom: -7px; }
  .grid-stack-item > .ui-resizable-sw { cursor: nesw-resize; left: -7px; bottom: -7px; }
  .grid-stack-item.ui-draggable-dragging > .ui-resizable-handle { display: none !important; }
  .grid-stack-item > .grid-stack-item-content.gl-w { display: flex; align-items: center; justify-content: center; gap: 5px; box-sizing: border-box;
    border: 1.5px solid var(--gl-b); background: var(--gl-f); border-radius: 6px; cursor: grab; font-size: 12.5px; font-weight: 600;
    color: color-mix(in srgb, var(--gl-b) 55%, var(--fg)); white-space: nowrap; }
  .grid-stack-item > .grid-stack-item-content.gl-w.box { align-items: flex-start; justify-content: flex-start; padding: 5px 7px; font-size: 11.5px; }
  .grid-stack-item > .grid-stack-item-content.gl-w.locked { cursor: not-allowed; border-style: dashed; background: color-mix(in srgb, var(--gl-f) 55%, var(--panel)); }
  .gl-w svg { flex: none; width: 12px; height: 12px; }
  `;

  const LOCK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2"/></svg>';

  const STRIDE = 6;
  let st = null;

  const tint = (el, hue) => {
    el.style.setProperty('--gl-b', `hsl(${hue} 55% 48%)`);
    el.style.setProperty('--gl-f', `color-mix(in srgb, hsl(${hue} 70% 60%) 26%, var(--panel))`);
  };
  function ruler(util, parent, cls, len, scale) {
    const r = util.el('div', cls, parent);
    const horiz = cls === 'gl-rt';
    r.style[horiz ? 'width' : 'height'] = Math.round(len * scale) + 'px';
    for (let v = 0; v <= len; v += 50) {
      const pos = Math.round(v * scale) + 'px';
      const tick = util.el('i', '', r);
      tick.style[horiz ? 'left' : 'top'] = pos;
      const lab = util.el('b', '', r, String(v));
      lab.style[horiz ? 'left' : 'top'] = pos;
    }
    return r;
  }

  // Column rules for GridStack (which ships them for up to 12 columns): left and width as percentages of the grid.
  function columnCss(cols) {
    const pct = (n) => `${+((n * 100) / cols).toFixed(4)}%`;
    const out = [`.gl-grid[data-cols="${cols}"] > .grid-stack-item { width: ${pct(1)}; }`];
    for (let x = 1; x < cols; x++) out.push(`.gl-grid[data-cols="${cols}"] > .grid-stack-item[gs-x="${x}"] { left: ${pct(x)}; }`);
    for (let w = 2; w <= cols; w++) out.push(`.gl-grid[data-cols="${cols}"] > .grid-stack-item[gs-w="${w}"] { width: ${pct(w)}; }`);
    return out.join('\n');
  }

  env.widget({
    task: 'align-layout', site: 'base', name: 'gridstack', split: 'train',
    scenarios: ['align', 'spacing', 'mockup'],
    traits: { cell: 10, noOverlap: true },
    uses: [['../vendor/gridstack-10.3.1/gridstack-all', 'vendor']],

    render(ctx) {
      env.util.css('gl-style', CSS);
      const GS = window.GridStack;
      if (!GS) throw new Error('layout/gridstack: vendored GridStack is missing');
      if (st && st.grid) { st.grid.destroy(false); st.grid = null; }
      if (st && st.off) { st.off(); st.off = null; }
      const { util, rng, spec, size } = ctx;
      const q = spec.cell;
      if (!q) throw new Error('layout/gridstack: the family did not snap the spec to a grid (traits.cell)');
      const v = spec.scenario;
      const s = (st = { ctx, grid: null, q, handles: [] });
      const cols = spec.W / q;
      env.util.css(`gl-cols-${cols}`, columnCss(cols));

      const card = util.el('div', 'gl-card', ctx.stage);
      card.dataset.role = 'form';
      card.style.setProperty('--gl-r', rng.int(6, 12) + 'px');
      const bar = util.el('div', 'gl-bar', card);
      util.el('div', 'gl-title', bar, rng.pick({
        align: ['Dashboard widgets', 'Home dashboard', 'Widget board'],
        spacing: ['Toolbar widgets', 'Card row', 'Widget strip'],
        mockup: ['Landing page', 'Page layout', 'Screen design'],
      }[v]));
      util.el('span', 'gl-chip', bar, `${cols} columns`);

      const body = util.el('div', 'gl-body', card);
      const pane = util.el('div', 'gl-pane', body);
      util.el('div', 'gl-cap', pane, 'Canvas');
      const frame = util.el('div', 'gl-frame', pane);
      ruler(util, frame, 'gl-rt', spec.W, 1);
      ruler(util, frame, 'gl-rl', spec.H, 1);
      const canvas = util.el('div', 'gl-canvas', frame);
      canvas.style.width = spec.W + 'px';
      canvas.style.height = spec.H + 'px';
      s.canvas = canvas;
      const gridEl = util.el('div', 'grid-stack gl-grid', canvas);
      gridEl.dataset.cols = String(cols);
      Object.assign(gridEl.style, { width: spec.W + 'px', height: spec.H + 'px' });

      if (v === 'align' && spec.anchor === 'guide') {
        const g = util.el('div', `gl-guide ${spec.axis === 'x' ? 'v' : 'h'}`, canvas);
        g.style[spec.axis === 'x' ? 'left' : 'top'] = spec.t + 'px';
        util.el('span', '', g, 'guide');
      }
      if (v === 'mockup') {
        const tp = util.el('div', 'gl-pane', body);
        util.el('div', 'gl-cap', tp, 'Mockup');
        const tf = util.el('div', 'gl-frame', tp);
        const sc = spec.scale;
        ruler(util, tf, 'gl-rt', spec.W, sc);
        ruler(util, tf, 'gl-rl', spec.H, sc);
        const thumb = util.el('div', 'gl-thumb', tf);
        thumb.style.gridColumn = '2';
        thumb.style.gridRow = '2';
        thumb.style.width = Math.round(spec.W * sc) + 'px';
        thumb.style.height = Math.round(spec.H * sc) + 'px';
        spec.boxes.forEach((b) => {
          const t = util.el('div', 'gl-tbox', thumb, b.label);
          tint(t, b.hue);
          t.style.left = Math.round(b.tx * sc) + 'px';
          t.style.top = Math.round(b.ty * sc) + 'px';
          t.style.width = Math.round(b.tw * sc) + 'px';
          t.style.height = Math.round(b.th * sc) + 'px';
        });
      }

      // ------------------------------------------------------------ the grid
      const fam = env.taskDef.helpers;
      const resizable = v === 'mockup';
      const grid = GS.init({
        column: cols, cellHeight: q, margin: 0, float: true, animate: false, disableOneColumnMode: true,
        maxRow: spec.H / q, minRow: spec.H / q, disableResize: !resizable, acceptWidgets: false,
        resizable: { handles: 'se, sw, ne, nw' }, draggable: { scroll: false },
      }, gridEl);
      s.grid = grid;
      const nodeOf = (i) => grid.engine.nodes.find((n) => n.id === String(i));
      const readRects = () => ctx.model.r.map((r, i) => {
        const n = nodeOf(i);
        return n ? { x: n.x * q, y: n.y * q, w: n.w * q, h: n.h * q } : r;
      });
      const same = (a, b) => a.length === b.length && a.every((r, i) => r.x === b[i].x && r.y === b[i].y && r.w === b[i].w && r.h === b[i].h);
      const settle = () => {
        const r = readRects();
        if (!same(r, ctx.model.r)) ctx.update({ ...ctx.model, r });
      };
      const n = ctx.model.r.length;
      grid.batchUpdate();
      for (let i = 0; i < n; i++) {
        const it = spec.items[i];
        const r = ctx.model.r[i];
        const lockedItem = fam.locked(spec, i);
        const el = grid.addWidget({
          id: String(i), x: r.x / q, y: r.y / q, w: r.w / q, h: r.h / q,
          minW: Math.ceil(fam.MIN_BOX / q), minH: Math.ceil(fam.MIN_BOX / q),
          noMove: lockedItem, noResize: lockedItem || !resizable, locked: lockedItem,
        });
        const content = el.querySelector('.grid-stack-item-content');
        content.className = 'grid-stack-item-content gl-w' + (lockedItem ? ' locked' : '') + (v === 'mockup' ? ' box' : '');
        tint(content, it.hue);
        el.dataset.role = 'card';
        if (lockedItem) content.insertAdjacentHTML('beforeend', LOCK);
        util.el('span', '', content, it.label);
        s.handles[i] = el;
      }
      grid.commit();
      // Where each resize handle's centre sits relative to its corner of the widget (the library's CSS decides).
      s.hoff = {};
      if (resizable) {
        const el = s.handles[0];
        const ir = el.getBoundingClientRect();
        for (const h of ['nw', 'ne', 'se', 'sw']) {
          const r = el.querySelector(`.ui-resizable-${h}`).getBoundingClientRect();
          s.hoff[h] = [r.left + r.width / 2 - (h.includes('w') ? ir.left : ir.right), r.top + r.height / 2 - (h.includes('n') ? ir.top : ir.bottom)];
        }
      }
      grid.on('dragstop resizestop', () => settle());

      // GridStack follows the pointer from the first move events after the press, so a scripted drag that jumps straight to
      // its destination would not move the widget at all. Like a hand, the pointer is fed through STRIDE-px steps: a mousemove
      // that jumps further than that while the button is down on the grid is preceded by synthetic mousemoves along the way.
      // (The widget still loses the first STRIDE px to the library's drag threshold; locate() adds them to the drop point.)
      let armed = null;
      const onDown = (e) => { armed = e.isTrusted && gridEl.contains(e.target) ? { x: e.clientX, y: e.clientY } : null; };
      const onUp = () => { armed = null; };
      const onMove = (e) => {
        if (!armed || !e.isTrusted) return;
        const dx = e.clientX - armed.x;
        const dy = e.clientY - armed.y;
        const dist = Math.hypot(dx, dy);
        for (let k = 1; k * STRIDE < dist - 1; k++) {
          const f = (k * STRIDE) / dist;
          document.dispatchEvent(new MouseEvent('mousemove', { clientX: armed.x + dx * f, clientY: armed.y + dy * f, buttons: 1, bubbles: true, cancelable: true, view: window }));
        }
        armed = { x: e.clientX, y: e.clientY };
      };
      window.addEventListener('mousedown', onDown, true);
      window.addEventListener('mouseup', onUp, true);
      window.addEventListener('mousemove', onMove, true);
      s.off = () => {
        window.removeEventListener('mousedown', onDown, true);
        window.removeEventListener('mouseup', onUp, true);
        window.removeEventListener('mousemove', onMove, true);
      };

      // Place the card inside the stage (seeded), then freeze its box.
      card.style.left = '0px';
      card.style.top = '0px';
      const cw = card.offsetWidth;
      const chh = card.offsetHeight;
      card.style.width = cw + 'px';
      card.style.height = chh + 'px';
      const fx = rng.pick([0, 0.5, 0.5, 1, rng.float()]);
      const fy = rng.pick([0.5, 0.5, 0, 1, rng.float()]);
      card.style.left = Math.round(12 + fx * Math.max(0, size.width - cw - 24)) + 'px';
      card.style.top = Math.round(8 + fy * Math.max(0, size.height - chh - 16)) + 'px';

      const paint = (m) => {
        grid.batchUpdate();
        for (let i = 0; i < n; i++) {
          const r = m.r[i];
          const node = nodeOf(i);
          if (node && (node.x !== r.x / q || node.y !== r.y / q || node.w !== r.w / q || node.h !== r.h / q)) {
            grid.update(node.el, { x: r.x / q, y: r.y / q, w: r.w / q, h: r.h / q });
          }
        }
        grid.commit();
        // The grid may have pushed a widget aside: the page shows that, so the model follows it.
        settle();
      };
      return { anchors: [card], sync: paint };
    },

    locate(t) {
      const s = st;
      // The drop point is the planned displacement plus the STRIDE px the drag threshold swallows, along the drag.
      const off = (p) => {
        let dx = t.dx || 0;
        let dy = t.dy || 0;
        const d = Math.hypot(dx, dy);
        if (d > 0) { dx += (dx / d) * STRIDE; dy += (dy / d) * STRIDE; }
        return [p[0] + Math.round(dx), p[1] + Math.round(dy)];
      };
      // Points come from the model (committed positions), not from the live elements: a held widget follows the pointer,
      // and a split drag locates its release again once it has moved.
      const tb = s.canvas.getBoundingClientRect();
      const m = s.ctx.model;
      if (t.grab !== undefined) {
        const r = m.r[t.grab];
        return off([tb.left + r.x + r.w / 2, tb.top + r.y + r.h / 2]);
      }
      if (t.handle !== undefined) {
        const r = m.r[t.handle];
        const x = t.h.includes('w') ? r.x : r.x + r.w;
        const y = t.h.includes('n') ? r.y : r.y + r.h;
        const [hx, hy] = s.hoff[t.h];
        return off([tb.left + x + hx, tb.top + y + hy]);
      }
      throw new Error(`layout/gridstack: unknown target ${JSON.stringify(t)}`);
    },
  });
})();
