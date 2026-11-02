/*
 * set-slider: drag slider thumbs to target values. Port of legacy/slider.html, plus multi, stepped, media, mixer
 * and preset-matching scenarios. MiniWoB counterparts: use-slider, use-slider-2.
 *
 * Scenarios
 *   horizontal  one scored linear slider (optionally with an unscored distractor slider)
 *   vertical    the same, vertical tracks side by side
 *   log         one scored log-scale slider (distractor, if any, is linear)
 *   range       one scored two-thumb slider: set both ends of a range
 *   multi       2-3 separately labeled scored sliders that must all be set (use-slider-2); no distractor
 *   stops       a stepped slider with labelled stops (Low / Medium / High ...); set it to the named stop
 *   media       a video player: seek bar in mm:ss (or the player's volume); one of the two is scored
 *   mixer       a volume mixer of 4-6 vertical channel faders; 1-3 named channels are scored
 *   match       1-3 sliders and a presets card listing values per named preset; apply the named preset
 *               (the target values are only on the page, never in the instruction)
 *   player      a fuller video player: seek bar, volume slider and two icon toggles (mute, captions);
 *               1-2 sub-goals among seek / volume / mute / unmute / captions on / captions off ("Mute the
 *               video", "Turn captions on and set the position to 1:20"). media is left as it was.
 *   rating      a star rating (5 stars, ood 10) for 1-3 rows (Overall, Food, Service ...); 1-3 rows are scored
 *               ("rate the food 3.5 stars"). Whole stars or half stars (step 0.5). One click on a star sets the
 *               value (the left half of a star gives the half value when half stars are on); dragging over the
 *               stars scrubs. Exact (tau = half a step), no keyboard, no track-click rule. A new scenario is
 *               mixed in by its own fork (rng.fork('widget')), so the other scenarios' seeds are unchanged.
 *
 * Goal kinds (spec.goal.kind) for horizontal / vertical / log (and media volume):
 *   abs        "Set Volume to 42"
 *   extreme    min or max ("Mute the volume", "Set Brightness to its maximum")
 *   relative   from the start value ("increase by 20", "halve it", "double it"); the slider's start value is
 *              fixed by the spec (slider.start) and the widget always shows a readout. Only with start mode
 *              off (other start modes fall back to abs).
 *   fraction   linear only: halfway / a quarter / three quarters of the range
 *
 * spec   { scenario, vertical, allowTrackClick, sliders[], scored[], goal, norm, showValue, keys, keyRoute,
 *          presets?, preset?, title?, toggles?, goals?, isplit, csplit, startMode, ood }
 *          sliders[i] = { label, aliases[], kind, unit, min, max, step, log, time, stops (labels | null),
 *                         target: [v] | [lo, hi] | null, tau (in the slider's units, ln-ratio if log),
 *                         rel (log only), kstep (keyboard step, fraction of the track), start? (relative) }
 *          target null = unscored distractor. scored = indices of sliders with a target.
 *          norm: error is max over scored sliders of (error / that slider's tau), tau = 1 (multi, mixer, match).
 *          keys: the episode allows the keyboard (focus a thumb, arrows / PageUp / PageDown / Home / End);
 *          keyRoute: the oracle uses keys instead of drags.
 *          presets (match): [{ name, values: [v per slider] }], preset = index of the goal preset.
 *          player: sliders [seek, volume] as in media; toggles { muted, captions }: true / false = the goal
 *          state, null = unscored; goals = the sub-goal names in instruction order ('seek', 'volume',
 *          'mute', 'unmute', 'captions-on', 'captions-off'). A mute goal never comes with a volume goal.
 * model  { values: [[v, ...] per slider], focus: index of the focused slider or null (unscored; mirrored by
 *          the widget from focus/blur), muted?, captions? (player only) }
 *          One value per thumb; range sliders keep values[0] <= values[1]. player: dragging the volume
 *          slider unmutes (widgets set muted false), as real players do.
 *
 * levels (opts.level easy | medium; normal is unchanged): tolerance x2 / x1.5 on continuous sliders (rounded to a
 *        step multiple; log: the percentage), no unscored distractor (easy), multi 2 (easy) sliders, mixer 4 / 5
 *        channels with 1 / 2 scored, match 2 sliders and 2 presets (easy), stops with at most 3 (easy) / 4
 *        (medium) stops, player a single sub-goal (easy), rating whole stars (easy) / mostly whole stars and at
 *        most 2 rows (medium) in one scored row (easy). spec.level records it; the classic widget enlarges the
 *        thumbs and rails (easy).
 *
 * error  single scored slider: |v - t| in value units (stops: in stops); log: |ln(v / t)|;
 *        range: max over the two thumbs; norm scenarios: max over scored sliders of component / tau.
 *        player: that max (0 without scored sliders) + 4 per unmet toggle goal. The sound counts as muted
 *        when muted is set or the volume is 0, so "mute" also accepts a volume dragged to zero.
 * tau    linear: a step multiple of 0.5-2% of the range (legacy; mixer 1-2.5%); log: ln(1 + 3..5%);
 *        stops: 0.5 (exact stop); media seek: about 0.6-1% of the duration; norm scenarios: 1.
 *
 * Start modes: off, partial (single: part-way from the start towards the target; several: some sliders
 * already right; range: one end right), wrong (the distractor or a neighbouring channel got the target, two
 * targets swapped, a mirrored value, the neighbouring stop, minutes and seconds swapped, another preset's
 * values), solved.
 *
 * Inputs: pointer; keyboard in ~25% of episodes (spec.keys). Keys act on the focused slider exactly like
 * keyApply() below (widgets implement them with it): arrows +-kstep, PageUp/PageDown +-10 kstep, Home/End.
 * opts.route (episode knob): 'keyboard' allows keys on every single-thumb page and makes the oracle use
 *   them (keyRoute) wherever it can (not media / player / log targets; ranges have no keyboard route);
 *   'pointer' turns keys off; 'wheel' (no wheel route here) and undefined keep the sampled mix. The same
 *   random numbers are drawn either way, so a seed's page does not change with the route.
 *
 * plan targets
 *   { slider: i, thumb: j }            the thumb's current center (where a drag starts; a click focuses it)
 *   { slider: i, thumb: j, value: v }  the point on slider i's track where thumb j's center sits at value v
 *   keys: { click: { slider, thumb } } to focus, then { key } steps (shortest key sequence by BFS).
 *   { toggle: 'mute' | 'captions' }    player: the icon button (plan clicks it before any drag)
 *
 * Track clicks jump the nearest thumb (as in the legacy page). When spec.allowTrackClick is false the
 * instruction forbids them and the widget flags 'track-click' (episode voided).
 *
 * Out of range (opts.ood): multi 4-5 sliders, mixer 7-9 channels, stops 7-9 stops, media / player 20-100 min
 * videos (h:mm:ss), match 4-5 presets of 3-4 sliders.
 *
 * Files (files: [...] below, loaded in order after this one): banks.js (label, scale, stop, channel and preset banks),
 * hooks.js (facts, silent, retarget and the judge mode), sampling.js (sample), start.js (init), instruction.js. They
 * share code through the task's lib; this file holds the scale math, scoring, plan and solve. The self-test is
 * selftest.js (kit/selftest.js harness; loaded only by the checker and node tests).
 *
 * Helpers (widget API, env.taskDef.helpers): scale = { valueAt, frac, fmt, fmtU, decimals, keyApply, fmtTime }, the
 * pure value math widgets use for tick labels, readouts and keys: valueAt(s, f) value at track fraction f, frac(s, v)
 * its inverse, fmt / fmtU(s, v) the value as text (without / with the unit), decimals(step), keyApply(s, v, key) one
 * key press on a focused slider, fmtTime(sec) m:ss or h:mm:ss.
 *
 * judge modes (judgeModes; every scenario): impossible starts on the solved page and asks for a value the widget
 *   cannot take: a value beyond the slider's range (linear, log, range, multi, mixer, media volume), a position past
 *   the end of the video (media, player), more stars than the rating has (rating), a stop the slider does not have
 *   (stops), a preset the presets card does not list (match). spec.judge = { mode, slider, value, what, message }; the
 *   reply has status impossible and what names the value / stop / preset ("120%", "Huge"); message names the limit
 *   ("I can't do that: Volume only goes up to 100%.").
 *
 * optional hooks (contract the html/kit/env.js header; pure, no DOM; called only by their knobs):
 *   facts(model, spec)            2-4 values the page shows once solved: the unscored sliders first (distractor, other
 *                                 channels), then the scored ones as their readouts show them; the video length and
 *                                 the caption / sound state (media, player); the stars per row (rating); the scale's
 *                                 maximum tops up a page with a single slider
 *   parts(model, spec)            preempt=cancel: every slider by its label (value: its values) and, in the player, the
 *                                 Captions and Sound toggles
 *   silent(next, prev, spec, rng) a just-set slider did not stick: it slipped part of the way back towards where it was,
 *                                 snapped to a coarse grid, landed on the neighbouring stop or half a star / a star
 *                                 short; a just-flipped player toggle flips back; null in judge episodes
 *   retarget(spec, model, rng)    new targets for the same scored sliders (goals become absolute values), another
 *                                 stop, another preset, another rating, or the opposite toggle goal; null in judge
 *                                 episodes
 *
 * Deviations from MiniWoB: tolerances are explicit and graded; keyboard is gated per episode.
 */
(function () {
  'use strict';

  const { pad2 } = env.util;


  const decimals = (step) => (String(step).split('.')[1] || '').length;
  const clamp01 = (f) => Math.min(1, Math.max(0, f));
  const r9 = (v) => Math.round(v * 1e9) / 1e9;

  // Value at track fraction f: snapped to the step (linear) or to 3 significant figures (log).
  function valueAt(s, f) {
    f = clamp01(f);
    if (s.log) return Number((s.min * Math.exp(f * Math.log(s.max / s.min))).toPrecision(3));
    const v = s.min + Math.round((f * (s.max - s.min)) / s.step) * s.step;
    return Number(v.toFixed(decimals(s.step)));
  }
  const frac = (s, v) => (s.log ? Math.log(v / s.min) / Math.log(s.max / s.min) : (v - s.min) / (s.max - s.min));
  function fmtTime(sec) {
    sec = Math.round(sec);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const ss = sec % 60;
    return h ? `${h}:${pad2(m)}:${pad2(ss)}` : `${m}:${pad2(ss)}`;
  }
  function fmt(s, v) {
    if (s.stops) return s.stops[Math.round(v)] ?? String(v);
    if (s.time) return fmtTime(v);
    return s.log ? String(Number(v.toPrecision(3))) : v.toFixed(decimals(s.step));
  }
  // With the unit, as written in instructions and readouts.
  function fmtU(s, v) {
    const t = fmt(s, v);
    if (!s.unit || s.stops || s.time) return t;
    return s.unit === '%' || s.unit === '°C' ? t + s.unit : `${t} ${s.unit}`;
  }
  const comp = (s, v, t) => (s.log ? Math.abs(Math.log(v / t)) : Math.abs(v - t));

  // One key press on a focused slider (widgets implement keys with this, so plan and page agree).
  const KEY_STEPS = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 };
  function keyApply(s, v, key) {
    if (key === 'Home') return valueAt(s, 0);
    if (key === 'End') return valueAt(s, 1);
    const d = KEY_STEPS[key];
    if (!d) return v;
    const f0 = frac(s, v);
    for (let i = 1; i <= 1000; i++) {
      const f = f0 + i * d * s.kstep;
      const nv = valueAt(s, f);
      if (nv !== v) return nv;
      if (f <= 0 || f >= 1) break;
    }
    return v;
  }

  // Shortest key sequence from v into the tolerance (BFS over values); null if none within maxDepth.
  function keyPath(s, v, t, tau, maxDepth = 24) {
    if (comp(s, v, t) <= tau + 1e-9) return [];
    const keys = ['PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    const seen = new Map([[v, null]]);
    let frontier = [v];
    for (let depth = 0; depth < maxDepth && frontier.length; depth++) {
      const next = [];
      for (const x of frontier) {
        for (const k of keys) {
          const y = keyApply(s, x, k);
          if (seen.has(y)) continue;
          seen.set(y, [x, k]);
          if (comp(s, y, t) <= tau + 1e-9) {
            const path = [];
            for (let z = y; seen.get(z); z = seen.get(z)[0]) path.unshift(seen.get(z)[1]);
            return path;
          }
          next.push(y);
        }
      }
      frontier = next;
    }
    return null;
  }

  function tolText(s) {
    if (s.stops) return '';
    if (s.log) return `within ${Math.round(s.rel * 100)}%`;
    return `±${s.time ? `${s.tau} s` : fmtU(s, s.tau)}`;
  }

  // Worst thumb of slider s, in the slider's own units.
  function sliderError(s, vals) {
    return Math.max(...s.target.map((t, j) => comp(s, vals[j], t)));
  }

  const TOGGLE_MISS = 4;

  // player: the sound is off when muted or at volume 0.
  const audible = (model) => !model.muted && model.values[1][0] > 0;
  function toggleMisses(model, spec) {
    const T = spec.toggles;
    let n = 0;
    if (T.muted !== null && audible(model) === T.muted) n++;
    if (T.captions !== null && !!model.captions !== T.captions) n++;
    return n;
  }

  // Shared with the task's files (banks.js and the other files add their own).
  const lib = { valueAt, frac, fmt, fmtU, fmtTime, decimals, comp, sliderError, tolText, audible };

  const task = {
    name: 'set-slider',
    scenarios: ['horizontal', 'vertical', 'log', 'range', 'multi', 'stops', 'media', 'mixer', 'match', 'player', 'rating'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    judgeModes: ['impossible'],
    files: ['banks.js', 'hooks.js', 'sampling.js', 'start.js', 'instruction.js'],
    lib,
    helpers: { scale: { valueAt, frac, fmt, fmtU, decimals, keyApply, fmtTime } },
    facts: (model, spec) => lib.facts(model, spec),
    // preempt=cancel: every slider by its label (value: its values), the player's Captions and Sound toggles
    parts: (model, spec) => [...spec.sliders.map((sl, i) => ({ name: sl.label, value: model.values[i] })),
      ...(spec.scenario === 'player' ? [{ name: 'Captions', value: !!model.captions }, { name: 'Sound', value: audible(model) }] : [])],
    silent: (next, prev, spec, rng) => lib.silent(next, prev, spec, rng),
    retarget: (spec, model, rng) => lib.retarget(spec, model, rng),

    inputs(spec) {
      return spec && spec.keys ? ['pointer', 'keyboard'] : ['pointer'];
    },
    sample(rng, opts) {
      return lib.sample(rng, opts);
    },

    init(spec, rng) {
      return lib.init(spec, rng);
    },

    error(model, spec) {
      if (spec.scenario === 'player') {
        const sl = spec.scored.map((i) => sliderError(spec.sliders[i], model.values[i]) / spec.sliders[i].tau);
        return Math.max(0, ...sl) + TOGGLE_MISS * toggleMisses(model, spec);
      }
      if (spec.norm) {
        return Math.max(...spec.scored.map((i) => sliderError(spec.sliders[i], model.values[i]) / spec.sliders[i].tau));
      }
      const i = spec.scored[0];
      return sliderError(spec.sliders[i], model.values[i]);
    },

    tolerance(spec) {
      if (spec.scenario === 'player') return { tau: 1, minInitialError: 3 };
      if (spec.norm) return { tau: 1 };
      const s = spec.sliders[spec.scored[0]];
      if (s.stops) return { tau: 0.5, sigma: 1, minInitialError: 0.9 };
      return { tau: s.tau };
    },

    instruction(spec, rng) {
      return lib.instruction(spec, rng);
    },

    plan(model, spec) {
      if (spec.scenario === 'rating') {
        // One click on the star (its left half for a half value).
        for (const i of spec.scored) {
          const s = spec.sliders[i];
          if (comp(s, model.values[i][0], s.target[0]) > s.tau + 1e-9) return { click: { slider: i, thumb: 0, value: s.target[0] } };
        }
        return null;
      }
      if (spec.scenario === 'player') {
        // Toggles first (a later volume drag never touches them unless the goal is to unmute).
        const T = spec.toggles;
        if (T.captions !== null && !!model.captions !== T.captions) return { click: { toggle: 'captions' } };
        if (T.muted === true && audible(model)) return { click: { toggle: 'mute' } };
        if (T.muted === false && model.muted) return { click: { toggle: 'mute' } };
        if (T.muted === false && !audible(model) && !spec.sliders[1].target) {
          return { drag: [{ slider: 1, thumb: 0 }, { slider: 1, thumb: 0, value: 50 }] };
        }
      }
      for (const i of spec.scored) {
        const s = spec.sliders[i];
        const vals = model.values[i];
        if (spec.keyRoute && s.target.length === 1 && comp(s, vals[0], s.target[0]) > s.tau + 1e-9) {
          const path = keyPath(s, vals[0], s.target[0], s.tau);
          if (path && path.length) {
            if (model.focus !== i) return { click: { slider: i, thumb: 0 } };
            // Horizontal tracks: demonstrate Right/Left (the same step as Up/Down).
            const key = !spec.vertical && /Arrow(Up|Down)/.test(path[0]) ? (path[0] === 'ArrowUp' ? 'ArrowRight' : 'ArrowLeft') : path[0];
            return { key };
          }
        }
        // Range: if the low target lies beyond the current high thumb, move the high thumb first.
        const order = s.target.length === 2 && s.target[0] > vals[1] ? [1, 0] : s.target.map((_, j) => j);
        for (const j of order) {
          if (comp(s, vals[j], s.target[j]) > s.tau + 1e-9) {
            return { drag: [{ slider: i, thumb: j }, { slider: i, thumb: j, value: s.target[j] }] };
          }
        }
      }
      return null;
    },

    solve(spec, model) {
      const out = { values: spec.sliders.map((s, i) => (s.target ? s.target.slice() : model.values[i].slice())), focus: model ? model.focus ?? null : null };
      if (spec.scenario === 'player') {
        const T = spec.toggles;
        out.muted = T.muted !== null ? T.muted : !!model.muted;
        out.captions = T.captions !== null ? T.captions : !!model.captions;
        if (T.muted === false && out.values[1][0] === 0) out.values[1] = [50];
      }
      return out;
    },
  };

  env.task(task);
})();
