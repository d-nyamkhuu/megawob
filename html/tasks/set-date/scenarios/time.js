/* set-date/scenarios/time.js: scenario sampling (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function sampleTime(rng, spec, opts) {
    const scene = rng.pick(lib.TIME_SCENES)(rng.fork('scene'), spec);
    const controls = (opts.traits && opts.traits.timeControls) || ['spin', 'columns', 'text24', 'clock'];
    const L = lib.loc(spec);
    const control = L.time24 && controls.includes('text24') && rng.bool(0.35) ? 'text24' : rng.pick(controls);
    const step = control === 'text24' ? 1 : 5;
    let target = rng.int(0, 1440 / step - 1) * step;
    let ask;
    let askKind = 'h12';
    const words = lib.timeWords(rng, target);
    if (words && rng.bool(0.4)) { ask = words; askKind = 'words'; } else if (control === 'text24') ask = lib.fmt12(target, rng.bool(0.3));
    else if (rng.bool(0.35)) { ask = lib.fmt24(target); askKind = 'h24'; } else ask = lib.fmt12(target, rng.bool(0.15));
    let keys = control === 'spin' && rng.bool(0.35);
    if (control === 'spin' && opts.route === 'keyboard') keys = true;
    else if (control === 'spin' && opts.route === 'pointer') keys = false;
    if (spec.level) {
      // easy: on the half hour, medium: on the quarter hour; plain 12-hour asks (24-hour for the 24-hour field)
      const grid = spec.level === 'easy' ? 30 : 15;
      target = Math.round(target / grid) * grid % 1440;
      askKind = control === 'text24' ? 'h24' : 'h12';
      ask = control === 'text24' ? lib.fmt24(target) : lib.fmt12(target);
    }
    return Object.assign(spec, { scene, control, step, target, ask, askKind, keys });
  }

  env.scenario('set-date', { name: 'time', sample: sampleTime });
})();
