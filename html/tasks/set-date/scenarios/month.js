/* set-date/scenarios/month.js: scenario sampling (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function sampleMonth(rng, spec, opts) {
    const scene = rng.pick(lib.MONTH_SCENES)(rng.fork('scene'), spec);
    const lv = spec.level;
    let today;
    let target;
    let ask;
    let start;
    if (rng.bool(0.3) && lv !== 'easy') {
      today = lib.randomDay(rng, '2021-01-01', '2031-12-31');
      const cap = lv ? 2 : 6;
      const pool = [];
      for (let n = -cap; n <= cap; n++) if (n !== 0 && (scene.dir === 'any' || (scene.dir === 'future') === n > 0)) pool.push(n);
      const n = rng.pick(pool);
      target = lib.addMonths(lib.monthOf(today), n);
      ask = { askKind: 'relToday', ask: lib.relUnit(rng, n, 'month') };
      start = lib.monthOf(today);
    } else {
      const t = lib.randomDay(rng, '2021-03-01', '2031-09-30');
      target = lib.monthOf(t);
      const ty = +target.slice(0, 4);
      start = lv ? lib.monthKey(Math.min(2031, Math.max(2021, ty + (lv === 'easy' ? 0 : rng.pick([-1, 1])))), rng.int(1, 12))
        : lib.startNear(rng, target, opts.ood ? 36 : 14, lib.EPOCH.last);
      today = lib.dayInMonth(rng, start);
      const style = lv === 'easy' ? 'long' : rng.pick(['long', 'short', 'num', 'iso']);
      ask = { askKind: style, ask: lib.monthName(target, style) };
    }
    if (!lib.inYears(target) || !lib.inYears(start)) return null;
    return Object.assign(spec, { scene, target, today, start, showToday: ask.askKind === 'relToday', askKind: ask.askKind, ask: ask.ask });
  }

  env.scenario('set-date', { name: 'month', sample: sampleMonth });
})();
