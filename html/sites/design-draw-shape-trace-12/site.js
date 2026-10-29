(function(){'use strict';
env.site({name:"design-draw-shape-trace-12",styles:['ws.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;body.className='design ws'+(ctx.display==='toast'?' has-instruction-toast':'');
 for(const [k,v]of Object.entries({bg:'#fff',panel:'#fff',fg:'#2b3440',muted:'#7a838f',line:'#e1e5ea',accent:'#55b995'}))document.documentElement.style.setProperty('--'+k,v);
 const app=u.el('div','app',body),work=u.el('section','work',app);
 const note=u.el('div','task-note',work);
 u.el('h1','instruction',note,ctx.instruction);
 u.el('p','sub',note,'Click at the start dot and move your mouse along the curve to the arrow tip. Stay on the path.');
 if(ctx.display==='hidden')note.hidden=true;
 else if(ctx.display==='toast'){note.classList.add('instruction-toast');const x=u.el('button','note-close',note,'×');x.type='button';x.setAttribute('aria-label','Close');x.onclick=()=>note.style.visibility='hidden';}
 else if(ctx.display==='panel')note.classList.add('instruction-panel');
 const stage=u.el('main','stage',work);stage.dataset.role='stage';
 const ins=u.el('aside','inspector',app);
 u.el('div','sec-title',ins,'Task progress');
 const pr=u.el('div','prog',ins);u.el('div','bar',pr);u.el('span','',pr,'0%');
 u.el('div','small',ins,'Path not started.');
 u.el('hr','',ins);
 const th=u.el('div','sec-title',ins);u.el('span','',th,'Task controls');
 const chev=(parent,up)=>{const s=u.svg('svg',{width:18,height:18,viewBox:'0 0 18 18',fill:'none',stroke:'#434c58','stroke-width':1.6},parent);u.svg('path',{d:up?'M3 11L9 5L15 11':'M3 6L9 12L15 6'},s);return s;};
 chev(th,false);
 const box=u.el('div','box',ins);
 const row=u.el('div','row',box);
 const lk=u.svg('svg',{width:22,height:24,viewBox:'0 0 22 24',fill:'none',stroke:'#555e6a','stroke-width':1.5,style:'flex:none'},row);
 u.svg('rect',{x:3,y:10,width:16,height:12,rx:2},lk);u.svg('path',{d:'M6.5 10V7a4.5 4.5 0 0 1 9 0v3'},lk);
 u.el('span','',row,'Controls are hidden to make this a fair test.');
 const show=u.el('button','btn-mint',box,'Show controls');show.type='button';
 const clr=u.el('button','clear',box,'Clear');clr.type='button';
 clr.onclick=()=>{env.widgetDef.clear?.();};
 show.onclick=()=>{box.classList.add('revealed-ctl');show.textContent='Controls shown';};
 u.el('hr','',ins);
 const ph=u.el('div','sec-title',ins);u.el('span','',ph,'Preferences');chev(ph,true);
 for(const [lab,txt,w] of [['Path color','Gray (default)',false],['Background','White (default)',true]]){
  const r=u.el('div','pref',ins);u.el('span','',r,lab);const s=u.el('div','sel',r);u.el('i',w?'w':'',s);u.el('span','',s,txt);u.el('b','',s,'⌄');}
 for(const [lab,on] of [['Show grid',false],['Cursor guide',true]]){
  const r=u.el('div','pref',ins);u.el('span','',r,lab);const t=u.el('button','tg'+(on?' on':''),r);t.type='button';u.el('u','',t);const v=u.el('span','',t,on?'On':'Off');
  t.onclick=()=>{t.classList.toggle('on');v.textContent=t.classList.contains('on')?'On':'Off';};}
 const endRng=ctx.rng.fork('chrome/end'),collideRng=ctx.rng.fork('chrome/collide');
 const endLabels=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
 const labelText=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
 const keepDefault=endRng.bool(.5),placement=keepDefault?'bottom':endRng.pick(['top','link']);
 const label=keepDefault?'Submit':labelText(endRng.pick(endLabels));
 const collisions=[];
 if(!ctx.finish&&collideRng.bool(.3)){
  const options=[...new Set(endLabels.map(labelText))].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
  if(options.length)collisions.push(labelText(collideRng.pick(options)));
 }
 const decoy=(parent,text)=>{const b=u.el('button','end-xtra',parent,text);b.type='button';b.dataset.role='xtra';b.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));};
 const endButton=(parent,kind)=>{const b=u.el(kind==='link'?'button':'button',kind==='link'?'end-link':'submit '+(kind==='top'?'top-submit':''),parent,label);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
 let submit=null;
 if(!ctx.finish&&placement==='top'){
  const row=u.el('div','end-actions top-actions',ins);for(const d of collisions)decoy(row,d);submit=endButton(row,'top');
 }else if(!ctx.finish&&placement==='link'){
  const row=u.el('div','end-actions link-actions',ins);for(const d of collisions)decoy(row,d);submit=endButton(row,'link');
 }
 u.el('div','spacer',ins);
 if(!ctx.finish&&placement==='bottom'){
  for(const d of collisions)decoy(ins,d);
  submit=endButton(ins,'bottom');
 }
 return{stage,submit};},
 overlay(ctx){const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
 const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind];
 const text={cookie:'This application stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this workspace?',promo:'Explore the latest workspace features.',banner:'You are viewing a shared workspace.'}[kind];
 u.el('h3','',box,title);u.el('p','',box,text);
 const dismiss=u.el('button','dismiss',box,kind==='cookie'?'Reject optional':'Close');dismiss.type='button';
 dismiss.onclick=()=>ctx.dismiss('close');
 if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
 return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
});})();
