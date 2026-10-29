(function(){
  'use strict';
  const C={"site":"design-choose-option-radio-01","brand":"Riverton University","title":"Email Preferences","instruction":"left","rail":"","menu":"Office of Communications","briefTitle":"Instructions"};
  const FALLBACK_END_LABELS=['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
  const labelOf=x=>(typeof x==='string'?x:x&&(x.label||x.text||x.name))||String(x);
  env.site({name:C.site,styles:['site.css'],scripts:[],frame(ctx){
    const u=ctx.util;
    const body=u.el('div','ds-body',document.body);
    body.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(a&&/^#?$/.test(a.getAttribute('href')))e.preventDefault();});
    const content=u.el('div','ds-content',body);
    const main=u.el('div','ds-main',content);
    const side=u.el('aside','ds-brief',main);
    const identity=u.el('div','ds-university',side);
    u.el('a','',identity,'Riverton University').href='#';
    u.el('div','',identity,'Office of Communications');
    const task=u.el('section','ds-academic-task',side);
    u.el('h2','',task,'Task');
    u.el('p','',task,'Update your email preferences for university news and events.');
    if(ctx.display!=='hidden'&&ctx.display!=='toast'){
      const note=u.el('div',ctx.display==='panel'?'ds-instruction ds-panel-instruction':'ds-instruction',task,ctx.instruction);
      note.dataset.display=ctx.display;
    }
    u.el('p','',task,'Then use the action below to save your selection.');
    const help=u.el('section','ds-academic-help',side);
    u.el('h3','',help,'Need help?');
    u.el('p','',help,'If you have questions, please contact the Communications Office at ');
    u.el('a','',help,'news@riverton.edu').href='#';
    const stage=u.el('main','ds-stage',main);
    if(ctx.display==='toast'){
      const n=u.el('aside','ds-toast',content);
      u.el('div','ds-instruction',n,ctx.instruction);
      content.insertBefore(n,main);
    }
    const foot=u.el('footer','ds-footer',content);
    const endRng=ctx.rng.fork('chrome/end');
    const endBank=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:FALLBACK_END_LABELS;
    let placement='footer',label='Submit';
    if(!ctx.finish&&!endRng.bool(0.5)){
      placement=endRng.pick(['brief','footer-link']);
      const alternatives=endBank.map(labelOf).filter(x=>x.trim().toLowerCase()!=='submit');
      if(alternatives.length)label=endRng.pick(alternatives);
    }
    let submit=null;
    const makeSubmit=(parent,cls,text,tag='button')=>{
      const b=u.el(tag,cls,parent,text);
      if(tag==='button')b.type='button';else b.href='#';
      b.dataset.role='submit';
      b.setAttribute('aria-label',label);
      b.title=label;
      b.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
      return b;
    };
    if(!ctx.finish&&placement==='brief')submit=makeSubmit(task,'ds-submit ds-brief-submit',label);
    if(!ctx.finish&&placement==='footer')submit=makeSubmit(foot,'ds-submit',label);
    if(!ctx.finish&&placement==='footer-link')submit=makeSubmit(foot,'ds-cancel-link ds-end-link',label,'a');
    const reset=u.el('button','ds-reset',foot,'Reset');
    reset.type='button';
    reset.addEventListener('click',()=>{const controls=stage.querySelectorAll('input[type=radio]');controls.forEach(el=>el.checked=false);});
    u.el('a','ds-cancel-link',foot,'Cancel').href='#';
    const links=u.el('nav','ds-footer-links',foot);
    ['Privacy Policy','Contact Us','Help'].forEach(t=>u.el('a','',links,t).href='#');
    const collideRng=ctx.rng.fork('chrome/collide');
    if(!ctx.finish&&collideRng.bool(0.3)){
      const same=x=>x.trim().toLowerCase()===label.trim().toLowerCase();
      const pool=[...new Set(endBank.map(labelOf))].filter(x=>!same(x));
      if(pool.length){
        const decoyLabel=collideRng.pick(pool);
        const decoy=u.el('button','ds-xtra',foot,decoyLabel);
        decoy.type='button';
        decoy.dataset.role='xtra';
        decoy.addEventListener('click',()=>env.log('decoy',{label:decoyLabel,collide:true}));
      }
    }
    return{stage,submit};
  },overlay(ctx){
    const u=ctx.util;
    const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);
    el.dataset.role='overlay';
    const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
    u.el('div','',el,texts[ctx.kind]);
    const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
    dismiss.addEventListener('click',()=>ctx.dismiss('close'));
    return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
  }});
})();
