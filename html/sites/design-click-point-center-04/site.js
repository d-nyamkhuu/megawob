(function(){'use strict';
env.site({name:"design-click-point-center-04",styles:['site.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;
 body.className='design amiga'+(ctx.display==='toast'?' has-instruction-toast':'');
 const endRng=ctx.rng.fork('chrome/end');
 const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
 const labelText=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
 const legacy=!ctx.finish&&endRng.bool(.5);
 const placements=['title','frame','link'];
 const placement=ctx.finish?null:(legacy?'controls':endRng.pick(placements));
 const label=ctx.finish?null:(legacy?'Submit':labelText(endRng.pick(labels)));
 const collideRng=ctx.rng.fork('chrome/collide');
 const collidePool=labels.map(labelText).filter(x=>x.trim().toLowerCase()!==String(label).trim().toLowerCase());
 const collide=!ctx.finish&&collidePool.length&&collideRng.bool(.3)?labelText(collideRng.pick(collidePool)):null;
 const root=document.documentElement;
 for(const [k,v] of Object.entries({bg:'#b4b4b4',panel:'#b4b4b4',fg:'#000',muted:'#222',line:'#000',accent:'#000'}))root.style.setProperty('--'+k,v);
 root.style.setProperty('--font','"Courier New", monospace');
 const shell=u.el('div','shell',body);
 const bar=u.el('header','wb-bar',shell);
 const g0=u.el('span','wb-gad disk',bar);u.el('span','wb-bar-title',bar,'Amiga Workbench');u.el('span','wb-bar-sp',bar);
 const disk=u.svg('svg',{viewBox:'0 0 26 26','aria-hidden':'true'},g0);
 u.svg('path',{d:'M6 8H15V21H6Z',fill:'#fff',stroke:'#444','stroke-width':1},disk);
 u.svg('path',{d:'M11 5H19L22 8V19H11Z',fill:'#eee',stroke:'#444','stroke-width':1},disk);
 u.svg('path',{d:'M14 6H18V11H14ZM17 13H20V18H17Z',fill:'#aaa',stroke:'#666','stroke-width':1},disk);
 u.el('span','wb-bar-clock',bar,'Mo   Mon 27 May 1991  10:24');u.el('span','wb-gad back',bar);
 const content=u.el('div','content',shell);
 const win=(parent,cls,title)=>{const t=u.el('div','wb-title '+cls,parent);
  u.el('span','wb-gad close',t);u.el('span','wb-title-text',t,title);const r=u.el('span','wb-title-r',t);u.el('span','wb-gad small size',r);u.el('span','wb-gad small back',r);return t;};
 const info=u.el('section','wb-win w-info',content);
 win(info,'t1','Circle Center Task');
 const overview=u.el('div','wb-overview',info);
 const note=u.el('section','task-note',overview);
 const ic=u.el('div','wb-icon',note);
 const icon=u.svg('svg',{viewBox:'0 0 66 70','aria-hidden':'true'},ic);
 u.svg('path',{d:'M4 3H49L63 16V66H4Z',fill:'#c2c2c2',stroke:'#000','stroke-width':3},icon);
 u.svg('path',{d:'M10 9H46L56 19V59H10ZM46 9V19H56',fill:'#fff',stroke:'#000','stroke-width':3},icon);
 const it=u.svg('text',{x:23,y:52,fill:'#002795','font-family':'Georgia,serif','font-size':48,'font-weight':'bold'},icon);it.textContent='i';
 const txt=u.el('div','wb-text',note);
 u.el('div','instruction',txt,ctx.instruction);
 u.el('p','wb-sub',txt,'Click once on the point you believe is the exact center of the circle in the area below.');
 u.el('p','wb-sub',txt,'No dragging.  No typing required.');
 if(ctx.display==='hidden'||ctx.display==='panel')note.hidden=true;
 else if(ctx.display==='toast'){note.classList.add('instruction-toast');const x=u.el('button','note-close',note,'×');x.type='button';x.setAttribute('aria-label','Close');x.onclick=()=>note.style.visibility='hidden';}
 const task=u.el('section','wb-win w-task',content);
 const title=win(task,'t2','Task Area');
 let submit=null;
 const endBtn=(parent,where,text)=>{const b=u.el(where==='link'?'a':'button','submit episode-end end-'+where,parent,text);b.type='button';if(where==='link')b.href='#';b.dataset.role='submit';b.setAttribute('aria-label',text);b.title=text;b.onclick=e=>{e.preventDefault();ctx.submit();};return b;};
 if(placement==='title')submit=endBtn(title,'title',label);
 const workspace=u.el('div','wb-workspace',task);
 const stage=u.el('main','stage',workspace);stage.dataset.role='stage';
 const aside=u.el('aside','aside',workspace);
 const box1=u.el('div','wb-box',aside);u.el('div','wb-box-title',box1,'Controls');
 const b1=u.el('div','wb-box-body',box1);
 const help=u.el('p','',b1,'Click on the center of the circle in the canvas.');
 if(ctx.display==='panel'){help.textContent=ctx.instruction;help.classList.add('episode-instruction-panel');}
 if(placement==='controls')submit=endBtn(b1,'controls',label);
 const clear=u.el('button','clear',b1,'Clear');clear.type='button';clear.onclick=()=>{env.widgetDef.clear?.();};
 if(placement==='link')submit=endBtn(b1,'link',label+' ›');
 if(collide){const d=u.el('button','end-xtra',b1,collide);d.type='button';d.dataset.role='xtra';d.onclick=()=>env.log('decoy',{label:collide,collide:true});}
 const box2=u.el('div','wb-box status',aside);u.el('div','wb-box-title',box2,'Status');
 u.el('div','wb-box-body answer-status',box2).textContent='No answer yet.';
 const frame=u.el('div','wb-bottom-frame',task);
 if(placement==='frame')submit=endBtn(frame,'frame',label);
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
