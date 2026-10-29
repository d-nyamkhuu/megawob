(function () {
  'use strict';
  const C = {site:'design-find-fact-table-02', brand:'GeoData Studio 2.4  -  Research Table'};
  const icons = [
    '<path d="M6 3v22l6-6 5 9 4-2-5-9h9z"/>',
    '<rect x="5" y="5" width="22" height="22"/>',
    '<circle cx="16" cy="16" r="12"/>',
    '<path d="M4 28 28 4m-8 1 8-1-1 8"/>',
    '<circle cx="16" cy="16" r="5"/><path d="M16 2v9m0 10v9M2 16h9m10 0h9"/>',
    '<path d="M3 16h26m-2-5v10M4 14v4"/>',
    '<path d="M7 4v24m-3-24h6M4 28h6M23 4v24m-3-24h6m-6 24h6"/>',
    '<rect x="3" y="6" width="26" height="20" rx="2"/><path d="m12 11-5 5 5 5m8-10 5 5-5 5M17 9l-3 14"/>',
    '<path d="m4 5 24 24H4L28 5M4 5h5m14 0h5"/>',
    '<rect x="4" y="5" width="24" height="23"/><path d="M16 9v15m-6-10h12M1 5h5m20 0h5M1 28h5m20 0h5"/>',
    '<path d="M3 4v24M29 4v24M5 13h22m-20-4-4 4 4 4m18-8 4 4-4 4M16 17v8m-4-4h8"/>',
    '<path d="M6 5h20M3 15h26M9 25h15M12 2v8m10-8v8M9 12l-4 8m20-8-4 8M16 18l-3 11"/>'
  ];
  env.site({name:C.site,styles:['site.css'],scripts:[],frame(ctx) {
    const u=ctx.util;
    if(document.activeElement && document.activeElement!==document.body) document.activeElement.blur();
    const selection=window.getSelection(); if(selection) selection.removeAllRanges();
    const title=u.el('header','ds-top',document.body);
    u.el('span','ds-logo',title,'⌖');u.el('span','ds-brand',title,C.brand);
    const controls=u.el('div','ds-window-controls',title);
    ['—','□','×'].forEach(t=>u.el('span','',controls,t));
    const menu=u.el('nav','ds-menu',document.body);
    ['File','Edit','View','Insert','Tools','Analyze','Window','Help'].forEach(t=>u.el('span','',menu,t));
    const tools=u.el('div','ds-tools',document.body);
    icons.forEach((svg,i)=>{
      const item=u.el('span','ds-tool'+([0,3,5,7,10,11].includes(i)?' ds-tool-end':''),tools);
      item.innerHTML='<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.25">'+svg+'</svg>';
    });
    ['Snap','Grid','1 px'].forEach(t=>{const item=u.el('span','ds-tool-option',tools,t);u.el('i','',item);});
    let submit=null;
    const endRng=ctx.rng.fork('chrome/end');
    const endLabels=(ctx.content&&Array.isArray(ctx.content.END_LABELS)?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply']).map(x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x));
    const placement=ctx.finish?null:(endRng.bool(0.5)?'sheet':endRng.pick(['toolbar','footer']));
    const label=placement==='sheet'?'Submit':(endRng.pick(endLabels)||'Done');
    const decoyBtn=(parent,text,collide)=>{
      const b=u.el('button','ds-chrome-xtra'+(collide?' ds-chrome-pq':''),parent,text);b.type='button';b.dataset.role='xtra';
      b.addEventListener('click',()=>env.log('decoy',collide?{label:text,collide:true}:{label:text}));
      return b;
    };
    const endBtn=(parent,cls,text)=>{
      const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;
      b.addEventListener('click',()=>ctx.submit());return b;
    };
    const collideRng=ctx.rng.fork('chrome/collide');
    let collide=null;
    if(!ctx.finish&&collideRng.bool(0.3)){
      const options=[...new Set(endLabels)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
      if(options.length)collide={text:collideRng.pick(options),where:collideRng.pick(['toolbar','toolbar','footer'])};
    }
    const toolAction=u.el('div','ds-chrome-actions',tools);
    if(collide&&collide.where==='toolbar')decoyBtn(toolAction,collide.text,true);
    if(placement==='toolbar')submit=endBtn(toolAction,'ds-chrome-submit',label);
    u.el('span','ds-coordinates',tools,'X: 482.000   Y: 176.000   Z: 0.000');
    const body=u.el('div','ds-body',document.body);
    const index=u.el('aside','ds-index',body);
    for(let i=1;i<=24;i++)u.el('div',i===4?'selected':'',index,String(i).padStart(2,'0'));
    const sheet=u.el('div','ds-content',body);
    const mode=ctx.display;
    if(mode==='panel') sheet.classList.add('ds-has-panel');
    if(mode!=='hidden') {
      const note=u.el('aside','ds-header-note'+(mode==='panel'?' ds-panel-note':mode==='toast'?' ds-toast-note':''),sheet);
      u.el('div','ds-instruction',note,ctx.instruction);
    } else sheet.classList.add('ds-hidden-note');
    const stage=u.el('main','ds-stage',sheet);
    if(placement==='sheet')submit=endBtn(sheet,'ds-submit',label);
    const foot=u.el('footer','ds-footer',document.body);
    u.el('span','ds-ready',foot,'Ready');
    const footActions=u.el('div','ds-footer-actions',foot);
    if(collide&&collide.where==='footer')decoyBtn(footActions,collide.text,true);
    if(placement==='footer')submit=endBtn(footActions,'ds-submit ds-footer-submit',label);
    ['ORTHO','SNAP','GRID','1:1'].forEach(t=>u.el('span','ds-status',foot,t));
    return {stage,submit};
  },overlay(ctx) {
    const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
    const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
    u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
    dismiss.addEventListener('click',()=>ctx.dismiss('close'));
    return {el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
  }});
})();
