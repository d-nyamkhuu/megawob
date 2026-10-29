/*
 * kit/ui/slider.js: headless value controls. Linear sliders at any angle, sliders along any SVG path,
 * dials, rotation handles and a screen-space trackball. Built on env.ui.track (pointer.js).
 * Behavior and geometry only: nothing here creates visible elements or sets colors, fonts or sizes.
 * Geometry is read from the live DOM (or the widget's callbacks) at interaction time, never cached across
 * gestures, so the widget decides orientation, size, shape and layout.
 *
 * Conventions. Points are viewport px [x, y]. A slider's "fraction" f in [0, 1] is the position along its
 * track (0 = start, 1 = end). Angles are degrees, 0 = 12 o'clock (straight up), increasing clockwise on
 * screen (the rotate task's convention); a point at angle a and radius r from center c is
 * [c.x + r sin a, c.y - r cos a].
 *
 * Value mapping (slider and dial): either min/max/step (linear; snapped to step when given) or the widget
 * passes valueAt(f) and fractionOf(value), e.g. from env.taskDef, so the widget and the scoring can never
 * disagree. valueAt must be monotonic; it does the snapping.
 *
 * ---------------------------------------------------------------- slider
 * env.ui.slider(track, opts) -> { get(), set(values), locate(value, j), locateThumb(j), pointAt(f),
 *                                 valueAt(f), fractionOf(v), length(), active(), detach() }
 *   track: the element that receives presses (it should contain the thumbs, so presses on them bubble to it).
 *   One or more thumbs (a range when 2+; a thumb stops at its neighbours, thumbs never cross). Values are controlled: the widget passes them in, gets onInput
 *   during a gesture and onChange on release, calls ctx.update(model), and calls set(values) after the
 *   model changed elsewhere (sync after tick() or the shortcut).
 *   opts:
 *     values | value       start value(s); one per thumb (default [min])
 *     thumbs               [elements]: presses inside thumbs[j] grab a thumb (may be empty, e.g. a marker
 *                          with pointer-events: none; then every press is a track press)
 *     min, max, step       linear mapping (step optional) | valueAt(f), fractionOf(v)
 *     Track geometry, first match wins:
 *       path               an SVGGeometryElement; f is the fraction of its length (getTotalLength /
 *                          getPointAtLength + getScreenCTM; uniform scale). The pointer maps to the nearest
 *                          point on the path. Its drawing direction is the slider's direction.
 *       geometry()         -> { start: [x, y], end: [x, y] } in viewport px (a straight track at any angle),
 *                          or -> { length, point(f) -> [x, y], project([x, y]) -> px along the track } for
 *                          any other curve
 *       orientation        the track's box (track.getBoundingClientRect()) and the direction of
 *                          increasing value: 'horizontal' (left to right, default) | 'vertical' (bottom to
 *                          top) | 'horizontal-reverse' | 'vertical-reverse' | a number: degrees clockwise from
 *                          +x (e.g. -30 rises to the right); the track is the longest line at that angle
 *                          through the box center. inset: px trimmed from both ends (number | [start, end]).
 *     trackClick           what a press on the track (not on a thumb) does to the nearest thumb:
 *                          'jump' (default: jump there, then keep dragging) | 'grab' (drag it from where it is)
 *                          | 'ignore' (no gesture) | fn(info, e) -> 'jump' | 'grab' | 'ignore' (undefined = 'jump')
 *                          where info = { thumb, fraction, value, point }; the widget can ctx.flag() a forbidden
 *                          click there. Logged as 'track-click'.
 *     place(thumb, point, fraction, j)   move a thumb (default: an HTML thumb's center to point via
 *                          style.left/top in its offsetParent; an SVG thumb gets transform translate() in its
 *                          parent's user space). Called on every value change and on set().
 *     onStart(j, how)      the dragged thumb is known (how: 'thumb' | 'track'); stacked thumbs: after the
 *                          first move
 *     onInput(values, j)   a value changed during a gesture (only on change)
 *     onChange(values, j)  the gesture ended (j is null if stacked thumbs never moved)
 *     label                for the event log ('grab' / 'release' via env.ui.track, plus 'track-click', 'value')
 *     keyboard             true makes track focusable (a press focuses it); arrows step the last-used thumb by
 *                          0.01 of the track (at least one value change), PageUp/PageDown x10, Home/End. Only for
 *                          tasks whose inputs include 'keyboard'.
 *   ARIA: the thumbs (the track if there are none) get role="slider" (unless they have a role) and
 *   aria-orientation="vertical" for vertical tracks.
 *   Grabbing a thumb keeps the pointer's offset along the track; the thumb whose track point is nearest the
 *   pointer is taken (not the one painted on top). Stacked thumbs (within 0.5 px): the direction of the
 *   first move (>= 1 px) picks the one that is dragged (towards the start: the lowest index).
 *   locate(value, j = 0): the viewport point where thumb j sits at value: drag from locateThumb(j) to
 *   locate(v, j) to set thumb j to v (exact for any track shape).
 *   locateThumb(j): thumb j's current point. pointAt(f): track point at fraction f. length(): track length
 *   in px.
 *
 * ---------------------------------------------------------------- dial
 * env.ui.dial(el, opts) -> { get(), set(angle), value(), locate(t), locateGrip(), valueOf(angle), center(),
 *                            detach() }
 *   An angle-based control: presses on el turn it about a center.
 *   opts:
 *     center()             pivot in viewport px (default el's box center, read per gesture)
 *     radius               number | () => number: radius for locate() (the grip's circle; default 0.8 x half
 *                          the smaller side of el's box)
 *     band                 [rMin, rMax] px (numbers or functions): presses outside the ring are ignored
 *     angle                start angle (default start); or value, the start value on the value scale
 *     start, sweep         value scale: fraction f <-> angle start + f * sweep, clockwise (defaults 0, 360)
 *     min, max, step | valueAt(f), fractionOf(v)   value mapping (default min 0, max 1)
 *     constrain(angle)     the angle rule (e.g. env.taskDef.clampDial bound to the spec). Default: angles
 *                          stay in [0, 360) when sweep >= 360, else clamp to the sweep (outside it, the
 *                          nearest end wins)
 *     follow               'offset' (default: keep the press offset between pointer angle and dial angle)
 *                          | 'pointer' (the press turns the dial to the pointer)
 *                          The angle is the pointer angle - offset, then constrained; the grip lands where the
 *                          pointer ends.
 *     onInput(angle, value), label   the widget repaints the grip/knob from onInput
 *     onChange(angle, value)         on release
 *   locate(t): t = number (an angle) | { angle } | { value } | { angle|value, radius }: the viewport point at
 *   that angle on the grip circle. A drag from locateGrip() to locate(a) leaves the dial at constrain(a).
 *
 * ---------------------------------------------------------------- rotateHandle
 * env.ui.rotateHandle(target, handle, opts) -> { get(), set(angle), locate(angle), locateHandle(),
 *                                                pivot(), detach() }
 *   Rotate target by dragging handle around a pivot. The angle is the target's rotation (degrees, clockwise,
 *   0 = as drawn); the handle sits at angle + restAngle on a circle of radius around the pivot.
 *   opts:
 *     pivot()              viewport px (default target's box center: right for elements rotated about their
 *                          own center, e.g. CSS transform-origin 50% 50%; pass it otherwise)
 *     angle, restAngle     start rotation (value is the same option, under the shared name); handle direction at
 *                          rotation 0 (default 0 = above the pivot)
 *     radius               number | () => number (default: the handle's distance from the pivot, measured
 *                          when created)
 *     constrain(angle)     default: mod 360
 *     place(target, angle) default: SVG target gets transform="rotate(angle)" (about its user-space origin);
 *                          HTML target gets style.transform = rotate(angle deg)
 *     onInput(angle), onChange(angle) on release, label
 *   Grabbing keeps the press offset. locate(angle): where the handle is when the target is at angle;
 *   locateHandle(): the handle now. A drag from locateHandle() to locate(a) leaves the target at constrain(a).
 *
 * ---------------------------------------------------------------- trackball
 * env.ui.trackball(el, opts) -> { locate([yaw, pitch]), locateGrab(), gain(), detach() }
 *   Screen-space anchored trackball: a drag of (dx, dy) px from the press point reports
 *   [yaw, pitch] = [gx * dx, gy * dy] degrees (yaw: pointer right, pitch: pointer down). Only the current
 *   offset from the press counts, so the widget composes the rotation onto the orientation it saved in onStart
 *   (e.g. q = normalize(mul(taskDef.rotation(yaw, pitch), q0))).
 *   opts: gain (deg/px: number | [gx, gy] | () => either), origin() (where locate() anchors drags; default
 *         el's box center), onStart(), onInput([yaw, pitch]), onChange([yaw, pitch]), label
 *   locateGrab(): origin(). locate([yaw, pitch]): origin + [yaw / gx, pitch / gy], where a drag pressed at
 *   locateGrab() must be released to apply that rotation.
 */
(function () {
  'use strict';
  const ui = (env.ui = env.ui || {});
  const { clamp, val, R2D, mod360, wrap180, center: boxCenter, polar, angleAt } = ui._base;
  const clamp01 = (f) => clamp(f, 0, 1);
  const decimals = (step) => (String(step).split('.')[1] || '').length;

  // Linear value <-> fraction mapping from min/max/step, unless the widget supplies its own.
  function mapping(opts, dflt) {
    const min = opts.min ?? dflt.min;
    const max = opts.max ?? dflt.max;
    const step = opts.step;
    const valueAt = opts.valueAt || ((f) => {
      f = clamp01(f);
      if (!step) return min + f * (max - min);
      const v = min + Math.round((f * (max - min)) / step) * step;
      return Number(v.toFixed(decimals(step)));
    });
    const fractionOf = opts.fractionOf || ((v) => (v - min) / (max - min));
    return { valueAt, fractionOf };
  }

  function focusable(el) {
    if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
  }

  // ---------------------------------------------------------------- track geometry
  // A geometry is { length (px), point(f) -> [x, y], project([x, y]) -> px along the track (unclamped for lines) }.

  function lineGeom(start, end) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    return {
      length,
      point: (f) => [start[0] + f * dx, start[1] + f * dy],
      project: ([x, y]) => (x - start[0]) * ux + (y - start[1]) * uy,
    };
  }

  const NAMED = { horizontal: [1, 0], vertical: [0, -1], 'horizontal-reverse': [-1, 0], 'vertical-reverse': [0, 1] };

  function boxGeom(r, orientation, inset) {
    const [i0, i1] = Array.isArray(inset) ? inset : [inset || 0, inset || 0];
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let dir = NAMED[orientation ?? 'horizontal'];
    if (!dir) {
      const a = Number(orientation) / R2D;
      dir = [Math.cos(a), Math.sin(a)].map((v) => (Math.abs(v) < 1e-12 ? 0 : v));
    }
    const [ux, uy] = dir;
    // Exact box edges for axis-aligned tracks; otherwise the longest chord at that angle through the center.
    let start;
    let end;
    if (uy === 0) {
      start = [ux > 0 ? r.left + i0 : r.right - i0, cy];
      end = [ux > 0 ? r.right - i1 : r.left + i1, cy];
    } else if (ux === 0) {
      start = [cx, uy > 0 ? r.top + i0 : r.bottom - i0];
      end = [cx, uy > 0 ? r.bottom - i1 : r.top + i1];
    } else {
      const t = Math.min(r.width / 2 / Math.abs(ux), r.height / 2 / Math.abs(uy));
      start = [cx - (t - i0) * ux, cy - (t - i0) * uy];
      end = [cx + (t - i1) * ux, cy + (t - i1) * uy];
    }
    return lineGeom(start, end);
  }

  function pathGeom(path) {
    const Lu = path.getTotalLength() || 1;
    const m = path.getScreenCTM();
    const scale = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1;
    const toScreen = (l) => {
      const p = path.getPointAtLength(l);
      return [m.a * p.x + m.c * p.y + m.e, m.b * p.x + m.d * p.y + m.f];
    };
    const length = Lu * scale;
    let pts = null;
    // Nearest point: densely sampled polyline (about every 2 px), then the best segment projection.
    function project([x, y]) {
      if (!pts) {
        const N = clamp(Math.ceil(length / 2), 32, 4000);
        pts = Array.from({ length: N + 1 }, (_, i) => toScreen((i / N) * Lu));
      }
      const N = pts.length - 1;
      let best = Infinity;
      let bestF = 0;
      for (let i = 0; i < N; i++) {
        const [ax, ay] = pts[i];
        const sx = pts[i + 1][0] - ax;
        const sy = pts[i + 1][1] - ay;
        const ss = sx * sx + sy * sy;
        const t = ss > 0 ? clamp(((x - ax) * sx + (y - ay) * sy) / ss, 0, 1) : 0;
        const d = (ax + t * sx - x) ** 2 + (ay + t * sy - y) ** 2;
        if (d < best) {
          best = d;
          bestF = (i + t) / N;
        }
      }
      return bestF * length;
    }
    return { length, point: (f) => toScreen(clamp01(f) * Lu), project };
  }

  function defaultPlace(el, [x, y]) {
    if (el instanceof SVGElement) {
      const m = el.parentNode.getScreenCTM().inverse();
      const px = m.a * x + m.c * y + m.e;
      const py = m.b * x + m.d * y + m.f;
      el.setAttribute('transform', `translate(${px} ${py})`);
      return;
    }
    const par = el.offsetParent || el.parentElement;
    const r = par.getBoundingClientRect();
    el.style.left = x - r.left - par.clientLeft - el.offsetWidth / 2 + 'px';
    el.style.top = y - r.top - par.clientTop - el.offsetHeight / 2 + 'px';
  }

  // ---------------------------------------------------------------- slider

  ui.slider = function slider(track, opts = {}) {
    const thumbs = opts.thumbs || [];
    const label = opts.label || 'slider';
    const { valueAt, fractionOf } = mapping(opts, { min: 0, max: 100 });
    const increasing = valueAt(1) >= valueAt(0);
    let values = [].concat(opts.values ?? opts.value ?? valueAt(0));
    const n = values.length;
    const place = opts.place || defaultPlace;
    let last = 0;
    const ariaEl = (j) => (thumbs.length ? thumbs[j] : j === 0 ? track : null);

    function geom() {
      if (opts.path) return pathGeom(opts.path);
      if (opts.geometry) {
        const g = opts.geometry();
        return g.start ? lineGeom(g.start, g.end) : g;
      }
      return boxGeom(track.getBoundingClientRect(), opts.orientation, opts.inset);
    }

    function placeAll(g = geom()) {
      values.forEach((v, j) => {
        if (!thumbs[j]) return;
        const f = fractionOf(v);
        place(thumbs[j], g.point(f), f, j);
      });
    }

    const lt = (a, b) => (increasing ? a < b : a > b);
    // Thumb j to fraction f, applying snapping (valueAt) and blocking at the neighbours. Returns true on change.
    function setFraction(g, j, f) {
      let v = valueAt(clamp01(f));
      if (j > 0 && lt(v, values[j - 1])) v = values[j - 1];
      if (j < n - 1 && lt(values[j + 1], v)) v = values[j + 1];
      if (v === values[j]) return false;
      values[j] = v;
      placeAll(g);
      if (opts.onInput) opts.onInput(values.slice(), j);
      return true;
    }

    let drag = null;
    const detach = ui.track(track, {
      start(p, e) {
        if (opts.keyboard) track.focus({ preventScroll: true });
        const g = geom();
        const s = g.project([p.x, p.y]);
        const ss = values.map((v) => fractionOf(v) * g.length);
        const d = ss.map((x) => Math.abs(x - s));
        const best = Math.min(...d);
        let j = d.indexOf(best);
        let how = thumbs.some((t) => t && t.contains(e.target)) ? 'thumb' : 'track';
        let offset = 0;
        let group = [j];
        if (how === 'track') {
          let policy = opts.trackClick ?? 'jump';
          const f = clamp01(s / g.length);
          if (typeof policy === 'function') {
            policy = policy({ thumb: j, fraction: f, value: valueAt(f), point: g.point(f) }, e) || 'jump';
          }
          env.log('track-click', { what: label, thumb: j, policy });
          if (policy === 'ignore') return false;
          if (policy === 'jump') setFraction(g, j, f);
          else how = 'thumb';
        }
        if (how === 'thumb') {
          offset = s - ss[j];
          group = d.map((x, k) => (x - best < 0.5 ? k : -1)).filter((k) => k >= 0);
        }
        drag = { g, j: group.length > 1 ? null : j, group, offset, how };
        if (drag.j !== null) {
          last = drag.j;
          if (opts.onStart) opts.onStart(drag.j, how);
        }
        return true;
      },
      move(p) {
        if (!drag) return;
        const { g } = drag;
        const s = g.project([p.x, p.y]) - drag.offset;
        if (drag.j === null) {
          const delta = s - fractionOf(values[drag.group[0]]) * g.length;
          if (Math.abs(delta) < 1) return;
          drag.j = delta < 0 ? drag.group[0] : drag.group[drag.group.length - 1];
          last = drag.j;
          if (opts.onStart) opts.onStart(drag.j, drag.how);
        }
        setFraction(g, drag.j, s / g.length);
      },
      end() {
        if (!drag) return;
        const { j } = drag;
        drag = null;
        if (j !== null) env.log('value', { what: label, thumb: j, value: values[j] });
        if (opts.onChange) opts.onChange(values.slice(), j);
      },
    }, label);

    if (opts.keyboard) {
      focusable(track);
      track.addEventListener('keydown', (e) => {
        const k = 0.01;
        const steps = { ArrowRight: k, ArrowUp: k, ArrowLeft: -k, ArrowDown: -k, PageUp: 10 * k, PageDown: -10 * k };
        const g = geom();
        const f0 = fractionOf(values[last]);
        let changed = false;
        if (e.key === 'Home' || e.key === 'End') changed = setFraction(g, last, e.key === 'Home' ? 0 : 1);
        else if (steps[e.key]) {
          // Keep stepping until the snapped value actually changes (coarse steps).
          for (let i = 1; i <= 1000 && !changed; i++) {
            const f = f0 + i * steps[e.key];
            changed = setFraction(g, last, f);
            if (f <= 0 || f >= 1) break;
          }
        } else return;
        e.preventDefault();
        if (changed && opts.onChange) opts.onChange(values.slice(), last);
      });
    }

    values.forEach((_, j) => {
      const el = ariaEl(j);
      if (!el || !el.setAttribute) return;
      if (!el.hasAttribute('role')) el.setAttribute('role', 'slider');
      if (opts.orientation === 'vertical') el.setAttribute('aria-orientation', 'vertical');
    });

    placeAll();
    return {
      get: () => values.slice(),
      set(v) {
        values = [].concat(v).slice();
        placeAll();
      },
      locate: (value) => geom().point(fractionOf(value)),
      locateThumb: (j = 0) => geom().point(fractionOf(values[j])),
      pointAt: (f) => geom().point(f),
      valueAt,
      fractionOf,
      length: () => geom().length,
      active: () => last,
      detach,
    };
  };

  // ---------------------------------------------------------------- angular core (dial, rotateHandle)

  // Press-drag-release that turns an angle about a center. o: { el, center(), get(), apply(angle),
  // constrain(a), follow, accept(p, c) -> bool, label }
  function angular(o) {
    let g = null;
    return ui.track(o.el, {
      start(p) {
        const c = o.center();
        if (o.accept && !o.accept([p.x, p.y], c)) return false;
        const pa = angleAt(c, [p.x, p.y]);
        g = { c, offset: o.follow === 'pointer' ? 0 : wrap180(pa - o.get()) };
        if (o.follow === 'pointer') o.apply(o.constrain(pa));
        return true;
      },
      move(p) {
        if (!g) return;
        o.apply(o.constrain(angleAt(g.c, [p.x, p.y]) - g.offset));
      },
      end() {
        if (!g) return;
        g = null;
        env.log('value', { what: o.label, angle: o.get() });
        if (o.commit) o.commit();
      },
    }, o.label);
  }

  // ---------------------------------------------------------------- dial

  ui.dial = function dial(el, opts = {}) {
    const label = opts.label || 'dial';
    const start = opts.start ?? 0;
    const sweep = opts.sweep ?? 360;
    const { valueAt, fractionOf } = mapping(opts, { min: 0, max: 1 });
    const wrap = sweep >= 360;
    const center = opts.center || (() => boxCenter(el));
    const radius = () => {
      if (opts.radius !== undefined) return val(opts.radius);
      const r = el.getBoundingClientRect();
      return 0.4 * Math.min(r.width, r.height);
    };

    const angleOf = (v) => start + fractionOf(v) * sweep;
    function fractionAt(a) {
      if (wrap) return mod360(a - start) / sweep;
      const d = a - start;
      // Inside the sweep (any turn), else the nearer end.
      const m = mod360(d);
      if (m <= sweep) return m / sweep;
      return m - sweep < 360 - m ? 1 : 0;
    }
    const valueOf = (a) => valueAt(clamp01(fractionAt(a)));
    function clampSweep(a) {
      const half = sweep / 2;
      const mid = start + half;
      return mid + clamp(wrap180(a - mid), -half, half);
    }
    const constrain = opts.constrain || ((a) => (wrap ? mod360(a) : clampSweep(a)));

    let angle = opts.angle ?? (opts.value !== undefined ? angleOf(opts.value) : start);
    function apply(a) {
      if (a === angle) return;
      angle = a;
      if (opts.onInput) opts.onInput(angle, valueOf(angle));
    }
    const band = opts.band;
    const detach = angular({
      el,
      label,
      center,
      get: () => angle,
      apply,
      constrain,
      follow: opts.follow,
      commit: () => opts.onChange && opts.onChange(angle, valueOf(angle)),
      accept: band ? (p, c) => {
        const d = Math.hypot(p[0] - c[0], p[1] - c[1]);
        return d >= val(band[0]) && d <= val(band[1]);
      } : null,
    });

    function toAngle(t) {
      if (typeof t === 'number') return t;
      if (t.angle !== undefined) return t.angle;
      return angleOf(t.value);
    }
    return {
      get: () => angle,
      set(a) { angle = a; },
      value: () => valueOf(angle),
      locate(t) {
        const r = typeof t === 'object' && t.radius !== undefined ? t.radius : radius();
        return polar(center(), r, toAngle(t));
      },
      locateGrip: () => polar(center(), radius(), angle),
      valueOf,
      center,
      detach,
    };
  };

  // ---------------------------------------------------------------- rotateHandle

  ui.rotateHandle = function rotateHandle(target, handle, opts = {}) {
    const label = opts.label || 'rotate';
    const rest = opts.restAngle || 0;
    const pivot = opts.pivot || (() => boxCenter(target));
    const place = opts.place || ((el, a) => {
      if (el instanceof SVGElement) el.setAttribute('transform', `rotate(${a})`);
      else el.style.transform = `rotate(${a}deg)`;
    });
    const constrain = opts.constrain || mod360;
    let angle = opts.angle ?? opts.value ?? 0;
    let measured = null;
    const radius = () => {
      if (opts.radius !== undefined) return val(opts.radius);
      if (measured === null) {
        const c = pivot();
        const h = boxCenter(handle);
        measured = Math.hypot(h[0] - c[0], h[1] - c[1]);
      }
      return measured;
    };
    if (opts.radius === undefined) radius();
    function apply(a) {
      if (a === angle) return;
      angle = a;
      place(target, angle);
      if (opts.onInput) opts.onInput(angle);
    }
    // The pointer turns the handle; the target's angle is the handle's angle minus its rest angle.
    const detach = angular({
      el: handle,
      label,
      center: pivot,
      get: () => angle,
      apply,
      constrain,
      follow: 'offset',
      commit: () => opts.onChange && opts.onChange(angle),
    });

    place(target, angle);
    return {
      get: () => angle,
      set(a) {
        angle = a;
        place(target, angle);
      },
      locate: (a) => polar(pivot(), radius(), a + rest),
      locateHandle: () => polar(pivot(), radius(), angle + rest),
      pivot,
      detach,
    };
  };

  // ---------------------------------------------------------------- trackball

  ui.trackball = function trackball(el, opts = {}) {
    const label = opts.label || 'trackball';
    const gain = () => {
      const g = val(opts.gain ?? 0.5);
      return Array.isArray(g) ? g : [g, g];
    };
    const origin = opts.origin || (() => boxCenter(el));
    let rot = [0, 0];
    const detach = ui.track(el, {
      start() {
        rot = [0, 0];
        if (opts.onStart) opts.onStart();
      },
      move(p) {
        const [gx, gy] = gain();
        rot = [gx * p.dx, gy * p.dy];
        if (opts.onInput) opts.onInput(rot.slice());
      },
      end() {
        env.log('value', { what: label, yaw: rot[0], pitch: rot[1] });
        if (opts.onChange) opts.onChange(rot.slice());
      },
    }, label);
    return {
      locateGrab: () => origin(),
      locate([yaw, pitch]) {
        const c = origin();
        const [gx, gy] = gain();
        return [c[0] + yaw / gx, c[1] + pitch / gy];
      },
      gain,
      detach,
    };
  };
})();
