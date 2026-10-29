// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-match-01',
    styles: ['site.css','xp.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: {
      parts: {
        frame: (base, S) => function (ctx) {
      const u=ctx.util;
      const endRng=ctx.rng.fork('chrome/end');
      const placement=endRng.pick(['header','header','footer','note']);
      const endLabels=ctx.content&&ctx.content.END_LABELS;
      const endLabel=endRng.pick(Array.isArray(endLabels)&&endLabels.length?endLabels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"]);
      const label=typeof endLabel==='string'?endLabel:(endLabel.label||endLabel.text||endLabel.name||String(endLabel));
      const collideRng=ctx.rng.fork('chrome/collide');
      const collisionPool=(Array.isArray(endLabels)&&endLabels.length?endLabels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"])
        .map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x))).filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
      const collision=collideRng.bool(.3)&&collisionPool.length?collideRng.pick(collisionPool):null;
      document.body.className=`xp-window instruction-${ctx.display}`;
      const head=u.el('header','xp-titlebar',document.body);
      u.el('span','speaker-icon',head,'◖))');
      u.el('h1','',head,'Audio Settings');
      const win=u.el('div','window-controls',head);
      for(const [txt,cls] of [['−','minimize'],['□','maximize'],['×','close']])u.el('span',cls,win,txt);
      let submit=null;
      const makeSubmit=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
      if(!ctx.finish&&placement==='header')submit=makeSubmit(head,'xp-submit',label);
      const main=u.el('div','xp-main',document.body);
      const stage=u.el('main','audio-stage',main);stage.dataset.role='stage';
      const help=u.el('aside','help-panel',main);
      u.el('div','help-heading',help);u.el('span','help-mark',help,'?');u.el('h2','',help,'Help');
      u.el('p','help-copy',help,'Adjust the audio using the sliders or choose a preset. Each preset shows the bass and treble values for easy reference.');
      const range=u.el('section','help-section',help);u.el('h3','',range,'Slider range');u.el('p','',range,'Bass and treble can be set from -12 dB to +12 dB.');
      const tips=u.el('section','help-section tips',help);u.el('h3','',tips,'Tips');
      for(const line of ['Drag a slider handle to change its value.','Use the keyboard arrow keys for finer adjustments.','Track clicks are not allowed.']){const item=u.el('div','tip-line',tips);u.el('i','tip-dot',item);u.el('span','',item,line);}
      const instruction=u.el('div','instruction xp-instruction',head,ctx.instruction);
      if(ctx.display==='hidden'||ctx.display==='panel'||ctx.display==='toast')instruction.hidden=true;
      if(ctx.display==='panel'){const panel=u.el('div','instruction panel-instruction',help,ctx.instruction);panel.dataset.display='panel';}
      if(ctx.display==='toast'){const toast=u.el('div','instruction toast-instruction',document.body,ctx.instruction);toast.dataset.display='toast';}
      const footer=u.el('footer','xp-footer',document.body);
      if(!ctx.finish&&placement==='footer')submit=makeSubmit(footer,'xp-submit footer-submit',label);
      if(!ctx.finish&&placement==='note'){submit=u.el('a','footer-submit-link',footer,label);submit.href='#';submit.dataset.role='submit';submit.setAttribute('aria-label',label);submit.title=label;submit.onclick=e=>{e.preventDefault();ctx.submit();};}
      if(collision){const decoy=u.el('button','end-xtra',head,collision);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label:collision,collide:true});}
      return {stage,submit};
    },
      },
    },
  });
})();
