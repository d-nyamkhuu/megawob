/*
 * rotate-object: turn an object to a target orientation. MiniWoB counterpart: drag-cube.
 *
 * Scenarios
 *   cube     a 3D cube with six colored, labeled faces. Dragging rotates it trackball-style in screen
 *            space; bring a named face to the front. spec.upright (harder sub-mode): the face's label must
 *            also read upright (no roll).
 *   dial     a knob with tick labels. Turn it to a stated value (value dials with a 270-330 degree sweep and a
 *            dead zone at the bottom) or a compass heading (full-turn dial); sometimes relative to the current
 *            reading ("turn Volume up by 20"). Routes: drag the grip; the mouse wheel over the knob (one notch =
 *            one wheelStep, wheel up = more); keyboard (click the knob to focus, arrows = one step, PageUp/Down =
 *            ten steps).
 *   orient   rotate a shape with a design-tool rotation handle so it matches a reference drawn beside it
 *            (match), points at a star (point), or points at a stated heading (heading; the rotation field can
 *            be typed into in keyboard episodes).
 *   photo    a photo editor: rotate an image by a stated angle (angle), straighten a tilted horizon (level) or
 *            turn a sideways / upside-down photo upright (upright). Controls: a rotation handle on the image, a
 *            Straighten slider (-45..45), rotate 90° left/right buttons, and an angle readout that is an editable
 *            field in keyboard episodes. Positive angles are clockwise.
 *   compass  a map with place pins: rotate it (rotation ring handle, compass rose and bearing readout) to a map
 *            bearing (bearing), so that a named place is straight up from the center (face), or so that north
 *            points right / left / down (north).
 *
 * Traits (opts.traits, declared by a widget)
 *   turntable: true   cube episodes become a 360° product viewer: the object only spins about the screen-vertical
 *                     axis (yaw). spec.turntable = true, the target is a side face (front/right/back/left),
 *                     upright is false (roll is always 0), off/partial/wrong starts are yaw-only orientations,
 *                     plan drags have pitch 0, faces carry printed-package labels (PRODUCT_SIDES) and the
 *                     instruction talks about spinning the product. Widgets without the trait sample as before.
 *
 *   shapes: ['ell', ...]  orient: match-mode shapes are drawn from this list (names of SHAPES or EXTRA_SHAPES) instead of the
 *                     default bank; 'ell' is an asymmetric L (symmetry order 1, so the target angle is unique). Widgets that
 *                     list it must draw it (base widget: SHAPE_PATHS.ell). Point / heading modes are unaffected.
 *   modes: ['match']  orient: restrict the mode (match | point | heading) to these.
 *   grip: 'hub'       orient: the rotation grip is the central pivot instead of a handle at a radius. spec.grip = 'hub'
 *                     and the plan's drag starts at { hub: true } (the pivot) instead of { handle: true }; it still ends at
 *                     { handleAngle: a }. The widget renders the hub grip and maps a drag pressed there to the pointer's
 *                     angle about the pivot (no press offset), so the point at handleAngle(a) must lie well away from the
 *                     pivot (the task does not constrain the radius). Typed keyboard routes are unaffected.
 *   (Without these traits, spec / model / plan / error and every rng draw are unchanged.)
 *
 * Episode knob route (opts.route: 'pointer' | 'keyboard' | 'wheel' | undefined). The spec is sampled with the
 * same rng draws as without it, then overridden where the scenario has that route (otherwise ignored):
 *   wheel     dial: wheel = true, route 'wheel'
 *   keyboard  dial: keys = true, route 'keys'; orient heading: keys = true, route 'type'; photo angle / level:
 *             keys = true, route 'type'
 *   pointer   dial: keys = wheel = false, route 'drag'; orient: keys = false, route 'drag'; photo: keys = false,
 *             a typed route becomes 'handle'
 * cube and compass have only pointer routes and ignore it.
 *
 * Coordinates: screen space as in CSS 3D: x right, y down, z toward the viewer. Angles are degrees;
 * 2D angles run clockwise from 12 o'clock.
 *
 * spec (all: scenario, isplit, csplit, ood, startMode)
 *   cube    { faces: [{ label, color, colorName }] (index = face id, frames in FACES),
 *             target (face index), upright (bool), ref: 'label' | 'color' | 'both', turntable? (trait) }
 *   dial    { kind: 'value' | 'heading', label, aliases, min, max, unit, dec (readout decimals), tdec,
 *             start (angle of min), sweep, major, minor (tick spacing in value units), target, tau,
 *             wheelStep (value per wheel notch / arrow key), from (start value for 'off' starts), rel (bool: the
 *             goal is relative to from), readout (bool), keys, wheel (input kinds allowed), route: 'drag' | 'wheel' | 'keys' }
 *   orient  { mode: 'match' | 'point' | 'heading', shape, order (rotational symmetry), color, target, keys, route: 'drag' | 'type' }
 *   photo   { mode: 'angle' | 'level' | 'upright', target (rotation in (-180, 180]), from (start rotation), tilt
 *             (level: horizon tilt as drawn), base (upright: content rotation as drawn), scene, buttons, slider,
 *             keys (bool), tau, route: 'handle' | 'slider' | 'buttons' | 'type' }
 *   compass { mode: 'bearing' | 'face' | 'north', places: [{ name, bearing, dist }], ref (place index), bearing
 *             (bearing mode), north ('right' | 'left' | 'down'), target (map rotation), from, tau }
 * model
 *   cube    { q: [w, x, y, z] }   unit quaternion: cube-local -> screen
 *   dial    { angle, focus? }     grip direction; value dials keep it in [start, start + sweep]; focus mirrors
 *                                 keyboard focus on the knob (unscored)
 *   orient  { angle }             shape rotation in [0, 360) (0 = as drawn: arrows point up)
 *   photo   { angle }             image rotation in (-180, 180], clockwise positive
 *   compass { angle }             map rotation in [0, 360): the screen direction north points to
 *
 * error
 *   cube    degrees between the target face's outward normal and the direction to the viewer (+z);
 *           upright: max of that and |roll|, the angle between the face's up vector projected onto the
 *           screen and screen-up. tau 12.
 *   dial    |value - target| in the dial's units (heading: circular degrees); tau is 2.7-3.4 degrees of
 *           knob travel expressed in those units.
 *   orient  circular degrees modulo the shape's symmetry period 360 / order. tau 3.
 *   photo   circular degrees to the target rotation. tau 1 (ood 0.75).
 *   compass circular degrees to the target map rotation. tau 3 (ood 2).
 * Tolerances are stated in about half of the instructions (env.instruct.tol); scoring never changes.
 *
 * Levels (opts.level easy | medium; normal is unchanged; spec.level records it): tolerance x2 / x1.5 (cube 24 / 18
 * degrees, dial and photo and compass spec.tau, orient 6 / 4.5), cube: no upright sub-mode and the face named by label
 * and color together (easy), dial: no relative goals (easy), compass: 4 / 5 places at most. The picture itself is
 * not changed.
 *
 * Start modes: off, solved, partial (cube: target face tilted 25-45 degrees from the front / rolled; dial,
 * orient, photo, compass: half way from the start to the target), wrong (cube: another face in front; dial: a
 * plausible misreading (digits swapped, mirrored about the middle); orient / compass: the opposite or mirrored
 * direction; photo: rotated the wrong way).
 *
 * Input routes: inputs are ['pointer'] plus 'wheel' (dial.wheel, 30%) and 'keyboard' (dial.keys 25%, orient
 * heading 20%, photo 30%). The oracle uses them in part of those episodes (spec.route); opts.route forces one.
 *
 * plan targets
 *   { hub: true }               the pivot (orient with traits.grip 'hub': where the drag is pressed)
 *   { grab: 'cube' }            where a cube drag starts (the center of the cube's drag area)
 *   { rotateBy: [yaw, pitch] }  where that drag ends: yaw = degrees the front turns to the right
 *                               (horizontal pointer motion), pitch = degrees it tips down (vertical motion).
 *                               The widget divides by its gain (deg/px) relative to the grab point. A drag of
 *                               (dx, dy) px applies rotation(gain*dx, gain*dy) on top of the orientation at
 *                               press (anchored: only the current offset from the press point matters).
 *                               Each step stays within MAX_DRAG degrees per axis. Turntable: pitch is 0 and
 *                               the widget ignores vertical motion.
 *   { grip: true }              the dial grip's current center
 *   { dialAngle: a }            where a drag pressed at { grip } must end to leave the dial at angle a. Circular
 *                               widgets: the point on the grip's circle at angle a (the grip follows the
 *                               pointer's angle about the center). Vertical-drag knobs: the press point moved
 *                               up by (a - current angle) x gain px (heading dials: the shortest way round),
 *                               clamped to the viewport, so a long turn may take another drag.
 *   { knob: true }              a point on the dial knob (wheel and focus-click target; it does not turn it)
 *   { handle: true }            the rotation handle's current center (orient, photo, compass)
 *   { handleAngle: a }          where the handle sits when the shape / photo / map is at rotation a
 *   { straighten: 'thumb' }     the Straighten slider's thumb; { straighten: v } the slider point for v
 *   { button: 'cw' | 'ccw' }    rotate 90° right / left (photo)
 *   { field: 'angle' }          the rotation / angle text field (orient heading, photo)
 *   plan steps also use { wheel: [{ knob: true }, dy] } (dy = -100 per notch up) and { key: 'ArrowUp' | ... }.
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   quat { mul, conj, axisAngle, normalize, matrix, rotate } quaternion operations.
 *   rotation(yaw, pitch) screen-space trackball rotation quaternion.
 *   FACES face frames in cube-local space (face 0 = front).
 *   faceWorld(q, i) -> { normal, up } for face i in screen space.
 *   dialValue(spec, angle) the reading at a grip angle.
 *   dialAngleFor(spec, value) the grip angle for a reading.
 *   clampDial(spec, angle) clamp to a value dial's sweep or wrap a heading.
 *   dialStep(spec, value, n) snap n wheel / arrow steps to the wheelStep grid.
 *   parseAngle(text) a numeric degree value or NaN.
 *   wrap180(angle) wrap degrees to (-180, 180].
 *   mod360(angle) wrap degrees to [0, 360).
 *   MAX_DRAG the maximum degrees per drag per axis.
 *
 * Internal shared code is on lib; the checker-only tests live in selftest.js.
 *
 * Round 2 hooks (optional, pure; see the html/kit/env.js header)
 *   facts(model, spec)       the number the page reads out for the final pose: dial (only when spec.readout) the dial's
 *                            value as its readout shows it ("Volume: 35 %" style, heading "270°"; label paraphrases in labels), photo "Angle: 20°",
 *                            orient "Rotation: 135°", compass "Bearing: 40°" (the base widget always shows these
 *                            readouts). cube: the color of the front face when the goal named it by label, its label
 *                            when named by color, [] when it named both (nothing left to read off).
 *   silent(next, prev, spec, rng)   the pose slipped back: angle models turn by 5 degrees (then 8, 12, 20; for a value
 *                            dial in knob travel, clamped to the sweep) away from `next`, cube tips by 8-30 degrees about a
 *                            screen axis (yaw only with traits.turntable), keeping the first slip whose error exceeds tau.
 *                            null in a judge episode or when none does.
 *   retarget(spec, model, rng)   a new goal on the same page: cube another face (same cube), value dial / heading dial
 *                            a new grid value (rel goals become absolute), orient a new angle (the reference / star /
 *                            heading follows spec.target), photo angle mode a new rotation (spec.abs: the instruction
 *                            names the angle, never "N more"), compass a new bearing / place / north direction. null for
 *                            photo level / upright (the scene's tilt is drawn into the picture) and in a judge episode.
 *   parts(model, spec)       preempt=cancel: the one thing turned, by the name the page gives it (dial: its label; photo "Angle",
 *                            orient "Rotation", compass "Bearing", cube "Cube" / "Product"), value its pose.
 *   judgeModes ambiguous, impossible (every scenario, as the checker requires; spec.judge = { mode, cands, others, what, subject,
 *                            templates, ... }; start solved; no confirm: the poses have no irreversible step). The goal text
 *                            replaces the scenario's own:
 *     ambiguous   two candidate values for the goal ("set it to A or B"): two faces (cube; cands: the face's color / label
 *                 spellings, others: the cube's other faces), two dial values or headings, two angles (orient, photo), two
 *                 bearings (compass), two places (compass face; others: the other places on the map); the reply asks,
 *                 one option per candidate
 *     impossible  something the page does not have: a cube face (label or color) that is not on it, a value past the dial's
 *                 scale (value dials; what: the value) or a dial the page lacks (heading), a shape that is not drawn (orient),
 *                 a layer that does not exist (photo), a place that is not on the map (compass); what names it
 *
 * Deviations from MiniWoB: drag-cube only has the cube; dial, orient, photo and compass are additions.
 */
(function () {
  'use strict';

  const { clamp } = env.util;
  const { content } = env;

  const D2R = Math.PI / 180;
  const R2D = 180 / Math.PI;
  const MAX_DRAG = 100; // degrees per drag per axis; widgets pick gains so this fits in the viewport
  const EPS_DEG = 0.05;

  const mod360 = (a) => ((a % 360) + 360) % 360;
  const wrapP = (a, p) => {
    const r = (((a + p / 2) % p) + p) % p - p / 2;
    return r === -p / 2 ? p / 2 : r;
  };
  const wrap180 = (a) => wrapP(a, 360);
  const round = (x, d) => Number(x.toFixed(d));

  // ---------------------------------------------------------------- quaternions [w, x, y, z]

  const quat = {
    mul(a, b) {
      return [
        a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
        a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
        a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
        a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
      ];
    },
    conj: (q) => [q[0], -q[1], -q[2], -q[3]],
    normalize(q) {
      const n = Math.hypot(...q) || 1;
      const s = q[0] < 0 ? -1 : 1; // canonical sign keeps models readable and comparable
      return q.map((v) => (s * v) / n);
    },
    axisAngle(axis, deg) {
      const n = Math.hypot(...axis);
      if (n < 1e-12 || Math.abs(deg) < 1e-12) return [1, 0, 0, 0];
      const h = (deg * D2R) / 2;
      const s = Math.sin(h) / n;
      return [Math.cos(h), axis[0] * s, axis[1] * s, axis[2] * s];
    },
    // Row-major 3x3 rotation matrix (column vectors: v' = M v).
    matrix(q) {
      const [w, x, y, z] = q;
      return [
        [1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y)],
        [2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x)],
        [2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y)],
      ];
    },
    rotate(q, v) {
      const m = quat.matrix(q);
      return m.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
    },
  };

  // One trackball drag: the front surface follows the pointer. yaw turns about screen-down (+y),
  // pitch about screen-left (-x): rotation vector (-pitch, yaw, 0) degrees.
  const rotation = (yaw, pitch) => quat.axisAngle([-pitch, yaw, 0], Math.hypot(yaw, pitch));

  // Face frames in cube-local space. A face div's own frame (x right, y down, z out) is rotated by
  // its quaternion: outward normal = R e_z, label up = -R e_y.
  const Y = [0, 1, 0];
  const X = [1, 0, 0];
  const FACES = [
    { id: 'front', q: [1, 0, 0, 0] },
    { id: 'right', q: quat.axisAngle(Y, 90) },
    { id: 'back', q: quat.axisAngle(Y, 180) },
    { id: 'left', q: quat.axisAngle(Y, -90) },
    { id: 'top', q: quat.axisAngle(X, 90) },
    { id: 'bottom', q: quat.axisAngle(X, -90) },
  ];

  function faceWorld(q, i) {
    const w = quat.mul(q, FACES[i].q);
    const normal = quat.rotate(w, [0, 0, 1]);
    const d = quat.rotate(w, [0, 1, 0]);
    return { normal, up: [-d[0], -d[1], -d[2]] };
  }

  function cubeAngles(model, spec) {
    const { normal, up } = faceWorld(model.q, spec.target);
    const tilt = Math.acos(clamp(normal[2], -1, 1)) * R2D;
    const roll = Math.atan2(up[0], -up[1]) * R2D;
    return { tilt, roll, normal };
  }

  // Proper Euler decompositions D = A(a) B(b) A(c) with A, B in-plane screen axes (applied c first).
  function euler(D, A, B) {
    const m = quat.matrix(D);
    const ix = A === X ? 0 : 1; // index of the repeated axis
    const iy = 1 - ix;
    const iz = 2;
    // For XYX: b = acos(m00), a = atan2(m10, -m20), c = atan2(m01, m02).
    // For YXY: b = acos(m11), a = atan2(m01, m21), c = atan2(m10, -m12).
    const cb = clamp(m[ix][ix], -1, 1);
    let b = Math.acos(cb) * R2D;
    let a;
    let c;
    if (Math.sin(b * D2R) > 1e-7) {
      if (A === X) {
        a = Math.atan2(m[iy][ix], -m[iz][ix]) * R2D;
        c = Math.atan2(m[ix][iy], m[ix][iz]) * R2D;
      } else {
        a = Math.atan2(m[iy][ix], m[iz][ix]) * R2D;
        c = Math.atan2(m[ix][iy], -m[ix][iz]) * R2D;
      }
    } else {
      // Gimbal: everything about A. D = B(b) A(c) with a = 0.
      b = cb > 0 ? 0 : 180;
      a = 0;
      const r = quat.mul(quat.axisAngle(B, -b), D);
      const comp = r[1] * A[0] + r[2] * A[1] + r[3] * A[2];
      c = wrap180(2 * Math.atan2(comp, r[0]) * R2D);
    }
    return [a, b, c];
  }

  const compose = (A, B, [a, b, c]) => quat.mul(quat.axisAngle(A, a), quat.mul(quat.axisAngle(B, b), quat.axisAngle(A, c)));
  const toRotateBy = (axis, deg) => (axis === X ? [0, -deg] : [deg, 0]);
  const chunk = (deg) => clamp(deg, -MAX_DRAG, MAX_DRAG);

  // Next drag for the upright sub-mode: the first non-trivial factor of the cheapest Euler decomposition
  // (XYX or YXY, either branch) of the rotation still needed. Taking any prefix of the cheapest
  // decomposition leaves a remainder at least that much cheaper, so the loop converges.
  function uprightStep(model, spec) {
    const goal = quat.conj(FACES[spec.target].q);
    const D = quat.mul(goal, quat.conj(model.q));
    let best = null;
    for (const [A, B] of [[X, Y], [Y, X]]) {
      const [a, b, c] = euler(D, A, B);
      for (const e of [[a, b, c], [a + 180, -b, c + 180]]) {
        const w = [wrap180(e[0]), e[1], wrap180(e[2])];
        const cost = Math.abs(w[0]) + Math.abs(w[1]) + Math.abs(w[2]);
        if (!best || cost < best.cost - 1e-9) best = { cost, A, B, e: w };
      }
    }
    const [a, b, c] = best.e;
    if (Math.abs(c) > EPS_DEG) return toRotateBy(best.A, chunk(c));
    if (Math.abs(b) > EPS_DEG) return toRotateBy(best.B, chunk(b));
    if (Math.abs(a) > EPS_DEG) return toRotateBy(best.A, chunk(a));
    return null;
  }

  // Non-upright: the shortest rotation taking the face normal to +z is about the in-plane axis n x z,
  // so one straight drag (two when the face points away) brings the face to the front.
  function frontStep(model, spec) {
    const { normal: n, tilt } = cubeAngles(model, spec);
    if (tilt < EPS_DEG) return null;
    let ax = n[1];
    let ay = -n[0];
    const len = Math.hypot(ax, ay);
    if (len < 1e-6) {
      ax = 0;
      ay = 1;
    } else {
      ax /= len;
      ay /= len;
    }
    // rotation(yaw, pitch) has rotation vector (-pitch, yaw); scale so the larger component <= MAX_DRAG.
    const step = Math.min(tilt, MAX_DRAG / Math.max(Math.abs(ax), Math.abs(ay)));
    return [step * ay, -step * ax];
  }

  // Turntable: the target face's normal stays in the horizontal plane; turn it straight to +z by pure yaw
  // (rotation(yaw, 0) turns normals toward +x), at most MAX_DRAG per drag. A face pointing away (180) takes two.
  function turntableStep(model, spec) {
    const { normal: n, tilt } = cubeAngles(model, spec);
    if (tilt < EPS_DEG) return null;
    const phi = Math.atan2(n[0], n[2]) * R2D;
    return [chunk(-phi), 0];
  }
  const yawOf = (q) => wrap180(2 * Math.atan2(q[2], q[0]) * R2D);

  function randomQuat(rng) {
    const u1 = rng.next();
    const u2 = rng.next() * 2 * Math.PI;
    const u3 = rng.next() * 2 * Math.PI;
    const a = Math.sqrt(1 - u1);
    const b = Math.sqrt(u1);
    return quat.normalize([b * Math.cos(u3), a * Math.sin(u2), a * Math.cos(u2), b * Math.sin(u3)]);
  }

  // ---------------------------------------------------------------- dial

  const DIALS = [
    { label: 'Volume', aliases: ['volume knob', 'volume control'], min: 0, max: 100, unit: '', sweep: 270, major: 10, minor: 2, tau: 1, dec: 0, tdec: 0, tstep: 1 },
    { label: 'Temperature', aliases: ['temperature knob', 'thermostat'], min: 10, max: 30, unit: ' °C', sweep: 270, major: 5, minor: 1, tau: 0.2, dec: 1, tdec: 1, tstep: 0.5 },
    { label: 'Speed', aliases: ['speed knob', 'speed control'], min: 0, max: 10, unit: '', sweep: 270, major: 1, minor: 0.5, tau: 0.1, dec: 1, tdec: 1, tstep: 0.1 },
    { label: 'Gain', aliases: ['gain knob', 'input gain'], min: -12, max: 12, unit: ' dB', sweep: 270, major: 3, minor: 1, tau: 0.3, dec: 1, tdec: 1, tstep: 0.5 },
    { label: 'Timer', aliases: ['timer knob', 'kitchen timer'], min: 0, max: 60, unit: ' min', sweep: 330, major: 10, minor: 1, tau: 0.5, dec: 1, tdec: 0, tstep: 1 },
    { label: 'Tuner', aliases: ['radio tuner', 'frequency dial'], min: 88, max: 108, unit: ' MHz', sweep: 270, major: 4, minor: 1, tau: 0.2, dec: 1, tdec: 1, tstep: 0.1 },
  ];
  const HEADING = { label: 'Heading', aliases: ['compass dial', 'heading knob'], min: 0, max: 360, unit: '°', sweep: 360, major: 30, minor: 5, tau: 3, dec: 0, tdec: 0, tstep: 5 };

  function clampDial(spec, angle) {
    if (spec.kind === 'heading') return mod360(angle);
    const half = spec.sweep / 2;
    return clamp(wrap180(angle - (spec.start + half)), -half, half) + spec.start + half;
  }
  function dialValue(spec, angle) {
    if (spec.kind === 'heading') return mod360(angle);
    return spec.min + ((clampDial(spec, angle) - spec.start) / spec.sweep) * (spec.max - spec.min);
  }
  function dialAngleFor(spec, value) {
    if (spec.kind === 'heading') return mod360(value);
    return spec.start + ((value - spec.min) / (spec.max - spec.min)) * spec.sweep;
  }
  function dialError(spec, angle) {
    const v = dialValue(spec, angle);
    return spec.kind === 'heading' ? Math.abs(wrap180(v - spec.target)) : Math.abs(v - spec.target);
  }
  const fmtValue = (spec, v) => `${v.toFixed(spec.tdec)}${spec.unit}`;

  // n wheel notches / arrow presses from value: the first step snaps an off-grid value to the grid point in
  // that direction, every further step moves one wheelStep.
  function dialStep(spec, value, n) {
    if (!n) return value;
    const step = spec.wheelStep;
    if (spec.kind === 'heading') {
      const k = n > 0 ? Math.floor(value / step + 1e-9) : Math.ceil(value / step - 1e-9);
      return mod360(Number(((k + n) * step).toFixed(6)));
    }
    const x = (value - spec.min) / step;
    const k = n > 0 ? Math.floor(x + 1e-9) : Math.ceil(x - 1e-9);
    return clamp(Number((spec.min + (k + n) * step).toFixed(6)), spec.min, spec.max);
  }
  // Steps that bring value exactly to the target (0 when already there).
  function dialSteps(spec, value) {
    const step = spec.wheelStep;
    if (spec.kind === 'heading') {
      const diff = wrap180(spec.target - value);
      if (Math.abs(diff) < 1e-9) return 0;
      const tt = Math.round((value + diff) / step);
      return diff > 0 ? tt - Math.floor(value / step + 1e-9) : tt - Math.ceil(value / step - 1e-9);
    }
    if (Math.abs(spec.target - value) < 1e-9) return 0;
    const kt = Math.round((spec.target - spec.min) / step);
    const x = (value - spec.min) / step;
    return spec.target > value ? kt - Math.floor(x + 1e-9) : kt - Math.ceil(x - 1e-9);
  }

  // ---------------------------------------------------------------- orient

  // Rotational symmetry order of each shape (as drawn by widgets, pivoting on the shape's center).
  const SHAPES = { arrow: 1, dart: 1, letter: 1, tee: 1, house: 1, triangle: 3, bar: 2, cross: 4, star: 5 };
  const EXTRA_SHAPES = { ell: 1 }; // opt-in shapes (traits.shapes); never drawn by the default bank
  const POINTERS = ['arrow', 'dart'];
  const orientError = (spec, angle) => Math.abs(wrapP(angle - spec.target, 360 / spec.order));
  const COMPASS = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
  const COMPASS16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

  // Text a person types into an angle field: '12.5', '-7', '45°'. NaN if invalid.
  function parseAngle(text) {
    const m = /^\s*(-?\d{1,3}(?:\.\d+)?)\s*°?\s*$/.exec(String(text || ''));
    return m ? Number(m[1]) : NaN;
  }
  const fmtDeg = (a) => String(Number(a.toFixed(1)));

  // ---------------------------------------------------------------- photo / compass

  const PHOTO_SCENES = ['coast', 'meadow', 'city'];
  const LANDMARKS = ['Museum', 'Lighthouse', 'Old Mill', 'Town Hall', 'Water Tower', 'Stadium', 'Library',
    'Market Hall', 'Observatory', 'Ferry Pier', 'Castle', 'University', 'Hospital', 'Zoo', 'Botanical Garden',
    'Cathedral', 'Fire Station', 'Post Office', 'Swimming Pool', 'City Park', 'Art Gallery', 'Bus Depot',
    'Ice Rink', 'Concert Hall', 'Cinema', 'Bakery', 'High School', 'Campground', 'Windmill', 'Golf Club', 'Aquarium',
    'Theatre', 'Courthouse', 'Clock Tower', 'Stone Arch', 'Skate Park', 'Tennis Courts', 'Bowling Alley',
    'Climbing Wall', 'Horse Stables', 'Dog Run', 'Picnic Grove', 'Waterfall', 'Cave Entrance', 'Sand Dunes', 'Orchard',
    'Vineyard', 'Dairy Farm', 'Granary', 'Tea Room', 'Bookshop', 'Flower Shop', 'Toy Shop', 'Glassworks', 'Bathhouse',
    'Stone Quarry', 'Boathouse', 'Canal Lock', 'Waterworks', 'Bandstand', 'Viaduct', 'Toll Booth', 'Signal Box',
    'Bell Foundry', 'Salt Flats', 'Beehives', 'Fish Hatchery', 'Pumpkin Patch', 'Rice Paddies', 'Smokehouse',
    'Cheese Cellar', 'Cooperage', 'Tailor Shop', 'Cobbler Shop', 'Circus Tent', 'Dance School', 'Archery Range',
    'Cricket Pitch', 'Sledding Hill', 'Rope Course', 'Bird Hide', 'Lily Marsh', 'Tidal Pools', 'Coral Reef',
    'Pine Forest', 'Ancient Oak', 'Geyser', 'Hot Springs', 'Rock Spire', 'Glacier', 'Canyon', 'Volcano', 'Reservoir',
    'Sundial', 'Shipyard', 'Print Shop', 'Soapworks', 'Tannery', 'Ranger Cabin', 'Lifeguard Hut', 'Playground',
    'Bocce Court', 'Velodrome', 'Ski Jump', 'Hedge Maze', 'Wishing Well', 'Obelisk', 'Gatehouse', 'Cranberry Bog',
    'Bamboo Grove', 'Blowhole', 'Sinkhole', 'Mesa', 'River Delta', 'Rapids', 'Alpine Meadow', 'Badlands', 'Fossil Bed',
    'Brickworks', 'Repair Garage', 'Bicycle Shop', 'Radio Mast', 'Solar Farm', 'Tunnel Mouth', 'Scout Lodge',
    'Laundromat', 'Car Wash'];
  const NORTH = { right: 90, down: 180, left: 270 };

  const photoError = (spec, angle) => Math.abs(wrap180(angle - spec.target));
  const compassError = (spec, angle) => Math.abs(wrap180(angle - spec.target));

  // ---------------------------------------------------------------- task

  const WEIGHTS = { cube: 2, dial: 2, orient: 1, photo: 2, compass: 2 };
  const pickScenario = (rng, allowed) => env.util.pickWeighted(rng, allowed, WEIGHTS);

  const LETTERS = 'ABDEFGJKLPRTY'.split('');
  const NUMBERS = ['1', '2', '3', '4', '5', '7'];
  const WORDS = [
    'SUN', 'MOON', 'TREE', 'FISH', 'BIRD', 'LEAF', 'BOAT', 'KEY', 'CUP', 'HAT', 'CAT', 'DOG', 'PIG', 'ANT', 'BEE',
    'EGG', 'BOX', 'JAR', 'BED', 'PEN', 'MAP', 'BUS', 'LAMP', 'DESK', 'DOOR', 'FORK', 'BELL', 'DRUM', 'KITE', 'BALL',
    'TENT', 'SOCK', 'SHOE', 'CAKE', 'SOAP', 'CRAB', 'FROG', 'WORM', 'NEST', 'RAIN'
  ];
  const SYMBOLS = ['★', '♥', '♣', '♠', '●', '▲', '◆', '✚'];
  const COLOR_NAMES = Object.keys(content.COLORS);
  // Printed sides of a product package (turntable trait).
  const PRODUCT_SIDES = ['Barcode', 'Logo', 'Nutrition facts', 'Ingredients', 'QR code', 'Recipe', 'Care label',
    'Size chart', 'Warranty', 'Instructions', 'Recycling info', 'Allergens', 'Serving tips', 'Safety warnings',
    'Tech specs', 'Contents', 'Product photo', 'Assembly guide', 'Storage tips', 'Batch number', 'Contact details',
    'Brand story', 'Origin map', 'Quality seal', 'Award badge', 'Patent notice', 'Return policy', 'Support hours',
    'Serial number', 'Model name', 'Net weight', 'Dimensions', 'Capacity', 'Energy rating', 'Age range',
    'Fabric blend', 'Scent profile', 'Tasting notes', 'Cooking time', 'Mixing ratio', 'Heat limit', 'Load limit',
    'Expiry date', 'Refill guide', 'Reuse ideas', 'Cut line', 'Peel arrow', 'Volume scale', 'Game rules', 'Puzzle',
    'Trivia', 'Coloring panel', 'Gift message', 'Collector stamp', 'Donation pledge', 'Language key', 'Serving count',
    'Compatibility', 'Charging time', 'Braille panel', 'Texture sample', 'Exploded view', 'Tool checklist',
    'Wiring diagram', 'Stitch pattern', 'Planting depth', 'Seed spacing', 'Water rating', 'Usage tally', 'Fold marks',
    'Bonus offer', 'Contest details', 'Comic strip', 'Poem', 'Character bio', 'Art credits'];

  // ---------------------------------------------------------------- episode routes and levels

  function forceRoute(spec, route) {
    if (route !== 'pointer' && route !== 'keyboard' && route !== 'wheel') return spec;
    const v = spec.scenario;
    if (v === 'dial') {
      if (route === 'wheel') Object.assign(spec, { wheel: true, route: 'wheel' });
      else if (route === 'keyboard') Object.assign(spec, { keys: true, route: 'keys' });
      else Object.assign(spec, { keys: false, wheel: false, route: 'drag' });
    } else if (v === 'orient') {
      if (route === 'keyboard' && spec.mode === 'heading') Object.assign(spec, { keys: true, route: 'type' });
      else if (route === 'pointer') Object.assign(spec, { keys: false, route: 'drag' });
    } else if (v === 'photo') {
      if (route === 'keyboard' && spec.mode !== 'upright') Object.assign(spec, { keys: true, route: 'type' });
      else if (route === 'pointer') Object.assign(spec, { keys: false, route: spec.route === 'type' ? 'handle' : spec.route });
    }
    return spec;
  }

  // Half way between a and b (circular when wrap).
  const halfway = (a, b, wrap) => (wrap ? a + wrap180(b - a) / 2 : (a + b) / 2);

  // Easy / medium rungs: a wider tolerance and, where there is one, a simpler goal. Deterministic (no draws).
  const LEVEL_TAU = { easy: 2, medium: 1.5 };
  function applyLevel(spec, level) {
    const f = LEVEL_TAU[level];
    if (!f) return spec;
    spec.level = level;
    if (spec.tau !== undefined) spec.tau = round(spec.tau * f, 6);
    if (spec.scenario === 'cube' && level === 'easy') {
      spec.upright = false;
      spec.ref = 'both';
    } else if (spec.scenario === 'dial' && level === 'easy') spec.rel = false;
    else if (spec.scenario === 'compass') {
      const keep = level === 'easy' ? 4 : 5;
      if (spec.places.length > keep) {
        const idx = spec.places.map((_, i) => i).filter((i) => i !== spec.ref).slice(0, keep - 1);
        idx.push(spec.ref);
        idx.sort((a, b) => a - b);
        spec.places = idx.map((i) => spec.places[i]);
        spec.ref = idx.indexOf(spec.ref);
      }
    }
    return spec;
  }
  const levelF = (spec) => LEVEL_TAU[spec.level] || 1;

  // ---------------------------------------------------------------- readouts, silent and retarget

  const dialText = (spec, v) => (spec.kind === 'heading' ? `${Math.round(v) % 360}°` : fmtValue(spec, v));
  const compassName = (a) => `${Math.round(mod360(-a)) % 360}`;

  // Slip an angle model: the first of a few growing offsets whose error exceeds tau. Direction from prev when it moved.
  function nudge(next, prev, spec, rng, wrap) {
    const sign = (rng.bool() ? 1 : -1);
    const dir = prev && prev.angle !== undefined && Math.abs(wrap180(prev.angle - next.angle)) > 1e-6 ? Math.sign(wrap180(prev.angle - next.angle)) : sign;
    for (const d of [5, 8, 12, 20]) {
      const a = wrap(next.angle + dir * d);
      const out = { ...next, angle: a };
      if (Math.abs(wrap180(a - next.angle)) > 1e-9 && task.error(out, spec) > task.tolerance(spec).tau) return out;
    }
    return null;
  }

  // A new absolute value on the dial's grid at least a sixth of the scale (heading: 60 degrees) away from the current reading.
  function newDialTarget(spec, model, rng) {
    const cur = dialValue(spec, model.angle);
    const gap = spec.kind === 'heading' ? 60 : (spec.max - spec.min) / 6;
    for (let k = 0; k < 60; k++) {
      const x = lib.otherDialValue(spec, cur, gap, rng);
      if (x !== null && x !== spec.target) return x;
    }
    return null;
  }

  const lib = {
    COLOR_NAMES, COMPASS, COMPASS16, DIALS, EXTRA_SHAPES, FACES, HEADING, LANDMARKS,
    LETTERS, MAX_DRAG, NORTH, NUMBERS, PHOTO_SCENES, POINTERS, PRODUCT_SIDES, SHAPES, SYMBOLS, WORDS,
    X, Y, compose, content, dialAngleFor, dialStep, dialValue, euler, faceWorld, fmtDeg, fmtValue,
    mod360, orientError, parseAngle, quat, randomQuat, rotation, round, wrap180, yawOf,

    // Model after one exact oracle step, used by tasks/rotate-object/selftest.js.
    simulate(model, step, spec) {
      if (step.drag) {
        const to = step.drag[1];
        if (to.rotateBy) {
          const [yaw, pitch] = to.rotateBy;
          return { q: quat.normalize(quat.mul(rotation(yaw, pitch), model.q)) };
        }
        if (to.dialAngle !== undefined) return { ...model, angle: clampDial(spec, to.dialAngle) };
        if (to.straighten !== undefined) return { angle: clamp(to.straighten, -45, 45) };
        if (spec.scenario === 'photo') return { angle: wrap180(to.handleAngle) };
        return { angle: mod360(to.handleAngle) };
      }
      if (step.wheel) {
        const n = Math.round(-step.wheel[1] / 100);
        return { ...model, angle: dialAngleFor(spec, dialStep(spec, dialValue(spec, model.angle), n)) };
      }
      if (step.key) {
        const n = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[step.key];
        return { ...model, angle: dialAngleFor(spec, dialStep(spec, dialValue(spec, model.angle), n)) };
      }
      if (step.click && step.click.knob) return { ...model, focus: true };
      if (step.click && step.click.button) return { angle: wrap180(model.angle + (step.click.button === 'cw' ? 90 : -90)) };
      if (step.type) {
        const a = parseAngle(step.type[1]);
        return { angle: spec.scenario === 'photo' ? wrap180(a) : mod360(a) };
      }
      throw new Error(`simulate: ${JSON.stringify(step)}`);
    },
  };

  const task = {
    name: 'rotate-object',
    scenarios: ['cube', 'dial', 'orient', 'photo', 'compass'],
    files: ['sampling.js', 'judging.js', 'instructions.js'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['ambiguous', 'impossible'],
    inputs(spec) {
      const out = ['pointer'];
      if (spec && spec.keys) out.push('keyboard');
      if (spec && spec.wheel) out.push('wheel');
      return out;
    },
    helpers: { quat, rotation, FACES, faceWorld, dialValue, dialAngleFor, clampDial, dialStep, parseAngle, wrap180, mod360, MAX_DRAG },
    lib,

    sample(rng, opts) {
      const allowed = opts.scenarios && opts.scenarios.length ? opts.scenarios : task.scenarios;
      const scenario = opts.scenario || pickScenario(rng, allowed);
      const base = { scenario, isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', ood: !!opts.ood,
        startMode: opts.startMode || 'off' };
      const o = { ood: !!opts.ood, csplit: opts.csplit, startMode: base.startMode,
        turntable: !!(opts.traits && opts.traits.turntable), traits: opts.traits };
      let spec;
      if (scenario === 'cube') spec = { ...base, ...lib.sampleCube(rng, o) };
      else if (scenario === 'dial') spec = { ...base, ...lib.sampleDial(rng, o) };
      else if (scenario === 'orient') spec = { ...base, ...lib.sampleOrient(rng, o) };
      else if (scenario === 'photo') spec = { ...base, ...lib.samplePhoto(rng, o) };
      else spec = { ...base, ...lib.sampleCompass(rng, o) };
      if (opts.level && opts.level !== 'normal') applyLevel(spec, opts.level);
      forceRoute(spec, opts.route);
      if (task.judgeModes.includes(opts.judge)) {
        const j = lib.judgeOf(rng.fork('judge'), spec, opts.judge);
        if (j) spec.judge = j;
      }
      return spec;
    },

    init(spec, rng) {
      if (spec.judge) return task.solve(spec, null); // nothing to change
      const mode = spec.startMode;
      if (spec.scenario === 'cube') {
        const solved = quat.normalize(quat.conj(FACES[spec.target].q));
        if (spec.turntable) {
          // Yaw-only starts: turned about screen-vertical away from the target side.
          const sign = rng.bool() ? 1 : -1;
          if (mode === 'partial') return { q: quat.normalize(quat.mul(quat.axisAngle(Y, sign * rng.float(25, 45)), solved)) };
          if (mode === 'wrong') {
            const other = rng.pick([0, 1, 2, 3].filter((i) => i !== spec.target));
            return { q: quat.normalize(quat.conj(FACES[other].q)) };
          }
          return { q: quat.normalize(quat.mul(quat.axisAngle(Y, sign * rng.float(60, 180)), solved)) };
        }
        if (mode === 'partial') {
          if (spec.upright && rng.bool(0.5)) return { q: quat.normalize(quat.mul(quat.axisAngle([0, 0, 1], rng.pick([90, -90, 180])), solved)) };
          const th = rng.float(0, 2 * Math.PI);
          return { q: quat.normalize(quat.mul(quat.axisAngle([Math.cos(th), Math.sin(th), 0], rng.float(25, 45)), solved)) };
        }
        if (mode === 'wrong') {
          const other = rng.pick([0, 1, 2, 3, 4, 5].filter((i) => i !== spec.target));
          return { q: quat.normalize(quat.conj(FACES[other].q)) };
        }
        let q;
        for (let tries = 0; tries < 60; tries++) {
          q = randomQuat(rng);
          if (task.error({ q }, spec) > 50) break;
        }
        return { q };
      }
      if (spec.scenario === 'dial') {
        const ta = dialAngleFor(spec, spec.target);
        if (mode === 'partial') {
          const fa = dialAngleFor(spec, spec.from);
          return { angle: clampDial(spec, halfway(fa, ta, spec.kind === 'heading')) };
        }
        if (mode === 'wrong') {
          let v;
          if (spec.kind === 'heading') v = mod360(spec.target + rng.pick([180, 90, -90]));
          else {
            // A misreading: digits swapped, or mirrored about the middle of the scale.
            const txt = spec.target.toFixed(spec.tdec).replace('-', '');
            const digits = txt.replace('.', '');
            let swapped = NaN;
            if (digits.length >= 2) {
              const s = digits.slice(0, -2) + digits.slice(-1) + digits.slice(-2, -1);
              const dot = txt.indexOf('.');
              const back = dot < 0 ? s : s.slice(0, dot) + '.' + s.slice(dot);
              swapped = Number(back) * (spec.target < 0 ? -1 : 1);
            }
            const mirror = spec.min + spec.max - spec.target;
            v = Number.isFinite(swapped) && swapped >= spec.min && swapped <= spec.max && Math.abs(swapped - spec.target) > 4 * spec.tau
              ? swapped : mirror;
            if (Math.abs(v - spec.target) <= 2 * spec.tau) v = spec.target + (spec.target < (spec.min + spec.max) / 2 ? 1 : -1) * (spec.max - spec.min) / 4;
          }
          return { angle: dialAngleFor(spec, v) };
        }
        if (mode === 'off') return { angle: dialAngleFor(spec, spec.from) };
        let angle;
        for (let tries = 0; tries < 60; tries++) {
          angle = spec.kind === 'heading' ? rng.int(0, 359) : spec.start + rng.int(0, spec.sweep);
          if (Math.abs(wrap180(angle - ta)) >= 30) break;
        }
        return { angle };
      }
      if (spec.scenario === 'orient') {
        const need = Math.min(30, 0.4 * (360 / spec.order));
        let angle;
        for (let tries = 0; tries < 60; tries++) {
          angle = rng.int(0, 359);
          if (orientError(spec, angle) >= need) break;
        }
        const nearest = angle - wrapP(angle - spec.target, 360 / spec.order);
        if (mode === 'partial') return { angle: mod360(halfway(angle, nearest, true)) };
        if (mode === 'wrong') {
          if (spec.order === 1) return { angle: mod360(spec.target + 180) };
          return { angle: mod360(spec.target + 360 / spec.order / 2) };
        }
        return { angle };
      }
      if (spec.scenario === 'photo') {
        if (mode === 'partial') {
          if (spec.mode === 'upright') return { angle: spec.base === 180 ? 90 : wrap180(spec.target / 2) };
          return { angle: round(halfway(spec.from, spec.target, true), 2) };
        }
        if (mode === 'wrong') {
          if (spec.mode === 'upright') return { angle: spec.base === 180 ? -90 : wrap180(-spec.target) };
          if (spec.mode === 'level') return { angle: spec.tilt };
          return { angle: wrap180(spec.from - wrap180(spec.target - spec.from)) };
        }
        return { angle: spec.from };
      }
      // compass
      if (mode === 'partial') return { angle: mod360(halfway(spec.from, spec.target, true)) };
      if (mode === 'wrong') {
        const alt = spec.mode === 'north' ? mod360(-spec.target) : mod360(spec.target + 180);
        return { angle: Math.abs(wrap180(alt - spec.target)) > 4 * spec.tau ? alt : mod360(spec.target + 180) };
      }
      return { angle: spec.from };
    },

    error(model, spec) {
      if (spec.scenario === 'cube') {
        const { tilt, roll } = cubeAngles(model, spec);
        return spec.upright ? Math.max(tilt, Math.abs(roll)) : tilt;
      }
      if (spec.scenario === 'dial') return dialError(spec, model.angle);
      if (spec.scenario === 'photo') return photoError(spec, model.angle);
      if (spec.scenario === 'compass') return compassError(spec, model.angle);
      return orientError(spec, model.angle);
    },

    tolerance(spec) {
      if (spec.scenario === 'cube') return { tau: 12 * levelF(spec) };
      if (spec.scenario === 'dial') return { tau: spec.tau };
      if (spec.scenario === 'photo' || spec.scenario === 'compass') return { tau: spec.tau };
      return { tau: 3 * levelF(spec) };
    },

    instruction(spec, rng) { return lib.instruction(spec, rng); },

    plan(model, spec) {
      if (spec.scenario === 'cube') {
        const r = spec.turntable ? turntableStep(model, spec) : spec.upright ? uprightStep(model, spec) : frontStep(model, spec);
        return r ? { drag: [{ grab: 'cube' }, { rotateBy: r }] } : null;
      }
      if (spec.scenario === 'dial') {
        if (spec.route === 'wheel' || spec.route === 'keys') {
          const n = dialSteps(spec, dialValue(spec, model.angle));
          if (n !== 0) {
            if (spec.route === 'wheel') {
              const k = clamp(n, -25, 25);
              return { wheel: [{ knob: true }, -100 * k] };
            }
            if (!model.focus) return { click: { knob: true } };
            if (Math.abs(n) >= 10) return { key: n > 0 ? 'PageUp' : 'PageDown' };
            return { key: n > 0 ? 'ArrowUp' : 'ArrowDown' };
          }
        }
        return { drag: [{ grip: true }, { dialAngle: dialAngleFor(spec, spec.target) }] };
      }
      if (spec.scenario === 'photo') {
        if (spec.route === 'type') return { type: [{ field: 'angle' }, fmtDeg(spec.target)] };
        if (spec.route === 'buttons') {
          const d = wrap180(spec.target - model.angle);
          if (Math.abs(d) > 45) return { click: { button: d > 0 ? 'cw' : 'ccw' } };
        }
        if (spec.route === 'slider' && Math.abs(spec.target) <= 45) return { drag: [{ straighten: 'thumb' }, { straighten: spec.target }] };
        return { drag: [{ handle: true }, { handleAngle: spec.target }] };
      }
      if (spec.scenario === 'compass') return { drag: [{ handle: true }, { handleAngle: spec.target }] };
      if (spec.route === 'type') return { type: [{ field: 'angle' }, String(spec.target)] };
      // Nearest equivalent orientation of a symmetric shape.
      const target = model.angle - wrapP(model.angle - spec.target, 360 / spec.order);
      return { drag: [spec.grip === 'hub' ? { hub: true } : { handle: true }, { handleAngle: mod360(target) }] };
    },

    solve(spec, model) {
      if (spec.scenario === 'cube') return { q: quat.normalize(quat.conj(FACES[spec.target].q)) };
      if (spec.scenario === 'dial') return { angle: dialAngleFor(spec, spec.target) };
      return { angle: spec.target };
    },

    facts(model, spec) {
      const a = model.angle;
      if (spec.scenario === 'cube') {
        const f = spec.faces[spec.target];
        if (spec.ref === 'label') return [{ label: 'Face color', value: f.colorName, labels: ['Color', 'Colour', 'Front face color'] }];
        if (spec.ref === 'color') return [{ label: 'Face label', value: f.label, labels: ['Label', 'Front face label', 'Text'] }];
        return [];
      }
      if (spec.scenario === 'dial') {
        if (!spec.readout) return [];
        const v = dialValue(spec, a);
        const text = dialText(spec, v);
        return [{ label: spec.kind === 'heading' ? 'Heading' : spec.label, value: text, labels: spec.kind === 'heading' ? ['Reading'] : spec.aliases,
          aliases: [spec.kind === 'heading' ? String(Math.round(v) % 360) : v.toFixed(spec.dec)] }];
      }
      if (spec.scenario === 'photo') {
        const n = String(Number(a.toFixed(1)));
        return [{ label: 'Angle', value: `${n}°`, labels: ['Rotation', 'Photo angle'], aliases: [n] }];
      }
      if (spec.scenario === 'compass') return [{ label: 'Bearing', value: `${compassName(a)}°`, labels: ['Map bearing'], aliases: [compassName(a)] }];
      return [{ label: 'Rotation', value: `${Math.round(a) % 360}°`, labels: ['Angle', 'Heading'], aliases: [String(Math.round(a) % 360)] }];
    },

    // preempt=cancel: the one thing turned, by the name the page gives it (the dial's label; the readouts Angle / Rotation /
    // Bearing; the Cube or Product) with its pose
    parts: (model, spec) => [spec.scenario === 'dial' ? { name: spec.kind === 'heading' ? 'Heading' : spec.label, value: round(model.angle, 3) }
      : spec.scenario === 'cube' ? { name: spec.turntable ? 'Product' : 'Cube', value: model.q.map((x) => round(x, 3)) }
        : { name: { photo: 'Angle', compass: 'Bearing' }[spec.scenario] || 'Rotation', value: round(model.angle, 3) }],

    silent(next, prev, spec, rng) {
      if (spec.judge) return null;
      if (spec.scenario === 'cube') {
        const th = rng.float(0, 2 * Math.PI);
        const tip = rng.bool();
        for (const d of [8, 14, 20, 30]) {
          const q = spec.turntable ? quat.axisAngle(Y, tip ? d : -d) : quat.axisAngle([Math.cos(th), Math.sin(th), 0], d);
          const out = { ...next, q: quat.normalize(quat.mul(q, next.q)) };
          if (task.error(out, spec) > task.tolerance(spec).tau) return out;
        }
        return null;
      }
      if (spec.scenario === 'dial') {
        const wrap = (x) => (spec.kind === 'heading' ? mod360(x) : clampDial(spec, x));
        return nudge(next, prev, spec, rng, wrap);
      }
      return nudge(next, prev, spec, rng, spec.scenario === 'photo' ? wrap180 : mod360);
    },

    retarget(spec, model, rng) {
      if (spec.judge) return null;
      let out;
      if (spec.scenario === 'cube') {
        const pool = spec.faces.map((_, i) => i).filter((i) => i !== spec.target && (!spec.turntable || i < 4));
        out = { ...spec, target: rng.pick(pool) };
      } else if (spec.scenario === 'dial') {
        const t = newDialTarget(spec, model, rng);
        if (t === null) return null;
        out = { ...spec, target: t, rel: false };
      } else if (spec.scenario === 'orient') {
        if (spec.mode === 'heading') out = { ...spec, target: mod360(spec.ood ? rng.int(0, 359) : rng.int(0, 71) * 5) };
        else out = { ...spec, target: mod360(round(rng.float(0, 360), 1)) };
      } else if (spec.scenario === 'photo') {
        if (spec.mode !== 'angle') return null;
        const mag = spec.ood ? rng.int(46, 170) : Math.round(rng.float(3.5, 45) * 2) / 2;
        out = { ...spec, target: wrap180((rng.bool() ? 1 : -1) * mag), from: round(wrap180(model.angle), 1), abs: true };
      } else {
        const sp = { ...spec };
        if (spec.mode === 'bearing') {
          sp.bearing = spec.ood ? rng.int(0, 359) : rng.int(0, 71) * 5;
          sp.target = mod360(-sp.bearing);
        } else if (spec.mode === 'face') {
          sp.ref = rng.pick(spec.places.map((p, i) => i).filter((i) => i !== spec.ref));
          sp.target = mod360(-spec.places[sp.ref].bearing);
        } else {
          sp.north = rng.pick(Object.keys(NORTH).filter((k) => k !== spec.north));
          sp.target = NORTH[sp.north];
        }
        out = sp;
      }
      return task.error(model, out) > task.tolerance(out).tau ? out : null;
    },

  };

  env.task(task);
})();
