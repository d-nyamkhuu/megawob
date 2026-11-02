/*
 * kit/ui/pointer.js: headless pointer primitives that the other env.ui primitives build on.
 * Behavior and geometry only: nothing here creates visible elements or sets colors, fonts or sizes.
 *
 * env.ui.track(el, handlers, label) -> detach()
 *   One pointer-capture gesture per press on el (left button). handlers:
 *     start(p, e)  return false to ignore this press
 *     move(p, e)   p = { x, y, x0, y0, dx, dy } in viewport px (x0/y0: press point; dx/dy: offset from it).
 *                  If the page scrolls during the gesture (split drags span several actions), x0/y0 move
 *                  with the page and dx/dy are in page px, so content dragged by dx/dy stays under the pointer.
 *     end(p, e)    p is the last pointer position: pointercancel / lostpointercapture carry no usable one.
 *   Logs 'grab' / 'release' with the label. Keeps tracking when the pointer leaves el.
 *
 * env.ui.draggable(el, opts) -> { get(), set(pos), locate() }
 *   Free dragging of el inside its positioned parent. Positions are el's top-left in parent-local px,
 *   placed with style.left/top (el should be position:absolute).
 *   opts: value ([x, y] start), bounds ({ x0, y0, x1, y1 } | null), label,
 *         onStart(pos), onInput(pos) during the drag, onChange(pos) on release
 *   locate() is el's current center in viewport px (where to press).
 *
 * env.ui.pad(el, opts) -> { get(), set(uv), locate(uv) }
 *   A 2D surface: maps the pointer inside el's box to uv = [u, v] in [0, 1] (u rightwards, v downwards).
 *   A press sets the value immediately; dragging refines it (clamped to the box).
 *   opts: value (initial uv), onInput(uv) during the gesture, onChange(uv) on release, rect() (custom box in
 *         viewport px, default el.getBoundingClientRect()), label.
 *   locate(uv) is the viewport point for uv.
 */
(function () {
  'use strict';
  const ui = (env.ui = env.ui || {});
  const { clamp, center } = ui._base;

  ui.track = function track(el, handlers, label = 'drag') {
    const down = (e) => {
      if (e.button !== 0) return;
      const p0 = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0 };
      if (handlers.start && handlers.start(p0, e) === false) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      env.log('grab', { what: label });
      const sx0 = window.scrollX, sy0 = window.scrollY;
      let last = { x: e.clientX, y: e.clientY };
      const pt = (ev) => {
        if (ev.type === 'pointermove' || ev.type === 'pointerup') last = { x: ev.clientX, y: ev.clientY };
        const sx = window.scrollX - sx0, sy = window.scrollY - sy0;
        return { x: last.x, y: last.y, x0: p0.x - sx, y0: p0.y - sy, dx: last.x - p0.x + sx, dy: last.y - p0.y + sy };
      };
      const move = (ev) => handlers.move && handlers.move(pt(ev), ev);
      let ended = false;
      const end = (ev) => {
        if (ended) return;
        ended = true;
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', end);
        el.removeEventListener('pointercancel', end);
        el.removeEventListener('lostpointercapture', end);
        if (handlers.end) handlers.end(pt(ev), ev);
        env.log('release', { what: label });
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
      // Capture can be lost without a pointerup (e.g. the element is re-rendered); end the gesture then too.
      el.addEventListener('lostpointercapture', end);
    };
    el.addEventListener('pointerdown', down);
    return () => el.removeEventListener('pointerdown', down);
  };

  ui.draggable = function draggable(el, opts) {
    let pos = (opts.value || [0, 0]).slice();
    const { onInput, onChange } = opts;
    const place = (node, [x, y]) => { node.style.left = x + 'px'; node.style.top = y + 'px'; };

    function constrain([x, y]) {
      const b = opts.bounds;
      if (b) {
        x = clamp(x, b.x0, b.x1);
        y = clamp(y, b.y0, b.y1);
      }
      return [x, y];
    }

    let start;
    ui.track(el, {
      start() {
        start = pos.slice();
        if (opts.onStart) opts.onStart(pos.slice());
      },
      move(p) {
        pos = constrain([start[0] + p.dx, start[1] + p.dy]);
        place(el, pos);
        if (onInput) onInput(pos.slice());
      },
      end() {
        if (onChange) onChange(pos.slice());
      },
    }, opts.label || 'draggable');

    place(el, pos);
    return {
      get: () => pos.slice(),
      set(p) { pos = p.slice(); place(el, pos); },
      locate: () => center(el),
    };
  };

  ui.pad = function pad(el, opts = {}) {
    const box = opts.rect || (() => el.getBoundingClientRect());
    let uv = opts.value ? opts.value.slice() : [0, 0];

    const toUV = ([x, y]) => {
      const r = box();
      return [clamp((x - r.left) / r.width, 0, 1), clamp((y - r.top) / r.height, 0, 1)];
    };

    ui.track(el, {
      start(p) {
        uv = toUV([p.x, p.y]);
        if (opts.onInput) opts.onInput(uv.slice());
      },
      move(p) {
        uv = toUV([p.x, p.y]);
        if (opts.onInput) opts.onInput(uv.slice());
      },
      end() {
        if (opts.onChange) opts.onChange(uv.slice());
      },
    }, opts.label || 'pad');

    return {
      get: () => uv.slice(),
      set(v) { uv = v.slice(); },
      locate([u, v]) {
        const r = box();
        return [r.left + u * r.width, r.top + v * r.height];
      },
    };
  };
})();
