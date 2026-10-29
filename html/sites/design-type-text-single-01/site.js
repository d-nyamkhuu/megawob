(function(){'use strict';
const C={site:'design-type-text-single-01',title:'Library Membership Form',intro:'Please complete the form below. Fields marked with * are required.'};
const END_FALLBACK=['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
const ICONS=[
'<svg viewBox="0 0 26 36" width="100%" height="100%" fill="none" stroke="#111" stroke-width="1.5"><path d="M1 2h15l9 9v23H1z"/><path d="M16 2v9h9"/></svg>',
'<svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="#111" stroke-width="2"><circle cx="13" cy="13" r="9"/><path d="M20 20l9 9"/></svg>',
'<svg viewBox="0 0 20 32" width="100%" height="100%"><text x="10" y="29" text-anchor="middle" font-family="Times New Roman,serif" font-size="38" fill="#111">?</text></svg>'];
env.site({name:C.site,styles:['site.css'],scripts:[],frame(ctx){
if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
const selection=window.getSelection();if(selection)selection.removeAllRanges();
const u=ctx.util;
const mode=ctx.display==='hidden'?'hidden':ctx.display==='toast'?'toast':ctx.display==='panel'?'panel':'header';
const page=u.el('div','ds-page ds-mode-'+mode,document.body);
const b=u.el('aside','ds-brief',page);
if(mode!=='hidden'){
const cls=mode==='panel'?'ds-instruction ds-panel':mode==='toast'?'ds-instruction ds-toast':'ds-instruction';
u.el('div',cls,b,ctx.instruction);
}
const doc=u.el('div','ds-doc',page);
u.el('h1','ds-title',doc,C.title);
u.el('hr','ds-rule',doc);
u.el('p','ds-intro',doc,C.intro);
const stage=u.el('main','ds-stage',doc);
u.el('hr','ds-rule ds-rule2',doc);
const foot=u.el('footer','ds-footer',doc);
let submit=null;
const endR=ctx.rng.fork('chrome/end');
const rawLabels=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:END_FALLBACK;
const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
let endLabel='Submit',placement='footer';
if(!ctx.finish&&!endR.bool(.5)){
const labels=rawLabels.map(labelOf).filter(x=>x.trim().toLowerCase()!=='submit');
if(labels.length)endLabel=endR.pick(labels);
placement=endR.pick(['link','icon','top']);
}
const endButton=(parent,cls,text)=>{
const el=u.el(cls==='ds-endlink'?'a':'button',cls,parent,text);
if(el.tagName==='BUTTON')el.type='button';else el.href='#';
el.dataset.role='submit';el.setAttribute('aria-label',endLabel);el.title=endLabel;
el.addEventListener('click',e=>{e.preventDefault();ctx.submit();});return el;
};
if(!ctx.finish&&placement==='footer')submit=endButton(foot,'ds-submit',endLabel);
if(!ctx.finish&&placement==='link')submit=endButton(foot,'ds-endlink',endLabel+' ›');
if(!ctx.finish&&placement==='top')submit=endButton(doc,'ds-submit ds-top-submit',endLabel);
if(!ctx.finish&&placement==='icon')submit=endButton(doc,'ds-submit ds-top-icon','✓');
const clear=u.el('button','ds-clear',foot,'Clear');clear.type='button';
clear.addEventListener('click',()=>{const fields=stage.querySelectorAll('[data-role="field"]');fields.forEach(field=>{if(!field.disabled){field.value='';field.dispatchEvent(new Event('input',{bubbles:true}));}});});
const tools=u.el('aside','ds-tools',page);
ICONS.forEach((svg,i)=>{const t=u.el('div','ds-tool',tools);t.innerHTML=svg;if(i<2)u.el('hr','ds-trule',tools);});
const collideR=ctx.rng.fork('chrome/collide');
if(collideR.bool(.3)){
const options=[...new Set(rawLabels.map(labelOf))].filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase());
if(options.length){
const label=collideR.pick(options),parent=foot;
const decoy=u.el('button','ds-xtra',parent,label);
decoy.type='button';decoy.dataset.role='xtra';
decoy.addEventListener('click',()=>env.log('decoy',{label,collide:true}));
}
}
return{stage,submit};},
overlay(ctx){const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
u.el('div','',el,texts[ctx.kind]);
const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
dismiss.addEventListener('click',()=>ctx.dismiss('close'));
return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};}});})();
