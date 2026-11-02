/* rotate-object/sampling.js: scenario sampling; internal functions shared through the task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('rotate-object').lib;
  const { COLOR_NAMES, DIALS, EXTRA_SHAPES, HEADING, LANDMARKS, LETTERS, NORTH, NUMBERS, PHOTO_SCENES, POINTERS, PRODUCT_SIDES, SHAPES, SYMBOLS, WORDS, content, dialAngleFor, mod360, round, wrap180 } = lib;

  function sampleCube(rng, opts) {
    if (opts.turntable) return sampleTurntable(rng, opts);
    const upright = opts.ood || rng.bool(0.35);
    const kinds = upright ? ['letters', 'numbers', 'words'] : ['letters', 'numbers', 'words', 'symbols'];
    const bank = { letters: LETTERS, numbers: NUMBERS, words: WORDS, symbols: SYMBOLS }[rng.pick(kinds)];
    const labels = rng.sample(bank, 6);
    const colors = rng.sample(COLOR_NAMES, 6);
    const faces = labels.map((label, i) => ({ label, colorName: colors[i], color: content.COLORS[colors[i]] }));
    return { faces, target: rng.int(0, 5), upright, ref: rng.pick(['label', 'color', 'both']) };
  }

  // Turntable product: the target is a side face with a label from the content split; the other five
  // labels come from the whole bank.
  function sampleTurntable(rng, opts) {
    const target = rng.int(0, 3);
    const tlabel = content.pick(rng, PRODUCT_SIDES, { csplit: opts.csplit });
    const labels = rng.sample(PRODUCT_SIDES.filter((l) => l !== tlabel), 5);
    labels.splice(target, 0, tlabel);
    const colors = rng.sample(COLOR_NAMES.filter((c) => c !== 'gray' && c !== 'white'), 6);
    const faces = labels.map((label, i) => ({ label, colorName: colors[i], color: content.COLORS[colors[i]] }));
    return { faces, target, upright: false, ref: rng.pick(['label', 'label', 'color', 'both']), turntable: true };
  }

  function sampleDial(rng, opts) {
    const d = rng.bool(0.3) ? HEADING : rng.pick(DIALS);
    const kind = d === HEADING ? 'heading' : 'value';
    const sweep = kind === 'value' && opts.ood ? Math.min(d.sweep + 30, 340) : d.sweep;
    const start = kind === 'heading' ? 0 : -sweep / 2;
    const wheelStep = kind === 'heading' ? (opts.ood ? 1 : 5) : d.tstep;
    let target;
    if (kind === 'heading') target = opts.ood ? rng.int(0, 359) : rng.int(0, 71) * 5;
    else {
      const f = opts.ood ? (rng.bool() ? rng.float(0, 0.04) : rng.float(0.96, 1)) : rng.float(0.05, 0.95);
      target = round(Math.round((d.min + f * (d.max - d.min)) / d.tstep) * d.tstep, d.tdec);
    }
    const { tstep, ...rest } = d;
    const spec = { ...rest, kind, sweep, start, target, wheelStep };
    // Start value for 'off' starts: on the step grid, at least 30 degrees of travel from the target.
    const steps = Math.round((d.max - d.min) / wheelStep);
    for (let k = 0; k < 80; k++) {
      const v = round(d.min + rng.int(0, kind === 'heading' ? steps - 1 : steps) * wheelStep, 6);
      if (Math.abs(wrap180(dialAngleFor(spec, v) - dialAngleFor(spec, target))) >= 30) {
        spec.from = v;
        break;
      }
    }
    if (spec.from === undefined) spec.from = kind === 'heading' ? mod360(target + 180) : (target - d.min > d.max - target ? d.min : d.max);
    spec.readout = rng.bool(0.55);
    spec.rel = kind === 'value' && opts.startMode === 'off' && rng.bool(0.25);
    if (spec.rel) spec.readout = true;
    spec.keys = rng.bool(0.25);
    spec.wheel = rng.bool(0.3);
    const keySteps = (d.max - d.min) / wheelStep;
    spec.route = spec.wheel && rng.bool(0.6) ? 'wheel' : spec.keys && keySteps <= 120 && rng.bool(0.5) ? 'keys' : 'drag';
    return spec;
  }

  function sampleOrient(rng, opts) {
    const mode = rng.pick(['match', 'match', 'point', 'heading']);
    const shape = mode === 'match' ? rng.pick(Object.keys(SHAPES)) : rng.pick(POINTERS);
    const target = mode === 'heading' ? (opts.ood ? rng.int(0, 359) : rng.int(0, 71) * 5) : round(rng.float(0, 360), 1);
    const keys = mode === 'heading' && rng.bool(0.2);
    const spec = { mode, shape, order: SHAPES[shape], color: rng.pick(COLOR_NAMES.filter((c) => c !== 'gray')), target: mod360(target),
      keys, route: keys && rng.bool(0.5) ? 'type' : 'drag' };
    const tr = opts.traits || {};
    // Opt-in traits: overrides drawn from their own streams after the usual draws.
    if (Array.isArray(tr.modes) && tr.modes.length && !tr.modes.includes(spec.mode)) {
      const mr = rng.fork('modes');
      spec.mode = mr.pick(tr.modes);
      spec.keys = false;
      spec.route = 'drag';
      if (spec.mode === 'heading') spec.target = opts.ood ? mr.int(0, 359) : mr.int(0, 71) * 5;
      else if (spec.mode === 'point') spec.target = mod360(round(mr.float(0, 360), 1));
      if (spec.mode !== 'match' && !POINTERS.includes(spec.shape)) spec.shape = mr.pick(POINTERS);
    }
    if (Array.isArray(tr.shapes) && tr.shapes.length && spec.mode === 'match') spec.shape = rng.fork('shapes').pick(tr.shapes);
    spec.order = SHAPES[spec.shape] || EXTRA_SHAPES[spec.shape] || 1;
    if (tr.grip === 'hub') spec.grip = 'hub';
    return spec;
  }

  function samplePhoto(rng, opts) {
    const mode = rng.pick(['angle', 'angle', 'level', 'upright']);
    const tau = opts.ood ? 0.75 : 1;
    const spec = { mode, scene: rng.pick(PHOTO_SCENES), tau, from: 0, tilt: 0, base: 0 };
    const sign = rng.bool() ? 1 : -1;
    if (mode === 'angle') {
      const mag = opts.ood ? rng.int(46, 170) : Math.round(rng.float(3.5, 45) * 2) / 2;
      if (rng.bool(0.3)) {
        // A rotation is already applied; the goal may be relative to it.
        spec.from = Math.round(rng.float(-30, 30) * 2) / 2;
        spec.target = wrap180(spec.from + sign * mag);
      } else spec.target = sign * mag;
    } else if (mode === 'level') {
      spec.tilt = round(sign * (opts.ood ? rng.float(20, 40) : rng.float(3.5, 20)), 1);
      spec.target = -spec.tilt;
    } else {
      spec.base = rng.pick([90, 180, 270]);
      spec.target = wrap180(-spec.base);
    }
    spec.buttons = mode === 'upright' || rng.bool(0.5);
    spec.slider = rng.bool(0.6);
    spec.keys = rng.bool(0.3);
    if (mode === 'upright') spec.route = 'buttons';
    else if (spec.keys && rng.bool(0.5)) spec.route = 'type';
    else if (spec.slider && Math.abs(spec.target) <= 45 && Math.abs(spec.from) <= 45 && rng.bool(0.5)) spec.route = 'slider';
    else spec.route = 'handle';
    return spec;
  }

  function sampleCompass(rng, opts) {
    const mode = rng.pick(['bearing', 'face', 'face', 'north']);
    const tau = opts.ood ? 2 : 3;
    const n = opts.ood ? rng.int(8, 10) : rng.int(4, 6);
    const cs = { csplit: opts.csplit };
    const names = env.content.sample(rng, [...LANDMARKS, ...env.content.STATIONS], n, cs);
    const places = [];
    for (const name of names) {
      for (let k = 0; k < 60; k++) {
        const bearing = rng.int(0, 359);
        if (places.every((p) => Math.abs(wrap180(p.bearing - bearing)) >= (opts.ood ? 24 : 40))) {
          places.push({ name, bearing, dist: round(rng.float(0.45, 0.9), 3) });
          break;
        }
      }
    }
    const spec = { mode, places, tau, ref: rng.int(0, places.length - 1) };
    if (mode === 'bearing') {
      spec.bearing = opts.ood ? rng.int(0, 359) : rng.int(0, 71) * 5;
      spec.target = mod360(-spec.bearing);
    } else if (mode === 'face') spec.target = mod360(-places[spec.ref].bearing);
    else {
      spec.north = rng.pick(Object.keys(NORTH));
      spec.target = NORTH[spec.north];
    }
    for (let k = 0; k < 60; k++) {
      spec.from = rng.int(0, 359);
      if (Math.abs(wrap180(spec.from - spec.target)) >= 30) break;
    }
    return spec;
  }

  // Episode knob route: override the sampled input route where the scenario has the requested one (see header).
  // Runs after the normal draws, so the rest of the spec is the same as without the knob.

  Object.assign(lib, { sampleCube, sampleDial, sampleOrient, samplePhoto, sampleCompass });
})();
