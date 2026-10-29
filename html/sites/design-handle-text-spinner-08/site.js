(function(){
  'use strict';
  env.site({
    name:'design-handle-text-spinner-08',styles:['site.css'],
    frame(ctx){
      const u=ctx.util;
      const endRng=ctx.rng.fork('chrome/end');
      const collideRng=ctx.rng.fork('chrome/collide');
      const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
      const labels=ctx.content.END_LABELS.map(labelOf);
      const classic=endRng.bool(0.5);
      const placement=classic?'form':endRng.pick(['toolbar','status']);
      const label=classic?'Submit':endRng.pick(labels);
      document.body.className='ref mac board';
      const shell=u.el('main','shell',document.body);
      shell.dataset.end=ctx.finish?'none':placement;
      const head=u.el('header','head',shell);
      u.el('div','title',head,'Sound Settings');
      u.el('div','tools',head,'File     Edit     Options     Windows     Help');
      const work=u.el('div','work',shell);
      const center=u.el('section','center',work);
      center.dataset.display=ctx.display;
      u.el('section','appearance-heading',center);
      const note=u.el('div','instruction',center,ctx.instruction);
      note.dataset.display=ctx.display;
      note.hidden=ctx.display==='hidden';
      if(ctx.display==='toast')note.classList.add('instruction-toast');
      const stage=u.el('div','stage',center);
      if(ctx.display==='panel'){
        const panel=u.el('aside','task-panel',work);
        u.el('strong','panel-title',panel,'Instructions');
        panel.append(note);
      }
      const foot=u.el('footer','footer',shell);
      const actions=u.el('div','form-actions',foot);
      const status=u.el('div','status-line',foot);
      u.el('span','ready',status,'Ready.');
      const toolbar=u.el('div','end-toolbar',head);
      const decoyBtn=(parent,text,collide)=>{
        const b=u.el('button','xtra',parent,text);
        b.type='button';
        b.dataset.role='xtra';
        b.addEventListener('click',()=>env.log('decoy',collide?{label:text,collide:true}:{label:text}));
        return b;
      };
      decoyBtn(actions,'Cancel');
      let submit=null;
      if(!ctx.finish){
        const parent=placement==='toolbar'?toolbar:placement==='status'?status:actions;
        submit=u.el('button','submit',parent,label);
        submit.type='button';
        submit.title=label;
        submit.setAttribute('aria-label',label);
        submit.addEventListener('click',ctx.submit);
        if(collideRng.bool(0.3)){
          const pool=labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
          if(pool.length)decoyBtn(actions,collideRng.pick(pool),true);
        }
      }
      return{stage,submit};
    },
    overlay(ctx){
      const u=ctx.util,el=u.el('section','perturb '+ctx.kind,document.body);
      u.el('strong','',el,{cookie:'Cookie preferences',toast:'Notification',chat:'Support',promo:'A special offer',banner:'Service notice'}[ctx.kind]);
      u.el('p','',el,{cookie:'Choose your preferences to continue.',toast:'Your workspace is ready.',chat:'How can we help?',promo:'Explore the latest tools.',banner:'A new update is available.'}[ctx.kind]);
      const dismiss=u.el('button','dismiss',el,ctx.kind==='cookie'?'Accept':'Close');
      dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);
      return{el,dismiss};
    }
  });
})();
