/* set-date/scenarios/typed.js: scenario sampling (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function sampleTyped(rng, spec, opts) {
    const scene = rng.pick(lib.DATE_SCENES)(rng.fork('scene'), spec);
    const L = spec.locale;
    const mask = rng.bool(0.2) ? rng.pick(lib.MASKS) : lib.LOCALE_MASK[L] || 'MM/DD/YYYY';
    const letters = lib.LOCAL_LETTERS[L] && rng.bool(0.5) ? lib.LOCAL_LETTERS[L] : null;
    const maskShown = letters ? mask.replace(/[DMY]/g, (c) => letters[c]) : mask;
    const today = lib.randomDay(rng, '2021-01-01', '2031-12-31');
    // Trait typedFormat 'long' | 'longDay' | 'either': the field takes free text in that long form (parseLong).
    const tf = opts && opts.traits && opts.traits.typedFormat;
    const longForm = tf ? (tf === 'either' ? rng.fork('longForm').pick(['long', 'longDay']) : tf) : null;
    let target;
    let ask;
    if (rng.bool(0.25) && !spec.level) {
      ask = lib.relToday(rng, today, scene.dir);
      target = ask.target;
    } else {
      target = lib.randomDay(rng, '2021-01-01', '2031-12-31');
      // easy: the ask is already in the field's own format (nothing to convert); medium: no relative phrases
      const own = longForm || lib.MASK_ASK[mask] || 'iso';
      ask = lib.dateAsk(rng, target, spec.level === 'easy' ? [own] : lib.DATE_ASKS.filter((k) => k !== 'relative' && k !== lib.MASK_ASK[mask] && k !== longForm));
    }
    if (!lib.inEpoch(target)) return null;
    return Object.assign(spec, { scene, target, today, mask, maskShown, showToday: ask.askKind === 'relToday' || rng.bool(0.3),
      askKind: ask.askKind, ask: ask.ask,
      ...(longForm ? { longForm, longShown: longForm === 'longDay' ? 'Weekday, Month D, YYYY' : 'Month D, YYYY' } : {}) });
  }

  Object.assign(lib, { sampleTyped });

  env.scenario('set-date', { name: 'typed', sample: sampleTyped });
})();
