// rotate-object/_base-lines: reference lines widget registration, loaded by rotate-object/base.
// Retains the original unit scopes, part keys and order of setup / RNG draws.
// buildLines(ctx) builds the controls; its scope getter and part hook allow designs to wrap it.
(function () {
  'use strict';
  env.template('rotate-object/_base-lines', () => ({
    register({ env, scriptOf, __parts, __has, setScope }) {
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get R2D() { return R2D; },
        get F() { return F; },
        get polar() { return polar; },
        get SUBS() { return SUBS; },
        get MINI() { return MINI; },
        get view() { return view; }, set view(v) { view = v; },
        get ctxRef() { return ctxRef; }, set ctxRef(v) { ctxRef = v; },
        get ensureStyle() { return ensureStyle; },
        get sv() { return sv; },
        get arcPath() { return arcPath; },
        get buildLines() { return buildLines; },
        get renderLines() { return renderLines; },
        get placeCard() { return placeCard; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+2.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@2')) ensureStyle = __parts['ensureStyle@2'](ensureStyle, __scope);
      if (__has('sv@2')) sv = __parts['sv@2'](sv, __scope);
      if (__has('arcPath@2')) arcPath = __parts['arcPath@2'](arcPath, __scope);
      if (__has('buildLines')) buildLines = __parts['buildLines'](buildLines, __scope);
      if (__has('renderLines')) renderLines = __parts['renderLines'](renderLines, __scope);
      if (__has('placeCard@2')) placeCard = __parts['placeCard@2'](placeCard, __scope);

      const CSS = __has('CSS@2') ? __parts['CSS@2'](undefined, __scope) : (`
      .rl-card {
        position: relative; display: flex; align-items: center; gap: 44px; padding: 34px 48px 30px;
        border: 1px solid var(--line); border-radius: 18px; background: var(--panel);
        font-family: Inter, "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;
      }
      .rl-main { display: flex; flex-direction: column; align-items: center; gap: 18px; }
      .rl-head { align-self: stretch; display: flex; flex-direction: column; gap: 3px; }
      .rl-title { font-size: 17px; font-weight: 600; color: var(--fg); letter-spacing: -.01em; }
      .rl-sub { font-size: 13px; color: var(--muted); }
      .rl-svg { display: block; overflow: visible; touch-action: none; outline: none; cursor: pointer; }
      .rl-svg text { font-family: Inter, "Segoe UI", system-ui, sans-serif; }
      .rl-foot { font-size: 12px; color: var(--muted); letter-spacing: .02em; }
      .rl-side { display: flex; flex-direction: column; gap: 22px; pointer-events: none; }
      .rl-mini { display: flex; align-items: center; gap: 12px; }
      .rl-mini b { display: block; font-size: 13px; font-weight: 600; color: var(--fg); }
      .rl-mini span { font-size: 12px; color: var(--muted); }
      `);

      let view = __has('view@2') ? __parts['view@2'](undefined, __scope) : undefined;
      let ctxRef = __has('ctxRef@2') ? __parts['ctxRef@2'](undefined, __scope) : undefined;
      const R2D = __has('R2D@2') ? __parts['R2D@2'](undefined, __scope) : (180 / Math.PI);
      const F = __has('F@2') ? __parts['F@2'](undefined, __scope) : { F: () => env.taskDef }.F;
      const polar = __has('polar@2') ? __parts['polar@2'](undefined, __scope) : { polar: (c, r, a) => [c[0] + r * Math.sin(a / R2D), c[1] - r * Math.cos(a / R2D)] }.polar;

      function ensureStyle() {
        if (document.getElementById('rl-style')) return;
        const s = document.createElement('style');
        s.id = 'rl-style';
        s.textContent = CSS;
        document.head.append(s);
      }

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

      function arcPath(r, a0, a1) {
        const p0 = polar([0, 0], r, a0);
        const p1 = polar([0, 0], r, a1);
        const large = a1 - a0 > 180 ? 1 : 0;
        return `M${p0[0].toFixed(2)},${p0[1].toFixed(2)} A${r},${r} 0 ${large} 1 ${p1[0].toFixed(2)},${p1[1].toFixed(2)}`;
      }

      const SUBS = __has('SUBS') ? __parts['SUBS'](undefined, __scope) : (['Tap the ring or drag the dot', 'Click anywhere on the ring to set it', 'Drag around the ring', 'Set the level']);
      const MINI = __has('MINI') ? __parts['MINI'](undefined, __scope) : ([['Bass', '%'], ['Treble', '%'], ['Balance', ''], ['Brightness', '%'], ['Contrast', '%'], ['Fan', '%'], ['Humidity', '%']]);

      function buildLines(ctx) {
        const { util, rng, size, spec } = ctx;
        const fam = F();
        const heading = spec.kind === 'heading';
        const R = rng.int(Math.min(110, Math.floor((size.height - 280) / 2)), Math.min(150, Math.floor((size.height - 260) / 2)));
        const half = R + 44;
        const W = 2 * half;
        const thin = rng.pick([1, 1.5, 2]);
        const unit = spec.unit.trim();
        const showMini = rng.bool(0.5) && size.width >= W + 480;

        const card = util.el('div', 'rl-card', ctx.stage);
        const main = util.el('div', 'rl-main', card);
        const head = util.el('div', 'rl-head', main);
        util.el('div', 'rl-title', head, heading ? 'Heading' : spec.label);
        util.el('div', 'rl-sub', head, rng.pick(SUBS));
        const svg = sv('svg', { class: 'rl-svg', width: W, height: W, viewBox: `${-half} ${-half} ${W} ${W}` }, main);
        svg.dataset.role = 'dial';

        // Thin track over the sweep, small major ticks with labels, value arc and a dot.
        if (heading) sv('circle', { r: R, fill: 'none', stroke: 'var(--line)', 'stroke-width': thin }, svg);
        else sv('path', { d: arcPath(R, spec.start, spec.start + spec.sweep), fill: 'none', stroke: 'var(--line)', 'stroke-width': thin, 'stroke-linecap': 'round' }, svg);
        const majorN = Math.round((spec.max - spec.min) / spec.major);
        for (let k = 0; k <= majorN - (heading ? 1 : 0); k++) {
          const v = Number((spec.min + k * spec.major).toFixed(4));
          const a = fam.helpers.dialAngleFor(spec, v);
          const [x0, y0] = polar([0, 0], R + 7, a);
          const [x1, y1] = polar([0, 0], R + 12, a);
          sv('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: 'var(--muted)', 'stroke-width': 1 }, svg);
          const [tx, ty] = polar([0, 0], R + 25, a);
          const t = sv('text', { x: tx.toFixed(2), y: ty.toFixed(2), 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: 'var(--muted)' }, svg);
          t.style.fontSize = '11px';
          t.textContent = heading ? ({ 0: 'N', 90: 'E', 180: 'S', 270: 'W' }[v] ?? String(v)) : String(v);
        }
        const arc = heading ? null : sv('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': thin + 1.5, 'stroke-linecap': 'round' }, svg);
        const needle = heading && rng.bool(0.5) ? sv('line', { x1: 0, y1: 0, x2: 0, y2: -(R - 14), stroke: 'var(--accent)', 'stroke-width': 1, opacity: 0.5 }, svg) : null;
        const dot = sv('circle', { r: rng.pick([6, 7, 8]), fill: 'var(--accent)', stroke: 'var(--panel)', 'stroke-width': 3 }, svg);
        dot.dataset.role = 'grip';
        let big = null;
        if (spec.readout) {
          big = sv('text', { x: 0, y: -4, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: 'var(--fg)' }, svg);
          Object.assign(big.style, { fontSize: Math.round(R * 0.44) + 'px', fontWeight: '300', fontVariantNumeric: 'tabular-nums', letterSpacing: '-.02em' });
          const u = sv('text', { x: 0, y: Math.round(R * 0.3), 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: 'var(--muted)' }, svg);
          u.style.fontSize = '13px';
          u.textContent = heading ? 'degrees' : unit || rng.pick(['level', 'value']);
        } else {
          const c = sv('text', { x: 0, y: 0, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: 'var(--muted)' }, svg);
          c.style.fontSize = '14px';
          c.textContent = heading ? 'Heading' : spec.label + (unit ? ` · ${unit}` : '');
        }
        util.el('div', 'rl-foot', main, heading ? '0° – 359°' : `${spec.min}${spec.unit} – ${spec.max}${spec.unit}`);

        if (showMini) {
          const side = util.el('div', 'rl-side', card);
          for (const [name, u] of rng.sample(MINI, rng.int(2, 3))) {
            const row = util.el('div', 'rl-mini', side);
            const m = sv('svg', { width: 52, height: 52, viewBox: '-26 -26 52 52' }, row);
            const f = rng.int(5, 95) / 100;
            sv('path', { d: arcPath(21, -135, 135), fill: 'none', stroke: 'var(--line)', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, m);
            sv('path', { d: arcPath(21, -135, -135 + 270 * f), fill: 'none', stroke: 'var(--muted)', 'stroke-width': 2, 'stroke-linecap': 'round' }, m);
            const txt = util.el('div', '', row);
            util.el('b', '', txt, name);
            util.el('span', '', txt, u === '%' ? `${Math.round(f * 100)}%` : `${Math.round(f * 20 - 10)}`);
          }
        }

        return { fam, heading, R, card, svg, arc, needle, dot, big };
      }

      function renderLines(ctx) {
        const { util, spec } = ctx;
        const { fam, heading, R, card, svg, arc, needle, dot, big } = buildLines(ctx);

        function paint() {
          const a = ctx.model.angle;
          const [x, y] = polar([0, 0], R, a);
          dot.setAttribute('cx', x.toFixed(2));
          dot.setAttribute('cy', y.toFixed(2));
          if (needle) needle.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          if (arc) {
            if (a - spec.start > 0.05) arc.setAttribute('d', arcPath(R, spec.start, a));
            else arc.removeAttribute('d');
          }
          if (big) {
            const v = fam.helpers.dialValue(spec, a);
            big.textContent = heading ? `${Math.round(v) % 360}°` : v.toFixed(spec.dec);
          }
        }
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
          svg.addEventListener('pointerdown', () => svg.focus({ preventScroll: true }));
          svg.addEventListener('focus', () => {
            dot.setAttribute('r', String(Number(dot.getAttribute('r')) + 2));
            if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true });
          });
          svg.addEventListener('blur', () => {
            dot.setAttribute('r', String(Number(dot.getAttribute('r')) - 2));
            if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false });
          });
          svg.addEventListener('keydown', (e) => {
            const steps = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[e.key];
            const v = fam.helpers.dialValue(spec, ctx.model.angle);
            if (steps) setValue(fam.helpers.dialStep(spec, v, steps));
            else if (e.key === 'Home' && !heading) setValue(spec.min);
            else if (e.key === 'End' && !heading) setValue(spec.max);
            else return;
            e.preventDefault();
          });
        }
        // A press anywhere on the ring sets the value to the pointer's angle, then the value follows the pointer.
        const dial = env.ui.dial(svg, {
          label: 'ring',
          center: () => util.center(svg),
          radius: R,
          band: [R - 20, R + 20],
          follow: 'pointer',
          angle: ctx.model.angle,
          start: spec.start,
          sweep: spec.sweep,
          min: spec.min,
          max: spec.max,
          constrain: (a) => fam.helpers.clampDial(spec, a),
          onInput(angle) {
            ctx.update({ ...ctx.model, angle });
            paint();
          },
        });

        paint();
        view = {
          card,
          anchors: [svg],
          sync(m) {
            dial.set(m.angle);
            paint();
          },
          locate(t) {
            if (t.grip) return dial.locateGrip();
            if (t.knob) return util.center(svg); // inside the ring: focuses / wheels without setting a value
            if (t.dialAngle !== undefined) return dial.locate(t.dialAngle);
            return null;
          },
        };
      }

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
        name: 'lines',
        split: 'train',
        scenarios: ['dial'],

        render(ctx) {
          ensureStyle();
          ctxRef = ctx;
          renderLines(ctx);
          placeCard(view.card, ctx);
          return { anchors: view.anchors, sync: view.sync };
        },

        locate(t) {
          const p = view && view.locate(t);
          if (!p) throw new Error(`rotate-object/lines cannot locate ${JSON.stringify(t)} (variant ${ctxRef && ctxRef.spec.scenario})`);
          return p;
        },
      });
    
    },
  }));
})();
