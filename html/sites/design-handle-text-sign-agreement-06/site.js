(function(){
  'use strict';
  env.site({
    name:'design-handle-text-sign-agreement-06', styles:['site.css'],
    frame(ctx){
      const u=ctx.util;
      document.body.className='ref clearlooks split';
      const shell=u.el('main','shell',document.body);
      const head=u.el('header','head',shell);
      const title=u.el('div','title',head,'SkyDrive');
      const glyph=u.el('span','title-document',title);
      glyph.innerHTML='<svg viewBox="0 0 20 24"><path d="M2 1h11l5 5v16H2Z" fill="#f4f4ef" stroke="#59636c"/><path d="M13 1v6h5M5 9h9M5 12h8M5 15h9M5 18h6" fill="none" stroke="#849097"/></svg>';
      const controls=u.el('span','window-controls',title);
      controls.innerHTML='<i>−</i><i>□</i><i>×</i>';
      const menus=u.el('div','tools',head);
      ['Home','Files','Sharing','Account','Help'].forEach((label)=>u.el('span','',menus,label));
      const work=u.el('div','work',shell);
      const center=u.el('section','center',work);
      const note=u.el('div','instruction',shell);
      note.setAttribute('role',ctx.display==='toast'?'status':'note');
      note.setAttribute('aria-label','Task');
      u.el('div','instruction-prompt',note,ctx.instruction);
      note.dataset.display=ctx.display;
      note.hidden=ctx.display==='hidden';
      if(ctx.display==='toast')note.classList.add('instruction-toast');
      const check=u.el('span','instruction-check',note,'✓');
      const taskControls=u.el('span','task-controls',note);
      taskControls.innerHTML='<i>−</i><i>×</i>';
      const stage=u.el('div','stage',center);
      const foot=u.el('footer','footer',shell);
      const endRng=ctx.rng.fork('chrome/end');
      const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
      const labels=ctx.content.END_LABELS.map(labelOf);
      const referenceEnd=endRng.bool(0.5);
      const placement=referenceEnd?'footer':endRng.pick(['toolbar','link']);
      shell.dataset.endPlacement=ctx.finish?'none':placement;
      const endLabel=referenceEnd?'Submit':endRng.pick(labels);
      const submit=ctx.finish?null:u.el(placement==='link'?'a':'button','submit end-'+placement,placement==='toolbar'?head:foot,endLabel);
      if(submit){
        if(placement==='link')submit.href='#';else submit.type='button';
        submit.title=endLabel;submit.setAttribute('aria-label',endLabel);
        submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
      }
      const collideRng=ctx.rng.fork('chrome/collide');
      if(collideRng.bool(0.3)){
        const pool=labels.filter(label=>label.trim().toLowerCase()!==endLabel.trim().toLowerCase());
        if(pool.length){
          const label=collideRng.pick(pool);
          const decoy=u.el('button','chrome-xtra',foot,label);
          decoy.type='button';decoy.dataset.role='xtra';
          decoy.addEventListener('click',()=>env.log('decoy',{label,collide:true}));
        }
      }
      return{stage,submit};
    },
    overlay(ctx){
      const labels={cookie:'Cookie preferences',toast:'Notification',chat:'Support',promo:'A special offer',banner:'Service notice'};
      const el=ctx.util.el('section','perturb '+ctx.kind,document.body);
      ctx.util.el('strong','',el,labels[ctx.kind]);
      ctx.util.el('p','',el,'Your SkyDrive workspace is ready.');
      const dismiss=ctx.util.el('button','dismiss',el,ctx.kind==='cookie'?'Accept':'Close');
      dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);
      return{el,dismiss};
    }
  });
})();
