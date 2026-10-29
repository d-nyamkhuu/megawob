(function(){'use strict';const C={"accent":"#1f6fc0","bg":"#eef2f6","surface":"#fff","font":"\"Helvetica Neue\", Helvetica, Arial, \"Liberation Sans\", sans-serif"};
env.site({name:"design-select-text-sentence-08",styles:['site.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;body.className='design textlab'+(ctx.display==='toast'?' has-instruction-toast':'');
 const root=document.documentElement;for(const [k,v]of Object.entries({bg:C.bg,panel:C.surface,fg:'#111820',muted:'#5d6a7a',line:'#c9d1d9',accent:C.accent}))root.style.setProperty('--'+k,v);root.style.setProperty('--font',C.font);
 const shell=u.el('div','shell',body);
 const nav=u.el('header','nav',shell);u.el('span','brand',nav,'TextLab');
 const links=u.el('nav','navlinks',nav);['Home','Tasks','Reports','Help'].forEach(t=>{const a=u.el('a',t==='Tasks'?'on':'',links,t);a.href='#';a.onclick=e=>e.preventDefault();});
 const endRng=ctx.rng.fork('chrome/end');
 const placement=ctx.finish?'none':endRng.pick(['tools','tools','tools','tools','tools','tools','tools','nav','nav','preview']);
 const rawLabels=ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
 const labels=rawLabels.map(x=>String(typeof x==='string'?x:(x.label||x.text||x.name||x)));
 const alternateLabels=labels.filter(x=>x.trim().toLowerCase()!=='submit');
 const label=placement==='none'?'':(endRng.bool(.7)||!alternateLabels.length?'Submit':String(endRng.pick(alternateLabels)));
 let submit=null;
 if(placement==='nav'){
  const b=u.el('button','nav-submit',nav,label);b.type='button';b.dataset.role='submit';b.title=label;b.setAttribute('aria-label',label);b.onclick=()=>ctx.submit();submit=b;
 }
 const user=u.el('div','navuser',nav);u.el('span','',user,'User: jdoe');u.el('i','',user,'|');{const a=u.el('a','',user,'Sign out');a.href='#';a.onclick=e=>e.preventDefault();}
 const page=u.el('div','page',shell);
 const note=u.el('section','task-note',page);u.el('div','note-label',note,'');
 const instruction=u.el('h1','instruction',note,ctx.instruction);
 u.el('p','sub',note,'Click and drag to highlight the complete sentence.'+(ctx.finish?'':` Then click ${label}.`));
 if(ctx.display==='hidden')note.hidden=true;else if(ctx.display==='toast'){note.classList.add('instruction-toast');const x=u.el('button','note-close',note,'×');x.onclick=()=>note.style.visibility='hidden';}else if(ctx.display==='panel')note.classList.add('instruction-panel');
 const content=u.el('div','content',page);
 const stage=u.el('main','stage',content);stage.dataset.role='stage';
 const aside=u.el('aside','aside',content);
 const tools=u.el('section','panel tools',aside);u.el('div','phead',tools,'Tools');
 const tb=u.el('div','pbody',tools);
 const sel=u.el('div','tool on',tb);
 {const ic=u.svg('svg',{width:28,height:30,viewBox:'0 0 22 26'},sel);u.svg('path',{d:'M3 1V20L8 15.5L11.5 23L14.5 21.5L11 14.5L18 14Z',fill:'#111',stroke:'#fff','stroke-width':1.2},ic);}
 u.el('span','',sel,'Select (drag to highlight)');
 const clr=u.el('button','tool clear',tb);clr.type='button';
 {const ic=u.svg('svg',{width:26,height:26,viewBox:'0 0 26 26',fill:'none',stroke:'#19354d','stroke-width':2.4},clr);u.svg('path',{d:'M3 15L15 3Q16 2 17 3L23 9Q24 10 23 11L11 23Q10 24 9 23L3 17Q2 16 3 15Z M9 9L17 17'},ic);}
 u.el('span','',clr,'Clear selection');
 clr.onclick=()=>{env.widgetDef.clear?.();};
 u.el('hr','',tb);
 const makeSubmit=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.title=label;b.setAttribute('aria-label',label);b.onclick=()=>ctx.submit();return b;};
 if(placement==='tools')submit=makeSubmit(tb,'submit',label);
 const collideRng=ctx.rng.fork('chrome/collide');
 if(!ctx.finish&&collideRng.bool(.3)){
  const pool=labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
  if(pool.length){const collision=collideRng.pick(pool);const d=u.el('button','tool collision',tb,collision);d.type='button';d.dataset.role='xtra';d.onclick=()=>env.log('decoy',{label:collision,collide:true});}
 }
 const prev=u.el('section','panel preview',aside);const ph=u.el('div','phead',prev,'Preview');
 if(placement==='preview')submit=makeSubmit(ph,'preview-submit',label);
 u.el('div','pbody preview-body',prev);
 let titleFont=parseFloat(getComputedStyle(instruction).fontSize);
 while(!note.hidden&&instruction.scrollWidth>instruction.clientWidth&&titleFont>20){titleFont-=.5;instruction.style.fontSize=titleFont+'px';}
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
