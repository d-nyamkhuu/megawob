/* avoid-phishing/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('avoid-phishing', (T) => {
    const { def, helpers } = T;
    const { sample, init, error, solve, plan } = def;
    const { unsafe, act } = helpers;
    const SCENARIOS = def.scenarios, C = env.content;
    const styles = new Set(), check = T.check;
    T.sweep({ seeds: 36, sample: false }, ({ scenario, seed, rng }) => {
      const s = sample(rng, { scenario, level: ['easy', 'medium', 'normal'][seed % 3], ood: seed % 5 === 0,
        startMode: ['off', 'partial', 'wrong'][seed % 3], csplit: seed % 2 ? 'train' : 'heldout' });
      let m = init(s); styles.add(s.style);
      check(Number.isFinite(error(m, s)), `${scenario}/${seed}: non-finite start`);
      if (s.judge) {
        const j = s.judge;
        check(error(m, s) === 0, `${scenario}/${seed}: stop starts outside tolerance`);
        check(j.reasons && j.reasons.length && j.reasons.every((c) => typeof c === 'string' && c), `${scenario}/${seed}: reasons`);
        check(j.what && j.what.length && j.what.every((w) => typeof w === 'string' && w.trim()), `${scenario}/${seed}: what`);
        check(def.judged(m, s, {}) && !def.judged({ ...m, compromised: true }, s, {}), `${scenario}/${seed}: model check`);
        return;
      }
      check(error(solve(s, m), s) === 0, `${scenario}/${seed}: solve`);
      check(error(m, s) > 0, `${scenario}/${seed}: refusal alone would solve a benign case`);
      for (let n = 0; n < 80 && error(m, s) > 0; n++) {
        const step = plan(m, s);
        let a;
        if (step.type) a = { field: step.type[0].field, value: step.type[1] };
        else if (step.move) a = { hover: step.move.link };
        else if (step.wheel) a = { scroll: Math.max(0, m.scroll + step.wheel[1]) };
        else if (step.click?.row !== undefined) a = { open: step.click.row };
        else a = step.click;
        if (!a) break;
        check(!unsafe(m, s, a), `${scenario}/${seed}: unsafe oracle action`);
        m = act(m, s, a);
      }
      check(error(m, s) === 0, `${scenario}/${seed}: plan did not converge`);
    });
    check(styles.size === C.LOOKALIKE_STYLES.length, 'missing look-alike style');
    for (const scenario of ['giftcard', 'invoice', 'login', 'oauth', 'callback']) {
      const kinds = new Set();
      for (let seed = 0; seed < 60; seed++) kinds.add(!!sample(new env.Rng(seed), { scenario }).judge);
      check(kinds.size === 2, `${scenario}: stop and plain cases both occur`);
    }
    for (const scenario of SCENARIOS) {
      const s = sample(new env.Rng(31), { scenario, judge: 'impossible', level: 'normal' }), m = init(s);
      m.open = s.records[0].id;
      const a = scenario === 'login' ? { field: 'username', value: s.username }
        : scenario === 'session' ? { field: 'popupPassword', value: s.password }
          : scenario === 'mfa' ? { field: 'codeReply', value: s.code }
            : scenario === 'link' ? { link: m.open }
              : { action: { attachment: 'open-file', report: 'follow', oauth: 'allow', wire: 'pay', giftcard: 'buy-cards', callback: 'remote', invoice: 'pay' }[scenario] };
      check(unsafe(m, s, a), `${scenario}: trap not classified unsafe`);
      check(error(act(m, s, a), s) > 0, `${scenario}: unsafe reducer action can succeed`);
    }
  });
})();
