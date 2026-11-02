(function(){'use strict';
 const palette={bg:'#fff',panel:'#fff',fg:'#2b3440',muted:'#7a838f',line:'#e1e5ea'};
 const parts={
 'frame.layout':base=>(_c)=>{base(_c);_c.display=_c.ctx.display||'header';},
 'frame.placement':base=>(_c)=>{base(_c);_c.nav=false;_c.sidebar=false;_c.wantFooter=true;},
 'frame.header':()=> (_c)=>{
  const u=_c.util;document.body.className='design ws'+(_c.display==='toast'?' has-instruction-toast':'');
  const app=u.el('div','app',document.body),work=u.el('section','work',app);
  const header=u.el('div','task-slot',work);header.hidden=_c.display==='hidden';
  Object.assign(_c,{app,work,header});
 },
 'frame.nav':()=>()=>{},
 'frame.instruction':base=>(_c)=>{base(_c);},
 'frame.body':()=> (_c)=>{
  const u=_c.util,ins=u.el('aside','inspector',_c.app);
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
  ins.appendChild(_c.headerTools);
  u.el('div','spacer',ins);
  Object.assign(_c,{body:_c.work,ins});
 },
 'frame.tools':base=>(_c)=>{const h=_c.header;_c.header=_c.util.el('div','top-actions');base(_c);_c.header=h;},
 'frame.panel':base=>(_c)=>{base({..._c,body:_c.header});},
 'frame.stage':()=> (_c)=>{_c.stage=_c.util.el('main','stage',_c.work);_c.stage.dataset.role='stage';},
 'frame.toast':base=>(_c)=>{base(_c);const note=document.body.querySelector('.ref-note');if(note)_c.header.appendChild(note);},
 'frame.footer':base=>(_c)=>{base(_c);const foot=document.body.querySelector('.ref-foot');if(foot)_c.ins.appendChild(foot);_c.foot=foot;},
 'frame.floating':base=>(_c)=>{base(_c);const dock=document.body.querySelector('.ref-float-dock');if(dock)_c.ins.appendChild(dock);},
 overlay:()=> (ctx)=>{const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
 const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind];
 const text={cookie:'This application stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this workspace?',promo:'Explore the latest workspace features.',banner:'You are viewing a shared workspace.'}[kind];
 u.el('h3','',box,title);u.el('p','',box,text);
 const dismiss=u.el('button','dismiss',box,kind==='cookie'?'Reject optional':'Close');dismiss.type='button';
 dismiss.onclick=()=>ctx.dismiss('close');
 if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
 return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
 };
 env.site({name:'design-draw-shape-trace-12',template:'site/base',langs:['en'],styles:['templates/site/css/base-hooks.css','ws.css','site.css'],design:{THEMES:{'design-draw-shape-trace-12':palette},LOW_THEME:palette,ACCENTS:['#55b995'],LOW_ACCENTS:['#55b995'],parts}});
})();
