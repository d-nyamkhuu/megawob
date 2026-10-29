/*
 * use-desktop-tools / week: move and / or resize an event in a week view.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-desktop-tools');
  const { EVENT_NAMES, eventNames, freshPick, gridScroll, gridStep, LV, MONTHS, othersOf, overlaps, say, SLOTS, timeLabel, tpl, WEEKDAYS } = fam.lib;
  const { clamp, quote: q } = env.util;

  function sampleWeek(rng, opts) {
    const crng = rng.fork('content');
    for (;;) {
      const days = LV(opts) ? (rng.bool(0.3), 5) : opts.ood || rng.bool(0.3) ? 7 : 5;
      const perDay = LV(opts) ? [1, 2] : opts.ood ? [2, 4] : [1, 3];
      const names = eventNames(rng, crng, opts, days * perDay[1] + 2);
      const events = [];
      let ni = 0;
      for (let d = 0; d < days; d++) {
        const n = rng.int(perDay[0], perDay[1]);
        const mine = [];
        for (let tries = 0; mine.length < n && tries < 100; tries++) {
          const e = { start: rng.int(14, 38), dur: rng.int(1, 4) };
          if (mine.some((o) => overlaps(e, { start: o.start - 1, dur: o.dur + 2 }))) continue;
          mine.push(e);
        }
        for (const e of mine) events.push({ id: `e${events.length}`, day: d, start: e.start, dur: e.dur, name: names[ni++ % names.length], tone: events.length % 4 });
      }
      if (events.length < 4) continue;
      const t = rng.pick(events);
      const mode0 = rng.pick(['move', 'move', 'resize', 'both']);
      const mode = opts.level === 'easy' ? 'move' : opts.level === 'medium' && mode0 === 'both' ? 'resize' : mode0;
      const others = events.filter((e) => e.id !== t.id);
      const free = (day, start, dur) => start >= 12 && start + dur <= 44 && !others.some((o) => o.day === day && overlaps(o, { start, dur }));
      let goal = null;
      for (let tries = 0; tries < 80 && !goal; tries++) {
        let day = t.day;
        let start = t.start;
        let dur = t.dur;
        if (mode !== 'resize') {
          day = clamp(t.day + rng.pick([-2, -1, 0, 0, 1, 1, 2]), 0, days - 1);
          start = t.start + rng.int(-6, 6);
        }
        if (mode !== 'move') dur = clamp(t.dur + rng.pick([-2, -1, 1, 1, 2, 3]), 1, 8);
        if (mode !== 'resize' && day === t.day && start === t.start) continue;
        if (mode !== 'move' && dur === t.dur) continue;
        if (free(day, start, dur)) goal = { day, start, dur };
      }
      if (!goal) continue;
      const rel = mode === 'move' && rng.bool(0.4) ? (goal.day === t.day ? 'shift' : goal.start === t.start ? 'dayshift' : null)
        : mode === 'resize' ? rng.pick(['end', 'dur', 'delta']) : null;
      const d0 = rng.int(1, 22);
      const mon = rng.int(0, 11);
      return {
        days,
        dayNames: WEEKDAYS.slice(0, days),
        dates: Array.from({ length: days }, (_, k) => d0 + k),
        month: MONTHS[mon],
        events,
        target: t.id,
        mode,
        goal,
        rel,
        top0: rng.int(10, 24),
        h24: rng.bool(0.3),
        route: rng.bool(0.5) ? 'wheel' : 'thumb',
      };
    }
  }

  const evOf = (spec, id) => spec.events.find((e) => e.id === id);
  const origOf = (spec, id) => {
    const e = evOf(spec, id);
    return { day: e.day, start: e.start, dur: e.dur };
  };

  function weekInit(spec, rng) {
    const evs = {};
    for (const e of spec.events) evs[e.id] = { day: e.day, start: e.start, dur: e.dur };
    const m = { view: { top: spec.top0, bottom: null, px: null }, evs, last: null };
    const t = spec.target;
    if (spec.startMode === 'scene') {
      // The grid scrolled so the target event is on screen, nothing moved.
      return { ...m, view: { ...m.view, top: clamp(evs[t].start - 4, 0, SLOTS - 16) } };
    }
    if (spec.startMode === 'partial') {
      const o = evs[t];
      const g = spec.goal;
      // level starts (spec.lead) never leave the event on top of another one
      const clash = (e) => spec.lead && spec.events.some((x) => x.id !== t && x.day === e.day && overlaps(x, e));
      if (spec.mode === 'both' && !clash({ day: g.day, start: g.start, dur: o.dur })) return { ...m, evs: { ...evs, [t]: { day: g.day, start: g.start, dur: o.dur } }, last: { id: t, prev: o } };
      if (spec.mode === 'move' && g.day !== o.day && g.start !== o.start && !clash({ ...o, day: g.day })) return { ...m, evs: { ...evs, [t]: { ...o, day: g.day } }, last: { id: t, prev: o } };
      return { ...m, view: { ...m.view, top: clamp(o.start - 4, 0, SLOTS - 16) } };
    }
    if (spec.startMode === 'wrong') {
      const others = spec.events.filter((e) => e.id !== t);
      const w = rng.pick(others);
      const o = evs[w.id];
      const moved = { ...o, start: clamp(o.start + rng.pick([-3, -2, 2, 3]), 0, SLOTS - o.dur) };
      return { ...m, evs: { ...evs, [w.id]: moved }, last: { id: w.id, prev: o } };
    }
    return m;
  }

  const dErr = (a, b, w0, k) => (a === b ? 0 : w0 + (1 - w0) * Math.min(1, Math.abs(a - b) / k));
  function weekError(m, spec) {
    const cur = m.evs[spec.target];
    const g = spec.goal;
    const o = origOf(spec, spec.target);
    const n = (o.day !== g.day ? 1 : 0) + (o.start !== g.start ? 1 : 0) + (o.dur !== g.dur ? 1 : 0) || 1;
    const base = (dErr(cur.day, g.day, 0.5, 3) + dErr(cur.start, g.start, 0.4, 6) + dErr(cur.dur, g.dur, 0.4, 4)) / n;
    let pen = 0;
    for (const e of spec.events) {
      if (e.id === spec.target) continue;
      const c = m.evs[e.id];
      if (c.day !== e.day || c.start !== e.start || c.dur !== e.dur) pen += 0.3;
    }
    return Math.min(1, base + pen);
  }

  function wkMove(m, id, day, start) {
    const o = m.evs[id];
    const s = clamp(start, 0, SLOTS - o.dur);
    if (o.day === day && o.start === s) return m;
    return { ...m, evs: { ...m.evs, [id]: { ...o, day, start: s } }, last: { id, prev: o } };
  }
  function wkResize(m, id, end) {
    const o = m.evs[id];
    const dur = clamp(end - o.start, 1, SLOTS - o.start);
    if (dur === o.dur) return m;
    return { ...m, evs: { ...m.evs, [id]: { ...o, dur } }, last: { id, prev: o } };
  }
  function wkUndo(m) {
    if (!m.last) return m;
    return { ...m, evs: { ...m.evs, [m.last.id]: m.last.prev }, last: null };
  }

  function weekWant(spec, id) {
    return id === spec.target ? spec.goal : origOf(spec, id);
  }

  function weekPlan(m, spec) {
    const err = weekError(m, spec);
    if (err === 0) return null;
    if (m.last && weekError(wkUndo(m), spec) < err - 1e-9) return { click: { toast: 'undo' } };
    const ids = spec.events.map((e) => e.id).filter((id) => id !== spec.target).concat([spec.target]);
    for (const id of ids) {
      const cur = m.evs[id];
      const want = weekWant(spec, id);
      const top = m.view.top;
      const bottom = m.view.bottom ?? top + 16;
      const rows = Math.max(4, Math.floor(bottom - top + 1e-6));
      if (cur.day !== want.day || cur.start !== want.start) {
        const lo = Math.min(cur.start, want.start);
        const hi = Math.max(cur.start, want.start) + 1;
        if (hi - lo <= rows) {
          const s = gridScroll(m, spec, lo, hi, 'week');
          if (s) return s;
          return { drag: [{ evgrab: id }, { cell: [want.day, want.start] }] };
        }
        // Too far apart for one drag: show the event, then move it as far as the view allows.
        const s = gridScroll(m, spec, cur.start, cur.start + 1, 'week');
        if (s) return s;
        const step = want.start > cur.start ? Math.floor(bottom - 1e-6) - 1 : Math.ceil(top - 1e-6);
        return { drag: [{ evgrab: id }, { cell: [want.day, clamp(step, Math.ceil(top), Math.floor(bottom) - 1)] }] };
      }
      if (cur.dur !== want.dur) {
        const lo = cur.start + Math.min(cur.dur, want.dur) - 1;
        const hi = cur.start + Math.max(cur.dur, want.dur);
        if (hi - lo <= rows) return gridScroll(m, spec, lo, hi, 'week') || { drag: [{ evhandle: id }, { edge: [cur.day, cur.start + want.dur] }] };
        const s = gridScroll(m, spec, lo, lo + 1, 'week');
        if (s) return s;
        const end = want.dur > cur.dur ? Math.floor(bottom) : Math.ceil(top) + 1;
        return { drag: [{ evhandle: id }, { edge: [cur.day, clamp(end, cur.start + 1, SLOTS)] }] };
      }
    }
    return null;
  }

  const T_WK_MOVE = ['Move {n} to {day} at {t}.', 'Reschedule {n} to {day}, {t}.', 'Drag {n} so that it starts on {day} at {t}.',
    'Move the event {n}; it needs to be on {day} at {t}.', 'Shift {n} to {t} on {day}.', 'Put {n} on {day} at {t} instead.',
    '{n} should begin at {t} on {day}.', 'For {n}, use {day} at {t}.', 'Place {n} at {t} in the {day} column.',
    'New start for {n} is {day} at {t}.'];
  const T_WK_SHIFT = ['Push {n} back by {d}.', 'Move {n} {d} {dir}, same day.', 'Start {n} {d} {dir} than it is now.',
    'Shift {n} {d} {dir}.', 'Reschedule {n} to start {d} {dir}.', 'Move {n} {d} {dir} on the same day.'];
  const T_WK_DAYS = ['Move {n} to {rel}, same time.', 'Reschedule {n} to {rel} at the same time.',
    'Shift {n} to {rel}; keep the time.', 'Move {n} {k} {dir}, at the same time of day.',
    'Put {n} on {rel} without changing its time.', 'Drag {n} {k} {dir}, same time.',
    '{n} belongs on {rel}, at the same time.', 'Keep the time; take {n} to {rel}.',
    '{n} should be {k} {dir}, same time.', 'Use {rel} for {n}; leave its time alone.',
    'Change only the day of {n} to {rel}.', 'Carry {n} to {rel} at its usual time.',
    'For {n}, go {k} {dir}, same time.', 'Transfer {n} to {rel}, with hours intact.',
    'The time stays; {n} goes {k} {dir}.', 'Same start and length for {n} on {rel}.'];
  const T_WK_END = ['Make {n} end at {t}.', 'Change {n} so that it ends at {t}.', 'Resize {n} to finish at {t}.',
    'Shorten or extend {n} so it ends at {t}.', 'Drag the bottom edge of {n} so it ends at {t}.', 'Have {n} finish at {t}.',
    '{n} should now run until {t}.', 'Use {t} as the ending time for {n}.', 'Adjust the end of {n} to hit {t}.',
    '{t} is when {n} needs to end.', 'Have the time block for {n} stop at {t}.'];
  const T_WK_DUR = ['Change the length of {n} to {dur}.', 'Resize {n} to last {dur}.', 'Make {n} {dur} long.',
    'Resize {n} so it takes {dur}.', 'Set the duration of {n} to {dur}.', 'Adjust {n} so it lasts {dur}.',
    'Give {n} a length of {dur}.', '{n} should occupy {dur}.', 'Let {n} take up {dur} in all.',
    '{n} needs {dur} from its start.', 'Allow {dur} overall for {n}.', 'End {n} after {dur}.',
    '{n} must span exactly {dur}.'];
  const T_WK_DELTA = ['Make {n} {d} {more}.', 'Change {n} to be {d} {more}.', 'Resize {n}: {d} {more}.',
    'Make {n} {d} {more} than it is now.', 'Adjust {n} so it is {d} {more}.', 'Drag the end of {n} to make it {d} {more}.',
    '{n}: {d} {more} in length.', 'Give {n} a duration {d} {more}.', 'Let {n} now run {d} {more}.',
    '{n} should be {more} by {d}.', 'Plan {n} to last {d} {more}.', '{n} gets {d} {more} this time.'];
  const T_WK_BOTH = ['Move {n} to {day} at {t} and make it {dur} long.', 'Reschedule {n} to {day} {t}, lasting {dur}.',
    'Put {n} on {day} at {t}; it should take {dur}.', 'Change {n}: {day}, {t}, {dur}.',
    'Move {n} to {t} on {day} and resize it to {dur}.', 'Set {n} to start on {day} at {t} and last {dur}.',
    'Give {n} {dur} on {day}, beginning at {t}.', 'For {n}: day {day}, start {t}, length {dur}.',
    'Have {n} run for {dur} starting {t} on {day}.', 'Place {n} on {day}; start {t}, duration {dur}.',
    'Adjust {n} to occupy {dur} on {day} from {t}.', 'Rebook {n}: {dur}, starting at {t} on {day}.',
    'The new time slot for {n}: {day} at {t}, {dur}.', 'On {day}, {n} needs {dur} beginning at {t}.',
    'Relocate and resize {n}: {day}, {t}, {dur}.', '{n}: begin at {t} on {day}; run for {dur}.'];

  function hm(halfHours) {
    const mins = halfHours * 30;
    if (mins < 60) return `${mins} minutes`;
    const h = mins / 60;
    return Number.isInteger(h) ? `${h} ${h === 1 ? 'hour' : 'hours'}` : `${mins} minutes`;
  }

  // Week judge episodes ask for a move of the named event: a made-up absolute goal on another day, never executed.
  function weekAsk(jr, spec, t) {
    const day = jr.pick(spec.dayNames.filter((_, i) => i !== t.day));
    const tm = timeLabel(jr.int(16, 36), spec.h24);
    return { n: q(t.name), day, t: tm };
  }

  // week: another event of the same kind of change (the goal found as sampleWeek does).
  function retargetWeek(s, spec, rng) {
    const ts = rng.shuffle(spec.events.filter((e) => e.id !== spec.target));
    for (const t of ts) {
      const others = spec.events.filter((e) => e.id !== t.id);
      const free = (day, start, dur) => start >= 12 && start + dur <= 44 && !others.some((o) => o.day === day && overlaps(o, { start, dur }));
      let goal = null;
      for (let tries = 0; tries < 80 && !goal; tries++) {
        let day = t.day;
        let start = t.start;
        let dur = t.dur;
        if (spec.mode !== 'resize') {
          day = clamp(t.day + rng.pick([-2, -1, 0, 0, 1, 1, 2]), 0, spec.days - 1);
          start = t.start + rng.int(-6, 6);
        }
        if (spec.mode !== 'move') dur = clamp(t.dur + rng.pick([-2, -1, 1, 1, 2, 3]), 1, 8);
        if (spec.mode !== 'resize' && day === t.day && start === t.start) continue;
        if (spec.mode !== 'move' && dur === t.dur) continue;
        if (free(day, start, dur)) goal = { day, start, dur };
      }
      if (!goal) continue;
      s.target = t.id;
      s.goal = goal;
      s.rel = spec.mode === 'move' && rng.bool(0.4) ? (goal.day === t.day ? 'shift' : goal.start === t.start ? 'dayshift' : null)
        : spec.mode === 'resize' ? rng.pick(['end', 'dur', 'delta']) : null;
      return true;
    }
    return false;
  }

  // Exposed for widgets.
  Object.assign(fam.helpers, { wkMove, wkResize, wkUndo });

  env.scenario('use-desktop-tools', {
    name: 'week',
    sample: sampleWeek,
    init: weekInit,
    error: weekError,
    plan: weekPlan,
    inputs: () => ['pointer', 'wheel'],
    sigma: 0.3,
    solve(spec, m) {
      const evs = {};
      for (const e of spec.events) evs[e.id] = { day: e.day, start: e.start, dur: e.dur };
      evs[spec.target] = { ...spec.goal };
      return { ...m, evs, last: null };
    },
    instruction(spec, rng) {
      const e = evOf(spec, spec.target);
      const n = q(e.name);
      const g = spec.goal;
      const day = spec.dayNames[g.day];
      const t = timeLabel(g.start, spec.h24);
      if (spec.mode === 'both') {
        return say(rng, spec, tpl(rng, spec, T_WK_BOTH, { n, day, t, dur: hm(g.dur) }), `${n}: ${day} ${t}, ${hm(g.dur)}`);
      }
      if (spec.mode === 'move') {
        if (spec.rel === 'shift') {
          const dd = g.start - e.start;
          const later = dd > 0;
          const tplList = later ? T_WK_SHIFT : T_WK_SHIFT.slice(1);
          return say(rng, spec, tpl(rng, spec, tplList, { n, d: hm(Math.abs(dd)), dir: later ? 'later' : 'earlier' }), `${n} ${later ? '+' : '-'}${hm(Math.abs(dd))}`);
        }
        if (spec.rel === 'dayshift') {
          const k = g.day - e.day;
          const rel = Math.abs(k) === 1 ? (k > 0 ? 'the next day' : 'the day before') : `${day}`;
          return say(rng, spec, tpl(rng, spec, T_WK_DAYS, { n, rel, k: `${Math.abs(k)} ${Math.abs(k) === 1 ? 'day' : 'days'}`, dir: k > 0 ? 'later' : 'earlier' }), `${n} → ${day}`);
        }
        return say(rng, spec, tpl(rng, spec, T_WK_MOVE, { n, day, t }), `${n} → ${day} ${t}`);
      }
      if (spec.rel === 'end') return say(rng, spec, tpl(rng, spec, T_WK_END, { n, t: timeLabel(g.start + g.dur, spec.h24) }), `${n} ends ${timeLabel(g.start + g.dur, spec.h24)}`);
      if (spec.rel === 'delta') {
        const dd = g.dur - e.dur;
        return say(rng, spec, tpl(rng, spec, T_WK_DELTA, { n, d: hm(Math.abs(dd)), more: dd > 0 ? 'longer' : 'shorter' }), `${n} ${dd > 0 ? '+' : '-'}${hm(Math.abs(dd))}`);
      }
      return say(rng, spec, tpl(rng, spec, T_WK_DUR, { n, dur: hm(g.dur) }), `${n}: ${hm(g.dur)}`);
    },
    changed: (m, spec) => spec.events.some((e) => { const c = m.evs[e.id]; return c.day !== e.day || c.start !== e.start || c.dur !== e.dur; }),
    ambiguous(jr, spec) {
      // two events with one name on different days
      const t = evOf(spec, spec.target);
      const us = spec.events.filter((e) => e.id !== t.id && e.day !== t.day);
      if (!us.length) return undefined;
      const u = jr.pick(us);
      u.name = t.name;
      const vars = weekAsk(jr, spec, t);
      const da = spec.dayNames[t.day];
      const db = spec.dayNames[u.day];
      return { mode: 'ambiguous', cands: [[da, da.slice(0, 3)], [db, db.slice(0, 3)]],
        others: othersOf(spec.dayNames.flatMap((d) => [d, d.slice(0, 3)]), [da, da.slice(0, 3), db, db.slice(0, 3)]),
        message: `There are two events named ${vars.n}: one on ${da} and one on ${db}. Which one should I move?`,
        templates: T_WK_MOVE, vars, terse: `${vars.n} → ${vars.day} ${vars.t}` };
    },
    impossible(jr, spec) {
      const t = evOf(spec, spec.target);
      const vars = weekAsk(jr, spec, t);
      if (spec.days === 5 && jr.bool(0.5)) {
        // the view has no weekend columns
        const day = jr.pick(['Saturday', 'Sunday']);
        return { mode: 'impossible', what: [day, day.slice(0, 3)], message: `I can't do that: the week view only shows ${spec.dayNames[0]} to ${spec.dayNames[4]}, so there is no ${day} column.`,
          templates: T_WK_MOVE, vars: { ...vars, day }, terse: `${vars.n} → ${day} ${vars.t}` };
      }
      const name = freshPick(jr, EVENT_NAMES, new Set(spec.events.map((e) => e.name.toLowerCase())));
      const n = q(name);
      return { mode: 'impossible', what: [name], message: `I can't do that: there is no event named ${name} this week.`,
        templates: T_WK_MOVE, vars: { ...vars, n }, terse: `${n} → ${vars.day} ${vars.t}` };
    },
    facts(model, spec, add) {
      const tl = (i) => timeLabel(i, spec.h24);
      const v = model.evs[spec.target];
      const day = spec.dayNames[v.day];
      add('Event time', `${tl(v.start)} – ${tl(v.start + v.dur)}`, [tl(v.start)]);
      add('Day', day, [day.slice(0, 3)]);
      add(`Events on ${day}`, spec.events.filter((e) => model.evs[e.id].day === v.day).length, null, ['events that day']);
    },
    silent(next, prev, spec, rng, cands) {
      const t = spec.target;
      const a = next.evs[t];
      const b = prev.evs[t];
      if (a.day !== b.day || a.start !== b.start || a.dur !== b.dur) {
        if (a.start % 2 === 1) cands.push((m) => { m.evs[t].start = a.start - 1; });
        if (a.dur % 2 === 1 && a.start + a.dur < SLOTS) cands.push((m) => { m.evs[t].dur = a.dur + 1; });
        if (a.day !== b.day) {
          const d = a.day + (a.day > b.day ? -1 : 1);
          if (d >= 0 && d < spec.days) cands.push((m) => { m.evs[t].day = d; });
        }
      }
    },
    retarget: (s, spec, model, rng) => retargetWeek(s, spec, rng),
    simulate(m, spec, step, now, t) {
      return gridStep(m, step, (m) => {
        if (step.click && t.toast) m = wkUndo(m);
        else if (step.drag && step.drag[0].evgrab) m = wkMove(m, step.drag[0].evgrab, step.drag[1].cell[0], step.drag[1].cell[1]);
        else if (step.drag && step.drag[0].evhandle) m = wkResize(m, step.drag[0].evhandle, step.drag[1].edge[1]);
        return m;
      });
    },
  });
})();
