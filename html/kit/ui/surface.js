/*
 * kit/ui/surface.js: headless surface primitives: freehand strokes, point placement on a board, hover.
 * Behavior and geometry only: nothing here creates visible elements, sets colors, fonts or sizes, or
 * injects CSS. The widget draws the surface, the ink and the markers; the primitive tells it what to draw.
 *
 * Board coordinates. stroke() and board() report points in a coordinate system the widget chooses, through
 * two callbacks:
 *   toBoard([x, y]) -> [bx, by]     viewport px -> board units
 *   fromBoard([bx, by]) -> [x, y]   board units -> viewport px (used by locate())
 * Default: the element box (el.getBoundingClientRect() at interaction time) normalized to [0, 1] x [0, 1]
 * (u rightwards, v downwards). A widget whose board is inset in a larger canvas, scaled, flipped or rotated
 * supplies both callbacks and reads its geometry from the live DOM inside them.
 * Shared options (stroke and board):
 *   bounds          { x0, y0, x1, y1 } in board units: points are clamped to it after mapping (optional)
 *   precision       decimals board coordinates are rounded to (default 4; null keeps raw floats)
 *   label           name used in the event log
 *
 * env.ui.stroke(el, opts) -> { get(), set(strokes), locate([bx, by]), toBoard([x, y]), drawing(), detach() }
 *   Freehand drawing on any element (SVG, canvas, div). Each left press starts a stroke; samples come
 *   from coalesced pointer events, keeping a sample only when it is at least minDist px from the last
 *   kept one; the release point is always appended (unless equal to the last). Pointer capture keeps
 *   drawing when the pointer leaves el; the pointer is clamped to el's box and then to bounds.
 *   strokes = [[[bx, by], ...], ...] (oldest first; the stroke in progress is last).
 *   opts: toBoard, fromBoard, bounds, precision, label (see above),
 *         strokes (initial list), minDist (px, default 1),
 *         render(points, strokes)   draw the ink: points = the last stroke ([] if none). Called on press,
 *                                   on every kept sample, on release and on set(). The widget decides the
 *                                   look (SVG polyline, canvas path, chalk texture, only the last stroke...)
 *         onInput(points, strokes)  live, during the gesture (typically ctx.update({ strokes }));
 *                                   older name: onStroke
 *         onChange(strokes)         on release
 *   Logs 'stroke' { phase: 'start' | 'end', points } and track's 'grab' / 'release'.
 *   set(strokes) syncs from the model (no callbacks except render). locate([bx, by]) is the viewport
 *   point of a board point (fromBoard), so a widget's locate({ point }) is one line.
 *   Widgets should give el `touch-action: none` and a cursor in their own CSS.
 *
 * env.ui.board(el, opts) -> { get(), set(point), locate([bx, by]), toBoard([x, y]), detach() }
 *   A click surface for point placement. A left press inside el's box places the point (each press
 *   replaces it and commits at once); presses outside the box (or rejected by inside()) are ignored, and
 *   the point is then clamped to bounds. Built on env.ui.track.
 *   opts: toBoard, fromBoard, bounds, precision, label (see above),
 *         value (initial point or null),
 *         inside(point, [x, y]) -> bool   extra acceptance test for a press (default: always true)
 *         onChange(point)
 *   Logs 'point' { point }. Overlays: every element drawn ON the board (figure, labels, the marker)
 *   either lives inside el (pointer events bubble to el, fine) or must have `pointer-events: none` in
 *   the widget's CSS; a sibling overlay that receives the press would otherwise block it. The press is
 *   read from the event's viewport position, so what is under the pointer never changes the point.
 *   locate(point) is the viewport px of a board point (fromBoard).
 *
 * env.ui.hover(el, opts) -> { detach() }
 *   Hover tracking on el (pointerenter / pointerleave, so children count as inside). Times are measured
 *   on the kit clock: pass opts.clock = ctx.clock (task ms since reset; in clock=step mode it advances by
 *   stepMs per agent action, so dwell counts actions, not wall time). Without opts.clock the kit's task
 *   clock is used; there is never a wall-clock fallback.
 *   opts: clock(), onLeave(dwellMs, t), onMove({ x, y, u, v }) (u, v: position in el's box, 0..1), label.
 *   Logs 'hover' { phase: 'enter' | 'leave', what, t, dwell }.
 */
(function () {
  'use strict';
  const ui = (env.ui = env.ui || {});
  const { clamp } = ui._base;

  // The coordinate frame shared by stroke() and board().
  function frame(el, opts) {
    const rect = () => el.getBoundingClientRect();
    const k = opts.precision === null ? null : 10 ** (opts.precision ?? 4);
    const round = (v) => (k === null ? v : Math.round(v * k) / k);
    const toB = opts.toBoard || (([x, y]) => {
      const r = rect();
      return [(x - r.left) / r.width, (y - r.top) / r.height];
    });
    const fromB = opts.fromBoard || (([u, v]) => {
      const r = rect();
      return [r.left + u * r.width, r.top + v * r.height];
    });
    // Viewport px -> board point: optional clamp to rect(), mapping, clamp to bounds, rounding.
    const map = ([x, y], doClamp) => {
      if (doClamp) {
        const r = rect();
        x = clamp(x, r.left, r.right);
        y = clamp(y, r.top, r.bottom);
      }
      let [bx, by] = toB([x, y]);
      const b = opts.bounds;
      if (b) {
        bx = clamp(bx, b.x0, b.x1);
        by = clamp(by, b.y0, b.y1);
      }
      return [round(bx), round(by)];
    };
    const within = ([x, y]) => {
      const r = rect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    return { map, within, fromB };
  }

  const copy = (strokes) => strokes.map((s) => s.map((p) => p.slice()));

  ui.stroke = function stroke(el, opts = {}) {
    const f = frame(el, opts);
    const minDist = opts.minDist ?? 1;
    let done = copy(opts.strokes || []); // committed strokes
    let cur = null; // stroke in progress
    let lastPx = null;

    const all = () => (cur ? done.concat([cur.slice()]) : done.slice());
    const draw = () => {
      if (!opts.render) return;
      const s = all();
      opts.render(s.length ? s[s.length - 1] : [], s);
    };
    const add = (ev, force) => {
      if (!force && lastPx && Math.hypot(ev.clientX - lastPx[0], ev.clientY - lastPx[1]) < minDist) return false;
      cur.push(f.map([ev.clientX, ev.clientY], true));
      lastPx = [ev.clientX, ev.clientY];
      return true;
    };
    const live = () => {
      draw();
      const onInput = opts.onInput || opts.onStroke;
      if (onInput) onInput(cur.slice(), all());
    };

    const detach = ui.track(el, {
      start(p, e) {
        cur = [];
        lastPx = null;
        add(e, true);
        env.log('stroke', { phase: 'start', what: opts.label || 'stroke' });
        live();
      },
      move(p, e) {
        if (!cur) return;
        const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
        let changed = false;
        for (const ev of evs.length ? evs : [e]) changed = add(ev) || changed;
        if (changed) live();
      },
      end(p, e) {
        if (!cur) return;
        const last = cur[cur.length - 1];
        const q = f.map([e.clientX, e.clientY], true);
        if (e.type !== 'pointercancel' && (q[0] !== last[0] || q[1] !== last[1])) cur.push(q);
        env.log('stroke', { phase: 'end', what: opts.label || 'stroke', points: cur.length });
        done = all();
        cur = null;
        draw();
        if (opts.onChange) opts.onChange(copy(done));
      },
    }, opts.label || 'stroke');

    draw();
    return {
      get: () => copy(all()),
      set(strokes) {
        done = copy(strokes || []);
        draw();
      },
      drawing: () => !!cur,
      toBoard: (p) => f.map(p, true),
      locate: (bp) => f.fromB(bp),
      detach,
    };
  };

  ui.board = function board(el, opts = {}) {
    const f = frame(el, opts);
    let point = opts.value ? opts.value.slice() : null;
    const accept = (p, xy) => !opts.inside || opts.inside(p, xy);

    const detach = ui.track(el, {
      start(p) {
        if (!f.within([p.x, p.y])) return false;
        const q = f.map([p.x, p.y], false);
        if (!accept(q, [p.x, p.y])) return false;
        point = q;
        env.log('point', { what: opts.label || 'board', point: q.slice() });
        if (opts.onChange) opts.onChange(q.slice());
        return true;
      },
    }, opts.label || 'board');

    return {
      get: () => (point ? point.slice() : null),
      set(p) { point = p ? p.slice() : null; },
      toBoard: (p) => f.map(p, true),
      locate: (bp) => f.fromB(bp),
      detach,
    };
  };

  ui.hover = function hover(el, opts = {}) {
    const clock = opts.clock || (() => (typeof env.taskMs === 'number' ? env.taskMs : 0));
    const what = opts.label || 'hover';
    let since = null; // clock at entry, null when outside

    const uv = (e) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX, y: e.clientY, u: (e.clientX - r.left) / r.width, v: (e.clientY - r.top) / r.height };
    };

    const enter = (e) => {
      if (since !== null) return;
      since = clock();
      env.log('hover', { phase: 'enter', what, t: since });
      if (opts.onMove) opts.onMove(uv(e));
    };
    const leave = () => {
      if (since === null) return;
      const t = clock();
      const d = Math.max(0, t - since);
      since = null;
      env.log('hover', { phase: 'leave', what, t, dwell: d });
      if (opts.onLeave) opts.onLeave(d, t);
    };
    const move = (e) => {
      if (since === null) enter(e);
      else if (opts.onMove) opts.onMove(uv(e));
    };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('pointermove', move);

    return {
      detach() {
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointerleave', leave);
        el.removeEventListener('pointermove', move);
      },
    };
  };
})();
