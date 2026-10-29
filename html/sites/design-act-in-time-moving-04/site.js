(function(){
  'use strict';
  env.site({
    name:'design-act-in-time-moving-04', styles:['site.css'], scripts:[],
    frame(ctx){
      if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
      const selection=window.getSelection(); if(selection)selection.removeAllRanges();
      const u=ctx.util;
      const top=u.el('header','ds-top',document.body);
      u.el('span','ds-brand',top,'Shape Catcher');
      const endRng=ctx.rng.fork('chrome/end');
      const endLabels=ctx.content&&Array.isArray(ctx.content.END_LABELS)?ctx.content.END_LABELS.map(x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x)):['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
      const oldLabel=endLabels.find(x=>String(x).toLowerCase()==='submit')||'Submit';
      const otherLabels=endLabels.filter(x=>String(x).toLowerCase()!==String(oldLabel).toLowerCase());
      const placementRng=ctx.rng.fork('chrome/end-placement');
      const keepDefault=endRng.bool(.5);
      const label=keepDefault||!otherLabels.length?oldLabel:otherLabels[endRng.int(0,otherLabels.length-1)];
      const placement=ctx.finish?null:keepDefault?'footer':placementRng.pick(['header','header','link']);
      let display=ctx.display||'header';
      const W=ctx.size&&(ctx.size.width||ctx.size.w)||window.innerWidth;
      const H=ctx.size&&(ctx.size.height||ctx.size.h)||window.innerHeight;
      if((display==='panel'&&W<1260)||(display==='toast'&&H<700))display='header';
      document.body.classList.toggle('ds-display-header',display==='header');
      document.body.classList.toggle('ds-display-panel',display==='panel');
      document.body.classList.toggle('ds-display-toast',display==='toast');
      document.body.classList.toggle('ds-display-hidden',display==='hidden');
      const controls=u.el('div','ds-window-meta',top);
      ['−','□','×'].forEach(t=>{const b=u.el('button','',controls,t);b.type='button';});
      const content=u.el('div','ds-content',document.body);
      const main=u.el('div','ds-main',content);
      const brief=u.el('aside','ds-brief',main);
      if(display==='panel')u.el('h1','',brief,ctx.instruction);
      u.el('div','ds-guidance',brief,'Click the shapes on the right. Only purple shapes count. They move automatically.');
      u.el('div','ds-time-label',brief,'Time remaining');
      u.el('div','ds-time-value',brief,'00:24');
      u.el('div','ds-time-meter',brief).innerHTML='<i></i>';
      u.el('div','ds-left-label',brief,'Purple shapes left');
      u.el('div','ds-left-value',brief,'5');
      const stage=u.el('main','ds-stage',main);
      const foot=u.el('footer','ds-footer',content);
      const note=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='xtra';b.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));return b;};
      const decoyRng=ctx.rng.fork('chrome/collide');
      let collide=null;
      if(decoyRng.bool(.3)){
        const pool=[...new Set(endLabels.filter(x=>String(x).trim().toLowerCase()!==String(label).trim().toLowerCase()))];
        if(pool.length)collide=pool[decoyRng.int(0,pool.length-1)];
      }
      const endButton=(parent,cls,txt)=>{const b=u.el('button',cls,parent,txt);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.addEventListener('click',()=>ctx.submit());return b;};
      if(display==='header')u.el('div','ds-header-note',top,ctx.instruction);
      if(display==='toast'){const toast=u.el('div','ds-note',top);u.el('span','',toast,ctx.instruction);const x=u.el('button','ds-note-close',toast,'×');x.type='button';x.setAttribute('aria-label','Close');x.addEventListener('click',()=>{toast.remove();env.log('note-close');});}
      if(collide&&placement!=='footer')note(top,'ds-xtra',collide);
      const pause=u.el('button','ds-tool ds-pause',foot,'Pause'); pause.type='button';
      const speed=u.el('div','ds-tool-group ds-speed',foot);
      u.el('span','',speed,'Speed'); u.el('i','ds-slider',speed).innerHTML='<b></b>'; u.el('span','',speed,'Medium');
      const size=u.el('div','ds-tool-group ds-size',foot);
      u.el('span','',size,'Board size');
      ['▦','▦','▦'].forEach((t,i)=>{const b=u.el('button','ds-size-button'+(i===1?' active':''),size,t);b.type='button';});
      const show=u.el('label','ds-check',foot);u.el('span','ds-checkmark',show,'✓');u.el('span','',show,'Show non-purple shapes');
      let submit=null;
      if(!ctx.finish&&placement==='footer')submit=endButton(foot,'ds-submit',label);
      if(!ctx.finish&&placement==='header')submit=endButton(top,'ds-submit ds-top-submit',label);
      if(!ctx.finish&&placement==='link')submit=endButton(brief,'ds-end-link',label+' ›');
      if(collide&&placement==='footer')note(foot,'ds-xtra ds-footer-xtra',collide);
      return{stage,submit};
    },
    overlay(ctx){
      const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  });
})();
