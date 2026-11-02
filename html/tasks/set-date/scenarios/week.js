/* set-date/scenarios/week.js: scenario sampling (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function sampleWeek(rng, spec, opts) {
    const scene = rng.pick(lib.WEEK_SCENES)(rng.fork('scene'), spec);
    const lv = spec.level;
    const ws = spec.weekStart;
    let today;
    let anchor;
    let ask;
    let start;
    if (rng.bool(0.35) && lv !== 'easy') {
      today = lib.randomDay(rng, '2021-02-01', '2031-11-30');
      const cap = lv ? 2 : 4;
      const pool = [];
      for (let n = -cap; n <= cap; n++) if (scene.dir === 'any' || n === 0 || (scene.dir === 'future') === n > 0) pool.push(n);
      const n = rng.pick(pool);
      const first = lib.fromDays(lib.days(lib.weekStartOf(today, ws)) + 7 * n);
      anchor = lib.fromDays(lib.days(first) + rng.int(0, 6));
      ask = { askKind: 'relToday', ask: lib.relUnit(rng, n, 'week') };
      start = lib.monthOf(today);
    } else {
      anchor = lib.randomDay(rng, '2021-02-01', '2031-11-30');
      start = lv ? lib.clampKey(lib.addMonths(lib.monthOf(anchor), lv === 'easy' ? 0 : rng.pick([-1, 1])), lib.EPOCH.first, lib.EPOCH.last)
        : lib.startNear(rng, lib.monthOf(anchor), opts.ood ? 24 : 10, lib.EPOCH.last);
      today = lib.dayInMonth(rng, start);
      const k = rng.pick(lv === 'easy' ? ['long'] : ['long', 'longDay', 'dmy', 'iso']);
      ask = { askKind: k, ask: `${rng.pick(['the week containing', 'the week that includes'])} ${lib.fmtDate(anchor, k)}` };
    }
    if (!lib.inEpoch(anchor) || !lib.inEpoch(today)) return null;
    return Object.assign(spec, { scene, target: lib.weekStartOf(anchor, ws), anchor, today, start, showToday: true, askKind: ask.askKind, ask: ask.ask });
  }

  env.scenario('set-date', { name: 'week', sample: sampleWeek });
})();
