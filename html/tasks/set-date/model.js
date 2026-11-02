/* set-date/model.js: control actions and scored values (no DOM). */
(function () {
  'use strict';
  const lib = env.taskOf('set-date').lib;

  function disabled(spec, model, iso, cal) {
    if (spec.scenario === 'calendar') {
      const L = spec.limit || {};
      return (L.min && iso < L.min) || (L.max && iso > L.max) || false;
    }
    if (spec.scenario !== 'range') return false;
    if ((spec.booked || []).includes(iso)) return true;
    if (cal === 'start') return false; // splitCals: the start calendar only knows booked days
    if (model && model.start && !model.end && iso > model.start) {
      const n = lib.days(iso) - lib.days(model.start);
      if (spec.rule === 'minmax' && (n < spec.minN || n > spec.maxN)) return true;
      if (spec.booked && spec.booked.some((b) => b > model.start && b < iso)) return true;
    }
    return false;
  }

  function pickSplit(model, iso, cal) {
    if (cal === 'end') return { ...model, end: iso };
    const clear = model.end && model.end <= iso;
    return { ...model, start: iso, end: clear ? '' : model.end, ...(clear ? { endWas: model.end } : {}) };
  }

  function pickRange(model, iso) {
    if (model.start && !model.end && lib.days(iso) > lib.days(model.start)) return { ...model, end: iso, open: false };
    return { ...model, start: iso, end: '', endWas: model.end || model.endWas || '' };
  }

  const SEG_W = { y: 4, m: 2, d: 2 };

  const segInt = (txt) => (/^\d+$/.test(String(txt || '')) ? +txt : null);

  function segDate(model) {
    const y = segInt(model.y);
    const m = segInt(model.m);
    const d = segInt(model.d);
    if (y === null || m === null || d === null || String(model.y).length !== 4 || y < 1000) return null;
    if (m < 1 || m > 12 || d < 1 || d > lib.daysInMonth(y, m)) return null;
    return lib.isoOf(y, m, d);
  }

  function stepSeg(model, spec, k, dir) {
    const [ty, tm, td] = lib.ymd(spec.today);
    const cur = segInt(model[k]);
    let lo = 1;
    let hi = 12;
    let val;
    if (k === 'y') { lo = lib.YEAR0; hi = lib.YEAR1; } else if (k === 'd') {
      const y = segInt(model.y);
      const m = segInt(model.m);
      hi = y !== null && m !== null && m >= 1 && m <= 12 && String(model.y).length === 4 ? lib.daysInMonth(y, m) : 31;
    }
    if (cur === null) val = k === 'y' ? ty : k === 'm' ? tm : td;
    else if (dir === 'up') val = cur >= hi ? lo : cur + 1;
    else val = cur <= lo ? hi : Math.min(hi, cur - 1);
    return { ...model, [k]: k === 'y' ? String(val) : lib.pad2(val) };
  }

  function segSteps(model, spec, k, want) {
    if (segInt(model[k]) === null) return { n: 0, dir: 'up' };
    const run = (dir) => {
      let m = model;
      for (let n = 1; n <= 40; n++) { m = stepSeg(m, spec, k, dir); if (segInt(m[k]) === want) return n; }
      return 99;
    };
    const up = run('up');
    const down = run('down');
    return up <= down ? { n: up, dir: 'up' } : { n: down, dir: 'down' };
  }

  function apply(model, spec, t) {
    let out = applyRaw(model, spec, t);
    if (spec.scenario === 'calendar' && out !== model) {
      if (spec.inline) out = { ...out, open: true };
      if (spec.header === 'zoom' && (t.day || t.todayBtn || t.todayGoto || t.field || t.outside || t.done)) out = { ...out, zoom: 'days' };
    }
    if (spec.scenario === 'range' && spec.inline && out !== model && !out.open) out = { ...out, open: true };
    return out;
  }

  function applyRaw(model, spec, t) {
    const v = spec.scenario;
    if (v === 'segmented') {
      if (t.seg) return { ...model, focus: t.seg };
      if (t.segSpin) return model.focus ? stepSeg(model, spec, model.focus, t.segSpin) : model;
      if (t.key && t.field && (t.key === 'ArrowUp' || t.key === 'ArrowDown')) return stepSeg(model, spec, t.field, t.key === 'ArrowUp' ? 'up' : 'down');
      if (t.outside) return { ...model, focus: '' };
      if (t.key) return model;
      throw new Error(`set-date: cannot apply ${JSON.stringify(t)}`);
    }
    if (v === 'month') {
      if (t.outside || t.done) return { ...model, open: false };
      if (t.field) return model.open ? { ...model, open: false } : { ...model, open: true, view: model.value || spec.start };
      if (t.nav) return { ...model, view: lib.clampKey(lib.addMonths(model.view, t.nav === 'next' ? 12 : -12), lib.EPOCH.first, lib.EPOCH.last) };
      if (t.pickMonth !== undefined) { const k = lib.monthKey(+model.view.slice(0, 4), t.pickMonth); return { ...model, value: k, open: false, view: k }; }
      if (t.key) return model;
      throw new Error(`set-date: cannot apply ${JSON.stringify(t)}`);
    }
    const closeUi = { open: v === 'time' && spec.control === 'dropdowns' ? '' : false, ...(v === 'calendar' ? { years: false, menu: '' } : {}), ...(spec.control === 'clock' ? { stage: 'hour' } : {}) };
    if (t.outside || t.done) return 'open' in model ? { ...model, ...closeUi } : model;
    if (t.key) {
      if (v === 'time' && t.field && (t.key === 'ArrowUp' || t.key === 'ArrowDown')) return apply(model, spec, { spin: t.field, dir: t.key === 'ArrowUp' ? 'up' : 'down' });
      return model;
    }
    if (t.spinField) return { ...model, focus: t.spinField };
    if (t.field) {
      if (model.open) return { ...model, ...closeUi };
      if (v === 'calendar') return { ...model, open: true, years: false, menu: '', view: model.value ? lib.monthOf(model.value) : spec.start };
      if (v === 'week') return { ...model, open: true, view: model.value ? lib.monthOf(model.value) : spec.start };
      if (v === 'range') {
        const view = model.start ? lib.monthOf(model.start) : spec.start;
        const v1 = lib.clampKey(view, lib.EPOCH.first, lib.addMonths(lib.EPOCH.last, -1));
        return { ...model, open: true, view: v1, ...(spec.splitCals ? { view2: model.end ? lib.monthOf(model.end) : v1 } : {}) };
      }
      if (v === 'time' && (spec.control === 'columns' || spec.control === 'clock')) return { ...model, open: true, ...(spec.control === 'clock' ? { stage: 'hour' } : {}) };
      return model;
    }
    if (t.nav && spec.header === 'zoom' && model.zoom !== 'days') {
      return model.zoom === 'months' ? { ...model, view: lib.clampKey(lib.addMonths(model.view, t.nav === 'next' ? 12 : -12), lib.EPOCH.first, lib.EPOCH.last) } : model;
    }
    if (t.nav && v === 'range' && spec.splitCals) {
      const f = t.cal === 'end' ? 'view2' : 'view';
      return { ...model, [f]: lib.clampKey(lib.addMonths(model[f], t.nav === 'next' ? 1 : -1), lib.EPOCH.first, lib.EPOCH.last) };
    }
    if (t.nav) {
      const hi = v === 'range' ? lib.addMonths(lib.EPOCH.last, -1) : lib.EPOCH.last;
      return { ...model, menu: v === 'calendar' ? '' : model.menu, view: lib.clampKey(lib.addMonths(model.view, t.nav === 'next' ? 1 : -1), lib.EPOCH.first, hi) };
    }
    if (t.yearToggle && spec.header === 'zoom') return { ...model, zoom: model.zoom === 'days' ? 'months' : 'years' };
    if (t.yearToggle) return { ...model, years: !model.years };
    if (t.year !== undefined && spec.header === 'zoom') return { ...model, zoom: 'months', view: lib.monthKey(t.year, +model.view.slice(5, 7)) };
    if (t.year !== undefined) return { ...model, years: false, view: lib.monthKey(t.year, +model.view.slice(5, 7)) };
    if (t.pickMonth !== undefined && spec.header === 'zoom') return { ...model, zoom: 'days', view: lib.monthKey(+model.view.slice(0, 4), t.pickMonth) };
    if (t.todayGoto) return { ...model, menu: '', years: false, view: lib.monthOf(spec.today), ...(spec.header === 'zoom' ? { zoom: 'days' } : {}) };
    if (t.menu) return { ...model, menu: model.menu === t.menu ? '' : t.menu };
    if (t.pickMonth !== undefined) return { ...model, menu: '', view: lib.monthKey(+model.view.slice(0, 4), t.pickMonth) };
    if (t.pickYear !== undefined) return { ...model, menu: '', view: lib.monthKey(t.pickYear, +model.view.slice(5, 7)) };
    if (t.todayBtn) {
      if (disabled(spec, model, spec.today)) return model;
      return { ...model, value: spec.today, open: false, years: false, menu: '', view: lib.monthOf(spec.today) };
    }
    if (t.day) {
      if (disabled(spec, model, t.day, t.cal)) return model;
      if (v === 'range' && spec.splitCals) return pickSplit(model, t.day, t.cal);
      if (v === 'range') return { ...pickRange(model, t.day), view: model.view };
      if (v === 'week') return { ...model, value: lib.weekStartOf(t.day, spec.weekStart), open: false, view: lib.monthOf(t.day) };
      return { ...model, value: t.day, open: false, years: false, menu: '', view: lib.monthOf(t.day) };
    }
    if (t.dd) return { ...model, open: model.open === t.dd ? '' : t.dd };
    if (t.col && spec.control === 'dropdowns') {
      const f = t.col === 'hour' ? 'h' : t.col === 'minute' ? 'm' : 'ap';
      return { ...model, [f]: t.value, open: '' };
    }
    if (t.spin) {
      const p = lib.parts12(model.value ?? 0);
      if (t.spin === 'hour') p.h = ((p.h - 1 + (t.dir === 'up' ? 1 : 11)) % 12) + 1;
      else p.m = (p.m + (t.dir === 'up' ? spec.step : 60 - spec.step)) % 60;
      return { ...model, value: lib.from12(p.h, p.m, p.ap) };
    }
    if (t.ampm) {
      const p = lib.parts12(model.value ?? 0);
      return { ...model, value: lib.from12(p.h, p.m, t.ampm) };
    }
    if (t.col) {
      const p = model.value === null ? { h: 12, m: 0, ap: 'AM' } : lib.parts12(model.value);
      if (t.col === 'hour') p.h = t.value;
      else if (t.col === 'minute') p.m = t.value;
      else p.ap = t.value;
      return { ...model, value: lib.from12(p.h, p.m, p.ap) };
    }
    if (t.faceMode) return { ...model, stage: t.faceMode };
    if (t.face) {
      const p = lib.parts12(model.value ?? 0);
      if (t.face === 'hour') { p.h = t.value; return { ...model, value: lib.from12(p.h, p.m, p.ap), stage: 'minute' }; }
      p.m = t.value;
      return { ...model, value: lib.from12(p.h, p.m, p.ap) };
    }
    if (t.dur) {
      const h = lib.fdiv(model.value / 60);
      const m = model.value % 60;
      if (t.dur === 'hours') return { ...model, value: Math.min(12, Math.max(0, h + (t.dir === 'up' ? 1 : -1))) * 60 + m };
      return { ...model, value: h * 60 + ((m + (t.dir === 'up' ? spec.step : 60 - spec.step)) % 60) };
    }
    if (t.preset !== undefined) return { ...model, value: t.preset };
    if (t.stepBtn) return { ...model, value: Math.max(0, Math.min(720, model.value + (t.stepBtn === 'up' ? spec.step : -spec.step))) };
    throw new Error(`set-date: cannot apply ${JSON.stringify(t)}`);
  }

  function navToward(view, want, span) {
    const d = lib.monthDiff(view, lib.monthOf(want));
    if (d < 0) return { click: { nav: 'prev' } };
    if (d >= span) return { click: { nav: 'next' } };
    return { click: { day: want } };
  }

  const dayErr = (iso, target) => {
    const n = lib.days(iso);
    return n === null ? lib.MAX_DAYS : Math.min(lib.MAX_DAYS, Math.abs(n - lib.days(target)));
  };

  const intOf = (s) => (/^\d{1,3}$/.test(String(s || '').trim()) ? +String(s).trim() : null);

  function valueOf(model, spec) {
    if (spec.scenario === 'calendar') return lib.ymd(model.value) ? model.value : null;
    if (spec.scenario === 'month' || spec.scenario === 'week') return model.value || null;
    if (spec.scenario === 'typed') return spec.longForm ? lib.parseLong(model.text) : lib.parseDate(model.text, spec.mask);
    if (spec.scenario === 'segmented') return segDate(model);
    if (spec.scenario === 'range') return { start: model.start || null, end: model.end || null };
    if (spec.scenario === 'duration') {
      if (spec.control !== 'fields') return model.value;
      const h = intOf(model.h);
      const m = intOf(model.m);
      if (h === null && m === null) return null;
      if ((model.h && h === null) || (model.m && m === null)) return null;
      return (h || 0) * 60 + (m || 0);
    }
    if (spec.control === 'dropdowns') return model.h && model.m !== null && model.ap ? lib.from12(model.h, model.m, model.ap) : null;
    return spec.control === 'text24' ? lib.parseTime24(model.text) : model.value;
  }

  function errorOf(model, spec) {
    const val = valueOf(model, spec);
    if (spec.scenario === 'range') {
      const endErr = val.end ? dayErr(val.end, spec.target.end) : model.endWas ? Math.max(1, dayErr(model.endWas, spec.target.end)) : lib.MAX_DAYS;
      return (val.start ? dayErr(val.start, spec.target.start) : lib.MAX_DAYS) + endErr;
    }
    if (spec.scenario === 'month') return val === null ? lib.MAX_DAYS : Math.min(lib.MAX_DAYS, Math.abs(lib.monthDiff(val, spec.target)));
    if (spec.scenario === 'segmented') return segErr(model, spec);
    if (val === null || val === undefined) return spec.scenario === 'time' || spec.scenario === 'duration' ? lib.MAX_MIN : lib.MAX_DAYS;
    if (spec.scenario === 'time') return timeSteps(val, spec.target);
    if (spec.scenario === 'duration') return spec.control === 'spin' ? durSteps(val, spec.target) : Math.min(lib.MAX_MIN, Math.abs(val - spec.target));
    return dayErr(val, spec.target);
  }

  function circ(a, b, n) { const k = Math.abs(a - b) % n; return Math.min(k, n - k); }

  function timeSteps(a, b) {
    const x = lib.parts12(a);
    const y = lib.parts12(b);
    return 60 * circ(x.h, y.h, 12) + circ(x.m, y.m, 60) + (x.ap !== y.ap ? 720 : 0);
  }

  function durSteps(a, b) {
    return 60 * Math.abs(lib.fdiv(a / 60) - lib.fdiv(b / 60)) + circ(a % 60, b % 60, 60);
  }

  function segErr(model, spec) {
    const [ty, tm, td] = lib.ymd(spec.target);
    const y = segInt(model.y);
    const m = segInt(model.m);
    const d = segInt(model.d);
    const span = 365 * (lib.YEAR1 - lib.YEAR0 + 1);
    const dE = d === null ? 16 : circ(d, td, 31);
    const mE = m === null ? 210 : 30 * circ(m, tm, 12);
    const inRange = y !== null && y >= lib.YEAR0 && y <= lib.YEAR1;
    const yE = y === null || String(model.y).length !== 4 ? span + 365
      : inRange ? 365 * circ(y, ty, lib.YEAR1 - lib.YEAR0 + 1) : Math.min(span, 365 * Math.abs(y - ty));
    return dE + mE + yE;
  }

  Object.assign(lib, { disabled, SEG_W, segInt, segSteps, apply, navToward, valueOf, errorOf });
  Object.assign(env.taskOf('set-date').helpers, { apply, disabled });
})();
