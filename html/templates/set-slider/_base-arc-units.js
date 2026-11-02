/* set-slider/_base-arc-units: default reference units; __scope supplies the original overridable bindings. */
(function () {
  'use strict';
  env.template('set-slider/_base-arc-units', () => {
    function ensureStyle(__scope) {
        const { CSS } = __scope;
        if (document.getElementById('sla-style')) return;
        const s = document.createElement('style');
        s.id = 'sla-style';
        s.textContent = CSS;
        document.head.append(s);
    }

    function placeIn(__scope, ctx, el, rng, pad = 12) {
        const W = ctx.size.width;
        const H = ctx.size.height;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const freeX = Math.max(0, W - w - 2 * pad);
        const freeY = Math.max(0, H - h - 2 * pad);
        const c01 = (f) => Math.min(1, Math.max(0, f));
        const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const st = ctx.stage.getBoundingClientRect();
        const fixed = [...document.querySelectorAll('[data-role="submit"]')]
          .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
        const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h > r.top - 6);
        let [x, y] = [pad + fx * freeX, pad + fy * freeY];
        for (const [ax, ay] of [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1]]) {
          if (!hits(pad + ax * freeX, pad + ay * freeY)) {
            [x, y] = [pad + ax * freeX, pad + ay * freeY];
            break;
          }
        }
        el.style.left = Math.round(x) + 'px';
        el.style.top = Math.round(y) + 'px';
    }

    function sv(__scope, tag, attrs, parent) {
        const { env } = __scope;
        const plain = {};
        const style = {};
        for (const [k, v] of Object.entries(attrs)) {
          if (typeof v === 'string' && v.includes('var(')) style[k] = v;
          else plain[k] = v;
        }
        const e = env.util.svg(tag, plain, parent);
        for (const [k, v] of Object.entries(style)) e.style.setProperty(k, v);
        return e;
    }

    function arcD(__scope, c, r, a, b, dir) {
        const { pt, polar } = __scope;
        const large = Math.abs(b - a) > 180 ? 1 : 0;
        return `M${pt(polar(c, r, a))} A${r},${r} 0 ${large} ${dir > 0 ? 1 : 0} ${pt(polar(c, r, b))}`;
    }

    function thumbShape(__scope, g, shape, w, color) {
        const { sv } = __scope;
        if (shape === 'capsule') {
          const h = w + 16;
          sv('rect', { x: -5.5, y: -h / 2, width: 11, height: h, rx: 5.5, fill: 'var(--panel)', stroke: color, 'stroke-width': 3 }, g);
        } else if (shape === 'diamond') {
          const k = w / 2 + 9;
          sv('path', { d: `M0,${-k} L${k * 0.7},0 L0,${k} L${-k * 0.7},0 Z`, fill: color, stroke: 'var(--panel)', 'stroke-width': 2.5 }, g);
        } else {
          sv('circle', { r: w / 2 + 6, fill: color, stroke: 'var(--panel)', 'stroke-width': 3 }, g);
          sv('circle', { r: 3, fill: 'var(--panel)' }, g);
        }
    }

    function ticks(__scope, s, S) {
        if (s.log) {
          const out = [];
          for (let v = s.min; v <= s.max * 1.0001; v *= 10) out.push(Number(v.toPrecision(3)));
          return { marks: out, labels: out };
        }
        const at = (k, n) => Number((s.min + (k * (s.max - s.min)) / n).toFixed(S.decimals(s.step) + 2));
        return {
          marks: Array.from({ length: 11 }, (_, k) => at(k, 10)),
          labels: Array.from({ length: 5 }, (_, k) => at(k, 4)),
        };
    }

    function makeArc(__scope, ctx, svg, index, s, arc, look, color, hooks) {
        const { env, sv, arcD, ticks, polar, thumbShape, D2R, R2D, wrap180, pt, KEYS } = __scope;
        const S = env.taskOf('set-slider').helpers.scale;
        const { c, r, a0, sweep, dir } = arc;
        const angle = (f) => a0 + dir * f * sweep;
        const w = look.w;
        const g = sv('g', { class: 'sla-track' }, svg);
        g.dataset.role = 'track';
        const full = arcD(c, r, a0, angle(1), dir);
        const hit = sv('path', { d: full, fill: 'none', stroke: 'transparent', 'stroke-width': look.hitW, 'pointer-events': 'stroke' }, g);
        sv('path', { d: full, fill: 'none', stroke: 'var(--line)', 'stroke-width': w, 'stroke-linecap': 'round', 'pointer-events': 'none' }, g);
        const fill = sv('path', { fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'pointer-events': 'none' }, g);
        // Tick marks on the inner (center) side of the arc.
        const { marks, labels } = ticks(s, S);
        for (const v of marks) {
          const a = angle(S.frac(s, v));
          const major = labels.includes(v);
          const p0 = polar(c, r - (w / 2 + 3), a);
          const p1 = polar(c, r - (w / 2 + (major ? 9 : 6)), a);
          sv('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: 'var(--muted)', 'stroke-width': major ? 1.5 : 1, 'pointer-events': 'none' }, g);
        }
        const n = ctx.model.values[index].length;
        const thumbs = Array.from({ length: n }, (_, j) => {
          const t = sv('g', { class: 'sla-thumb' }, g);
          t.dataset.role = 'thumb';
          t.dataset.j = j;
          thumbShape(t, look.shape, w, color);
          return t;
        });

        const values = () => ctx.model.values[index];
        function paint(vals) {
          const fs = vals.map((v) => S.frac(s, v));
          const [fa, fb] = fs.length === 2 ? fs : [0, fs[0]];
          if (fb - fa > 1e-4) fill.setAttribute('d', arcD(c, r, angle(fa), angle(fb), dir));
          else fill.removeAttribute('d');
          if (hooks.paint) hooks.paint(vals.map((v) => S.fmtU(s, v)).join(' – '));
        }

        const geometry = arc.mode === 'arc' ? () => {
          // Exact circle in viewport px (the svg's user units are px, offset by its screen CTM).
          const m = svg.getScreenCTM();
          const cc = [m.a * c[0] + m.c * c[1] + m.e, m.b * c[0] + m.d * c[1] + m.f];
          const length = r * sweep * D2R;
          return {
            length,
            point: (f) => polar(cc, r, angle(f)),
            project([x, y]) {
              const a = Math.atan2(x - cc[0], -(y - cc[1])) * R2D;
              const d = wrap180(dir * (a - a0));
              let f = d / sweep;
              if (f < 0 || f > 1) f = Math.abs(d) <= Math.abs(wrap180(d - sweep)) ? 0 : 1;
              return f * length;
            },
          };
        } : null;

        const commit = (vals) => {
          const all = ctx.model.values.map((x) => x.slice());
          all[index] = vals;
          ctx.update({ ...ctx.model, values: all });
          paint(vals);
        };
        const ctl = env.ui.slider(g, {
          label: s.label,
          thumbs,
          values: values().slice(),
          valueAt: (f) => S.valueAt(s, f),
          fractionOf: (v) => S.frac(s, v),
          path: arc.mode === 'path' ? hit : null,
          geometry,
          // Thumbs stand on the arc, turned to its normal (in the svg's own user units).
          place(t, point, f) {
            const a = angle(f);
            const p = polar(c, r, a);
            t.setAttribute('transform', `translate(${pt(p)}) rotate(${a.toFixed(3)})`);
          },
          trackClick() {
            if (!ctx.spec.allowTrackClick) ctx.flag('track-click');
          },
          onStart: (j) => thumbs[j].classList.add('on'),
          onInput: commit,
          onChange(vals, j) {
            if (j !== null) thumbs[j].classList.remove('on');
          },
        });
        if (ctx.spec.keys) {
          g.setAttribute('tabindex', '0');
          g.addEventListener('pointerdown', () => g.focus({ preventScroll: true }));
          g.addEventListener('keydown', (e) => {
            if (!KEYS.has(e.key)) return;
            e.preventDefault();
            const v = values();
            if (v.length !== 1) return;
            const nv = S.keyApply(s, v[0], e.key);
            if (nv === v[0]) return;
            ctl.set([nv]);
            commit([nv]);
          });
          g.addEventListener('focus', () => {
            g.classList.add('focused');
            if (ctx.model.focus !== index) ctx.update({ ...ctx.model, focus: index });
          });
          g.addEventListener('blur', () => {
            g.classList.remove('focused');
            if (ctx.model.focus === index) ctx.update({ ...ctx.model, focus: null });
          });
        }
        paint(values());
        return { ctl, g, angle, set: (vals) => { ctl.set(vals); paint(vals); } };
    }

    function arcText(__scope, svg, defs, id, c, r, a, sweep, cls, text, offset, anchor) {
        const { sv, arcD } = __scope;
        sv('path', { id, d: arcD(c, r, a, a + sweep, 1), fill: 'none' }, defs);
        const t = sv('text', { class: cls }, svg);
        const tp = sv('textPath', { href: `#${id}`, startOffset: offset, 'text-anchor': anchor }, t);
        tp.textContent = text;
        return t;
    }

    function renderRings(__scope, ctx, look, colors) {
        const { env, D2R, sv, makeArc, arcText, ticks, R2D, polar, placeIn } = __scope;
        const { spec, rng, util, size } = ctx;
        const S = env.taskOf('set-slider').helpers.scale;
        const n = spec.sliders.length;
        const sweep = rng.pick([240, 270]);
        const a0 = 180 + (360 - sweep) / 2;
        const sw = sweep * D2R;
        let G = rng.int(48, 58);
        const minR = (s) => (s.log ? 450 : 250) / sw;
        const roMax = Math.max(150, Math.min(250, Math.floor(size.height / 2) - 60));
        // Ring i has radius ro - i * G; every ring must be long enough for its scale.
        const need = () => Math.ceil(Math.max(...spec.sliders.map((s, i) => minR(s) + i * G)));
        let roMin = need();
        if (roMin > roMax && n > 1) {
          G = Math.max(34, Math.floor(Math.min(...spec.sliders.slice(1).map((s, i) => (roMax - minR(s)) / (i + 1)))));
          roMin = need();
        }
        const ro = roMin <= roMax ? rng.int(roMin, roMax) : roMin;
        const half = Math.ceil(ro + look.w / 2 + 30);
        const c = [half, half];
        // The gap at the bottom only holds the end labels: crop the gauge below them.
        const H = Math.min(2 * half, Math.ceil(half + ro * Math.cos(((360 - sweep) / 2 - 14) * D2R) + 22));

        const card = util.el('div', 'sla-card', ctx.stage);
        const svg = sv('svg', { class: 'sla-svg', width: 2 * half, height: H, viewBox: `0 0 ${2 * half} ${H}` }, card);
        svg.dataset.role = 'gauge';
        const defs = sv('defs', {}, svg);
        const uid = Math.floor(rng.next() * 1e9);

        // Hub legend: one row per ring.
        const hubRows = spec.sliders.map((s, i) => {
          const y = c[1] + (i - (n - 1) / 2) * (n > 3 ? 20 : 24);
          const t = sv('text', { class: 'sla-hub', x: c[0], y, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, svg);
          const chip = sv('tspan', { fill: colors[i] }, t);
          chip.textContent = '● ';
          sv('tspan', {}, t).textContent = s.label;
          const val = look.readout || s.log ? sv('tspan', { class: 'val', dx: 8 }, t) : null;
          return val;
        });

        const out = spec.sliders.map((s, i) => {
          const r = ro - i * G;
          const arc = { c, r, a0, sweep, dir: 1, mode: 'path' };
          const sl = makeArc(ctx, svg, i, s, arc, look, colors[i], { paint: (text) => { if (hubRows[i]) hubRows[i].textContent = text; } });
          // Name along the outside of the ring, then tick labels where they do not collide with it.
          const rText = r + look.w / 2 + 7;
          const len = rText * sw;
          const nameLen = s.label.length * 9.5 + 10;
          arcText(svg, defs, `sla-n${uid}-${i}`, c, rText, a0, sweep, 'sla-name', s.label, '1.5%', 'start')
            .style.setProperty('fill', colors[i]);
          if (look.ticks || s.log) {
            ticks(s, S).labels.forEach((v, k) => {
              const f = S.frac(s, v);
              const label = S.fmt(s, v);
              const halfW = (label.length * 6.2) / 2 + 6;
              if (f * len - halfW < 0.015 * len + nameLen || f * len + halfW > len - 4) return;
              arcText(svg, defs, `sla-t${uid}-${i}-${k}`, c, rText, a0, sweep, 'sla-tick', label, `${(f * 100).toFixed(3)}%`, 'middle');
            });
          }
          // min and max just past the two ends of the arc, in the gap.
          for (const [f, v, side] of [[0, s.min, -1], [1, s.max, 1]]) {
            const label = S.fmt(s, v);
            const off = ((label.length * 6.4) / 2 + look.w / 2 + 10) / r * R2D;
            const p = polar(c, r, sl.angle(f) + side * off);
            const t = sv('text', { class: 'sla-end', x: p[0], y: p[1], 'text-anchor': 'middle', 'dominant-baseline': 'central' }, svg);
            t.textContent = label;
          }
          return { ...sl, anchor: svg };
        });
        placeIn(ctx, card, rng);
        return out;
    }

    function renderFaders(__scope, ctx, look, colors) {
        const { env, D2R, sv, makeArc, ticks, polar, placeIn } = __scope;
        const { spec, rng, util, size } = ctx;
        const S = env.taskOf('set-slider').helpers.scale;
        const th = rng.pick([90, 120, 150]);
        const thR = th * D2R;
        const ratio = (2 * Math.sin(thR / 2)) / thR; // chord / arc length
        const maxV = Math.max(240, Math.min(440, Math.floor(size.height) - 200));
        const card = util.el('div', 'sla-card', ctx.stage);
        const row = util.el('div', 'sla-row', card);
        if (spec.sliders.length >= 3) row.style.gap = '28px';
        const shared = rng.int(260, Math.max(260, Math.floor(maxV / ratio)));
        const out = spec.sliders.map((s, i) => {
          const L = Math.max(s.log ? 450 : 260, spec.norm ? shared : rng.int(260, Math.max(260, Math.floor(maxV / ratio))));
          const r = L / thR;
          const H = r * 2 * Math.sin(thR / 2);
          const sag = r * (1 - Math.cos(thR / 2));
          const left = 46;
          const W = Math.ceil(left + sag + look.w / 2 + 70);
          const Ht = Math.ceil(H + 64);
          const c = [left - r * Math.cos(thR / 2), Ht / 2];
          const col = util.el('div', 'sla-col', row);
          util.el('div', 'sla-label', col, s.label).style.color = colors[i];
          const svg = sv('svg', { class: 'sla-svg', width: W, height: Ht, viewBox: `0 0 ${W} ${Ht}` }, col);
          svg.dataset.role = 'fader';
          const readout = look.readout ? util.el('div', 'sla-readout', col) : null;
          // From the bottom end (compass 90 + th/2) counterclockwise to the top end.
          const arc = { c, r, a0: 90 + th / 2, sweep: th, dir: -1, mode: 'arc' };
          const sl = makeArc(ctx, svg, i, s, arc, look, colors[i], { paint: (text) => { if (readout) readout.textContent = text; } });
          // Tick labels outside (right of) the arc; min/max past the ends.
          for (const v of ticks(s, S).labels) {
            const f = S.frac(s, v);
            const end = Math.abs(f) < 1e-9 || Math.abs(f - 1) < 1e-9;
            if (!(look.ticks || s.log) && !end) continue;
            const p = polar(c, r + look.w / 2 + 16, sl.angle(f));
            const txt = sv('text', { class: end ? 'sla-end' : 'sla-tick', x: p[0], y: p[1], 'dominant-baseline': 'central' }, svg);
            txt.textContent = S.fmt(s, v);
          }
          return { ...sl, anchor: svg };
        });
        placeIn(ctx, card, rng);
        return out;
    }

    return { ensureStyle, placeIn, sv, arcD, thumbShape, ticks, makeArc, arcText, renderRings, renderFaders };
  });
})();
