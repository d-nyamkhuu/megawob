/* set-date/oracle.js: start states, oracle plans and solved models (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function initModel(spec, rng) {
    const v = spec.scenario;
    const mode = spec.startMode || 'off';
    if (v === 'calendar') {
      const base = { value: '', open: !!spec.inline, view: spec.start, years: false, menu: '', ...(spec.header === 'zoom' ? { zoom: 'days' } : {}) };
      const T = spec.target;
      const [y, m, d] = lib.ymd(T);
      // scene: the picker open on the target month, nothing selected
      if (mode === 'scene') return { ...base, open: true, view: lib.monthOf(T) };
      if (mode === 'partial') {
        const iso = lib.dayInMonth(rng, lib.monthOf(T), T);
        return lib.disabled(spec, base, iso) ? base : { ...base, value: iso, view: lib.monthOf(iso) };
      }
      if (mode === 'wrong') {
        let iso = d <= 12 && d !== m ? lib.isoOf(y, d, m) : lib.fromDays(lib.days(T) + rng.pick([-1, 1]) * rng.int(1, 9));
        if (spec.askKind === 'relToday' || spec.askKind === 'today') iso = lib.fromDays(lib.days(T) + rng.pick([-7, -1, 1, 7]));
        if (!lib.ymd(iso) || iso === T || lib.disabled(spec, base, iso)) iso = lib.fromDays(lib.days(T) + 1);
        return { ...base, value: iso, view: lib.monthOf(iso) };
      }
      const value = rng.bool(0.4) ? lib.dayInMonth(rng, spec.start, T) : '';
      return value && !lib.disabled(spec, base, value) ? { ...base, value, view: lib.monthOf(value) } : base;
    }
    if (v === 'month') {
      const base = { value: '', open: false, view: spec.start };
      const T = spec.target;
      const [ty, tm] = [+T.slice(0, 4), +T.slice(5, 7)];
      if (mode === 'scene') return { ...base, open: true, view: T };
      if (mode === 'partial') { const k = lib.monthKey(ty + (ty > 2022 && rng.bool(0.5) ? -1 : 1), tm); return { ...base, value: k, view: k }; }
      if (mode === 'wrong') { const k = lib.addMonths(T, rng.pick([-1, 1])); return { ...base, value: k, view: k }; }
      if (!rng.bool(0.4)) return base;
      const k = lib.addMonths(T, rng.pick([-1, 1]) * rng.int(2, 14));
      return lib.inYears(k) ? { ...base, value: k, view: k } : base;
    }
    if (v === 'week') {
      const base = { value: '', open: false, view: spec.start };
      const T = spec.target;
      if (mode === 'scene') return { ...base, open: true, view: lib.monthOf(spec.anchor) };
      if (mode === 'partial' || mode === 'wrong') {
        const k = lib.fromDays(lib.days(T) + 7 * rng.pick(mode === 'wrong' ? [-1, 1] : [-2, -1, 1, 2]));
        return { ...base, value: k, view: lib.monthOf(k) };
      }
      if (!rng.bool(0.4)) return base;
      const k = lib.weekStartOf(lib.dayInMonth(rng, spec.start), spec.weekStart);
      return k === T ? base : { ...base, value: k };
    }
    if (v === 'segmented') {
      const T = spec.target;
      const [y, m, d] = lib.ymd(T);
      const base = { y: '', m: '', d: '', focus: '' };
      if (mode === 'partial') return { ...base, ...lib.segsOf(lib.isoOf(y + rng.pick([-1, 1]), m, Math.min(d, 28))) };
      if (mode === 'wrong') return { ...base, ...lib.segsOf(d <= 12 && d !== m ? lib.isoOf(y, d, m) : lib.fromDays(lib.days(T) + rng.pick([-1, 1]) * rng.int(1, 30))) };
      if (!rng.bool(0.4)) return base;
      return { ...base, ...lib.segsOf(lib.fromDays(lib.days(T) + rng.pick([-1, 1]) * rng.int(5, 400))) };
    }
    if (v === 'typed') {
      const T = spec.target;
      const [y, m, d] = lib.ymd(T);
      if (mode === 'scene') return { text: '' };
      if (mode === 'partial') return { text: lib.typedText(spec, lib.isoOf(y + rng.pick([-1, 1]), m, Math.min(d, 28))) };
      if (mode === 'wrong') {
        if (d <= 12 && d !== m) return { text: lib.typedText(spec, lib.isoOf(y, d, m)) };
        return { text: lib.typedText(spec, lib.fromDays(lib.days(T) + rng.pick([-1, 1]) * rng.int(1, 30))) };
      }
      if (!rng.bool(0.4)) return { text: '' };
      return { text: lib.typedText(spec, lib.fromDays(lib.days(T) + rng.pick([-1, 1]) * rng.int(5, 400))) };
    }
    if (v === 'range') {
      const { start: s, end: e } = spec.target;
      const base = { start: '', end: '', open: !!spec.inline, view: spec.start, ...(spec.splitCals ? { view2: spec.start } : {}) };
      // scene: the picker open on the first target month (both calendars with splitCals), nothing selected
      if (mode === 'scene') return { ...base, open: true, view: lib.monthOf(s), ...(spec.splitCals ? { view2: lib.monthOf(s) } : {}) };
      if (mode === 'partial') return { ...base, start: s };
      if (mode === 'wrong') {
        // An end before the start (the form shows a validation error).
        const a = lib.fromDays(lib.days(e) + rng.int(1, 6));
        let b = lib.fromDays(lib.days(s) - rng.int(0, 3));
        if (b >= a) b = lib.fromDays(lib.days(a) - 1);
        return { ...base, start: a, end: b };
      }
      if (!rng.bool(0.4)) return base;
      const st = lib.dayInMonth(rng, spec.start);
      return { ...base, start: st, end: lib.fromDays(lib.days(st) + rng.int(1, 9)) };
    }
    if (v === 'duration') {
      const T = spec.target;
      const h = lib.fdiv(T / 60);
      const m = T % 60;
      let val;
      if (mode === 'partial') val = h * 60 + ((m + spec.step * rng.int(1, 3)) % 60);
      else if (mode === 'wrong') val = spec.askKind === 'decimal' ? h * 60 + Math.round((T / 60 - h) * 100) : Math.max(0, T + rng.pick([-60, 60]));
      else val = spec.control === 'presets' ? rng.pick(spec.presets) : rng.int(0, lib.fdiv(240 / spec.step)) * spec.step;
      if (spec.control !== 'fields') val = Math.min(720, Math.round(val / spec.step) * spec.step);
      if (spec.control === 'spin') val = Math.min(val, 12 * 60 + 55);
      if (spec.control !== 'fields') return { value: val };
      if (mode === 'off' && rng.bool(0.5)) return { h: '', m: '' };
      return { h: String(lib.fdiv(val / 60)), m: String(val % 60) };
    }
    // time
    const T = spec.target;
    const P = lib.parts12(T);
    let val;
    if (mode === 'partial') val = lib.from12(P.h, (P.m + spec.step * rng.int(1, 6)) % 60, P.ap);
    else if (mode === 'wrong') val = lib.from12(P.h, P.m, P.ap === 'AM' ? 'PM' : 'AM');
    else val = rng.int(0, 1440 / spec.step - 1) * spec.step;
    if (spec.control === 'text24') return { text: mode === 'off' && !rng.bool(0.4) ? '' : lib.fmt24(val) };
    if (spec.control === 'dropdowns') {
      const P2 = lib.parts12(val);
      return mode === 'scene' || (mode === 'off' && rng.bool(0.5)) ? { h: null, m: null, ap: null, open: '' } : { h: P2.h, m: P2.m, ap: P2.ap, open: '' };
    }
    if (spec.control === 'columns' && mode === 'scene') return { value: null, open: true };
    if (spec.control === 'columns') return { value: mode === 'off' && rng.bool(0.5) ? null : val, open: false };
    if (spec.control === 'clock') return { value: val, open: false, stage: 'hour' };
    return { value: val, focus: '' };
  }

  function planSegmented(model, spec) {
    const T = lib.segsOf(spec.target);
    for (const k of ['y', 'm', 'd']) {
      if (lib.segInt(model[k]) === +T[k]) continue;
      if (spec.how === 'type') return { type: [{ seg: k }, T[k]] };
      const { n, dir } = lib.segSteps(model, spec, k, +T[k]);
      if (n > 10) return { type: [{ seg: k }, T[k]] };
      if (spec.how === 'keys') return model.focus !== k ? { click: { seg: k } } : { key: dir === 'up' ? 'ArrowUp' : 'ArrowDown' };
      return model.focus !== k ? { click: { seg: k } } : { click: { segSpin: dir } };
    }
    return null;
  }

  function planCalendar(model, spec) {
    if (!model.open) return { click: { field: 'main' } };
    const T = spec.target;
    const tKey = lib.monthOf(T);
    const tYear = +T.slice(0, 4);
    const tMonth = +T.slice(5, 7);
    if (spec.todayBtn && spec.todayMode === 'goto') {
      const far = Math.abs(lib.monthDiff(model.view, tKey));
      const near = Math.abs(lib.monthDiff(lib.monthOf(spec.today), tKey));
      // Not once the view is already in the target's year with a menu header: the year pick keeps the month, goto
      // would throw the view back to today's year and the plan would loop (pick year -> goto -> pick year ...).
      const inYear = spec.header !== 'arrows' && +model.view.slice(0, 4) === tYear;
      if (far >= 4 && near <= 1 && model.view !== lib.monthOf(spec.today) && !inYear) return { click: { todayGoto: true } };
    } else if (spec.todayBtn) {
      if (T === spec.today) return { click: { todayBtn: true } };
      const far = Math.abs(lib.monthDiff(model.view, tKey));
      const near = Math.abs(lib.monthDiff(lib.monthOf(spec.today), tKey));
      if (far >= 4 && near <= 1 && model.value !== spec.today) return { click: { todayBtn: true } };
    }
    if (spec.header === 'selects') {
      if (model.menu === 'year') return { click: { pickYear: tYear } };
      if (model.menu === 'month') return { click: { pickMonth: tMonth } };
      if (+model.view.slice(0, 4) !== tYear) return { click: { menu: 'year' } };
      if (Math.abs(lib.monthDiff(model.view, tKey)) > 1) return { click: { menu: 'month' } };
      return lib.navToward(model.view, T, 1);
    }
    if (spec.header === 'zoom') {
      const vy = +model.view.slice(0, 4);
      if (model.zoom === 'years') return { click: { year: tYear } };
      if (model.zoom === 'months') {
        if (vy === tYear) return { click: { pickMonth: tMonth } };
        if (Math.abs(vy - tYear) === 1) return { click: { nav: vy < tYear ? 'next' : 'prev' } };
        return { click: { yearToggle: true } };
      }
      if (Math.abs(lib.monthDiff(model.view, tKey)) <= 2) return lib.navToward(model.view, T, 1);
      return { click: { yearToggle: true } };
    }
    if (model.years) return { click: { year: tYear } };
    if (spec.header === 'yearGrid' && +model.view.slice(0, 4) !== tYear && Math.abs(lib.monthDiff(model.view, tKey)) > 6) {
      return { click: { yearToggle: true } };
    }
    return lib.navToward(model.view, T, 1);
  }

  function planTime(model, spec) {
    const T = lib.parts12(spec.target);
    if (spec.control === 'text24') return { type: [{ field: 'main' }, lib.fmt24(spec.target)] };
    if (spec.control === 'dropdowns') {
      for (const [k, f] of [['hour', 'h'], ['minute', 'm'], ['ampm', 'ap']]) {
        if (model[f] !== T[f]) return model.open === k ? { click: { col: k, value: T[f] } } : { click: { dd: k } };
      }
      return null;
    }
    if (spec.control === 'columns') {
      if (!model.open) return { click: { field: 'main' } };
      const Cv = model.value === null ? null : lib.parts12(model.value);
      if (!Cv || Cv.h !== T.h) return { click: { col: 'hour', value: T.h } };
      if (Cv.m !== T.m) return { click: { col: 'minute', value: T.m } };
      if (Cv.ap !== T.ap) return { click: { col: 'ampm', value: T.ap } };
      return null;
    }
    if (spec.control === 'clock') {
      if (!model.open) return { click: { field: 'main' } };
      const Cv = lib.parts12(model.value ?? 0);
      if (Cv.h !== T.h) return model.stage === 'hour' ? { click: { face: 'hour', value: T.h } } : { click: { faceMode: 'hour' } };
      if (Cv.m !== T.m) return model.stage === 'minute' ? { click: { face: 'minute', value: T.m } } : { click: { faceMode: 'minute' } };
      if (Cv.ap !== T.ap) return { click: { ampm: T.ap } };
      return null;
    }
    const Cv = lib.parts12(model.value);
    const spinStep = (kind, dir) => {
      if (!spec.keys) return { click: { spin: kind, dir } };
      if (model.focus !== kind) return { click: { spinField: kind } };
      return { key: dir === 'up' ? 'ArrowUp' : 'ArrowDown' };
    };
    if (Cv.h !== T.h) {
      const up = (T.h - Cv.h + 12) % 12;
      return spinStep('hour', up <= 6 ? 'up' : 'down');
    }
    if (Cv.m !== T.m) {
      const up = ((T.m - Cv.m + 60) % 60) / spec.step;
      return spinStep('minute', up <= 60 / spec.step / 2 ? 'up' : 'down');
    }
    if (Cv.ap !== T.ap) return { click: { ampm: T.ap } };
    return null;
  }

  function planDuration(model, spec) {
    const T = spec.target;
    if (spec.control === 'fields') {
      const h = String(lib.fdiv(T / 60));
      if (String(model.h || '').trim() !== h) return { type: [{ durField: 'hours' }, h] };
      return { type: [{ durField: 'minutes' }, String(T % 60)] };
    }
    const v = model.value;
    if (spec.control === 'spin') {
      const dh = lib.fdiv(T / 60) - lib.fdiv(v / 60);
      if (dh) return { click: { dur: 'hours', dir: dh > 0 ? 'up' : 'down' } };
      const up = (((T % 60) - (v % 60) + 60) % 60) / spec.step;
      return { click: { dur: 'minutes', dir: up <= 60 / spec.step / 2 ? 'up' : 'down' } };
    }
    // presets: a preset plus steps, or steps from here, whichever is fewer clicks
    const fromHere = Math.abs(T - v) / spec.step;
    let best = null;
    for (const p of spec.presets) {
      const c = 1 + Math.abs(T - p) / spec.step;
      if (p !== v && c < fromHere && (!best || c < best[1])) best = [p, c];
    }
    if (best) return { click: { preset: best[0] } };
    return { click: { stepBtn: T > v ? 'up' : 'down' } };
  }

  function planOf(model, spec) {
    const v = spec.scenario;
    if (lib.errorOf(model, spec) === 0) return null;
    if (v === 'typed') return { type: [{ field: 'main' }, lib.typedText(spec, spec.target)] };
    if (v === 'segmented') return planSegmented(model, spec);
    if (v === 'time') return planTime(model, spec);
    if (v === 'duration') return planDuration(model, spec);
    if (v === 'calendar') return planCalendar(model, spec);
    if (v === 'month') {
      if (!model.open) return { click: { field: 'main' } };
      const dy = +spec.target.slice(0, 4) - +model.view.slice(0, 4);
      return dy ? { click: { nav: dy > 0 ? 'next' : 'prev' } } : { click: { pickMonth: +spec.target.slice(5, 7) } };
    }
    if (v === 'week') return model.open ? lib.navToward(model.view, spec.anchor, 1) : { click: { field: 'main' } };
    // range: pick the start (restarting if needed), then the end
    if (!model.open) return { click: { field: 'main' } };
    const { start, end } = spec.target;
    if (spec.splitCals) {
      // independent calendars: fix the start first, then the end; each calendar pages on its own
      const cal = model.start === start ? 'end' : 'start';
      const want = cal === 'end' ? end : start;
      const d = lib.monthDiff(cal === 'end' ? model.view2 : model.view, lib.monthOf(want));
      return { click: d < 0 ? { nav: 'prev', cal } : d > 0 ? { nav: 'next', cal } : { day: want, cal } };
    }
    const want = model.start === start && !model.end ? end : start;
    return lib.navToward(model.view, want, 2);
  }

  function solveOf(spec, model) {
    const v = spec.scenario;
    if (v === 'calendar') return { ...model, value: spec.target, open: !!spec.inline, years: false, menu: '', view: lib.monthOf(spec.target), ...(spec.header === 'zoom' ? { zoom: 'days' } : {}) };
    if (v === 'month') return { ...model, value: spec.target, open: false, view: spec.target };
    if (v === 'week') return { ...model, value: spec.target, open: false, view: lib.monthOf(spec.anchor) };
    if (v === 'typed') return { text: lib.typedText(spec, spec.target) };
    if (v === 'segmented') return { ...lib.segsOf(spec.target), focus: '' };
    if (v === 'range') return { ...model, start: spec.target.start, end: spec.target.end, open: !!spec.inline };
    if (v === 'duration') return spec.control === 'fields' ? { h: String(lib.fdiv(spec.target / 60)), m: String(spec.target % 60) } : { value: spec.target };
    if (spec.control === 'text24') return { text: lib.fmt24(spec.target) };
    if (spec.control === 'dropdowns') { const p = lib.parts12(spec.target); return { h: p.h, m: p.m, ap: p.ap, open: '' }; }
    return { ...model, value: spec.target, open: false };
  }

  Object.assign(lib, { initModel, planOf, solveOf });
})();
