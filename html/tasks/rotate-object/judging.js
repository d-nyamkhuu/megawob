/* rotate-object/judging.js: judge goals and instruction phrasing; internal functions shared through the task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('rotate-object').lib;
  const { COLOR_NAMES, LANDMARKS, LETTERS, NUMBERS, PRODUCT_SIDES, SYMBOLS, WORDS, fmtValue, mod360, round, wrap180 } = lib;

  const ABSENT_SHAPES = [
    'hexagon', 'heart', 'lightning bolt', 'crescent', 'octagon', 'pentagon', 'teardrop', 'ellipse', 'trapezoid',
    'rhombus', 'parallelogram', 'semicircle', 'heptagon', 'nonagon', 'hourglass', 'clover', 'spiral', 'squircle',
    'decagon', 'cogwheel', 'cloud', 'horseshoe', 'speech bubble', 'keyhole'
  ];
  const ABSENT_LAYERS = [
    'second photo', 'logo layer', 'watermark', 'thumbnail', 'background layer', 'sticker', 'text layer',
    'speech bubble', 'inset map', 'vector mask', 'pattern tile', 'line art'
  ];
  const ABSENT_DIALS = [
    'Pitch', 'Bass', 'Tempo', 'Pressure', 'Brightness', 'Zoom', 'Treble', 'Reverb', 'Echo', 'Decay', 'Attack',
    'Sustain', 'Release', 'Contrast', 'Focus', 'Tension', 'Damping', 'Flow', 'Texture', 'Blend', 'Spread', 'Depth',
    'Density', 'Torque'
  ];

  const faceWords = (spec, i) => {
    const f = spec.faces[i];
    const byLabel = [`face ${f.label}`, `side ${f.label}`, `labeled ${f.label}`, `“${f.label}”`, `"${f.label}"`, `'${f.label}'`,
      ...(f.label.length > 1 ? [f.label] : [])];
    return spec.ref === 'label' ? [...byLabel, f.colorName] : [f.colorName, ...byLabel];
  };
  const faceDesc = (spec, i) => {
    const f = spec.faces[i];
    const side = spec.turntable ? 'side' : 'face';
    const lbl = spec.turntable ? `the “${f.label}” side` : `the face labeled “${f.label}”`;
    return { label: lbl, color: `the ${f.colorName} ${side}`, both: `the ${f.colorName} ${side} (“${f.label}”)` }[spec.ref];
  };
  // Another value than `v` on the dial's own grid, at least `gap` units away.
  function otherDialValue(spec, v, gap, rng) {
    const steps = Math.round((spec.max - spec.min) / spec.wheelStep);
    for (let k = 0; k < 80; k++) {
      const x = round(spec.min + rng.int(0, spec.kind === 'heading' ? steps - 1 : steps) * spec.wheelStep, 6);
      const d = spec.kind === 'heading' ? Math.abs(wrap180(x - v)) : Math.abs(x - v);
      if (d >= gap) return x;
    }
    return null;
  }

  function judgeOf(jr, spec, mode) {
    const v = spec.scenario;
    if (mode === 'impossible') {
      if (v === 'cube') {
        const have = spec.faces.map((f) => f.label);
        const bank = [LETTERS, NUMBERS, WORDS, SYMBOLS, PRODUCT_SIDES].find((b) => b.includes(have[0])) || LETTERS;
        const free = bank.filter((l) => !have.includes(l));
        const label = jr.pick(free.length ? free : ['8', '9', '0']);
        const color = jr.pick(COLOR_NAMES.filter((c) => !spec.faces.some((f) => f.colorName === c)));
        const nm = spec.turntable ? 'side' : 'face';
        const t = { label: `the ${nm} labeled “${label}”`, color: `the ${color} ${nm}`, both: `the ${color} ${nm} (“${label}”)` }[spec.ref];
        const bare = spec.ref === 'label' ? [t, `${nm} ${label}`, ...(label.length > 1 ? [label] : [])]
          : spec.ref === 'color' ? [t, color] : [t, color, `${nm} ${label}`, ...(label.length > 1 ? [label] : [])];
        return { mode, what: bare, subject: t, templates: spec.turntable
          ? ['Spin the product so {what} faces you.', 'Turn the product until {what} is facing you.']
          : [
            'Rotate the cube so {what} faces you.', 'Bring {what} to the front of the cube.',
            'Turn the cube to show {what} on the front.', 'Make {what} the front face of the cube.',
            'The cube should show {what} facing you.', 'Arrange the cube with {what} in front.'
          ],
        message: `I can't do that: the ${spec.turntable ? 'product' : 'cube'} has no such ${nm}.` };
      }
      if (v === 'dial') {
        if (spec.kind === 'heading') {
          const label = jr.pick(ABSENT_DIALS);
          return { mode, what: [label, `${label} dial`], subject: label, templates: ['Set the {what} dial to {n}.', 'Turn the {what} knob to {n}.'], n: String(jr.int(2, 9)),
            message: `I can't do that: this page has no ${label} dial, only a heading dial.` };
        }
        const over = jr.bool();
        const span = spec.max - spec.min;
        const val = round(over ? spec.max + span * jr.float(0.1, 0.4) : spec.min - span * jr.float(0.1, 0.4), spec.tdec);
        return { mode, what: [fmtValue(spec, val), val.toFixed(spec.tdec)], subject: spec.label, templates: ['Set the {what} to {n}.', 'Turn the {what} knob to {n}.', 'Dial the {what} up to {n}.'],
          n: fmtValue(spec, val), message: `I can't do that: ${fmtValue(spec, val)} is outside the ${spec.label}'s range of ${fmtValue(spec, spec.min)} to ${fmtValue(spec, spec.max)}.` };
      }
      if (v === 'orient') {
        const what = jr.pick(ABSENT_SHAPES);
        return { mode, what: [what], subject: what, templates: ['Rotate the {what} to point {n}° clockwise from straight up.', 'Turn the {what} to a heading of {n}°.', 'Set the {what}\'s rotation to {n}°.'],
          n: String(jr.int(1, 71) * 5), message: `I can't do that: there is no ${what} on the page.` };
      }
      if (v === 'photo') {
        const what = jr.pick(ABSENT_LAYERS);
        return { mode, what: [what], subject: what, templates: ['Rotate the {what} by {n}°.', 'Turn the {what} {n} degrees clockwise.', 'Set the rotation of the {what} to {n}°.'],
          n: String(jr.int(3, 40)), message: `I can't do that: there is no ${what} here, only the one photo.` };
      }
      const place = jr.pick([...LANDMARKS, ...env.content.STATIONS].filter((n) => !spec.places.some((p) => p.name === n)));
      return { mode, what: [place], subject: place, templates: ['Rotate the map so {what} is straight above the center marker.', 'Turn the map until {what} is directly up from the center dot.',
        'Spin the map so that {what} lies straight up from the center.'], message: `I can't do that: ${place} is not on this map.` };
    }
    // ambiguous: the goal is one of two candidates; the first is the stand-in the page starts on (the sampled goal).
    const mk = (ca, cb, a, b, extra) => ({ mode, cands: [ca, cb], a, b, ...extra });
    // Names only the candidate's own thing: the other faces / places on the page are not to be offered.
    if (v === 'cube') {
      const others = spec.faces.map((_, i) => i).filter((i) => i !== spec.target && (!spec.turntable || i < 4));
      const j = jr.pick(others);
      const a = faceDesc(spec, spec.target);
      const b = faceDesc(spec, j);
      const rest = spec.faces.map((_, i) => i).filter((i) => i !== spec.target && i !== j).map((i) => faceWords(spec, i));
      return mk(faceWords(spec, spec.target), faceWords(spec, j), a, b, { others: rest, message: `Which face should I bring to the front: ${a} or ${b}?`,
        templates: spec.turntable ? ['Spin the product so {a} or {b} faces you.', 'Turn the product until {a} or {b} is facing you.']
          : ['Rotate the cube so {a} or {b} faces you.', 'Bring {a} or {b} to the front of the cube.'] });
    }
    if (v === 'dial') {
      const b = otherDialValue(spec, spec.target, spec.kind === 'heading' ? 45 : (spec.max - spec.min) / 6, jr);
      const ta = spec.kind === 'heading' ? `${spec.target}°` : fmtValue(spec, spec.target);
      const tb = spec.kind === 'heading' ? `${b}°` : fmtValue(spec, b);
      const what = spec.kind === 'heading' ? 'heading dial' : `${spec.label} knob`;
      // the other numbers the dial is marked with must not be offered
      const ticks = [];
      for (let x = spec.min; x < spec.max + 1e-9 && ticks.length < 40; x += spec.major) if (spec.kind !== 'heading' || x < 360) ticks.push(round(x, 6));
      const others = ticks.filter((x) => ![spec.target, b].some((c) => Math.abs(Math.abs(c) - Math.abs(x)) < 1e-9)).map((x) => [String(x)]);
      return mk([spec.target.toFixed(spec.tdec), ta], [b.toFixed(spec.tdec), tb], ta, tb, { subject: what, others, message: `Which value should I set the ${what} to: ${ta} or ${tb}?`,
        templates: ['Set the {what} to {a} or {b}.', 'Turn the {what} to {a} or {b}.'] });
    }
    if (v === 'compass' && spec.mode === 'face') {
      const j = jr.pick(spec.places.map((p, i) => i).filter((i) => i !== spec.ref));
      const a = spec.places[spec.ref].name;
      const b = spec.places[j].name;
      const others = spec.places.filter((_, i) => i !== spec.ref && i !== j).map((q) => [q.name]);
      return mk([a], [b], a, b, { others, message: `Which place should I put straight up: ${a} or ${b}?`,
        templates: ['Rotate the map so {a} or {b} is straight above the center marker.', 'Turn the map until {a} or {b} is directly up from the center dot.'] });
    }
    // angles: orient (any mode), photo, compass bearing / north: two candidate degrees
    const turn = spec.scenario === 'photo' ? 'the photo rotation' : spec.scenario === 'compass' ? 'the map bearing' : 'the shape rotation';
    let ta = spec.target;
    if (spec.scenario === 'compass') ta = mod360(-spec.target);
    const pick = () => {
      for (let k = 0; k < 80; k++) {
        const x = spec.scenario === 'photo' ? Math.round(jr.float(-45, 45)) : jr.int(1, 71) * 5;
        const d = Math.abs(wrap180(x - ta));
        if (d >= 20) return x;
      }
      return mod360(ta + 90);
    };
    const tbv = pick();
    const fmt = (x) => `${Math.round(x * 2) / 2}°`;
    const aT = fmt(ta);
    const bT = fmt(tbv);
    // photo: the ruler's marks (-45, 0, 45) must not be offered
    const marks = spec.scenario === 'photo' ? [0, 45].filter((x) => ![ta, tbv].some((c) => Math.abs(Math.abs(c) - x) < 1e-9)).map((x) => [String(x)]) : [];
    return mk([String(Math.round(ta * 2) / 2), aT], [String(Math.round(tbv * 2) / 2), bT], aT, bT, { turn, others: marks, message: `Which angle should I use for ${turn}: ${aT} or ${bT}?`,
      templates: ['Set {turn} to {a} or {b} (clockwise).', 'Turn {turn} to {a} or {b}, clockwise.'] });
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const I = env.instruct;
    // through say, like every other instruction, so a judge episode reads like a normal one
    const vars = j.mode === 'ambiguous' ? { a: j.a, b: j.b, what: j.subject, turn: j.turn } : { what: j.subject, n: j.n };
    return I.say(rng, I.phrase(rng, j.templates, vars, spec.isplit), { isplit: spec.isplit, terse: I.fill(j.templates[0], vars) });
  }

  Object.assign(lib, { judgeOf, judgeInstruction, otherDialValue });
})();
