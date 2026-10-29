(function(){'use strict';const C={"title":"Geometry Trainer","level":"Level 1","accent":"#1a4a98","bg":"#ffffff","surface":"#ffffff","font":"'Roboto', 'Arial', Helvetica, sans-serif"};
env.site({name:"design-click-point-center-10",styles:['site.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body; body.className='design flash layout-flash'+(ctx.display==='toast'?' has-instruction-toast':'');
 const root=document.documentElement;for(const [k,v]of Object.entries({bg:C.bg,panel:C.surface,fg:'#0b1f4d',muted:'#4a6bb0',line:'#c9d3e6',accent:C.accent}))root.style.setProperty('--'+k,v);root.style.setProperty('--font',C.font);
 const shell=u.el('div','shell',body),head=u.el('header','head',shell);
 u.el('div','title',head,C.title);
 const content=u.el('div','content',shell),note=u.el('section','task-note',content);
 u.el('div','note-label',note,'');
 const instruction=u.el('div','instruction',note,ctx.instruction);
 if(ctx.display==='hidden')note.hidden=true;else if(ctx.display==='toast'){note.classList.add('instruction-toast');const x=u.el('button','note-close',note,'×');x.onclick=()=>note.style.visibility='hidden';}else if(ctx.display==='panel')note.classList.add('instruction-panel');
 u.el('div','level',head,C.level);
 const stage=u.el('main','stage',content);stage.dataset.role='stage';
 const footer=u.el('footer','footer',shell);let submit=null;
 if(!ctx.finish){
  const endRng=ctx.rng.fork('chrome/end'), labels=ctx.content&&ctx.content.END_LABELS;
  const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
  const choices=Array.isArray(labels)&&labels.length?labels.map(labelOf):['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
  const submitLabel=choices.find(x=>x.trim().toLowerCase()==='submit')||'Submit';
  const otherLabels=choices.filter(x=>x.trim().toLowerCase()!==submitLabel.trim().toLowerCase());
  const referenceEnd=endRng.bool(0.5);
  const label=referenceEnd||!otherLabels.length?submitLabel:endRng.pick(otherLabels);
  const placement=referenceEnd?'corner':endRng.pick(['opposite','header']);
  const makeEnd=(parent,cls)=>{const b=u.el('button','submit '+cls,parent,label);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
  if(placement==='header')submit=makeEnd(content,'flash-header-submit');
  else submit=makeEnd(footer,placement==='opposite'?'flash-opposite-submit':'flash-corner-submit');
  const collideRng=ctx.rng.fork('chrome/collide');
  if(collideRng.bool(0.3)){
   const pool=[...new Set(choices)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
   if(pool.length){const text=collideRng.pick(pool),b=u.el('button','flash-xtra',footer,text);b.type='button';b.dataset.role='xtra';if(submit&&submit.parentNode===footer)footer.insertBefore(b,submit);b.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));}
  }
 }
 // Keep the reference typography unless a longer seeded instruction needs to wrap.
 if(ctx.display==='header'){
  let fontSize=parseFloat(getComputedStyle(instruction).fontSize);
  while(fontSize>12&&instruction.scrollHeight>note.clientHeight-4){
   fontSize-=1;instruction.style.fontSize=fontSize+'px';
  }
 }
 return{stage,submit};},
 overlay(ctx){const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
 const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind];
 const text={cookie:'This application stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this workspace?',promo:'Explore the latest workspace features.',banner:'You are viewing a shared workspace.'}[kind];
 const label=kind==='cookie'?'Reject optional':'Close';
 u.el('h3','',box,title);u.el('p','',box,text);
 const dismiss=u.el('button','dismiss',box,label);dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
 if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
 return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
});})();
