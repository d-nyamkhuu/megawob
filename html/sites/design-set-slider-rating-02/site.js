// Design on templates/site/drag-slider-horizontal-11.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-rating-02',
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
      document.body.className=`learning-app instruction-${ctx.display}`;
      const frame=u.el('div','app-frame',document.body);
      const titlebar=u.el('header','window-titlebar',frame);
      u.el('span','title-icon',titlebar,'📖');
      u.el('span','window-title',titlebar,'Learning Center');
      const win=u.el('div','window-controls',titlebar);
      for(const [label,glyph] of [['Minimize','−'],['Maximize','□'],['Close','×']]){const b=u.el('button','window-control',win,glyph);b.type='button';b.title=label;}
      const menu=u.el('nav','menu-bar',frame);
      ['File','Edit','View','Tools','Help'].forEach(x=>u.el('span','menu-item',menu,x));
      const toolbar=u.el('nav','app-toolbar',frame);
      const tools=[['Back','◀'],['Forward','▶'],['Home','⌂'],['My Courses','▣'],['Browse','★'],['My Learning','▤'],['Community','♟'],['Help','?']];
      tools.forEach(([name,icon],i)=>{if(i===2||i===3||i===4||i===5||i===6||i===7){const sep=u.el('i','toolbar-sep',toolbar);sep.setAttribute('aria-hidden','true');}const b=u.el('button','tool-button',toolbar);b.type='button';u.el('span','tool-icon',b,icon);u.el('span','',b,name);});
      const head=u.el('section','course-hero',frame);
      const cover=u.el('div','course-cover',head);cover.setAttribute('role','img');cover.setAttribute('aria-label','Watercolor landscape');
      const hero=u.el('div','course-copy',head);
      u.el('h1','',hero,'Intro to Watercolors');
      u.el('p','course-description',hero,'A hands-on introduction to painting with watercolors, covering materials, basic techniques, and simple projects.');
      u.el('p','course-meta',hero,'Instructor: Maria Lopez　|　8 lessons　|　2h 30m');
      if(ctx.display==='header'){const note=u.el('div','task-note header-note',hero,ctx.instruction);note.setAttribute('role','note');}
      let submit=null;
      const makeSubmit=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;};
      if(!ctx.finish&&placement==='header')submit=makeSubmit(toolbar,'primary toolbar-submit',label);
      const tabs=u.el('nav','course-tabs',frame);
      ['Overview','Lessons','Resources','Reviews','Related Courses'].forEach((x,i)=>{const b=u.el('button',`course-tab${i===3?' active':''}`,tabs,x);b.type='button';});
      const content=u.el('main','review-area',frame);
      if(ctx.display==='panel'){const panel=u.el('aside','task-note panel-note',content);u.el('strong','',panel,'Task');u.el('span','',panel,ctx.instruction);}
      const stage=u.el('section','record-stage',content);stage.dataset.role='stage';
      const instruction=u.el('div','task-note toast-note',frame,ctx.instruction);instruction.hidden=ctx.display!=='toast';
      if(ctx.display==='toast'){const x=u.el('button','note-close',instruction,'×');x.type='button';x.setAttribute('aria-label','Dismiss');x.onclick=()=>{instruction.hidden=true;};}
      const footer=u.el('footer','status-bar',frame);
      u.el('span','status-app',footer,'Learning Center');
      const status=u.el('div','status-counts',footer);
      ['12 courses','3 in progress','9 completed'].forEach((x,i)=>{if(i)u.el('i','status-sep',status);u.el('span','',status,x);});
      const actions=u.el('div','footer-actions',footer);
      if(!ctx.finish&&placement==='footer')submit=makeSubmit(actions,'primary footer-submit',label);
      if(!ctx.finish&&placement==='note'){submit=makeSubmit(actions,'primary footer-submit',label);}
      if(collision){const parent=placement==='header'?actions:toolbar;const decoy=u.el('button','end-xtra',parent,collision);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label:collision,collide:true});}
      return {stage,submit};
    },
      },
    },
  });
})();
