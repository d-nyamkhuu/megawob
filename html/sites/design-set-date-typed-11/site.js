(function(){
  'use strict';
  const C={site:'design-set-date-typed-11',brand:'Rivermere Medical Center  |  Patient Records',instruction:'top',rail:'',menu:'',briefTitle:'Your Task'};
  env.site({
    name:C.site,
    initialOverlay:{kind:'tour'},
    styles:['site.css'],
    scripts:[],
    frame(ctx){
      if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
      const selection=window.getSelection();if(selection)selection.removeAllRanges();
      const u=ctx.util;
      const top=u.el('header','ds-top',document.body);
      u.el('span','ds-brand',top,C.brand);
      const controls=u.el('span','',top,'−    □    ×');
      if(C.menu){const nav=u.el('nav','ds-menu',document.body);C.menu.split('|').forEach(t=>u.el('span','',nav,t));}
      const labels=ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
      const labelOf=x=>typeof x==='string'?x:x&&(x.label||x.text||x.name)||String(x);
      const er=ctx.rng.fork('chrome/end');
      const proposed=ctx.finish?null:er.pick(['footer','footer','header','link']);
      const alternatives=labels.map(labelOf).filter(x=>x.trim().toLowerCase()!=='submit');
      const label=ctx.finish?'Submit':er.bool(.5)?'Submit':alternatives.length?labelOf(er.pick(alternatives)):'Submit';
      const placement=ctx.finish?null:label==='Submit'?'footer':proposed==='footer'?er.pick(['header','link']):proposed;
      const cr=ctx.rng.fork('chrome/collide');
      let collide=null;
      if(!ctx.finish&&cr.bool(.3)){
        const options=[...new Set(labels.map(labelOf))].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
        if(options.length)collide=cr.pick(options);
      }
      const body=u.el('div','ds-body',document.body);
      if(C.rail){const rail=u.el('aside','ds-rail',body);C.rail.split('|').forEach(t=>u.el('div','',rail,t));}
      const content=u.el('div','ds-content',body);
      const natural=C.instruction;
      const mode=ctx.display==='hidden'?'hidden':ctx.display==='toast'?'toast':ctx.display==='panel'?'left':natural;
      function briefing(parent,cls){const b=u.el('aside',cls,parent);if(cls==='ds-brief')u.el('h2','',b,C.briefTitle||'Task');u.el('div','ds-instruction',b,ctx.instruction);return b;}
      if(mode==='top')briefing(content,'ds-header-note');
      const main=u.el('div','ds-main',content);
      if(mode==='left'||mode==='right'){const b=briefing(main,'ds-brief');if(mode==='right')b.style.order='2';}
      const stage=u.el('main','ds-stage',main);
      if(mode==='toast'){const note=briefing(content,'ds-toast');content.insertBefore(note,main);}
      const makeEnd=(parent,cls,text,link)=>{
        const b=u.el(link?'a':'button',cls,parent,text);
        if(link)b.href='#';else b.type='button';
        b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;
        b.addEventListener('click',e=>{e.preventDefault();ctx.submit();});return b;
      };
      const makeDecoy=(parent,text)=>{
        const b=u.el('button','ds-xtra',parent,text);b.type='button';b.dataset.role='xtra';
        b.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));return b;
      };
      let submit=null;
      if(placement==='header'){
        const actions=u.el('div','ds-top-actions',top);
        if(collide)makeDecoy(actions,collide);
        submit=makeEnd(actions,'ds-submit ds-submit-top',label,false);
        top.insertBefore(actions,controls);
      }
      let foot=null;
      if(placement==='footer'||placement==='link'){
        foot=u.el('footer','ds-footer',content);
        u.el('span','',foot,'Ready');
        if(collide)makeDecoy(foot,collide);
        submit=makeEnd(foot,placement==='link'?'ds-endlink':'ds-submit',placement==='link'?`${label} ›`:label,placement==='link');
      }
      return{stage,submit};
    },
    overlay(ctx){
      const u=ctx.util;
      if(ctx.kind==='tour'){
        const el=u.el('section','ds-initial ds-initial-tour',document.body);el.dataset.role='overlay';
        const x=u.el('button','ds-tour-x',el,'×');x.type='button';x.setAttribute('aria-label','Close tour');
        u.el('h2','',el,'Welcome!');
        u.el('p','',el,'Take a quick tour to learn about scheduling appointments.');
        const start=u.el('button','ds-tour-start',el,'Start tour');start.type='button';
        const skip=u.el('button','ds-tour-skip',el,'Skip tour');skip.type='button';
        const dismiss=()=>{env.log('reference-obstruction-dismiss',{kind:'tour'});ctx.dismiss('close');};
        x.addEventListener('click',dismiss);start.addEventListener('click',dismiss);skip.addEventListener('click',dismiss);
        return{el,dismiss:skip,ttlSteps:0};
      }
      const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));
      return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  });
})();
