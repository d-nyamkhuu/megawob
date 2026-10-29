(function () {
  'use strict';
  const palette={bg:'#052957',panel:'#e5e1d6',fg:'#111111',muted:'#5b574d',line:'#77756f',accent:'#d3b24d'};
  const paths={
    folder:'<defs><linearGradient id="ws-folder" x2="0" y2="1"><stop stop-color="#fff1a4"/><stop offset="1" stop-color="#d3ac39"/></linearGradient></defs><path d="M3 9V5h13l4 4h18v27H3z" fill="#e2c259" stroke="#28291e" stroke-width="1.8"/><path d="M3 12h35v24H3z" fill="url(#ws-folder)" stroke="#28291e" stroke-width="1.8"/><path d="M5 14h31M5 33V15" stroke="#fff6c6"/>',
    document:'<defs><linearGradient id="ws-paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d5e6ed"/></linearGradient></defs><path d="M9 2h22l8 8v30H9z" fill="url(#ws-paper)" stroke="#182b4e" stroke-width="1.4"/><path d="M31 2v9h8M15 18h18M15 22h18M15 26h18M15 30h18M15 34h18" fill="none" stroke="#548baf"/><rect x="2" y="8" width="20" height="22" fill="#fff" stroke="#13328c" stroke-width="1.4"/><text x="3" y="25" fill="#143fa4" font-size="21" font-family="Times New Roman" font-weight="bold">W</text>',
    write:'<path d="M9 3h22l7 7v30H9z" fill="#f8faf8" stroke="#182b4e" stroke-width="1.8"/><path d="M31 3v8h7M14 14h18M14 18h18M14 22h18M14 26h18M14 30h18M14 34h18" fill="none" stroke="#4d687d"/><path d="M5 6h3v32H5" fill="#ccd4d5" stroke="#333"/>',
    calendar:'<rect x="4" y="7" width="34" height="32" fill="#f9f9f5" stroke="#121e38" stroke-width="1.8"/><path d="M5 8h32v8H5" fill="#25458d"/><path d="M10 3v9M31 3v9" stroke="#b80e12" stroke-width="4"/><g fill="#17223a"><path d="M10 20h3v3h-3zM18 20h3v3h-3zM26 20h3v3h-3zM10 27h3v3h-3zM18 27h3v3h-3zM26 27h3v3h-3zM10 34h3v3h-3zM18 34h3v3h-3zM26 34h3v3h-3z"/></g>',
    shell:'<path d="M2 7h38v29H2z" fill="#b9bec7" stroke="#121721" stroke-width="2"/><path d="M5 10h32v22H5z" fill="#080a0a" stroke="#fff"/><path d="M10 16l5 4-5 4M19 25h7" fill="none" stroke="#fff" stroke-width="2"/>',
    gear:'<g fill="#c7cfda" stroke="#161d2c" stroke-width="1.4"><path d="M17 2l3 6 5-2 4 5-4 5 3 4-4 6-6-2-4 4-5-4 1-6-5-3 2-6 6 1z"/><circle cx="16" cy="15" r="5" fill="#36517a"/><path d="M31 21l3 3 4-1 3 5-3 4 1 5-5 3-4-3-5 1-3-5 3-4-1-5z"/><circle cx="32" cy="31" r="4" fill="#36517a"/></g>'
  };
  function icon(u,kind,parent,cls){const box=u.el('span','workspace-icon '+(cls||''),parent);box.innerHTML='<svg viewBox="0 0 42 42" aria-hidden="true">'+(paths[kind]||paths.document)+'</svg>';return box;}
  const frame=(base,S)=>function(ctx){
    const u=ctx.util,root=document.documentElement;
    for(const [k,v] of Object.entries(palette))root.style.setProperty('--'+k,v);
    root.dataset.theme='warm';
    const compact=root.clientWidth<1180;
    const display=((ctx.display==='panel'&&compact)||(ctx.display==='toast'&&root.clientHeight<700))?'header':ctx.display;
    document.body.className='workspace instruction-'+display+(ctx.finish?' finish-mode':'');
    const shell=u.el('div','site-shell',document.body);
    const titlebar=u.el('div','window-titlebar',shell);
    const titleTools=u.el('div','title-tools',titlebar);
    const controls=u.el('div','window-controls',titlebar);
    ['−','□','×'].forEach(mark=>u.el('span','window-control',controls,mark));
    const win=u.el('div','workspace-window',shell);
    const mast=u.el('header','masthead',win);
    const brand=u.el('div','brand-group',mast);
    const logo=u.el('span','brand-mark',brand);
    logo.innerHTML='<svg viewBox="0 0 90 90" aria-hidden="true"><defs><radialGradient id="ws-globe" cx=".32" cy=".25"><stop stop-color="#b8ffff"/><stop offset=".45" stop-color="#2a9bb4"/><stop offset="1" stop-color="#082648"/></radialGradient><radialGradient id="ws-disc"><stop stop-color="#252726"/><stop offset=".2" stop-color="#e2dfb5"/><stop offset=".5" stop-color="#b7c0b9"/><stop offset=".8" stop-color="#eef2df"/><stop offset="1" stop-color="#667d82"/></radialGradient></defs><ellipse cx="44" cy="47" rx="38" ry="38" fill="#031123"/><circle cx="42" cy="41" r="35" fill="url(#ws-globe)" stroke="#537e9d" stroke-width="2"/><path d="M19 18l9-7 9 2 3 8-7 5-1 10-9 3-4-9-8-1M47 8l13 5 8 10-8 5-2 10-10-3-3-10 4-8M23 47l11-4 9 8-1 9-8 16-7-8 1-11M56 45l13 4 1 10-13 3-3-9" fill="#86b65c" stroke="#b8d26b" stroke-width="1"/><path d="M9 39h65M15 20c20 12 37 12 52 0M15 63c20-12 37-12 52 0M42 7c-22 18-22 51 0 68M42 7c22 18 22 51 0 68" fill="none" stroke="#a4c8ca" stroke-opacity=".35"/><circle cx="64" cy="65" r="23" fill="url(#ws-disc)" stroke="#151c24" stroke-width="2"/><path d="M47 51l11 10-4 22M74 45L66 59l19 9" fill="#fff" opacity=".3"/><circle cx="64" cy="65" r="8" fill="#6e786e" stroke="#d4dcc7" stroke-width="2"/><circle cx="64" cy="65" r="4" fill="#102039"/></svg>';
    const brandName=u.el('div','brand-name',brand);
    const brandRng=ctx.rng.fork('chrome/brand');
    S.frameBrand({display:'hidden',nav:true,rng:brandRng,lr:brandRng,util:u,word:null},brandName);
    const quick=u.el('nav','quick-nav',mast);
    const apps=[['folder','Files'],['write','Write'],['calendar','Schedule'],['shell','Shell'],['gear','Preferences']];
    for(const [kind,label]of apps){const item=u.el('div','quick-item'+(label==='Files'?' active':''),quick);icon(u,kind,item,'quick-icon');u.el('span','',item,label);}
    if(display==='header'){const note=u.el('div','header-note',mast);note.dataset.role='instruction';icon(u,'write',note,'note-icon');u.el('div','note-copy',note,ctx.instruction);}
    const tabs=u.el('nav','app-tabs',win);
    for(const [kind,label]of apps){const tab=u.el('div','app-tab'+(label==='Files'?' active':''),tabs);icon(u,kind,tab,'tab-icon');u.el('span','',tab,label);}
    const body=u.el('div','work-area',win);
    S.frameSidebar({sidebar:false,util:u},body);
    const sheet=u.el('section','browser-sheet',body);
    const columns=u.el('div','browser-columns',sheet);
    for(const label of ['Name','Size','Type','Modified'])u.el('span','column-'+label.toLowerCase(),columns,label);
    const stage=u.el('main','stage ref-stage',sheet);
    stage.dataset.role='stage';
    const alignRng=ctx.rng.fork('chrome/align');
    S.frameAlign({rng:alignRng},stage);
    if(display==='panel'){const note=u.el('aside','task-note',body);note.dataset.role='instruction';u.el('div','task-note-title',note,'Your Task');icon(u,'write',note,'panel-note-icon');u.el('p','',note,ctx.instruction);}
    const inspector=u.el('section','inspector',win);
    icon(u,'document',inspector,'inspector-icon');
    const summary=u.el('div','inspector-summary',inspector);
    u.el('strong','inspector-name',summary,'File properties');
    u.el('div','inspector-type',summary,'Nothing selected');
    const details=u.el('div','inspector-details',inspector);
    const values={};
    for(const label of ['Size','Modified','Location']){const row=u.el('div','detail-row',details);u.el('span','detail-label',row,label+':');values[label]=u.el('span','detail-value',row,label==='Location'?'C:\\Documents':'—');}
    if(display==='toast'){const note=u.el('aside','task-toast',inspector);note.dataset.role='instruction';u.el('span','notification-icon',note,'i');u.el('div','',note,ctx.instruction);const x=u.el('button','note-close',note,'×');x.type='button';x.setAttribute('aria-label','Dismiss notification');x.addEventListener('click',()=>{note.hidden=true;env.log('note-close');});}
    let submit=null;
    if(!ctx.finish){
      const footer=u.el('footer','workspace-footer',win);
      u.el('span','status-text',footer,'Ready');
      const actions=u.el('div','footer-actions',footer);
      const r=ctx.rng.fork('chrome/end');
      const placement=r.pick(['footer','footer','header','link']);
      const vals=ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
      const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x));
      const label=placement==='footer'?'Finish':labelOf(r.pick(vals));
      const {collide}=S.frameCollide({content:ctx.content,rng:ctx.rng,word:null},label);
      if(collide){const b=u.el('button','ref-xtra',actions,collide.text);b.type='button';b.dataset.role='xtra';b.addEventListener('click',()=>env.log('decoy',{label:collide.text,collide:true}));}
      submit=u.el(placement==='link'?'a':'button','end-control '+(placement==='header'?'header-end':placement==='link'?'footer-link':'footer-end'),placement==='header'?titleTools:actions,label);
      submit.dataset.role='submit';submit.title=label;submit.setAttribute('aria-label',label);
      if(placement==='link')submit.href='#';else submit.type='button';
      submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
    }
    return {stage,submit};
  };
  const overlay=(base,S)=>function(ctx){
    const u=ctx.util;
    const el=u.el('section','reference-overlay '+ctx.kind,document.body);el.dataset.role='overlay';el.setAttribute('role','dialog');
    const bar=u.el('div','overlay-titlebar',el,ctx.kind==='promo'?'WorkSpace Newsletter':ctx.kind==='cookie'?'WorkSpace Privacy':'WorkSpace');
    const x=u.el('button','overlay-x',bar,'×');x.type='button';x.setAttribute('aria-label','Close');x.addEventListener('click',()=>ctx.dismiss());
    const box=u.el('div','overlay-body',el);
    u.el('h2','',box,ctx.kind==='promo'?'Stay in the loop!':ctx.kind==='cookie'?'Your privacy settings':'Workspace notice');
    u.el('p','',box,ctx.kind==='promo'?'Get product updates, tips and resources in your inbox.':ctx.kind==='cookie'?'Choose whether to allow optional cookies for this workspace.':'Your workspace is ready. You can continue working.');
    if(ctx.kind==='promo'){const label=u.el('label','newsletter-email',box,'Email address:');const input=u.el('input','',label);input.type='text';input.setAttribute('aria-label','Email address');const consent=u.el('label','newsletter-consent',box);const checkbox=u.el('input','',consent);checkbox.type='checkbox';consent.append(' Send me WorkSpace news and offers');}
    const buttons=u.el('div','overlay-actions',box);
    if(ctx.kind==='promo'){const sub=u.el('button','overlay-primary',buttons,'Subscribe');sub.type='button';sub.addEventListener('click',()=>env.log('overlay-click',{label:'Subscribe'}));}
    if(ctx.kind==='cookie'){const allow=u.el('button','',buttons,'Accept all');allow.type='button';allow.addEventListener('click',()=>ctx.dismiss('accept'));}
    const dismiss=u.el('button','',buttons,ctx.kind==='promo'?'No thanks':ctx.kind==='cookie'?'Reject optional':'Close');dismiss.type='button';dismiss.addEventListener('click',()=>ctx.dismiss(ctx.kind==='cookie'?'reject':'close'));
    return {el,dismiss};
  };
  env.site({name:'design-use-desktop-tools-move-05',template:'site/base',styles:['site.css'],design:{TITLES:['WorkSpace'],LANGS:['en'],THEMES:{warm:palette},LOW_THEME:palette,ACCENTS:['#d3b24d'],LOW_ACCENTS:['#d3b24d'],parts:{frame,overlay}}});
})();
