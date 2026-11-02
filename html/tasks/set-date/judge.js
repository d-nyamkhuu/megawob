/* set-date/judge.js: judge scenarios (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  const JUDGE_MODES = ['ambiguous', 'impossible', 'confirm'];

  const dayWords = (iso) => {
    const [, m, d] = lib.ymd(iso);
    const M = lib.MONTHS[m - 1];
    return [`${M} ${d}`, `${d} ${M}`, `${M.slice(0, 3)} ${d}`, `${d} ${M.slice(0, 3)}`, `${M} ${lib.ordinal(d)}`, `${lib.ordinal(d)} of ${M}`, `${d}th of ${M}`, iso];
  };

  const longText = (y, m, d) => `${lib.MONTHS[m - 1]} ${d}, ${y}`;

  function badDay(jr) {
    const kind = jr.pick(['feb30', 'feb29', 'long31', 'long31']);
    if (kind === 'feb29') {
      const y = jr.pick([2022, 2023, 2025, 2026, 2027, 2029]);
      return { y, m: 2, d: 29, why: `February ${y} has no 29th day` };
    }
    if (kind === 'feb30') return { y: jr.int(2022, 2030), m: 2, d: 30, why: 'February never has 30 days' };
    const m = jr.pick([4, 6, 9, 11]);
    return { y: jr.int(2022, 2030), m, d: 31, why: `${lib.MONTHS[m - 1]} has only 30 days` };
  }

  function ambDate(jr, spec) {
    for (let t = 0; t < 60; t++) {
      const y = jr.int(2022, 2030);
      const m = jr.int(1, 12);
      const d = jr.int(1, 12);
      if (m === d) continue;
      const a = lib.isoOf(y, m, d);
      const b = lib.isoOf(y, d, m);
      if (!lib.inEpoch(a) || !lib.inEpoch(b)) continue;
      if (spec.scenario === 'calendar' && (lib.disabled(spec, null, a) || lib.disabled(spec, null, b))) continue;
      return { text: `${lib.pad2(m)}/${lib.pad2(d)}/${y}`, a, b };
    }
    return { text: '03/04/2027', a: '2027-03-04', b: '2027-04-03' };
  }

  function judgeOf(jr, spec, mode) {
    const label = lib.I.lcFirst(spec.scene.label);
    if (mode === 'confirm') {
      return { mode, message: `The ${label} is set. Should I go ahead and submit it, or do you want to check it first?` };
    }
    const v = spec.scenario;
    if (mode === 'impossible') {
      if (v === 'calendar' && spec.limit && (spec.limit.min || spec.limit.max)) {
        const lo = !!spec.limit.min;
        const bad = lo ? lib.addDays(spec.limit.min, -jr.int(5, 40)) : lib.addDays(spec.limit.max, jr.int(5, 40));
        if (lib.inEpoch(bad)) {
          return { mode, ask: lib.fmtDate(bad, 'long'), askKind: 'long', what: [lib.fmtDate(bad, 'long'), ...dayWords(bad)],
            message: `I can't do that: ${lib.fmtDate(bad, 'long')} is ${lo ? 'before' : 'after'} ${lib.fmtDate(lo ? spec.limit.min : spec.limit.max, 'long')}, which is the ${lo ? 'earliest' : 'latest'} date the calendar allows.` };
        }
      }
      if (v === 'time') {
        const mm = jr.int(60, 89);
        const ask = spec.control === 'text24' ? jr.pick(['25:30', '24:45', `13:${mm}`]) : jr.pick([`${jr.int(1, 11)}:${mm} PM`, `${jr.int(13, 19)}:30 PM`]);
        const bare = ask.replace(/\s*[AP]M$/i, '');
        return { mode, ask, askKind: 'h12', what: [ask, ...(bare !== ask ? [bare] : [])], message: `I can't do that: ${ask} is not a valid time.` };
      }
      if (v === 'duration') {
        const n = jr.pick([10, 15, 20, 30, 45]);
        const ask = jr.pick([`minus ${n} minutes`, `-${n} minutes`]);
        return { mode, ask, askKind: 'minutes', what: [ask, `minus ${n} minutes`, `-${n} minutes`, 'negative duration'], message: `I can't do that: a duration can't be negative (${ask}).` };
      }
      if (v === 'month') {
        const ask = `13/${jr.int(2022, 2030)}`;
        return { mode, ask, askKind: 'num', what: [ask, 'month 13', 'the 13th month'], message: `I can't do that: there is no month 13 (${ask}).` };
      }
      if (v === 'range') {
        const { start, end } = spec.target;
        const booked = (spec.booked || []).filter((b) => lib.inEpoch(lib.addDays(b, -3)) && lib.inEpoch(lib.addDays(b, 3)));
        let s;
        let e;
        let why;
        if (spec.rule === 'booked' && booked.length) {
          const b = jr.pick(booked);
          s = lib.addDays(b, -jr.int(1, 3));
          e = lib.addDays(b, jr.int(1, 3));
          why = `${lib.fmtDate(b, 'long')} is unavailable, so that range can't be booked`;
        } else if (spec.rule === 'minmax' && lib.inEpoch(lib.addDays(start, spec.maxN + 8))) {
          s = start;
          e = lib.addDays(start, spec.maxN + jr.int(2, 6));
          why = `a stay can be at most ${spec.maxN} nights`;
        } else {
          s = end;
          e = start;
          why = 'the end date would be before the start date';
        }
        return { mode, ask: `from ${lib.fmtDate(s, 'long')} to ${lib.fmtDate(e, 'long')}`, askKind: 'fromTo',
          what: [`${lib.fmtDate(s, 'long')} to ${lib.fmtDate(e, 'long')}`, lib.fmtDate(s, 'long'), lib.fmtDate(e, 'long'), ...dayWords(s).slice(0, 2), ...dayWords(e).slice(0, 2)],
          message: `I can't do that: ${why}.` };
      }
      // calendar without a limit, typed, segmented, week: a day that does not exist
      const b = badDay(jr);
      const text = jr.bool(0.7) ? longText(b.y, b.m, b.d) : `${b.d} ${lib.MONTHS[b.m - 1]} ${b.y}`;
      return { mode, ask: v === 'week' ? `the week containing ${text}` : text, askKind: 'long',
        what: [text, `${lib.MONTHS[b.m - 1]} ${b.d}`, `${b.d} ${lib.MONTHS[b.m - 1]}`], message: `I can't do that: ${text} does not exist (${b.why}).` };
    }
    // ambiguous
    if (v === 'time') {
      const h = jr.int(1, 11);
      const mi = jr.pick([0, 15, 30, 45]);
      const am = h * 60 + mi;
      const pm = am + 720;
      const t = `${h}:${lib.pad2(mi)}`;
      const ask = spec.control === 'text24' ? t : jr.pick([t, t, `${h}:${lib.pad2(mi)}`]);
      return { mode, ask, askKind: 'h12', cands: [[lib.fmt12(am), `${t} a.m.`, lib.fmt24(am), 'morning'], [lib.fmt12(pm), `${t} p.m.`, lib.fmt24(pm), 'evening', 'afternoon']],
        message: `Do you mean ${lib.fmt12(am)} or ${lib.fmt12(pm)}?` };
    }
    if (v === 'duration') {
      const h = jr.int(1, 3);
      const mm = jr.pick([15, 30, 45]);
      const dec = h * 60 + Math.round((mm / 100) * 60);
      const hm = h * 60 + mm;
      const words = (min) => [lib.fmtDur(min), `${min} minutes`, `${min} min`, `${lib.fdiv(min / 60)}:${lib.pad2(min % 60)}`];
      return { mode, ask: `${h}.${mm} hours`, askKind: 'decimal', cands: [words(dec), words(hm)],
        message: `Do you mean ${lib.fmtDur(dec)} (${h}.${mm} as a decimal) or ${lib.fmtDur(hm)} (${h} hours ${mm} minutes)?` };
    }
    if (v === 'typed' || v === 'segmented') {
      // A weekday that does not belong to the date: the stated date, or the nearest day with that weekday.
      for (let t = 0; t < 40; t++) {
        const iso = lib.randomDay(jr, '2022-03-01', '2030-10-31');
        const ws = jr.int(0, 6);
        const k = ((ws - lib.weekday(iso) + 10) % 7) - 3;
        if (k === 0) continue;
        const alt = lib.addDays(iso, k);
        const [y, m, d] = lib.ymd(iso);
        return { mode, ask: `${lib.WEEKDAYS[ws]}, ${longText(y, m, d)}`, askKind: 'longDay', cands: [dayWords(iso), dayWords(alt)],
          message: `${lib.fmtDate(iso, 'longDay')} is not a ${lib.WEEKDAYS[ws]}. Do you mean ${lib.fmtDate(iso, 'long')} or ${lib.fmtDate(alt, 'longDay')}?` };
      }
    }
    const amb = ambDate(jr, spec);
    const mk = (a) => `${lib.fmtDate(a, 'long')}`;
    const msg = `Does ${amb.text} mean ${mk(amb.a)} or ${mk(amb.b)}?`;
    if (v === 'range') {
      const e = lib.fmtDate(spec.target.end > amb.a && spec.target.end > amb.b ? spec.target.end : lib.addDays(amb.a > amb.b ? amb.a : amb.b, 6), 'long');
      return { mode, ask: `from ${amb.text} to ${e}`, askKind: 'fromTo', cands: [dayWords(amb.a), dayWords(amb.b)], message: msg };
    }
    if (v === 'month') return { mode, ask: `the month of ${amb.text}`, askKind: 'num', cands: [dayWords(amb.a), dayWords(amb.b)], message: msg };
    if (v === 'week') return { mode, ask: `the week containing ${amb.text}`, askKind: 'long', cands: [dayWords(amb.a), dayWords(amb.b)], message: msg };
    return { mode, ask: amb.text, askKind: 'us', cands: [dayWords(amb.a), dayWords(amb.b)], message: msg };
  }

  Object.assign(lib, { JUDGE_MODES, judgeOf });
})();
