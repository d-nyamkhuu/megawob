(function(){'use strict';const C={"layout":"civicref","theme":"cvr","title":"Civic Library","subtitle":"Local history for a stronger community","accent":"#185dbc","navy":"#17395f","bg":"#f7fbfe","surface":"#fff","font":"Arial,'Segoe UI',sans-serif"};
env.site({name:"design-select-text-paragraph-04",styles:['site.css','civic.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;body.className='design '+C.theme+' layout-'+C.layout;
 const root=document.documentElement;for(const [k,v]of Object.entries({bg:C.bg,panel:C.surface,fg:'#14213d',muted:'#4c5a6e',line:'#c3ccd8',accent:C.accent,navy:C.navy}))root.style.setProperty('--'+k,v);root.style.setProperty('--font',C.font);
 const shell=u.el('div','shell',body),head=u.el('header','head',shell);
 const brand=u.el('div','brand',head);u.el('div','title',brand,C.title);u.el('div','subtitle',brand,C.subtitle);
 const links=u.el('nav','toplinks',head);for(const t of ['Help','Sign out']){const a=u.el('button','toplink',links,t);a.type='button';a.onclick=()=>env.log('nav',{label:t});}
 const labels=(ctx.content&&ctx.content.END_LABELS)||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
 const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
 const endRng=ctx.rng.fork('chrome/end'),keepOriginal=ctx.finish?false:endRng.bool(.5);
 const submitLabel=labels.map(labelOf).find(x=>x.trim().toLowerCase()==='submit')||'Submit';
 const alternatives=labels.filter(x=>labelOf(x).trim().toLowerCase()!=='submit');
 const placement=ctx.finish?null:keepOriginal?'aside':endRng.pick(['header','link']);
 const endLabel=ctx.finish?null:keepOriginal?submitLabel:labelOf(endRng.pick(alternatives.length?alternatives:labels));
 const content=u.el('div','content',shell),note=u.el('section','task-note',content);
 u.el('div','note-label',note,'Reading task');
 u.el('div','instruction',note,ctx.instruction);
 u.el('p','note-hint',note,'Read the text below. Click and drag to highlight the correct paragraph.');
 if(ctx.display==='hidden'||ctx.display==='panel'||ctx.display==='toast')note.hidden=true;
 const stage=u.el('main','stage',content);stage.dataset.role='stage';
 const aside=u.el('aside','aside',content);
 if(ctx.display==='panel'||ctx.display==='toast'){
  const box=u.el('section',ctx.display==='panel'?'task-panel':'task-toast',aside);
  u.el('div','task-panel-title',box,ctx.display==='panel'?'Task instructions':'Reading task');
  u.el('div','task-panel-text',box,ctx.instruction);
  if(ctx.display==='toast'){const x=u.el('button','task-toast-close',box,'×');x.type='button';x.setAttribute('aria-label','Close');x.onclick=()=>{box.hidden=true;env.log('note-close');};}
 }
 const prog=u.el('div','prog',aside);const ph=u.el('div','prog-head',prog);u.el('h3','',ph,'Your progress');u.el('span','',ph,'Step 1 of 1');
 const pr=u.el('div','prog-row',prog);u.el('span','ring',pr);u.el('span','selection-status',pr,'No paragraph selected yet.');
 u.el('h3','how',aside,'How to highlight');
 const ol=u.el('ol','howlist',aside);for(const t of ['Click at the start of the paragraph.','Drag to the end of the paragraph.','Release to select.'])u.el('li','',ol,t);
 const footer=u.el('footer','footer',aside);u.el('div','footer-copy',footer,'');
 const clear=u.el('button','clear-selection',footer,'Clear selection');clear.type='button';clear.hidden=true;clear.onclick=()=>env.widgetDef.clear?.();
 const endControl=(parent,kind,label)=>{
  const b=u.el(kind==='link'?'a':'button',kind==='link'?'submit-link':kind==='header'?'submit-header':'submit',parent,kind==='link'?label+' ›':label);
  if(kind==='link')b.href='#';else b.type='button';
  b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;
  b.onclick=e=>{e.preventDefault();ctx.submit();};return b;
 };
 const collideRng=ctx.rng.fork('chrome/collide');let collide=null;
 if(!ctx.finish&&collideRng.bool(.3)){
  const choices=[...new Set(labels.map(labelOf))].filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase());
  if(choices.length)collide=labelOf(collideRng.pick(choices));
 }
 const decoy=(parent,label)=>{const b=u.el('button','end-xtra',parent,label);b.type='button';b.dataset.role='xtra';b.onclick=()=>env.log('decoy',{label,collide:true});return b;};
 if(collide&&collideRng.pick(['head','head','aside'])==='head')decoy(links,collide);
 let submit=null;
 if(!ctx.finish){
  if(placement==='header')submit=endControl(links,'header',endLabel);
  else if(placement==='link')submit=endControl(footer,'link',endLabel);
  else submit=endControl(footer,'aside',endLabel);
 }
 if(collide&&!document.querySelector('.end-xtra'))decoy(footer,collide);
 return{stage,submit};},
 overlay(ctx){const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
 const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Library update',banner:'Service notice'}[kind];
 const text={cookie:'This site stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this page?',promo:'Explore the latest library services.',banner:'You are viewing a shared page.'}[kind];
 const label=kind==='cookie'?'Reject optional':'Close';
 u.el('h3','',box,title);u.el('p','',box,text);const dismiss=u.el('button','dismiss',box,label);dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
 if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
 return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
});})();
