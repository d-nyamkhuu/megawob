(function(){
  'use strict';
  const C={"site":"design-type-text-password-07","brand":"Northridge","title":"","instruction":"top","rail":"","menu":"Home|Profile|Security|Settings|Help","briefTitle":"TASK"};
  env.site({name:C.site,styles:['site.css'],scripts:[],frame(ctx){
    if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
    const selection=window.getSelection();if(selection)selection.removeAllRanges();
    const u=ctx.util,top=u.el('header','ds-top',document.body);
    u.el('span','ds-brand',top,C.brand);
    const usr=u.el('span','ds-user',top);u.el('span','ds-avatar',usr,'JS');u.el('span','',usr,'Jordan Smith');u.el('span','ds-chev',usr,'');
    const hd=u.el('div','ds-head',document.body);u.el('div','ds-eyebrow',hd,'ACCOUNT');u.el('div','ds-title',hd,'Change password');u.el('div','ds-rule',hd);u.el('div','ds-sub',hd,'Choose a strong password for your account.');
    const cancel=u.el('button','ds-cancel',document.body,'Cancel');cancel.type='button';
    if(C.menu){const nav=u.el('nav','ds-menu',document.body);C.menu.split('|').forEach(t=>u.el('span',t==='Security'?'on':'',nav,t));}
    const body=u.el('div','ds-body',document.body);if(C.rail){const rail=u.el('aside','ds-rail',body);C.rail.split('|').forEach(t=>u.el('div','',rail,t));}
    const content=u.el('div','ds-content',body),natural=C.instruction;
    const mode=ctx.display==='hidden'?'hidden':ctx.display==='toast'?'toast':ctx.display==='panel'?'left':natural;
    function briefing(parent,cls){const b=u.el('aside',cls,parent);if(cls==='ds-brief')u.el('h2','',b,C.briefTitle||'Task');u.el('div','ds-instruction',b,ctx.instruction);return b;}
    if(mode==='top')briefing(content,'ds-header-note');
    const main=u.el('div','ds-main',content);
    if(mode==='left'||mode==='right'){const b=briefing(main,'ds-brief');if(mode==='right')b.style.order='2';}
    const stage=u.el('main','ds-stage',main);
    if(mode==='toast'){const note=briefing(content,'ds-toast');content.insertBefore(note,main);}
    const foot=u.el('footer','ds-footer',content);u.el('span','',foot,'Ready');

    // Keep the reference form-footer action as the most common placement.
    const endRng=ctx.rng.fork('chrome/end');
    const placements=['form','form','form','panel','link'];
    const placement=ctx.finish?null:endRng.pick(placements);
    const labels=(ctx.content&&Array.isArray(ctx.content.END_LABELS)?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply']).map(x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x));
    const label=placement==='form'?(labels.find(x=>x.trim().toLowerCase()==='submit')||labels[0]):endRng.pick(labels);
    let submit=null;
    if(placement){
      const cls=placement==='form'?'ds-submit':placement==='panel'?'ds-submit ds-submit-panel':'ds-submit ds-submit-link';
      submit=u.el(placement==='link'?'a':'button',cls,document.body,label);
      if(submit.tagName==='BUTTON')submit.type='button';else submit.href='#';
      submit.dataset.role='submit';submit.setAttribute('aria-label',label);submit.title=label;
      submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
    }
    const collideRng=ctx.rng.fork('chrome/collide');
    if(!ctx.finish&&collideRng.bool(.3)){
      const options=[...new Set(labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase()))];
      if(options.length){const text=collideRng.pick(options),decoy=u.el('button','ds-xtra',document.body,text);decoy.type='button';decoy.dataset.role='xtra';decoy.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));}
    }
    return{stage,submit};
  },overlay(ctx){
    const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
    const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
    u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
  }});
})();
