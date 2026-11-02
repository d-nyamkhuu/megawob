/* use-dispatch/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-dispatch', (T) => {
    const { def } = T;
    for(const scenario of def.scenarios) for(const level of ['easy','medium','normal']) for(const startMode of ['off','partial','wrong','solved']) {
      const s=def.sample(new env.Rng(41),{scenario,level,startMode,ood:true});
      const m=def.init(s), solved=def.solve(s,m);
      T.check(Number.isFinite(def.error(m,s))&&def.error(solved,s)===0,`${scenario}/${level}/${startMode}: invalid solution`);
      if(startMode!=='solved') T.check(!(def.error(m,s)<=0),`${scenario}: initially solved`);
      const r=def.retarget(s,solved,new env.Rng(9));
      if(r) T.check(!(def.error(solved,r)<=0||def.error(def.solve(r,m),r)!==0),`${scenario}: invalid retarget`);
      const c=def.silent(solved,m,s,new env.Rng(5));
      if(c) T.check(!(def.error(c,s)<=0),`${scenario}: silent stayed solved`);
      const j=def.sample(new env.Rng(4),{scenario,level,judge:'impossible'});
      T.check(def.error(def.init(j),j)===0,`${scenario}: judge changed scene`);
      T.check(j.judge&&j.judge.what&&j.judge.what.length&&j.judge.what.every(x=>typeof x==='string'&&x),`${scenario}: judge has no what`);
    }
  });
})();
