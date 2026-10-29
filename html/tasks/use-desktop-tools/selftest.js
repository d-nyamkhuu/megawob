/* use-desktop-tools/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-desktop-tools', (T) => {
    const fam = T.def;
    const V = env.scenariosOf('use-desktop-tools');
    const { JUDGE_SCENARIOS } = T.lib;
    const { nonEmpty } = env.util;
    const { init: initOf, error: errorOf, plan: planOf, solve: solveOf, facts: factsOf,
      silent: silentOf, retarget: retargetOf, tick } = fam;
    const instructionOf = (spec, rng) => V[spec.scenario].instruction(spec, rng);

    // Model-space effect of one plan step as the base widget implements it, plus stepMs of ticks.
    function simulate(model, spec, step, now) {
      const t = step.click || step.dblclick || step.rightclick || step.down || step.up || step.move;
      let m = V[spec.scenario].simulate(model, spec, step, now, t);
      for (let k = 1; k <= spec.stepMs / 50; k++) m = tick(m, spec, 50, now + 50 * k);
      return m;
    }

    const fails = T.fails;
    let silents = 0;
    let retargets = 0;
    const TRAITS = { meta: true, selectors: true, dayRange: [8, 18], startHour: 8,
      tools: ['bold', 'italic', 'underline', 'color', 'size', 'bullet', 'number'] };
    const KNOBS = [
      { startMode: 'off' }, { startMode: 'partial' }, { startMode: 'wrong' }, { startMode: 'wrong', recover: true },
      { startMode: 'off', ood: true, isplit: 'heldout', csplit: 'heldout' },
      { startMode: 'scene' }, { startMode: 'scene', ood: true },
      { startMode: 'off', traits: TRAITS }, { startMode: 'partial', traits: TRAITS }, { startMode: 'wrong', traits: TRAITS },
      { startMode: 'scene', traits: TRAITS }, { startMode: 'off', ood: true, traits: TRAITS },
      { startMode: 'off', traits: { selectors: 'only', startHour: 8 } }, { startMode: 'scene', traits: { selectors: 'only' } },
      { startMode: 'off', judge: 'confirm' }, { startMode: 'wrong', judge: 'confirm' }, { startMode: 'off', judge: 'confirm', ood: true },
    ];
    for (const scenario of fam.scenarios) {
      for (let seed = 0; seed < 96; seed++) {
        const knobs = KNOBS[seed % KNOBS.length];
        const rng = new env.Rng(seed * 7919 + 101);
        const tag = `${scenario} seed ${seed} ${knobs.startMode}${knobs.ood ? ' ood' : ''}${knobs.traits ? ' traits' : ''}`;
        let spec;
        let m;
        try {
          spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, traits: {}, stepMs: 1000, recover: null, ...knobs });
          m = initOf(spec, rng.fork('i'));
        } catch (e) {
          T.fail(`${tag}: ${e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e}`);
          continue;
        }
        const e0 = errorOf(m, spec);
        if (knobs.startMode === 'off' ? !(e0 > 0.25) : !(e0 > 0)) {
          if (knobs.startMode === 'off') T.fail(`${tag}: start error ${e0}`);
          continue;
        }
        const text = instructionOf(spec, rng.fork('n'));
        T.check(text, `${tag}: empty instruction`);
        if (/submit/i.test(text)) T.fail(`${tag}: instruction names the end control: ${text}`);
        if (fam.ended(m, spec)) T.fail(`${tag}: start state already ended`);
        const m0 = m;
        let k = 0;
        let now = 0;
        let silentTried = seed % 2 !== 0;
        try {
          for (; k < 46 && errorOf(m, spec) > 0; k++) {
            const step = planOf(m, spec);
            if (!step) break;
            const before = errorOf(m, spec);
            const prevM = m;
            m = simulate(m, spec, step, now);
            now += spec.stepMs;
            if (fam.ended(m, spec)) throw new Error(`plan ended the episode (${fam.ended(m, spec)}) at ${JSON.stringify(step)}`);
            if (knobs.startMode === 'off' && scenario !== 'calendar' && errorOf(m, spec) > before + 1e-9) {
              throw new Error(`plan step raised the error ${before} -> ${errorOf(m, spec)}: ${JSON.stringify(step)}`);
            }
            if (!silentTried && errorOf(m, spec) < before - 1e-9) {
              const sm = silentOf(m, prevM, spec, rng.fork(`silent${k}`));
              if (sm) {
                silentTried = true;
                silents++;
                if (!(errorOf(sm, spec) > 0)) throw new Error('silent: error not above tau');
                if (JSON.stringify(Object.keys(sm).sort()) !== JSON.stringify(Object.keys(m).sort())) throw new Error('silent: model shape changed');
                if (fam.ended(sm, spec)) throw new Error('silent: episode ended');
                m = sm;
              }
            }
          }
        } catch (e) {
          T.fail(`${tag}: ${e}`);
        }
        // A move plan may end holding nothing; the last up step drops the file.
        if (errorOf(m, spec) !== 0) T.fail(`${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
        if (k > 40) T.fail(`${tag}: plan took ${k} steps`);
        const solved = solveOf(spec, initOf(spec, rng.fork('i')));
        if (errorOf(solved, spec) !== 0) T.fail(`${tag}: solve() not on target (${errorOf(solved, spec)})`);
        // facts of the solved model; retarget from the start state.
        if (!spec.judge) {
          const fs = factsOf(solved, spec);
          if (fs.length < 2 || fs.length > 4 || fs.some((f) => !f.label || typeof f.value !== 'string' || !f.value || /undefined|NaN/.test(f.label + f.value))) T.fail(`${tag}: facts ${JSON.stringify(fs)}`);
          const ns = retargetOf(spec, m0, rng.fork('retarget'));
          if (ns) {
            retargets++;
            const t2 = instructionOf(ns, rng.fork('rt-i'));
            if (!t2 || /\{|\}|undefined|null/.test(t2) || /submit/i.test(t2)) T.fail(`${tag}: retarget instruction ${t2}`);
            if (!(errorOf(m0, ns) > 0)) T.fail(`${tag}: retarget already satisfied`);
            let r = m0;
            let j = 0;
            let tn = 0;
            try {
              for (; j < 46 && errorOf(r, ns) > 0; j++) {
                const step = planOf(r, ns);
                if (!step) break;
                r = simulate(r, ns, step, tn);
                tn += ns.stepMs;
                if (fam.ended(r, ns)) throw new Error(`ended (${fam.ended(r, ns)})`);
              }
            } catch (e) {
              T.fail(`${tag}: retarget plan ${e}`);
            }
            if (errorOf(r, ns) !== 0) T.fail(`${tag}: retarget plan ends at error ${errorOf(r, ns)}`);
          }
        }
        if (fails.length > 15) return;
      }
    }
    T.check(silents, 'silent: never applied');
    T.check(retargets, 'retarget: never applied');
    // Spot checks.
    for (const scenario of fam.scenarios) if (V[scenario].check) for (const failure of V[scenario].check()) T.fail(failure);
    // Judge data (structural: the reply is graded from spec.judge, never from the message text).
    for (const scenario of JUDGE_SCENARIOS.ambiguous) {
      for (const jm of ['ambiguous', 'impossible']) {
        for (let seed = 0; seed < 8; seed++) {
          const tag = `judge ${jm} ${scenario} seed ${seed}`;
          try {
            const sp = fam.sample(new env.Rng(seed * 104729 + 11), { scenario, scenarios: fam.scenarios, startMode: 'off', csplit: 'train', isplit: 'train', judge: jm });
            const j = sp.judge;
            if (!j || sp.scenario !== scenario) continue;
            const text = fam.instruction(sp, new env.Rng(seed));
            if (!text || /\{|\}|undefined/.test(text)) T.fail(`${tag}: instruction ${text}`);
            if (jm === 'ambiguous') {
              if (!Array.isArray(j.cands) || j.cands.length < 2 || !j.cands.every(nonEmpty)) T.fail(`${tag}: cands ${JSON.stringify(j.cands)}`);
              if (j.others !== undefined && !(Array.isArray(j.others) && j.others.every(nonEmpty))) T.fail(`${tag}: others ${JSON.stringify(j.others)}`);
            } else if (!nonEmpty(j.what)) T.fail(`${tag}: what ${JSON.stringify(j.what)}`);
          } catch (e) {
            T.fail(`${tag}: ${e}`);
          }
        }
      }
    }
    return;
  });
})();
