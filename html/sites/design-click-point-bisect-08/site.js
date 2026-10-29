(function(){'use strict';const C={bg:'#faf8ee',panel:'#faf8ee',maroon:'#5c1a24',font:'"Times New Roman",Times,serif'};
env.site({name:"design-click-point-bisect-08",styles:['site.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;
 const display=ctx.display==='toast'&&window.innerHeight<700?'header':ctx.display;
 body.className='design lib'+(display==='toast'?' has-instruction-toast':'');
 const root=document.documentElement;for(const [k,v]of Object.entries({bg:C.bg,panel:C.panel,fg:'#2a1418',muted:'#5c3a3f',line:'#b9b09c',accent:C.maroon}))root.style.setProperty('--'+k,v);root.style.setProperty('--font',C.font);
 const shell=u.el('div','shell',body),head=u.el('header','head',shell);
 const logo=u.svg('svg',{class:'logo',width:92,height:50,viewBox:'0 0 92 50'},head);
 u.svg('path',{d:'M2 5H43L46 9L49 5H90V48H50L46 46L42 48H2Z',fill:'#cabd90',stroke:'#281915','stroke-width':2},logo);
 u.svg('path',{d:'M8 1Q28 -2 43 5V44Q28 37 8 42Z',fill:'#faf4d9',stroke:'#51442d','stroke-width':1.6},logo);
 u.svg('path',{d:'M84 1Q64 -2 49 5V44Q64 37 84 42Z',fill:'#faf4d9',stroke:'#51442d','stroke-width':1.6},logo);
 u.svg('path',{d:'M46 5V44',fill:'none',stroke:'#392218','stroke-width':2},logo);
 u.el('div','title',head,'Riverton Public Library');
 const nav=u.el('nav','menu',head);for(const t of['Catalog','Research','Services','About'])u.el('span','',nav,t);
 const content=u.el('div','content',shell),left=u.el('section','left',content),aside=u.el('aside','aside',content);
 u.el('h1','',left,'Geometry Collection');u.el('hr','',left);u.el('h2','',left,'Interactive Figure');
 const stage=u.el('main','stage',left);stage.dataset.role='stage';
 const meta=u.el('dl','meta',left);for(const [k,v]of[['Title:','Angle Bisector (Interactive Figure)'],['Subject:','Geometry — Angles'],['Notes:','Click a point in the diagram to indicate your answer.']]){const r=u.el('div','',meta);u.el('dt','',r,k);u.el('dd','',r,v);}
 u.el('h1','side-h',aside,'Your Task');
 const note=display==='hidden'?null:u.el('section','task-note',aside);
 if(note){u.el('div','instruction',note,ctx.instruction);
 if(display==='toast'){note.classList.add('instruction-toast');const x=u.el('button','note-close',note,'×');x.type='button';x.setAttribute('aria-label','Close');x.onclick=()=>note.style.visibility='hidden';}
 else if(display==='panel')note.classList.add('instruction-panel');
 else if(display==='header'){note.classList.add('instruction-header');left.insertBefore(note,stage);}}
 u.el('hr','',aside);u.el('h3','',aside,'Tools');
 const pt=u.el('button','tool',aside);pt.type='button';
 const ic=u.svg('svg',{width:24,height:28,viewBox:'0 0 24 28',fill:'#fff',stroke:'#222','stroke-width':1.5},pt);u.svg('path',{d:'M4 2V22L9 17L13 26L17 24L13 16H20Z'},ic);u.el('span','',pt,'Pointer');
 u.el('hr','',aside);const actionTitle=u.el('h3','',aside,'Actions');
 const acts=u.el('div','actions',aside);const clear=u.el('button','clear',acts,'Clear');clear.type='button';clear.onclick=()=>{env.widgetDef.clear?.();};
 let submit=null;
 if(!ctx.finish){
   const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
   const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
   const endR=ctx.rng.fork('chrome/end'),all=labels.map(labelOf),other=all.filter(x=>x.trim().toLowerCase()!=='submit');
   const label=endR.bool(.5)||!other.length?'Submit':labelOf(endR.pick(other));
   const place=endR.pick(['actions','actions','actions','actions','toolbar','footer','link']);
   const makeEnd=(parent,cls,text)=>{const b=u.el(cls==='end-link'?'a':'button',cls,parent,text);b.type='button';if(b.tagName==='A')b.href='#';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=e=>{e.preventDefault();ctx.submit();};return b;};
   if(place==='toolbar'){submit=makeEnd(aside,'submit submit-toolbar',label);aside.insertBefore(submit,acts);}
   else if(place==='footer')submit=makeEnd(aside,'submit submit-footer',label);
   else if(place==='link')submit=makeEnd(aside,'end-link',label+' ›');
   else submit=makeEnd(acts,'submit',label);
   const cr=ctx.rng.fork('chrome/collide');
   if(cr.bool(.3)){
     const options=[...new Set(all)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
     if(options.length){const text=cr.pick(options),decoy=u.el('button','end-xtra',aside,text);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label:text,collide:true});}
   }
 }
 return{stage,submit};},
 overlay(ctx){const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
 const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Library notice',banner:'Service notice'}[kind];
 const text={cookie:'This catalog stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this figure?',promo:'Explore the latest additions to the collection.',banner:'You are viewing a shared catalog record.'}[kind];
 const label=kind==='cookie'?'Reject optional':'Close';
 u.el('h3','',box,title);u.el('p','',box,text);const dismiss=u.el('button','dismiss',box,label);dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
 if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
 return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
});})();
