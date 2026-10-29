(function(){'use strict';
const C={site:'design-act-in-time-search-02'};
env.site({name:C.site,styles:['site.css'],scripts:[],frame(ctx){
  if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
  const selection=window.getSelection();if(selection)selection.removeAllRanges();
  const u=ctx.util;
  const win=u.el('div','irix-window',document.body);
  const top=u.el('header','irix-titlebar',win);
  u.el('span','irix-system-icon',top,'⌘');
  u.el('span','irix-title',top,'Product Catalog');
  const controls=u.el('div','irix-window-controls',top);
  ['−','□','×'].forEach(t=>{const b=u.el('button','',controls,t);b.type='button';});
  let submit=null,placement='toolbar',label='Done';
  const makeSubmit=(parent,cls)=>{const b=u.el('button',cls,parent);b.textContent=label;b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.addEventListener('click',()=>ctx.submit());return b;};
  let decoy=null;
  if(!ctx.finish){
    const fallback=['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
    const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:fallback;
    const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
    const er=ctx.rng.fork('chrome/end');const original=er.bool(.5);
    label=original?'Done':labelOf(er.pick(labels));placement=original?'toolbar':er.pick(['toolbar','footer','link']);
    const cr=ctx.rng.fork('chrome/collide');if(cr.bool(.3)){const pool=labels.map(labelOf).filter(x=>String(x).trim().toLowerCase()!==label.trim().toLowerCase());if(pool.length)decoy=String(cr.pick(pool));}
    if(placement==='toolbar'){
      if(decoy){const d=u.el('button','irix-button irix-xtra',controls,decoy);d.type='button';d.dataset.role='xtra';d.addEventListener('click',()=>env.log('decoy',{label:d.textContent,collide:true}));}
      submit=makeSubmit(controls,'irix-button irix-done');
    }
  }
  const frame=u.el('div','irix-frame',win);
  const banner=u.el('section','irix-banner',frame);
  u.el('div','irix-banner-photo irix-left-photo',banner);
  const brand=u.el('div','irix-brand',banner);u.el('div','irix-wordmark',brand,'Summit Gear');u.el('div','irix-subtitle',brand,'OUTDOOR EQUIPMENT');
  u.el('div','irix-mountain-art',banner);
  u.el('div','irix-slogan',banner,'GEAR FOR\nA HIGHER VIEW');
  u.el('div','irix-banner-photo irix-right-photo',banner);
  const rule=u.el('div','irix-rule',frame);
  const mode=ctx.display||'header';
  let note=null;
  if(mode!=='hidden'){
    if(mode==='header'){
      note=u.el('div','irix-task-note irix-task-header',frame,ctx.instruction);
    }else if(mode==='panel'){
      // The side panel is kept as a compact catalog note above the related list.
      note=u.el('div','irix-task-note irix-task-panel',null,ctx.instruction);
    }else{
      note=u.el('div','irix-task-note irix-task-toast',frame,ctx.instruction);
    }
  }
  const work=u.el('div','irix-work',frame);
  const left=u.el('section','irix-search-panel',work);
  const stage=u.el('main','ds-stage',left);
  const right=u.el('aside','irix-related-panel',work);
  if(note&&mode==='panel')right.appendChild(note);
  u.el('div','irix-related-title',right,'Related Products');
  const table=u.el('div','irix-related-table',right);
  const head=u.el('div','irix-related-head',table);u.el('span','',head,'Product Name');u.el('span','',head,'Price (USD)');
  const related=[['👜','Expedition Duffel','$119.00'],['🧢','Merino Beanie','$29.00'],['🧤','Softshell Gloves','$49.00'],['🧥','Fleece Jacket','$89.00'],['👖','Hiking Pants','$74.00'],['🎒','Pack Cover','$24.00'],['🧴','Trekking Water Filter','$54.00'],['🏮','Camp Lantern','$44.00']];
  const list=u.el('div','irix-related-list',table);
  related.forEach(([icon,name,price])=>{const row=u.el('div','irix-related-row',list);u.el('span','irix-related-icon',row,icon);u.el('span','irix-related-name',row,name);u.el('span','irix-related-price',row,price);});
  if(!ctx.finish&&placement==='footer'){
    const foot=u.el('footer','irix-footer',frame);
    if(decoy){const d=u.el('button','irix-button irix-xtra',foot,decoy);d.type='button';d.dataset.role='xtra';d.addEventListener('click',()=>env.log('decoy',{label:d.textContent,collide:true}));}
    submit=makeSubmit(foot,'irix-button');
  }else if(!ctx.finish&&placement==='link'){
    const foot=u.el('footer','irix-footer',frame);const a=u.el('button','irix-text-link',foot,label);a.type='button';a.dataset.role='submit';a.addEventListener('click',()=>ctx.submit());submit=a;
  }
  return{stage,submit};
},overlay(ctx){
  const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
  const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
  u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
}});
})();
