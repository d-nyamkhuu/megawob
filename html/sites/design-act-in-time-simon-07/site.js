(function(){
  'use strict';
  const C={site:'design-act-in-time-simon-07',brand:'Memory Lights'};
  const labelOf=x=>typeof x==='string'?x:x&&(x.label||x.text||x.name)||String(x);
  env.site({name:C.site,styles:['site.css'],scripts:[],frame(ctx){
    const u=ctx.util, body=document.body;
    if(document.activeElement&&document.activeElement!==body)document.activeElement.blur();
    const selection=window.getSelection();if(selection)selection.removeAllRanges();
    const layout=u.el('div','ds-layout',body);
    const margin=u.el('section','ds-margin',layout);
    let display=ctx.display||'header';
    if(display!=='hidden'){
      const note=u.el('aside','ds-instruction-card ds-instruction-'+display,margin);
      if(display==='panel')u.el('div','ds-note-label',note,'TASK');
      u.el('div','ds-instruction',note,ctx.instruction);
      if(display==='toast')u.el('span','ds-note-mark',note,'●');
    }
    const documentPanel=u.el('section','ds-document',layout);
    if(ctx.finish)documentPanel.classList.add('ds-finish');
    const stage=u.el('main','ds-stage',documentPanel);
    const tools=u.el('aside','ds-tools',layout);
    ['coral','lilac','mist','mist'].forEach(c=>{const d=u.el('i','',tools);d.className='ds-tool-dot '+c;});
    u.el('span','ds-tool-menu',tools,'☰');
    const endR=ctx.rng.fork('chrome/end');
    const labelPool=ctx.content&&ctx.content.END_LABELS;
    const label=endR.bool(.5)?'Submit':labelPool&&labelPool.length?labelOf(endR.pick(labelPool)):endR.pick(['Done','Finish','Continue','Save','OK','Confirm','Apply']);
    let submit=null;
    if(!ctx.finish){
      endR.pick(['bottom','bottom','bottom','top','link']);
      const placeR=ctx.rng.fork('chrome/end-placement');
      const place=placeR.pick(['bottom','bottom','top','link']);
      const foot=u.el('footer','ds-footer ds-footer-'+place,documentPanel);
      const decoyParent=place==='top'?u.el('div','ds-top-xtras',documentPanel):foot;
      if(place==='top')foot.classList.add('ds-end-top');
      if(place==='link')foot.classList.add('ds-end-link');
      const icon=place==='top';
      submit=u.el('button',icon?'ds-submit ds-icon-submit':'ds-submit',foot,icon?'✓':label);submit.type='button';submit.dataset.role='submit';
      if(icon){submit.setAttribute('aria-label',label);submit.title=label;}
      submit.addEventListener('click',()=>ctx.submit());
      const decoyR=ctx.rng.fork('chrome/collide');
      if(decoyR.bool(.3)){
        const options=(labelPool&&labelPool.length?labelPool:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply']).map(labelOf).filter(x=>x!==label);
        if(options.length){const d=u.el('button','ds-xtra',decoyParent,String(decoyR.pick(options)));d.type='button';d.addEventListener('click',()=>env.log('decoy',{label:d.textContent,collide:true}));}
      }
      const fillerR=ctx.rng.fork('chrome/filler');
      const fillers=ctx.content&&ctx.content.DECOY_LABELS;
      if(fillerR.bool(.22)&&fillers&&fillers.length){
        const d=u.el('button','ds-xtra ds-filler',decoyParent,labelOf(fillerR.pick(fillers)));d.type='button';
        d.addEventListener('click',()=>env.log('decoy',{label:d.textContent}));
      }
    }
    return{stage,submit};
  },overlay(ctx){
    const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
    const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
    u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
  }});
})();
