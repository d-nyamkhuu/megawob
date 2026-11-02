/*
 * kit/ui/_base.js: helpers shared by the env.ui primitive files (kit/ui/*.js), loaded before them. Not part of the
 * widget API: widgets call the primitives, not these. Exposed as env.ui._base (not enumerable, so listings of env.ui
 * show only primitives).
 *
 *   clamp(x, lo, hi)
 *   val(x, d)                  x() when x is a function, else x (d, when given, replaces a null or undefined x)
 *   center(el) -> [x, y]       centre of el's bounding box in viewport px, no checks
 *   visibleCenter(el)          center(el) when el is connected and its box is not empty, else null
 *   shown(el) -> bool          connected, not inside a [hidden] element, box not empty
 *   where(el, what) -> [x, y]  center(el) when shown(el), else throws `env.ui: <what> is not rendered`; locate*()
 *                              helpers use it so a widget's locate() can delegate directly
 *   entries(els) -> [[key, el]]   from a Map, an array of [key, el] pairs or an object
 *   R2D, mod360(a), wrap180(a) -> (-180, 180]
 *   polar(c, r, a) -> [x, y]   the point at radius r and angle a (degrees, 0 = 12 o'clock, clockwise) around c
 *   angleAt(c, [x, y])         the angle of a point around c, same convention, in (-180, 180]
 *   toRect(r) -> { x, y, w, h }   from [x, y, w, h], { x, y, w, h }, a DOMRect or { left, top, right, bottom }
 *   mid(rect) -> [x, y]        centre of a { x, y, w, h } rect
 *   log(type, what, data)      env.log(type, { what, ...data })
 *   onKeys(el, map) -> detach()   keydown on el: map[e.key](e) runs and the event's default is prevented, unless the
 *                              handler returns false (then the key is left alone, as for keys not in map)
 */
(function () {
  'use strict';
  const ui = (env.ui = env.ui || {});

  const R2D = 180 / Math.PI;
  const center = (el) => {
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  };
  const shown = (el) => {
    if (!el || !el.isConnected || el.closest('[hidden]')) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 || r.height > 0;
  };

  const base = {
    R2D,
    clamp: env.util.clamp,
    val: (x, d) => (typeof x === 'function' ? x() : d !== undefined ? x ?? d : x),
    center,
    visibleCenter(el) {
      if (!el || !el.isConnected) return null;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return null;
      return [r.left + r.width / 2, r.top + r.height / 2];
    },
    shown,
    where(el, what) {
      if (!shown(el)) throw new Error(`env.ui: ${what} is not rendered`);
      return center(el);
    },
    entries: (els) => (!els ? [] : els instanceof Map ? [...els] : Array.isArray(els) ? els : Object.entries(els)),
    mod360: (a) => ((a % 360) + 360) % 360,
    wrap180(a) {
      const r = (((a + 180) % 360) + 360) % 360 - 180;
      return r === -180 ? 180 : r;
    },
    polar: (c, r, a) => [c[0] + r * Math.sin(a / R2D), c[1] - r * Math.cos(a / R2D)],
    angleAt: (c, [x, y]) => Math.atan2(x - c[0], -(y - c[1])) * R2D,
    toRect(r) {
      if (!r) return null;
      if (Array.isArray(r)) return { x: r[0], y: r[1], w: r[2], h: r[3] };
      if ('w' in r) return { x: r.x, y: r.y, w: r.w, h: r.h };
      if ('width' in r) return { x: r.left ?? r.x, y: r.top ?? r.y, w: r.width, h: r.height };
      if ('right' in r) return { x: r.left, y: r.top, w: r.right - r.left, h: r.bottom - r.top };
      throw new Error(`env.ui: not a rect: ${JSON.stringify(r)}`);
    },
    mid: (r) => [r.x + r.w / 2, r.y + r.h / 2],
    log: (type, what, data) => env.log(type, { what, ...data }),
    onKeys(el, map) {
      const h = (e) => {
        const f = Object.prototype.hasOwnProperty.call(map, e.key) ? map[e.key] : null;
        if (f && f(e) !== false) e.preventDefault();
      };
      el.addEventListener('keydown', h);
      return () => el.removeEventListener('keydown', h);
    },
  };
  Object.defineProperty(ui, '_base', { value: base, configurable: true });
})();
