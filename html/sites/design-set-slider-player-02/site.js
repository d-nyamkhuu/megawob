// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-player-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: {
      parts: {
        frame: (base, S) => function (ctx) {
      const u=ctx.util;
      const endRng=ctx.rng.fork('chrome/end');
      const placement=endRng.pick(['footer','footer','header','note']);
      const endLabels=ctx.content&&ctx.content.END_LABELS;
      const endLabel=endRng.pick(Array.isArray(endLabels)&&endLabels.length?endLabels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"]);
      const label=typeof endLabel==='string'?endLabel:(endLabel.label||endLabel.text||endLabel.name||String(endLabel));
      const collideRng=ctx.rng.fork('chrome/collide');
      const collisionPool=(Array.isArray(endLabels)&&endLabels.length?endLabels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"])
        .map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x))).filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
      const collision=collideRng.bool(.3)&&collisionPool.length?collideRng.pick(collisionPool):null;
      document.body.className=`amiga instruction-${ctx.display}`;
      const os=u.el('header','workbench-bar',document.body);
      u.el('span','wb-icon',os,'▦');u.el('span','wb-name',os,'Amiga Workbench');
      const osTools=u.el('div','window-tools',os); for(const ch of ['−','▣'])u.el('span','window-gadget',osTools,ch);
      let submit=null;
      const makeSubmit=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
      const win=u.el('section','player-window',document.body);
      const head=u.el('header','player-titlebar',win);u.el('span','app-icon',head,'▧');u.el('span','app-title',head,'Video Player');
      if(ctx.display==='header')u.el('span','title-instruction',head,ctx.instruction);
      const tools=u.el('div','window-tools',head);for(const ch of ['−','▣','×'])u.el('span','window-gadget',tools,ch);
      const stage=u.el('main','record-stage',win);stage.dataset.role='stage';
      const note=u.el('footer','help-strip',win);
      u.el('span','help-icon',note,'i');
      const instructions={header:'Drag the sliders to adjust playback position and volume. Click the icons to mute or toggle captions.',panel:ctx.instruction,toast:ctx.instruction,hidden:'Drag the sliders to adjust playback position and volume. Click the icons to mute or toggle captions.'};
      u.el('span','help-text',note,instructions[ctx.display]||ctx.instruction);
      if(!ctx.finish&&placement==='header')submit=makeSubmit(tools,'amiga-submit',label);
      if(!ctx.finish&&placement==='footer')submit=makeSubmit(note,'amiga-submit',label);
      if(!ctx.finish&&placement==='note'){
        submit=u.el('a','footer-submit-link',note,label);submit.href='#';submit.dataset.role='submit';submit.setAttribute('aria-label',label);submit.title=label;submit.onclick=e=>{e.preventDefault();ctx.submit();};
      }
      if(collision){const parent=placement==='header'?note:tools;const decoy=u.el('button','end-xtra',parent,collision);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label:collision,collide:true});}
      return {stage,submit};
    },
      },
    },
  });
})();
