(function(){'use strict';
const C={site:'design-solve-puzzle-odd-even-11',task:'solve-puzzle',scenario:'odd-even',style:'material-paper',title:'Number Practice'};
env.site({name:C.site,styles:['site.css'],initialOverlay:{kind:'chat'},frame(ctx){
  document.body.className=C.style+' instruction-'+ctx.display;
  const u=ctx.util,app=u.el('main','app',document.body),top=u.el('header','top',app);
  u.el('span','brand',top,C.title);u.el('span','section-label',top,'Math Skills');
  const tools=u.el('div','chrome-tools',top),er=ctx.rng.fork('chrome/end');
  const referenceEnd=er.bool(0.5),placement=referenceEnd?'footer':er.pick(['header','link']);
  const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
  const labels=ctx.content.END_LABELS.map(labelOf),label=referenceEnd?'Submit':er.pick(labels);
  const center=u.el('div','center',app),brief=u.el('div','brief',center,ctx.display==='hidden'?'':ctx.instruction);
  const stage=u.el('section','stage',center),footer=u.el('footer','bottom',app);
  let submit=null;if(!ctx.finish){
    submit=u.el('button','submit'+(placement==='link'?' end-link':''),placement==='header'?tools:footer,label);
    submit.type='button';submit.title=label;submit.setAttribute('aria-label',label);submit.dataset.role='submit';submit.addEventListener('click',ctx.submit);
    app.classList.add('end-'+placement);
  }
  const cr=ctx.rng.fork('chrome/collide');
  if(cr.bool(0.3)){
    const options=labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
    if(options.length){
      const text=cr.pick(options),decoy=u.el('button','chrome-xtra',tools,text);decoy.type='button';decoy.dataset.role='xtra';
      decoy.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));
    }
  }
  return {stage,submit};
},overlay(ctx){
  const u=ctx.util,drawer=u.el('aside','survey-drawer',document.body),head=u.el('header','survey-head',drawer);
  u.el('strong','',head,'Quick Survey');const close=u.el('button','survey-x',head,'×');close.type='button';close.setAttribute('aria-label','Close survey');close.addEventListener('click',ctx.dismiss);
  u.el('b','survey-lead',drawer,"We'd love your feedback!");u.el('p','survey-intro',drawer,'This short survey helps us improve your learning experience.');
  u.el('p','survey-question',drawer,'How satisfied are you with this activity?');
  const choices=u.el('div','survey-choices',drawer);['Very satisfied','Satisfied','Neutral','Dissatisfied','Very dissatisfied'].forEach(label=>{const row=u.el('div','survey-choice',choices);u.el('i','',row);u.el('span','',row,label);});
  u.el('label','survey-comment-label',drawer,'Any additional comments?');const comment=u.el('div','survey-comment',drawer,'Tell us more (optional)...');
  const dismiss=u.el('button','survey-close',drawer,'Close survey');dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);
  return {el:drawer,dismiss};
}});
})();
