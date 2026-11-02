/* use-health-records/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-health-records', (T) => {
    const { def, helpers } = T;
    T.sweep({ seeds: [19], sample: false }, ({ scenario, seed }) => {
      for(const level of ['easy','medium','normal']) for(const ood of [false,true]) for(const startMode of def.startModes) {
        const s=def.sample(new env.Rng(seed),{scenario,level,ood,startMode}),m=def.init(s),done=def.solve(s,m);
        const tag=`${scenario}/${level}/${ood}/${startMode}`;
        T.check(Number.isFinite(def.error(m,s))&&def.error(done,s)===0,`${tag}: invalid scoring`);
        T.check(!(startMode!=='solved'&&def.error(m,s)<=0),`${tag}: already solved`);
        T.check(scenario==='beds'||!helpers.valid(done.fields,s),`${tag}: invalid solved record`);
        const before=JSON.stringify([s,m,done]);
        const corrupt=def.silent(done,m,s,new env.Rng(7)),switched=def.retarget(s,done,new env.Rng(8));
        T.check(!(corrupt&&def.error(corrupt,s)<=0),`${tag}: silent stayed solved`);
        T.check(!(!switched||def.error(done,switched)<=0),`${tag}: retarget stayed solved`);
        T.check(before===JSON.stringify([s,m,done]),`${tag}: hook mutation`);
      }
    });
    T.sweep({ seeds: [23], sample: false }, ({ scenario, seed }) => {
      const s=def.sample(new env.Rng(seed),{scenario,judge:'ambiguous'}),j=s.judge;
      const text=def.instruction(s,new env.Rng(5));
      T.check(text&&text.includes(s.patient.name),`ambiguous/${scenario}: instruction ${text}`);
      T.check(j.cands&&j.cands.length>=2&&!j.cands.some(c=>!c.length||c.some(x=>!x)),`ambiguous/${scenario}: cands`);
    });
  });
})();
