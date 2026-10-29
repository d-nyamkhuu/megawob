(function(){'use strict';const C={"title":"WebGuide","bg":"#f4f7fd","surface":"#fff","accent":"#0f3f9e","font":"Arial, Helvetica, sans-serif"};
const CATS=['Arts & Humanities','Business & Economy','Computers & Internet','Education','Entertainment','Health & Fitness','News & Media','Recreation & Sports','Reference','Regional','Science','Society & Culture','Travel'];
const FEAT=["Today's Picks",'New Sites','Most Popular',"Editor's Choice"];
const POP=[['Amazon.com','CNN','Disney','eBay','Excite','GeoCities'],['Lycos','Microsoft','NBC','Netflix','Newsweek','RealAudio'],['Reuters','SportsLine','TripAdvisor','USA Today','Yahoo!','ZDNet']];
const DETAILS=[['Keep the top-left corner in the','same position.'],['Resize using the bottom-right handle','only.'],['The dashed outline shows the','target size.']];
env.site({name:"design-resize-element-ghost-10",styles:['site.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;body.className='design webguide mode-'+ctx.display+(ctx.display==='toast'?' has-instruction-toast':'');
 const root=document.documentElement;for(const [k,v]of Object.entries({bg:C.bg,panel:C.surface,fg:'#111',muted:'#555',line:'#c9d3e6',accent:C.accent}))root.style.setProperty('--'+k,v);root.style.setProperty('--font',C.font);
 const shell=u.el('div','shell',body);
 const head=u.el('header','head',shell);
 const logo=u.el('div','logo',head);u.el('span','w1',logo,'Web');u.el('span','w2',logo,'Guide');
 u.el('div','tagline',head,'Your Guide to the Internet');
 u.el('span','find-label',head,'Find It Fast:');u.el('div','find-input',head);
 const sb=u.el('button','find-btn',head,'Search');sb.type='button';sb.onclick=()=>env.log('search');
 const hl=u.el('div','head-links',head);['Help','Site Map','Contact Us'].forEach((t,i)=>{if(i)u.el('span','sep',hl,'|');const a=u.el('a','',hl,t);a.href='#';a.onclick=(e)=>e.preventDefault();});
 u.el('div','rule',shell);
 const side=u.el('nav','cats',shell);u.el('div','strip',side,'Browse by Category');
 const l1=u.el('ul','',side);for(const t of CATS){const li=u.el('li','',l1);const a=u.el('a','',li,t);a.href='#';a.onclick=(e)=>e.preventDefault();}
 const sf=u.el('nav','feats',shell);u.el('div','strip',sf,'Special Features');
 const l2=u.el('ul','',sf);for(const t of FEAT){const li=u.el('li','',l2);const a=u.el('a','',li,t);a.href='#';a.onclick=(e)=>e.preventDefault();}
 u.el('h1','welcome',shell,'Welcome to WebGuide');u.el('div','welcome-sub',shell,'A Directory of the Best Sites on the Web');u.el('div','rule2',shell);
 const pop=u.el('section','popular',shell);u.el('div','strip',pop,'Popular Links');
 const cols=u.el('div','pop-cols',pop);for(const col of POP){const ul=u.el('ul','',cols);for(const t of col){const li=u.el('li','',ul);const a=u.el('a','',li,t);a.href='#';a.onclick=(e)=>e.preventDefault();}}
 u.el('div','right-bg',shell);
 u.el('div','task-head',shell,ctx.display==='hidden'?'Directory Help':'Your Task');
 const content=u.el('div','content',shell),note=u.el('section','task-note',content);u.el('div','note-label',note,'');
 const instruction=u.el('div','instruction',note,ctx.instruction);
 if(ctx.display==='hidden')note.hidden=true;else if(ctx.display==='toast'){note.classList.add('instruction-toast');const x=u.el('button','note-close',note,'×');x.onclick=()=>note.style.visibility='hidden';}else if(ctx.display==='panel')note.classList.add('instruction-panel');
 const aside=u.el('aside','aside',shell);u.el('h3','',aside,'Details:');const ul=u.el('ul','',aside);for(const lines of DETAILS){const li=u.el('li','',ul);for(const t of lines)u.el('span','detail-line',li,t);}
 const stage=u.el('main','stage',content);stage.dataset.role='stage';
 const footer=u.el('footer','footer',shell);let submit=null;
 const endR=ctx.rng.fork('chrome/end');
 const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
 const endWords=ctx.content.END_LABELS.map(labelOf);
 const placement=endR.pick(['reference','reference','toolbar','link']);
 const endLabel=placement==='reference'?(endWords.find(t=>t==='Submit')||endWords[0]):endR.pick(endWords);
 if(!ctx.finish){
   footer.classList.add('end-'+placement);
   submit=u.el(placement==='link'?'a':'button','submit',footer,endLabel);
   if(placement==='link')submit.href='#';else submit.type='button';
   submit.dataset.role='submit';submit.title=endLabel;submit.setAttribute('aria-label',endLabel);
   submit.onclick=e=>{e.preventDefault();ctx.submit();};
 }else footer.hidden=true;
 const collideR=ctx.rng.fork('chrome/collide');
 if(collideR.bool(.3)){
   const options=[...new Set(endWords)].filter(t=>t.trim().toLowerCase()!==endLabel.trim().toLowerCase());
   if(options.length){
     const label=collideR.pick(options),tools=u.el('div','directory-tools',shell);
     const decoy=u.el('button','directory-xtra',tools,label);decoy.type='button';decoy.dataset.role='xtra';
     decoy.onclick=()=>env.log('decoy',{label,collide:true});
   }
 }
 if(ctx.display!=='hidden'&&ctx.display!=='toast'){
   const style=getComputedStyle(note),textStyle=getComputedStyle(instruction);
   const available=note.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
   const original=parseFloat(textStyle.fontSize);let font=original;
   while(available>0&&instruction.scrollHeight>available+1&&font>original*.65){
     font-=original*.025;instruction.style.fontSize=font+'px';instruction.style.lineHeight=(font*1.25)+'px';
   }
 }
 return{stage,submit};},
 overlay(ctx){const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
 const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'WebGuide update',banner:'Service notice'}[kind];
 const text={cookie:'This site stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand finding a site?',promo:'Explore the latest additions to the directory.',banner:'You are viewing a shared directory.'}[kind];
 const label=kind==='cookie'?'Reject optional':'Close';
 u.el('h3','',box,title);u.el('p','',box,text);
 const dismiss=u.el('button','dismiss',box,label);dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
 if(kind==='cookie'){const accept=u.el('button','dismiss',box,'Accept optional');accept.onclick=()=>ctx.dismiss('accept');}
 return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
});})();
