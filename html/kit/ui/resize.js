/*
 * kit/ui/resize.js: headless resize primitives (resizable element, crop box). Built on env.ui.track.
 * Behavior and geometry only: nothing here creates visible elements, sets colors, fonts, borders or
 * injects CSS. The widget builds the element and its handles (any look, any subset of the 8 handles,
 * anywhere in the DOM) and decides how a size or rectangle is drawn through place().
 *
 * Handle names: 'nw' 'n' 'ne' 'e' 'se' 's' 'sw' 'w' (compass points of the box). A handle whose name
 * contains 'e'/'w' moves the right/left edge, 'n'/'s' the top/bottom edge.
 *
 * env.ui.resizable(el, opts) -> { get(), rect(), set(size), locateHandle(name, size?), handles }
 *   Resizes el by dragging its handles. Sizes are { w, h } in CSS px of el's own box (what
 *   style.width/height mean for el, so box-sizing is the widget's choice).
 *   opts:
 *     handles   { name: element }   the widget's handle elements (any subset of the 8 names; they may live
 *                                   inside el or anywhere else; the widget keeps them on el's edges)
 *     value     { w, h }            start size (default: el's computed width/height; older name: size)
 *     anchor    the point of el that stays fixed while resizing:
 *               'nw' (default: top-left fixed, grows right/down) | 'ne' (grows left/down) | 'sw' | 'se' |
 *               'n' | 's' | 'e' | 'w' (that edge fixed, centered along it) | 'center' (grows both ways) |
 *               [ax, ay] (fractions of the box) | 'opposite' (each drag keeps the side opposite the handle
 *               fixed, like a desktop window; the cross axis stays centered)
 *               A handle on an anchored edge cannot move that edge (drags along that axis are ignored).
 *               Dragging a handle by d px changes the size by d / (handle - anchor) on each axis it moves,
 *               so the handle stays under the pointer (2 d for 'center').
 *     min, max  { w, h }            size bounds (default 0 .. Infinity); sizes are rounded to integer px
 *     aspect    number (w / h) | true (keep the aspect ratio at press time) | null (free, default); read
 *               live, so a widget may change it on its opts object before a press (an aspect-lock toggle)
 *     place(el, rect)               draw a size; rect = { x, y, w, h } where x/y are el's CSS left/top
 *                                   (null when el is not absolutely/fixed positioned). Default: sets
 *                                   style.width/height, and style.left/top when el is absolute/fixed.
 *                                   Override to draw anything else (handles outside el, a readout, an
 *                                   SVG rect, a canvas). Called once at attach, on every input and on set().
 *     onStart(size, handle), onInput(size, handle) during a drag, onChange(size, handle) on release
 *     label     grab label prefix (default 'handle': logs grab/release 'handle-se'); logs 'resize'
 *               { what: label, handle, w, h } on release
 *   get() -> { w, h }; rect() -> { x, y, w, h }; set(size) syncs from the model (keeps the anchor; in
 *   'opposite' mode keeps the top-left corner) without callbacks.
 *   locateHandle(name, size?) -> [x, y] viewport px: where to press handle `name` now (size omitted), or
 *   where that point would be if el had `size` (so a drag between the two lands exactly on `size`,
 *   before clamping and rounding). The press point is the box's geometric edge point when it lies on the
 *   handle element, else the handle element's center; unknown handles use the geometric point.
 *
 * env.ui.cropbox(frame, box, opts) -> { get(), set(rect), locateHandle(name, rect?), locate([u, v]),
 *                                      toNorm([x, y]), handles }
 *   A rectangle inside a frame (an image), in normalized frame coordinates: rect = { l, t, r, b } with
 *   x, y running 0..1 across the frame's width and height (the frame's padding box, from the live DOM).
 *   Dragging inside `box` (not on a handle) moves the rectangle; dragging a handle moves its edges.
 *   opts:
 *     value     { l, t, r, b }      start rectangle (default the whole frame)
 *     handles   { name: element }   any subset of the 8 handles; inside box (one listener on box decides
 *                                   from the press target) or outside it (own listener each)
 *     apply(rect, action, dx, dy) -> rect
 *               the drag rule: action is a handle name or 'move'; dx, dy are the pointer offset since the
 *               press, normalized; rect is the rectangle at the press. Pass the task's own rule
 *               (crop: (r, a, dx, dy) => env.taskDef.applyDrag(r, a, dx, dy, spec)) so the primitive
 *               and the plan simulation agree exactly. Default: edges follow the pointer, clamped to the
 *               frame; 'move' translates inside the frame.
 *     place(box, rect, px)          draw a rectangle; px = { left, top, width, height } in frame-local
 *                                   CSS px. Default: box.style.left/top/width/height (box absolutely
 *                                   positioned in frame). Called at attach, on every input and on set().
 *     onInput(rect, action) during a drag, onChange(rect, action) on release
 *     label     grab label (default 'crop'); logs 'crop' { what, action, l, t, r, b } on release
 *   locateHandle(name, rect?) -> [x, y] viewport px of handle `name` (or 'move': the rectangle's center)
 *   on the current rectangle, or on `rect`. Same press-point rule as resizable: the geometric handle point
 *   if it lies on the handle element, else the element's center, shifted by rect's offset from the
 *   current one. locate([u, v]) / toNorm([x, y]) map between normalized and viewport points.
 */
(function () {
  'use strict';
  const ui = (env.ui = env.ui || {});
  const { clamp, center } = ui._base;

  const POINTS = { nw: [0, 0], n: [0.5, 0], ne: [1, 0], e: [1, 0.5], se: [1, 1], s: [0.5, 1], sw: [0, 1], w: [0, 0.5] };
  const ANCHORS = { ...POINTS, center: [0.5, 0.5] };
  const movesX = (name) => /[ew]/.test(name);
  const movesY = (name) => /[ns]/.test(name);

  // The geometric point if the handle element covers it, else the element's center.
  function pressPoint(handleEl, geo) {
    if (!handleEl) return geo;
    const r = handleEl.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return geo;
    const inside = geo[0] >= r.left && geo[0] <= r.right && geo[1] >= r.top && geo[1] <= r.bottom;
    return inside ? geo : center(handleEl);
  }

  // ------------------------------------------------------------------ resizable

  ui.resizable = function resizable(el, opts = {}) {
    const handles = opts.handles || {};
    for (const name of Object.keys(handles)) if (!POINTS[name]) throw new Error(`resizable: unknown handle '${name}'`);
    const cs = getComputedStyle(el);
    const positioned = cs.position === 'absolute' || cs.position === 'fixed';
    const min = { w: 0, h: 0, ...(opts.min || {}) };
    const max = { w: Infinity, h: Infinity, ...(opts.max || {}) };
    const snap = (s) => ({ w: Math.round(s.w), h: Math.round(s.h) });
    const place = opts.place || ((node, r) => {
      node.style.width = r.w + 'px';
      node.style.height = r.h + 'px';
      if (r.x !== null) {
        node.style.left = r.x + 'px';
        node.style.top = r.y + 'px';
      }
    });
    const label = opts.label || 'handle';

    const s0 = opts.value || opts.size || { w: parseFloat(cs.width) || 0, h: parseFloat(cs.height) || 0 };
    let rect = {
      x: positioned ? parseFloat(cs.left) || 0 : null,
      y: positioned ? parseFloat(cs.top) || 0 : null,
      w: s0.w,
      h: s0.h,
    };
    const fixedAnchor = Array.isArray(opts.anchor) ? opts.anchor : ANCHORS[opts.anchor || 'nw'];
    if (!fixedAnchor && opts.anchor !== 'opposite') throw new Error(`resizable: unknown anchor '${opts.anchor}'`);

    // The fixed point [ax, ay] while dragging handle `name`.
    function anchorFor(name) {
      if (fixedAnchor) return fixedAnchor;
      const [hx, hy] = POINTS[name];
      return [hx === 0 ? 1 : hx === 1 ? 0 : 0.5, hy === 0 ? 1 : hy === 1 ? 0 : 0.5];
    }
    // Size change per px of handle movement along each axis (0 = the handle does not move that edge).
    function gains(name) {
      const [hx, hy] = POINTS[name];
      const [ax, ay] = anchorFor(name);
      return [movesX(name) && hx !== ax ? 1 / (hx - ax) : 0, movesY(name) && hy !== ay ? 1 / (hy - ay) : 0];
    }
    // CSS px per viewport px (1 unless el is transformed or zoomed).
    function scale() {
      const r = el.getBoundingClientRect();
      return [el.offsetWidth ? r.width / el.offsetWidth : 1, el.offsetHeight ? r.height / el.offsetHeight : 1];
    }

    // Clamp to min/max (free resize: only the axes the handle moves, so the other keeps its size).
    function bound(w, h, start, gx, gy) {
      const a = opts.aspect === true ? start.w / start.h : opts.aspect;
      if (!a) return { w: gx ? clamp(w, min.w, max.w) : w, h: gy ? clamp(h, min.h, max.h) : h };
      w = clamp(w, Math.max(min.w, min.h * a), Math.min(max.w, max.h * a));
      return { w, h: w / a };
    }

    // The rect after dragging handle `name` by (dx, dy) CSS px from `start`.
    function resized(start, name, dx, dy) {
      const [gx, gy] = gains(name);
      let w = start.w + dx * gx;
      let h = start.h + dy * gy;
      const a = opts.aspect === true ? start.w / start.h : opts.aspect;
      if (a) {
        if (gx && gy) {
          if (Math.abs(w / start.w - 1) >= Math.abs(h / start.h - 1)) h = w / a;
          else w = h * a;
        } else if (gx) h = w / a;
        else if (gy) w = h * a;
        else return { ...start };
      }
      const s = snap(bound(w, h, start, gx, gy));
      return around(start, s, anchorFor(name));
    }

    // Keep the anchor point of `from` fixed while changing the size to s.
    function around(from, s, [ax, ay]) {
      return {
        x: from.x === null ? null : from.x + ax * (from.w - s.w),
        y: from.y === null ? null : from.y + ay * (from.h - s.h),
        w: s.w,
        h: s.h,
      };
    }

    const size = () => ({ w: rect.w, h: rect.h });
    const draw = () => place(el, { ...rect });

    let start;
    for (const [name, h] of Object.entries(handles)) {
      ui.track(h, {
        start() {
          start = { ...rect };
          if (opts.onStart) opts.onStart(size(), name);
        },
        move(p) {
          const [sx, sy] = scale();
          rect = resized(start, name, p.dx / sx, p.dy / sy);
          draw();
          if (opts.onInput) opts.onInput(size(), name);
        },
        end() {
          env.log('resize', { what: label, handle: name, w: rect.w, h: rect.h });
          if (opts.onChange) opts.onChange(size(), name);
        },
      }, `${label}-${name}`);
    }
    draw();

    return {
      handles: Object.keys(handles),
      get: size,
      rect: () => ({ ...rect }),
      set(s) {
        rect = around(rect, { w: s.w, h: s.h }, fixedAnchor || [0, 0]);
        draw();
      },
      locateHandle(name, s) {
        if (!POINTS[name]) throw new Error(`resizable: unknown handle '${name}'`);
        const r = el.getBoundingClientRect();
        const [hx, hy] = POINTS[name];
        const here = pressPoint(handles[name], [r.left + hx * r.width, r.top + hy * r.height]);
        if (!s) return here;
        const [sx, sy] = scale();
        const [gx, gy] = gains(name);
        // Handle displacement = size change / gain on each axis it moves.
        const dx = gx ? ((s.w - rect.w) / gx) * sx : 0;
        const dy = gy ? ((s.h - rect.h) / gy) * sy : 0;
        return [here[0] + dx, here[1] + dy];
      },
    };
  };

  // ------------------------------------------------------------------ cropbox

  ui.cropbox = function cropbox(frame, box, opts = {}) {
    const handles = opts.handles || {};
    for (const name of Object.keys(handles)) if (!POINTS[name]) throw new Error(`cropbox: unknown handle '${name}'`);
    const apply = opts.apply || ((c0, action, dx, dy) => {
      const c = { ...c0 };
      if (action === 'move') {
        const w = c.r - c.l;
        const h = c.b - c.t;
        c.l = clamp(c.l + dx, 0, 1 - w);
        c.t = clamp(c.t + dy, 0, 1 - h);
        c.r = c.l + w;
        c.b = c.t + h;
        return c;
      }
      if (action.includes('w')) c.l = clamp(c.l + dx, 0, c.r);
      if (action.includes('e')) c.r = clamp(c.r + dx, c.l, 1);
      if (action.includes('n')) c.t = clamp(c.t + dy, 0, c.b);
      if (action.includes('s')) c.b = clamp(c.b + dy, c.t, 1);
      return c;
    });
    const frameRect = () => {
      const r = frame.getBoundingClientRect();
      const sx = frame.offsetWidth ? r.width / frame.offsetWidth : 1;
      const sy = frame.offsetHeight ? r.height / frame.offsetHeight : 1;
      return { left: r.left + frame.clientLeft * sx, top: r.top + frame.clientTop * sy, width: frame.clientWidth * sx, height: frame.clientHeight * sy };
    };
    const place = opts.place || ((node, r, px) => {
      node.style.left = px.left + 'px';
      node.style.top = px.top + 'px';
      node.style.width = px.width + 'px';
      node.style.height = px.height + 'px';
    });
    const label = opts.label || 'crop';
    let value = { l: 0, t: 0, r: 1, b: 1, ...(opts.value || {}) };

    const draw = () => {
      const W = frame.clientWidth;
      const H = frame.clientHeight;
      const v = value;
      place(box, { ...v }, { left: v.l * W, top: v.t * H, width: (v.r - v.l) * W, height: (v.b - v.t) * H });
    };
    const point = (rect, name) => {
      const [fx, fy] = name === 'move' ? [0.5, 0.5] : POINTS[name];
      return [rect.l + fx * (rect.r - rect.l), rect.t + fy * (rect.b - rect.t)];
    };
    const toView = ([u, v]) => {
      const f = frameRect();
      return [f.left + u * f.width, f.top + v * f.height];
    };

    // Which action a press on `target` starts (null: none).
    function actionAt(target) {
      for (const [name, h] of Object.entries(handles)) if (h.contains(target)) return name;
      return box.contains(target) ? 'move' : null;
    }

    let start;
    let action;
    let fr;
    const gesture = (fixed) => ({
      start(p, e) {
        const a = fixed || actionAt(e.target);
        if (!a) return false;
        action = a;
        start = { ...value };
        fr = frameRect();
        return undefined;
      },
      move(p) {
        value = apply({ ...start }, action, p.dx / fr.width, p.dy / fr.height);
        draw();
        if (opts.onInput) opts.onInput({ ...value }, action);
      },
      end() {
        env.log('crop', { what: label, action, ...value });
        if (opts.onChange) opts.onChange({ ...value }, action);
        action = null;
      },
    });
    ui.track(box, gesture(null), label);
    for (const [name, h] of Object.entries(handles)) if (!box.contains(h)) ui.track(h, gesture(name), label);

    draw();

    return {
      handles: Object.keys(handles),
      get: () => ({ ...value }),
      set(rect) {
        value = { l: rect.l, t: rect.t, r: rect.r, b: rect.b };
        draw();
      },
      locate: toView,
      toNorm([x, y]) {
        const f = frameRect();
        return [(x - f.left) / f.width, (y - f.top) / f.height];
      },
      locateHandle(name, rect) {
        if (name !== 'move' && !POINTS[name]) throw new Error(`cropbox: unknown handle '${name}'`);
        const here = toView(point(value, name));
        const at = name === 'move' ? here : pressPoint(handles[name], here);
        if (!rect) return at;
        if (at === here) return toView(point(rect, name));
        const f = frameRect();
        const [u0, v0] = point(value, name);
        const [u1, v1] = point(rect, name);
        return [at[0] + (u1 - u0) * f.width, at[1] + (v1 - v0) * f.height];
      },
    };
  };
})();
