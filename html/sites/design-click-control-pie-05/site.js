(function(){'use strict';
env.site({name:"design-click-control-pie-05",styles:['site.css'],
frame(ctx){
  const u=ctx.util;
  const endRng=ctx.rng.fork('chrome/end');
  const placementRng=endRng.fork('placement');
  const labelRng=endRng.fork('label');
  const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
  const endLabels=(ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"]).map(labelOf);
  const placements=ctx.finish?null:placementRng.pick(['text','corner','corner','header','text','header','corner','corner']);
  const endLabel=placements==='corner'?'Submit':placements?labelRng.pick(endLabels):null;
  const decoyRng=ctx.rng.fork('chrome/decoy');
  const decoyLabels=(ctx.content&&ctx.content.DECOY_LABELS||['Help','Feedback','Preview','Save draft','Reset view','Share','Export','History']).map(labelOf);
  const decoys=decoyRng.sample(decoyLabels,decoyRng.int(0,2));
  const collideRng=ctx.rng.fork('chrome/collide');
  const collideLabels=endLabels.filter(x=>String(x).trim().toLowerCase()!==String(endLabel||'').trim().toLowerCase());
  const collide=!!placements&&collideRng.bool(.3)&&collideLabels.length?collideRng.pick(collideLabels):null;
  const collideWhere=collide?collideRng.pick(['header','corner']):null;
  document.body.className='atlas';
  const shell=u.el('main','shell',document.body);
  const head=u.el('header','head',shell);
  u.el('div','brand',head,'Atlas');
  u.el('span','vbar',head);
  const nav=u.el('nav','nav',head);
  ['Documents','Maps','Notes'].forEach(t=>u.el('span','',nav,t));
  const util=u.el('div','util',head);
  ['Help','Account','Sign Out'].forEach((t,i)=>{if(i)u.el('i','',util,'|');u.el('span','',util,t);});
  const decoyBtn=(parent,label,collides)=>{
    const b=u.el('button',collides?'chrome-xtra collide':'chrome-xtra',parent,label);
    b.type='button';
    b.addEventListener('click',()=>env.log('decoy',collides?{label,collide:true}:{label}));
    return b;
  };
  const endBtn=(parent,cls,label)=>{
    const b=u.el('button',cls,parent,label);
    b.type='button';b.title=label;b.setAttribute('aria-label',label);
    b.addEventListener('click',ctx.submit);
    return b;
  };
  let submit=null;
  if(placements==='header'){
    const headerAction=u.el('div','header-action',head);
    submit=endBtn(headerAction,'header-submit',endLabel);
  }
  const headerDecoys=u.el('div','header-xtras',head);
  if(collide&&collideWhere==='header')decoyBtn(headerDecoys,collide,true);
  decoys.slice(0,1).forEach(label=>decoyBtn(headerDecoys,label,false));
  const work=u.el('div','work',shell);
  u.el('div','pager',work,'1 / 5');
  const lab=u.el('div','kicker',work);
  u.el('span','',lab,'TASK');
  const note=u.el('div','instruction '+(ctx.display==='panel'?'instruction-panel':ctx.display==='toast'?'instruction-toast':''),work,ctx.instruction);
  note.dataset.display=ctx.display;
  note.hidden=ctx.display==='hidden';
  if(ctx.display==='panel')lab.classList.add('panel-kicker');
  if(ctx.display==='toast'||ctx.display==='hidden')lab.hidden=true;
  const stage=u.el('div','stage',work);
  if(placements==='corner')submit=endBtn(shell,'submit',endLabel);
  if(placements==='text'){
    submit=endBtn(shell,'end-link',endLabel+' ›');
  }
  if((collide&&collideWhere==='corner')||decoys.length>1){
    const region=u.el('div','corner-xtras',shell);
    if(collide&&collideWhere==='corner')decoyBtn(region,collide,true);
    decoys.slice(1).forEach(label=>decoyBtn(region,label,false));
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
