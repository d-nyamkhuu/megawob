/* set-date/scenarios/range.js: scenario sampling (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function sampleRange(rng, spec, opts) {
    const tr = opts.traits || {};
    const scene = rng.pick(lib.RANGE_SCENES)(rng.fork('scene'), spec);
    const rule0 = scene.unit ? rng.pick(['plain', 'plain', 'booked', 'minmax']) : rng.pick(['plain', 'plain', 'booked']);
    const rule = spec.level ? 'plain' : rule0;
    const lvl = spec.level ? rng.fork('level') : null;
    const maxLen = spec.level ? (spec.level === 'easy' ? 5 : 10) : opts.ood ? 45 : 21;
    const cross = rng.bool(0.22) && !spec.level;
    let s;
    if (cross) {
      const y = rng.int(2021, 2030);
      s = lib.isoOf(y, 12, rng.int(14, 30));
    } else s = lib.randomDay(rng, '2021-01-01', '2031-11-20');
    let n = rng.int(1, maxLen);
    if (cross) n = Math.max(n, lib.days(`${+s.slice(0, 4) + 1}-01-01`) - lib.days(s) + rng.int(0, 6));
    const near = (key, off) => (lvl ? lib.clampKey(lib.addMonths(key, spec.level === 'easy' ? 0 : lvl.int(-1, 1)), lib.EPOCH.first, lib.addMonths(lib.EPOCH.last, -1)) : lib.startNear(rng, key, off, lib.addMonths(lib.EPOCH.last, -1)));
    let today = lib.dayInMonth(rng, near(lib.monthOf(s), opts.ood ? 14 : 8));
    let ask;
    let booked = [];
    let minN = 0;
    let maxN = 0;
    if (rule === 'booked') {
      // Booked days around the stay; the target is the earliest free stretch of n nights from an anchor.
      const lo = lib.days(s) - 20;
      const hi = lib.days(s) + n + 25;
      const set = new Set();
      for (let d = lo; d <= hi; d++) if (rng.bool(0.12)) set.add(lib.fromDays(d));
      // A booked day right where a naive pick (the anchor) would start, when possible.
      const anchor = lib.fromDays(lib.days(s) - rng.int(1, 6));
      for (let d = lib.days(anchor); d < lib.days(s); d++) if (rng.bool(0.45)) set.add(lib.fromDays(d));
      for (let d = lib.days(s); d <= lib.days(s) + n; d++) set.delete(lib.fromDays(d));
      // s must be the earliest start >= anchor with n free nights.
      const free = (st) => { for (let d = st; d <= st + n; d++) if (set.has(lib.fromDays(d))) return false; return true; };
      let first = lib.days(anchor);
      while (!free(first)) first++;
      if (lib.fromDays(first) !== s) {
        // Force it: block one day inside every earlier candidate window.
        for (let st = lib.days(anchor); st < lib.days(s); st++) if (free(st)) set.add(lib.fromDays(Math.min(st + rng.int(0, n), lib.days(s) - 1)));
        first = lib.days(anchor);
        while (!free(first)) first++;
        if (lib.fromDays(first) !== s) return null;
      }
      booked = [...set].sort();
      if (scene.unit && rng.bool(0.6)) {
        ask = { askKind: 'firstFree', ask: `the earliest ${n}-${scene.unit} stay starting on or after ${lib.fmtDate(anchor, 'long')} with no unavailable dates` };
      }
    } else if (rule === 'minmax') {
      minN = rng.int(2, 4);
      maxN = minN + rng.int(4, opts.ood ? 30 : 12);
      const kind = rng.pick(['minStay', 'maxStay', 'plain']);
      n = kind === 'minStay' ? minN : kind === 'maxStay' ? maxN : rng.int(minN, maxN);
      if (kind !== 'plain') ask = { askKind: kind, ask: `${lib.fmtDate(s, 'long')} for the ${kind === 'minStay' ? 'shortest' : 'longest'} stay allowed` };
    }
    if (!ask && scene.unit && rng.bool(0.25) && !spec.level) {
      // Relative to the shown today: "this coming Friday for 3 nights".
      const rel = lib.relToday(rng, today, 'future');
      if (rel.target > today && lib.days(rel.target) - lib.days(today) < 60 && rule !== 'booked') {
        s = rel.target;
        ask = { askKind: 'relToday', ask: `${rel.ask} for ${n} ${scene.unit}${n > 1 ? 's' : ''}` };
      }
    }
    const e = lib.fromDays(lib.days(s) + n);
    if (!ask) ask = lib.rangeAsk(rng, s, e, spec.level === 'easy' ? { ...scene, unit: undefined } : scene);
    if (!lib.inEpoch(s) || !lib.inEpoch(e) || !lib.inEpoch(today)) return null;
    const start = ask.askKind === 'relToday' ? lib.monthOf(today) : near(lib.monthOf(s), opts.ood ? 14 : 8);
    if (ask.askKind !== 'relToday') today = lib.dayInMonth(rng, start);
    return Object.assign(spec, { scene, target: { start: s, end: e }, start: lib.clampKey(start, lib.EPOCH.first, lib.addMonths(lib.EPOCH.last, -1)), today, rule,
      booked, minN, maxN, cross: lib.ymd(s)[0] !== lib.ymd(e)[0], showToday: ask.askKind === 'relToday', askKind: ask.askKind, ask: ask.ask,
      ...(tr.inline ? { inline: true } : {}), ...(tr.splitCals ? { splitCals: true } : {}) });
  }

  env.scenario('set-date', { name: 'range', sample: sampleRange });
})();
