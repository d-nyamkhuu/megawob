(function(){'use strict';
env.site({name:"design-select-text-paragraph-11",styles:['lisa.css'],scripts:[],initialOverlay:{kind:'chat'},frame(ctx){
 const u=ctx.util,body=document.body;body.className='design lisa'+(ctx.display==='toast'?' has-instruction-toast':'');
 const sh=u.el('div','lz',body);
 // menu bar
 const mb=u.el('nav','lz-menu',sh);
 const ap=u.svg('svg',{width:24,height:26,viewBox:'0 0 24 26',class:'lz-apple'},mb);
 u.svg('path',{d:'M13 7c-3-2-7-1-9 2-3 5 0 12 3 15 2 2 4-1 6-1s4 3 6 0c2-2 3-5 3-6-5-2-5-7-1-9-3-3-6-3-8-1zM12 6c0-3 2-5 6-6 0 4-2 6-6 6z',fill:'#000'},ap);
 u.el('b','',mb,'Writer');
 for(const m of ['File','Edit','Search','Format','Style','Window','Help']){const item=u.el(m==='Edit'?'button':'span','lz-menu-item',mb,m);if(m==='Edit'){item.type='button';item.onclick=()=>env.widgetDef.clear?.();}}
 u.el('span','lz-clock',mb,'9:12 AM');
 const mi=u.el('span','lz-mi',mb,'');
 const docIcon=(parent)=>{const s=u.svg('svg',{viewBox:'0 0 30 30',fill:'none',stroke:'#111','stroke-width':1.7},parent);u.svg('path',{d:'M8 3h15l3 4v18H6V8zM8 3v5H6M11 7h9M10 11h12M10 15h12M10 19h10M3 9v18h19M6 25v3'},s);};docIcon(mi);
 const mq=u.el('span','lz-mq',mb,'?');
 // document window
 const win=u.el('section','lz-win',sh);
 const tb=u.el('div','lz-title',win);
 u.el('i','lz-close',tb);u.el('s','',tb);u.el('b','',tb,'Sample Article — Writer');u.el('s','',tb);
 const tools=u.el('div','lz-tools',win);
 const dd=(t,w)=>{const d=u.el('div','lz-dd',tools,t);d.style.width=w;u.el('em','',d,'▼');};
 dd('Times','14%');dd('12','7%');
 for(const t of ['B','I','U'])u.el('button','lz-tb lz-'+t,tools,t).type='button';
 for(let i=0;i<3;i++){const b=u.el('button','lz-tb lz-al lz-align-'+i,tools,'');b.type='button';if(i===0)b.classList.add('on');for(let k=0;k<5;k++)u.el('s','',b);}
 for(let i=0;i<2;i++){const b=u.el('button','lz-tb lz-al lz-ls',tools,'');b.type='button';for(let k=0;k<4;k++)u.el('s','',b);}
 let note=null,statusNote=null;
 const makeNote=(parent,cls,title)=>{const n=u.el('section','task-note lz-note '+cls,parent);if(title)u.el('b','lz-note-title',n,title);u.el('div','instruction',n,ctx.instruction);return n;};
 const narrow=window.innerWidth<1260;
 const display=(ctx.display==='panel'&&narrow)||(ctx.display==='toast'&&window.innerHeight<700)?'header':ctx.display;
 if(display==='header')note=makeNote(win,'','');
 else if(display==='panel')makeNote(sh,'lz-panel','Writer Help');
 else if(display==='toast'){
   statusNote=u.el('span','lz-status-note',null,ctx.instruction);
   // The notice lives in the status strip, outside the selectable document.
 }
 const stage=u.el('main','stage',win);stage.dataset.role='stage';
 const scroll=u.el('div','lz-scroll',win);u.el('span','lz-up',scroll,'');u.el('div','lz-scroll-track',scroll);u.el('span','lz-down',scroll,'');scroll.setAttribute('aria-hidden','true');
 const st=u.el('div','lz-status',win);u.el('span','',st,'Page 1 of 1');if(display==='toast')st.append(statusNote);u.el('span','lz-grip',st,'');
 // preview
 const pv=u.el('aside','lz-prev',sh);
 const pt=u.el('div','lz-ptitle',pv);u.el('i','lz-close',pt);u.el('b','',pt,'Preview');u.el('s','',pt);
 const pg=u.el('div','lz-page',pv);
 for(const g of [[100,93,94,100,76],[100,93,94,100,76],[93,100,93,94,100,28]]){const gr=u.el('div','lz-pg',pg);for(const w of g){const l=u.el('s','',gr);l.style.width=w+'%';}}
 const pf=u.el('div','lz-pfoot',pv);u.el('span','lz-zoom',pf,'');u.el('span','lz-pct',pf,'100%');u.el('span','lz-pic',pf,'');
 const zoom=u.svg('svg',{viewBox:'0 0 32 32',fill:'none',stroke:'#111','stroke-width':2.5},pf.querySelector('.lz-zoom'));u.svg('circle',{cx:12,cy:12,r:7},zoom);u.svg('path',{d:'M17 17l10 10'},zoom);docIcon(pf.querySelector('.lz-pic'));
 // trash
 const tr=u.el('div','lz-trash',sh);
 const tsv=u.svg('svg',{width:46,height:54,viewBox:'0 0 46 54',fill:'none',stroke:'#111','stroke-width':2},tr);
 u.svg('path',{d:'M7 12h32l-2 38q-14 5-28 0zM4 8q19-6 38 0v4q-19 5-38 0zM17 5V1h12v4M13 17l1 30M18 17v31M23 17v31M28 17v31M33 17l-1 30'},tsv);
 u.el('div','',tr,'Trash');
 const endRng=ctx.rng.fork('chrome/end');
 const labels=ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
 const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
 const primary=endRng.bool(.5);
 const label=primary?'Submit':labelOf(endRng.pick(labels));
 const place=primary?'dock':endRng.pick(['toolbar','status','dock']);
 const endBtn=(parent,cls)=>{const b=u.el('button','submit '+cls,parent,label);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
 let submit=null;
 const collideRng=ctx.rng.fork('chrome/collide');
 let collide=null;
 if(collideRng.bool(.3)){const pool=labels.map(labelOf).filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());if(pool.length)collide=labelOf(collideRng.pick(pool));}
 const decoy=(parent,text)=>{const b=u.el('button','lz-xtra',parent,text);b.type='button';b.dataset.role='xtra';b.onclick=()=>env.log('decoy',{label:text,collide:true});};
 if(collide)decoy(tools,collide);
 if(!ctx.finish){
   if(place==='dock')submit=endBtn(sh,'lz-submit');
   else if(place==='toolbar')submit=endBtn(tools,'lz-toolbar-end');
   else submit=endBtn(st,'lz-status-end');
 }
 return{stage,submit};},
 overlay(ctx){const u=ctx.util,kind=ctx.kind;
  const el=u.el('section','obstruction obstruction-'+kind+' lz-tour',document.body);el.dataset.role='overlay';
  const box=u.el('div','obstruction-box',el);
  const tail=u.svg('svg',{class:'lz-tail',viewBox:'0 0 38 38',fill:'#f8f6ec',stroke:'#111','stroke-width':2},box);u.svg('path',{d:'M1 0v35L36 0', 'stroke-linejoin':'round'},tail);
  const x=u.el('button','lz-x',box,'');x.type='button';
  const ic=u.svg('svg',{class:'lz-mascot',width:60,height:80,viewBox:'0 0 60 80',fill:'#fff',stroke:'#111','stroke-width':2.5},box);
  u.svg('path',{d:'M14 12L46 5q5-1 5 4l3 55q0 3-5 4l-31 7-3-6L11 19q-1-5 3-7zM14 12l5 6 3 57M13 19L9 17q-3 0-2 8l2 22M17 58l-7 1-1 10q0 5 9 3M27 73q-3 7-8 3M45 70q4 7 9 2'},ic);
  u.svg('path',{d:'M25 25q5-5 10-1M39 23q5-5 9-2M27 29q5-3 6 1q0 5-5 4M40 27q5-3 6 1q0 5-5 4M36 31l-1 9 5-1M29 43q7 6 16-5M27 50l11-2M28 56l8-1M12 43q-9-3-9 3q0 6 10 6M51 41q9-4 7 2l-5 4',fill:'none','stroke-linecap':'round'},ic);
  u.el('h3','',box,'Welcome to Writer!');
  u.el('p','',box,'Take a quick tour to see basic features like selecting text, formatting, and more.');
  const row=u.el('div','lz-btns',box);
  const dismiss=u.el('button','dismiss',row,'Skip tour');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
  const nx=u.el('button','lz-next',row,'Next');nx.type='button';nx.onclick=()=>ctx.dismiss('close');
  x.onclick=()=>ctx.dismiss('close');
  return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
});})();
