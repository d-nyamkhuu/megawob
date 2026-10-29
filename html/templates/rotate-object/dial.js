/*
 * rotate-object/dial — SVG dial from L1 medoid design-rotate-object-dial-12. Scenario: dial.
 * Raw TOKENS/BASE reproduce dial-12; the dial preset reproduces design-rotate-object-dial-11
 * with design {} (the readout is always present in 10/12 sites). dial-12 opts out.
 * Tokens: css (original scaffold CSS); forceReadout (false); sync ('none': no sync,
 * 'paint': repaint only, 'dial': set primitive angle then paint).
 * Tokens (raw defaults): dialSize (null: sampled R; [widthRatio,heightRatio,radiusRatio]
 * fixes diameter from ctx.size while retaining the draw), titleUnits (true: title suffix),
 * unitCaption (false: no unit row), tickUnits ('px': radius offsets; 'width'/'radius': ratios),
 * tickRadii ([8,22,15,40]: start, major end, minor end, label radius),
 * stops (panel-to-line radial gradient stops), bevelStops (null: no bevel gradient),
 * knobStroke ('var(--line)', or 'bevel'), knobStrokeWidth (2), rimRatio (.88),
 * needleScale (null: -14 to -(rg-14); [inner,outer]: radius ratios), needleCap ('round').
 * Preset dial: forceReadout true; diameter [.77,.94,.28], title without units, unit row,
 * width-relative ticks [.33,.375,.357,.425], dark gradient/bevel, 8px bevel stroke,
 * rim .92, needle [.38,.97] with butt cap. These appearance values reproduce dial-11.
 * tickRadius(g,i) returns a token-resolved tick dimension.
 * Parts: style() installs css; sv(tag, attrs, parent) returns an SVG element with CSS paints;
 * polar(c,r,a)/centerOf(el) return points; niceTicks(spec,key) returns scale values;
 * arcPath(r,a0,a1) returns SVG arc data; placeCard(card,ctx) samples placement.
 * frame(ctx,g) returns geometry/card/col/svg; ticks(ctx,g) draws tick ring and labels;
 * knob(ctx,g) returns knob/gid/defs (reuses defs from ticks, if supplied);
 * surface(ctx,g) draws knob gradients/rim (owns rng.bool); pointer(ctx,g) returns arc/turn/grip;
 * readout(ctx,g) returns readout/hints; paint(ctx,g) updates rotation, arc and value;
 * input(ctx,g) installs wheel/key handlers, returns setValue; dial(ctx,g) returns primitive;
 * controls(ctx,g) is a noop frame-control hook; placed(ctx,g) samples card placement.
 * Parts read live per-render geometry g; S exposes ctx, geo, D and P. Return objects from
 * construction parts are merged into g; callbacks use g.dial because it is created later.
 */
(function () {
  'use strict';
  const CSS = `
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
  `;
  const TOKENS = {
    css: CSS, forceReadout: false, sync: 'none', dialSize: null, titleUnits: true, unitCaption: false,
    tickUnits: 'px', tickRadii: [8, 22, 15, 40],
    stops: [['0%', 'var(--panel)'], ['100%', 'color-mix(in srgb, var(--line) 70%, var(--panel))']],
    bevelStops: null, knobStroke: 'var(--line)', knobStrokeWidth: 2, rimRatio: .88,
    needleScale: null, needleCap: 'round',
  };
  env.template('rotate-object/dial', (design, def) => {
    let D, P, ctxRef, geo, view;
    const BASE = {};
    const S = { get ctx() { return ctxRef; }, get geo() { return geo; }, get D() { return D; }, get P() { return P; } };
    const R2D = 180 / Math.PI;
    BASE.polar = (c, r, a) => [c[0] + r * Math.sin(a / R2D), c[1] - r * Math.cos(a / R2D)];
    BASE.centerOf = (el) => {
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    };

    BASE.sv = function (tag, attrs, parent) {
      const plain = {};
      const style = {};
      for (const [key, v] of Object.entries(attrs)) {
        if (typeof v === 'string' && /var\(|color-mix/.test(v)) style[key] = v;
        else plain[key] = v;
      }
      const e = env.util.svg(tag, plain, parent);
      for (const [key, v] of Object.entries(style)) e.style.setProperty(key, v);
      return e;
    };
    BASE.style = function () {
      if (document.getElementById('rot-style')) return;
      const s = document.createElement('style');
      s.id = 'rot-style';
      s.textContent = D.css;
      document.head.append(s);
    };
    BASE.niceTicks = (spec, stepKey) => {
      const step = spec[stepKey];
      const out = [];
      const n = Math.round((spec.max - spec.min) / step);
      for (let k = 0; k <= n; k++) out.push(Number((spec.min + k * step).toFixed(4)));
      if (spec.kind === 'heading') out.pop(); // 360 == 0
      return out;
    };
    BASE.arcPath = (r, a0, a1) => {
      const p0 = P.polar([0, 0], r, a0);
      const p1 = P.polar([0, 0], r, a1);
      const large = a1 - a0 > 180 ? 1 : 0;
      return `M${p0[0].toFixed(2)},${p0[1].toFixed(2)} A${r},${r} 0 ${large} 1 ${p1[0].toFixed(2)},${p1[1].toFixed(2)}`;
    };

    BASE.frame = (ctx, g) => {
      const { util, rng, size, spec } = ctx;
      const heading = spec.kind === 'heading';
      const Rmax = Math.min(175, Math.floor((size.height - 300) / 2));
      const sampledR = rng.int(Math.min(120, Rmax), Rmax);
      const W = D.dialSize ? Math.floor(Math.min(size.width * D.dialSize[0], size.height * D.dialSize[1])) : 2 * (sampledR + 64);
      const R = D.dialSize ? W * D.dialSize[2] : sampledR;
      const rg = Math.round(R * rng.float(0.66, 0.76));
      const half = W / 2;
      const card = util.el('div', 'rot-card', ctx.stage);
      const col = util.el('div', 'rot-col', card);
      util.el('div', 'rot-title', col, heading ? 'Heading' : spec.label + (D.titleUnits && spec.unit.trim() ? ` (${spec.unit.trim()})` : ''));
      if (D.unitCaption) util.el('div', 'dial-unit', col, heading ? 'Degrees' : spec.unit.trim());
      const svg = P.sv('svg', { class: 'rot-svg', width: W, height: W, viewBox: `${-half} ${-half} ${W} ${W}` }, col);
      svg.dataset.role = 'dial';
      return { heading, Rmax, R, rg, half, W, card, col, svg };
    };

    BASE.tickRadius = (g, i) => D.tickUnits === 'width' ? g.W * D.tickRadii[i] : D.tickUnits === 'radius' ? g.R * D.tickRadii[i] : g.R + D.tickRadii[i];

    BASE.ticks = (ctx, g) => {
      const { spec } = ctx;
      const fam = env.taskDef;
      const { heading, R, W, svg } = g;
      // Tick ring and labels.
      const ring = P.sv('g', {}, svg);
      const labelText = (v) => {
        if (!heading) return String(v);
        return { 0: 'N', 90: 'E', 180: 'S', 270: 'W' }[v] ?? String(v);
      };
      for (const v of P.niceTicks(spec, 'minor')) {
        const a = fam.helpers.dialAngleFor(spec, v);
        const rel = (v - spec.min) / spec.major;
        const isMajor = Math.abs(rel - Math.round(rel)) < 1e-6;
        const [x0, y0] = P.polar([0, 0], P.tickRadius(g, 0), a);
        const [x1, y1] = P.polar([0, 0], P.tickRadius(g, isMajor ? 1 : 2), a);
        P.sv('line', { class: isMajor ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1 }, ring);
        if (isMajor) {
          const [tx, ty] = P.polar([0, 0], P.tickRadius(g, 3), a);
          const t = P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, ring);
          t.textContent = labelText(v);
        }
      }
      return { ring, labelText };
    };

    BASE.surface = (ctx, g) => {
      const { R, knob, gid, defs } = g;
      const grad = P.sv('radialGradient', { id: gid, cx: '40%', cy: '35%', r: '75%' }, defs);
      for (const [offset, color] of D.stops) P.sv('stop', { offset, 'stop-color': color }, grad);
      if (D.bevelStops) {
        const bevel = P.sv('linearGradient', { id: gid + '-bevel', x1: '0%', y1: '0%', x2: '0%', y2: '100%' }, defs);
        for (const [offset, color] of D.bevelStops) P.sv('stop', { offset, 'stop-color': color }, bevel);
      }
      P.sv('circle', { r: R, fill: `url(#${gid})`, stroke: D.knobStroke === 'bevel' ? `url(#${gid}-bevel)` : D.knobStroke, 'stroke-width': D.knobStrokeWidth }, knob);
      P.sv('circle', { r: R * D.rimRatio, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, 'stroke-dasharray': ctx.rng.bool() ? '2 4' : 'none' }, knob);
      return { grad };
    };

    BASE.pointer = (ctx, g) => {
      const { heading, R, rg, knob } = g;
      const arc = heading ? null : P.sv('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 5, 'stroke-linecap': 'round' }, knob);
      const turn = P.sv('g', {}, knob);
      if (heading) {
        P.sv('path', { d: `M0,${-(rg + 16)} L11,-8 L-11,-8 Z`, fill: 'var(--accent)', opacity: 0.85 }, turn);
        P.sv('path', { d: `M0,${rg * 0.55} L8,8 L-8,8 Z`, fill: 'var(--muted)', opacity: 0.6 }, turn);
      } else {
        P.sv('line', { x1: 0, y1: D.needleScale ? -R * D.needleScale[0] : -14, x2: 0, y2: D.needleScale ? -R * D.needleScale[1] : -(rg - 14), stroke: 'var(--muted)', 'stroke-width': 3, 'stroke-linecap': D.needleCap }, turn);
      }
      P.sv('circle', { r: 9, fill: 'var(--fg)', opacity: 0.75 }, knob);
      const grip = P.sv('circle', { cx: 0, cy: -rg, r: 13, fill: 'var(--accent)', stroke: '#fff', 'stroke-width': 3 }, turn);
      grip.dataset.role = 'grip';
      return { arc, turn, grip };
    };

    BASE.readout = (ctx, g) => {
      const { util, rng, spec } = ctx;
      const { col, grip, knob } = g;
      const readout = (D.forceReadout || spec.readout) ? util.el('div', 'rot-readout', col) : null;
      const hints = ['Drag the grip around the dial'];
      if (spec.wheel) hints.push(rng.pick(['Scroll over the knob to fine-tune', 'Mouse wheel adjusts in steps']));
      if (!spec.readout || spec.wheel) util.el('div', 'rot-muted', col, rng.pick(hints.slice(-1).concat(hints)));
      return { readout, hints };
    };

    BASE.paint = (ctx, g) => {
      const { spec } = ctx;
      const fam = env.taskDef;
      const { heading, R, arc, turn, readout } = g;
      const a = ctx.model.angle;
      turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
      if (arc) {
        if (a - spec.start > 0.05) arc.setAttribute('d', P.arcPath(R + 2, spec.start, a));
        else arc.removeAttribute('d');
      }
      if (readout) {
        const v = fam.helpers.dialValue(spec, a);
        readout.textContent = heading ? `${Math.round(v) % 360}°` : `${v.toFixed(spec.dec)}${spec.unit}`;
      }
    };

    BASE.controls = (ctx, g) => {
      // No extra frame controls.
    };

    BASE.input = (ctx, g) => {
      const { spec } = ctx;
      const fam = env.taskDef;
      const { svg, knob, paint } = g;
      const setValue = (v) => {
        const angle = fam.helpers.dialAngleFor(spec, v);
        g.dial.set(angle);
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
      return { setValue };
    };

    BASE.knob = (ctx, g) => ({
      knob: P.sv('g', { class: 'rot-knob' }, g.svg),
      gid: `rot-grad-${Math.floor(ctx.rng.next() * 1e9)}`,
      defs: g.defs || P.sv('defs', {}, g.svg),
    });

    BASE.dial = (ctx, g) => {
      const { spec } = ctx;
      const fam = env.taskDef;
      const { rg, svg, knob, paint } = g;
      const dial = env.ui.dial(knob, {
        label: 'dial',
        center: () => P.centerOf(svg),
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
      return { dial };
    };

    BASE.placeCard = function (card, ctx) {
      const s = ctx.stage.getBoundingClientRect();
      const r = card.getBoundingClientRect();
      const lo = [s.left - r.left + 4, s.top - r.top + 4];
      const hi = [s.right - r.right - 4, s.bottom - r.bottom - 4];
      const pick = (a, b) => (b > a ? Math.round(ctx.rng.float(Math.max(a, -90), Math.min(b, 90))) : 0);
      card.style.position = 'relative';
      card.style.left = pick(lo[0], hi[0]) + 'px';
      card.style.top = pick(lo[1], hi[1]) + 'px';
    };
    BASE.placed = (ctx, g) => { if (g.card) P.placeCard(g.card, ctx); };

    const SCENARIOS = { dial: {
      forceReadout: true, dialSize: [.77, .94, .28], titleUnits: false, unitCaption: true,
      tickUnits: 'width', tickRadii: [.33, .375, .357, .425],
      stops: [['0%', '#303030'], ['100%', '#161616']],
      bevelStops: [['0%', '#696969'], ['30%', '#373737'], ['100%', '#20201e']],
      knobStroke: 'bevel', knobStrokeWidth: 8, rimRatio: .92, needleScale: [.38, .97], needleCap: 'butt',
    } };

    ({ D, P } = env.templateDesign('rotate-object/dial', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
      render(ctx) {
        ctxRef = ctx;
        P.style();
        const g = {};
        geo = g;
        const paint = () => P.paint(ctx, g);
        g.paint = paint;
        Object.assign(g, P.frame(ctx, g));
        Object.assign(g, P.ticks(ctx, g));
        Object.assign(g, P.knob(ctx, g));
        Object.assign(g, P.surface(ctx, g));
        Object.assign(g, P.pointer(ctx, g));
        Object.assign(g, P.readout(ctx, g));
        Object.assign(g, P.input(ctx, g));
        Object.assign(g, P.dial(ctx, g));
        P.controls(ctx, g);
        paint();
        const sync = D.sync === 'dial' ? (m) => { g.dial.set(m.angle); paint(); } : D.sync === 'paint' ? paint : null;
        view = { anchors: [g.svg], ...(sync ? { sync } : {}), locate(t) {
          if (t.grip || t.knob) return g.dial.locateGrip();
          if (t.dialAngle !== undefined) return g.dial.locate(t.dialAngle);
          return null;
        } };
        P.placed(ctx, g);
        return view.sync ? { anchors: view.anchors, sync: view.sync } : { anchors: view.anchors };
      },
      locate(t) {
        const p = view && view.locate(t);
        if (!p) throw new Error(`rotate-object/stage cannot locate ${JSON.stringify(t)} (variant ${ctxRef && ctxRef.spec.scenario})`);
        return p;
      },
    };

  });
})();
