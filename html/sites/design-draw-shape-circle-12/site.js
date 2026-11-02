(function () {
'use strict';
const palette = { bg:'#d8d6d0', panel:'#e4e2dc', fg:'#111', muted:'#555', line:'#b9b6ae' };
const parts = {
 'frame.layout': (base) => (_c) => {
  base(_c);
  // Preserve this workstation's compact-mode thresholds.
  const compact = _c.W < 1200 || _c.H < 760;
  _c.display = (_c.ctx.display === 'panel' && compact) || (_c.ctx.display === 'toast' && _c.H < 700) ? 'header' : (_c.ctx.display || 'header');
 },
 'frame.placement': (base) => (_c) => {
  base(_c);
  _c.nav = false; _c.sidebar = false; _c.wantFooter = true;
 },
 'frame.header': () => (_c) => {
  const {util:u,ctx,display} = _c;
  const body=document.body;
  body.className='design linux layout-linux';
  body.classList.toggle('has-instruction-toast',display==='toast');
  body.classList.toggle('has-instruction-panel',display==='panel');
  document.documentElement.style.setProperty('--font','"DejaVu Sans Mono","Liberation Mono","Courier New",monospace');
  const shell=u.el('div','shell',body);
  const head=u.el('header','head',shell);
  const ic=u.svg('svg',{class:'app-icon',width:26,height:26,viewBox:'0 0 26 26'},head);
  u.svg('path',{d:'M10 1H15L16 5L19 6L22 4L25 9L22 12V15L26 17L23 22L19 21L16 23L15 26H10L9 22L6 20L2 22L0 17L4 14V11L1 9L4 4L8 5Z',fill:'#c7c3bd',stroke:'#888','stroke-width':.6},ic);
  u.svg('circle',{cx:13,cy:13,r:5.5,fill:'#64101c',stroke:'#bdbbb5','stroke-width':2},ic);
  u.el('div','title',head,'Calibrix 1.8.3  - Pointer Calibration Utility');
  const wc=u.el('div','window-controls',head);
  for(const label of ['_','□','×']){const bt=u.el('button','',wc,label);bt.type='button';bt.onclick=()=>env.log('window-control',{label});}
  Object.assign(_c,{shell});
 },
 'frame.nav': () => (_c) => {
  const {util:u,shell,display,ctx}=_c;
  const menu=u.el('nav','menu',shell);
  for(const m of ['File','View','Tools','Help'])u.el('span','',menu,m);
  const frame=u.el('div','frame',shell);
  const fh=u.el('div','frame-head',frame);
  u.el('span','frame-title',fh,'Calibration Task');
  u.el('span','frame-rule',fh);
  u.el('span','frame-meta',fh,'Mode: Pointer Trace');
  u.el('span','frame-sep',fh,'|');
  u.el('span','frame-meta',fh,'Profile: default');
  const content=u.el('div','content',frame);
  const main=u.el('div','main',content);
  const header=u.el('section','task-note',main);
  header.hidden=display!=='header';
  const aside=u.el('aside','aside',content);
  const sec=(t)=>{const h=u.el('div','sec-head',aside);u.el('span','',h,t);u.el('i','',h);};
  sec('Task Info');
  const info=u.el('div','rows',aside);
  for(const [k,v] of [['Tool:','Pointer'],['Input:','Mouse'],['Status:','Not started']]){const r=u.el('div','info-row',info);u.el('span','',r,k);u.el('span','',r,v);}
  const tr=u.el('div','info-row',info);u.el('span','',tr,'Time:');env.timeText=u.el('span','',tr,'Paused');
  u.el('hr','',aside);
  sec('Live Readout');
  const ro=u.el('div','rows',aside);
  for(const k of ['Pointer X:','Pointer Y:','Distance:','Angle:']){const r=u.el('div','ro',ro);u.el('span','',r,k);u.el('span','',r,'---');}
  u.el('hr','',aside);
  sec('Episode Settings');
  const settings=u.el('div','settings-rows',aside);
  for(const [k,v] of [['Instruction:',display==='panel'?'Panel':display==='toast'?'Toast':display==='hidden'?'Hidden':'Header'],['Completion:',ctx.finish?'Finish route':'End control']]){const r=u.el('div','setting-row',settings);u.el('span','',r,k);u.el('span','setting-value',r,v);}
  const panelSlot=u.el('div','panel-slot',aside);
  u.el('hr','',aside);
  sec('Controls');
  const ctl=u.el('div','controls',aside);
  const clr=u.el('button','clear',ctl,'Clear');clr.type='button';clr.onclick=()=>{env.widgetDef.clear?.();};
  Object.assign(_c,{frame,content,main,aside,header,toolbar:ctl,panelSlot});
 },
 'frame.instruction': (base) => (_c) => {
  base(_c);
  const note=_c.header.querySelector('.ref-instruction');
  if(note){note.classList.add('instruction');note.dataset.display='header';if(_c.ctx.instruction.length>85)_c.header.classList.add('long-instruction');}
 },
 'frame.tools': (base) => (_c) => {
  const h=_c.header;_c.header=_c.toolbar;base(_c);_c.header=h;
 },
 'frame.body': () => (_c) => { _c.body=_c.content; },
 'frame.panel': (base) => (_c) => {
  const body=_c.body;_c.body=_c.panelSlot;base(_c);_c.body=body;
  const panel=_c.panelSlot.querySelector('.ref-panel');
  if(panel){panel.classList.add('task-note','instruction-panel');const text=panel.querySelector('.ref-panel-text');text.classList.add('instruction');text.dataset.display='panel';_c.aside.classList.add('dense-settings');}
 },
 'frame.stage': () => (_c) => {
  const stage=_c.util.el('main','stage',_c.main);stage.dataset.role='stage';_c.stage=stage;
  const note=_c.header;
  if(_c.display==='header'&&note.getBoundingClientRect().bottom>stage.getBoundingClientRect().top+stage.clientHeight*.13)note.classList.add('long-instruction');
 },
 'frame.toast': (base) => (_c) => {
  base(_c);
  const note=document.body.querySelector('.ref-note');
  if(note){note.classList.add('task-note','instruction-toast');const text=note.querySelector('.ref-note-text');text.classList.add('instruction');text.dataset.display='toast';note.querySelector('.ref-note-x').classList.add('note-close');_c.main.appendChild(note);}
 },
 'frame.footer': (base) => (_c) => {
  const {util:u,shell}=_c;
  const ft=u.el('div','frame-foot',_c.frame);
  u.el('span','hint',ft,'Pointer calibration workspace.');
  u.el('span','zoom',ft,'Zoom: 100%');
  const sb=u.el('div','statusbar',shell);
  u.el('span','',sb,'Ready.');u.el('span','sp',sb);u.el('span','',sb,'Input: Mouse');u.el('span','',sb,'|');u.el('span','',sb,'Grid: Off');
  base(_c);
  const foot=document.body.querySelector('.ref-foot');
  if(foot){foot.querySelector('.ref-foot-text').hidden=true;ft.appendChild(foot);}
  const tb=u.el('div','taskbar',shell);
  u.el('span','tb-logo',tb);
  u.el('span','',tb,'Applications');u.el('span','',tb,'Places');u.el('span','',tb,'System');
  u.el('span','tb-term',tb,'>_');u.el('span','tb-win',tb,'Calibrix 1.8.3');u.el('span','sp',tb);
  const speaker=u.svg('svg',{width:24,height:24,viewBox:'0 0 24 24'},tb);u.svg('path',{d:'M2 9H6L12 4V20L6 15H2Z',fill:'#bbb'},speaker);u.svg('path',{d:'M15 7Q20 12 15 17M18 4Q26 12 18 20',fill:'none',stroke:'#aaa','stroke-width':1.5},speaker);
  u.el('span','',tb,'Mon Apr 12');u.el('span','',tb,'10:24');
  _c.frameFoot=ft;
 },
 'frame.floating': (base) => (_c) => {
  base(_c);
  const dock=document.body.querySelector('.ref-float-dock');
  if(dock)_c.frameFoot.appendChild(dock);
 },
 overlay: () => (ctx) => {
  const u=ctx.util,kind=ctx.kind;
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
  return{el,dismiss,ttlSteps:kind==='toast'?5:0};
 }
};
env.site({name:'design-draw-shape-circle-12',template:'site/base',langs:['en'],styles:['templates/site/css/base-hooks.css','site.css','ref.css'],design:{THEMES:{'design-draw-shape-circle-12':palette},LOW_THEME:palette,ACCENTS:['#6b0f1e'],LOW_ACCENTS:['#6b0f1e'],parts}});
})();
