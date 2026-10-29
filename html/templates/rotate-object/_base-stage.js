    /*
     * reference / rotate / stage: one card per scenario, placed at a sampled offset inside the stage.
     *   cube    a CSS 3D cube (preserve-3d, matrix3d from the model quaternion) inside a square drag pad. Dragging
     *           anywhere on the pad rotates it trackball-style, anchored at the press point (pointer capture, so
     *           drags that leave the pad keep rotating). Gain (deg/px) and perspective vary per seed. A side panel
     *           shows the target face flat (always in the upright sub-mode).
     *   dial    an SVG knob with a tick ring, labeled major ticks, a grip and (value dials) a value arc. Grabbing
     *           anywhere on the knob turns it with the pointer's angle about the center; value dials clamp at
     *           the ends of their sweep. Optional readout (always for relative goals). spec.wheel: the mouse wheel
     *           over the knob steps the value (one notch = wheelStep, up = more). spec.keys: the knob is focusable
     *           (click it); arrows step, PageUp/PageDown step ten, Home/End go to the ends.
     *   orient  a design-tool canvas: the shape sits in a dashed selection box with a rotation handle on a stem.
     *           Only the handle rotates it. With spec.grip === 'hub' (trait grip: 'hub', no base widget declares it;
     *           trait-tests does) there is no stem or handle: a hub at the pivot is the grip, a press on it sets the
     *           angle from the pointer's angle about the pivot and the drag follows (locate({hub: true}) = the pivot).
     *           match: a reference panel beside the canvas; point: a star on the canvas; heading: a degree ring and
     *           a rotation readout (an editable field when spec.keys).
     *   photo   a photo editor: the photo (a seeded coast / meadow / city scene, horizon tilted for level, content
     *           turned for upright) rotates about the canvas center by a handle on a stem; side panel with a
     *           Straighten slider (-45..45), rotate 90° left/right buttons and an angle readout or field.
     *   compass a round map (river, roads, parks, labeled pins that stay upright) in a bezel; a handle on the
     *           bezel turns the map; a compass rose and a bearing readout on the side.
     * Mechanics: env.ui.trackball (cube), env.ui.dial (dial), env.ui.rotateHandle (orient, photo, compass),
     * env.ui.slider (straighten), env.ui.textField (angle fields).
     *
     * More widgets in this file (each differs in mechanics, not only looks; sections marked "// ====" below):
     *   knobs   (dial) skeuomorphic audio knobs: a hardware panel (wood cheeks, screws, silkscreen ticks, LED ring,
     *           knurled skirt) with decoy knobs that turn locally. VERTICAL drag turns the knob (px of travel per
     *           degree = a sampled gain); a pointer anywhere on the knob grabs it; a small LCD shows the value.
     *           Wheel (spec.wheel) steps it, keys (spec.keys) focus it. Plan { dialAngle } = the press point moved up.
     *   lines   (dial) a minimal line dial: a thin track over the sweep, small labeled ticks, a dot. A press anywhere
     *           on the ring sets the value to the pointer's angle and the value follows the pointer (absolute,
     *           unlike the grip-offset reference dial); wheel / keys as above.
     *   viewer  (cube, trait turntable) a 3D product viewer: a package on a turntable platter; only horizontal drags
     *           spin it (yaw about the vertical axis, vertical motion ignored). Side labels are printed package
     *           sides with small icons; an inert product info column sits beside it. Targets are the four sides.
     * opts.route (episode knob) is applied by the task: dial wheel / keys / drag routes work on all three dial widgets.
     */

// rotate-object/_base-stage: reference stage widget registration, loaded by rotate-object/base.
// Retains the original unit scopes, part keys and order of setup / RNG draws.
(function () {
  'use strict';
  env.template('rotate-object/_base-stage', () => ({
    register({ env, scriptOf, __parts, __has, setScope }) {
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get NS() { return NS; },
        get R2D() { return R2D; },
        get F() { return F; },
        get fx() { return fx; },
        get polar() { return polar; },
        get centerOf() { return centerOf; },
        get SHAPE_PATHS() { return SHAPE_PATHS; },
        get ctxRef() { return ctxRef; }, set ctxRef(v) { ctxRef = v; },
        get view() { return view; }, set view(v) { view = v; },
        get ensureStyle() { return ensureStyle; },
        get sv() { return sv; },
        get m3d() { return m3d; },
        get renderCube() { return renderCube; },
        get niceTicks() { return niceTicks; },
        get arcPath() { return arcPath; },
        get renderDial() { return renderDial; },
        get starPath() { return starPath; },
        get renderOrient() { return renderOrient; },
        get angleField() { return angleField; },
        get placeCard() { return placeCard; },
        get drawScene() { return drawScene; },
        get renderPhoto() { return renderPhoto; },
        get renderCompass() { return renderCompass; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@0')) ensureStyle = __parts['ensureStyle@0'](ensureStyle, __scope);
      if (__has('sv@0')) sv = __parts['sv@0'](sv, __scope);
      if (__has('m3d@0')) m3d = __parts['m3d@0'](m3d, __scope);
      if (__has('renderCube')) renderCube = __parts['renderCube'](renderCube, __scope);
      if (__has('niceTicks')) niceTicks = __parts['niceTicks'](niceTicks, __scope);
      if (__has('arcPath@0')) arcPath = __parts['arcPath@0'](arcPath, __scope);
      if (__has('renderDial')) renderDial = __parts['renderDial'](renderDial, __scope);
      if (__has('starPath')) starPath = __parts['starPath'](starPath, __scope);
      if (__has('renderOrient')) renderOrient = __parts['renderOrient'](renderOrient, __scope);
      if (__has('angleField')) angleField = __parts['angleField'](angleField, __scope);
      if (__has('placeCard@0')) placeCard = __parts['placeCard@0'](placeCard, __scope);
      if (__has('drawScene')) drawScene = __parts['drawScene'](drawScene, __scope);
      if (__has('renderPhoto')) renderPhoto = __parts['renderPhoto'](renderPhoto, __scope);
      if (__has('renderCompass')) renderCompass = __parts['renderCompass'](renderCompass, __scope);

      const CSS = __has('CSS@0') ? __parts['CSS@0'](undefined, __scope) : (`
      .rot-card {
        position: relative; display: flex; align-items: center; gap: 36px; padding: 28px 36px;
        border: 1px solid var(--line); border-radius: 12px;
        background: color-mix(in srgb, var(--panel) 55%, var(--bg)); box-shadow: 0 1px 3px rgba(0,0,0,.06);
      }
      .rot-col { display: flex; flex-direction: column; align-items: center; gap: 12px; }
      .rot-title { font-weight: 600; letter-spacing: .02em; }
      .rot-muted { color: var(--muted); font-size: 13px; text-align: center; max-width: 190px; }
      .rot-readout {
        min-width: 132px; padding: 5px 12px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel);
        font-variant-numeric: tabular-nums; text-align: center; white-space: nowrap;
      }

      .rot-pad {
        position: relative; overflow: hidden; border: 1px dashed color-mix(in srgb, var(--muted) 60%, transparent);
        border-radius: 14px; cursor: grab; touch-action: none;
        background: radial-gradient(circle at 50% 45%, var(--panel), color-mix(in srgb, var(--panel) 70%, var(--bg)) 70%);
      }
      .rot-pad.dragging { cursor: grabbing; }
      .rot-cube, .rot-face { position: absolute; left: 0; top: 0; }
      .rot-cube { transform-style: preserve-3d; pointer-events: none; }
      .rot-face {
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
        backface-visibility: hidden; -webkit-backface-visibility: hidden;
        border: 2px solid rgba(0,0,0,.28); box-shadow: inset 0 0 0 6px rgba(255,255,255,.14);
        color: #fff; font-weight: 800; text-shadow: 0 1px 2px rgba(0,0,0,.45);
      }
      .rot-face .lbl { line-height: 1; white-space: nowrap; }
      .rot-face .bar { width: 38%; height: 7%; border-radius: 3px; background: rgba(255,255,255,.92); box-shadow: 0 1px 2px rgba(0,0,0,.35); }
      .rot-face .shade { position: absolute; inset: -2px; background: #000; pointer-events: none; }
      .rot-hint { position: absolute; left: 0; right: 0; bottom: 10px; text-align: center; color: var(--muted); font-size: 12px; pointer-events: none; }
      .rot-chip { position: relative; width: 96px; height: 96px; border-radius: 6px; }

      .rot-svg { display: block; overflow: visible; touch-action: none; }
      .rot-svg text { font: 600 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; fill: var(--fg); }
      .rot-svg .minor { stroke: var(--muted); stroke-width: 1; }
      .rot-svg .major { stroke: var(--fg); stroke-width: 2; }
      .rot-knob { cursor: grab; }
      .rot-handle { cursor: grab; }
      .rot-canvas { border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
      .rot-ref { border: 1px dashed var(--line); border-radius: 10px; background: var(--panel); }
      .rot-field { display: flex; align-items: center; gap: 6px; justify-content: center; }
      .rot-flab { color: var(--muted); font-size: 13px; }
      .rot-in { box-sizing: border-box; width: 72px; height: 28px; padding: 0 6px; border: 1px solid var(--line); border-radius: 5px;
                background: var(--bg); color: var(--fg); font: inherit; font-variant-numeric: tabular-nums; text-align: right; }
      .rot-in:focus { outline: 2px solid var(--accent); outline-offset: 0; }
      .rot-shit { position: relative; padding: 10px 0; cursor: pointer; touch-action: none; }
      .rot-strack { position: relative; height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--muted) 35%, var(--panel)); }
      .rot-szero { position: absolute; top: -5px; width: 2px; height: 16px; margin-left: -1px; background: var(--muted); }
      .rot-sthumb { position: absolute; top: 3px; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%;
                    background: var(--panel); border: 2px solid var(--accent); box-sizing: border-box; pointer-events: none; }
      .rot-sticks { display: flex; justify-content: space-between; color: var(--muted); font-size: 11px; }
      .rot-brow { display: flex; gap: 8px; }
      .rot-btn { flex: 1; padding: 6px 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--bg);
                 color: var(--fg); font: inherit; font-size: 13px; cursor: pointer; white-space: nowrap; }
      `);

      const NS = __has('NS') ? __parts['NS'](undefined, __scope) : ('http://www.w3.org/2000/svg');
      const R2D = __has('R2D@0') ? __parts['R2D@0'](undefined, __scope) : (180 / Math.PI);
      let ctxRef = __has('ctxRef@0') ? __parts['ctxRef@0'](undefined, __scope) : undefined;
      let view = __has('view@0') ? __parts['view@0'](undefined, __scope) : undefined;

      function ensureStyle() {
        if (document.getElementById('rot-style')) return;
        const s = document.createElement('style');
        s.id = 'rot-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      const F = __has('F@0') ? __parts['F@0'](undefined, __scope) : { F: () => env.taskDef }.F;
      const fx = __has('fx@0') ? __parts['fx@0'](undefined, __scope) : { fx: (v) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(6) }.fx;
      const polar = __has('polar@0') ? __parts['polar@0'](undefined, __scope) : { polar: (c, r, a) => [c[0] + r * Math.sin(a / R2D), c[1] - r * Math.cos(a / R2D)] }.polar;
      const centerOf = __has('centerOf') ? __parts['centerOf'](undefined, __scope) : { centerOf: (el) => {
        const r = el.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      } }.centerOf;

      // util.svg, but paint properties that use CSS variables go through style (attributes ignore var()).
      function sv(tag, attrs, parent) {
        const plain = {};
        const style = {};
        for (const [key, v] of Object.entries(attrs)) {
          if (typeof v === 'string' && /var\(|color-mix/.test(v)) style[key] = v;
          else plain[key] = v;
        }
        const e = env.util.svg(tag, plain, parent);
        for (const [key, v] of Object.entries(style)) e.style.setProperty(key, v);
        return e;
      }

      function m3d(q, t = [0, 0, 0]) {
        const m = F().helpers.quat.matrix(q);
        const v = [m[0][0], m[1][0], m[2][0], 0, m[0][1], m[1][1], m[2][1], 0, m[0][2], m[1][2], m[2][2], 0, t[0], t[1], t[2], 1];
        return `matrix3d(${v.map(fx).join(',')})`;
      }

      // ---------------------------------------------------------------- cube

      function renderCube(ctx) {
        const { util, rng, size, spec } = ctx;
        const fam = F();
        const P = Math.floor(Math.min(470, size.height - 100, size.width - 460));
        const S = Math.round(P * rng.float(0.36, 0.42));
        // MAX_DRAG degrees must fit between the pad center and the viewport edge.
        const gain = Math.max(rng.float(0.45, 0.75), fam.helpers.MAX_DRAG / (size.height / 2 + 20));
        const light = (() => {
          const l = [rng.float(-0.5, 0.2), rng.float(-0.7, -0.3), 1];
          const n = Math.hypot(...l);
          return l.map((x) => x / n);
        })();

        const card = util.el('div', 'rot-card', ctx.stage);
        const pad = util.el('div', 'rot-pad', card);
        pad.dataset.role = 'cube';
        Object.assign(pad.style, { width: P + 'px', height: P + 'px', perspective: rng.int(850, 1300) + 'px' });
        const cube = util.el('div', 'rot-cube', pad);
        const off = (P - S) / 2;
        Object.assign(cube.style, { width: S + 'px', height: S + 'px', left: off + 'px', top: off + 'px' });
        util.el('div', 'rot-hint', pad, rng.pick(['Drag to rotate', 'Drag anywhere to turn the cube', 'Click and drag to rotate']));

        const fontFor = (label) => (label.length >= 4 ? 0.2 : label.length === 3 ? 0.25 : 0.42);
        const makeFace = (parent, f, size_) => {
          const face = util.el('div', 'rot-face', parent);
          Object.assign(face.style, { width: size_ + 'px', height: size_ + 'px', background: f.color });
          const lbl = util.el('div', 'lbl', face, f.label);
          lbl.style.fontSize = Math.round(size_ * fontFor(f.label)) + 'px';
          util.el('div', 'bar', face);
          return face;
        };
        const faces = spec.faces.map((f, i) => {
          const face = makeFace(cube, f, S);
          const n = fam.helpers.faceWorld([1, 0, 0, 0], i).normal;
          face.style.transform = m3d(fam.helpers.FACES[i].q, n.map((v) => (v * S) / 2));
          return { face, shade: util.el('div', 'shade', face) };
        });

        const showGoal = spec.upright || rng.bool(0.6);
        if (showGoal) {
          const side = util.el('div', 'rot-col', card);
          util.el('div', 'rot-title', side, 'Target face');
          const chip = makeFace(side, spec.faces[spec.target], 96);
          chip.classList.add('rot-chip');
          chip.style.position = 'relative';
          util.el('div', 'rot-muted', side, spec.upright ? 'Bring it to the front, label upright.' : 'Bring it to the front.');
        }

        function paint() {
          const q = ctx.model.q;
          cube.style.transform = m3d(q);
          faces.forEach((f, i) => {
            const n = fam.helpers.faceWorld(q, i).normal;
            const lit = Math.max(0, n[0] * light[0] + n[1] * light[1] + n[2] * light[2]);
            f.shade.style.opacity = (0.45 * (1 - lit)).toFixed(3);
          });
        }

        // Anchored trackball: the drag offset from the press point, times the gain, rotates the cube on top of
        // its orientation at press.
        let q0 = null;
        const ball = env.ui.trackball(pad, {
          label: 'cube',
          gain,
          onStart() {
            q0 = ctx.model.q.slice();
            pad.classList.add('dragging');
          },
          onInput([yaw, pitch]) {
            ctx.update({ q: fam.helpers.quat.normalize(fam.helpers.quat.mul(fam.helpers.rotation(yaw, pitch), q0)) });
            paint();
          },
          onChange() {
            pad.classList.remove('dragging');
          },
        });

        paint();
        view = {
          anchors: [pad],
          locate(t) {
            if (t.grab) return ball.locateGrab();
            if (t.rotateBy) return ball.locate(t.rotateBy);
            return null;
          },
        };
      }

      // ---------------------------------------------------------------- dial

      function niceTicks(spec, stepKey) {
        const step = spec[stepKey];
        const out = [];
        const n = Math.round((spec.max - spec.min) / step);
        for (let k = 0; k <= n; k++) out.push(Number((spec.min + k * step).toFixed(4)));
        if (spec.kind === 'heading') out.pop(); // 360 == 0
        return out;
      }

      function arcPath(r, a0, a1) {
        const p0 = polar([0, 0], r, a0);
        const p1 = polar([0, 0], r, a1);
        const large = a1 - a0 > 180 ? 1 : 0;
        return `M${p0[0].toFixed(2)},${p0[1].toFixed(2)} A${r},${r} 0 ${large} 1 ${p1[0].toFixed(2)},${p1[1].toFixed(2)}`;
      }

      function renderDial(ctx) {
        const { util, rng, size, spec } = ctx;
        const fam = F();
        const heading = spec.kind === 'heading';
        const Rmax = Math.min(175, Math.floor((size.height - 300) / 2));
        const R = rng.int(Math.min(120, Rmax), Rmax);
        const rg = Math.round(R * rng.float(0.66, 0.76));
        const half = R + 64;
        const W = 2 * half;

        const card = util.el('div', 'rot-card', ctx.stage);
        const col = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', col, heading ? 'Heading' : spec.label + (spec.unit.trim() ? ` (${spec.unit.trim()})` : ''));
        const svg = sv('svg', { class: 'rot-svg', width: W, height: W, viewBox: `${-half} ${-half} ${W} ${W}` }, col);
        svg.dataset.role = 'dial';

        // Tick ring and labels.
        const ring = sv('g', {}, svg);
        const labelText = (v) => {
          if (!heading) return String(v);
          return { 0: 'N', 90: 'E', 180: 'S', 270: 'W' }[v] ?? String(v);
        };
        for (const v of niceTicks(spec, 'minor')) {
          const a = fam.helpers.dialAngleFor(spec, v);
          const rel = (v - spec.min) / spec.major;
          const isMajor = Math.abs(rel - Math.round(rel)) < 1e-6;
          const [x0, y0] = polar([0, 0], R + 8, a);
          const [x1, y1] = polar([0, 0], R + (isMajor ? 22 : 15), a);
          sv('line', { class: isMajor ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1 }, ring);
          if (isMajor) {
            const [tx, ty] = polar([0, 0], R + 40, a);
            const t = sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, ring);
            t.textContent = labelText(v);
          }
        }
        // Knob.
        const knob = sv('g', { class: 'rot-knob' }, svg);
        const gid = `rot-grad-${Math.floor(rng.next() * 1e9)}`;
        const defs = sv('defs', {}, svg);
        const grad = sv('radialGradient', { id: gid, cx: '40%', cy: '35%', r: '75%' }, defs);
        sv('stop', { offset: '0%', 'stop-color': 'var(--panel)' }, grad);
        sv('stop', { offset: '100%', 'stop-color': 'color-mix(in srgb, var(--line) 70%, var(--panel))' }, grad);
        sv('circle', { r: R, fill: `url(#${gid})`, stroke: 'var(--line)', 'stroke-width': 2 }, knob);
        sv('circle', { r: R * 0.88, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, 'stroke-dasharray': rng.bool() ? '2 4' : 'none' }, knob);
        const arc = heading ? null : sv('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 5, 'stroke-linecap': 'round' }, knob);
        const turn = sv('g', {}, knob);
        if (heading) {
          sv('path', { d: `M0,${-(rg + 16)} L11,-8 L-11,-8 Z`, fill: 'var(--accent)', opacity: 0.85 }, turn);
          sv('path', { d: `M0,${rg * 0.55} L8,8 L-8,8 Z`, fill: 'var(--muted)', opacity: 0.6 }, turn);
        } else {
          sv('line', { x1: 0, y1: -14, x2: 0, y2: -(rg - 14), stroke: 'var(--muted)', 'stroke-width': 3, 'stroke-linecap': 'round' }, turn);
        }
        sv('circle', { r: 9, fill: 'var(--fg)', opacity: 0.75 }, knob);
        const grip = sv('circle', { cx: 0, cy: -rg, r: 13, fill: 'var(--accent)', stroke: '#fff', 'stroke-width': 3 }, turn);
        grip.dataset.role = 'grip';

        const readout = spec.readout ? util.el('div', 'rot-readout', col) : null;
        const hints = ['Drag the grip around the dial'];
        if (spec.wheel) hints.push(rng.pick(['Scroll over the knob to fine-tune', 'Mouse wheel adjusts in steps']));
        if (!readout || spec.wheel) util.el('div', 'rot-muted', col, rng.pick(hints.slice(-1).concat(hints)));

        function paint() {
          const a = ctx.model.angle;
          turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          if (arc) {
            if (a - spec.start > 0.05) arc.setAttribute('d', arcPath(R + 2, spec.start, a));
            else arc.removeAttribute('d');
          }
          if (readout) {
            const v = fam.helpers.dialValue(spec, a);
            readout.textContent = heading ? `${Math.round(v) % 360}°` : `${v.toFixed(spec.dec)}${spec.unit}`;
          }
        }

        // Grabbing anywhere on the knob turns it with the pointer's angle about the center (absolute, minus the
        // press offset); value dials clamp at the nearer end of their sweep.
        const setValue = (v) => {
          const angle = fam.helpers.dialAngleFor(spec, v);
          dial.set(angle);
          ctx.update({ ...ctx.model, angle });
          paint();
        };
        if (spec.wheel) {
          svg.addEventListener('wheel', (e) => {
            e.preventDefault();
            const n = Math.round(-e.deltaY / 100) || -Math.sign(e.deltaY);
            if (!n) return;
            ctx.log('wheel-step', { n });
            setValue(fam.helpers.dialStep(spec, fam.helpers.dialValue(spec, ctx.model.angle), n));
          }, { passive: false });
        }
        if (spec.keys) {
          svg.setAttribute('tabindex', '0');
          svg.style.outline = 'none';
          svg.addEventListener('pointerdown', () => svg.focus({ preventScroll: true }));
          svg.addEventListener('focus', () => {
            knob.style.filter = 'drop-shadow(0 0 3px var(--accent))';
            if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true });
          });
          svg.addEventListener('blur', () => {
            knob.style.filter = '';
            if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false });
          });
          svg.addEventListener('keydown', (e) => {
            const steps = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[e.key];
            const v = fam.helpers.dialValue(spec, ctx.model.angle);
            if (steps) setValue(fam.helpers.dialStep(spec, v, steps));
            else if (e.key === 'Home' && spec.kind === 'value') setValue(spec.min);
            else if (e.key === 'End' && spec.kind === 'value') setValue(spec.max);
            else return;
            e.preventDefault();
          });
        }
        const dial = env.ui.dial(knob, {
          label: 'dial',
          center: () => centerOf(svg),
          radius: rg,
          angle: ctx.model.angle,
          start: spec.start,
          sweep: spec.sweep,
          min: spec.min,
          max: spec.max,
          constrain: (a) => fam.helpers.clampDial(spec, a),
          onInput(angle) {
            ctx.update({ angle });
            paint();
          },
        });

        paint();
        view = {
          anchors: [svg],
          locate(t) {
            if (t.grip || t.knob) return dial.locateGrip();
            if (t.dialAngle !== undefined) return dial.locate(t.dialAngle);
            return null;
          },
        };
      }

      // ---------------------------------------------------------------- orient

      function starPath(r0, r1, n) {
        const pts = [];
        for (let k = 0; k < 2 * n; k++) {
          const [x, y] = polar([0, 0], k % 2 ? r1 : r0, (k * 180) / n);
          pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
        }
        return `M${pts.join(' L')} Z`;
      }

      // Shapes in a 100-unit box centered on the pivot; [path, half width, half height]. Symmetric shapes
      // are centered on their rotation center so their symmetry order matches the task's SHAPES table.
      const SHAPE_PATHS = __has('SHAPE_PATHS') ? __parts['SHAPE_PATHS'](undefined, __scope) : ({
        arrow: ['M0,-48 L32,-10 L12,-10 L12,48 L-12,48 L-12,-10 L-32,-10 Z', 32, 48],
        dart: ['M0,-50 L30,42 L0,24 L-30,42 Z', 30, 50],
        letter: ['M-28,-46 H30 V-26 H-6 V-9 H22 V11 H-6 V46 H-28 Z', 30, 46],
        ell: ['M-28,-46 H-4 V22 H30 V46 H-28 Z', 30, 46], // asymmetric L (task trait shapes: ['ell'], order 1)
        tee: ['M-42,-44 H42 V-20 H12 V46 H-12 V-20 H-42 Z', 42, 46],
        house: ['M0,-48 L44,-8 L44,44 L-44,44 L-44,-8 Z', 44, 48],
        triangle: ['M0,-50 L43.30,25 L-43.30,25 Z', 44, 50],
        bar: ['M-48,-17 H48 V17 H-48 Z', 48, 17],
        cross: ['M-15,-48 H15 V-15 H48 V15 H15 V48 H-15 V15 H-48 V-15 H-15 Z', 48, 48],
        star: [starPath(50, 21, 5), 48, 50],
      });

      function renderOrient(ctx) {
        const { util, rng, size, spec, content } = ctx;
        const fam = F();
        const C = Math.floor(Math.min(560, size.height - 130, size.width - 520));
        const half = C / 2;
        const B = rng.int(110, 150);
        const k = B / 100;
        const [d, hw, hh] = SHAPE_PATHS[spec.shape];
        const color = content.COLORS[spec.color];
        const selPad = 8;
        const top = hh * k + selPad;
        const Rh = Math.round(top + rng.int(26, 36));

        const card = util.el('div', 'rot-card', ctx.stage);
        const svg = sv('svg', { class: 'rot-svg rot-canvas', width: C, height: C, viewBox: `${-half} ${-half} ${C} ${C}` }, card);
        svg.dataset.role = 'canvas';

        // Design-tool grid.
        const gid = `rot-grid-${Math.floor(rng.next() * 1e9)}`;
        const defs = sv('defs', {}, svg);
        const cell = rng.pick([20, 24, 28]);
        const pat = sv('pattern', { id: gid, width: cell, height: cell, patternUnits: 'userSpaceOnUse', x: -half, y: -half }, defs);
        sv('path', { d: `M${cell},0 L0,0 0,${cell}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
        sv('rect', { x: -half, y: -half, width: C, height: C, fill: `url(#${gid})` }, svg);

        if (spec.mode === 'heading' && rng.bool(0.6)) {
          const Rr = half - 30;
          for (let a = 0; a < 360; a += 5) {
            const major = a % 45 === 0;
            const [x0, y0] = polar([0, 0], Rr, a);
            const [x1, y1] = polar([0, 0], Rr - (major ? 14 : a % 15 === 0 ? 9 : 5), a);
            sv('line', { class: major ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1, opacity: major ? 0.6 : 0.8 }, svg);
            if (major) {
              const [tx, ty] = polar([0, 0], Rr + 14, a);
              const t = sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, svg);
              t.textContent = `${a}°`;
              t.style.fontSize = '11px';
            }
          }
        }
        if (spec.mode === 'point') {
          const [sx, sy] = polar([0, 0], half - 38, spec.target);
          sv('path', { d: starPath(19, 8, 5), transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`, fill: '#f2c200', stroke: '#8a6d00', 'stroke-width': 1.5 }, svg);
        }

        const sel = sv('g', {}, svg);
        sv('path', { d, transform: `scale(${k})`, fill: color, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 / k }, sel);
        const bx = hw * k + selPad;
        sv('rect', { x: -bx, y: -top, width: 2 * bx, height: 2 * top, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, sel);
        for (const [cx, cy] of [[-bx, -top], [bx, -top], [-bx, top], [bx, top]]) {
          sv('rect', { x: cx - 4, y: cy - 4, width: 8, height: 8, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        }
        // spec.grip === 'hub' (trait grip: 'hub'): the pivot itself is the grip. No stem or handle is drawn; a press on
        // the hub sets the rotation to the pointer's angle about the pivot and the drag follows it.
        const hubGrip = spec.grip === 'hub';
        if (!hubGrip) sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        const handle = sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: 9, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 2.5 }, sel);
        handle.dataset.role = 'handle';
        if (hubGrip) {
          handle.style.display = 'none'; // rot still needs a handle element for its geometry; the hub replaces it
          handle.style.pointerEvents = 'none';
        }
        const hub = hubGrip
          ? sv('circle', { class: 'rot-handle rot-hub', r: 13, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 3 }, sel)
          : sv('circle', { r: 3, fill: 'var(--accent)' }, sel);
        if (hubGrip) {
          hub.dataset.role = 'grip';
          sv('circle', { r: 4, fill: 'var(--accent)', 'pointer-events': 'none' }, sel);
        }

        const side = util.el('div', 'rot-col', card);
        if (spec.mode === 'match') {
          util.el('div', 'rot-title', side, 'Reference');
          const RW = 190;
          const ref = sv('svg', { class: 'rot-svg rot-ref', width: RW, height: RW, viewBox: `${-RW / 2} ${-RW / 2} ${RW} ${RW}` }, side);
          const rk = 1.15;
          sv('path', { d, transform: `rotate(${spec.target}) scale(${rk})`, fill: color, opacity: 0.85, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 / rk }, ref);
        }
        // Always shown (the task's facts() reports it); the draw stays so later layout draws are as before.
        if (spec.mode !== 'heading') rng.bool(0.4);
        const readout = util.el('div', 'rot-readout', side);
        let field = null;
        if (readout && spec.keys) field = angleField(ctx, readout, 'Rotation', (a) => {
          const angle = fam.helpers.mod360(a);
          rot.set(angle);
          ctx.update({ angle });
          paint();
        });
        util.el('div', 'rot-muted', side, hubGrip ? 'Drag the center hub to rotate' : 'Drag the round handle to rotate');

        function paint() {
          if (field) field.paint(Math.round(ctx.model.angle) % 360);
          else if (readout) readout.textContent = `Rotation: ${Math.round(ctx.model.angle) % 360}°`;
        }

        // Only the handle rotates the selection, about the canvas center (the shape's pivot).
        const rot = env.ui.rotateHandle(sel, handle, {
          label: 'handle',
          pivot: () => centerOf(svg),
          radius: Rh,
          angle: ctx.model.angle,
          constrain: fam.helpers.mod360,
          place: (el, a) => el.setAttribute('transform', `rotate(${a.toFixed(3)})`),
          onInput(angle) {
            ctx.update({ angle });
            paint();
          },
        });

        if (hubGrip) {
          // The hub turns the shape to the pointer's angle about the pivot (no press offset). A press or move within
          // a few px of the pivot has no direction and changes nothing.
          const at = (p) => {
            const c = rot.pivot();
            if (Math.hypot(p.x - c[0], p.y - c[1]) < 6) return;
            const angle = fam.helpers.mod360(Math.atan2(p.x - c[0], -(p.y - c[1])) * R2D);
            if (angle === rot.get()) return;
            rot.set(angle);
            ctx.update({ angle });
            paint();
          };
          env.ui.track(hub, {
            start: (p) => { at(p); },
            move: (p) => at(p),
            end: () => env.log('value', { what: 'hub', angle: rot.get() }),
          }, 'hub');
        }

        paint();
        view = {
          anchors: [svg],
          locate(t) {
            if (t.hub && hubGrip) return rot.pivot();
            if (t.handle) return rot.locateHandle();
            if (t.handleAngle !== undefined) return rot.locate(t.handleAngle);
            if (t.field && field) return field.locate();
            return null;
          },
        };
      }

      // A labeled numeric angle input inside host ("Rotation [ 35 ]°"); onAngle(a) gets each valid number typed.
      function angleField(ctx, host, label, onAngle) {
        const { util } = ctx;
        host.classList.add('rot-field');
        host.textContent = '';
        util.el('span', 'rot-flab', host, label);
        const input = util.el('input', 'rot-in', host);
        input.setAttribute('inputmode', 'decimal');
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('aria-label', label);
        util.el('span', 'rot-flab', host, '°');
        const h = env.ui.textField(input, {
          accept: /[-0-9.]/,
          maxLength: 7,
          label: 'angle',
          onInput(v) {
            const a = F().helpers.parseAngle(v);
            if (Number.isFinite(a)) onAngle(a);
          },
        });
        return {
          paint(a) { if (document.activeElement !== input) h.set(String(a)); },
          locate: () => util.center(input),
        };
      }

      // Shift the card to a sampled spot inside the stage (the site already varies the stage alignment).
      function placeCard(card, ctx) {
        const s = ctx.stage.getBoundingClientRect();
        const r = card.getBoundingClientRect();
        const lo = [s.left - r.left + 4, s.top - r.top + 4];
        const hi = [s.right - r.right - 4, s.bottom - r.bottom - 4];
        const pick = (a, b) => (b > a ? Math.round(ctx.rng.float(Math.max(a, -90), Math.min(b, 90))) : 0);
        card.style.position = 'relative';
        card.style.left = pick(lo[0], hi[0]) + 'px';
        card.style.top = pick(lo[1], hi[1]) + 'px';
      }

      // ---------------------------------------------------------------- photo

      // Scene art in a 400 x 400 box centered on 0,0 (drawn larger than the photo so rotated content still fills it).
      function drawScene(g, kind, rng) {
        const add = (tag, attrs) => sv(tag, attrs, g);
        const sky = rng.pick(['#9ccbe8', '#b9d8ee', '#f2c9a0', '#c7d3e8']);
        add('rect', { x: -200, y: -200, width: 400, height: 200, fill: sky });
        if (kind === 'coast') {
          add('rect', { x: -200, y: 0, width: 400, height: 200, fill: rng.pick(['#2f6f9f', '#3a7ca5', '#28597d']) });
          add('circle', { cx: rng.int(-120, 120), cy: -rng.int(40, 80), r: 16, fill: '#f6d36b' });
          for (let k = 0; k < 6; k++) add('rect', { x: rng.int(-180, 150), y: rng.int(10, 120), width: rng.int(20, 50), height: 2, fill: '#ffffff', opacity: 0.45 });
          const ix = rng.int(-120, 60);
          add('path', { d: `M${ix},0 q30,-26 70,0 z`, fill: '#5d7b45' });
          add('rect', { x: ix + 30, y: -44, width: 7, height: 30, fill: '#f2f2f2' });
          add('rect', { x: ix + 30, y: -38, width: 7, height: 6, fill: '#d0453a' });
        } else if (kind === 'meadow') {
          add('rect', { x: -200, y: 0, width: 400, height: 200, fill: rng.pick(['#7fb05b', '#6ea353', '#93b862']) });
          add('path', { d: 'M-200,0 q80,-40 160,0 q80,-30 240,0 z', fill: '#5f8f48' });
          const hx = rng.int(-90, 40);
          add('rect', { x: hx, y: -34, width: 44, height: 34, fill: '#e8d9b8' });
          add('path', { d: `M${hx - 6},-34 L${hx + 22},-56 L${hx + 50},-34 Z`, fill: '#b5483b' });
          add('rect', { x: hx + 17, y: -18, width: 10, height: 18, fill: '#6d4a2f' });
          add('rect', { x: hx + 78, y: -30, width: 6, height: 30, fill: '#6d4a2f' });
          add('circle', { cx: hx + 81, cy: -40, r: 16, fill: '#3f7a3a' });
        } else {
          add('rect', { x: -200, y: 0, width: 400, height: 200, fill: '#8a8f96' });
          add('rect', { x: -200, y: 18, width: 400, height: 10, fill: '#e7e2c8', opacity: 0.6 });
          let x = -200;
          while (x < 200) {
            const w = rng.int(22, 46);
            const h = rng.int(40, 130);
            add('rect', { x, y: -h, width: w - 3, height: h, fill: rng.pick(['#5b6578', '#6d7486', '#48505f', '#7b8394']) });
            for (let wy = -h + 8; wy < -8; wy += 14) add('rect', { x: x + 5, y: wy, width: w - 13, height: 5, fill: '#f3e3a3', opacity: 0.55 });
            x += w;
          }
        }
        // The horizon line itself (thin, so leveling is precise).
        add('line', { x1: -200, y1: 0, x2: 200, y2: 0, stroke: 'rgba(255,255,255,.55)', 'stroke-width': 1 });
      }

      function renderPhoto(ctx) {
        const { util, rng, size, spec } = ctx;
        const fam = F();
        const C = Math.floor(Math.min(460, size.height - 70, size.width - 330));
        const half = C / 2;
        const pw = Math.round(C * rng.float(0.58, 0.64));
        const ph = Math.round(pw * rng.float(0.64, 0.7));
        const Rh = Math.round(ph / 2 + rng.int(24, 32));

        const card = util.el('div', 'rot-card', ctx.stage);
        card.style.gap = '24px';
        card.style.padding = '18px 22px';
        const svg = sv('svg', { class: 'rot-svg rot-canvas', width: C, height: C, viewBox: `${-half} ${-half} ${C} ${C}` }, card);
        svg.dataset.role = 'canvas';
        svg.style.background = 'color-mix(in srgb, var(--fg) 8%, var(--panel))';
        const defs = sv('defs', {}, svg);
        const cid = `rot-clip-${Math.floor(rng.next() * 1e9)}`;
        const clip = sv('clipPath', { id: cid }, defs);
        sv('rect', { x: -pw / 2, y: -ph / 2, width: pw, height: ph }, clip);

        const sel = sv('g', {}, svg);
        const photo = sv('g', { 'clip-path': `url(#${cid})` }, sel);
        const content = sv('g', { transform: `rotate(${spec.mode === 'level' ? spec.tilt : spec.base}) scale(${(Math.hypot(pw, ph) / 400 * 1.05).toFixed(4)})` }, photo);
        drawScene(content, spec.scene, rng);
        sv('rect', { x: -pw / 2, y: -ph / 2, width: pw, height: ph, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, sel);
        sv('line', { x1: 0, y1: -ph / 2, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        const handle = sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: 9, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 2.5 }, sel);
        handle.dataset.role = 'handle';
        // Fixed thirds grid over the canvas (helps leveling; does not rotate).
        if (rng.bool(0.7)) {
          for (const f of [-1 / 6, 1 / 6]) {
            sv('line', { x1: -half, y1: f * C, x2: half, y2: f * C, stroke: 'rgba(255,255,255,.5)', 'stroke-width': 1, 'stroke-dasharray': '4 4', 'pointer-events': 'none' }, svg);
            sv('line', { x1: f * C, y1: -half, x2: f * C, y2: half, stroke: 'rgba(255,255,255,.5)', 'stroke-width': 1, 'stroke-dasharray': '4 4', 'pointer-events': 'none' }, svg);
          }
        }

        const side = util.el('div', 'rot-col', card);
        side.style.alignItems = 'stretch';
        side.style.width = '220px';
        util.el('div', 'rot-title', side, rng.pick(['Rotate & straighten', 'Transform', 'Adjust rotation', 'Crop & rotate']));
        let straight = null;
        let sTrack = null;
        if (spec.slider) {
          const box = util.el('div', '', side);
          util.el('div', 'rot-muted', box, rng.pick(['Straighten', 'Fine rotation', 'Angle']));
          const hit = util.el('div', 'rot-shit', box);
          hit.dataset.role = 'straighten';
          sTrack = util.el('div', 'rot-strack', hit);
          const zero = util.el('div', 'rot-szero', sTrack);
          zero.style.left = '50%';
          const thumb = util.el('div', 'rot-sthumb', sTrack);
          const ticks = util.el('div', 'rot-sticks', box);
          for (const t of ['-45°', '0°', '45°']) util.el('span', '', ticks, t);
          straight = env.ui.slider(hit, {
            label: 'straighten',
            thumbs: [thumb],
            values: [Math.max(-45, Math.min(45, ctx.model.angle))],
            min: -45,
            max: 45,
            keyboard: !!spec.keys,
            geometry() {
              const r = sTrack.getBoundingClientRect();
              return { start: [r.left, r.top + r.height / 2], end: [r.right - 1, r.top + r.height / 2] };
            },
            place: (el, point, f) => { el.style.left = f * (sTrack.getBoundingClientRect().width - 1) + 'px'; },
            onInput([v]) {
              ctx.update({ angle: v });
              rot.set(v);
              paint();
            },
          });
        }
        const btns = {};
        if (spec.buttons) {
          const row = util.el('div', 'rot-brow', side);
          for (const [k, txt, glyph] of [['ccw', 'Rotate left', '↺'], ['cw', 'Rotate right', '↻']]) {
            const b = util.el('button', 'rot-btn', row);
            b.type = 'button';
            b.title = txt;
            b.textContent = rng.bool(0.5) ? `${glyph} 90°` : `${glyph} ${txt}`;
            b.addEventListener('click', () => {
              const angle = fam.helpers.wrap180(ctx.model.angle + (k === 'cw' ? 90 : -90));
              ctx.log('rotate90', { dir: k });
              rot.set(angle);
              ctx.update({ angle });
              paint();
            });
            btns[k] = b;
          }
        }
        const readout = util.el('div', 'rot-readout', side);
        let field = null;
        if (spec.keys) field = angleField(ctx, readout, 'Angle', (a) => {
          const angle = fam.helpers.wrap180(a);
          rot.set(angle);
          ctx.update({ angle });
          paint();
        });
        util.el('div', 'rot-muted', side, rng.pick(['Drag the round handle above the photo to rotate it freely.', 'Use the handle on the photo for any angle.']));

        function paint() {
          const a = ctx.model.angle;
          const txt = String(Number(a.toFixed(1)));
          if (field) field.paint(txt);
          else readout.textContent = `Angle: ${txt}°`;
          if (straight) straight.set([Math.max(-45, Math.min(45, a))]);
        }

        const rot = env.ui.rotateHandle(sel, handle, {
          label: 'handle',
          pivot: () => centerOf(svg),
          radius: Rh,
          angle: ctx.model.angle,
          constrain: fam.helpers.wrap180,
          place: (el, a) => el.setAttribute('transform', `rotate(${a.toFixed(3)})`),
          onInput(angle) {
            ctx.update({ angle });
            paint();
          },
        });
        paint();
        const anchors = [svg];
        if (sTrack) anchors.push(sTrack);
        view = {
          card,
          anchors,
          sync(m) {
            rot.set(m.angle);
            paint();
          },
          locate(t) {
            if (t.handle) return rot.locateHandle();
            if (t.handleAngle !== undefined) return rot.locate(t.handleAngle);
            if (t.straighten === 'thumb') return straight.locateThumb(0);
            if (t.straighten !== undefined) return straight.locate(t.straighten);
            if (t.button) return util.center(btns[t.button]);
            if (t.field && field) return field.locate();
            return null;
          },
        };
      }

      // ---------------------------------------------------------------- compass (map)

      function renderCompass(ctx) {
        const { util, rng, size, spec } = ctx;
        const fam = F();
        const D = Math.floor(Math.min(500, size.height - 64, size.width - 300));
        const half = D / 2;
        const Rmap = half - 26;
        const Rring = half - 13;

        const card = util.el('div', 'rot-card', ctx.stage);
        card.style.gap = '24px';
        card.style.padding = '16px 22px';
        const svg = sv('svg', { class: 'rot-svg', width: D, height: D, viewBox: `${-half} ${-half} ${D} ${D}` }, card);
        svg.dataset.role = 'map';
        const defs = sv('defs', {}, svg);
        const cid = `rot-map-${Math.floor(rng.next() * 1e9)}`;
        sv('circle', { r: Rmap }, sv('clipPath', { id: cid }, defs));

        // Bezel ring (the drag target is the handle on it).
        sv('circle', { r: Rring, fill: 'none', stroke: 'color-mix(in srgb, var(--fg) 30%, var(--panel))', 'stroke-width': 24 }, svg);
        const turn = sv('g', {}, svg);
        const mapG = sv('g', { 'clip-path': `url(#${cid})` }, turn);
        const land = rng.pick(['#eef0e4', '#f1ede3', '#e8efe9']);
        sv('rect', { x: -half, y: -half, width: D, height: D, fill: land }, mapG);
        for (let k = 0; k < 3; k++) sv('circle', { cx: rng.int(-Rmap, Rmap), cy: rng.int(-Rmap, Rmap), r: rng.int(30, 70), fill: '#cfe3c1' }, mapG);
        const ry = rng.int(-Rmap / 2, Rmap / 2);
        sv('path', { d: `M${-half},${ry} C${-half / 3},${ry - rng.int(-80, 80)} ${half / 3},${ry + rng.int(-80, 80)} ${half},${ry + rng.int(-40, 40)}`, fill: 'none', stroke: '#9cc6e4', 'stroke-width': 14 }, mapG);
        for (let k = 0; k < 6; k++) {
          const a = rng.float(0, Math.PI);
          const o = rng.int(-Rmap, Rmap);
          const [dx, dy] = [Math.cos(a), Math.sin(a)];
          sv('line', { x1: o * -dy - dx * D, y1: o * dx - dy * D, x2: o * -dy + dx * D, y2: o * dx + dy * D, stroke: '#ffffff', 'stroke-width': k < 2 ? 7 : 4 }, mapG);
        }
        const labels = [];
        for (const p of spec.places) {
          const r = p.dist * (Rmap - 20);
          const [x, y] = [r * Math.sin(p.bearing / R2D), -r * Math.cos(p.bearing / R2D)];
          const pin = sv('g', { transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` }, mapG);
          const inner = sv('g', {}, pin);
          sv('path', { d: 'M0,0 C-2,-6 -8,-10 -8,-16 a8,8 0 1 1 16,0 C8,-10 2,-6 0,0 Z', fill: '#d9480f', stroke: '#fff', 'stroke-width': 1.5 }, inner);
          const t = sv('text', { x: 0, y: 14, 'text-anchor': 'middle', 'dominant-baseline': 'hanging' }, inner);
          t.textContent = p.name;
          t.style.font = '600 12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
          t.style.paintOrder = 'stroke';
          t.style.fill = '#2b2f36';
          t.style.stroke = land;
          t.style.strokeWidth = '3px';
          labels.push(inner);
        }
        // North marker and drag handle on the bezel (they turn with the map).
        const nm = sv('text', { x: 0, y: -Rring, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, turn);
        nm.textContent = 'N';
        nm.style.fill = '#fff';
        nm.style.font = '700 12px system-ui, sans-serif';
        nm.style.pointerEvents = 'none';
        const hAngle = rng.pick([0, 0, 45, -45, 90]);
        const hp = polar([0, 0], Rring, hAngle);
        const handle = sv('circle', { class: 'rot-handle', cx: hp[0], cy: hp[1], r: 10, fill: 'var(--accent)', stroke: '#fff', 'stroke-width': 2.5 }, turn);
        if (hAngle === 0) turn.append(nm); // the N marker sits on the handle (it ignores the pointer)
        handle.dataset.role = 'handle';
        // Fixed center marker and a fixed "up" tick at the top of the bezel.
        sv('circle', { r: 7, fill: '#1c7ed6', stroke: '#fff', 'stroke-width': 3 }, svg);
        sv('path', { d: `M0,${-half + 1} l-6,0 l6,9 l6,-9 z`, fill: 'var(--fg)', opacity: 0.7, 'pointer-events': 'none' }, svg);

        const side = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', side, rng.pick(['Map', 'Orientation', 'Navigator', 'Map view']));
        const rose = sv('svg', { width: 86, height: 86, viewBox: '-43 -43 86 86', class: 'rot-svg' }, side);
        sv('circle', { r: 40, fill: 'var(--panel)', stroke: 'var(--line)', 'stroke-width': 2 }, rose);
        const needle = sv('g', {}, rose);
        sv('path', { d: 'M0,-34 L8,0 L-8,0 Z', fill: '#e03131' }, needle);
        sv('path', { d: 'M0,34 L8,0 L-8,0 Z', fill: 'var(--muted)' }, needle);
        const rn = sv('text', { x: 0, y: -24, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, needle);
        rn.textContent = 'N';
        rn.style.fill = '#fff';
        rn.style.font = '700 10px system-ui, sans-serif';
        // Always shown (the task's facts() reports it); the draw stays so later layout draws are as before.
        if (spec.mode !== 'bearing') rng.bool(0.6);
        const readout = util.el('div', 'rot-readout', side);
        util.el('div', 'rot-muted', side, rng.pick(['Drag the round handle on the ring to rotate the map.', 'Turn the map with the handle on its edge.']));

        function paint(a = ctx.model.angle) {
          turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          for (const l of labels) l.setAttribute('transform', `rotate(${(-a).toFixed(3)})`);
          needle.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          if (readout) readout.textContent = `Bearing: ${Math.round(fam.helpers.mod360(-a)) % 360}°`;
        }
        const rot = env.ui.rotateHandle(turn, handle, {
          label: 'map',
          pivot: () => centerOf(svg),
          radius: Rring,
          restAngle: hAngle,
          angle: ctx.model.angle,
          constrain: fam.helpers.mod360,
          place: (el, a) => paint(a),
          onInput(angle) {
            ctx.update({ angle });
          },
        });
        paint();
        view = {
          card,
          anchors: [svg],
          sync(m) {
            rot.set(m.angle);
            paint();
          },
          locate(t) {
            if (t.handle) return rot.locateHandle();
            if (t.handleAngle !== undefined) return rot.locate(t.handleAngle);
            return null;
          },
        };
      }

      env.widget({
        task: 'rotate-object',
        site: 'base',
        name: 'stage',
        split: 'train',
        scenarios: ['cube', 'dial', 'orient', 'photo', 'compass'],

        render(ctx) {
          ensureStyle();
          ctxRef = ctx;
          const v = ctx.spec.scenario;
          if (v === 'cube') renderCube(ctx);
          else if (v === 'dial') renderDial(ctx);
          else if (v === 'photo') renderPhoto(ctx);
          else if (v === 'compass') renderCompass(ctx);
          else renderOrient(ctx);
          const card = view.card || ctx.stage.querySelector('.rot-card');
          if (card) placeCard(card, ctx);
          return view.sync ? { anchors: view.anchors, sync: view.sync } : { anchors: view.anchors };
        },

        locate(t) {
          const p = view && view.locate(t);
          if (!p) throw new Error(`rotate-object/stage cannot locate ${JSON.stringify(t)} (variant ${ctxRef && ctxRef.spec.scenario})`);
          return p;
        },
      });
    
    },
  }));
})();
