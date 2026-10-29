(function(){'use strict';
const C={site:'design-read-figure-grid-03',task:'read-figure',scenario:'grid'};
env.site({name:C.site,styles:['site.css'],frame(ctx){
  document.body.className='modern-grid instruction-'+ctx.display;
  const u=ctx.util,app=u.el('main','app',document.body);
  const endRng=ctx.rng.fork('chrome/end');
  const endChoices=Array.isArray(ctx.content?.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
  const labelOf=x=>typeof x==='string'?x:(x?.label||x?.text||x?.name||String(x));
  const placement=ctx.finish?null:endRng.pick(['panel','panel','header','footer']);
  const sampledEndLabel=placement?labelOf(endRng.pick(endChoices)) : '';
  const endLabel=placement==='panel'?'Submit':sampledEndLabel;
  const collideRng=ctx.rng.fork('chrome/collide');
  let collide=null;
  if(!ctx.finish&&collideRng.bool(.3)){
    const options=[...new Set(endChoices.map(labelOf))].filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase());
    if(options.length) collide=labelOf(collideRng.pick(options));
  }
  const top=u.el('header','top',app);
  u.el('strong','brand',top,'Coordinate Practice');
  const tools=u.el('nav','toolbar',top);
  u.el('span','mode-label',tools,'Grid Mode');
  const select=u.el('button','mode-active',tools,'Select Point');select.type='button';
  const decoyBtn=(parent,label,collides)=>{const b=u.el('button',collides?'end-xtra end-pq':'end-xtra',parent,label);b.type='button';b.addEventListener('click',()=>env.log('decoy',collides?{label,collide:true}:{label}));return b;};
  if(collide) decoyBtn(tools,collide,true);
  u.el('span','tool-divider',tools,'|');
  const clearTop=u.el('button','clear-top',tools,'Clear');clearTop.type='button';
  const center=u.el('div','center',app);
  const stage=u.el('section','stage',center);
  const aside=u.el('section','task-pane',center);
  u.el('h1','task-heading',aside,ctx.display==='hidden'?'Practice Guide':'Your Task');
  let brief=null,note=null;
  if(ctx.display!=='hidden'){
    note=ctx.display==='header'?aside:u.el('section','task-note note-'+ctx.display,aside);
    if(ctx.display!=='header')u.el('strong','note-caption',note,ctx.display==='toast'?'Task notification':'Task details');
    brief=u.el('div','brief',note,ctx.instruction);
  }
  const instructions=u.el('section','instructions',aside);
  u.el('h2','',instructions,'Instructions');
  const list=u.el('ol','steps',instructions);
  ['Click the requested point on the grid.','Make sure you select the exact intersection of the grid lines.',ctx.finish?'You can clear your selection and try again.':`Then click ${endLabel}.`].forEach((line)=>u.el('li','',list,line));
  if(ctx.display==='toast')aside.append(note);
  const footer=u.el('footer','bottom',app);
  u.el('span','foot-title',footer,'Cartesian Grid Trainer');
  if(collide&&!ctx.finish&&collideRng.pick(['top','footer'])==='footer'){
    const d=tools.querySelector('.end-pq');if(d)d.remove();decoyBtn(footer,collide,true);
  }
  const status=u.el('span','status',footer,'Points: 0/1');
  u.el('span','foot-divider',footer,'|');
  u.el('span','retry',footer,'Try again anytime');
  let submit=null;
  if(!ctx.finish){
    const parent=placement==='header'?tools:placement==='footer'?footer:aside;
    submit=u.el('button',placement==='panel'?'submit':'submit end-'+placement,parent,endLabel);
    submit.type='button';submit.title=endLabel;submit.setAttribute('aria-label',endLabel);submit.addEventListener('click',ctx.submit);
  }
  // Fit long held-out instructions before the widget measures its fixed anchors.
  // The end control keeps its full hit area rather than shrinking under the list.
  if(brief){
    const bottom=aside.getBoundingClientRect().bottom-parseFloat(getComputedStyle(aside).paddingBottom);
    let size=parseFloat(getComputedStyle(brief).fontSize);
    while(aside.lastElementChild.getBoundingClientRect().bottom>bottom+1&&size>20){
      brief.style.fontSize=(--size)+'px';
    }
  }
  clearTop.addEventListener('click',()=>document.querySelector('.reference-reset')?.click());
  return {stage,submit};
},overlay(ctx){
  const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
  const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
  u.el('span','',el,messages[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
}});
})();
