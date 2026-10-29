/* Lisa-era stationery workstation: menu bar, ruled window, twin panes (sliders | preview), bottom shelf. */
(function () {
  'use strict';
  function apple(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 24 28', class:'apple', 'aria-hidden':'true'}, parent);
    u.svg('path', {d:'M12 8c-2-1.6-7-1.6-8.2 3.2C2.6 16 5.6 24 8.4 24c1.4 0 2-.8 3.6-.8s2.2.8 3.6.8c2 0 4.6-4.4 4.8-6.4-3-1.2-3.4-5.4-.6-7C18.600 7.800 14 6.800 12 8z', fill:'#000'}, svg);
    u.svg('path', {d:'M12.400 7C12 4.800 13.800 2.600 16 2c.4 2.400-1.200 5-3.600 5z', fill:'#000'}, svg);
  }
  function docIcon(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'0 0 32 56', class:'doc-icon', 'aria-hidden':'true'}, parent);
    u.svg('path', {d:'M1.500 1.500h29v53h-29z', fill:'#f6f2e6', stroke:'#000', 'stroke-width':2}, svg);
    u.svg('rect', {x:6, y:6, width:6, height:5, fill:'#000'}, svg);
    for (let y = 14; y < 46; y += 5) u.svg('path', {d:`M6 ${y}h20`, stroke:'#000', 'stroke-width':1.500}, svg);
  }
  function landscape(parent) {
    const u = env.util;
    const img = u.el('img', 'scene', parent);
    img.src = 'sites/design-set-slider-multi-06/assets/lake-engraving.webp';
    img.alt = 'Stippled engraving of a mountain lake';
  }
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const title={chat:'Message',cookie:'Preferences',toast:'Notice',promo:'Stationery offer',banner:'System notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      u.el('p','survey-intro',el,{chat:'A colleague left a note on your desk.',cookie:'This workstation can remember your display preferences.',toast:'The document is ready for editing.',promo:'Order fresh letterhead for your office.',banner:'The print spooler is idle.'}[ctx.kind]);
      const dismiss=u.el('button','primary survey-close',el,ctx.kind==='cookie'?'Reject optional':'OK');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  env.site({name:'design-set-slider-multi-06',styles:['site.css'],scripts:[],
    frame(ctx) {
      const u=ctx.util;
      const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
      const labels=ctx.content.END_LABELS.map(labelOf);
      const er=ctx.rng.fork('chrome/end');
      const referenceEnd=er.bool(0.5);
      const placement=referenceEnd?'footer':er.pick(['header','link']);
      const label=referenceEnd?labels.find(x=>x==='Submit')||labels[0]:er.pick(labels);
      const cr=ctx.rng.fork('chrome/collide');
      const collide=cr.bool(0.3)?cr.pick(labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase())):null;
      document.body.className=`lisa instruction-${ctx.display}`;
      const bar=u.el('header','menubar',document.body);
      apple(bar);
      for(const m of ['File','Edit','View','Special','Help'])u.el('span','menu',bar,m);
      u.el('span','clock',bar,'Mon Mar 12   10:24 AM');
      const win=u.el('div','window',document.body);
      const tb=u.el('div','titlebar',win);
      u.el('span','tb-box',tb);
      u.el('span','tb-lines',tb);
      u.el('span','tb-title',tb,'Image Adjuster');
      u.el('span','tb-lines',tb);
      u.el('span','tb-box zoom',tb);
      const panes=u.el('div','panes',win);
      const left=u.el('section','pane-left',panes);
      u.el('div','divider',panes);
      const right=u.el('section','pane-right',panes);
      const row=u.el('div','instr-row',left);
      docIcon(row);
      const instruction=u.el('div','instruction',row,ctx.instruction);
      if(ctx.display==='hidden')instruction.hidden=true;
      if(ctx.display==='toast'){
        const close=u.el('button','instruction-close',instruction,'Close');
        close.onclick=()=>{instruction.style.visibility='hidden';};
      }
      const stage=u.el('main','record-stage',left);stage.dataset.role='stage';
      u.el('div','pv-head',right,'Preview');
      const frame=u.el('div','pv-frame',right);
      landscape(frame);
      const shelf=u.el('footer','shelf',win);
      const shelfName=u.el('span','shelf-name',shelf,'Image Adjuster');
      const actions=u.el('div','shelf-actions',shelf);
      if(collide){
        const decoy=u.el('button','xtra',actions,collide);decoy.type='button';decoy.dataset.role='xtra';
        decoy.onclick=()=>env.log('decoy',{label:collide,collide:true});
      }
      const reset=u.el('button','reset',actions,'Reset');reset.type='button';reset.dataset.action='reset';
      reset.addEventListener('click',()=>env.log('decoy',{label:'Reset'}));
      let submit=null;
      if(!ctx.finish){
        const parent=placement==='header'?tb:placement==='link'?shelfName:actions;
        if(placement==='link')shelfName.textContent='';
        submit=u.el('button',placement==='footer'?'primary':placement==='header'?'toolbar-end':'end-link',parent,label);
        submit.type='button';submit.dataset.role='submit';submit.title=label;submit.setAttribute('aria-label',label);
        submit.onclick=()=>ctx.submit();
      }
      u.el('div','dither',document.body);
      return {stage,submit};
    },
    overlay: drawOverlay,
  });
})();
