/*
     * reference / slider / nouislider: the vendored noUiSlider 15.8.1 (vendor/nouislider-15.8.1, MIT) as the control.
     *   Scenarios horizontal, vertical, log, range, multi, stops. Each slider is a noUiSlider on a 0..1000 position
     *   scale (the task's scale maps positions to values: linear, log or stop index), so the library's own
     *   pointer handling, hit areas and handle stacking are what the agent meets. Behaviour 'tap-drag' (a track
     *   press moves the nearest handle, flagged when the spec forbids it) or 'drag' (handles only; a track press
     *   does nothing and is flagged when forbidden). Per seed: value tooltips above the handles (no readout), or
     *   a readout column; library pips (tick labels; always for stops); 2 px / 8 px dense, classic 18 px / 34 px
     *   or touch-size handles; one of three looks (flat, bevel, pill).
     * The library is loaded by the kit through `uses` (the script path is relative to widgets/); its CSS is not
     * loaded: the structural rules are repeated below. Animations are off (animate: false, no transitions).
     * Keyboard episodes (spec.keys): the library's own key handling is off; a press focuses a handle, arrows /
     * PageUp / PageDown / Home / End step the single value with helpers.scale.keyApply, focus goes to model.focus.
     * Geometry: the .noUi-base box (value <-> position); locateThumb is the handle's center.
     */
(function () {
  'use strict';
  env.template('set-slider/_base-nouislider', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get KEYS() { return KEYS; },
        get POS() { return POS; },
        get center() { return center; },
        get sliders() { return sliders; }, set sliders(v) { sliders = v; },
        get ensureStyle() { return ensureStyle; },
        get placeIn() { return placeIn; },
        get makeNu() { return makeNu; },
        get tickValues() { return tickValues; },
        get renderNu() { return renderNu; },
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
      if (__has('placeIn@2')) placeIn = __parts['placeIn@2'](placeIn, __scope);
      if (__has('makeNu')) makeNu = __parts['makeNu'](makeNu, __scope);
      if (__has('tickValues@2')) tickValues = __parts['tickValues@2'](tickValues, __scope);
      if (__has('renderNu')) renderNu = __parts['renderNu'](renderNu, __scope);

      const CSS = __has('CSS@2') ? __parts['CSS@2'](undefined, __scope) : (env.templateLib('set-slider/_base-styles').nouislider);

      let sliders = __has('sliders@2') ? __parts['sliders@2'](undefined, __scope) : undefined;
      const KEYS = __has('KEYS@2') ? __parts['KEYS@2'](undefined, __scope) : (new Set(['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']));
      const POS = __has('POS') ? __parts['POS'](undefined, __scope) : (1000);

      function ensureStyle() { return env.templateLib('set-slider/_base-nouislider-units').ensureStyle(__scope); }

      function placeIn(ctx, el, rng, pad = 12) { return env.templateLib('set-slider/_base-nouislider-units').placeIn(__scope, ctx, el, rng, pad); }

      const center = __has('center@2') ? __parts['center@2'](undefined, __scope) : { center: (el) => {
        const r = el.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      } }.center;

      function makeNu(ctx, parent, index, s, g) { return env.templateLib('set-slider/_base-nouislider-units').makeNu(__scope, ctx, parent, index, s, g); }

      function tickValues(s, S) { return env.templateLib('set-slider/_base-nouislider-units').tickValues(__scope, s, S); }

      function renderNu(ctx) { return env.templateLib('set-slider/_base-nouislider-units').renderNu(__scope, ctx); }

      env.widget({
        task: 'set-slider',
        site: 'base',
        name: 'nouislider',
        split: 'train',
        scenarios: ['horizontal', 'vertical', 'log', 'range', 'multi', 'stops'],
        uses: [['../vendor/nouislider-15.8.1/nouislider']],

        render(ctx) {
          ensureStyle();
          sliders = renderNu(ctx);
          return {
            anchors: sliders.map((sl) => sl.anchor),
            sync(m) { sliders.forEach((sl, i) => sl.set(m.values[i])); },
          };
        },

        locate(t) {
          const sl = sliders[t.slider];
          if (!sl) throw new Error(`set-slider/nouislider cannot locate ${JSON.stringify(t)}`);
          if (t.value !== undefined) return sl.locate(t.value, t.thumb);
          return sl.locateThumb(t.thumb);
        },
      });

    },
  }), { uses: ['set-slider/_base-styles', 'set-slider/_base-nouislider-units'] });
})();
