(function(){'use strict';
env.site({name:"design-draw-shape-circle-12",styles:['site.css','ref.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;body.className='design linux layout-linux'+(ctx.display==='toast'?' has-instruction-toast':'');
 const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
 const textOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
 const endRng=ctx.rng.fork('chrome/end');
 const referenceEnd=endRng.bool(.5);
 const endLabel=referenceEnd?'Submit':textOf(endRng.pick(labels));
 const endPlacement=ctx.finish?null:referenceEnd?'controls':endRng.pick(['header','footer']);
 const collideRng=ctx.rng.fork('chrome/collide');
 const collidePool=[...new Set(labels.map(textOf).filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase()))];
 const collide=collidePool.length&&collideRng.bool(.3)?textOf(collideRng.pick(collidePool)):null;
 const root=document.documentElement;
 for(const [k,v] of Object.entries({bg:'#d8d6d0',panel:'#e4e2dc',fg:'#111',muted:'#555',line:'#b9b6ae',accent:'#6b0f1e'}))root.style.setProperty('--'+k,v);
 root.style.setProperty('--font','"DejaVu Sans Mono","Liberation Mono","Courier New",monospace');
 const shell=u.el('div','shell',body);
 const compact=shell.clientWidth<1200||shell.clientHeight<760;
 let display=(ctx.display==='panel'&&compact)||(ctx.display==='toast'&&shell.clientHeight<700)?'header':ctx.display;
 body.classList.toggle('has-instruction-toast',display==='toast');
 body.classList.toggle('has-instruction-panel',display==='panel');
 // title bar
 const head=u.el('header','head',shell);
 const ic=u.svg('svg',{class:'app-icon',width:26,height:26,viewBox:'0 0 26 26'},head);
 u.svg('path',{d:'M10 1H15L16 5L19 6L22 4L25 9L22 12V15L26 17L23 22L19 21L16 23L15 26H10L9 22L6 20L2 22L0 17L4 14V11L1 9L4 4L8 5Z',fill:'#c7c3bd',stroke:'#888','stroke-width':.6},ic);
 u.svg('circle',{cx:13,cy:13,r:5.5,fill:'#64101c',stroke:'#bdbbb5','stroke-width':2},ic);
 u.el('div','title',head,'Calibrix 1.8.3  - Pointer Calibration Utility');
 const wc=u.el('div','window-controls',head);
 for(const label of ['_','□','×']){const bt=u.el('button','',wc,label);bt.type='button';bt.onclick=()=>env.log('window-control',{label});}
 // menu bar
 const menu=u.el('nav','menu',shell);
 for(const m of ['File','View','Tools','Help'])u.el('span','',menu,m);
 if(collide){const d=u.el('button','xtra-end menu-xtra',menu,collide);d.type='button';d.dataset.role='xtra';d.onclick=()=>env.log('decoy',{label:collide,collide:true});}
 // framed task area
 const frame=u.el('div','frame',shell);
 const fh=u.el('div','frame-head',frame);
 u.el('span','frame-title',fh,'Calibration Task');
 u.el('span','frame-rule',fh);
 u.el('span','frame-meta',fh,'Mode: Circular Trace');
 u.el('span','frame-sep',fh,'|');
 u.el('span','frame-meta',fh,'Profile: default');
 const content=u.el('div','content',frame);
 const main=u.el('div','main',content);
 const note=u.el('section','task-note',main);
 u.el('div','instruction',note,ctx.instruction);
 if(display==='hidden')note.hidden=true;
 else if(display==='toast'){note.classList.add('instruction-toast');const x=u.el('button','note-close',note,'×');x.type='button';x.onclick=()=>note.style.visibility='hidden';}
 else if(display==='panel')note.classList.add('instruction-panel');
 else if(ctx.instruction.length>85)note.classList.add('long-instruction');
 const stage=u.el('main','stage',main);stage.dataset.role='stage';
 // right info panel
 const aside=u.el('aside','aside',content);
 const sec=(t,parent)=>{const h=u.el('div','sec-head',parent||aside);u.el('span','',h,t);u.el('i','',h);};
 sec('Task Info');
 const info=u.el('div','rows',aside);
 for(const [k,v] of [['Shape:','Circle'],['Strokes:','1'],['Status:','Not started']]){const r=u.el('div','info-row',info);u.el('span','',r,k);u.el('span','',r,v);}
 const tr=u.el('div','info-row',info);u.el('span','',tr,'Time:');env.timeText=u.el('span','',tr,'Paused');
 u.el('hr','',aside);
 sec('Live Readout');
 const ro=u.el('div','rows',aside);
 for(const k of ['Pointer X:','Pointer Y:','Distance:','Angle:']){const r=u.el('div','ro',ro);u.el('span','',r,k);u.el('span','',r,'---');}
 u.el('hr','',aside);
 sec('Episode Settings');
 const settings=u.el('div','settings-rows',aside);
 for(const [k,v] of [['Instruction:',display==='panel'?'Panel':display==='toast'?'Toast':display==='hidden'?'Hidden':'Header'],['Completion:',ctx.finish?'Finish route':'End control']]){const r=u.el('div','setting-row',settings);u.el('span','',r,k);u.el('span','setting-value',r,v);}
 if(display==='panel'&&!note.hidden){note.classList.add('instruction-panel');aside.insertBefore(note,settings.nextSibling);}
 u.el('hr','',aside);
 sec('Controls');
 const ctl=u.el('div','controls',aside);
 const clr=u.el('button','clear',ctl,'Clear');clr.type='button';clr.onclick=()=>{env.widgetDef.clear?.();};
 let submit=null;
 const endButton=(parent,cls,label)=>{const b=u.el('button',cls,parent,label);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
 if(endPlacement==='controls')submit=endButton(ctl,'submit',endLabel);
 if(endPlacement==='header')submit=endButton(fh,'submit end-header',endLabel);
 // frame footer
 const ft=u.el('div','frame-foot',frame);
 const hint=u.el('span','hint',ft);u.el('i','',hint,'Follow the dashed guide.');hint.append(' Complete the circle in one continuous stroke.');
 u.el('span','zoom',ft,'Zoom: 100%');
 if(endPlacement==='footer'){
  submit=endButton(ft,'submit end-footer',endLabel);
 }
 // status bar and taskbar
 const sb=u.el('div','statusbar',shell);
 u.el('span','',sb,'Ready.');u.el('span','sp',sb);u.el('span','',sb,'Input: Mouse');u.el('span','',sb,'|');u.el('span','',sb,'Grid: Off');
 const tb=u.el('div','taskbar',shell);
 const g=u.el('span','tb-logo',tb);
 u.el('span','',tb,'Applications');u.el('span','',tb,'Places');u.el('span','',tb,'System');
 u.el('span','tb-term',tb,'>_');u.el('span','tb-win',tb,'Calibrix 1.8.3');u.el('span','sp',tb);
 const speaker=u.svg('svg',{width:24,height:24,viewBox:'0 0 24 24'},tb);u.svg('path',{d:'M2 9H6L12 4V20L6 15H2Z',fill:'#bbb'},speaker);u.svg('path',{d:'M15 7Q20 12 15 17M18 4Q26 12 18 20',fill:'none',stroke:'#aaa','stroke-width':1.5},speaker);
 u.el('span','',tb,'Mon Apr 12');u.el('span','',tb,'10:24');
 // Fit the added settings and note before the widget establishes any anchors.
 if(display==='panel'&&ctl.getBoundingClientRect().bottom>aside.getBoundingClientRect().bottom-8){
  aside.classList.add('dense-settings');
  if(ctl.getBoundingClientRect().bottom>aside.getBoundingClientRect().bottom-8){
   display='header';note.classList.remove('instruction-panel');main.insertBefore(note,stage);
   settings.querySelector('.setting-value').textContent='Header';body.classList.remove('has-instruction-panel');
  }
 }
 if(display==='header'&&note.getBoundingClientRect().bottom>stage.getBoundingClientRect().top+stage.clientHeight*.13)note.classList.add('long-instruction');
 return{stage,submit};},
 overlay(ctx){const u=ctx.util,kind=ctx.kind;
  const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';
  const box=u.el('div','obstruction-box',el);
  const bar=u.el('div','ob-bar',box);u.el('span','',bar,'Save View');
  const x=u.el('button','ob-x',bar,'×');x.type='button';
  const row=u.el('div','ob-body',box);
  const ic=u.svg('svg',{class:'ob-icon',width:48,height:48,viewBox:'0 0 48 48'},row);
  for(let j=0;j<9;j++)u.svg('rect',{x:20,y:2,width:8,height:12,transform:'rotate('+j*40+' 24 24)',fill:'#555'},ic);
  u.svg('circle',{cx:24,cy:24,r:17,fill:'#555'},ic);
  u.svg('circle',{cx:24,cy:24,r:11,fill:'#d2d0c9'},ic);
  const tx=u.el('div','ob-text',row);
  u.el('p','',tx,'Save your current view preferences?');
  u.el('p','sub',tx,'This will only save window layout,\ncolors and display options.\nIt will not submit your task.');
  const btns=u.el('div','ob-btns',box);
  const save=u.el('button','dismiss save',btns,'Save View');save.type='button';
  const dismiss=u.el('button','dismiss',btns,'Not Now');dismiss.type='button';
  const cb=u.el('label','ob-check',box);const inp=u.el('input','',cb);inp.type='checkbox';u.el('span','',cb,"Don't show this again");
  const done=()=>{if(env.timeText)env.timeText.textContent='Active';ctx.dismiss('close');};
  dismiss.onclick=done;x.onclick=done;save.onclick=()=>{env.log('save-view',{});done();};
  return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
});})();
