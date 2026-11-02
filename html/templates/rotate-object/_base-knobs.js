// rotate-object/_base-knobs: reference knobs widget registration, loaded by rotate-object/base.
// Retains the original unit scopes, part keys and order of setup / RNG draws.
// buildKnobs(ctx) builds the controls; its scope getter and part hook allow designs to wrap it.
(function () {
  'use strict';
  env.template('rotate-object/_base-knobs', () => ({
    register({ env, scriptOf, __parts, __has, setScope }) {
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get R2D() { return R2D; },
        get F() { return F; },
        get polar() { return polar; },
        get svg() { return svg; },
        get DECOYS() { return DECOYS; },
        get NAV_DECOYS() { return NAV_DECOYS; },
        get BRANDS() { return BRANDS; },
        get NAV_BRANDS() { return NAV_BRANDS; },
        get LEDS() { return LEDS; },
        get view() { return view; }, set view(v) { view = v; },
        get ctxRef() { return ctxRef; }, set ctxRef(v) { ctxRef = v; },
        get ensureStyle() { return ensureStyle; },
        get drawKnob() { return drawKnob; },
        get buildKnobs() { return buildKnobs; },
        get renderKnobs() { return renderKnobs; },
        get placeCard() { return placeCard; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+1.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@1')) ensureStyle = __parts['ensureStyle@1'](ensureStyle, __scope);
      if (__has('drawKnob')) drawKnob = __parts['drawKnob'](drawKnob, __scope);
      if (__has('buildKnobs')) buildKnobs = __parts['buildKnobs'](buildKnobs, __scope);
      if (__has('renderKnobs')) renderKnobs = __parts['renderKnobs'](renderKnobs, __scope);
      if (__has('placeCard@1')) placeCard = __parts['placeCard@1'](placeCard, __scope);

      const CSS = __has('CSS@1') ? __parts['CSS@1'](undefined, __scope) : (`
      .rk-panel {
        position: relative; display: flex; flex-direction: column; gap: 12px; padding: 16px 52px 14px;
        border-radius: 10px; color: #d8dbe1; font: 600 12px "Helvetica Neue", Arial, system-ui, sans-serif;
        background: linear-gradient(180deg, #34373e 0%, #24262b 55%, #1b1c20 100%);
        box-shadow: 0 10px 28px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08);
      }
      .rk-panel.light { background: linear-gradient(180deg, #d9dade 0%, #c4c6cc 60%, #b4b6bd 100%); color: #26282d;
        box-shadow: 0 10px 28px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.6); }
      .rk-cheek { position: absolute; top: 0; bottom: 0; width: 26px;
        background: repeating-linear-gradient(176deg, rgba(0,0,0,.0) 0 6px, rgba(0,0,0,.12) 6px 8px, rgba(255,255,255,.05) 8px 11px),
          linear-gradient(90deg, #6b3b1f, #8a5230 45%, #5d321a); }
      .rk-cheek.l { left: 0; border-radius: 10px 0 0 10px; }
      .rk-cheek.r { right: 0; border-radius: 0 10px 10px 0; }
      .rk-screw { position: absolute; width: 9px; height: 9px; border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #f2f2f2, #8d9096 70%); box-shadow: 0 1px 1px rgba(0,0,0,.5); }
      .rk-screw::after { content: ''; position: absolute; left: 1px; right: 1px; top: 4px; height: 1px; background: #4a4c52; transform: rotate(var(--r, 30deg)); }
      .rk-strip { display: flex; align-items: center; justify-content: space-between; gap: 18px; min-height: 30px; }
      .rk-brand { display: flex; align-items: baseline; gap: 10px; white-space: nowrap; }
      .rk-brand b { font-size: 15px; letter-spacing: .14em; }
      .rk-brand span { font-size: 10px; letter-spacing: .2em; opacity: .65; text-transform: uppercase; }
      .rk-power { width: 7px; height: 7px; border-radius: 50%; background: #ff4b3a; box-shadow: 0 0 6px #ff4b3a; }
      .rk-lcd {
        min-width: 168px; padding: 5px 10px; border-radius: 4px; border: 2px solid #111;
        background: linear-gradient(180deg, #24331f, #1a2617); color: #b6ff6a; text-shadow: 0 0 4px rgba(150,255,90,.55);
        font: 600 16px "DejaVu Sans Mono", "Courier New", monospace; letter-spacing: .08em; white-space: nowrap;
        font-variant-numeric: tabular-nums; text-align: right; box-shadow: inset 0 2px 5px rgba(0,0,0,.6);
      }
      .rk-lcd.amber { background: linear-gradient(180deg, #2f230e, #21180a); color: #ffbf47; text-shadow: 0 0 4px rgba(255,180,60,.55); }
      .rk-lcd.blue { background: linear-gradient(180deg, #0f2233, #0a1824); color: #7fd8ff; text-shadow: 0 0 4px rgba(110,210,255,.55); }
      .rk-lcd small { font-size: 11px; opacity: .7; margin-right: 10px; }
      .rk-row { display: flex; align-items: flex-end; justify-content: center; }
      .rk-cell { display: flex; flex-direction: column; align-items: center; gap: 2px; }
      .rk-name { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; white-space: nowrap; }
      .rk-svg { display: block; overflow: visible; touch-action: none; outline: none; }
      .rk-svg text { font: 600 11px "Helvetica Neue", Arial, system-ui, sans-serif; }
      .rk-hit { cursor: ns-resize; }
      .rk-hint { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; opacity: .6; text-align: center; }
      `);

      let view = __has('view@1') ? __parts['view@1'](undefined, __scope) : undefined;
      let ctxRef = __has('ctxRef@1') ? __parts['ctxRef@1'](undefined, __scope) : undefined;

      function ensureStyle() {
        if (document.getElementById('rk-style')) return;
        const s = document.createElement('style');
        s.id = 'rk-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      const R2D = __has('R2D@1') ? __parts['R2D@1'](undefined, __scope) : (180 / Math.PI);
      const F = __has('F@1') ? __parts['F@1'](undefined, __scope) : { F: () => env.taskDef }.F;
      const polar = __has('polar@1') ? __parts['polar@1'](undefined, __scope) : { polar: (c, r, a) => [c[0] + r * Math.sin(a / R2D), c[1] - r * Math.cos(a / R2D)] }.polar;
      const svg = __has('svg') ? __parts['svg'](undefined, __scope) : { svg: (tag, attrs, parent) => env.util.svg(tag, attrs, parent) }.svg;

      const DECOYS = __has('DECOYS') ? __parts['DECOYS'](undefined, __scope) : (['Cutoff', 'Resonance', 'Attack', 'Decay', 'Release', 'Drive', 'Mix', 'Rate', 'Depth', 'Tone',
        'Feedback', 'Width', 'Glide', 'Detune', 'Env Amt', 'Sustain']);
      const NAV_DECOYS = __has('NAV_DECOYS') ? __parts['NAV_DECOYS'](undefined, __scope) : (['Range', 'Dimmer', 'Course', 'Baro', 'Trim', 'Alt']);
      const BRANDS = __has('BRANDS') ? __parts['BRANDS'](undefined, __scope) : ([['KORVA', 'MS-7 analog synth'], ['OBERLIN', 'Filter bank'], ['MOOGLY', 'Mono voice'],
        ['ROLAN-D', 'Rack module'], ['ARPEX', 'Desktop synth'], ['TELEFUNK', 'Channel strip']]);
      const NAV_BRANDS = __has('NAV_BRANDS') ? __parts['NAV_BRANDS'](undefined, __scope) : ([['AVIONIX', 'Heading select'], ['NAVCOM', 'Autopilot panel'], ['MARINEX', 'Course selector']]);
      const LEDS = __has('LEDS') ? __parts['LEDS'](undefined, __scope) : (['#ff9f1a', '#ff3b30', '#41ff6e', '#38d8ff', '#f7f052']);

      // One knob drawn in SVG: silkscreen ticks and labels, an LED segment ring, a skirt and a cap with a pointer
      // line. ticks: [{ a, major, text }]. Returns { el (svg), hit, paint(angle) }.
      function drawKnob(parent, o) {
        const { R, half, rng, mat, led, heading, start, sweep, ticks, panelDark } = o;
        const W = 2 * half;
        const el = svg('svg', { class: 'rk-svg', width: W, height: W, viewBox: `${-half} ${-half} ${W} ${W}` }, parent);
        const silk = panelDark ? '#d6d9df' : '#2a2c31';
        for (const t of ticks) {
          const [x0, y0] = polar([0, 0], R + 16, t.a);
          const [x1, y1] = polar([0, 0], R + (t.major ? 24 : 20), t.a);
          svg('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: silk, 'stroke-width': t.major ? 1.6 : 1, opacity: t.major ? 0.95 : 0.6 }, el);
          if (t.text !== undefined) {
            const [tx, ty] = polar([0, 0], R + 34, t.a);
            const tt = svg('text', { x: tx.toFixed(2), y: ty.toFixed(2), 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: silk }, el);
            tt.textContent = t.text;
          }
        }
        // LED segments between the knob and the silkscreen.
        const segs = [];
        const n = heading ? 36 : o.segments;
        for (let k = 0; k < n; k++) {
          const a = heading ? k * 10 : start + (k / (n - 1)) * sweep;
          const r = svg('rect', { x: -2, y: -(R + 12), width: 4, height: 7, rx: 1, transform: `rotate(${a.toFixed(3)})` }, el);
          segs.push({ a, r });
        }
        const hit = svg('g', { class: 'rk-hit' }, el);
        svg('circle', { r: R + 13, fill: 'transparent' }, hit);
        const gid = `rk-g-${Math.floor(rng.next() * 1e9)}`;
        const defs = svg('defs', {}, el);
        const grad = svg('radialGradient', { id: gid, cx: '38%', cy: '30%', r: '80%' }, defs);
        const stops = mat === 'metal' ? ['#fbfbfb', '#c9ccd1', '#8b8f97'] : ['#5a5d63', '#26282c', '#0d0e10'];
        stops.forEach((c, i) => svg('stop', { offset: `${i * 50}%`, 'stop-color': c }, grad));
        // Skirt (knurled) and body.
        svg('circle', { r: R, fill: mat === 'metal' ? '#2b2d31' : '#16171a', stroke: '#0b0b0c', 'stroke-width': 1 }, hit);
        svg('circle', { r: R - 2, fill: 'none', stroke: mat === 'metal' ? '#4b4e55' : '#34363b', 'stroke-width': 3, 'stroke-dasharray': '2 2.6' }, hit);
        const body = svg('circle', { r: R * 0.8, fill: `url(#${gid})`, stroke: 'rgba(0,0,0,.55)', 'stroke-width': 1.2 }, hit);
        if (mat === 'metal') {
          for (let k = 1; k <= 5; k++) svg('circle', { r: (R * 0.8 * k) / 6, fill: 'none', stroke: '#fff', 'stroke-width': 0.6, opacity: 0.25 }, hit);
        } else {
          svg('circle', { r: R * 0.34, fill: o.cap, opacity: 0.9 }, hit);
        }
        const turn = svg('g', {}, hit);
        svg('line', { x1: 0, y1: -R * 0.3, x2: 0, y2: -(R - 4), stroke: mat === 'metal' ? '#1b1c1f' : '#f4f1e8', 'stroke-width': Math.max(2.5, R * 0.05), 'stroke-linecap': 'round' }, turn);
        const ringOn = led;
        function paint(angle) {
          turn.setAttribute('transform', `rotate(${angle.toFixed(3)})`);
          let near = null;
          if (heading) {
            near = segs.reduce((b, s) => (Math.abs(F().helpers.wrap180(s.a - angle)) < Math.abs(F().helpers.wrap180(b.a - angle)) ? s : b), segs[0]);
          }
          for (const s of segs) {
            const on = heading ? s === near : s.a <= angle + 1e-6;
            s.r.setAttribute('fill', on ? ringOn : panelDark ? '#3a3d44' : '#8d9097');
            s.r.setAttribute('opacity', on ? '1' : '0.7');
            s.r.style.filter = on ? `drop-shadow(0 0 2px ${ringOn})` : '';
          }
        }
        return { el, hit, body, paint };
      }

      function buildKnobs(ctx) {
        const { util, rng, size, spec } = ctx;
        const fam = F();
        const heading = spec.kind === 'heading';
        const panelDark = rng.bool(0.75);
        const mat = rng.pick(['metal', 'bakelite']);
        const led = rng.pick(LEDS);
        const cap = rng.pick(['#c83a2b', '#e7dfc9', '#2f6fd0', '#e0a21c']);
        // Gain: px of vertical travel per degree of knob travel (1 px stays well below tau, 2.7+ degrees).
        const gain = Number(rng.float(0.8, 1.4).toFixed(3));
        const hint = rng.bool(0.65);
        const R = rng.int(62, Math.max(62, Math.min(96, Math.floor((size.height - 250) / 2))));
        const half = R + 46;
        const Rd = Math.round(R * rng.float(0.6, 0.72));
        const halfD = Rd + 32;
        const gap = rng.int(14, 30);
        // Fit the decoy count to the width.
        const panelPad = 104;
        let nDecoys = rng.int(2, 5);
        while (nDecoys > 0 && 2 * half + nDecoys * (2 * halfD + gap) + panelPad > size.width - 40) nDecoys--;
        const at = rng.int(0, nDecoys);

        const card = util.el('div', 'rk-panel' + (panelDark ? '' : ' light'), ctx.stage);
        util.el('div', 'rk-cheek l', card);
        util.el('div', 'rk-cheek r', card);
        for (const [x, y] of [['32px', '7px'], ['32px', null], [null, '7px'], [null, null]]) {
          const s = util.el('div', 'rk-screw', card);
          if (x) s.style.left = x; else s.style.right = '32px';
          if (y) s.style.top = y; else s.style.bottom = '7px';
          s.style.setProperty('--r', rng.int(0, 170) + 'deg');
        }
        const strip = util.el('div', 'rk-strip', card);
        const brandBox = util.el('div', 'rk-brand', strip);
        const [brand, model] = rng.pick(heading ? NAV_BRANDS : BRANDS);
        util.el('b', '', brandBox, brand);
        util.el('span', '', brandBox, model);
        let lcd = null;
        if (spec.readout) lcd = util.el('div', 'rk-lcd ' + rng.pick(['', 'amber', 'blue']), strip);
        else util.el('div', 'rk-power', strip);

        const row = util.el('div', 'rk-row', card);
        row.style.gap = gap + 'px';
        const names = rng.sample(heading ? NAV_DECOYS : DECOYS.filter((d) => d.toLowerCase() !== spec.label.toLowerCase()), nDecoys);
        const unit = spec.unit.trim();
        const title = heading ? 'Heading' : spec.label + (unit ? ` (${unit})` : '');
        let main = null;
        const knobs = [];
        for (let i = 0; i <= nDecoys; i++) {
          const cell = util.el('div', 'rk-cell', row);
          if (i === at) {
            util.el('div', 'rk-name', cell, title);
            const ticks = [];
            const minorN = Math.round((spec.max - spec.min) / spec.minor);
            for (let k = 0; k <= minorN - (heading ? 1 : 0); k++) {
              const v = Number((spec.min + k * spec.minor).toFixed(4));
              const rel = (v - spec.min) / spec.major;
              const major = Math.abs(rel - Math.round(rel)) < 1e-6;
              const text = major ? (heading ? ({ 0: 'N', 90: 'E', 180: 'S', 270: 'W' }[v] ?? String(v)) : String(v)) : undefined;
              ticks.push({ a: fam.helpers.dialAngleFor(spec, v), major, text });
            }
            main = drawKnob(cell, { R, half, rng, mat, led, cap, heading, start: spec.start, sweep: spec.sweep, ticks, panelDark, segments: rng.int(21, 31) });
            main.el.dataset.role = 'dial';
            knobs.push(main);
          } else {
            const name = names[i < at ? i : i - 1];
            util.el('div', 'rk-name', cell, name);
            const ticks = [];
            for (let k = 0; k <= 10; k++) ticks.push({ a: -135 + k * 27, major: k % 5 === 0, text: k === 0 ? '0' : k === 10 ? '10' : undefined });
            const d = drawKnob(cell, { R: Rd, half: halfD, rng, mat, led, cap, heading: false, start: -135, sweep: 270, ticks, panelDark, segments: 15 });
            // Decoys turn locally (vertical drag) and are never part of the model.
            let a = rng.int(-135, 135);
            d.paint(a);
            let a0 = a;
            env.ui.track(d.hit, {
              start() { a0 = a; },
              move(p) {
                a = Math.max(-135, Math.min(135, a0 - p.dy / gain));
                d.paint(a);
              },
            }, 'xtra-knob');
            knobs.push(d);
          }
        }
        if (hint) util.el('div', 'rk-hint', card, rng.pick(['Drag up / down to turn', 'Click + drag vertically to adjust', 'Drag knobs up or down']));

        return { fam, heading, gain, led, card, lcd, main };
      }

      function renderKnobs(ctx) {
        const { util, spec } = ctx;
        const { fam, heading, gain, led, card, lcd, main } = buildKnobs(ctx);

        function paint() {
          const a = ctx.model.angle;
          main.paint(a);
          if (lcd) {
            const v = fam.helpers.dialValue(spec, a);
            lcd.textContent = '';
            util.el('small', '', lcd, heading ? 'HDG' : spec.label.slice(0, 4).toUpperCase());
            lcd.append(heading ? `${String(Math.round(v) % 360).padStart(3, '0')}°` : `${v.toFixed(spec.dec)}${spec.unit}`);
          }
        }
        const setAngle = (angle) => {
          if (angle === ctx.model.angle) return;
          ctx.update({ ...ctx.model, angle });
          paint();
        };
        const toAngle = (a) => (heading ? fam.helpers.mod360(a) : Math.max(spec.start, Math.min(spec.start + spec.sweep, a)));

        // Vertical drag: the knob turns by (pointer travel up) / gain degrees from its angle at press.
        let a0 = 0;
        env.ui.track(main.hit, {
          start() { a0 = ctx.model.angle; },
          move(p) { setAngle(toAngle(a0 - p.dy / gain)); },
          end() { env.log('value', { what: 'knob', angle: ctx.model.angle }); },
        }, 'knob');
        const svgEl = main.el;
        if (spec.wheel) {
          svgEl.addEventListener('wheel', (e) => {
            e.preventDefault();
            const n = Math.round(-e.deltaY / 100) || -Math.sign(e.deltaY);
            if (!n) return;
            ctx.log('wheel-step', { n });
            setAngle(fam.helpers.dialAngleFor(spec, fam.helpers.dialStep(spec, fam.helpers.dialValue(spec, ctx.model.angle), n)));
          }, { passive: false });
        }
        if (spec.keys) {
          svgEl.setAttribute('tabindex', '0');
          svgEl.addEventListener('pointerdown', () => svgEl.focus({ preventScroll: true }));
          svgEl.addEventListener('focus', () => {
            main.body.style.filter = `drop-shadow(0 0 5px ${led})`;
            if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true });
          });
          svgEl.addEventListener('blur', () => {
            main.body.style.filter = '';
            if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false });
          });
          svgEl.addEventListener('keydown', (e) => {
            const steps = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[e.key];
            const v = fam.helpers.dialValue(spec, ctx.model.angle);
            if (steps) setAngle(fam.helpers.dialAngleFor(spec, fam.helpers.dialStep(spec, v, steps)));
            else if (e.key === 'Home' && !heading) setAngle(fam.helpers.dialAngleFor(spec, spec.min));
            else if (e.key === 'End' && !heading) setAngle(fam.helpers.dialAngleFor(spec, spec.max));
            else return;
            e.preventDefault();
          });
        }

        paint();
        const center = () => util.center(main.body);
        view = {
          card,
          anchors: [card],
          sync() { paint(); },
          locate(t) {
            if (t.grip || t.knob) return center();
            if (t.dialAngle !== undefined) {
              // The press point moved up by the remaining knob travel times the gain, kept inside the viewport
              // (a clamped drag leaves the rest for the next step of the closed-loop plan).
              const c = center();
              const d = heading ? fam.helpers.wrap180(t.dialAngle - ctx.model.angle) : t.dialAngle - ctx.model.angle;
              const y = Math.max(6, Math.min(window.innerHeight - 6, c[1] - d * gain));
              return [c[0], y];
            }
            return null;
          },
        };
      }

      // Shift the card to a sampled spot inside the stage.
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

      env.widget({
        task: 'rotate-object',
        site: 'base',
        name: 'knobs',
        split: 'train',
        scenarios: ['dial'],

        render(ctx) {
          ensureStyle();
          ctxRef = ctx;
          renderKnobs(ctx);
          placeCard(view.card, ctx);
          return { anchors: view.anchors, sync: view.sync };
        },

        locate(t) {
          const p = view && view.locate(t);
          if (!p) throw new Error(`rotate-object/knobs cannot locate ${JSON.stringify(t)} (variant ${ctxRef && ctxRef.spec.scenario})`);
          return p;
        },
      });
    
    },
  }));
})();
