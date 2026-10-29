(function(){
  'use strict';
  const C={site:'design-solve-puzzle-generate-09',task:'solve-puzzle',scenario:'generate',style:'plain',title:'Odd Number Practice',menu:'',note:'Feedback',layout:'floating',subtitle:'',aside:'No submission yet.'};
  env.site({name:C.site,styles:['site.css'],frame(ctx){
    document.body.className='swiss-editorial instruction-'+ctx.display;
    const u=ctx.util,app=u.el('main','app',document.body),top=u.el('header','top',app);
    u.el('span','',top,C.title);
    const center=u.el('div','center',app),brief=u.el('div','brief',center);
    u.el('span','zone-number',brief,'01');
    u.el('div','zone-label',brief,'Task');
    u.el('div','brief-copy',brief,ctx.display==='header'?ctx.instruction:'');
    const stage=u.el('section','stage',center);
    const aside=u.el('aside','aside',document.body);
    u.el('span','zone-number',aside,'03');
    u.el('div','zone-label',aside,C.note);
    u.el('p','aside-copy',aside,C.aside);
    if(ctx.display==='panel'||ctx.display==='toast'){
      const note=u.el('div','episode-note '+(ctx.display==='toast'?'episode-toast':'episode-panel'),aside);
      if(ctx.display==='panel')u.el('div','episode-note-title',note,'Task');
      u.el('div','episode-note-copy',note,ctx.instruction);
    }
    const footer=u.el('footer','bottom',app);
    const endRng=ctx.rng.fork('chrome/end'),labelBank=ctx.content&&ctx.content.END_LABELS;
    const labels=Array.isArray(labelBank)&&labelBank.length?labelBank:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
    const labelValue=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
    let label='Submit',placement='task';
    if(!endRng.bool(.5)){
      const alternatives=labels.map(labelValue).filter(x=>x.trim().toLowerCase()!=='submit');
      if(alternatives.length)label=labelValue(endRng.pick(alternatives));
      placement=endRng.pick(['task','header','feedback']);
    }
    let submit=null;
    if(!ctx.finish){
      submit=u.el('button','submit swiss-end swiss-end-'+placement,footer,label);
      submit.type='button';submit.setAttribute('aria-label',label);submit.title=label;
      submit.addEventListener('click',ctx.submit);
    }
    const collideRng=ctx.rng.fork('chrome/collide');
    if(!ctx.finish&&collideRng.bool(.3)){
      const same=x=>labelValue(x).trim().toLowerCase()===label.trim().toLowerCase();
      const choices=labels.map(labelValue).filter(x=>!same(x));
      if(choices.length){
        const decoy=u.el('button','swiss-xtra',aside,collideRng.pick(choices));
        decoy.type='button';decoy.addEventListener('click',()=>env.log('decoy',{label:decoy.textContent,collide:true}));
      }
    }
    return {stage,submit};
  },overlay(ctx){
    const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
    const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
    u.el('span','',el,messages[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
    dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
  }});
})();
