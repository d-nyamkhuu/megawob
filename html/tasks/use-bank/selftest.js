/* use-bank/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  env.selfTest('use-bank', (T) => {
    const { def, helpers, lib, check } = T;
    const { scenarios, sample, init, solve, error, plan, facts, retarget, silent, instruction } = def;
    const { apply, cents } = helpers;
    const { validation, validDate } = lib;
    const { clone } = env.util;
    for (const scenario of scenarios) for (const level of ['easy','medium','normal']) T.sweep({
      scenarios:[scenario], seeds:8, rng:seed=>new env.Rng(seed+97), sample:false,
    }, ({seed,rng:r}) => {
      const s=sample(r,{scenario,level,ood:!!(seed%2),startMode:'off'}), m=init(s), done=solve(s,m), tag=`${scenario}/${level}/${seed}`;
      check(error(m,s)>0,tag+' unsolved start');check(error(done,s)===0,tag+' solve');
      for (const startMode of ['off','partial','wrong']) {
        const spec={...s,startMode}; let cur=init(spec);
        for(let step=0;step<60 && error(cur,s)>0;step++) {
          const p=plan(cur,s);
          if(p.type) cur=apply(cur,s,p.type[0].search?{search:p.type[1]}:{set:[p.type[0].field,p.type[1]]});
          else if(p.click?.field) cur=apply(cur,s,p.click.field==='transaction'?{set:['transaction','']}:{open:p.click.field});
          else if(p.click?.option) cur=apply(cur,s,{set:[cur.open,p.click.option]});
          else if(p.click?.transaction) cur=apply(cur,s,{transaction:p.click.transaction});
          else if(p.click?.nav) cur=apply(cur,s,{nav:p.click.nav});
          else break;
        }
        check(error(cur,s)===0,tag+' closed loop '+startMode);
      }
      check(Object.keys(validation(done,s)).length===0,tag+' valid solution');
      check(facts(done,s).length>=2 && facts(done,s).every(f=>typeof f.value==='string'),tag+' facts');
      const switched=retarget(s,done,r);check(switched && error(done,switched)>0,tag+' retarget');
      if(switched) check(JSON.stringify(switched.transactions)===JSON.stringify(s.transactions),tag+' same scene');
      for(const f of s.fields) {
        const prev=clone(done);prev.values[f.id]=f.kind==='amount'?'0.00':f.id==='frozen'?'Active':f.options?.find(v=>v!==s.target[f.id])||'';
        const before=JSON.stringify([done,prev]); const broken=silent(done,prev,s,r);
        check(before===JSON.stringify([done,prev]),tag+' silent immutable');
        if(broken) {check(error(broken,s)>0,tag+' silent off target');check(error(apply(broken,s,{set:[f.id,s.target[f.id]]}),s)<=1/(s.fields.length+1),tag+' silent repair');}
      }
    });
    for (const mode of ['ambiguous','impossible']) for (let seed=0;seed<8;seed++) {
      const r=new env.Rng(seed+311), s=sample(r,{scenario:scenarios[seed%5],level:'normal',startMode:'off',judge:mode}), j=s.judge, tag=`${mode}/${seed}`;
      const text=instruction(s,new env.Rng(seed)).toLowerCase();
      if (mode==='ambiguous') {
        check(text.includes(s.payees[0].name.toLowerCase()),tag+' instruction names the shared biller');
        check(j.cands.length>=2 && j.cands.every(c=>c.length && c.every(x=>typeof x==='string' && x)),tag+' cands');
      } else check(j.what && j.what.length && j.what.every(x=>typeof x==='string' && x),tag+' what');
    }
    for(const bad of ['12','12.3','01.00','1,000.00','$12.00','1e2','-1.00',' 12.00','12.000']) check(cents(bad)===null,'strict amount '+bad);
    check(cents('1000.25')===100025,'valid cents');check(!validDate('2027-02-29')&&validDate('2028-02-29'),'calendar dates');
  });
})();
