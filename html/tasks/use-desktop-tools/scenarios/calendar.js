/*
 * use-desktop-tools / calendar: draft an event in a day view, name it and create it.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-desktop-tools');
  const { C, cut, EVENT_NAMES, eventNames, gridScroll, gridStep, lev, MONTHS, overlaps, say, SLOTS, timeLabel, tpl, WEEKDAYS } = fam.lib;
  const { clamp, quote: q } = env.util;

  function durText(rng, halfHours) {
    const mins = halfHours * 30;
    const hours = mins / 60;
    if (mins < 60 || rng.bool(0.45)) return `${mins} minutes`;
    return Number.isInteger(hours) ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : `${hours} hours`;
  }

  function validStarts(spec) {
    const out = [];
    const lo = spec.mode === 'at' ? spec.start : spec.win.lo;
    const hi = spec.mode === 'at' ? spec.start + spec.dur : spec.win.hi;
    for (let s = lo; s + spec.dur <= hi; s++) {
      if (!spec.events.some((e) => overlaps({ start: s, dur: spec.dur }, e))) out.push(s);
    }
    return out;
  }

  // Trait dayRange [fromHour, toHour]: the day view shows only those hours (no scrolling); events, the start and the
  // window lie inside. Returns slots [lo, hi), at least 8 hours wide, or null.
  function dayRangeOf(opts) {
    const r = opts.traits && opts.traits.dayRange;
    if (!Array.isArray(r)) return null;
    const lo = clamp(Math.floor(r[0]), 0, 20) * 2;
    return [lo, clamp(Math.ceil(r[1]) * 2, lo + 16, SLOTS)];
  }

  function sampleCalendar(rng, opts) {
    const crng = rng.fork('content');
    const range = dayRangeOf(opts);
    const tr = opts.traits || {};
    // Slot bounds of events / free starts / the window (the defaults are the full-day mix).
    const eLo = range ? range[0] : 12;
    const eHi = range ? range[1] : 44;
    const fLo = range ? range[0] : 14;
    const hLo = range ? Math.ceil(range[0] / 2) : 8;
    const hHi = range ? Math.floor((range[1] - 6) / 2) : 18;
    const wMax = range ? range[1] : 46;
    const maxDur = Math.min(opts.ood ? 6 : 4, Math.floor((eHi - eLo) / 3));
    for (;;) {
      const events = [];
      const n = opts.level === 'easy' ? rng.int(2, 3) : opts.level === 'medium' ? rng.int(3, 4) : opts.ood ? rng.int(6, 8) : rng.int(3, 5);
      for (let tries = 0; events.length < n && tries < 300; tries++) {
        const e = { start: rng.int(eLo, eHi - 1), dur: rng.int(1, 3) };
        if (e.start + e.dur > eHi) continue;
        if (events.some((o) => overlaps(e, { start: o.start - 1, dur: o.dur + 2 }))) continue;
        events.push(e);
      }
      events.sort((a, b) => a.start - b.start);
      const dur = rng.int(1, maxDur);
      const names = eventNames(rng, crng, opts, n + 1);
      const name = names[0];
      events.forEach((e, i) => { e.name = names[i + 1]; e.tone = i % 4; });
      const mode0 = rng.bool(0.65) ? 'at' : 'between';
      const mode = opts.level === 'easy' ? 'at' : mode0;
      const spec = { mode, name, dur, events, h24: rng.bool(0.3) };
      if (mode === 'at') {
        const free = [];
        for (let s = fLo; s + dur <= eHi; s++) if (!events.some((e) => overlaps({ start: s, dur }, e))) free.push(s);
        if (!free.length) continue;
        spec.start = rng.pick(free);
      } else {
        const lo = rng.int(hLo, hHi) * 2;
        const span = rng.int(3, 5) * 2;
        spec.win = { lo, hi: Math.min(wMax, lo + span) };
        if (!validStarts(spec).length) continue;
        if (!events.some((e) => overlaps(e, { start: spec.win.lo, dur: spec.win.hi - spec.win.lo }))) continue;
      }
      spec.durText = durText(rng, dur);
      spec.top0 = rng.int(8, 22);
      spec.day = `${rng.pick(WEEKDAYS)}, ${rng.pick(MONTHS)} ${rng.int(1, 28)}`;
      spec.route = rng.bool(0.5) ? 'wheel' : 'thumb';
      // Opt-in traits (they change nothing without the trait): startHour, the hour at the top of the initial view;
      // dayRange, the bounded visible hours (spec.range, slots); selectors, the Start time / Duration form path
      // (true: a seeded mix with dragging, 'only': always the form), from its own rng fork.
      if (Number.isFinite(tr.startHour)) spec.top0 = clamp(Math.round(tr.startHour * 2), 0, SLOTS - 16);
      if (range) {
        spec.range = range;
        spec.top0 = range[0];
      }
      if (tr.selectors) {
        spec.selectors = true;
        spec.entry = tr.selectors === 'only' || rng.fork('selectors').bool(0.5) ? 'form' : 'drag';
      }
      return spec;
    }
  }

  const DRAFT_DUR = 2;
  const CAL_DURS = [1, 2, 3, 4, 5, 6, 7, 8];
  const durLabel = (n) => (n < 2 ? `${n * 30} minutes` : n === 2 ? '1 hour' : `${n / 2} hours`);

  function calendarInit(spec, rng) {
    const m = { view: { top: spec.top0, bottom: null, px: null }, event: null, form: false };
    if (spec.selectors) m.dd = null;
    const goal = calendarGoal(spec);
    if (spec.startMode === 'scene') {
      // The new-event form open on a default draft (an hour at the top of the view), unnamed, nothing saved.
      let start = clamp(Math.round(spec.top0), 0, SLOTS - DRAFT_DUR);
      if (start === goal) start += 2;
      return { ...m, event: { start, dur: DRAFT_DUR, name: '', saved: false }, form: true };
    }
    if (spec.startMode === 'partial') {
      const k = rng.int(0, Math.max(0, spec.name.length - 2));
      return { ...m, event: { start: goal, dur: spec.dur, name: spec.name.slice(0, k), saved: false }, form: true };
    }
    if (spec.startMode === 'wrong') {
      let s = goal;
      for (let t = 0; t < 30 && validStarts(spec).includes(s); t++) s = clamp(goal + rng.pick([-4, -3, -2, 2, 3, 4]), 0, SLOTS - spec.dur);
      return { ...m, event: { start: s, dur: spec.dur, name: spec.name, saved: true } };
    }
    return m;
  }

  const normName = (s) => String(s || '').trim().toLowerCase();

  function calendarError(model, spec) {
    const e = model.event;
    if (!e) return 1;
    const V = validStarts(spec);
    const off = V.length ? Math.min(...V.map((v) => Math.abs(v - e.start))) : SLOTS;
    const startErr = Math.min(1, off / 4);
    const durErr = Math.min(1, Math.abs(e.dur - spec.dur) / 2);
    const a = normName(e.name);
    const b = normName(spec.name);
    const nameErr = Math.min(1, lev(a, b) / Math.max(1, a.length, b.length));
    const saveErr = e.saved ? 0 : 1;
    return (startErr + durErr + nameErr + saveErr) / 4;
  }

  function calendarGoal(spec) {
    if (spec.mode === 'at') return spec.start;
    const V = validStarts(spec);
    const mid = (spec.win.lo + spec.win.hi - spec.dur) / 2;
    return V.reduce((best, v) => (Math.abs(v - mid) < Math.abs(best - mid) ? v : best), V[0]);
  }

  function calendarDrag(model, a, b) {
    const start = Math.min(a, b);
    return { ...model, event: { start, dur: Math.abs(b - a) + 1, name: '', saved: false }, form: false };
  }
  function calendarCreate(model) {
    if (!model.event || !model.form) return model;
    return { ...model, event: { ...model.event, saved: true }, form: false };
  }
  function calendarCancel(model) {
    if (!model.form) return model;
    return { ...model, event: null, form: false, ...(model.dd !== undefined ? { dd: null } : {}) };
  }
  // Form route (spec.selectors): the Start time / Duration selectors. Choosing one with no draft opens it (a start
  // gets an hour, a duration starts at the top visible row); with one it edits the draft and keeps the name.
  function calendarSelect(model, which, value) {
    const e = model.event && model.form && !model.event.saved ? model.event : null;
    let start = e ? e.start : clamp(Math.floor(model.view.top), 0, SLOTS - 1);
    let dur = e ? e.dur : DRAFT_DUR;
    if (which === 'start') start = clamp(value, 0, SLOTS - 1);
    else dur = value;
    dur = Math.min(dur, SLOTS - start);
    return { ...model, dd: null, form: true, event: { start, dur, name: e ? e.name : '', saved: false } };
  }
  const calendarDd = (model, which) => ({ ...model, dd: model.dd === which ? null : which });

  // Form route: select the start, then the duration (each opens its list, then one option), name, Create.
  function calendarFormPlan(model, spec, s) {
    const e = model.event;
    const draft = e && !e.saved && model.form;
    const pick = (which, value) => (model.dd === which ? { click: { option: [which, value] } }
      : model.dd ? { click: { select: model.dd } } : { click: { select: which } });
    if (!draft || e.start !== s) return pick('start', s);
    if (e.dur !== spec.dur) return pick('dur', spec.dur);
    if (model.dd) return { click: { select: model.dd } };
    return null;
  }

  function calendarPlan(model, spec) {
    if (calendarError(model, spec) === 0) return null;
    const s = calendarGoal(spec);
    const e = model.event;
    if (spec.entry === 'form') {
      const step = calendarFormPlan(model, spec, s);
      if (step) return step;
    } else {
      const needDrag = !e || e.saved || !model.form || e.start !== s || e.dur !== spec.dur;
      if (needDrag) {
        return (spec.range ? null : gridScroll(model, spec, s, s + spec.dur, 'day')) || { drag: [{ slot: s }, { slot: s + spec.dur - 1 }] };
      }
    }
    if (normName(e.name) !== normName(spec.name)) return { type: [{ field: 'name' }, spec.name] };
    return { click: { form: 'create' } };
  }

  const T_CAL_AT = ['Create a {dur} event named {n} starting at {t}.', 'Add an event {n} at {t} lasting {dur}.',
    'Schedule {n} at {t} for {dur}.', 'Put a {dur} event called {n} on the calendar at {t}.',
    'Block {dur} at {t} for {n}.', 'Create a new event: {n}, starting {t}, {dur} long.', 'Book {n} from {t} for {dur}.',
    'Add {n}: start {t}, duration {dur}.', 'Make room at {t} for {n}, lasting {dur}.',
    '{n} needs a {dur} calendar entry at {t}.', 'I need {n} at {t} for {dur}.',
    'Reserve time for {n}: {dur}, beginning at {t}.', 'Set up {n} to run for {dur} from {t}.',
    '{n}: save a new {dur} event at {t}.', 'The calendar should show {n} at {t} for {dur}.',
    'Save an event at {t}: {n}, lasting {dur}.', 'I want a {dur} booking at {t} under {n}.'];
  const T_CAL_WIN = ['Create a {dur} event named {n}, between {lo} and {hi}.',
    'Find a free {dur} slot between {lo} and {hi} and add {n} there.',
    'Schedule {n} ({dur}) sometime between {lo} and {hi}, without overlapping other events.',
    'Add a {dur} event called {n} anywhere between {lo} and {hi} that is free.',
    'Put {n} on the calendar for {dur}; it must start and end between {lo} and {hi}.',
    'Block {dur} for {n} somewhere between {lo} and {hi}.',
    'Fit {n} ({dur}) into a gap wholly between {lo} and {hi}.',
    'Keep {lo} to {hi} as the bounds for a free {dur} booking of {n}.',
    'Give {n} any open {dur} stretch within {lo} to {hi} on the calendar.',
    'For {n}, reserve {dur} with no conflicts, all within {lo} to {hi}.',
    'Use an opening within {lo} to {hi} for {n}; book the full {dur} there.',
    'Enter {n} for {dur} where it fits between {lo} and {hi}, clear of all other events.',
    '{n} needs {dur}; add it between {lo} and {hi} with no conflicts.',
    'A free {dur} gap within {lo} to {hi} should become an event named {n}.',
    '{lo} to {hi} is the window; save {n} in any available {dur} gap.'];

  // calendar: another event name, length and time (a free start, or a window with a free start) on the same day.
  function retargetCalendar(s, spec, rng) {
    const r = spec.range;
    const eHi = r ? r[1] : 44;
    const fLo = r ? r[0] : 14;
    const hLo = r ? Math.ceil(r[0] / 2) : 8;
    const hHi = r ? Math.floor((r[1] - 6) / 2) : 18;
    const wMax = r ? r[1] : 46;
    const maxDur = Math.min(spec.ood ? 6 : 4, Math.floor((eHi - (r ? r[0] : 12)) / 3));
    const names = C.sample(rng.fork('content'), EVENT_NAMES, 12, { csplit: spec.csplit }).filter((x) => x !== spec.name && !spec.events.some((e) => e.name === x));
    if (!names.length) return false;
    for (let tries = 0; tries < 60; tries++) {
      const dur = rng.int(1, maxDur);
      const t = { ...s, dur, name: rng.pick(names) };
      delete t.start;
      delete t.win;
      if (spec.mode === 'at') {
        const free = [];
        for (let x = fLo; x + dur <= eHi; x++) if (!spec.events.some((e) => overlaps({ start: x, dur }, e))) free.push(x);
        if (!free.length) continue;
        t.start = rng.pick(free);
      } else {
        const lo = rng.int(hLo, hHi) * 2;
        t.win = { lo, hi: Math.min(wMax, lo + rng.int(3, 5) * 2) };
        if (!validStarts(t).length || !spec.events.some((e) => overlaps(e, { start: t.win.lo, dur: t.win.hi - t.win.lo }))) continue;
      }
      if (t.start === spec.start && t.dur === spec.dur && t.name === spec.name) continue;
      t.durText = durText(rng, dur);
      Object.assign(s, t);
      return true;
    }
    return false;
  }

  // Exposed for widgets.
  Object.assign(fam.helpers, { calendarDrag, calendarCreate, calendarCancel, calendarSelect, calendarDd, durLabel, CAL_DURS });

  env.scenario('use-desktop-tools', {
    name: 'calendar',
    sample: sampleCalendar,
    init: calendarInit,
    error: calendarError,
    plan: calendarPlan,
    sigma: 0.3,
    solve: (spec, m) => ({ ...m, event: { start: calendarGoal(spec), dur: spec.dur, name: spec.name, saved: true }, form: false,
      ...(m.dd !== undefined ? { dd: null } : {}) }),
    instruction(spec, rng) {
      const n = q(spec.name);
      if (spec.mode === 'between') {
        const lo = timeLabel(spec.win.lo, spec.h24);
        const hi = timeLabel(spec.win.hi, spec.h24);
        return say(rng, spec, tpl(rng, spec, T_CAL_WIN, { dur: spec.durText, n, lo, hi }), `${n}, ${spec.durText}, ${lo}-${hi}`);
      }
      const t = timeLabel(spec.start, spec.h24);
      return say(rng, spec, tpl(rng, spec, T_CAL_AT, { dur: spec.durText, n, t }), `${n} ${t} ${spec.durText}`,
        [`drag over the slots from ${t} for ${spec.durText}`, `name it ${n}`, 'create it']);
    },
    changed: (m) => !!(m.event && m.event.saved),
    prepared(m, spec, e) {
      const ev = m.event;
      if (!ev || ev.saved || !m.form) return e;
      // the draft right, only Create left: the save subgoal counts as done
      return Math.max(0, e - 0.25);
    },
    confirmVerb: 'create the event',
    ambiguous(jr, spec) {
      // "at 3": a.m. or p.m.?
      const slot = jr.pick([16, 18, 20, 22, 26, 28, 30, 32, 34, 36]);
      const h = Math.floor(slot / 2);
      const h12 = h % 12 || 12;
      spec.h24 = false;
      const n = q(spec.name);
      const am = `${h12} am`;
      const pm = `${h12} pm`;
      const alt = (x) => [x, x.replace(' ', ''), x.replace(' ', ':00 '), x.replace(' ', ':00'), x.replace(/ (.)m/, ' $1.m.')];
      const hh = (x) => String(x).padStart(2, '0');
      return { mode: 'ambiguous', cands: [alt(am).concat([`${hh(h % 12)}:00`]), alt(pm).concat([`${h % 12 + 12}:00`])],
        message: `Do you mean ${h12} am or ${h12} pm for the ${spec.name} event?`,
        templates: T_CAL_AT, vars: { dur: spec.durText, n, t: String(h12) }, terse: `${n} at ${h12}` };
    },
    impossible(jr, spec) {
      // 11:30 pm for two hours runs past midnight
      const slot = jr.int(42, 47);
      const dur = jr.int(48 - slot + 1, 48 - slot + 4);
      const t = timeLabel(slot, false);
      const n = q(spec.name);
      return { mode: 'impossible', what: [t, t.replace(/([ap]m)$/i, ' $1')], message: `I can't do that: an event at ${t} lasting ${durLabel(dur)} would run past midnight, and the day view ends at midnight.`,
        templates: T_CAL_AT, vars: { dur: durLabel(dur), n, t }, terse: `${n} ${t} ${durLabel(dur)}` };
    },
    facts(model, spec, add) {
      const tl = (i) => timeLabel(i, spec.h24);
      const e = model.event;
      if (e) {
        add('Event time', `${tl(e.start)} – ${tl(e.start + e.dur)}`, [tl(e.start)]);
        add('Duration', `${e.dur * 30} min`, [durLabel(e.dur)]);
      }
      add('Events in the agenda', spec.events.length + (e && e.saved ? 1 : 0), null, ['agenda entries']);
    },
    silent(next, prev, spec, rng, cands) {
      const e = next.event;
      if (e && e.saved && !(prev.event && prev.event.saved)) {
        if (e.name.length > 10) cands.push((m) => { m.event.name = cut(m.event.name); });
        if (e.start % 2 === 1) cands.push((m) => { m.event.start = e.start - 1; });
        if (e.dur > 2) cands.push((m) => { m.event.dur = 2; });
      } else if (e && !e.saved && prev.event && e.name !== prev.event.name && e.name.length > 10) {
        cands.push((m) => { m.event.name = cut(m.event.name); });
      }
    },
    retarget: (s, spec, model, rng) => retargetCalendar(s, spec, rng),
    simulate(m, spec, step, now, t) {
      return gridStep(m, step, (m) => {
        if (step.drag) m = { ...calendarDrag(m, step.drag[0].slot, step.drag[1].slot), form: true };
        else if (step.type) m = { ...m, event: { ...m.event, name: step.type[1] } };
        else if (step.click && t.form === 'create') m = calendarCreate(m);
        else if (step.click && t.select) m = calendarDd(m, t.select);
        else if (step.click && t.option) m = calendarSelect(m, t.option[0], t.option[1]);
        return m;
      });
    },
    check() {
      const fails = [];
      const cs = { scenario: 'calendar', mode: 'between', win: { lo: 16, hi: 24 }, dur: 2, name: 'Gym', events: [{ start: 17, dur: 2 }] };
      if (validStarts(cs).join() !== '19,20,21,22') fails.push(`calendar: valid starts ${validStarts(cs)}`);
      if (Math.abs(calendarError({ event: { start: 19, dur: 2, name: 'gym ', saved: true } }, cs)) > 1e-9) fails.push('calendar: case/space-insensitive name');
      if (timeLabel(0) !== '12am' || timeLabel(25) !== '12:30pm' || timeLabel(31, true) !== '15:30') fails.push('calendar: time labels');
      return fails;
    },
  });
})();
