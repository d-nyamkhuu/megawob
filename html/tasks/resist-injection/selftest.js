/* resist-injection/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('resist-injection', (T) => {
    const { def } = T;
    const { sample, init, error, solve, plan } = def;
    const { act, unsafe } = T.helpers;
    const { follow, SUBTLE } = T.lib;
    const C = env.content, check = T.check;
    const registers = new Set(), cases = new Set(), places = new Set();
    T.sweep({ seeds: 240, sample: false }, ({ scenario, seed }) => {
      const s = sample(new env.Rng(seed), { scenario, level: ['easy', 'medium', 'normal'][seed % 3], ood: seed % 5 === 0 });
      cases.add(s.caseKind);
      if (s.judge || s.caseKind === 'directed') check(follow(s).includes(s.sourceTitle), `${scenario}/${seed}: goal does not name the source`);
      check((s.caseKind === 'directed') === (s.register === 'directions'), `${scenario}/${seed}: directions register`);
      if (s.planted) { registers.add(s.register); places.add(s.place); }
      check(!s.planted || !/\{\w+\}/.test(s.planted), `${scenario}/${seed}: unfilled slot`);
      check(s.trap.kind !== 'options' || s.trap.value === null || s.trap.options.includes(s.trap.value), `${scenario}/${seed}: option`);
      let m = init(s);
      check(error(solve(s, m), s) === 0, `${scenario}/${seed}: solve`);
      const hot = { ...m, dialog: true, trapValue: s.trap.value ?? m.trapValue };
      check(unsafe(hot, s, s.scenario === 'form' ? { action: 'save' } : { action: 'confirm-trap' }) === !s.authorized, `${scenario}/${seed}: trap`);
      check(!unsafe({ ...m, dialog: true }, s, { action: 'cancel-trap' }), `${scenario}/${seed}: cancel`);
      if (s.trap.value !== null && s.scenario !== 'form') check(!unsafe({ ...m, dialog: true, trapValue: s.trap.initial }, s, { action: 'confirm-trap' }) || s.trap.initial === s.trap.value, `${scenario}/${seed}: default unsafe`);
      if (s.judge) {
        const j = s.judge;
        check(j.reasons && j.reasons.length && j.reasons.every((c) => typeof c === 'string' && c), `${scenario}/${seed}: reasons`);
        check(j.what && j.what.length && j.what.every((w) => typeof w === 'string' && w.trim()), `${scenario}/${seed}: what`);
        check(def.judged(m, s, {}) && !def.judged({ ...m, compromised: true }, s, {}), `${scenario}/${seed}: model check`);
        return;
      }
      for (let n = 0; n < 14 && error(m, s) > 0; n++) {
        const p = plan(m, s), a = p.type ? { field: p.type[0].field, value: p.type[1] } : p.move ? { hover: true } : p.click;
        check(!unsafe(m, s, a), `${scenario}/${seed}: unsafe plan`); m = act(m, s, a);
      }
      check(error(m, s) === 0, `${scenario}/${seed}: convergence`);
    });
    check(registers.size === C.INJECTION_REGISTERS.length + Object.keys(SUBTLE).length + 1, `missing register (${[...registers]})`);
    check(places.size === 3, 'missing placement');
    check(cases.size === 4, 'missing case');
  });
})();
