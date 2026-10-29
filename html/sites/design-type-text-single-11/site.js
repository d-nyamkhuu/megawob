(function(){'use strict';
const C={site:'design-type-text-single-11',menu:['File','Edit','View','Tools','Options'],tabs:['Task','Notes','Plans','Reference','Log'],
  hint:'Type the exact text shown above into the field below.',
  note:'The entry is case-sensitive. Please match the text exactly.'};
env.site({name:C.site,styles:['site.css'],scripts:[],
frame(ctx){
  if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
  const selection=window.getSelection();if(selection)selection.removeAllRanges();
  const u=ctx.util;
  const bar=u.el('header','mt-bar',document.body);
  u.el('span','mt-ws',bar,'Workspace 1');
  const nav=u.el('nav','mt-menu',bar);
  C.menu.forEach(t=>{const s=u.el('span','',nav);u.el('u','',s,t);});
  u.el('span','mt-clock',bar,'Mon Apr 15  1991  10:24 AM');
  const gear=u.el('span','mt-gear',bar);gear.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 2h6l1 4 4 2v8l-4 2-1 4H9l-1-4-4-2V8l4-2zM8 8h8v8H8zM12 2v6m0 8v6M4 12h4m8 0h4"/></svg>';
  const desk=u.el('div','mt-desk',document.body);
  const win=u.el('div','mt-win',desk);
  const tb=u.el('div','mt-title',win);
  u.el('i','mt-box',tb);u.el('b','',tb,'Notebook - Task');u.el('i','mt-box mt-box-r',tb);
  const tabs=u.el('div','mt-tabs',desk);
  C.tabs.forEach((t,i)=>u.el('div','mt-tab'+(i===0?' on':''),tabs,t));
  const page=u.el('main','mt-page',desk);
  const mode=ctx.display;
  if(mode!=='hidden')u.el('h1','mt-instruction ds-instruction mt-instruction-'+mode,page,ctx.instruction);
  if(mode!=='hidden')u.el('hr','mt-rule1',page);
  u.el('p','mt-hint',page,C.hint);
  const stage=u.el('div','mt-stage ds-stage',page);
  let submit=null;
  if(!ctx.finish){
    const er=ctx.rng.fork('chrome/end');
    const placement=er.pick(['page','page','title','footer']);
    const bank=ctx.content&&ctx.content.END_LABELS;
    const labels=Array.isArray(bank)&&bank.length?bank:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete'];
    const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
    const label=er.bool(0.5)?'Submit':labelOf(er.pick(labels));
    const submitParent=placement==='title'?tb:page;
    const cls=placement==='title'?'mt-submit mt-submit-title':placement==='footer'?'mt-submit mt-submit-footer':'mt-submit';
    submit=u.el('button',cls,submitParent,label);submit.type='button';submit.dataset.role='submit';submit.setAttribute('aria-label',label);submit.title=label;submit.addEventListener('click',()=>ctx.submit());
    if(placement==='title')submit.style.order='3';
    if(placement==='footer')submit.dataset.placement='footer';
  }
  const cr=ctx.rng.fork('chrome/collide');
  const endBank=ctx.content&&ctx.content.END_LABELS;
  const endLabels=Array.isArray(endBank)&&endBank.length?endBank:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete'];
  if(cr.bool(0.3)&&!ctx.finish){
    const own=submit.textContent.trim().toLowerCase();
      const choices=endLabels.map(x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x)).filter(x=>String(x).trim().toLowerCase()!==own);
    if(choices.length){
      const decoy=u.el('button','mt-xtra',nav,String(cr.pick(choices)));decoy.type='button';decoy.dataset.role='xtra';
      decoy.addEventListener('click',()=>env.log('decoy',{label:decoy.textContent,collide:true}));
    }
  }
  u.el('hr','mt-rule2',page);
  const note=u.el('div','mt-note',page);
  u.el('b','',note,'Note:');note.append(' '+C.note);
  return{stage,submit};
},
overlay(ctx){
  const u=ctx.util;
  document.body.classList.add('mt-survey');
  const el=u.el('section','mt-drawer ds-overlay-'+ctx.kind,document.body);
  el.dataset.role='overlay';
  const tb=u.el('div','mt-title mt-dtitle',el);
  u.el('i','mt-box',tb);u.el('b','',tb,'User Survey');u.el('i','mt-box mt-box-r',tb);
  const body=u.el('div','mt-dbody',el);
  u.el('p','mt-dintro',body,'Help us improve this application. Please answer a few questions (optional).');
  u.el('hr','mt-drule',body);
  const q=(n,text,opts)=>{u.el('div','mt-q',body,n+'. '+text);opts.forEach(o=>{const r=u.el('div','mt-opt',body);u.el('i','mt-radio',r);r.append(o);});};
  q(1,'How often do you use this type of tool?',['Daily','Weekly','Monthly','Rarely']);
  q(2,'What is your primary role?',['Student','Researcher','Engineer','Manager','Other']);
  u.el('div','mt-q mt-q3',body,'3. Any additional comments?');
  const ta=u.el('div','mt-ta',body);
  const sb=u.el('div','mt-sb',ta);u.el('i','',sb,'▲');u.el('span','',sb);u.el('i','',sb,'▼');
  const dismiss=u.el('button','mt-close',el,'Close survey');
  dismiss.type='button';
  dismiss.addEventListener('click',()=>{document.body.classList.remove('mt-survey');ctx.dismiss('close');});
  return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
}});
})();
