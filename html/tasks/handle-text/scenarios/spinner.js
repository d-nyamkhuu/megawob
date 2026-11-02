/* handle-text/scenarios/spinner.js: scenario sampling; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;

  function sampleSpinner(rng, spec, opts) {
    const s = { ...rng.pick(lib.SPINNERS) };
    const mode = rng.pick(['click', 'click', 'type', 'hold']);
    const lo = s.min === null ? -Infinity : Math.round(s.min / s.step);
    const hi = s.max === null ? Infinity : Math.round(s.max / s.step);
    const [dLo, dHi] = mode === 'click' ? [2, 12] : mode === 'type' ? [30, 200] : spec.ood ? [80, 150] : [25, 60];
    let start;
    let target;
    for (let k = 0; k < 200; k++) {
      if (mode === 'click' && s.min === null && s.max === null && s.step === 1 && rng.bool(0.5)) start = 0;
      else start = Number.isFinite(lo) ? lo + rng.int(0, 40) : rng.int(-20, 40);
      if (s.label === 'Temperature') start = rng.int(30, 50);
      const d = rng.int(dLo, dHi) * (rng.bool() ? 1 : -1);
      target = start + d;
      if (target >= lo && target <= hi && start >= lo && start <= hi) break;
    }
    const route = mode === 'click' ? (rng.bool(0.25) ? 'keys' : 'buttons') : mode;
    return { ...s, mode, min: Number.isFinite(lo) ? lo : null, max: Number.isFinite(hi) ? hi : null, start, target,
      editable: mode === 'type' || (mode === 'click' && rng.bool(0.4)), route, stepMs: opts.stepMs || 1000 };
  }
  env.scenario('handle-text', { name: 'spinner', sample: sampleSpinner });
})();
