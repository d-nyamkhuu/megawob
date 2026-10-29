(function(){'use strict';
const cfg={title:'Project Materials'};
env.site({name:'design-click-control-collapsible-05',styles:['site.css'],
frame(ctx){
  const u=ctx.util;
  document.body.className='ref';
  const win=u.el('main','win',document.body);
  win.dataset.instr=ctx.display;
  const tb=u.el('header','tbar',win);
  u.el('i','l',tb);
  u.el('div','ttl',tb,cfg.title);
  u.el('i','r',tb);
  const note=u.el('div','instruction',win);
  u.el('span','instruction-text',note,ctx.instruction);
  note.dataset.display=ctx.display;
  note.hidden=ctx.display==='hidden';
  if(ctx.display==='toast')note.classList.add('instruction-toast');
  if(ctx.display==='panel')note.classList.add('instruction-panel');
  const stage=u.el('div','stage',win);
  const foot=u.el('footer','footer',win);
  u.el('span','help',foot,'?');
  let submit=null;
  if(!ctx.finish){
    const endRng=ctx.rng.fork('chrome/end');
    const contentLabels=ctx.content&&ctx.content.END_LABELS;
    const labels=(Array.isArray(contentLabels)&&contentLabels.length?contentLabels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"])
      .map(x=>typeof x==='string'?x:(x&& (x.label||x.text||x.name))||String(x));
    const legacy=endRng.bool(0.5);
    const placement=legacy?'footer':endRng.pick(['header','link']);
    const label=legacy?'Submit':endRng.pick(labels.filter(x=>x.trim().toLowerCase()!=='submit').length?labels.filter(x=>x.trim().toLowerCase()!=='submit'):labels);
    const cr=ctx.rng.fork('chrome/collide');
    let collide=null;
    const otherLabels=labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
    if(otherLabels.length&&cr.bool(0.3))collide={label:cr.pick(otherLabels),where:placement==='header'?'footer':'header'};
    const makeEnd=(parent,cls,text,isLink)=>{
      const b=u.el(isLink?'a':'button',cls,parent,text);
      if(isLink)b.href='#';else b.type='button';
      b.setAttribute('aria-label',label);b.title=label;
      b.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
      return b;
    };
    if(placement==='header')submit=makeEnd(tb,'submit submit-header',label,false);
    else if(placement==='link')submit=makeEnd(foot,'submit-link',label+' ›',true);
    else {submit=makeEnd(foot,'submit',label,false);}
    if(collide){
      const parent=collide.where==='header'?tb:foot;
      const d=u.el('button','end-xtra '+(collide.where==='header'?'end-xtra-header':'end-xtra-footer'),parent,collide.label);
      d.type='button';d.addEventListener('click',()=>env.log('decoy',{label:collide.label,collide:true}));
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
}});
})();
