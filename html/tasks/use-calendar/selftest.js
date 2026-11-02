/* use-calendar/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-calendar', (T) => {
    const { def } = T;
    for(const [mode,v] of [['ambiguous','move'],['ambiguous','resize'],['ambiguous','month'],['impossible','freeslot']]) for(const seed of [37,38,39]) {
      const s=def.sample(new env.Rng(seed),{scenario:v,level:'normal',startMode:'off',judge:mode}), j=s.judge, tag=`${mode}/${v}/${seed}`;
      if(!j) { T.fail(`${tag}: no judge`); continue; }
      if(mode==='ambiguous') {
        const text=def.instruction(s,new env.Rng(5)).toLowerCase();
        T.check(text.includes(s.title.toLowerCase()), `${tag}: instruction lacks the shared title`);
        T.check(j.cands&&j.cands.length>=2&&j.cands.every(c=>c.length&&c.every(x=>typeof x==='string'&&x)), `${tag}: cands`);
      } else T.check(j.what&&j.what.length, `${tag}: no what`);
    }
    T.sweep({ seeds: [37], sample: false }, ({scenario:v,seed}) => {
      for(const level of ['easy','medium','normal']) for(const startMode of ['off','partial','wrong','solved']) {
        const s=def.sample(new env.Rng(seed),{scenario:v,level,startMode,ood:true});
        const m=def.init(s), solved=def.solve(s,m);
        T.check(Number.isFinite(def.error(m,s)) && def.error(solved,s)===0, `${v}/${level}/${startMode}: invalid score`);
        if(startMode!=='solved'&&def.error(m,s)<=0) T.fail(`${v}/${startMode}: initially solved`);
        const r=def.retarget(s,solved,new env.Rng(4));
        if(r && def.error(solved,r)<=0) T.fail(`${v}: already retargeted`);
        const corrupt=def.silent(solved,m,s,new env.Rng(3));
        if(corrupt && def.error(corrupt,s)<=0) T.fail(`${v}: silent did not corrupt`);
      }
    });
  });
})();
