/* set-slider/start.js: init(): the start model per start mode (and the player's start). */
(function () {
  'use strict';

  const task = env.taskOf('set-slider');
  const { lib } = task;
  const { valueAt, comp, frac } = lib;

  // ------------------------------------------------------------------ init helpers

  function randomOff(rng, s) {
    const n = s.target ? s.target.length : 1;
    let vals;
    for (let tries = 0; tries < 60; tries++) {
      const fs = n === 2 ? [rng.float(0, 0.8)] : [rng.float(0, 1)];
      if (n === 2) fs.push(rng.float(fs[0] + 0.05, 1));
      vals = fs.map((f) => valueAt(s, f));
      if (!s.target || s.target.every((t, j) => comp(s, vals[j], t) > (s.stops ? 0.75 : 3 * s.tau))) break;
    }
    return vals;
  }

  // A value off target by more than tau: preferred candidates first, then random.
  function offValue(rng, s, cands) {
    for (const v of cands) if (v !== undefined && v !== null && v >= s.min && v <= s.max && comp(s, v, s.target[0]) > s.tau * 1.5) return valueAt(s, frac(s, v));
    return randomOff(rng, s)[0];
  }

  // player start states. off: every goal unmet; partial: one of two sub-goals done (a single slider goal:
  // part-way); wrong: the other toggle was flipped instead, or the seek / volume went to a confusable value.
  function initPlayer(spec, rng) {
    const [seek, vol] = spec.sliders;
    const T = spec.toggles;
    const mode = spec.startMode;
    const values = [randomOff(rng, seek), randomOff(rng, vol)];
    // A mute / unmute goal starts with audible volume (so muting is a click, and unmuting is enough).
    if (T.muted !== null && !vol.target) values[1] = [valueAt(vol, rng.float(0.2, 1))];
    const model = {
      values, focus: null,
      muted: T.muted !== null ? !T.muted : rng.bool(0.25),
      captions: T.captions !== null ? !T.captions : rng.bool(0.3),
    };
    const goals = spec.goals;
    const done = (g) => {
      if (g === 'seek') model.values[0] = seek.target.slice();
      else if (g === 'volume') model.values[1] = vol.target.slice();
      else if (g === 'mute' || g === 'unmute') model.muted = T.muted;
      else model.captions = T.captions;
    };
    if (mode === 'partial') {
      if (goals.length > 1) done(rng.pick(goals));
      else if (goals[0] === 'seek' || goals[0] === 'volume') {
        const i = goals[0] === 'seek' ? 0 : 1;
        const s = spec.sliders[i];
        const f0 = frac(s, values[i][0]);
        const f1 = frac(s, s.target[0]);
        model.values[i] = [valueAt(s, f0 + (f1 - f0) * rng.float(0.4, 0.75))];
      }
    } else if (mode === 'wrong') {
      // The other toggle got flipped (captions instead of mute and vice versa)...
      if (T.muted !== null && T.captions === null) model.captions = !model.captions;
      else if (T.captions !== null && T.muted === null) model.muted = !model.muted && !vol.target ? true : model.muted;
      // ...and a slider goal sits at a confusable value (minutes and seconds swapped, a mirrored volume).
      if (seek.target) {
        const t = seek.target[0];
        model.values[0] = [offValue(rng, seek, [Math.floor(t / 60) + (t % 60) * 60, t + 60, t - 60])];
      }
      if (vol.target) {
        const t = vol.target[0];
        model.values[1] = [offValue(rng, vol, [100 - t, t + 30, t - 30])];
      }
    }
    return model;
  }

  function init(spec, rng) {
    // impossible: the page starts as it should stay (every scored slider at its target).
    if (spec.judge) {
      const base = spec.scenario === 'player' ? initPlayer(spec, rng) : { values: spec.sliders.map((s) => randomOff(rng, s)), focus: null };
      return task.solve(spec, base);
    }
    if (spec.scenario === 'player') return initPlayer(spec, rng);
    const mode = spec.startMode;
    const values = spec.sliders.map((s) => {
      if (s.target && s.start !== undefined) return [s.start];
      return randomOff(rng, s);
    });
    const sc = spec.scored;
    const at = (i) => spec.sliders[i].target.slice();
    if (mode === 'partial') {
      if (sc.length > 1) {
        // Some (not all) scored sliders already right.
        const k = rng.int(1, sc.length - 1);
        for (const i of rng.sample(sc, k)) values[i] = at(i);
      } else {
        const i = sc[0];
        const s = spec.sliders[i];
        if (s.target.length === 2) {
          const j = rng.int(0, 1);
          values[i][j] = s.target[j];
          values[i].sort((a, b) => a - b);
        } else if (s.stops) {
          const t = s.target[0];
          const v = values[i][0];
          values[i] = [Math.abs(v - t) > 1 ? t + Math.sign(v - t) : v];
        } else {
          // Part-way from the start towards the target.
          const f0 = frac(s, values[i][0]);
          const f1 = frac(s, s.target[0]);
          values[i] = [valueAt(s, f0 + (f1 - f0) * rng.float(0.4, 0.75))];
        }
      }
    } else if (mode === 'wrong') {
      const v = spec.scenario;
      if (v === 'match') {
        // Another preset's values were applied.
        const others = spec.presets.map((_, k) => k).filter((k) => k !== spec.preset);
        const p = spec.presets[rng.pick(others)];
        spec.sliders.forEach((s, i) => { values[i] = [p.values[i]]; });
      } else if (v === 'multi' && sc.length >= 2) {
        // Two sliders got each other's targets (same position on the track).
        const [a, b] = rng.sample(sc, 2);
        const sa = spec.sliders[a];
        const sb = spec.sliders[b];
        values[a] = [offValue(rng, sa, [valueAt(sa, frac(sb, sb.target[0]))])];
        values[b] = [offValue(rng, sb, [valueAt(sb, frac(sa, sa.target[0]))])];
      } else if (v === 'mixer') {
        // The neighbouring channel was set instead of the scored one.
        const i = rng.pick(sc);
        const nb = spec.sliders.map((_, k) => k).filter((k) => !spec.sliders[k].target);
        const j = nb.length ? nb.reduce((a, k) => (Math.abs(k - i) < Math.abs(a - i) ? k : a), nb[0]) : null;
        if (j !== null) values[j] = [spec.sliders[i].target[0]];
      } else if (v === 'media') {
        const i = sc[0];
        const s = spec.sliders[i];
        const t = s.target[0];
        const cands = s.time ? [Math.floor(t / 60) + (t % 60) * 60, t + 60, t - 60] : [100 - t, t + 30, t - 30];
        values[i] = [offValue(rng, s, cands)];
      } else {
        const i = sc[0];
        const s = spec.sliders[i];
        const dIdx = spec.sliders.findIndex((x) => !x.target);
        if (s.target.length === 2) {
          const lo = valueAt(s, 1 - frac(s, s.target[1]));
          const hi = valueAt(s, 1 - frac(s, s.target[0]));
          if (comp(s, lo, s.target[0]) > s.tau || comp(s, hi, s.target[1]) > s.tau) values[i] = [lo, hi];
        } else if (s.stops) {
          const t = s.target[0];
          values[i] = [t > 0 && (t === s.max || rng.bool(0.5)) ? t - 1 : t + 1];
        } else if (dIdx >= 0 && rng.bool(0.6)) {
          // The distractor got the value meant for the scored slider.
          const d = spec.sliders[dIdx];
          values[dIdx] = [valueAt(d, frac(s, s.target[0]))];
        } else {
          values[i] = [offValue(rng, s, [valueAt(s, 1 - frac(s, s.target[0]))])];
        }
      }
    }
    return { values, focus: null };
  }

  Object.assign(lib, {
    init,
  });
})();
