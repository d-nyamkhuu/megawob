/* set-date/reporting.js: facts, parts, silent saves and retargeting (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function parts(model, spec) {
    const v = lib.valueOf(model, spec);
    const { label, label2, extra } = spec.scene;
    const rows = (extra || []).map(([k, x]) => ({ name: k, value: x })); // the unscored rows around the control: never changed
    if (spec.scenario === 'range') return [{ name: label, value: v && v.start ? v.start : null }, { name: label2 || 'End', value: v && v.end ? v.end : null }, ...rows];
    // segmented: the error moves with every segment (segErr), so an unfinished date shows its segments; a stop reply
    // after a segment step must name the field.
    if (spec.scenario === 'segmented' && v == null) return [{ name: label, value: [model.y, model.m, model.d].map((x) => x || '').join('-') }, ...rows];
    return [{ name: label, value: v == null ? null : v }, ...rows];
  }

  const fmtLoc = (iso, spec, style) => (lib.C.formatDate ? lib.C.formatDate(iso, spec.locale, style) : lib.fmtDate(iso, 'long'));

  const weekdayName = (spec, iso) => (lib.loc(spec).weekdays || lib.WEEKDAYS)[lib.weekday(iso)];

  const uniqAl = (value, list) => [...new Set(list.filter((x) => x && x !== value))];

  function facts(model, spec) {
    const v = lib.valueOf(model, spec);
    const L = spec.scene.label;
    // Nothing (or nothing parseable) entered yet, e.g. the start model of an off start: the labels still count.
    const SECOND = { range: [spec.scene.label2 || 'End', 'Length'], time: ['Part of the day'], duration: ['Total minutes'],
      month: ['Days in the month'], week: ['Week starts on'] };
    if (v == null || (spec.scenario === 'range' && (!v.start || !v.end))) {
      return [L, ...(SECOND[spec.scenario] || ['Day of the week'])].map((label) => ({ label, value: 'not set', aliases: ['none', 'empty'] }));
    }
    const dateFact = (iso, label) => {
      // No comma in the value: free-text replies split clauses at ', ' (words() makes the two spellings equal anyway).
      const shown = fmtLoc(iso, spec, 'long');
      const value = shown.replace(/[,;.]\s*/g, ' ');
      return { label, value, aliases: uniqAl(value, [shown, fmtLoc(iso, spec, 'short'), fmtLoc(iso, spec, 'medium'), fmtLoc(iso, spec, 'full'), iso, lib.fmtDate(iso, 'long')]) };
    };
    if (spec.scenario === 'range') {
      const n = lib.days(v.end) - lib.days(v.start);
      const unit = spec.scene.unit || 'day';
      return [dateFact(v.start, L), dateFact(v.end, spec.scene.label2 || 'End'),
        { label: 'Length', value: `${n} ${unit}${n === 1 ? '' : 's'}`, aliases: [String(n), `${n} ${unit === 'night' ? 'nights' : 'days'}`] }];
    }
    if (spec.scenario === 'time') {
      const value = spec.control === 'text24' ? lib.fmt24(v) : lib.fmt12(v);
      const hr = lib.fdiv(v / 60);
      return [{ label: L, value, aliases: uniqAl(value, [lib.fmt12(v), lib.fmt24(v), lib.fmt12(v, true)]) },
        { label: 'Part of the day', value: hr < 5 ? 'night' : hr < 12 ? 'morning' : hr < 18 ? 'afternoon' : 'evening', aliases: [v >= 720 ? 'PM' : 'AM'] }];
    }
    if (spec.scenario === 'duration') {
      return [{ label: L, value: lib.fmtDur(v), aliases: [`${v} minutes`, `${v} min`] },
        { label: 'Total minutes', value: String(v), aliases: [`${v} minutes`] }];
    }
    if (spec.scenario === 'month') {
      const [y, m] = [+v.slice(0, 4), +v.slice(5, 7)];
      const value = fmtLoc(`${v}-01`, spec, 'monthYear');
      return [{ label: L, value, aliases: uniqAl(value, [lib.monthName(v, 'long'), lib.monthName(v, 'short'), lib.monthName(v, 'num'), v]) },
        { label: 'Days in the month', value: String(lib.daysInMonth(y, m)), aliases: [`${lib.daysInMonth(y, m)} days`] }];
    }
    if (spec.scenario === 'week') {
      const last = lib.addDays(v, 6);
      const shownWeek = `${fmtLoc(v, spec, 'short')} – ${fmtLoc(last, spec, 'short')}`;
      const value = shownWeek.replace(/[,;.]\s*/g, ' ');
      return [{ label: L, value, aliases: uniqAl(value, [shownWeek, `${lib.fmtDate(v, 'short')} - ${lib.fmtDate(last, 'short')}`, `${lib.fmtDate(v, 'long')} to ${lib.fmtDate(last, 'long')}`]) },
        { label: 'Week starts on', value: weekdayName(spec, v), aliases: [] }];
    }
    return [dateFact(v, L), { label: 'Day of the week', value: weekdayName(spec, v), aliases: [] }];
  }

  function nearDays(iso, ok) {
    const [y, m, d] = lib.ymd(iso);
    const out = [lib.addDays(iso, 1), lib.addDays(iso, -1)];
    if (d <= 12 && d !== m) out.push(lib.isoOf(y, d, m));
    return out.filter((x) => x !== iso && lib.ymd(x) && lib.inEpoch(x) && ok(x));
  }

  function silent(next, prev, spec, rng) {
    const v = spec.scenario;
    const m = env.util.clone(next);
    const T = spec.target;
    const val = lib.valueOf(next, spec);
    const pickOne = (xs) => (xs.length ? rng.pick(xs) : null);
    let out = null;
    if (v === 'calendar' || v === 'typed' || v === 'segmented') {
      if (val !== T) return null;
      const nd = pickOne(nearDays(T, (x) => !(v === 'calendar' && lib.disabled(spec, next, x))));
      if (!nd) return null;
      if (v === 'calendar') { m.value = nd; m.view = lib.monthOf(nd); } else if (v === 'typed') m.text = lib.typedText(spec, nd);
      else Object.assign(m, lib.segsOf(nd), { focus: '' });
      out = m;
    } else if (v === 'month') {
      if (val !== T) return null;
      const nm = pickOne([lib.addMonths(T, 1), lib.addMonths(T, -1)].filter(lib.inYears));
      if (!nm) return null;
      m.value = nm;
      m.view = nm;
      out = m;
    } else if (v === 'week') {
      if (val !== T) return null;
      const nw = pickOne([lib.addDays(T, 7), lib.addDays(T, -7)].filter((x) => lib.inEpoch(x)));
      if (!nw) return null;
      m.value = nw;
      m.view = lib.monthOf(nw);
      out = m;
    } else if (v === 'range') {
      const ends = ['start', 'end'].filter((k) => val[k] === T[k]);
      const bookedIn = (a, b) => (spec.booked || []).some((x) => x >= a && x <= b);
      const okRange = (a, b) => {
        const n = lib.days(b) - lib.days(a);
        return n >= 1 && !bookedIn(a, b) && (spec.rule !== 'minmax' || (n >= spec.minN && n <= spec.maxN));
      };
      const cands = [];
      for (const k of ends) {
        for (const x of nearDays(T[k], () => true)) {
          const a = k === 'start' ? x : val.start;
          const b = k === 'end' ? x : val.end;
          if (val.start && val.end && okRange(a, b)) cands.push({ k, x });
        }
      }
      const c = pickOne(cands);
      if (!c) return null;
      m[c.k] = c.x;
      out = m;
    } else if (v === 'time') {
      if (val !== T) return null;
      const step = spec.step || 5;
      const nv = pickOne([(T + 720) % 1440, (T + step) % 1440, (T - step + 1440) % 1440].filter((x) => x !== T));
      if (nv === null) return null;
      if (spec.control === 'text24') m.text = lib.fmt24(nv);
      else if (spec.control === 'dropdowns') { const p = lib.parts12(nv); Object.assign(m, { h: p.h, m: p.m, ap: p.ap }); } else m.value = nv;
      out = m;
    } else if (v === 'duration') {
      if (val !== T) return null;
      const step = spec.step || 5;
      const hi = spec.control === 'spin' ? 12 * 60 + 55 : 720;
      const cands = [Math.round(T / 15) * 15, T + step, T - step].filter((x) => x !== T && x >= 0 && x <= hi);
      const nv = pickOne(cands);
      if (nv === null) return null;
      if (spec.control === 'fields') Object.assign(m, { h: String(lib.fdiv(nv / 60)), m: String(nv % 60) });
      else m.value = nv;
      out = m;
    }
    return out && lib.errorOf(out, spec) > 0 ? out : null;
  }

  function relPhrase(rng, today, target) {
    const n = lib.days(target) - lib.days(today);
    if (n === 1) return rng.pick(['tomorrow', 'a day from today']);
    if (n === -1) return 'yesterday';
    if (n === 2) return 'the day after tomorrow';
    if (n >= 3 && n <= 20) return rng.pick([`in ${n} days`, `${n} days from today`]);
    if (n >= 7 && n <= 42 && n % 7 === 0) return `in ${n / 7} weeks`;
    if (n <= -2 && n >= -20) return `${-n} days ago`;
    return null;
  }

  function retarget(spec, model, rng) {
    if (spec.judge) return null;
    const v = spec.scenario;
    const sp = env.util.clone(spec);
    const cur = lib.valueOf(model, spec);
    const level = spec.level;
    const same = (x) => lib.sameJson(x, cur);
    const done = () => (lib.errorOf(model, sp) > 0 ? sp : null);
    if (v === 'calendar' || v === 'typed' || v === 'segmented') {
      for (let t = 0; t < 60; t++) {
        const iso = lib.addDays(spec.target, rng.pick([-1, 1]) * rng.int(1, 45));
        if (iso === spec.target || iso === cur || !lib.inEpoch(iso) || (v === 'calendar' && lib.disabled(spec, null, iso))) continue;
        sp.target = iso;
        const rel = (v === 'calendar' || spec.showToday) && level !== 'easy' && rng.bool(0.4) ? relPhrase(rng, spec.today, iso) : null;
        if (rel) { sp.askKind = 'relToday'; sp.ask = rel; } else {
          const own = spec.longForm || lib.MASK_ASK[spec.mask] || 'iso';
          const kinds = v === 'calendar' ? (level === 'easy' ? lib.DATE_ASKS.filter((k) => k !== 'relative') : lib.DATE_ASKS)
            : level === 'easy' ? [own] : lib.DATE_ASKS.filter((k) => k !== 'relative' && k !== lib.MASK_ASK[spec.mask] && k !== spec.longForm);
          Object.assign(sp, lib.dateAsk(rng, iso, kinds));
        }
        return done();
      }
      return null;
    }
    if (v === 'month') {
      for (let t = 0; t < 40; t++) {
        const tk = lib.addMonths(spec.target, rng.pick([-1, 1]) * rng.int(1, 8));
        if (tk === spec.target || tk === cur || !lib.inYears(tk)) continue;
        sp.target = tk;
        const n = lib.monthDiff(lib.monthOf(spec.today), tk);
        if (n !== 0 && Math.abs(n) <= 6 && (spec.scene.dir === 'any' || (spec.scene.dir === 'future') === n > 0) && level !== 'easy' && rng.bool(0.3)) {
          sp.askKind = 'relToday';
          sp.ask = lib.relUnit(rng, n, 'month');
        } else {
          const style = level === 'easy' ? 'long' : rng.pick(['long', 'short', 'num', 'iso']);
          sp.askKind = style;
          sp.ask = lib.monthName(tk, style);
        }
        return done();
      }
      return null;
    }
    if (v === 'week') {
      for (let t = 0; t < 40; t++) {
        const anchor = lib.addDays(spec.anchor, rng.pick([-1, 1]) * rng.int(7, 35));
        const first = lib.weekStartOf(anchor, spec.weekStart);
        if (first === spec.target || first === cur || !lib.inEpoch(anchor)) continue;
        const k = rng.pick(level === 'easy' ? ['long'] : ['long', 'longDay', 'dmy', 'iso']);
        Object.assign(sp, { anchor, target: first, askKind: k, ask: `${rng.pick(['the week containing', 'the week that includes'])} ${lib.fmtDate(anchor, k)}` });
        return done();
      }
      return null;
    }
    if (v === 'range') {
      const { start, end } = spec.target;
      const n0 = lib.days(end) - lib.days(start);
      const maxLen = level === 'easy' ? 5 : level === 'medium' ? 10 : spec.ood ? 45 : 21;
      for (let t = 0; t < 80; t++) {
        const s = lib.addDays(start, rng.pick([-1, 1]) * rng.int(2, 25));
        const n = spec.rule === 'minmax' ? rng.int(spec.minN, spec.maxN) : rng.int(1, maxLen);
        const e = lib.addDays(s, n);
        if (s === start || !lib.inEpoch(s) || !lib.inEpoch(e) || (spec.booked || []).some((b) => b >= s && b <= e)) continue;
        if (same({ start: s, end: e })) continue;
        const scene = level === 'easy' ? { ...spec.scene, unit: undefined } : spec.scene;
        const ask = lib.rangeAsk(rng, s, e, scene);
        Object.assign(sp, { target: { start: s, end: e }, cross: lib.ymd(s)[0] !== lib.ymd(e)[0], askKind: ask.askKind, ask: ask.ask });
        void n0;
        return done();
      }
      return null;
    }
    if (v === 'time') {
      const step = spec.step || 5;
      for (let t = 0; t < 40; t++) {
        const grid = level === 'easy' ? 30 : level === 'medium' ? 15 : step;
        const tm = rng.int(0, 1440 / grid - 1) * grid;
        if (tm === spec.target || tm === cur) continue;
        sp.target = tm;
        sp.askKind = spec.control === 'text24' || rng.bool(0.3) ? 'h24' : 'h12';
        sp.ask = spec.control === 'text24' && level !== 'easy' ? lib.fmt12(tm) : sp.askKind === 'h24' ? lib.fmt24(tm) : lib.fmt12(tm);
        if (spec.control === 'text24' && level === 'easy') { sp.askKind = 'h24'; sp.ask = lib.fmt24(tm); }
        return done();
      }
      return null;
    }
    if (v === 'duration') {
      const step = spec.step || 5;
      for (let t = 0; t < 40; t++) {
        const hi = spec.ood ? 600 : 300;
        let tm = rng.int(Math.ceil(10 / step), lib.fdiv(hi / step)) * step;
        if (level) tm = Math.max(15, Math.round(tm / 15) * 15);
        if (tm === spec.target || tm === cur) continue;
        sp.target = tm;
        if (level) { sp.askKind = rng.pick(['hm', 'minutes']); sp.ask = sp.askKind === 'hm' ? lib.fmtDur(tm) : `${tm} minutes`; } else Object.assign(sp, lib.durAsk(rng, tm));
        return done();
      }
      return null;
    }
    return null;
  }

  Object.assign(lib, { parts, facts, silent, retarget });
})();
