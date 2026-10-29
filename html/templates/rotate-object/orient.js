/*
 * rotate-object/orient — L1 medoid's live orient renderer; scenario: orient.
 * Raw TOKENS/BASE are the orient path of design-rotate-object-dial-12. The orient preset
 * reproduces design-rotate-object-orient-04 with design {}. Reference cube/photo/compass
 * functions from the wrapper never register on these sites and have been removed.
 * Tokens: css (original scaffold CSS; null skips it), shapes ({}: overrides/additions
 * to [path, halfWidth, halfHeight] table), sync ('none'; 'paint' adds repaint on sync).
 * modeClass (null): optional card class prefix followed by spec.mode.
 * Preset orient: modeClass 'rot-', orient-04 arrow, fit/shapeScale/handleRadius,
 * heading ring, point marker and handle. The modal extra ell path (5 sites) is
 * included too: 10/12 sites add ell, and it is sampled only with an explicit shapes trait.
 * fit(ctx,g) -> canvas side (floor of min(560,height-130,width-520));
 * shapeScale(ctx,g,B,C) -> B/100; handleRadius(ctx,g) -> round(top+rng.int(26,36)).
 * frame calls these separately, keeping both draws in order; overrides may store additional
 * geometry on g (e.g. unit, dragRadius).
 * Parts: style() installs css; sv(tag,attrs,parent) returns SVG with CSS paints;
 * polar(c,r,a)/centerOf(el) return points; starPath(outer,inner,n) returns SVG path;
 * angleField(ctx,host,label,onAngle) returns {paint,locate}; shapePaths() returns table.
 * Construction parts (ctx,g) return objects merged into live g:
 * frame: sampled shape geometry and card/canvas; grid: seeded grid pattern;
 * heading: degree ring; point: target star and fixed decorations; shape: shape path;
 * selection: dashed box/corners; handle: stem, grip and hub; reference: side/reference SVG;
 * readout: angle field and hint; rotate: rotateHandle primitive.
 * paint(ctx,g) updates readout; hubDrag(ctx,g) installs shared hub pointer tracking;
 * controls(ctx,g) noop for frame buttons; placed(ctx,g) samples card placement;
 * placeCard(card,ctx) implements sampled offset. S exposes live ctx, geo, D, P and R2D.
 * Construction callbacks use g.rot, which is initialized after the readout.
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
  const TOKENS = { css: CSS, shapes: {}, sync: 'none', modeClass: null };
  env.template('rotate-object/orient', (design, def) => {
    let D, P, ctxRef, geo, view;
    const BASE = {};
    const S = { R2D: 180 / Math.PI, get ctx() { return ctxRef; }, get geo() { return geo; }, get D() { return D; }, get P() { return P; } };
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
      if (!D.css || document.getElementById('rot-style')) return;
      const s = document.createElement('style');
      s.id = 'rot-style';
      s.textContent = D.css;
      document.head.append(s);
    };
    const F = () => env.taskDef;
    BASE.starPath = (r0, r1, n) => {
      const pts = [];
      for (let k = 0; k < 2 * n; k++) {
        const [x, y] = P.polar([0, 0], k % 2 ? r1 : r0, (k * 180) / n);
        pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
      }
      return `M${pts.join(' L')} Z`;
    };
    BASE.angleField = (ctx, host, label, onAngle) => {
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
    };
    BASE.shapePaths = () => ({ ...{
        arrow: ['M0,-48 L32,-10 L12,-10 L12,48 L-12,48 L-12,-10 L-32,-10 Z', 32, 48],
        dart: ['M0,-50 L30,42 L0,24 L-30,42 Z', 30, 50],
        letter: ['M-28,-46 H30 V-26 H-6 V-9 H22 V11 H-6 V46 H-28 Z', 30, 46],
        tee: ['M-42,-44 H42 V-20 H12 V46 H-12 V-20 H-42 Z', 42, 46],
        house: ['M0,-48 L44,-8 L44,44 L-44,44 L-44,-8 Z', 44, 48],
        triangle: ['M0,-50 L43.30,25 L-43.30,25 Z', 44, 50],
        bar: ['M-48,-17 H48 V17 H-48 Z', 48, 17],
        cross: ['M-15,-48 H15 V-15 H48 V15 H15 V48 H-15 V15 H-48 V-15 H-15 Z', 48, 48],
        star: [P.starPath(50, 21, 5), 48, 50],
      }, ...D.shapes });

    BASE.fit = (ctx) => Math.floor(Math.min(560, ctx.size.height - 130, ctx.size.width - 520));
    BASE.shapeScale = (ctx, g, B) => B / 100;
    BASE.handleRadius = (ctx, g) => Math.round(g.top + ctx.rng.int(26, 36));
    BASE.frame = (ctx, g) => {
      const { util, rng, spec, content } = ctx;
      const C = P.fit(ctx, g);
      const half = C / 2;
      const B = rng.int(110, 150);
      const k = P.shapeScale(ctx, g, B, C);
      const [d, hw, hh] = P.shapePaths()[spec.shape];
      const color = content.COLORS[spec.color];
      const selPad = 8;
      const top = hh * k + selPad;
      Object.assign(g, { C, half, B, k, d, hw, hh, color, selPad, top });
      const Rh = P.handleRadius(ctx, g);
      const card = util.el('div', D.modeClass ? 'rot-card ' + D.modeClass + spec.mode : 'rot-card', ctx.stage);
      const svg = P.sv('svg', { class: 'rot-svg rot-canvas', width: C, height: C, viewBox: `${-half} ${-half} ${C} ${C}` }, card);
      svg.dataset.role = 'canvas';
      return { Rh, card, svg };
    };

    BASE.grid = (ctx, g) => {
      const { rng } = ctx;
      const { C, half, d, svg } = g;
      // Design-tool grid.
      const gid = `rot-grid-${Math.floor(rng.next() * 1e9)}`;
      const defs = P.sv('defs', {}, svg);
      const cell = rng.pick([20, 24, 28]);
      const pat = P.sv('pattern', { id: gid, width: cell, height: cell, patternUnits: 'userSpaceOnUse', x: -half, y: -half }, defs);
      P.sv('path', { d: `M${cell},0 L0,0 0,${cell}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
      P.sv('rect', { x: -half, y: -half, width: C, height: C, fill: `url(#${gid})` }, svg);
      return { gid, defs, cell, pat };
    };

    BASE.heading = (ctx, g) => {
      const { rng, spec } = ctx;
      const { half, svg } = g;
      if (spec.mode === 'heading' && rng.bool(0.6)) {
        const Rr = half - 30;
        for (let a = 0; a < 360; a += 5) {
          const major = a % 45 === 0;
          const [x0, y0] = P.polar([0, 0], Rr, a);
          const [x1, y1] = P.polar([0, 0], Rr - (major ? 14 : a % 15 === 0 ? 9 : 5), a);
          P.sv('line', { class: major ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1, opacity: major ? 0.6 : 0.8 }, svg);
          if (major) {
            const [tx, ty] = P.polar([0, 0], Rr + 14, a);
            const t = P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, svg);
            t.textContent = `${a}°`;
            t.style.fontSize = '11px';
          }
        }
      }
    };

    BASE.point = (ctx, g) => {
      const { spec } = ctx;
      const { half, d, svg } = g;
      if (spec.mode === 'point') {
        const [sx, sy] = P.polar([0, 0], half - 38, spec.target);
        P.sv('path', { d: P.starPath(19, 8, 5), transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`, fill: '#f2c200', stroke: '#8a6d00', 'stroke-width': 1.5 }, svg);
      }
    };

    BASE.shape = (ctx, g) => {
      const { k, d, color, sel } = g;
      P.sv('path', { d, transform: `scale(${k})`, fill: color, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 / k }, sel);
    };

    BASE.selection = (ctx, g) => {
      const { k, hw, selPad, top, sel } = g;
      const bx = hw * k + selPad;
      P.sv('rect', { x: -bx, y: -top, width: 2 * bx, height: 2 * top, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, sel);
      for (const [cx, cy] of [[-bx, -top], [bx, -top], [-bx, top], [bx, top]]) {
        P.sv('rect', { x: cx - 4, y: cy - 4, width: 8, height: 8, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
      }
      return { bx };
    };

    BASE.handle = (ctx, g) => {
      const { top, Rh, sel } = g;
      P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
      const handle = P.sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: 9, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 2.5 }, sel);
      handle.dataset.role = 'handle';
      P.sv('circle', { r: 3, fill: 'var(--accent)' }, sel);
      return { handle };
    };

    BASE.reference = (ctx, g) => {
      const { util, spec } = ctx;
      const { d, color, card, svg } = g;
      const side = util.el('div', 'rot-col', card);
      if (spec.mode === 'match') {
        util.el('div', 'rot-title', side, 'Reference');
        const RW = 190;
        const ref = P.sv('svg', { class: 'rot-svg rot-ref', width: RW, height: RW, viewBox: `${-RW / 2} ${-RW / 2} ${RW} ${RW}` }, side);
        const rk = 1.15;
        P.sv('path', { d, transform: `rotate(${spec.target}) scale(${rk})`, fill: color, opacity: 0.85, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 / rk }, ref);
      }
      return { side };
    };

    BASE.readout = (ctx, g) => {
      const { util, rng, spec } = ctx;
      const fam = env.taskDef;
      const { handle, side, paint } = g;
      const readout = spec.mode === 'heading' || rng.bool(0.4) ? util.el('div', 'rot-readout', side) : null;
      let field = null;
      if (readout && spec.keys) field = P.angleField(ctx, readout, 'Rotation', (a) => {
        const angle = fam.helpers.mod360(a);
        g.rot.set(angle);
        ctx.update({ angle });
        paint();
      });
      util.el('div', 'rot-muted', side, 'Drag the round handle to rotate');
      return { readout, field };
    };

    BASE.paint = (ctx, g) => {
      const { readout, field, paint } = g;
      if (field) field.paint(Math.round(ctx.model.angle) % 360);
      else if (readout) readout.textContent = `Rotation: ${Math.round(ctx.model.angle) % 360}°`;
    };

    BASE.rotate = (ctx, g) => {
      const fam = env.taskDef;
      const { Rh, svg, sel, handle, paint } = g;
      const rot = env.ui.rotateHandle(sel, handle, {
        label: 'handle',
        pivot: () => P.centerOf(svg),
        radius: Rh,
        angle: ctx.model.angle,
        constrain: fam.helpers.mod360,
        place: (el, a) => el.setAttribute('transform', `rotate(${a.toFixed(3)})`),
        onInput(angle) {
          ctx.update({ angle });
          paint();
        },
      });
      return { rot };
    };

    BASE.controls = (ctx, g) => {
      // No extra frame controls.
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

    BASE.hubDrag = (ctx, g) => {
      if (!g.hubGrip) return;
      const at = (p) => {
        const c = g.rot.pivot();
        if (Math.hypot(p.x - c[0], p.y - c[1]) < 6) return;
        const angle = env.taskDef.helpers.mod360(Math.atan2(p.x - c[0], -(p.y - c[1])) * R2D);
        if (angle === g.rot.get()) return;
        g.rot.set(angle);
        ctx.update({ angle });
        g.paint();
      };
      env.ui.track(g.hub, { start: (p) => at(p), move: (p) => at(p),
        end: () => env.log('value', { what: 'hub', angle: g.rot.get() }) }, 'hub');
    };
    BASE.placed = (ctx, g) => { if (g.card) P.placeCard(g.card, ctx); };
    const SCENARIOS = { orient: { modeClass: 'rot-', shapes: {
      arrow: ['M0,-48 L7,-33 L2,-33 L2,0 L-2,0 L-2,-33 L-7,-33 Z', 7, 48],
      ell: ['M-28,-46 H-4 V22 H30 V46 H-28 Z', 30, 46],
    }, parts: {
      fit: () => (ctx) => Math.floor(Math.min(440, ctx.size.height - 60, ctx.size.width * .285)),
      shapeScale: () => (ctx, g, B, C) => ctx.spec.shape === 'arrow' ? (C / 2 * .7) / 48 : Math.min(B / 100, C / 2 / 85),
      handleRadius: () => (ctx, g) => Math.round(Math.min(g.top + ctx.rng.int(26, 36), g.half * .7 * .82)),
      heading: () => (ctx, g) => {
        const { rng, spec } = ctx;
        const { half, svg } = g;
        const drawTicks = spec.mode === 'heading' ? rng.bool(0.6) : true;
        P.sv('circle', { r: half - 2, fill: 'none', stroke: '#666', 'stroke-width': 2 }, svg);
        if (drawTicks || spec.mode === 'heading') {
          const Rr = half - 10;
          for (let a = 0; a < 360; a += 15) {
            const major = a % 90 === 0;
            const [x0, y0] = P.polar([0, 0], Rr, a);
            const [x1, y1] = P.polar([0, 0], Rr - (major ? 28 : a % 30 === 0 ? 19 : 10), a);
            P.sv('line', { class: major ? 'major' : 'minor', x1: x0, y1: y0, x2: x1, y2: y1, opacity: 1 }, svg);
            if (major) {
              const [tx, ty] = P.polar([0, 0], Rr + 14, a);
              const t = P.sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, svg);
              t.textContent = `${a}°`;
              t.style.fontSize = '11px';
            }
          }
        }
        return { drawTicks };
      },
      point: () => (ctx, g) => {
        const { spec } = ctx;
        const { half, d, svg } = g;
        if (spec.mode === 'point') {
          const [sx, sy] = P.polar([0, 0], half * 0.64, spec.target);
          P.sv('path', { d: P.starPath(half * 0.108, half * 0.045, 5), transform: `translate(${sx.toFixed(2)},${sy.toFixed(2)})`, fill: '#b01c22', stroke: 'none' }, svg);
        }
      },
      handle: () => (ctx, g) => {
        const { half, top, Rh, sel } = g;
        P.sv('line', { x1: 0, y1: -top, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        const handle = P.sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: 6, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 2.5 }, sel);
        handle.dataset.role = 'handle';
        P.sv('circle', { class: 'rot-pivot-rim', r: half * 0.095, fill: '#fff' }, sel);
        P.sv('circle', { r: half * 0.077, fill: 'var(--accent)' }, sel);
        return { handle };
      },
    } } };

    ({ D, P } = env.templateDesign('rotate-object/orient', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
      render(ctx) {
        ctxRef = ctx;
        P.style();
        const g = {};
        geo = g;
        g.paint = () => P.paint(ctx, g);
        Object.assign(g, P.frame(ctx, g));
        Object.assign(g, P.grid(ctx, g));
        Object.assign(g, P.heading(ctx, g));
        Object.assign(g, P.point(ctx, g));
        g.sel = P.sv('g', {}, g.svg);
        Object.assign(g, P.shape(ctx, g));
        Object.assign(g, P.selection(ctx, g));
        Object.assign(g, P.handle(ctx, g));
        Object.assign(g, P.reference(ctx, g));
        Object.assign(g, P.readout(ctx, g));
        Object.assign(g, P.rotate(ctx, g));
        P.hubDrag(ctx, g);
        P.controls(ctx, g);
        g.paint();
        view = { anchors: [g.svg], ...(D.sync === 'paint' ? { sync: g.paint } : {}), locate(t) {
          if (t.hub && g.hubGrip) return g.rot.pivot();
          if (t.handle) return g.rot.locateHandle();
          if (t.handleAngle !== undefined) return g.rot.locate(t.handleAngle);
          if (t.field && g.field) return g.field.locate();
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
