/* TaskLab: 2016 Swiss editorial strip: oversized section number, vermilion rules, one broad slider band. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Notice',promo:'Support TaskLab',banner:'Service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      u.el('p','survey-intro',el,{chat:'Quick survey: how easy was this exercise?',cookie:'TaskLab can remember your display preferences.',toast:'Your progress was saved.',promo:'Discover more TaskLab exercises.',banner:'Exercises are available offline.'}[ctx.kind]);
      const dismiss=u.el('button','primary survey-close',el,ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  const fallbackEnds=['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
  const labelOf=x=>(typeof x==='string'?x:x&&(x.label||x.text||x.name))||String(x);
  env.site({name:'design-set-slider-range-10',styles:['site.css'],scripts:[],
    frame(ctx) {
      const u=ctx.util;
      document.body.className=`swiss instruction-${ctx.display}`;
      const endRng=ctx.rng.fork('chrome/end');
      const endChoices=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:fallbackEnds;
      const defaultEnd=endRng.bool(.5);
      const otherEnds=endChoices.filter(x=>labelOf(x).trim().toLowerCase()!=='submit');
      const endLabel=defaultEnd?'Submit':labelOf(endRng.pick(otherEnds.length?otherEnds:endChoices));
      const placement=ctx.finish?null:(defaultEnd?'footer':endRng.pick(['footer','header','link','icon']));
      let submit=null;
      const collideRng=ctx.rng.fork('chrome/collide');
      let collide=null;
      if(!ctx.finish&&collideRng.bool(.3)){
        const choices=[...new Set(endChoices.map(labelOf).filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase()))];
        if(choices.length)collide=labelOf(collideRng.pick(choices));
      }
      const head=u.el('header','sw-header',document.body);
      const brand=u.el('div','sw-brand',head);u.el('h1','',brand,'TaskLab');u.el('i','',brand);
      const nav=u.el('nav','sw-nav',head);
      for(const [t,on] of [['Tasks',1],['Help',0],['Account',0]]){const a=u.el('span',on?'on':'',nav,t);}
      const prog=u.el('div','sw-progress',head);u.el('span','',prog,'Exercise 3 of 8');
      const bar=u.el('div','bar',prog);u.el('b','',bar);
      const headTools=u.el('div','sw-head-tools',head);
      const endButton=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.onclick=()=>ctx.submit();return b;};
      const decoy=(parent,text)=>{const b=u.el('button','sw-xtra',parent,text);b.type='button';b.dataset.role='xtra';b.onclick=()=>env.log('decoy',{label:text,collide:true});return b;};
      if(placement==='header')submit=endButton(headTools,'sw-header-submit',endLabel);
      if(collide)decoy(headTools,collide);
      const intro=u.el('section','sw-intro',document.body);
      u.el('div','sw-num',intro,'03');
      const copy=u.el('div','sw-copy',intro);
      u.el('div','sw-kicker',copy,'ADJUST VALUES');
      const instruction=u.el('div','instruction',copy,ctx.instruction);
      if(ctx.display==='hidden')instruction.hidden=true;
      if(ctx.display==='toast'){
        const close=u.el('button','instruction-close',instruction,'Close');
        close.onclick=()=>{instruction.hidden=true;};
      }
      const stage=u.el('main','sw-stage',document.body);stage.dataset.role='stage';
      const footer=u.el('footer','sw-footer',document.body);
      const reset=u.el('button','reset',footer,'Reset');reset.type='button';reset.dataset.action='reset';
      const right=u.el('div','sw-right',footer);
      const show=u.el('button','ghost',right,'Show target values');show.type='button';show.setAttribute('aria-disabled','true');
      if(placement==='footer')submit=endButton(right,'primary',endLabel);
      if(placement==='link')submit=endButton(right,'sw-end-link',`${endLabel} ›`);
      if(placement==='icon'){submit=endButton(right,'sw-end-icon','✓');submit.setAttribute('aria-label',endLabel);submit.title=endLabel;}
      return {stage,submit};
    },
    overlay: drawOverlay,
  });
})();
