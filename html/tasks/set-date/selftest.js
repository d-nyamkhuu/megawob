/* set-date/selftest.js: model self-tests; loaded only by the kit/selftest.js harness. */
(function () {
  'use strict';
  env.selfTest('set-date', (T) => {
    const fails = [];
    const { def, lib } = T;
    let prev = null;
    for (let n = lib.civilToDays(2019, 12, 1); n <= lib.civilToDays(2033, 1, 31); n++) {
      const iso = lib.fromDays(n);
      if (lib.days(iso) !== n) { fails.push(`round trip ${n} -> ${iso}`); break; }
      if (prev && !(iso > prev)) { fails.push(`not increasing at ${iso}`); break; }
      prev = iso;
    }
    for (const [iso, w] of [['1970-01-01', 4], ['2000-01-01', 6], ['2024-02-29', 4], ['2027-03-04', 4], ['2032-12-31', 5]]) {
      if (lib.weekday(iso) !== w) fails.push(`weekday(${iso}) = ${lib.weekday(iso)}, want ${w}`);
    }
    T.check(lib.daysInMonth(2024, 2) === 29 && lib.daysInMonth(2100, 2) === 28 && lib.daysInMonth(2000, 2) === 29, 'leap years');
    if (lib.days('2027-02-29') !== null || lib.days('2027-13-01') !== null) fails.push('invalid ISO accepted');
    if (lib.maskText('03/04/2027', 'MM/DD/YYYY') !== '03/04/2027' || lib.maskText('0304', 'DD.MM.YYYY') !== '03.04') fails.push('maskText');
    if (lib.maskText('2027x03-0412', 'YYYY-MM-DD') !== '2027-03-04') fails.push('maskText overflow');
    if (lib.parseDate('04/03/2027', 'DD/MM/YYYY') !== '2027-03-04' || lib.parseDate('02/30/2027', 'MM/DD/YYYY') !== null) fails.push('parseDate');
    for (const [t, iso] of [['March 5, 2024', '2024-03-05'], ['Tuesday, March 5, 2024', '2024-03-05'], ['tue mar 5th 2024', '2024-03-05'], ['Mar. 05 2024', '2024-03-05'],
      ['Wednesday, March 5, 2024', null], ['March 32, 2024', null], ['Marz 5, 2024', null], ['March 5 24', null]]) {
      if (lib.parseLong(t) !== iso) fails.push(`parseLong(${t}) = ${lib.parseLong(t)}`);
    }
    if (lib.parseTime24('19:45') !== 1185 || lib.parseTime24('24:00') !== null || lib.parseTime24('7:45') !== null) fails.push('parseTime24');
    if (lib.fmt12(0) !== '12:00 AM' || lib.fmt12(720) !== '12:00 PM' || lib.fmt12(1185) !== '7:45 PM') fails.push('fmt12');
    if (lib.addMonths('2027-01', -1) !== '2026-12' || lib.addMonths('2026-12', 14) !== '2028-02') fails.push('addMonths');
    const r0 = new env.Rng(3);
    const tw = lib.timeWords(r0, 1185);
    if (tw !== 'quarter to eight in the evening' && tw !== 'quarter to 8 in the evening') fails.push(`timeWords ${tw}`);

    // Widget traits of the calendar widgets (zoom header, jQuery-UI Today/Done, always-open inline).
    const CAL_TRAITS = [undefined, { headers: ['zoom'], todayBtn: false }, { headers: ['selects'], todayBtn: true, todayMode: 'goto' },
      { inline: true, headers: ['arrows', 'selects', 'yearGrid'] }, { headers: ['zoom'], inline: true }];
    const VAR_TRAITS = {
      calendar: CAL_TRAITS,
      range: [undefined, { inline: true }, { splitCals: true }, { inline: true, splitCals: true }],
      time: [undefined, { timeControls: ['dropdowns'] }, { timeControls: ['spin', 'dropdowns', 'columns'] }],
      typed: [undefined, { typedFormat: 'long' }, { typedFormat: 'longDay' }, { typedFormat: 'either' }],
    };
    T.sweep({ seeds: 120, rng: (seed) => new env.Rng(5000 + seed), sample: false }, ({ scenario, seed: s, rng }) => {
      const startMode = ['off', 'partial', 'wrong', 'scene'][s % 4];
      const ood = s % 7 === 6;
      let spec;
      let model;
      let ok = false;
      for (let k = 0; k < 50 && !ok; k++) {
        const TL = VAR_TRAITS[scenario];
        const traits = TL ? TL[s % TL.length] : undefined;
        spec = def.sample(rng.fork(`s${k}`), { scenarios: def.scenarios, scenario, startMode, ood, traits, csplit: s % 5 === 4 ? 'heldout' : 'train', level: ['normal', 'easy', 'medium'][(s >> 2) % 3] });
        model = def.init(spec, rng.fork(`i${k}`));
        ok = def.error(model, spec) > 0;
      }
      const tag = `${scenario}/${s}/${startMode}`;
      if (startMode === 'scene' && scenario === 'calendar' && !(model.open && model.view === lib.monthOf(spec.target) && !model.value)) fails.push(`${tag}: scene state ${JSON.stringify(model)}`);
      if (!ok) { fails.push(`${tag}: no off-target start`); return; }
      if (spec.askKind === 'relative') {
        const m = /^the first (\w+) after (.+)$/.exec(spec.ask);
        const anchor = /^\d/.test(m[2]) ? m[2] : null;
        if (anchor) {
          let d = lib.days(anchor) + 1;
          while (lib.WEEKDAYS[lib.weekday(lib.fromDays(d))] !== m[1]) d++;
          if (lib.fromDays(d) !== spec.target) fails.push(`${tag}: relative ask "${spec.ask}" != ${spec.target}`);
        }
      }
      if (scenario === 'calendar' && lib.disabled(spec, null, spec.target)) fails.push(`${tag}: target disabled`);
      if (scenario === 'range') {
        const { start: a, end: b } = spec.target;
        if (!(b > a)) fails.push(`${tag}: empty range`);
        for (let d = lib.days(a); d <= lib.days(b); d++) if (spec.booked.includes(lib.fromDays(d))) fails.push(`${tag}: range spans a booked day`);
        if (spec.rule === 'minmax') { const n = lib.days(b) - lib.days(a); if (n < spec.minN || n > spec.maxN) fails.push(`${tag}: nights ${n} outside limits`); }
      }
      let n = 0;
      const cap = spec.scenario === 'duration' ? 140 : 40; // ood preset durations are long walks of -/+ steps
      for (; n < cap && def.error(model, spec) > 0; n++) {
        const step = def.plan(model, spec);
        if (!step) break;
        if (step.type && step.type[0].seg) {
          const k = step.type[0].seg;
          const txt = step.type[1].slice(0, lib.SEG_W[k]);
          const order = spec.segs.filter((x) => x.k).map((x) => x.k);
          model = { ...model, [k]: txt, focus: txt.length === lib.SEG_W[k] ? order[order.indexOf(k) + 1] || '' : k };
        } else if (step.type) {
          const tgt = step.type[0];
          if (tgt.durField) model = { ...model, [tgt.durField === 'hours' ? 'h' : 'm']: step.type[1] };
          else model = spec.control === 'text24' ? { text: lib.maskText(step.type[1], lib.MASK24) } : { text: spec.longForm ? step.type[1] : lib.maskText(step.type[1], spec.mask) };
        } else if (step.key) model = lib.apply(model, spec, { key: step.key, field: model.focus });
        else model = lib.apply(model, spec, step.click);
      }
      if (def.error(model, spec) !== 0) fails.push(`${tag}: plan stuck, error ${def.error(model, spec)} after ${n} steps`);
      if (n > cap - 10) fails.push(`${tag}: plan took ${n} steps`);
      if (def.error(def.solve(spec, model), spec) !== 0) fails.push(`${tag}: solve() not exact`);
      const text = lib.instructionOf(spec, rng.fork('instr'));
      if (/submit/i.test(text)) fails.push(`${tag}: names the end control: ${text}`);
    });
    // Judge modes: the data the reply is graded from.
    for (const scenario of def.scenarios) {
      for (const mode of ['ambiguous', 'impossible']) {
        for (let seed = 0; seed < 24; seed++) {
          const tag = `${scenario}/judge ${mode} seed ${seed}`;
          try {
            const o = { scenario, scenarios: def.scenarios, startMode: 'off', judge: mode };
            const sp = def.sample(new env.Rng(seed * 17 + 3), o);
            const j = sp.judge;
            if (!j || j.mode !== mode) { fails.push(`${tag}: no spec.judge`); continue; }
            if (mode === 'ambiguous' && !(Array.isArray(j.cands) && j.cands.length >= 2 && j.cands.every(lib.nonEmpty))) fails.push(`${tag}: cands ${JSON.stringify(j.cands)}`);
            if (mode === 'impossible' && !lib.nonEmpty(j.what)) fails.push(`${tag}: what ${JSON.stringify(j.what)}`);
            const text = def.instruction(sp, new env.Rng(seed).fork('t'));
            if (!text || text.includes('{') || /undefined/.test(text)) fails.push(`${tag}: instruction ${text}`);
          } catch (e) { fails.push(`${tag}: ${e.stack || e}`); }
        }
      }
    }
    // sceneRows: more unscored rows; the rest of the sample (target, ask, locale, ...) is the one drawn without the trait.
    for (const scenario of def.scenarios) {
      for (let seed = 0; seed < 12; seed++) {
        const tag = `${scenario}/sceneRows seed ${seed}`;
        const o = { scenario, scenarios: def.scenarios, startMode: 'off', ood: seed % 5 === 0 };
        const want = seed % 2 ? 8 : [5, 9];
        let plain;
        let more;
        try {
          plain = def.sample(new env.Rng(seed * 31 + 7), o);
          more = def.sample(new env.Rng(seed * 31 + 7), { ...o, traits: { sceneRows: want } });
        } catch (e) { fails.push(`${tag}: ${e.stack || e}`); continue; }
        const n = more.scene.extra.length;
        const lo = Array.isArray(want) ? want[0] : want;
        const hi = Array.isArray(want) ? want[1] : want;
        if (n < Math.max(lo, plain.scene.extra.length) || n > Math.max(hi, plain.scene.extra.length)) fails.push(`${tag}: ${n} rows, wanted ${want}`);
        if (JSON.stringify(plain.scene.extra) !== JSON.stringify(more.scene.extra.slice(0, plain.scene.extra.length))) fails.push(`${tag}: scene rows reordered`);
        if (new Set(more.scene.extra.map((x) => x[0])).size !== n || more.scene.extra.some((x) => !x[1])) fails.push(`${tag}: duplicate or empty rows ${JSON.stringify(more.scene.extra)}`);
        const strip = (sp) => JSON.stringify({ ...sp, scene: { ...sp.scene, extra: 0 } });
        if (strip(plain) !== strip(more)) fails.push(`${tag}: trait changed more than the rows`);
        const a = def.sample(new env.Rng(seed * 31 + 7), { ...o, traits: { sceneRows: want } });
        if (JSON.stringify(a) !== JSON.stringify(more)) fails.push(`${tag}: sceneRows not deterministic`);
      }
    }
    return fails.slice(0, 20);

  });
})();
