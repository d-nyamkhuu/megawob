// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-match-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: {
      parts: {
        frame: (base, S) => function (ctx) {
      const u=ctx.util;
      const endRng=ctx.rng.fork('chrome/end');
      const placement=endRng.pick(['header','header','footer','link']);
      const endLabels=ctx.content&&ctx.content.END_LABELS;
      const endLabel=endRng.pick(Array.isArray(endLabels)&&endLabels.length?endLabels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"]);
      const label=typeof endLabel==='string'?endLabel:(endLabel.label||endLabel.text||endLabel.name||String(endLabel));
      const collideRng=ctx.rng.fork('chrome/collide');
      const collisionPool=(Array.isArray(endLabels)&&endLabels.length?endLabels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"])
        .map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x))).filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
      const collision=collideRng.bool(.3)&&collisionPool.length?collideRng.pick(collisionPool):null;
      document.body.className=`gem instruction-${ctx.display}`;
      const frame=u.el('div','gem-frame',document.body);
      const head=u.el('header','gem-titlebar',frame);
      u.el('div','gem-appmark',head,'✣');
      u.el('strong','gem-title',head,'Sound Control');
      const win=u.el('div','gem-window-controls',head);
      for(const [c,t] of [['min','_'],['max','□'],['close','×']])u.el('span',c,win,t);
      const menu=u.el('nav','gem-menubar',frame);
      for(const x of ['File','Edit','View','Devices','Help'])u.el('span','',menu,x);
      let submit=null;
      const makeSubmit=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
      const bar=u.el('div','gem-toolbar',frame);
      for(const [icon,name] of [['◖))','Playback'],['♩','Recording'],['☷','Mixer'],['▤','Presets'],['▣','Devices']]){
        const tab=u.el('div','gem-tab'+(name==='Playback'?' active':''),bar);u.el('b','',tab,icon);u.el('span','',tab,name);
      }
      const taskNote=u.el('div','gem-tasknote',frame,ctx.instruction);
      const instruction=taskNote;
      if(ctx.display==='hidden')instruction.hidden=true;
      if(ctx.display==='toast'){
        instruction.classList.add('gem-toast');
        const close=u.el('button','instruction-close',instruction,'×');
        close.onclick=()=>{instruction.style.visibility='hidden';};
      }
      if(ctx.display==='panel')taskNote.classList.add('gem-panel');
      if(ctx.display==='header')taskNote.classList.add('gem-header-note');
      if(!ctx.finish&&placement==='header')submit=makeSubmit(bar,'gem-submit',label);
      const main=u.el('main','gem-main',frame);
      const stage=u.el('section','gem-stage',main);stage.dataset.role='stage';
      const side=u.el('aside','gem-status',main);
      u.el('div','gem-speaker',side,'◖))');u.el('h2','',side,'Status');
      for(const line of ['Presets: 5','Devices: 1','Output: Speakers','Profile: Custom'])u.el('div','gem-stat',side,line);
      if(ctx.display==='panel')side.append(taskNote);
      if(ctx.display==='toast')frame.append(taskNote);
      const footer=u.el('footer','gem-footer',frame);
      u.el('span','',footer,'Ready');
      if(!ctx.finish&&placement==='footer')submit=makeSubmit(footer,'gem-submit',label);
      if(!ctx.finish&&placement==='link')submit=makeSubmit(footer,'gem-link',label);
      if(collision){const parent=bar;const decoy=u.el('button','gem-xtra',parent,collision);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label:collision,collide:true});}
      return {stage,submit};
    },
      },
    },
  });
})();
