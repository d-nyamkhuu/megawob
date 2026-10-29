/* type-text/selftest.js: the task's self-test (kit/selftest.js harness; checker and node tests only). */
(function () {
  'use strict';

  function checkFields(T) {
    const { levenshtein, transform, SUBS, fieldError, checkValue } = T.lib;
    const eq = (a, b, what) => { T.check(a === b, `${what}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`); };
    eq(levenshtein('kitten', 'sitting'), 3, 'levenshtein kitten/sitting');
    eq(levenshtein('', 'abc'), 3, 'levenshtein empty');
    eq(transform('hello big World', 'title'), 'Hello Big World', 'title case');
    eq(transform('a b c', 'sub', SUBS[0]), 'a_b_c', 'sub space->_');
    eq(transform('AB-12-x', 'sub', SUBS[3]), 'AB/12/x', 'sub -->/');
    const f = { target: 'abcd', blank: false, type: 'text' };
    eq(fieldError('  abcd ', f), 0, 'trim');
    eq(fieldError('', f), 1, 'empty field');
    eq(fieldError('abce', f), 0.25, 'one substitution');
    eq(fieldError(' ', { target: '', blank: true, type: 'text' }), 0, 'blank with space');
    eq(fieldError('x', { target: '', blank: true, type: 'text' }), 1, 'blank non-empty');
    eq(fieldError(' a \n\n b\n', { target: 'a\nb', type: 'textarea' }), 0, 'textarea lines');
    eq(checkValue('date:DD.MM.YYYY', '14.03.2024'), true, 'date check');
    eq(checkValue('date:DD.MM.YYYY', '2024-03-14'), false, 'date check bad');
    eq(checkValue('email', 'a b@x.com'), false, 'email space');
    eq(checkValue('email', 'ab@x,com'), false, 'email comma');
  }

  function checkEpisodes(T) {
    const { validate, countOf, normValue, kindWords } = T.lib;
    const fam = T.def;
    // Every scenario: the plan (applied in model space) reaches error 0, the targets pass validation, each
    // start mode is off target, and validation-fix corruptions fail validation.
    T.sweep({ seeds: 40, sample: false }, ({ scenario, seed }) => {
      for (const startMode of ['off', 'partial', 'wrong']) {
        const tag = `${scenario} seed ${seed} ${startMode}`;
        let spec;
        let m;
        try {
          const rng = new env.Rng(seed * 7919 + 3);
          spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode, ood: seed % 5 === 4,
            csplit: seed % 3 === 2 ? 'heldout' : 'train' });
          spec.startMode = startMode;
          m = fam.init(spec, rng.fork('i'));
        } catch (e) {
          T.fail(`${tag}: ${e}`);
          continue;
        }
        if (!(fam.error(m, spec) > 0)) T.fail(`${tag}: starts on target`);
        const solved = fam.solve(spec, m);
        const bad = validate(spec, solved.fields);
        if (Object.keys(bad).length) T.fail(`${tag}: targets fail validation ${JSON.stringify(bad)}`);
        if (spec.invalid && !Object.keys(validate(spec, { ...solved.fields, [spec.invalid.id]: spec.invalid.bad })).length) {
          T.fail(`${tag}: corruption ${spec.invalid.how} passes validation`);
        }
        for (const fl of spec.fields) {
          if (fl.maxLength && countOf(fl, fl.target) > fl.maxLength) T.fail(`${tag}: ${fl.id} target longer than maxLength`);
          if (!fl.blank && !normValue(fl.target, fl)) T.fail(`${tag}: ${fl.id} empty target`);
        }
        const labels = spec.fields.map((x) => x.label.toLowerCase());
        if (new Set(labels).size !== labels.length) T.fail(`${tag}: duplicate labels ${labels}`);
        if (spec.sections) {
          if (!spec.ask.some((id) => spec.fields.find((x) => x.id === id).section > 0)) T.fail(`${tag}: no asked field off the default section`);
          if (spec.fields.some((x) => x.from !== x.target && !spec.ask.includes(x.id))) T.fail(`${tag}: unasked field changes`);
        }
        if (spec.scenario === 'complete') {
          const rows = spec.profile.rows;
          for (const fl of spec.fields) {
            const row = rows.find((x) => x.id === fl.id);
            if (fl.blank ? row : !row || row.value !== fl.say) T.fail(`${tag}: profile row for ${fl.id}`);
            if (!fl.blank && !spec.missing.includes(fl.id) && m.fields[fl.id] !== fl.target) T.fail(`${tag}: prefilled ${fl.id} off record`);
          }
          if (!spec.missing.length) T.fail(`${tag}: nothing missing`);
        }
        if (spec.invalid && startMode === 'wrong' && !validate(spec, m.fields)[spec.invalid.id]) {
          T.fail(`${tag}: wrong fix ${JSON.stringify(m.fields[spec.invalid.id])} passes validation`);
        }
        if (spec.nameBy === 'kind') {
          const inv = spec.fields.find((x) => x.id === spec.invalid.id);
          if (!kindWords(inv, spec.fields).includes(spec.invalid.say)) T.fail(`${tag}: kind word ${spec.invalid.say} not unique`);
        }
        let k = 0;
        for (; k < 30; k++) {
          const step = fam.plan(m, spec);
          if (!step) break;
          m = { ...m, fields: { ...m.fields } };
          if (step.type) {
            const fl = spec.fields.find((x) => x.id === step.type[0].field);
            if (spec.sections && m.section !== fl.section) T.fail(`${tag}: types into a closed section`);
            m.fields[step.type[0].field] = step.type[1];
            m.saved = false;
            m.focus = step.type[0].field;
          } else if (step.click && step.click.section !== undefined) {
            m.section = step.click.section;
            m.focus = null;
          } else if (step.key === 'Tab') {
            const live = spec.fields.filter((x) => !x.disabled);
            const next = live[live.findIndex((x) => x.id === m.focus) + 1];
            if (spec.sections && next.section !== m.section) T.fail(`${tag}: Tab leaves the open section`);
            m.focus = next.id;
          } else {
            const errs = validate(spec, m.fields);
            m.errors = errs;
            m.saved = !Object.keys(errs).length;
          }
        }
        if (fam.error(m, spec) !== 0) T.fail(`${tag}: plan ends at error ${fam.error(m, spec)} after ${k} steps`);
      }
    });
  }

  function checkRoutes(T) {
    const { TAB_ROUTE, ENTER_ROUTE } = T.lib;
    const fam = T.def;
    // opts.route forces the route without changing the content.
    T.sweep({ seeds: 12, sample: false }, ({ scenario, seed }) => {
      const mk = (route) => fam.sample(new env.Rng(seed * 31 + 7), { scenario, scenarios: fam.scenarios, startMode: 'off', route });
      const base = mk(undefined);
      const kb = mk('keyboard');
      const pt = mk('pointer');
      const strip = (s) => JSON.stringify({ ...s, route: 0, enter: 0 });
      if (strip(base) !== strip(kb) || strip(base) !== strip(pt)) T.fail(`${scenario} seed ${seed}: route knob changes content`);
      if (TAB_ROUTE.includes(scenario) && kb.route !== 'tab') T.fail(`${scenario} seed ${seed}: keyboard route not tab`);
      if (kb.save && ENTER_ROUTE.includes(scenario) && !kb.enter && !(scenario === 'copy')) T.fail(`${scenario} seed ${seed}: keyboard without Enter`);
      if (pt.route !== 'click' || pt.enter) T.fail(`${scenario} seed ${seed}: pointer route keeps keys`);
    });
  }

  function checkJudges(T) {
    const { nonEmpty } = T.lib;
    const fam = T.def;
    // Judge modes: the data the reply is graded from.
    for (const scenario of fam.scenarios) {
      for (const mode of ['ambiguous', 'impossible']) {
        for (let seed = 0; seed < 12; seed++) {
          const tag = `${scenario} judge ${mode} seed ${seed}`;
          try {
            const rng = new env.Rng(seed * 31 + 11);
            const sp = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, startMode: 'off', judge: mode });
            const j = sp.judge;
            if (!j) { T.fail(`${tag}: no spec.judge`); continue; }
            const text = fam.instruction(sp, rng.fork('t'));
            if (!text || text.includes('{') || /undefined/.test(text)) T.fail(`${tag}: instruction ${text}`);
            if (mode === 'ambiguous') {
              if (!(Array.isArray(j.cands) && j.cands.length >= 2 && j.cands.every(nonEmpty))) T.fail(`${tag}: cands ${JSON.stringify(j.cands)}`);
              else if (!j.cands.every((c) => text.includes(c[0]))) T.fail(`${tag}: instruction lacks the candidates: ${text}`);
              if (!Array.isArray(j.others)) T.fail(`${tag}: no others`);
            } else if (!nonEmpty(j.what)) T.fail(`${tag}: what ${JSON.stringify(j.what)}`);
          } catch (e) { T.fail(`${tag}: ${e && e.stack || e}`); }
        }
      }
    }
  }

  env.selfTest('type-text', (T) => {
    checkFields(T);
    checkEpisodes(T);
    checkRoutes(T);
    checkJudges(T);
  });
})();
