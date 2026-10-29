(function(){'use strict';
const cfg={brand:'Rivermere Journal',nav:['Ideas','Places','People','Culture'],
notes:['First, click <b>Use default layout</b> if the layout warning is showing.','Then click the correct link in the article.','Finally, click <b>Submit.</b>']};
env.site({name:"design-click-control-link-12",styles:['site.css'],initialOverlay:{kind:'banner'},frame(ctx){
const u=ctx.util;document.body.className='ref journal';
const endRng=ctx.rng.fork('chrome/end');
const collideRng=ctx.rng.fork('chrome/collide');
const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
const labelText=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
const placement=ctx.finish?null:endRng.pick(['margin','margin','margin','header','link']);
const original=labels.map(labelText).find(x=>x.toLowerCase()==='submit')||'Submit';
const alternatives=labels.map(labelText).filter(x=>x.toLowerCase()!==original.toLowerCase());
const label=!ctx.finish&&endRng.bool(.5)?original:labelText(endRng.pick(alternatives.length?alternatives:labels));
let collide=null;
if(!ctx.finish&&collideRng.bool(.3)){const options=[...new Set(labels.map(labelText))].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());if(options.length)collide=collideRng.pick(options);}
const shell=u.el('main','shell',document.body);
const doc=u.el('div','doc',shell);
const mast=u.el('header','mast',doc);
u.el('div','brand',mast,cfg.brand);
const nav=u.el('nav','mnav',mast);
cfg.nav.forEach(n=>u.el('span','',nav,n));
let submit=null;
const endBtn=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.title=text;b.setAttribute('aria-label',text);b.addEventListener('click',ctx.submit);return b;};
const decoyBtn=(parent,text)=>{const b=u.el('button','end-xtra',parent,text);b.type='button';b.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));return b;};
if(placement==='header')submit=endBtn(mast,'end-header',label);
if(collide)decoyBtn(mast,collide);
const s=u.el('span','msearch',mast);
s.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5.5 5.5"/></svg>';
const stage=u.el('div','stage',doc);
const aside=u.el('aside','margin',shell);
if(ctx.display==='toast')aside.classList.add('toast-mode');
if(ctx.display==='header'||ctx.display==='panel'){
const host=ctx.display==='panel'?u.el('section','panel-note',aside):aside;
u.el('div','kicker',host,'Your task');
const note=u.el('div','instruction',host,ctx.instruction);note.dataset.display=ctx.display;
}
if(ctx.display==='toast'){const note=u.el('div','instruction instruction-toast',aside,ctx.instruction);note.dataset.display=ctx.display;}
if(ctx.display!=='hidden')u.el('hr','rule',aside);
u.el('div','kicker k2',aside,'Notes');
const ul=u.el('ul','notes',aside);
cfg.notes.forEach((t,i)=>{if(i===2)t=ctx.finish?'Finally, finish the task.':'Finally, click <b>'+label+'.</b>';u.el('li','',ul).innerHTML=t;});
if(placement==='margin')submit=endBtn(aside,'submit',label);
if(placement==='link'){submit=endBtn(aside,'submit end-link',label+' ›');submit.removeAttribute('title');}
return{stage,submit};},
overlay(ctx){
const el=ctx.util.el('section','perturb '+ctx.kind,document.body);
const x=ctx.util.el('button','dismiss x',el);x.type='button';x.setAttribute('aria-label','Close');
x.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m4 4 16 16M20 4 4 20"/></svg>';
x.addEventListener('click',ctx.dismiss);
const ic=ctx.util.el('div','warn',el);
ic.innerHTML='<svg viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M32 4 61 52H3Z"/><path d="M32 22v17M32 44v2"/></svg>';
ctx.util.el('h2','',el,'Layout could not be restored');
ctx.util.el('p','',el,'Your previous layout could not be restored, possibly due to a browser or system update.');
ctx.util.el('p','',el,'You can use the default layout to continue working. Your task data will be preserved.');
const dismiss=ctx.util.el('button','dismiss use',el,'Use default layout');dismiss.type='button';
dismiss.addEventListener('click',ctx.dismiss);
return{el,dismiss};}});})();
