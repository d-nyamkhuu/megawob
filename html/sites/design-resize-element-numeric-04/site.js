(function(){'use strict';
env.site({name:"design-resize-element-numeric-04",styles:['site.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;
 body.className='design brut'+(ctx.display==='toast'?' has-instruction-toast':'');
 const shell=u.el('div','shell',body);
 let display=ctx.display;
 if((display==='panel'&&shell.clientWidth<1260)||(display==='toast'&&shell.clientHeight<700))display='header';
 body.classList.toggle('has-instruction-toast',display==='toast');
 const head=u.el('header','head',shell);
 u.el('div','title',head,'PANEL RESIZER');
 u.el('div','tagline',head,'IMPLEMENTS EXACT SIZES');
 const content=u.el('div','content',shell);
 const left=u.el('div','left',content);
 const note=u.el('section','task-note',left);
 u.el('div','instruction',note,ctx.instruction);
 u.el('div','instruction-sub',note,'Drag the bottom-right handle to resize the panel. Match the target size shown on the right.');
 if(display==='hidden')note.hidden=true;
 else if(display==='toast'){note.classList.add('instruction-toast');const x=u.el('button','note-close',note,'×');x.type='button';x.setAttribute('aria-label','Dismiss instruction');x.onclick=()=>note.style.visibility='hidden';}
 else if(display==='panel')note.classList.add('instruction-panel');
 const stage=u.el('main','stage',left);stage.dataset.role='stage';
 const aside=u.el('aside','aside',content);
 u.el('h3','',aside,'PANEL INSPECTOR');
 const tg=u.el('section','card target',aside);
 if(display==='panel'){aside.append(note);tg.hidden=true;}
 u.el('h4','',tg,'Target Size (from instruction)');
 const inner=u.el('div','inner',tg);
 const tw=u.el('div','',inner);u.el('span','k',tw,'Width:');u.el('b','tw',tw,'— px (±6 px)');
 const th=u.el('div','',inner);u.el('span','k',th,'Height:');u.el('b','th',th,'— px (±6 px)');
 const ins=(ctx.plainInstruction||ctx.instruction)||'';
 const mw=/(\d+)\s*px\s*wide/i.exec(ins)||/width\D{0,12}(\d+)/i.exec(ins),mh=/(\d+)\s*px\s*tall/i.exec(ins)||/height\D{0,12}(\d+)/i.exec(ins);
 const mx=/(\d+)\s*[×x]\s*(\d+)/.exec(ins);
 if(display!=='hidden'){const w=mw?mw[1]:mx&&mx[1],h=mh?mh[1]:mx&&mx[2];if(w)tw.lastChild.textContent=w+' px (±6 px)';if(h)th.lastChild.textContent=h+' px (±6 px)';}
 const cur=u.el('section','card cur',aside);
 u.el('h4','',cur,'Current Size (selected panel)');
 const cw=u.el('div','',cur),ch=u.el('div','',cur);
 u.el('span','k',cw,'Width:');u.el('b','',cw,'—');
 u.el('span','k',ch,'Height:');u.el('b','',ch,'—');
 const sel=u.el('section','card selp',aside);
 u.el('h4','',sel,'Selected Panel');
 for(const [k,v] of [['Name:','—'],['Resizable:','Yes'],['Min Size:','—'],['Max Size:','—']]){const r=u.el('div','',sel);u.el('span','k',r,k);u.el('span','selected-value',r,v);}
 const reset=u.el('button','clear',aside,'Reset Panel');reset.type='button';reset.onclick=()=>env.widgetDef.clear?.();
 const footer=u.el('footer','footer',aside);
 const er=ctx.rng.fork('chrome/end'),cr=ctx.rng.fork('chrome/collide');
 const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
 const labels=ctx.content.END_LABELS.map(labelOf);
 const original=er.bool(.5);
 const placement=original?'footer':er.pick(['header','link']);
 const label=original?'Submit':er.pick(labels);
 const tools=u.el('div','head-tools',head);
 let submit=null;
 if(!ctx.finish){
  submit=u.el(placement==='link'?'a':'button',placement==='footer'?'submit':placement==='header'?'toolbar-submit':'end-link',placement==='header'?tools:footer,label);
  if(placement==='link')submit.href='#';else submit.type='button';
  submit.dataset.role='submit';submit.title=label;submit.setAttribute('aria-label',label);
  submit.onclick=e=>{e.preventDefault();ctx.submit();};
 }
 if(cr.bool(.3)){
  const options=labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
  if(options.length){const text=cr.pick(options),decoy=u.el('button','chrome-xtra',tools,text);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label:text,collide:true});}
 }
 if(!tools.childElementCount)tools.remove();
 return{stage,submit};},
 overlay(ctx){const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
 const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind];
 const text={cookie:'This application stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this workspace?',promo:'Explore the latest workspace features.',banner:'You are viewing a shared workspace.'}[kind];
 u.el('h3','',box,title);u.el('p','',box,text);
 const dismiss=u.el('button','dismiss',box,kind==='cookie'?'Reject optional':'Close');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
 if(kind==='cookie'){const a=u.el('button','dismiss',box,'Accept optional');a.onclick=()=>ctx.dismiss('accept');}
 return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
});})();
