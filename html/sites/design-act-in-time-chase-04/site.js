(function(){
  'use strict';
  const C={site:'design-act-in-time-chase-04',brand:'Pointer Challenge',instruction:'top'};
  env.site({
    name:C.site,
    styles:['site.css'],
    scripts:[],
    frame(ctx){
      if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
      const selection=window.getSelection();if(selection)selection.removeAllRanges();
      const u=ctx.util;
      const top=u.el('header','ds-top',document.body);
      u.el('span','ds-brand',top,C.brand);
      const tabs=u.el('nav','ds-tabs',top);
      ['Task','Results','Help'].forEach((t,i)=>u.el('span',i===0?'active':'',tabs,t));
      u.el('span','ds-product',top,'Mouse Skills Test');
      const body=u.el('div','ds-body',document.body);
      const rail=u.el('aside','ds-rail',body);
      ['1.  Task','2.  Tips','3.  FAQ','4.  Rules','5.  About'].forEach((t,i)=>u.el('div',i===0?'active':'',rail,t));
      const content=u.el('div','ds-content',body);
      const mode=ctx.display==='hidden'?'hidden':ctx.display==='toast'?'toast':ctx.display==='panel'?'left':C.instruction;
      content.dataset.instruction=mode;
      function briefing(parent,cls){const b=u.el('aside',cls,parent);u.el('div','ds-instruction',b,ctx.instruction);return b;}
      if(mode==='top')briefing(content,'ds-brief');
      const main=u.el('div','ds-main',content);
      if(mode==='left'||mode==='right')briefing(main,'ds-brief');
      const stage=u.el('main','ds-stage',main);
      if(mode==='toast'){const note=briefing(content,'ds-toast');content.insertBefore(note,main);}
      const endRng=ctx.rng.fork('chrome/end');
      const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
      const endLabels=ctx.content.END_LABELS.map(labelOf);
      const referenceEnd=endRng.bool(0.5);
      const placement=referenceEnd?'sheet':endRng.pick(['toolbar','link']);
      const label=referenceEnd?'Submit':endRng.pick(endLabels);
      let submit=null;
      if(!ctx.finish){
        submit=u.el('button','ds-submit ds-end-'+placement,placement==='toolbar'?top:content,label);
        submit.type='button';submit.dataset.role='submit';submit.title=label;submit.setAttribute('aria-label',label);
        submit.addEventListener('click',()=>ctx.submit());
        if(placement==='toolbar')top.querySelector('.ds-product').hidden=true;
      }
      const collideRng=ctx.rng.fork('chrome/collide');
      if(collideRng.bool(0.3)){
        const alternatives=endLabels.filter(word=>word.trim().toLowerCase()!==label.trim().toLowerCase());
        if(alternatives.length){
          const decoyLabel=collideRng.pick(alternatives);
          const decoy=u.el('button','ds-xtra'+(!ctx.finish&&placement==='link'?' ds-xtra-right':''),content,decoyLabel);
          decoy.type='button';decoy.dataset.role='xtra';
          decoy.addEventListener('click',()=>env.log('decoy',{label:decoyLabel,collide:true}));
        }
      }
      return{stage,submit};
    },
    overlay(ctx){
      const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');dismiss.addEventListener('click',()=>ctx.dismiss('close'));
      return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  });
})();
