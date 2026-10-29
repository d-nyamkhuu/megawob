(function(){'use strict';const C={"title":"Trace the Path","brand":"Path Practice","accent":"#d62430","bg":"#fbf6ee","font":"'Helvetica Neue', Arial, sans-serif"};
env.site({name:"design-draw-shape-trace-03",styles:['site.css','bauhaus.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;body.className='design bauhaus'+(ctx.display==='toast'?' has-instruction-toast':'');
 const er=ctx.rng.fork('chrome/end'),cr=ctx.rng.fork('chrome/collide');
 const endWords=ctx.content.END_LABELS.map(x=>typeof x==='string'?x:(x.label||x.text||x.name));
 const referenceEnd=er.bool(.5),placement=referenceEnd?'footer':er.pick(['header','link']);
 const endLabel=referenceEnd?'Submit':er.pick(endWords.filter(x=>x!=='Submit'));
 const collide=cr.bool(.3)?cr.pick(endWords.filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase())):null;
 const root=document.documentElement;for(const [k,v]of Object.entries({bg:C.bg,panel:C.bg,fg:'#16161a',muted:'#444',line:'#16161a',accent:C.accent}))root.style.setProperty('--'+k,v);root.style.setProperty('--font',C.font);
 const shell=u.el('div','bh-shell',body);
 const left=u.el('aside','bh-left',shell);
 const brand=u.el('div','bh-brand',left);u.el('span','bh-dot',brand);u.el('span','bh-name',brand,C.brand);
 const note=u.el('section','task-note bh-note',left);
 u.el('div','bh-kicker',note,'TASK');
 const instruction=u.el('div','instruction',note);
 const txt=String(ctx.instruction||'');if(txt.length>68)note.classList.add('bh-long');const m=txt.match(/^(.*?)(\s*(?:the arrow tip|(?:the )?arrowhead)\.?)$/i);
 if(m){instruction.appendChild(document.createTextNode(m[1]+' '));u.el('span','bh-red',instruction,m[2].trim());}else instruction.textContent=txt;
 u.el('hr','bh-rule',note);
 u.el('p','bh-copy',note,'Click and hold to draw along the dashed path. Keep your mouse on the path from the start dot to the arrow tip.');
 u.el('p','bh-copy',note,'Release to finish. Try to stay as close to the path as possible.');
 if(ctx.display==='hidden')note.hidden=true;else if(ctx.display==='toast'){note.classList.add('instruction-toast');const x=u.el('button','note-close',note,'×');x.onclick=()=>note.style.visibility='hidden';}else if(ctx.display==='panel')note.classList.add('instruction-panel');
 const goal=u.el('div','bh-goal',left);u.el('div','bh-kicker',goal,'GOAL');u.el('p','',goal,ctx.finish?'Complete the path.':`Complete the path and click ${endLabel}.`);
 const right=u.el('section','bh-right',shell);
 const head=u.el('header','bh-head',right);u.el('h1','',head,C.title);
 const tools=u.el('div','bh-head-tools',head);
 const reset=u.el('button','bh-reset',tools);reset.type='button';
 const ic=u.svg('svg',{width:30,height:30,viewBox:'0 0 24 24',fill:'none',stroke:'#fff','stroke-width':2.2,'stroke-linecap':'round'},reset);u.svg('path',{d:'M20 12A8 8 0 1 1 16.5 5.4M20 3V8H15'},ic);u.el('span','',reset,'Reset');
 reset.onclick=()=>{env.widgetDef.clear?.();};
 const stage=u.el('main','stage',right);stage.dataset.role='stage';
 const footer=u.el('footer','footer bh-foot',right);
 if(collide){const decoy=u.el('button','bh-xtra',footer,collide);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label:collide,collide:true});}
 let submit=null;if(!ctx.finish){
  const parent=placement==='header'?tools:footer;
  submit=u.el(placement==='link'?'a':'button','submit'+(placement==='header'?' bh-end-header':placement==='link'?' bh-end-link':''),parent,endLabel);
  if(placement==='link')submit.href='#';else submit.type='button';
  submit.title=endLabel;submit.setAttribute('aria-label',endLabel);submit.dataset.role='submit';
  submit.onclick=e=>{e.preventDefault();ctx.submit();};
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
