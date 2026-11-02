/* set-date/scenarios/calendar.js: scenario sampling (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function sampleCalendar(rng, spec, opts) {
    const scene = rng.pick(lib.DATE_SCENES)(rng.fork('scene'), spec);
    const tr = opts.traits || {};
    const header = rng.pick(tr.headers || ['arrows', 'arrows', 'yearGrid', 'selects', 'selects']);
    const todayBtn = tr.todayBtn !== undefined ? !!tr.todayBtn : rng.bool(0.4);
    let today;
    let target;
    let ask;
    const r = rng.next();
    if (r < 0.3) {
      today = lib.randomDay(rng, '2021-01-01', '2031-12-31');
      ask = lib.relToday(rng, today, scene.dir);
      target = ask.target;
    } else if (r < 0.35 && todayBtn) {
      today = lib.randomDay(rng, '2021-01-01', '2031-12-31');
      target = today;
      ask = { askKind: 'today', ask: rng.pick([
        "today's date", 'today', 'the current date', 'this day', 'today as shown'
      ]) };
    } else {
      target = lib.randomDay(rng, '2021-01-01', '2031-12-31');
      const maxOff = opts.ood ? 36 : 14;
      const lv = spec.level ? rng.fork('level') : null;
      const start = lv ? lib.clampKey(lib.addMonths(lib.monthOf(target), spec.level === 'easy' ? 0 : lv.int(-1, 1)), lib.EPOCH.first, lib.EPOCH.last)
        : lib.startNear(rng, lib.monthOf(target), maxOff, lib.EPOCH.last);
      today = lib.dayInMonth(rng, start);
      ask = lib.dateAsk(rng, target, lv && spec.level === 'easy' ? lib.DATE_ASKS.filter((k) => k !== 'relative') : lib.DATE_ASKS);
    }
    if (!lib.inEpoch(target) || !lib.inEpoch(today)) return null;
    let limit = null;
    if (rng.bool(0.3)) {
      if (scene.dir !== 'past' && target >= today) limit = { min: today };
      else if (scene.dir === 'past' && target <= today) limit = { max: today };
    }
    if (spec.level === 'easy') limit = null;
    return Object.assign(spec, { scene, target, today, start: lib.monthOf(today), header, yearSelect: header === 'yearGrid', todayBtn, limit,
      showToday: true, askKind: ask.askKind, ask: ask.ask,
      ...(tr.todayMode ? { todayMode: tr.todayMode } : {}), ...(tr.inline ? { inline: true } : {}) });
  }

  env.scenario('set-date', { name: 'calendar', sample: sampleCalendar });
})();
