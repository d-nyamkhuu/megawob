/* set-slider/hooks.js: the optional hooks (facts, silent, retarget) and the judge mode (impossible). */
(function () {
  'use strict';

  const task = env.taskOf('set-slider');
  const { lib } = task;
  const { fmtU, fmt, fmtTime, audible, frac, valueAt, decimals, comp, PRESET_NAMES, STOP_SETS, STOP_SETS_OOD } = lib;

  // ------------------------------------------------------------------ optional hooks (facts, silent, retarget)

  const fail = (m, spec) => task.error(m, spec) > task.tolerance(spec).tau + 1e-9;

  function facts(model, spec) {
    const out = [];
    const push = (label, value, aliases) => {
      if (out.length < 4 && !out.some((f) => f.label === label)) out.push({ label, value, aliases: (aliases || []).filter((a) => a && a !== value) });
    };
    const val = (s, i) => model.values[i].map((v) => fmtU(s, v)).join(' – ');
    const raw = (s, i) => model.values[i].map((v) => fmt(s, v)).join(' – ');
    const v = spec.scenario;
    if (v === 'media' || v === 'player') {
      const [seek, vol] = spec.sliders;
      push('Duration', fmtTime(seek.max), [`${Math.round(seek.max)} s`]);
      push('Position', fmt(seek, model.values[0][0]), []);
      push('Volume', fmtU(vol, model.values[1][0]), [fmt(vol, model.values[1][0])]);
      if (v === 'player') {
        push('Captions', model.captions ? 'On' : 'Off', [model.captions ? 'enabled' : 'disabled']);
        push('Sound', audible(model) ? 'On' : 'Muted', [audible(model) ? 'unmuted' : 'off']);
      }
      return out.slice(0, 4);
    }
    if (v === 'rating') {
      for (const [i, s] of spec.sliders.entries()) {
        const x = model.values[i][0];
        push(`${s.label} rating`, `${fmt(s, x).replace(/\.0$/, '')}/${spec.stars.n}`, [`${fmt(s, x).replace(/\.0$/, '')} stars`, String(x)]);
      }
      if (out.length < 2) push('Out of', `${spec.stars.n} stars`, [String(spec.stars.n)]);
      return out;
    }
    // Unscored sliders first (their values are only on the page), then the scored ones.
    const order = [...spec.sliders.keys()].sort((a, b) => !!spec.sliders[a].target - !!spec.sliders[b].target);
    for (const i of order) push(spec.sliders[i].label, val(spec.sliders[i], i), [raw(spec.sliders[i], i)]);
    if (out.length < 2) {
      const s = spec.sliders[spec.scored[0]];
      push(`${s.label} maximum`, s.stops ? s.stops[s.stops.length - 1] : fmtU(s, s.max), [fmt(s, s.max)]);
    }
    return out;
  }

  // Wrong values a just-set thumb can come back with, most believable first.
  function slipCands(rng, s, v, p) {
    const out = [];
    if (s.stops) {
      out.push(v + (p < v ? -1 : 1), v + (p < v ? 1 : -1));
    } else if (s.stars) {
      out.push(v - s.step, v - 1, v + s.step);
    } else {
      const f = frac(s, v);
      const fp = frac(s, p);
      // Slipped part of the way back towards the previous value.
      for (const k of rng.shuffle([0.3, 0.45, 0.6])) out.push(valueAt(s, f + (fp - f) * k));
      // Snapped to a coarse grid (whole tens of steps / of the track's tenths).
      if (!s.log) out.push(Number((Math.round(v / (s.step * 10)) * s.step * 10).toFixed(decimals(s.step))));
      out.push(valueAt(s, Math.round(f * 10) / 10));
    }
    return out.filter((x) => x >= s.min - 1e-9 && x <= s.max + 1e-9 && x !== v);
  }

  function silent(next, prev, spec, rng) {
    if (spec.judge) return null;
    const changed = [];
    if (spec.scenario === 'player') {
      const T = spec.toggles;
      if (T.captions !== null && !!next.captions === T.captions && !!prev.captions !== T.captions) changed.push(['captions']);
      if (T.muted !== null && !!next.muted !== !!prev.muted) changed.push(['muted']);
    }
    for (const i of spec.scored) {
      const s = spec.sliders[i];
      next.values[i].forEach((v, j) => {
        if (v !== prev.values[i][j] && comp(s, v, s.target[j]) < comp(s, prev.values[i][j], s.target[j])) changed.push([i, j]);
      });
    }
    for (const c of rng.shuffle(changed)) {
      if (c[0] === 'captions' || c[0] === 'muted') {
        const m = env.util.clone(next);
        m[c[0]] = !!prev[c[0]];
        if (fail(m, spec)) return m;
        continue;
      }
      const [i, j] = c;
      const s = spec.sliders[i];
      for (const x of slipCands(rng, s, next.values[i][j], prev.values[i][j])) {
        const m = env.util.clone(next);
        m.values[i][j] = x;
        if (m.values[i].length === 2 && m.values[i][0] > m.values[i][1]) continue;
        if (fail(m, spec)) return m;
      }
    }
    return null;
  }

  function retarget(spec, model, rng) {
    if (spec.judge) return null;
    const v = spec.scenario;
    for (let tries = 0; tries < 24; tries++) {
      const sp = env.util.clone(spec);
      if (v === 'match') {
        sp.preset = rng.pick(sp.presets.map((_, k) => k).filter((k) => k !== spec.preset));
        sp.sliders.forEach((s, i) => { s.target = [sp.presets[sp.preset].values[i]]; });
      } else if (v === 'player' && rng.bool(0.5) && (sp.toggles.muted !== null || sp.toggles.captions !== null)) {
        // The opposite toggle goal (mute <-> unmute, captions on <-> off).
        const flip = { mute: 'unmute', unmute: 'mute', 'captions-on': 'captions-off', 'captions-off': 'captions-on' };
        const g = rng.pick(sp.goals.filter((x) => flip[x]));
        sp.goals = sp.goals.map((x) => (x === g ? flip[g] : x));
        if (g === 'mute' || g === 'unmute') sp.toggles.muted = !sp.toggles.muted;
        else sp.toggles.captions = !sp.toggles.captions;
      } else {
        for (const i of sp.scored) {
          const s = sp.sliders[i];
          if (s.stops) s.target = [rng.pick([...s.stops.keys()].filter((k) => k !== spec.sliders[i].target[0]))];
          else if (s.stars) s.target = [valueAt(s, rng.float(1 / s.max, 1))];
          else if (s.target.length === 2) {
            const f0 = rng.float(0.05, 0.85);
            s.target = [valueAt(s, f0), valueAt(s, rng.float(f0 + 0.1, 0.95))];
          } else s.target = [s.time ? rng.int(Math.ceil(s.max * 0.05), Math.floor(s.max * 0.95)) : valueAt(s, rng.float(0.05, 0.95))];
        }
        if (sp.goal && sp.goal.kind !== 'abs') sp.goal = { kind: 'abs' };
        if (v === 'media' && sp.mediaGoal === 'volume') sp.goal = { kind: 'abs' };
      }
      // A scored target moves well away from the old one (a new goal, not a nudge).
      const moved = sp.scored.some((i) => {
        const s = sp.sliders[i];
        return s.target.some((t, j) => comp(s, t, spec.sliders[i].target[j]) > (s.stops || s.stars ? 0.25 : 3 * s.tau));
      }) || v === 'player' || v === 'match';
      if (moved && fail(model, sp) && Number.isFinite(task.error(model, sp))) return sp;
    }
    return null;
  }

  // ------------------------------------------------------------------ judge mode (impossible)

  function judgeOf(jr, spec) {
    const v = spec.scenario;
    if (v === 'match') {
      const taken = spec.presets.map((p) => p.name);
      const name = jr.pick(PRESET_NAMES.filter((n) => !taken.includes(n)));
      return { mode: 'impossible', slider: null, value: name, what: [name], message: `I can't do that: there is no “${name}” preset, only ${taken.map((n) => `“${n}”`).join(', ')}.` };
    }
    const i = v === 'media' || v === 'player' ? (v === 'media' && spec.mediaGoal === 'volume' ? 1 : 0) : jr.pick(spec.scored.length ? spec.scored : [0]);
    const s = spec.sliders[i];
    if (s.stops) {
      const all = [...new Set([...STOP_SETS, ...STOP_SETS_OOD].flatMap((x) => x.stops))].filter((x) => /^[A-Z]/.test(x) && !s.stops.some((y) => y.toLowerCase() === x.toLowerCase()));
      const name = jr.pick(all);
      return { mode: 'impossible', slider: i, value: name, what: [name], message: `I can't do that: ${s.label} has no “${name}” setting, only ${s.stops.join(', ')}.` };
    }
    if (s.stars) {
      const n = spec.stars.n + jr.int(1, 3);
      return { mode: 'impossible', slider: i, value: n, what: [`${n} stars`, String(n)], message: `I can't do that: the ${s.label.toLowerCase()} rating only goes up to ${spec.stars.n} stars.` };
    }
    if (s.time) {
      const t = s.max + jr.int(30, 600);
      return { mode: 'impossible', slider: i, value: t, what: [fmtTime(t), `${t} s`, String(t)], message: `I can't do that: the video is only ${fmtTime(s.max)} long.` };
    }
    let x;
    if (s.log) x = Number((s.max * jr.pick([2, 5, 10])).toPrecision(3));
    else {
      const span = s.max - s.min;
      const d = Math.max(s.step, Math.round((span * jr.pick([0.2, 0.5, 1])) / s.step) * s.step);
      x = Number((s.min < 0 && jr.bool(0.4) ? s.min - d : s.max + d).toFixed(decimals(s.step)));
    }
    const lim = x > s.max ? `only goes up to ${fmtU(s, s.max)}` : `only goes down to ${fmtU(s, s.min)}`;
    return { mode: 'impossible', slider: i, value: x, what: [fmtU(s, x), fmt(s, x)], message: `I can't do that: ${s.label} ${lim}.` };
  }

  function judgeInstruction(spec, rng) {
    const I = env.instruct;
    const j = spec.judge;
    const S = spec.isplit;
    // the same registers as every other instruction (kit instruct.say), so a judge episode reads like a normal one
    const say = (templates, vars) => I.say(rng, I.phrase(rng, templates, vars, S), { isplit: S, terse: I.fill(templates[0], vars) });
    if (spec.scenario === 'match') {
      return say([
        'Apply the “{p}” preset.', 'Make the sliders match the “{p}” preset.', 'Set every slider to its “{p}” value.',
        'Copy preset “{p}” to all sliders.', 'The sliders should all use “{p}”.'
      ], { p: j.value });
    }
    const s = spec.sliders[j.slider];
    if (s.stops) return say([
      'Set “{s}” to “{v}”.', 'Move the {n} slider to “{v}”.', 'Pick the “{v}” setting on “{s}”.',
      '“{s}” needs the “{v}” setting.', 'I want “{s}” on “{v}”.', 'Use “{v}” on the {n} slider.'
    ], { s: s.label, n: s.label.toLowerCase(), v: j.value });
    if (s.stars) return say([
      'Rate “{item}” {v} stars.', 'Give the {n} of “{item}” {v} stars.', 'Set the {n} rating to {v} stars.',
      'The {n} rating needs {v} stars.', 'Use {v} stars for {n} on “{item}”.'
    ], { item: spec.scene.item, n: s.label.toLowerCase(), v: j.value });
    if (s.time) return say([
      'Skip to {t} in the video.', 'Jump to the {t} mark.', 'Seek the video to {t}.', 'Put the video at {t}.',
      'Move the playhead to {t}.'
    ], { t: fmtTime(j.value) });
    const hi = s.target && s.target.length === 2 ? (j.value > s.max ? 'upper' : 'lower') : null;
    return say(hi ? ['Set the {h} “{s}” handle to {v}.', 'Move the {h} end of the “{s}” range to {v}.']
      : [
        'Set “{s}” to {v}.', 'Drag the “{s}” slider to {v}.', 'Change “{s}” to {v}.', 'Make “{s}” {v}.',
        'I want “{s}” at {v}.', '“{s}” should read {v}.', 'Use {v} for “{s}”.'
      ],
    { s: s.label, h: hi, v: fmtU(s, j.value) });
  }

  Object.assign(lib, {
    facts, silent, retarget, judgeOf, judgeInstruction,
  });
})();
