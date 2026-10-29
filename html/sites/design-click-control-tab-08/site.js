 (function(){
  'use strict';
  const cfg={title:'A Small Place on the Web'};
  env.site({name:'design-click-control-tab-08',styles:['site.css'],frame(ctx){
    const u=ctx.util, er=ctx.rng.fork('chrome/end'), cr=ctx.rng.fork('chrome/collide');
    const labels=ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
    const labelOf=x=>typeof x==='string'?x:x&&(x.label||x.text||x.name)||String(x);
    const standard=er.bool(.5);
    const label=standard?'Submit':labelOf(er.pick(labels));
    const placement=ctx.finish?null:standard?'footer':er.pick(['footer','header','link','header']);
    const others=labels.map(labelOf).filter(x=>x.toLowerCase()!==label.toLowerCase());
    const collide=cr.bool(.3)&&others.length?labelOf(cr.pick(others)):null;
    document.body.className='ref homepage';
    const shell=u.el('main','shell',document.body), head=u.el('header','head',shell);
    u.el('i','hp-house',head);
    const note=u.el('div','instruction',head,ctx.instruction);
    note.dataset.display=ctx.display;
    const panelMode=ctx.display==='panel'&&document.documentElement.clientWidth>=1260;
    note.hidden=ctx.display==='hidden'||panelMode;
    if(ctx.display==='toast')note.classList.add('instruction-toast');
    shell.dataset.instr=ctx.display;
    const tag=u.el('div','badge',head);u.el('i','hp-star',tag);u.el('span','',tag,cfg.title);u.el('i','hp-star',tag);
    let submit=null;
    if(placement==='header'){submit=u.el('button','submit head-submit',head,label);submit.type='button';submit.addEventListener('click',ctx.submit);}
    if(collide&&placement!=='footer'){const b=u.el('button','end-xtra head-xtra',head,collide);b.type='button';b.addEventListener('click',()=>env.log('decoy',{label:collide,collide:true}));}
    const work=u.el('div','work',shell);
    if(panelMode){const p=u.el('aside','task-panel',work);u.el('b','',p,'Task');u.el('div','',p,ctx.instruction);}
    const center=u.el('section','center',work), stage=u.el('div','stage',center);
    const stamp=u.el('div','stamp',shell);u.el('i','hp-sprout',stamp);u.el('span','',stamp,'Last updated: Apr 12, 1996');
    if(placement==='link'){submit=u.el('a','end-link',stamp,label);submit.href='#';submit.setAttribute('aria-label',label);submit.title=label;submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});}
    u.el('span','thanks',stamp,'Thanks for visiting!');u.el('i','hp-heart',stamp);
    const foot=u.el('footer','footer',shell), next=u.el('button','nexttab',foot,'Next Tab');
    next.type='button';next.addEventListener('click',()=>{const tabs=Array.from(document.querySelectorAll('.uc-tab'));if(!tabs.length)return;const k=tabs.findIndex(t=>t.hasAttribute('data-active')||t.getAttribute('aria-selected')==='true');tabs[(k+1)%tabs.length].click();});
    if(!ctx.finish&&placement==='footer'){submit=u.el('button','submit',foot,label);submit.type='button';submit.addEventListener('click',ctx.submit);}
    if(collide&&placement==='footer'){const b=u.el('button','end-xtra',foot,collide);b.type='button';b.addEventListener('click',()=>env.log('decoy',{label:collide,collide:true}));}
    return{stage,submit};
  },overlay(ctx){
    const el=ctx.util.el('section','perturb '+ctx.kind,document.body);
    ctx.util.el('strong','',el,{cookie:'Cookie preferences',toast:'Notification',chat:'Support',promo:'A special offer',banner:'Service notice'}[ctx.kind]);
    ctx.util.el('p','',el,{cookie:'Choose your preferences to continue.',toast:'Your workspace is ready.',chat:'How can we help?',promo:'Explore the latest tools.',banner:'A new update is available.'}[ctx.kind]);
    const dismiss=ctx.util.el('button','dismiss',el,ctx.kind==='cookie'?'Accept':'Close');dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);return{el,dismiss};
  }});
})();
