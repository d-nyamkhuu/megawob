(function(){'use strict';
  const cfg={title:'Project Notebook',nav:['Workspace','Help','Settings'],corp:'ACME CORP',rows:15,active:3};
  const labelOf=x=>(typeof x==='string'?x:x&&(x.label||x.text||x.name))||String(x);
env.site({name:"design-click-control-link-09",styles:['site.css'],frame(ctx){
  const u=ctx.util;
  document.body.className='ref nb';
  const shell=u.el('main','shell',document.body);
  const head=u.el('header','head',shell);
  u.el('div','corner',head);
  u.el('div','title',head,cfg.title);
  const nav=u.el('nav','topnav',head);
  cfg.nav.forEach((s,i)=>{if(i)u.el('i','',nav,'|');u.el('span','',nav,s);});
  u.el('div','corp',head,cfg.corp);
  const work=u.el('div','work',shell);
  const rail=u.el('nav','rail',work);
  for(let i=1;i<=cfg.rows;i++)u.el('div',i===cfg.active?'active':'',rail,String(i));
  const center=u.el('section','center',work);
  const note=u.el('div','instruction',center,ctx.instruction);
  if(ctx.instruction.length>64)note.classList.add('instruction-long');
  note.dataset.display=ctx.display;
  note.hidden=ctx.display==='hidden';
  if(ctx.display==='panel')note.classList.add('instruction-panel');
  if(ctx.display==='toast')note.classList.add('instruction-toast');
  const stage=u.el('div','stage',center);
  const foot=u.el('footer','footer',center);
  const clear=u.el('button','nb-act clear',foot,'Clear Selection');clear.type='button';
  u.el('span','spacer',foot);
  const mark=u.el('button','nb-act mark',foot,'Mark for Review');mark.type='button';
  let submit=null;
  if(!ctx.finish){
    const er=ctx.rng.fork('chrome/end');
    const common=er.bool(0.5);
    const placement=common?'footer':er.pick(['header','link']);
    const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
    const label=common?'Submit':labelOf(er.pick(labels));
    const makeEnd=(parent,kind,text)=>{
      const el=u.el(kind==='link'?'a':'button',kind==='link'?'end-link':kind==='header'?'head-end':'submit',parent,text);
      if(kind==='link')el.href='#';else el.type='button';
      el.setAttribute('aria-label',label);el.title=label;
      el.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
      return el;
    };
    if(placement==='footer') submit=makeEnd(foot,'footer',label);
    else if(placement==='link') submit=makeEnd(foot,'link',label+' ›');
    else {
      const actions=u.el('div','head-actions',head);
      submit=makeEnd(actions,'header',label);
    }
    const cr=ctx.rng.fork('chrome/collide');
    if(cr.bool(0.3)){
      const pool=labels.map(labelOf).filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
      if(pool.length){
        const collision=cr.pick(pool);
        const parent=cr.pick(placement==='header'?[head,foot]:[foot,head]);
        const decoy=u.el('button','nb-xtra',parent,collision);decoy.type='button';
        decoy.addEventListener('click',()=>env.log('decoy',{label:collision,collide:true}));
      }
    }
  }
  return{stage,submit};
},
overlay(ctx){
  const el=ctx.util.el('section','perturb '+ctx.kind,document.body);
  ctx.util.el('strong','',el,{cookie:'Cookie preferences',toast:'Notification',chat:'Support',promo:'A special offer',banner:'Service notice'}[ctx.kind]);
  ctx.util.el('p','',el,{cookie:'Choose your preferences to continue.',toast:'Your workspace is ready.',chat:'How can we help?',promo:'Explore the latest tools.',banner:'A new update is available.'}[ctx.kind]);
  const dismiss=ctx.util.el('button','dismiss',el,ctx.kind==='cookie'?'Accept':'Close');
  dismiss.type='button';
  dismiss.addEventListener('click',ctx.dismiss);
  return{el,dismiss};
}});})();
