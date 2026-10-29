// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-mixer-03',
    styles: ['site.css'],
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
      document.body.className=`qt-app instruction-${ctx.display}`;
      const head=u.el('header','qt-titlebar',document.body);
      u.el('span','qt-speaker',head,'◖))');
      u.el('strong','qt-appname',head,'Audio Mixer');
      const win=u.el('div','qt-window-controls',head);
      ['−','□','×'].forEach(x=>u.el('span','',win,x));
      const menu=u.el('nav','qt-menubar',document.body);
      ['File','Edit','View','Channels','Options','Help'].forEach(x=>u.el('span','',menu,x));
      const toolbar=u.el('div','qt-toolbar',document.body);
      const tools=[['▤','New'],['📂','Open'],['☷','Add Channel'],['✖','Remove'],['⚙','Preferences']];
      tools.forEach(([icon,label],i)=>{if(i===4)u.el('i','qt-divider',toolbar);const item=u.el('div','qt-tool',toolbar);u.el('b','',item,icon);u.el('span','',item,label);});
      let submit=null;
      const makeSubmit=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
      if(!ctx.finish&&placement==='header')submit=makeSubmit(toolbar,'qt-submit',label);
      const workspace=u.el('div','qt-workspace',document.body);
      const main=u.el('section','qt-mainpane',workspace);
      const cap=u.el('h2','qt-pane-title',main,'Channel Mixer');
      const stage=u.el('div','qt-stage',main);stage.dataset.role='stage';
      const inspector=u.el('aside','qt-inspector',workspace);
      u.el('h2','qt-pane-title',inspector,'Channel Properties');
      const g1=u.el('fieldset','qt-group',inspector);u.el('legend','',g1,'Channel');
      [['Name:','Master'],['Type:','Output'],['Color:','Blue']].forEach(([k,v])=>{const row=u.el('div','qt-proprow',g1);u.el('span','',row,k);u.el('div','qt-valuebox',row,v);});
      const g2=u.el('fieldset','qt-group',inspector);u.el('legend','',g2,'Level');
      [['Level (dB):','-3.8'],['Range:','-48 dB to +12 dB'],['Peak:','-1.2 dB'],['RMS:','-6.7 dB']].forEach(([k,v])=>{const row=u.el('div','qt-proprow',g2);u.el('span','',row,k);u.el('span','qt-valtext',row,v);});
      const g3=u.el('fieldset','qt-group',inspector);u.el('legend','',g3,'Other Settings');
      ['Mute:','Solo:','Link to all channels:'].forEach(k=>{const row=u.el('div','qt-proprow',g3);u.el('span','',row,k);u.el('i','qt-check',row);});
      if(ctx.display==='header'||ctx.display==='panel'){
        const note=u.el('div',ctx.display==='header'?'qt-instruction-head':'qt-instruction-panel',ctx.display==='header'?toolbar:inspector,ctx.instruction);
        if(ctx.display==='panel') workspace.classList.add('with-instruction');
      } else if(ctx.display==='toast') {const note=u.el('div','qt-instruction-toast',document.body,ctx.instruction);}
      const footer=u.el('footer','qt-statusbar',document.body);u.el('span','',footer,'Ready');u.el('span','qt-status-right',footer,'Audio Mixer  ·  5 channels');
      if(!ctx.finish&&placement==='footer')submit=makeSubmit(footer,'qt-submit',label);
      if(!ctx.finish&&placement==='note'){const link=u.el('a','qt-link',footer,label);link.href='#';link.dataset.role='submit';link.onclick=e=>{e.preventDefault();ctx.submit();};submit=link;}
      if(collision){const parent=placement==='header'?footer:toolbar;const decoy=u.el('button','qt-xtra',parent,collision);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label:collision,collide:true});}
      return {stage,submit};
    },
      },
    },
  });
})();
