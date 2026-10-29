/* set-date/scenarios/duration.js: scenario sampling (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function sampleDuration(rng, spec, opts) {
    const scene = rng.pick(lib.DUR_SCENES)(rng.fork('scene'), spec);
    const control = rng.pick(['spin', 'fields', 'presets']);
    const step = control === 'fields' ? 1 : rng.bool(0.75) ? 5 : 15;
    const hi = opts.ood ? 600 : 300;
    let target = rng.int(Math.ceil(10 / step), lib.fdiv(hi / step)) * step;
    if (control === 'fields' && rng.bool(0.5)) target = rng.int(2, lib.fdiv(hi / 5)) * 5;
    const presets = control === 'presets' ? rng.sample([15, 30, 45, 60, 90, 120, 180, 240], rng.int(4, 6)).sort((a, b) => a - b) : null;
    if (spec.level) {
      // easy: preset chips, one click; medium: any control, multiples of 15 minutes; both ask "1 h 25 min" / "85 minutes"
      const lv = rng.fork('level');
      const ps = lv.sample([15, 30, 45, 60, 90, 120, 180, 240], 5).sort((a, b) => a - b);
      const t = spec.level === 'easy' ? lv.pick(ps) : Math.max(15, Math.round(target / 15) * 15);
      const kind = lv.pick(['hm', 'minutes']);
      const c = spec.level === 'easy' ? 'presets' : control;
      return Object.assign(spec, { scene, control: c, step: c === 'fields' ? 1 : 15, target: t, presets: c === 'presets' ? ps : null,
        askKind: kind, ask: kind === 'hm' ? lib.fmtDur(t) : `${t} minutes` });
    }
    return Object.assign(spec, { scene, control, step, target, presets, ...lib.durAsk(rng, target) });
  }

  env.scenario('set-date', { name: 'duration', sample: sampleDuration });
})();
