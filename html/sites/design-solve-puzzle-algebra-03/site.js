(function(){
  'use strict';
  const C={site:'design-solve-puzzle-algebra-03'};
  env.site({
    name:C.site,
    styles:['site.css'],
    frame(ctx){
      document.body.className='neo instruction-'+ctx.display;
      const u=ctx.util,app=u.el('main','app',document.body),top=u.el('header','top',app);
      u.el('div','brand',top,'Algebra Practice');
      u.el('div','counter',top,'Problem 1 of 5');
      const mode=ctx.display;
      const center=u.el('div','center '+(mode==='panel'?'panel-mode':'')+(mode==='toast'?' toast-mode':''),app);
      if(mode!=='hidden')u.el('div','brief '+(mode==='panel'?'panel-note':mode==='toast'?'toast-note':''),center,ctx.instruction);
      const stage=u.el('section','stage',center),footer=u.el('footer','bottom',app),tools=u.el('section','tool-dock',footer);
      u.el('div','dock-title',tools,'Math Tools');
      const keys=u.el('div','tool-keys',tools);
      ['(',')','+','−','×','÷','x','y','²','√','| |'].forEach(k=>u.el('button','tool-key',keys,k));
      const actions=u.el('div','dock-actions',footer);
      u.el('button','tool-action',actions,'Clear');
      u.el('button','tool-action backspace',actions,'← Backspace');
      let submit=null;
      if(!ctx.finish){
        const r=ctx.rng.fork('chrome/end');
        const labels=ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
        const value=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
        const pool=labels.map(value),alternate=pool.filter(x=>x.trim().toLowerCase()!=='submit');
        const primary=r.bool(.5),placement=primary?'form':r.pick(['header','dock']);
        const label=primary?(pool.find(x=>x.trim().toLowerCase()==='submit')||'Submit'):(alternate.length?r.pick(alternate):'Done');
        document.body.classList.add('end-'+placement);
        submit=u.el('button','submit '+(placement==='header'?'end-header':placement==='dock'?'end-dock':''),footer,label);
        submit.type='button';
        submit.addEventListener('click',ctx.submit);
      }
      const cr=ctx.rng.fork('chrome/collide');
      if(cr.bool(.3)){
        const labels=ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
        const value=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
        const own=submit?submit.textContent.trim().toLowerCase():'';
        const candidates=[...new Set(labels.map(value))].filter(x=>x.trim().toLowerCase()!==own);
        if(candidates.length){
          const d=u.el('button','pq-xtra',top,cr.pick(candidates));
          d.type='button';
          d.addEventListener('click',()=>env.log('decoy',{label:d.textContent,collide:true}));
        }
      }
      return {stage,submit};
    },
    overlay(ctx){
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);
      return {el,dismiss};
    }
  });
})();
