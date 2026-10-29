/*
     * reference / slider / classic: the legacy slider page plus app-like layouts, all scenarios.
     *   plain     (horizontal, vertical, log, range, multi, stops, match) round thumbs on a rail with an accent
     *             fill, optional tick labels and value readout (per seed; always when the goal is relative).
     *             Horizontal sliders sit in a label | track | readout grid; vertical sliders stand side by side.
     *             Stepped sliders label every stop. match adds a presets card above the sliders.
     *   native    (per seed, single-thumb horizontal linear/log sliders) a styled <input type=range>: the
     *             browser's own thumb and hit area; the track click always jumps (flagged when forbidden).
     *   media     a video player: full-width seek bar with elapsed / total time (m:ss), play button, and a small
     *             volume slider with a percentage.
     *   player    media plus icon toggles: captions (CC; a caption line shows on the video) and mute (a speaker
     *             that crosses out; dragging the volume unmutes), decoy settings / full-screen buttons. The plan
     *             clicks them via { toggle: 'captions' | 'mute' }.
     *   mixer     a volume mixer: 4-9 vertical channel strips (name, value, fader, level meter).
     *   rating    a star rating card (title, item, one row of 5 or 10 stars per rated aspect with its value as
     *             "3.5 / 5"). One press on a star sets the value (left half of a star = the half value when
     *             spec.stars.half); moving with the button down scrubs; the plan clicks { slider, thumb, value }.
     * Levels (spec.level easy | medium): thumbs and rails of the plain layouts are enlarged, stars grow.
     * Density (plain layouts, per seed): normal, dense (2 px rails, 8 px thumbs, small type, square corners) or touch
     * (28-40 px thumbs, large type).
     * The card is placed at a sampled position inside the stage (never under the site's floating end button).
     * Other base widgets: `settings` (a preferences pane: label far left, value far right, the slider between,
     * inert switch / select rows around it; ios / material / windows looks; scenarios horizontal, log, range, multi,
     * stops), `arc`, and `nouislider` (separate scopes, vendored library).
     * Keyboard episodes (spec.keys): tracks are focusable; a press focuses them; arrows / PageUp / PageDown /
     * Home / End step the value with helpers.scale.keyApply; focus is mirrored into model.focus.
     * Mechanics: env.ui.slider (track clicks jump the nearest thumb, flagged when the spec forbids them).
     */
(function () {
  'use strict';
  env.template('set-slider/_base-classic', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get KEYS() { return KEYS; },
        get center() { return center; },
        get STAR_PATH() { return STAR_PATH; },
        get SPEAKER() { return SPEAKER; },
        get WAVES() { return WAVES; },
        get CROSS() { return CROSS; },
        get CAPTION_LINES() { return CAPTION_LINES; },
        get sliders() { return sliders; }, set sliders(v) { sliders = v; },
        get ensureStyle() { return ensureStyle; },
        get placeIn() { return placeIn; },
        get keyboard() { return keyboard; },
        get tickValues() { return tickValues; },
        get commit() { return commit; },
        get makeSlider() { return makeSlider; },
        get makeNative() { return makeNative; },
        get renderPlain() { return renderPlain; },
        get renderRating() { return renderRating; },
        get renderMedia() { return renderMedia; },
        get renderMixer() { return renderMixer; },
        get renderSettings() { return renderSettings; },
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
      if (__has('placeIn@0')) placeIn = __parts['placeIn@0'](placeIn, __scope);
      if (__has('keyboard')) keyboard = __parts['keyboard'](keyboard, __scope);
      if (__has('tickValues@0')) tickValues = __parts['tickValues@0'](tickValues, __scope);
      if (__has('commit')) commit = __parts['commit'](commit, __scope);
      if (__has('makeSlider')) makeSlider = __parts['makeSlider'](makeSlider, __scope);
      if (__has('makeNative')) makeNative = __parts['makeNative'](makeNative, __scope);
      if (__has('renderPlain')) renderPlain = __parts['renderPlain'](renderPlain, __scope);
      if (__has('renderRating')) renderRating = __parts['renderRating'](renderRating, __scope);
      if (__has('renderMedia')) renderMedia = __parts['renderMedia'](renderMedia, __scope);
      if (__has('renderMixer')) renderMixer = __parts['renderMixer'](renderMixer, __scope);
      if (__has('renderSettings')) renderSettings = __parts['renderSettings'](renderSettings, __scope);

      const CSS = __has('CSS@0') ? __parts['CSS@0'](undefined, __scope) : (env.templateLib('set-slider/_base-styles').classic);

      let sliders = __has('sliders@0') ? __parts['sliders@0'](undefined, __scope) : undefined;
      const KEYS = __has('KEYS@0') ? __parts['KEYS@0'](undefined, __scope) : (new Set(['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']));

      const center = __has('center@0') ? __parts['center@0'](undefined, __scope) : { center: (el) => {
        const r = el.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      } }.center;

      function ensureStyle() { return env.templateLib('set-slider/_base-classic-units').ensureStyle(__scope); }

      // Place an absolutely positioned element at a sampled spot inside the stage, away from fixed controls
      // of the site (a floating end button) that would cover it.
      function placeIn(ctx, el, rng, pad = 12) { return env.templateLib('set-slider/_base-classic-units').placeIn(__scope, ctx, el, rng, pad); }

      // Keyboard support for one slider: focusable track, keyApply steps, focus mirrored into the model.
      function keyboard(ctx, el, index, s, get, set) { return env.templateLib('set-slider/_base-classic-units').keyboard(__scope, ctx, el, index, s, get, set); }

      // Intermediate tick values; fewer ticks when labels would collide.
      function tickValues(s, S, n, L, vertical) { return env.templateLib('set-slider/_base-classic-units').tickValues(__scope, s, S, n, L, vertical); }

      // Commit slider index's values to the model (keeping the other sliders and the focus). patch: extra
      // model fields the change implies (player: a volume change unmutes).
      function commit(ctx, index, vals, patch) { return env.templateLib('set-slider/_base-classic-units').commit(__scope, ctx, index, vals, patch); }

      // One custom slider widget bound to model.values[index]. g: { vertical, length, thumb, rail, ticks,
      // tickCount, readout, cls, readoutEl, labelEl (false: no label), fmt, patch }.
      function makeSlider(ctx, parent, index, s, g) { return env.templateLib('set-slider/_base-classic-units').makeSlider(__scope, ctx, parent, index, s, g); }

      // A native <input type=range> bound to model.values[index] (single thumb, horizontal). The thumb's
      // center travels exactly L px: the input is L + thumb wide.
      function makeNative(ctx, parent, index, s, g) { return env.templateLib('set-slider/_base-classic-units').makeNative(__scope, ctx, parent, index, s, g); }

      function renderPlain(ctx, look) { return env.templateLib('set-slider/_base-classic-units').renderPlain(__scope, ctx, look); }


      // Star rating card: one row of stars per rated aspect. Each star is a box (size px) with a grey and a gold
      // layer; the gold one is clipped to the filled part (full, half or none).
      const STAR_PATH = __has('STAR_PATH') ? __parts['STAR_PATH'](undefined, __scope) : ('M12 2.2l2.95 6.2 6.8.9-5 4.7 1.25 6.7L12 17.4l-6 3.3 1.25-6.7-5-4.7 6.8-.9z');
      function renderRating(ctx, look) { return env.templateLib('set-slider/_base-classic-units').renderRating(__scope, ctx, look); }

      const SPEAKER = __has('SPEAKER') ? __parts['SPEAKER'](undefined, __scope) : ('<path d="M1 5.5h3.5L9 1.5v13L4.5 10.5H1z" fill="currentColor"/>');
      const WAVES = __has('WAVES') ? __parts['WAVES'](undefined, __scope) : ('<path d="M12 4.5c1.6 1.8 1.6 5.2 0 7M14.5 2.5c2.7 3 2.7 8 0 11" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>');
      const CROSS = __has('CROSS') ? __parts['CROSS'](undefined, __scope) : ('<path d="M11.5 5l5 6M16.5 5l-5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>');
      const CAPTION_LINES = __has('CAPTION_LINES') ? __parts['CAPTION_LINES'](undefined, __scope) : (['So the first thing we want to do is', 'and that is really all there is to it.', '[upbeat music]',
        'Let me show you what I mean here.', 'which brings us to the next part.', '[laughter]', 'Okay, let us take a closer look.',
        'You can see it right over here.', 'and this is where it gets interesting.', '[applause]']);

      function renderMedia(ctx, look) { return env.templateLib('set-slider/_base-classic-units').renderMedia(__scope, ctx, look); }

      function renderMixer(ctx, look) { return env.templateLib('set-slider/_base-classic-units').renderMixer(__scope, ctx, look); }

      env.widget({
        task: 'set-slider',
        site: 'base',
        name: 'classic',
        split: 'train',
        scenarios: ['horizontal', 'vertical', 'log', 'range', 'multi', 'stops', 'media', 'mixer', 'match', 'player', 'rating'],

        render(ctx) { return env.templateLib('set-slider/_base-classic-units').renderClassic(__scope, ctx); },

        locate(t) {
          if (t.toggle && sliders.toggles && sliders.toggles[t.toggle]) return center(sliders.toggles[t.toggle]);
          const sl = sliders[t.slider];
          if (!sl) throw new Error(`set-slider/classic cannot locate ${JSON.stringify(t)}`);
          if (t.value !== undefined) return sl.locate(t.value, t.thumb);
          return sl.locateThumb(t.thumb);
        },
      });

      // ------------------------------------------------------------------ settings list
      // A preferences pane: one row per setting, label far left, value text far right, the slider between.
      // Slider rows are mixed with inert decoy rows (switches that flip, native selects) from env.content.SETTINGS.
      // Sliders that need a longer track than the row leaves (log: 440 px) get a stacked row: label and value on
      // one line, the full-width slider below.
      function renderSettings(ctx) { return env.templateLib('set-slider/_base-classic-units').renderSettings(__scope, ctx); }

      env.widget({
        task: 'set-slider',
        site: 'base',
        name: 'settings',
        split: 'train',
        scenarios: ['horizontal', 'log', 'range', 'multi', 'stops'],

        render(ctx) {
          ensureStyle();
          sliders = renderSettings(ctx);
          return {
            anchors: sliders.map((sl) => sl.anchor),
            sync(m) { sliders.forEach((sl, i) => sl.set(m.values[i])); },
          };
        },

        locate(t) {
          const sl = sliders[t.slider];
          if (!sl) throw new Error(`set-slider/settings cannot locate ${JSON.stringify(t)}`);
          if (t.value !== undefined) return sl.locate(t.value, t.thumb);
          return sl.locateThumb(t.thumb);
        },
      });

    },
  }), { uses: ['set-slider/_base-styles', 'set-slider/_base-classic-units'] });
})();
