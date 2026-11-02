// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-mixer-02',
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
      document.body.className=`mixer-app instruction-${ctx.display}`;
      const frame=u.el('div','window-frame',document.body);
      const head=u.el('header','menu-bar',frame);
      const tabs=u.el('nav','menu-tabs',head);
      for(const [i,name] of ['Console','Tracks','Library','Mixer','Presets','Settings','Help'].entries()){
        const tab=u.el('div',i===0?'menu-tab selected':'menu-tab',tabs,name);tab.setAttribute('role','tab');
      }
      const instructionHeader=u.el('div','header-instruction',frame,ctx.instruction);
      if(ctx.display!=='header')instructionHeader.hidden=true;
      let submit=null;
      const makeSubmit=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
      if(!ctx.finish&&placement==='header')submit=makeSubmit(head,'header-submit',label);
      const main=u.el('div','content-area',frame);
      const sidebar=u.el('aside','channel-sidebar',main);
      const channelBox=u.el('section','sidebar-section channel-section',sidebar);
      u.el('h2','section-heading',channelBox,'Channels');
      const channelList=u.el('div','channel-list',channelBox);
      for(const [i,name] of ['Master','Mic','Music','Alerts','Effects','Guest 1','Guest 2','Phone','Interview','Playback A','Playback B','Line In','Line Out','Aux 1','Aux 2'].entries())
        u.el('div',i===0?'channel-item selected':'channel-item',channelList,name);
      const presetBox=u.el('section','sidebar-section preset-section',sidebar);
      u.el('h2','section-heading',presetBox,'Presets');
      const presetList=u.el('div','preset-list',presetBox);
      for(const name of ['Default','News','Interview','Music Bed','Voice Over','Loudness Test'])u.el('div','preset-item',presetList,name);
      const stage=u.el('main','mixer-stage',main);stage.dataset.role='stage';
      u.el('h1','stage-title',stage,'Audio Mixer');
      const instruction=u.el('div','instruction',sidebar,ctx.instruction);
      if(ctx.display==='hidden'||ctx.display==='header'||ctx.display==='toast')instruction.hidden=true;
      if(ctx.display==='toast'){
        instruction.hidden=false;instruction.classList.add('toast-note');
        const close=u.el('button','instruction-close',instruction,'×');close.setAttribute('aria-label','Close');close.onclick=()=>{instruction.hidden=true;};
      }
      const footer=u.el('footer','app-footer',frame);
      const status=u.el('div','status-line',footer,'Ready');
      const actions=u.el('div','footer-actions',footer);
      if(!ctx.finish&&placement==='footer')submit=makeSubmit(actions,'',label);
      if(!ctx.finish&&placement==='note')submit=makeSubmit(actions,'',label);
      if(collision){const parent=placement==='header'?actions:head;const decoy=u.el('button','end-xtra',parent,collision);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label:collision,collide:true});}
      if(!ctx.finish&&placement==='note'){}
      if(!ctx.finish&&placement==='header'){}
      return {stage,submit};
    },
      },
    },
  });
})();
