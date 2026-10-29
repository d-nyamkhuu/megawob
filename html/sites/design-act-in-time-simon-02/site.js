(function(){
  'use strict';
  const C={site:'design-act-in-time-simon-02',brand:'Memory Pads'};
  env.site({name:C.site,styles:['site.css'],scripts:[],frame(ctx){
    if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
    const selection=window.getSelection();if(selection)selection.removeAllRanges();
    const u=ctx.util, rng=ctx.rng.fork('chrome/metro'), endRng=ctx.rng.fork('chrome/end');
    const top=u.el('header','ds-top',document.body);
    const brand=u.el('span','ds-brand',top);
    u.el('i','ds-mark',brand);u.el('span','',brand,C.brand);
    const controls=u.el('div','ds-window-controls',top);
    u.el('span','',controls,'−');u.el('span','',controls,'□');u.el('span','ds-close',controls,'×');
    const body=u.el('div','ds-body',document.body), content=u.el('div','ds-content',body);
    const mode=ctx.display||'header';document.body.dataset.simonbrief=mode;
    function note(parent,cls){const b=u.el('aside',cls,parent);u.el('div','ds-instruction',b,ctx.instruction);return b;}
    if(mode==='header')note(content,'ds-header-note');
    const main=u.el('div','ds-main',content);
    const stage=u.el('main','ds-stage',main);
    const inspector=u.el('aside','ds-inspector',main);
    u.el('h2','ds-inspector-title',inspector,'Game');
    if(mode==='panel'){
      u.el('div','ds-inspector-label',inspector,'Instructions');
      note(inspector,'ds-panel-note');
    }
    const readout=(title,value)=>{u.el('div','ds-inspector-label',inspector,title);u.el('div','ds-inspector-value',inspector,value);};
    readout('Level','1');readout('Sequence length','—');readout('Your turn',mode==='header'||mode==='panel'?'Not yet':'Watch');
    const rule=u.el('div','ds-rule',inspector);
    u.el('div','ds-inspector-label',inspector,'Progress');
    const progress=u.el('div','ds-progress',inspector);for(let i=0;i<3;i++)u.el('i',i===0?'active':'',progress);
    const gap=u.el('div','ds-inspector-spacer',inspector);
    let submit=null;
    const labels=ctx.content&&ctx.content.END_LABELS;
    const labelText=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
    let label=endRng.bool(.5)?'Submit':labelText(endRng.pick(Array.isArray(labels)&&labels.length?labels:['Done','Finish','Continue','Save','OK','Confirm','Apply']));
    let placement=ctx.finish?null:endRng.pick(['inspector','inspector','header','link']);
    // Preserve the original draws; the reference combination gets half the episodes.
    const variationRng=ctx.rng.fork('chrome/end/reference');
    const endLabels=(Array.isArray(labels)&&labels.length?labels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply']).map(labelText);
    if(!ctx.finish){
      if(variationRng.bool(.5)){placement='inspector';label='Submit';}
      else{
        placement=variationRng.pick(['header','link']);
        if(label==='Submit')label=variationRng.pick(endLabels.filter(x=>x.trim().toLowerCase()!=='submit'));
      }
    }
    const endBtn=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.title=label;b.setAttribute('aria-label',label);b.addEventListener('click',()=>ctx.submit());return b;};
    if(placement==='header')submit=endBtn(top,'ds-header-submit',label);
    if(placement==='link')submit=endBtn(inspector,'ds-end-link',label+' ›');
    if(placement==='inspector')submit=endBtn(inspector,'ds-submit',label);
    if(endRng.fork('chrome/collide').bool(.3)){
      const decoyLabels=endLabels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
      const decoyLabel=ctx.rng.fork('chrome/collide/label').pick(decoyLabels);
      const d=u.el('button','ds-xtra',controls,decoyLabel);d.type='button';d.dataset.role='xtra';
      d.addEventListener('click',()=>env.log('decoy',{label:decoyLabel,collide:true}));
    }
    if(!ctx.finish&&placement!=='inspector')u.el('div','ds-inspector-spacer',inspector);
    if(mode==='toast'){const toast=note(content,'ds-toast');content.insertBefore(toast,main);}
    return{stage,submit};
  },overlay(ctx){
    const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
    const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
    u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
    dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
  }});
})();
