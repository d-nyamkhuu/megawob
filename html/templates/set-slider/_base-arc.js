/*
     * reference / slider / arc: curved tracks, to show that env.ui.slider does not care about shape.
     *   rings   (spec.vertical false) every slider of the page is one ring of a single radial gauge: concentric
     *           240-270 degree arcs, clockwise from lower left, each in its own color with its name written
     *           along the ring, min/max at the two ends of the gap and (log, or per seed) tick labels along
     *           the ring. The hub lists each ring's color, name and (per seed, always for log or relative goals)
     *           value. The geometry is the ring's SVG <path> itself (path mode: nearest point on the path).
     *   faders  (spec.vertical true) side-by-side curved faders: ")"-shaped arcs of 90-150 degrees from the
     *           bottom (min) to the top (max), label above, optional readout below. The geometry is a widget
     *           callback that returns an exact circular arc (geometry() -> { length, point, project }).
     * Thumbs are capsules, diamonds or donuts (per seed) turned to the track's normal. Range sliders get
     * two thumbs on one arc. Track clicks jump the nearest thumb (flagged when the spec forbids them).
     * Keyboard episodes: each arc's group is focusable (a press focuses it) and steps with keyApply.
     */
(function () {
  'use strict';
  env.template('set-slider/_base-arc', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get PALETTE() { return PALETTE; },
        get D2R() { return D2R; },
        get R2D() { return R2D; },
        get KEYS() { return KEYS; },
        get polar() { return polar; },
        get pt() { return pt; },
        get wrap180() { return wrap180; },
        get sliders() { return sliders; }, set sliders(v) { sliders = v; },
        get ensureStyle() { return ensureStyle; },
        get placeIn() { return placeIn; },
        get sv() { return sv; },
        get arcD() { return arcD; },
        get thumbShape() { return thumbShape; },
        get ticks() { return ticks; },
        get makeArc() { return makeArc; },
        get arcText() { return arcText; },
        get renderRings() { return renderRings; },
        get renderFaders() { return renderFaders; },
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
      if (__has('placeIn@1')) placeIn = __parts['placeIn@1'](placeIn, __scope);
      if (__has('sv')) sv = __parts['sv'](sv, __scope);
      if (__has('arcD')) arcD = __parts['arcD'](arcD, __scope);
      if (__has('thumbShape')) thumbShape = __parts['thumbShape'](thumbShape, __scope);
      if (__has('ticks')) ticks = __parts['ticks'](ticks, __scope);
      if (__has('makeArc')) makeArc = __parts['makeArc'](makeArc, __scope);
      if (__has('arcText')) arcText = __parts['arcText'](arcText, __scope);
      if (__has('renderRings')) renderRings = __parts['renderRings'](renderRings, __scope);
      if (__has('renderFaders')) renderFaders = __parts['renderFaders'](renderFaders, __scope);

      const CSS = __has('CSS@1') ? __parts['CSS@1'](undefined, __scope) : (env.templateLib('set-slider/_base-styles').arc);

      const PALETTE = __has('PALETTE') ? __parts['PALETTE'](undefined, __scope) : (['#e8590c', '#1c7ed6', '#2f9e44', '#ae3ec9', '#e03131', '#0c8599', '#f08c00']);
      const D2R = __has('D2R') ? __parts['D2R'](undefined, __scope) : (Math.PI / 180);
      const R2D = __has('R2D') ? __parts['R2D'](undefined, __scope) : (180 / Math.PI);
      const KEYS = __has('KEYS@1') ? __parts['KEYS@1'](undefined, __scope) : (new Set(['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']));
      const polar = __has('polar') ? __parts['polar'](undefined, __scope) : { polar: (c, r, a) => [c[0] + r * Math.sin(a * D2R), c[1] - r * Math.cos(a * D2R)] }.polar;
      const pt = __has('pt') ? __parts['pt'](undefined, __scope) : { pt: (p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}` }.pt;
      const wrap180 = __has('wrap180') ? __parts['wrap180'](undefined, __scope) : { wrap180: (a) => ((((a + 180) % 360) + 360) % 360) - 180 }.wrap180;
      let sliders = __has('sliders@1') ? __parts['sliders@1'](undefined, __scope) : undefined;

      function ensureStyle() { return env.templateLib('set-slider/_base-arc-units').ensureStyle(__scope); }

      function placeIn(ctx, el, rng, pad = 12) { return env.templateLib('set-slider/_base-arc-units').placeIn(__scope, ctx, el, rng, pad); }

      // util.svg, but paint properties with CSS variables go through style (attributes ignore var()).
      function sv(tag, attrs, parent) { return env.templateLib('set-slider/_base-arc-units').sv(__scope, tag, attrs, parent); }

      // Circular arc from compass angle a to b (dir +1 clockwise, -1 counterclockwise).
      function arcD(c, r, a, b, dir) { return env.templateLib('set-slider/_base-arc-units').arcD(__scope, c, r, a, b, dir); }

      function thumbShape(g, shape, w, color) { return env.templateLib('set-slider/_base-arc-units').thumbShape(__scope, g, shape, w, color); }

      // Tick values: marks (tenths, or decades for log scales) and labeled values (quarters, or decades).
      function ticks(s, S) { return env.templateLib('set-slider/_base-arc-units').ticks(__scope, s, S); }

      /*
       * One arc slider. arc = { c (svg user coords), r, a0, sweep, dir } where compass angle at fraction f is
       * a0 + dir * f * sweep. mode 'path' hands the hit path to env.ui.slider; 'arc' supplies the exact circle.
       */
      function makeArc(ctx, svg, index, s, arc, look, color, hooks) { return env.templateLib('set-slider/_base-arc-units').makeArc(__scope, ctx, svg, index, s, arc, look, color, hooks); }

      // Text along a circle of radius r starting at compass angle a (clockwise), as a textPath.
      function arcText(svg, defs, id, c, r, a, sweep, cls, text, offset, anchor) { return env.templateLib('set-slider/_base-arc-units').arcText(__scope, svg, defs, id, c, r, a, sweep, cls, text, offset, anchor); }

      function renderRings(ctx, look, colors) { return env.templateLib('set-slider/_base-arc-units').renderRings(__scope, ctx, look, colors); }

      function renderFaders(ctx, look, colors) { return env.templateLib('set-slider/_base-arc-units').renderFaders(__scope, ctx, look, colors); }

      env.widget({
        task: 'set-slider',
        site: 'base',
        name: 'arc',
        split: 'train',
        scenarios: ['horizontal', 'vertical', 'log', 'range', 'multi'],

        render(ctx) {
          ensureStyle();
          const { rng, spec } = ctx;
          const look = {
            w: rng.int(8, 13),
            shape: rng.pick(['capsule', 'diamond', 'donut']),
            ticks: rng.bool(0.6),
            readout: rng.bool(0.6) || spec.showValue,
          };
          look.hitW = 36;
          const colors = rng.shuffle(PALETTE);
          sliders = spec.vertical ? renderFaders(ctx, look, colors) : renderRings(ctx, look, colors);
          return {
            anchors: [...new Set(sliders.map((sl) => sl.anchor))],
            sync: (m) => sliders.forEach((sl, i) => sl.set(m.values[i])),
          };
        },

        locate(t) {
          const sl = sliders[t.slider];
          if (!sl) throw new Error(`set-slider/arc cannot locate ${JSON.stringify(t)}`);
          if (t.value !== undefined) return sl.ctl.locate(t.value, t.thumb);
          return sl.ctl.locateThumb(t.thumb);
        },
      });

    },
  }), { uses: ['set-slider/_base-styles', 'set-slider/_base-arc-units'] });
})();
