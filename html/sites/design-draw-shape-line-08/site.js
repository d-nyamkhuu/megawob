(function(){'use strict';const C={"title":"SkillBuilder","accent":"#3a9a1c","font":"'Trebuchet MS', 'Segoe UI', Tahoma, Verdana, sans-serif"};
env.site({name:"design-draw-shape-line-08",styles:['site.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;body.className='design web2';
 document.documentElement.style.setProperty('--font',C.font);
 const display=ctx.display||'header',small=window.innerWidth<1260||window.innerHeight<700;
 const shownDisplay=(display==='panel'&&small)||(display==='toast'&&window.innerHeight<700)?'header':display;
 const endR=ctx.rng.fork('chrome/end'),collideR=ctx.rng.fork('chrome/collide');
 const placements=ctx.finish?[]:['header','link','footer','footer','footer','footer'];
 const placement=ctx.finish?null:endR.pick(placements);
 const endLabels=(ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply']).map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x)));
 const label=endR.bool(0.5)?'Submit':String(endR.pick(endLabels));
 const collides=!ctx.finish&&collideR.bool(0.3);
 const collideLabels=endLabels.filter(x=>String(x).trim().toLowerCase()!==label.trim().toLowerCase());
 const collideLabel=collides&&collideLabels.length?String(collideR.pick(collideLabels)):null;
 const shell=u.el('div','shell',body),head=u.el('header','head',shell);
 const logo=u.el('div','logo',head);u.el('span','l1',logo,'Skill');u.el('span','l2',logo,'Builder');
 const tabs=u.el('nav','tabs',head);
 for(const [t,cur] of [['Home',0],['Practice',1],['My Progress',0],['Settings',0]]){const b=u.el('button','tab'+(cur?' cur':''),tabs,t);b.type='button';}
 const links=u.el('div','toplinks',head);u.el('span','',links,'Help');u.el('i','',links,'|');u.el('span','',links,'Sign Out');
 const panel=u.el('div','panel',shell);
 const ph=u.el('div','panel-head',panel);u.el('h1','',ph,'Drawing Task');
 let headerSubmit=null;
 if(shownDisplay==='header')u.el('div','header-instruction',ph,ctx.instruction);
 u.el('span','step',ph,'Step 1 of 1');
 if(placement==='header'&&!ctx.finish){headerSubmit=u.el('button','submit header-submit',ph,label);headerSubmit.type='button';headerSubmit.dataset.role='submit';headerSubmit.setAttribute('aria-label',label);headerSubmit.title=label;headerSubmit.onclick=()=>ctx.submit();}
 const tb=u.el('div','toolbar',panel);
 const pen=u.el('button','tool on',tb);pen.type='button';
 const pi=u.svg('svg',{width:44,height:44,viewBox:'0 0 44 44'},pen);
 const pd=u.svg('defs',{},pi),pg=u.svg('linearGradient',{id:'pencil-g',x1:'0%',y1:'0%',x2:'100%',y2:'100%'},pd);
 for(const [offset,color] of [['0%','#fff0a3'],['42%','#ffd048'],['65%','#f49f20'],['100%','#c77811']])u.svg('stop',{offset,'stop-color':color},pg);
 u.svg('path',{d:'M4 41L9 27L31 3Q34 0 37 3L41 7Q43 10 40 13L17 37Z',fill:'#84949e',opacity:.2},pi);
 u.svg('path',{d:'M7 38L11 27L31 5L38 12L18 34Z',fill:'url(#pencil-g)',stroke:'#b1761d','stroke-width':1},pi);
 u.svg('path',{d:'M12 28L33 6M16 31L36 9',stroke:'#ffdf71','stroke-width':1.6},pi);
 u.svg('path',{d:'M7 38L11 27L18 34Z',fill:'#ead5a8',stroke:'#bca276','stroke-width':.7},pi);
 u.svg('path',{d:'M7 38L9 32L13 36Z',fill:'#26313a'},pi);
 u.svg('path',{d:'M31 5L34 2Q36 1 38 3L41 6Q43 8 41 10L38 12Z',fill:'#ee8197',stroke:'#ba5b6d','stroke-width':1},pi);
 u.svg('path',{d:'M32 5L39 12',stroke:'#d5dbe2','stroke-width':3},pi);
 u.svg('path',{d:'M34 3L39 7',stroke:'#ffb3bf','stroke-width':2},pi);
 u.el('span','',pen,'Pencil');
 u.el('div','sep',tb);
 const clr=u.el('button','tool',tb);clr.type='button';
 const ei=u.svg('svg',{width:44,height:44,viewBox:'0 0 44 44'},clr);
 const ed=u.svg('defs',{},ei),eg=u.svg('linearGradient',{id:'eraser-g',x1:'0%',y1:'0%',x2:'100%',y2:'100%'},ed);
 for(const [offset,color] of [['0%','#ffb6c8'],['55%','#f68ea8'],['100%','#e56a8d']])u.svg('stop',{offset,'stop-color':color},eg);
 u.svg('path',{d:'M4 30L27 6L39 14L41 22L18 42L7 37Z',fill:'#a86276',opacity:.18},ei);
 u.svg('path',{d:'M3 28L25 4L32 5L40 12L40 19L17 40L10 38L3 32Z',fill:'#dc6b8b',stroke:'#cf6583','stroke-width':1},ei);
 u.svg('path',{d:'M3 28L25 4L32 5L40 12L17 34L10 34Z',fill:'url(#eraser-g)',stroke:'#ea819d','stroke-width':1},ei);
 u.svg('path',{d:'M4 28L11 34L17 34L17 39L10 37L4 32Z',fill:'#f3a0b6'},ei);
 u.svg('path',{d:'M7 27L26 7L32 8',fill:'none',stroke:'#ffd3df','stroke-width':1.3},ei);
 u.el('span','',clr,'Clear');
 clr.onclick=()=>{env.widgetDef.clear?.();};
 const board=u.el('div','board',panel);
 let note=null;
 if(shownDisplay==='panel'){
   note=u.el('section','task-note instruction-panel',board);u.el('div','panel-label',note,'Task instructions');u.el('div','instruction',note,ctx.instruction);
 }else if(shownDisplay==='toast'){
   note=u.el('section','task-note instruction-toast',body);u.el('div','instruction',note,ctx.instruction);const x=u.el('button','note-close',note,'×');x.type='button';x.setAttribute('aria-label','Close');x.onclick=()=>note.style.visibility='hidden';
 }
 if(note&&ctx.instruction.length>50)note.classList.add('long-instruction');
 const stage=u.el('main','stage',board);stage.dataset.role='stage';
 let submit=headerSubmit;
 if(!ctx.finish&&placement!=='header'){
   const footer=u.el('footer','footer',panel);
   if(collideLabel){const d=u.el('button','end-xtra',footer,collideLabel);d.type='button';d.dataset.role='xtra';d.onclick=()=>env.log('decoy',{label:collideLabel,collide:true});}
   if(placement==='link'){
     submit=u.el('a','submit-link',footer,label+' ›');submit.href='#';submit.dataset.role='submit';submit.setAttribute('aria-label',label);submit.title=label;submit.onclick=e=>{e.preventDefault();ctx.submit();};
   }else{
     submit=u.el('button','submit',footer,label);submit.type='button';submit.dataset.role='submit';submit.setAttribute('aria-label',label);submit.title=label;submit.onclick=()=>ctx.submit();
   }
 }else if(!ctx.finish&&collideLabel){
   const d=u.el('button','header-xtra',ph,collideLabel);d.type='button';d.dataset.role='xtra';d.onclick=()=>env.log('decoy',{label:collideLabel,collide:true});
 }
 return{stage,submit};},
 overlay(ctx){const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
 const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind]||'Notice';
 const text={cookie:'This site stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this exercise?',promo:'Explore the latest practice features.',banner:'You are viewing a shared workspace.'}[kind]||'';
 u.el('h3','',box,title);u.el('p','',box,text);
 const dismiss=u.el('button','dismiss',box,kind==='cookie'?'Reject optional':'Close');dismiss.type='button';
 dismiss.onclick=()=>{ctx.dismiss('close');};
 if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.type='button';accept.onclick=()=>ctx.dismiss('accept');}
 return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
});})();
