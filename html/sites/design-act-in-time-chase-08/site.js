(function(){
  'use strict';
  const C={site:'design-act-in-time-chase-08'};
  env.site({name:C.site,styles:['site.css'],scripts:[],frame(ctx){
    if(!document.body._fragGuard){document.body._fragGuard=true;document.body.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(a&&/^#?$/.test(a.getAttribute('href')))e.preventDefault();});}
    if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
    const selection=window.getSelection();if(selection)selection.removeAllRanges();
    const u=ctx.util,body=u.el('div','ds-body',document.body),rail=u.el('aside','ds-rail',body);
    u.el('a','ds-rail-title',rail,'Lab Tasks');
    ['Home','Task','Results','Help','About'].forEach((t,i)=>{const a=u.el('a','',rail,t);a.href='#';if(i===1)a.className='current';});
    const content=u.el('div','ds-content',body);
    const title=u.el('h1','ds-title',content,'Pointer Tracking Task');u.el('div','ds-rule',content);
    const mode=ctx.display==='hidden'?'hidden':ctx.display==='toast'?'toast':ctx.display==='panel'?'panel':'top';
    const main=u.el('div','ds-main',content);
    if(mode==='top'){
      const note=u.el('section','ds-header-note',content);u.el('div','ds-instruction',note,ctx.instruction);content.insertBefore(note,main);
    }else if(mode==='toast'){
      const note=u.el('section','ds-toast',content);u.el('div','ds-instruction',note,ctx.instruction);content.insertBefore(note,main);
    }else if(mode==='panel'){
      const panel=u.el('aside','ds-episode-panel',main);u.el('div','ds-panel-title',panel,'Task instructions');
      u.el('div','ds-instruction',panel,ctx.instruction);
    }
    const stage=u.el('main','ds-stage',main);
    const footer=u.el('footer','ds-footer',content);
    const bottom=u.el('div','ds-bottom',content);u.el('a','',bottom,'Contact');u.el('a','',bottom,'Terms');
    let submit=null;
    const endR=ctx.rng.fork('chrome/end');
    const placements=['footer','footer','footer','header','bottom'];
    const placement=ctx.finish?null:endR.pick(placements);
    const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
    const labelValue=ctx.finish?'Submit':endR.pick(labels);
    const label=typeof labelValue==='string'?labelValue:(labelValue.label||labelValue.text||labelValue.name||String(labelValue));
    const endControl=(parent,cls,text)=>{
      const el=u.el(cls==='ds-endlink'?'a':'button',cls,parent,text);
      if(el.tagName==='BUTTON')el.type='button';else el.href='#';
      el.dataset.role='submit';el.setAttribute('aria-label',label);el.title=label;
      el.addEventListener('click',e=>{e.preventDefault();ctx.submit();});return el;
    };
    if(!ctx.finish){
      if(placement==='footer')submit=endControl(footer,'ds-submit',label);
      else if(placement==='header')submit=endControl(title,'ds-submit ds-submit-header',label);
      else submit=endControl(bottom,'ds-endlink',label+' ›');
    }
    const collideR=ctx.rng.fork('chrome/collide');
    if(!ctx.finish&&collideR.bool(0.3)){
      const pool=labels.map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x))).filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
      if(pool.length){
        const other=collideR.pick(pool),where=collideR.pick(['footer','bottom']);
        const parent=where==='footer'?footer:bottom;
        const decoy=u.el('button','ds-xtra',parent,other);decoy.type='button';decoy.dataset.role='xtra';
        decoy.addEventListener('click',()=>env.log('decoy',{label:other,collide:true}));
      }
    }
    return{stage,submit};
  },overlay(ctx){
    const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
    const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
    u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
    dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
  }});
})();
