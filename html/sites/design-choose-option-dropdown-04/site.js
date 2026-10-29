(function(){'use strict';
const C={site:'design-choose-option-dropdown-04',kicker:'TASKS',heading:'Edit Task',meta:['Task #4187','Last updated Apr 22, 2015'],
  title:'Prepare Q2 budget report',desc:'Compile departmental figures and prepare a summary\nfor review.'};
const ICONS=[
  '<svg viewBox="0 0 28 32"><path d="M5 2h12l7 7v21H5z M17 2v7h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  '<svg viewBox="0 0 32 30"><path d="M3 3h26v18H14l-7 6v-6H3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  '<svg viewBox="0 0 28 32"><path d="M20 10v13a6 6 0 0 1-12 0V8a4 4 0 0 1 8 0v14a2 2 0 0 1-4 0V11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" transform="rotate(8 14 16)"/></svg>',
  '<svg viewBox="0 0 32 10"><circle cx="5" cy="5" r="2.6" fill="currentColor"/><circle cx="16" cy="5" r="2.6" fill="currentColor"/><circle cx="27" cy="5" r="2.6" fill="currentColor"/></svg>'];
env.site({name:C.site,styles:['site.css'],scripts:[],frame(ctx){
  if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
  const selection=window.getSelection();if(selection)selection.removeAllRanges();
  const u=ctx.util;
  const endR=ctx.rng.fork('chrome/end');
  const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
  const endLabels=ctx.content.END_LABELS.map(labelOf);
  const referenceEnd=endR.bool(.5);
  const placement=referenceEnd?'footer':endR.pick(['header','link']);
  const endLabel=referenceEnd?'Submit':endR.pick(endLabels.filter(x=>x!=='Submit'));
  const page=u.el('div','rz-page',document.body);
  const margin=u.el('aside','rz-margin',page);
  const mode=ctx.display==='hidden'?'hidden':ctx.display==='toast'?'toast':'margin';
  if(mode==='margin'){u.el('div','rz-bar',margin);u.el('div','ds-instruction',margin,ctx.instruction);if(ctx.display==='panel')margin.classList.add('rz-instruction-panel');}
  const doc=u.el('section','rz-doc',page);
  const head=u.el('header','rz-head',doc);
  const hl=u.el('div','rz-headl',head);
  u.el('div','rz-kicker',hl,C.kicker);
  u.el('h1','rz-h1',hl,C.heading);
  const hr=u.el('div','rz-meta',head);
  C.meta.forEach(t=>u.el('div','',hr,t));
  if(mode==='toast'){const t=u.el('aside','ds-toast',doc);u.el('div','ds-instruction',t,ctx.instruction);}
  const stage=u.el('main','ds-stage',doc);
  function row(cls,label,order,kind,text,w){
    const r=u.el('div','rz-row '+cls,stage);r.style.order=order;
    u.el('span','rz-lab',r,label);
    const f=u.el('div','rz-fake '+kind,r,text||'');
    if(w)f.style.width=w;
    if(kind==='sel'){const c=u.el('span','rz-car',f);c.innerHTML='<svg viewBox="0 0 14 14"><path d="M2 4.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>';}
    return r;}
  const foot=u.el('footer','ds-footer',doc);
  const cancel=u.el('button','rz-cancel',foot,'Cancel');cancel.type='button';
  cancel.addEventListener('click',()=>env.log('decoy',{label:'Cancel'}));
  let submit=null;
  if(!ctx.finish){
    const parent=placement==='header'?hr:foot;
    if(placement==='header')hr.classList.add('rz-meta-with-end');
    submit=u.el('button','ds-submit'+(placement==='header'?' rz-end-header':placement==='link'?' rz-end-link':''),parent,endLabel);
    submit.type='button';submit.dataset.role='submit';submit.title=endLabel;submit.setAttribute('aria-label',endLabel);
    submit.addEventListener('click',()=>ctx.submit());
    if(placement==='link')foot.prepend(submit);
  }
  const collideR=ctx.rng.fork('chrome/collide');
  if(collideR.bool(.3)){
    const label=collideR.pick(endLabels.filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase()));
    const decoy=u.el('button','rz-cancel rz-xtra',foot,label);decoy.type='button';decoy.dataset.role='xtra';
    decoy.addEventListener('click',()=>env.log('decoy',{label,collide:true}));
    foot.insertBefore(decoy,cancel);
  }
  const tools=u.el('nav','rz-tools',page);
  ICONS.forEach((s,i)=>{const t=u.el('div','rz-tool t'+i,tools);t.innerHTML=s;});
  return{stage,submit};},
overlay(ctx){const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
  const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
  u.el('div','',el,texts[ctx.kind]);
  const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
  dismiss.addEventListener('click',()=>ctx.dismiss('close'));
  return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};}});})();
