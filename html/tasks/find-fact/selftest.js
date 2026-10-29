/* find-fact/selftest.js: sampling, grading and oracle checks; loaded only by the self-test harness. */
(function () {
  'use strict';
  env.selfTest('find-fact', (T) => {
    const { def: fam, lib, fails } = T;
    const { simulate, SYNONYMS, FORMATS, ORD, FIND_NAMES, FIND_HEADS, FIND_TITLES, normWord, shown,
      truthOf, matchesOf, VSCROLL_VIEW, parseNum, findIn } = lib;
    const levenshtein = env.util.lev;
    const { init: initModel, error: errorOf, instruction: instructionOf, silent: silentOf,
      solve: solveOf, facts: factsOf, retarget: retargetOf } = fam;
    const planOf = lib.planOf;
    const checks = {
      'join'(spec, tag) {
        const L = spec.left.rows[spec.via[0]];
        const R = spec.right.rows[spec.via[1]];
        T.check(L[spec.link[0]] === R[spec.link[1]], `${tag}: join rows do not link`);
      },
      'similar'(spec, tag) {
        const shownW = new Set(spec.words.map((w) => w.text));
        T.check(!(spec.given.some((g) => shownW.has(g))), `${tag}: a given word is on the page`);
        T.check((spec.targets.length) && (spec.targets.length < spec.words.length), `${tag}: bad target count`);
      },
      'count'(spec, tag) {
        const n = Number(spec.answer);
        T.check((n >= 3) && (truthOf(spec).length === n), `${tag}: count ${spec.answer}`);
        T.check((!(spec.collapsed)) || (truthOf(spec).some((mt) => spec.sections[mt.s].fold)), `${tag}: no occurrence in a folded section`);
        T.check((spec.match.case) || (matchesOf(spec, spec.term, false, spec.match.whole, [], true).length === n), `${tag}: case variants without a case rule`);
        T.check((spec.match.whole) || (matchesOf(spec, spec.term, spec.match.case, false, [], true).length === n), `${tag}: longer words without a whole-word rule`);
      },
      'find-word'(spec, tag) {
        const ws = spec.paragraphs.join(' ').split(/\s+/).map(normWord);
        T.check(ws[spec.at] === normWord(spec.answer), `${tag}: answer is not word ${spec.at}`);
      },
      'locate'(spec, tag) {
        // One exact occurrence; without the instruction's rules the plain search finds it and the decoys only.
        T.check(spec.hit, `${tag}: the term does not occur exactly once`);
        const plain = matchesOf(spec, spec.term, false, false, [], true).length;
        const decoys = spec.facts.filter((f) => f.decoy).length;
        T.check(plain === 1 + decoys, `${tag}: plain search finds ${plain}, want ${1 + decoys}`);
        T.check((!(spec.facts.filter((f) => f.decoy === 'case').length)) || (spec.match.case), `${tag}: case decoy without a case rule`);
        T.check(new Set(spec.facts.map((f) => f.value)).size === spec.facts.length, `${tag}: entry values repeat`);
      },
      'phone-book'(spec, tag) {
        if (spec.mode === 'search' && !shown({ query: spec.contacts[spec.target].name }, spec).includes(spec.target)) {
          fails.push(`${tag}: searching the full name does not show the target`);
        }
        T.check((!(spec.forcedRoute)) || (spec.mode === spec.forcedRoute === 'pointer' ? 'pages' : 'search'), `${tag}: phone-book route not honoured`);
      },
    };
    const modes = ['off', 'partial', 'wrong'];
    T.sweep({ seeds: 60, rng: (seed) => new env.Rng(seed * 7919 + 17), sample: false }, ({ scenario, seed, rng, tag }) => {
      const startMode = modes[seed % 3];
      let spec;
      let model;
      try {
        // Every third seed: the opt-in traits (dense / cards widgets) and an opts.route value.
        const traits = seed % 3 === 1 ? { vscroll: [true], gridModes: seed % 2 ? ['hscroll'] : ['sort', 'filter', 'pages'] } : {};
        const route = seed % 3 === 1 ? [undefined, 'pointer', 'keyboard', 'wheel'][(seed >> 1) % 4] : undefined;
        spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, traits, route, startMode, ood: seed % 5 === 4, csplit: seed % 7 === 3 ? 'heldout' : 'train', isplit: seed % 2 ? 'heldout' : 'train' });
        model = initModel(spec, rng.fork('init'));
      } catch (e) {
        fails.push(`${tag}: ${e.stack || e}`);
        return;
      }
      const e0 = errorOf(model, spec);
      T.check((startMode !== 'off') || (e0 > fam.tolerance(spec).minInitialError), `${tag}: start error ${e0}`);
      T.check(e0 > 0, `${tag} (${startMode}): starts solved`);
      T.check(!(fam.ended(model, spec)), `${tag} (${startMode}): starts ended`);
      const text = instructionOf(spec, rng.fork('i'));
      T.check(text, `${tag}: empty instruction`);
      T.check(!(/submit/i.test(text)), `${tag}: instruction names the end control: ${text}`);
      let m = model;
      let k = 0;
      for (; k < 25 && errorOf(m, spec) > 0; k++) {
        const step = planOf(m, spec);
        if (!step) break;
        const prev = m;
        m = simulate(m, spec, step);
        if (errorOf(m, spec) < errorOf(prev, spec)) {
          const sl = silentOf(m, prev, spec, rng.fork(`sl${k}`));
          T.check((!(sl)) || ((errorOf(sl, spec) > 0) && (Object.keys(sl).join() === Object.keys(m).join())), `${tag}: bad silent`);
        }
        if (fam.ended(m, spec)) break;
      }
      T.check(errorOf(m, spec) === 0, `${tag} (${startMode}): plan ends at error ${errorOf(m, spec)} after ${k} steps`);
      T.check(k <= 12, `${tag}: plan took ${k} steps`);
      T.check(errorOf(solveOf(spec, model), spec) === 0, `${tag}: solve() not on target`);
      const check = checks[scenario];
      if (check) check(spec, tag);
      T.check((!(spec.vscroll)) || ((spec.target > VSCROLL_VIEW) && (spec.rows.length > VSCROLL_VIEW + 1)), `${tag}: vscroll target not below the fold`);
      T.check((spec.forcedRoute !== 'pointer') || (!(fam.inputs(spec).includes('wheel'))), `${tag}: pointer route allows the wheel`);
      T.check((spec.forcedRoute !== 'wheel') || (spec.route === 'wheel'), `${tag}: wheel route not honoured`);
      // Round 2 hooks: facts are strings, retarget gives a solvable new goal, judge=impossible starts untouched.
      for (const f of factsOf(solveOf(spec, model), spec)) T.check((f.label) && (typeof f.value === 'string'), `${tag}: bad fact`);
      const rt = retargetOf(spec, model, rng.fork('rt'));
      if (rt) {
        T.check((errorOf(model, rt) > 0) && (Number.isFinite(errorOf(initModel(rt, rng.fork('ri')), rt))), `${tag}: retarget error`);
        const rtext = instructionOf(rt, rng.fork('rti'));
        T.check((rtext) && (!(/undefined|\{\w+\}/.test(rtext))), `${tag}: bad retarget instruction ${JSON.stringify(rtext)}`);
        let r = model;
        for (let j = 0; j < 30 && errorOf(r, rt) > 0; j++) {
          const step = planOf(r, rt);
          if (!step) break;
          r = simulate(r, rt, step);
        }
        T.check(errorOf(r, rt) === 0, `${tag}: retargeted plan ends at ${errorOf(r, rt)}`);
      }
      const js = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, traits: {}, startMode, judge: 'impossible',
        ood: seed % 5 === 4, csplit: seed % 7 === 3 ? 'heldout' : 'train', isplit: seed % 2 ? 'heldout' : 'train' });
      if (!js.judge) fails.push(`${tag}: judge impossible not built`);
      else {
        T.check(errorOf(initModel(js, rng.fork('ji')), js) === 0, `${tag}: judge start not untouched`);
        const jt = instructionOf(js, rng.fork('jt'));
        T.check(((jt) && (!(/undefined|\{\w+\}/.test(jt)))) && ((!(/"\{x\}"/.test(js.judge.templates[0]))) || (jt.includes(js.judge.value))), `${tag}: bad judge instruction ${jt}`);
      }
    });
    // Grading spot checks.
    const all = SYNONYMS.flat();
    T.check(new Set(all).size === all.length, 'synonym groups share a word');
    T.check(levenshtein('kitten', 'sitting') === 3, 'levenshtein kitten/sitting');
    const tb = { scenario: 'table', fields: [{ answer: 'Spain' }, { answer: '$24.99' }] };
    T.check(errorOf({ answers: [' spain ', '$24.99'] }, tb) === 0, 'table: case/space-insensitive match');
    T.check(Math.abs(errorOf({ answers: ['Spain', ''] }, tb) - 0.5) <= 1e-9, 'table: one of two fields');
    const fw = { scenario: 'find-word', answer: 'Garden' };
    T.check(errorOf({ answers: ['garden.'] }, fw) === 0, 'find-word: punctuation/case not ignored');
    const pb = { scenario: 'phone-book', mode: 'pages', perPage: 1, contacts: [{}, {}, {}], target: 2, prop: 'email' };
    T.check(Math.abs(errorOf({ page: 2, query: '', picks: [{ contact: 2, prop: 'phone' }] }, pb) - 0.3) <= 1e-9, 'phone-book: right person, wrong property');
    T.check((errorOf({ page: 2, query: '', picks: [] }, pb) === 0.8) && (errorOf({ page: 0, query: '', picks: [] }, pb) === 1), 'phone-book: navigation credit');
    const sm = { scenario: 'similar', targets: ['a', 'b'] };
    T.check(Math.abs(errorOf({ values: ['a', 'c'] }, sm) - 2 / 3) <= 1e-9, 'similar: jaccard');
    T.check((FORMATS.dmy.apply({ iso: '1987-03-04' }) === '04/03/1987') && (FORMATS.digits.apply({ text: '(415) 555-0132' }) === '4155550132'), 'formats');
    T.check(((parseNum('1,250') === 1250) && (parseNum('$40') === 40)) && (parseNum('abc') === null), 'parseNum');
    const ch = { scenario: 'chart', mode: 'value', answer: '40', step: 10 };
    T.check((errorOf({ answers: ['45'] }, ch) === 0.25) && (errorOf({ answers: ['40'] }, ch) === 0), 'chart: numeric grading');
    T.check((((ORD(1) === '1st') && (ORD(12) === '12th')) && (ORD(22) === '22nd')) && (ORD(13) === '13th'), 'ordinals');
    T.check(!(FIND_NAMES.some((a) => FIND_NAMES.some((b) => a !== b && b.toLowerCase().includes(a.toLowerCase())))), 'a find name contains another');
    T.check(!(FIND_HEADS.concat(FIND_TITLES).some((h) => FIND_NAMES.some((nm) => h.toLowerCase().includes(nm.toLowerCase())))), 'a heading or title holds a find name');
    T.check(((findIn('Harbor harborside Harbors harbor.', 'harbor', false, true).join() === '0,26') && (findIn('Harbor harborside Harbors harbor.', 'Harbor', true, false).join() === '0,18')) && (findIn('KT-24, KT-240 AKT-24 KT-24.', 'KT-24', true, true).join() === '0,21'), 'findIn');
  });
})();
