(function(){
  'use strict';
  const C={site:'design-act-in-time-popup-12'};
  env.site({
    name:C.site,styles:['site.css'],scripts:[],initialOverlay:{kind:'banner'},
    frame(ctx){
      const u=ctx.util;
      // Separate streams preserve every existing task and frame draw.
      const er=ctx.rng.fork('chrome/end');
      const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
      const endLabels=ctx.content.END_LABELS.map(labelOf);
      const placement=er.bool(0.5)?'dock':er.pick(['toolbar','link']);
      const endLabel=placement==='dock'?'Submit':er.pick(endLabels.filter(x=>x!=='Submit'));
      const cr=ctx.rng.fork('chrome/collide');
      const collision=cr.bool(0.3)?cr.pick(endLabels.filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase())):null;
      const title=u.el('header','os-title',document.body);
      u.el('span','os-app-icon',title,'▣');
      u.el('strong','',title,'Workplace Shell - Access Manager');
      const controls=u.el('div','os-window-controls',title);
      ['_','□','×'].forEach(x=>u.el('span','',controls,x));
      const menu=u.el('nav','os-menu',document.body);
      ['Folder','Edit','View','Selected','Help'].forEach(x=>u.el('span','',menu,x));
      const tabs=u.el('div','os-tabs',document.body);
      ['Welcome','Log In','System Info','Help'].forEach((x,i)=>{
        const t=u.el('div','os-tab'+(i===0?' selected':''),tabs,x);
        t.setAttribute('aria-current',i===0?'page':'false');
      });
      const shell=u.el('div','os-work',document.body);
      const area=u.el('main','os-surface',shell);
      let mode=ctx.display||'header';
      // The corner notification must not cover the sign-in fields on compact desktops.
      if(mode==='toast'&&(document.documentElement.clientWidth<1440||document.documentElement.clientHeight<700))mode='header';
      const note=(parent,cls)=>{const n=u.el('aside',cls,parent);u.el('span','os-note-icon',n,'▤');u.el('div','os-instruction',n,ctx.instruction);return n;};
      const stage=u.el('section','os-stage',area);
      const logo=u.el('div','os-logo',area);u.el('div','os-globe',logo,'◉');u.el('div','',logo,'Workplace');u.el('div','',logo,'Shell');
      const access=u.el('div','os-access',area);u.el('div','os-access-title',access,'Log in to access:');
      [['▱','Mail'],['▤','Documents'],['♧','Networks'],['▥','Applications']].forEach(([icon,label])=>{const row=u.el('div','os-access-row',access);u.el('span','',row,icon);u.el('span','',row,label);});
      if(mode==='panel'){
        const p=note(area,'os-task-panel');p.insertBefore(u.el('strong','os-panel-title',p,'Instructions'),p.firstChild);
      }else if(mode==='toast'){
        note(area,'os-task-toast');
      }else if(mode==='header'){
        note(area,'os-task-note');
      }
      const dock=u.el('footer','os-dock',document.body);
      const tools=u.el('div','os-tools',dock);
      const toolData=[['▤','Drive A:'],['▱','Drive C:'],['▣','Programs'],['▤','Templates'],['♜','Shredder'],['?','Help'],['⌕','Find'],['▱','Print'],['▣','Shut Down']];
      toolData.forEach(([icon,label],i)=>{const b=u.el('button','os-tool'+(i===8?' os-shutdown':''),tools);b.type='button';u.el('span','os-tool-icon',b,icon);u.el('span','os-tool-label',b,label);b.addEventListener('click',()=>env.log('decoy',{label}));});
      const clock=u.el('div','os-clock',dock);u.el('span','',clock,'10:24 AM');u.el('span','',clock,'Apr 12, 1994');
      if(collision){
        const decoy=u.el('button','os-chrome-button os-pq',menu,collision);
        decoy.type='button';decoy.dataset.role='xtra';
        decoy.addEventListener('click',()=>env.log('decoy',{label:collision,collide:true}));
      }
      let submit=null;
      if(!ctx.finish){
        const parent=placement==='dock'?tools:placement==='toolbar'?menu:tabs;
        const cls=placement==='dock'?'os-submit':placement==='toolbar'?'os-chrome-button os-end-toolbar':'os-end-link';
        submit=u.el(placement==='link'?'a':'button',cls,parent,endLabel);
        if(placement==='link')submit.href='#';else submit.type='button';
        submit.dataset.role='submit';submit.title=endLabel;submit.setAttribute('aria-label',endLabel);
        submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
      }
      return{stage,submit};
    },
    overlay(ctx){
      const u=ctx.util;const el=u.el('section','os-overlay os-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      // A later cookie sheet must not cover the initial warning's recovery button.
      // Its own dismiss button sits outside the warning, so both remain reachable.
      if(ctx.initial)el.classList.add('os-overlay-initial');
      const texts={cookie:'This workplace stores preferences for your session.',toast:'System changes saved.',chat:'Workplace Shell Help Desk',promo:'Install the latest Workplace extensions.',banner:'System notice'};
      u.el('div','os-overlay-title',el,ctx.kind==='banner'?'Unsaved Changes':'Workplace Shell');
      u.el('div','os-overlay-copy',el,ctx.kind==='banner'?'Unsaved layout changes. If you continue, your layout changes will not be saved.':texts[ctx.kind]);
      const x=u.el('button','os-overlay-x',el,'×');x.type='button';x.setAttribute('aria-label','Close');x.addEventListener('click',()=>ctx.dismiss(ctx.kind==='cookie'?'reject':'close'));
      const dismiss=u.el('button','os-overlay-close',el,ctx.kind==='banner'?'Continue without saving':'Close');dismiss.type='button';dismiss.addEventListener('click',()=>ctx.dismiss(ctx.kind==='cookie'?'accept':'close'));
      return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  });
})();
