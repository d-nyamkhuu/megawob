/* set-slider/sampling.js: sample(): the episode spec (scenario mix, scored sliders, goals, levels, keyboard share, judge). */
(function () {
  'use strict';

  const task = env.taskOf('set-slider');
  const { lib } = task;
  const { WEIGHTS, decimals, LINEAR, LOG, valueAt, LABELS, frac, comp, STOP_SETS, STOP_SETS_OOD, VIDEO_TITLES, PLAYER_GOALS, CHANNELS, MIXER_SCALES, PRESET_NAMES, RATING_SCENES, NEW_SCENARIOS, judgeOf } = lib;

  const pickScenario = (rng, allowed) => env.util.pickWeighted(rng, allowed, WEIGHTS);

  const C = env.content;

  // Linear tolerance: a step multiple of lo..hi of the range.
  function linTau(rng, s, lo = 0.005, hi = 0.02) {
    const raw = (s.max - s.min) * rng.float(lo, hi);
    return Number((Math.max(1, Math.ceil(raw / s.step)) * s.step).toFixed(decimals(s.step)));
  }

  // Number settings from the content bank (env.content.SETTINGS) as slider scales: ranges of 20+ units.
  function settingScales() {
    return C.SETTINGS.filter((x) => x.kind === 'number' && x.max - x.min >= 20 && x.max - x.min <= 10000 && !/seats|attempts|versions/i.test(x.label));
  }
  const NICE = [1, 2, 5, 10, 20, 25, 50, 100];
  function settingSlider(st) {
    const r = st.max - st.min;
    const step = NICE.find((n) => n >= r / 200) || 100;
    const min = Math.floor(st.min / step) * step;
    const max = Math.ceil(st.max / step) * step;
    const unit = st.unit === 'USD' ? '' : st.unit || '';
    return { label: st.label, aliases: [st.label.toLowerCase()], kind: /volume/i.test(st.label) ? 'volume' : /bright/i.test(st.label) ? 'light' : 'generic', unit, min, max, step };
  }

  function makeLinearBase(rng, entry) {
    const sc = entry.scale || rng.pick(LINEAR);
    return { label: entry.label, aliases: entry.aliases || [], kind: entry.kind || 'generic', unit: entry.unit || '', min: sc.min, max: sc.max, step: sc.step, log: false, time: false, stops: null, kstep: 0.01 };
  }

  function makeScored(rng, entry, log, thumbs, spec) {
    let s;
    if (log) {
      s = { label: entry.label, aliases: entry.aliases || [], kind: entry.kind || 'generic', unit: '', ...rng.pick(LOG), log: true, time: false, stops: null, kstep: 0.01 };
    } else if (entry.min !== undefined) {
      s = { aliases: [], kind: 'generic', unit: '', ...entry, log: false, time: false, stops: null, kstep: 0.01 };
    } else s = makeLinearBase(rng, entry);
    // Targets avoid the extreme ends; a range target keeps its two ends at least 10% apart.
    const fs = thumbs === 2 ? [rng.float(0.05, 0.85)] : [rng.float(0.05, 0.95)];
    if (thumbs === 2) fs.push(rng.float(fs[0] + 0.1, 0.95));
    s.target = fs.map((f) => valueAt(s, f));
    if (log) {
      s.rel = rng.pick([0.03, 0.04, 0.05]);
      s.tau = Math.log(1 + s.rel);
    } else s.tau = linTau(rng, s, spec && spec.scenario === 'mixer' ? 0.01 : 0.005, spec && spec.scenario === 'mixer' ? 0.025 : 0.02);
    return s;
  }

  function labelEntries(rng, spec, n) {
    const pool = LABELS.slice();
    const extra = settingScales();
    let picked = C.sample(rng, pool, n, spec);
    // A share of episodes takes setting-style labels with their own ranges ("Auto-save every", "Default zoom").
    if (extra.length && rng.bool(0.3)) {
      const k = rng.int(1, Math.min(n, 2));
      const ex = C.sample(rng, extra, k, spec).map(settingSlider);
      picked = [...ex, ...picked].slice(0, n);
    }
    return rng.shuffle(picked);
  }

  // ------------------------------------------------------------------ goal kinds (single linear/log slider)

  function applyGoal(rng, spec, s) {
    const off = spec.startMode === 'off' || !spec.startMode;
    const kinds = [['abs', 5], ['extreme', 1.3], ['relative', off ? 1.4 : 0], ['fraction', s.log ? 0 : 1]];
    const kind = C.weighted(rng, kinds);
    const goal = { kind: 'abs' };
    if (kind === 'extreme') {
      goal.kind = 'extreme';
      goal.end = rng.bool(0.5) ? 'max' : 'min';
      s.target = [goal.end === 'max' ? valueAt(s, 1) : valueAt(s, 0)];
    } else if (kind === 'fraction') {
      goal.kind = 'fraction';
      goal.f = rng.pick([0.25, 0.5, 0.5, 0.75]);
      s.target = [valueAt(s, goal.f)];
    } else if (kind === 'relative') {
      // Start somewhere, then derive the target from it.
      for (let tries = 0; tries < 30; tries++) {
        const f0 = rng.float(0.1, 0.9);
        const v0 = valueAt(s, f0);
        let op;
        let amount;
        let t;
        if (s.log) {
          op = 'mul';
          amount = rng.pick([2, 0.5, 10, 0.1, 3]);
          t = Number((v0 * amount).toPrecision(3));
        } else if (rng.bool(0.3) && s.min >= 0 && v0 > s.min) {
          op = 'mul';
          amount = rng.pick([2, 0.5, 0.5]);
          t = valueAt(s, frac(s, v0 * amount));
          if (Math.abs(t - v0 * amount) > 1e-9) continue;
        } else {
          // Percent-unit sliders skip "+/- N%" (points or relative?); they get halve/double only.
          if (s.unit === '%') continue;
          op = 'add';
          const units = Math.max(1, Math.round(((s.max - s.min) * rng.float(0.08, 0.4)) / s.step));
          amount = Number((units * s.step * (rng.bool(0.5) ? 1 : -1)).toFixed(decimals(s.step)));
          // Round amounts read naturally: prefer multiples of 5 steps when the range allows.
          t = Number((v0 + amount).toFixed(decimals(s.step)));
        }
        if (!(t >= s.min && t <= s.max) || comp(s, v0, t) <= 4 * s.tau) continue;
        if (s.log && !(t >= s.min * 1.0001 && t <= s.max * 0.9999)) continue;
        s.start = v0;
        s.target = [t];
        Object.assign(goal, { kind: 'relative', op, amount });
        spec.showValue = true;
        return goal;
      }
    }
    return goal;
  }

  // ------------------------------------------------------------------ samplers per scenario

  function sampleStops(rng, spec, opts) {
    // easy / medium: coarser sliders (at most 3 / 4 stops).
    const maxStops = opts.level === 'easy' ? 3 : opts.level === 'medium' ? 4 : 99;
    const pool = maxStops < 99 ? STOP_SETS.filter((x) => x.stops.length <= maxStops) : STOP_SETS;
    const set = opts.ood ? rng.pick(STOP_SETS_OOD) : C.pick(rng, pool, spec);
    const n = set.stops.length;
    const s = { label: set.label, aliases: [set.label.toLowerCase()], kind: 'generic', unit: '', min: 0, max: n - 1, step: 1,
      log: false, time: false, stops: set.stops.slice(), kstep: 1 / (n - 1), tau: 0.5 };
    s.target = [rng.int(0, n - 1)];
    const sliders = [s];
    if (rng.bool(0.35)) {
      const other = C.pick(rng, pool.filter((x) => x.label !== set.label), spec);
      const m = other.stops.length;
      sliders[rng.bool(0.5) ? 'push' : 'unshift']({ label: other.label, aliases: [], kind: 'generic', unit: '', min: 0, max: m - 1,
        step: 1, log: false, time: false, stops: other.stops.slice(), kstep: 1 / (m - 1), target: null });
    }
    spec.vertical = rng.bool(0.25);
    return sliders;
  }

  // The player's two sliders (seek in seconds, volume in %) and the video title.
  function mediaSliders(rng, spec, opts) {
    const dur = opts.ood ? rng.int(20 * 60, 100 * 60) : rng.int(90, 12 * 60);
    const seek = { label: 'Seek', aliases: [
      'the timeline', 'the progress bar', 'the video', 'the playhead', 'the scrubber', 'seek position'
    ], kind: 'seek', unit: '', min: 0, max: dur, step: 1,
      log: false, time: true, stops: null, kstep: Math.max(5 / dur, 1e-4) };
    seek.tau = Math.max(1, Math.ceil(dur * rng.float(0.006, 0.01)));
    const vol = { label: 'Volume', aliases: ['the volume', 'the sound'], kind: 'volume', unit: '%', min: 0, max: 100, step: 1,
      log: false, time: false, stops: null, kstep: 0.05, tau: rng.int(3, 5) };
    spec.title = C.pick(rng, VIDEO_TITLES, spec);
    return [seek, vol];
  }

  function sampleMedia(rng, spec, opts) {
    const [seek, vol] = mediaSliders(rng, spec, opts);
    if (rng.bool(0.75)) {
      seek.target = [rng.int(Math.ceil(seek.max * 0.05), Math.floor(seek.max * 0.95))];
      vol.target = null;
      spec.mediaGoal = 'seek';
    } else {
      seek.target = null;
      spec.mediaGoal = 'volume';
      const kind = rng.pick(['abs', 'abs', 'mute', 'max']);
      vol.target = [kind === 'mute' ? 0 : kind === 'max' ? 100 : rng.int(1, 19) * 5];
      spec.goal = { kind: kind === 'abs' ? 'abs' : 'extreme', end: kind === 'max' ? 'max' : 'min' };
    }
    spec.showValue = true;
    return [seek, vol];
  }

  function samplePlayer(rng, spec, opts) {
    const [seek, vol] = mediaSliders(rng, spec, opts);
    const goals = C.weighted(rng, PLAYER_GOALS).slice();
    seek.target = goals.includes('seek') ? [rng.int(Math.ceil(seek.max * 0.05), Math.floor(seek.max * 0.95))] : null;
    vol.target = goals.includes('volume') ? [rng.int(1, 19) * 5] : null;
    spec.toggles = {
      muted: goals.includes('mute') ? true : goals.includes('unmute') ? false : null,
      captions: goals.includes('captions-on') ? true : goals.includes('captions-off') ? false : null,
    };
    spec.goals = goals.length > 1 && rng.bool(0.5) ? goals.reverse() : goals;
    spec.norm = true;
    spec.showValue = true;
    // Real players jump on a timeline click; the instruction never forbids it here.
    spec.allowTrackClick = true;
    return [seek, vol];
  }

  function sampleMixer(rng, spec, opts) {
    const n = opts.ood ? rng.int(7, 9) : rng.int(4, 6);
    const names = C.sample(rng, CHANNELS, n, spec);
    const sc = rng.pick(MIXER_SCALES);
    const k = rng.int(1, Math.min(3, n - 1));
    const scoredIdx = new Set(rng.sample(names.map((_, i) => i), k));
    spec.vertical = true;
    return names.map((label, i) => {
      const s = { label, aliases: [label.toLowerCase(), `the ${label.toLowerCase()} channel`], kind: 'volume', unit: sc.unit,
        min: sc.min, max: sc.max, step: sc.step, log: false, time: false, stops: null, kstep: 0.01, target: null };
      if (scoredIdx.has(i)) {
        s.target = [valueAt(s, rng.float(0.05, 0.95))];
        s.tau = linTau(rng, s, 0.01, 0.025);
      }
      return s;
    });
  }

  function sampleMatch(rng, spec, opts) {
    const n = opts.ood ? rng.int(3, 4) : rng.int(1, 3);
    const sliders = labelEntries(rng, spec, n).map((e) => {
      const s = e.min !== undefined ? { aliases: [], kind: 'generic', unit: '', ...e, log: false, time: false, stops: null, kstep: 0.01 } : makeLinearBase(rng, e);
      s.tau = linTau(rng, s, 0.008, 0.02);
      return s;
    });
    const np = opts.ood ? rng.int(4, 5) : rng.int(2, 3);
    const names = C.sample(rng, PRESET_NAMES, np, spec);
    spec.presets = names.map((name) => ({ name, values: sliders.map((s) => valueAt(s, rng.float(0.05, 0.95))) }));
    spec.preset = rng.int(0, np - 1);
    sliders.forEach((s, i) => { s.target = [spec.presets[spec.preset].values[i]]; });
    return sliders;
  }

  // ------------------------------------------------------------------ rating (stars)

  function sampleRating(rng, spec, opts) {
    const scene = rng.pick(RATING_SCENES);
    const n = opts.ood ? 10 : 5;
    const half = opts.level === 'easy' ? false : rng.bool(opts.level === 'medium' ? 0.3 : 0.5);
    const step = half ? 0.5 : 1;
    const k = opts.level === 'easy' ? 1 : rng.int(1, opts.level === 'medium' ? 2 : 3);
    const rows = k === 1 ? [scene.rows[0]] : [scene.rows[0], ...rng.sample(scene.rows.slice(1), k - 1)];
    const nScored = k === 1 ? 1 : rng.int(1, k);
    const scoredIdx = new Set(rng.sample(rows.map((_, i) => i), nScored));
    spec.scene = { title: scene.title, item: scene.item };
    spec.stars = { n, half };
    spec.norm = true;
    spec.allowTrackClick = true;
    return rows.map((label, i) => {
      const s = { label, aliases: [label.toLowerCase(), `the ${label.toLowerCase()} rating`], kind: 'rating', unit: '', min: 0, max: n, step,
        log: false, time: false, stops: null, kstep: step / n, tau: step / 2, stars: true, target: null };
      if (scoredIdx.has(i)) s.target = [valueAt(s, rng.float(1 / n, 1))];
      return s;
    });
  }

  // ------------------------------------------------------------------ levels (easy / medium)

  const LEVEL_TAU = { easy: 2, medium: 1.5 };
  // Keep `nScored` scored sliders (the first ones) and fill up with unscored ones to `nTotal` sliders.
  function trimSliders(sl, nTotal, nScored) {
    const idx = sl.map((_, i) => i);
    const sc = idx.filter((i) => sl[i].target).slice(0, nScored);
    const rest = idx.filter((i) => !sc.includes(i) && !sl[i].target).slice(0, Math.max(0, nTotal - sc.length));
    return [...sc, ...rest].sort((a, b) => a - b).map((i) => sl[i]);
  }
  function applyLevel(spec, level) {
    const f = LEVEL_TAU[level];
    if (!f) return;
    const v = spec.scenario;
    const easy = level === 'easy';
    spec.level = level;
    let sl = spec.sliders;
    if (easy && ['horizontal', 'vertical', 'log', 'range', 'stops'].includes(v)) sl = sl.filter((s) => s.target);
    if (v === 'multi') sl = sl.slice(0, easy ? 2 : 3);
    if (v === 'mixer') sl = trimSliders(sl, easy ? 4 : 5, easy ? 1 : 2);
    if (v === 'match' && easy) {
      const keep = [spec.preset, spec.presets.findIndex((_, i) => i !== spec.preset)].sort((a, b) => a - b);
      const nsl = Math.min(2, sl.length);
      sl = sl.slice(0, nsl);
      spec.presets = keep.map((i) => ({ ...spec.presets[i], values: spec.presets[i].values.slice(0, nsl) }));
      spec.preset = keep.indexOf(spec.preset);
    }
    if (v === 'player' && easy && spec.goals.length > 1) {
      const g = spec.goals[0];
      spec.goals = [g];
      if (g !== 'seek') sl[0].target = null;
      if (g !== 'volume') sl[1].target = null;
      if (g !== 'mute' && g !== 'unmute') spec.toggles.muted = null;
      if (g !== 'captions-on' && g !== 'captions-off') spec.toggles.captions = null;
    }
    // Wider tolerance on continuous sliders: a step multiple, never below the original.
    for (const s of sl) {
      if (!s.target || s.stops || s.stars) continue;
      if (s.log) {
        s.rel = Math.min(0.2, Number((s.rel * f).toFixed(3)));
        s.tau = Math.log(1 + s.rel);
      } else s.tau = Math.max(s.tau, Number((Math.round((s.tau * f) / s.step) * s.step).toFixed(decimals(s.step))));
    }
    spec.sliders = sl;
  }

  function sample(rng, opts) {
    const allowed = opts.scenarios && opts.scenarios.length ? opts.scenarios : task.scenarios;
    const older = allowed.filter((v) => !NEW_SCENARIOS.includes(v));
    let scenario = opts.scenario || (older.length ? pickScenario(rng, older) : rng.pick(allowed));
    if (!opts.scenario && older.length && older.length < allowed.length) {
      const w = rng.fork('widget');
      if (w.bool(0.1)) scenario = w.pick(allowed.filter((v) => NEW_SCENARIOS.includes(v)));
    }
    const spec = {
      scenario, vertical: scenario === 'vertical', allowTrackClick: rng.bool(0.5), sliders: [], scored: [],
      goal: { kind: 'abs' }, norm: false, showValue: false, keys: false, keyRoute: false,
      isplit: opts.isplit || 'train', csplit: opts.csplit || 'train', startMode: opts.startMode || 'off', ood: !!opts.ood,
    };
    let sliders;
    if (scenario === 'multi') {
      spec.norm = true;
      const n = opts.ood ? rng.int(4, 5) : rng.int(2, 3);
      spec.vertical = n <= 3 && rng.bool(0.3);
      // Log sliders need a long (horizontal) track for the tolerance to stay above 1 px.
      sliders = labelEntries(rng, spec, n).map((e) => makeScored(rng, e, !spec.vertical && n <= 3 && rng.bool(0.2), 1, spec));
    } else if (scenario === 'stops') {
      sliders = sampleStops(rng, spec, opts);
    } else if (scenario === 'media') {
      sliders = sampleMedia(rng, spec, opts);
    } else if (scenario === 'player') {
      sliders = samplePlayer(rng, spec, opts);
    } else if (scenario === 'mixer') {
      spec.norm = true;
      sliders = sampleMixer(rng, spec, opts);
    } else if (scenario === 'match') {
      spec.norm = true;
      sliders = sampleMatch(rng, spec, opts);
    } else if (scenario === 'rating') {
      sliders = sampleRating(rng, spec, opts);
    } else {
      const entries = labelEntries(rng, spec, 2);
      const s = makeScored(rng, entries[0], scenario === 'log', scenario === 'range' ? 2 : 1, spec);
      if (scenario !== 'range') spec.goal = applyGoal(rng, spec, s);
      sliders = [s];
      // Optional distractor: a second, unscored linear slider before or after the scored one.
      if (rng.bool(0.35)) {
        const e = entries[1];
        const d = e.min !== undefined ? { aliases: [], kind: 'generic', unit: '', ...e, log: false, time: false, stops: null, kstep: 0.01 } : makeLinearBase(rng, e);
        d.target = null;
        if (rng.bool(0.5)) sliders.unshift(d);
        else sliders.push(d);
      }
    }
    spec.sliders = sliders;
    if (opts.level && opts.level !== 'normal') applyLevel(spec, opts.level);
    spec.scored = spec.sliders.map((s, i) => (s.target ? i : -1)).filter((i) => i >= 0);
    // Keyboard share: focus a thumb, then arrows / PageUp / PageDown / Home / End.
    sliders = spec.sliders;
    const singleThumb = sliders.every((s) => !s.target || s.target.length === 1);
    // The oracle's key route: not for the players (long seek bars) or log targets.
    const keyRouteOk = scenario !== 'media' && scenario !== 'player' && !sliders.some((s) => s.target && s.log);
    spec.keys = singleThumb && rng.bool(0.25);
    spec.keyRoute = spec.keys && keyRouteOk && rng.bool(0.6);
    // Episode route knob: override after the draws above, so the page itself stays the same.
    if (opts.route === 'keyboard' && singleThumb) {
      spec.keys = true;
      spec.keyRoute = keyRouteOk;
    } else if (opts.route === 'pointer') {
      spec.keys = false;
      spec.keyRoute = false;
    }
    if (scenario === 'rating') {
      spec.keys = false;
      spec.keyRoute = false;
    }
    // Judge episodes (own stream, after every other draw: the page is the same with or without the knob).
    if (task.judgeModes.includes(opts.judge)) spec.judge = judgeOf(rng.fork('judge'), spec);
    return spec;
  }

  Object.assign(lib, {
    sample,
  });
})();
