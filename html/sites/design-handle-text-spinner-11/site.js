(function(){
  'use strict';
  env.site({
    name:'design-handle-text-spinner-11',
    styles:['site.css'],
    initialOverlay:{kind:'promo'},
    frame(ctx){
      const u=ctx.util;
      document.body.className='ref swiss split-level';
      const shell=u.el('main','shell',document.body);
      const overview=u.el('section','overview',shell);
      const one=u.el('div','section-no',overview,'01');
      const details=u.el('div','overview-main',overview);
      const title=u.el('div','overview-title',details);
      u.el('h1','',title,'System Overview');
      u.el('span','date',title,'Apr 24, 2016　10:14');
      u.el('p','overview-sub',details,'Room A · Conference Setup');
      const grid=u.el('div','overview-grid',details);
      const facts=u.el('div','facts',grid);
      [['Device','Audio Controller'],['Location','Conference Room A'],['Status','Online'],['Mode','Presentation'],['Last Updated','Apr 24, 2016 10:14']].forEach((r,i)=>{
        u.el('span','fact-label',facts,r[0]);
        u.el('span','fact-value'+(i===2?' online':''),facts,r[1]);
      });
      const volume=u.el('div','master',grid);
      u.el('strong','',volume,'Master Volume');
      u.el('b','overview-value',volume,'20 %');
      const bar=u.el('div','meter',volume);u.el('i','',bar);
      u.el('div','meter-labels',volume,'0　　　　　　　　　　　　　　　100');
      const zones=u.el('div','zones',grid);
      u.el('strong','',zones,'Audio Zones');
      [['Room A','On'],['Room B','Off'],['Room C','Off'],['Lobby','Off']].forEach(r=>{u.el('span','',zones,r[0]);u.el('span','',zones,r[1]);});
      const work=u.el('section','work',shell);
      u.el('div','section-no lower-no',work,'02');
      const center=u.el('div','center',work);
      const heading=u.el('div','task-heading',center);
      u.el('h2','',heading,'Configuration Task');
      u.el('p','',heading,'Adjust the audio setting as instructed.');

      const er=ctx.rng.fork('chrome/end');
      const keepReference=!ctx.finish&&er.bool(0.5);
      const placement=ctx.finish?null:(keepReference?'task':er.pick(['header','footer','link']));
      const labels=ctx.content&&ctx.content.END_LABELS;
      const label=keepReference?'Submit':(Array.isArray(labels)&&labels.length?String(er.pick(labels)):'Done');
      const note=u.el('div','instruction',center,ctx.instruction);
      note.dataset.display=ctx.display;
      note.hidden=ctx.display==='hidden';
      if(ctx.display==='toast')note.classList.add('instruction-toast');
      const stage=u.el('div','stage',center);

      let submit=null;
      if(!ctx.finish){
        if(placement==='task'){
          submit=u.el('button','submit placement-task',center,label);
        }else if(placement==='header'){
          submit=u.el('button','submit placement-header',title,label);
        }else if(placement==='footer'){
          const foot=u.el('div','episode-footer',center);
          submit=u.el('button','submit placement-footer',foot,label);
        }else{
          submit=u.el('a','submit-link placement-link',heading,label+' ›');
        }
        submit.type='button';
        submit.setAttribute('aria-label',label);
        submit.title=label;
        submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
      }

      const cr=ctx.rng.fork('chrome/collide');
      if(!ctx.finish&&cr.bool(0.3)){
        const pool=Array.isArray(labels)&&labels.length?labels.map(x=>String(x)):['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
        const options=[...new Set(pool)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
        if(options.length){
          const collision=cr.pick(options);
          const decoy=u.el('button','end-xtra',title,collision);
          decoy.type='button';
          decoy.addEventListener('click',()=>env.log('decoy',{label:collision,collide:true}));
        }
      }
      return{stage,submit};
    },
    overlay(ctx){
      const u=ctx.util;const el=u.el('section','perturb tip-window',document.body);
      const head=u.el('header','tip-head',el);u.el('strong','',head,'Tip of the day');
      const x=u.el('button','tip-x',head,'×');x.type='button';x.setAttribute('aria-label','Close');x.addEventListener('click',ctx.dismiss);
      const content=u.el('div','tip-content',el);u.el('span','bulb',content,'♧');
      u.el('p','',content,'You can also use your mouse wheel to adjust numeric values quickly.');
      const foot=u.el('footer','tip-foot',el);const label=u.el('label','dont-show',foot);
      const check=u.el('input','',label);check.type='checkbox';u.el('span','',label,'Do not show again');
      const close=u.el('button','dismiss',foot,'Close');close.type='button';close.addEventListener('click',ctx.dismiss);
      return{el,dismiss:close};
    }
  });
})();
