(function(){'use strict';
const C={site:'design-solve-puzzle-hot-cold-12'};
env.site({name:C.site,styles:['site.css'],frame(ctx){
  document.body.className='pixel-workstation';
  const u=ctx.util, app=u.el('main','app',document.body);
  // Keep episode frame choices independent of the task's existing random stream.
  const endRng=ctx.rng.fork('chrome/end');
  const labels=ctx.content.END_LABELS.map(x=>typeof x==='string'?x:(x.label||x.text||x.name));
  const classic=endRng.bool(0.5);
  const placement=classic?'footer':endRng.pick(['header','link']);
  const endLabel=classic?'Submit':endRng.pick(labels.filter(x=>x!=='Submit'));
  let display=ctx.display;
  if(display==='panel'&&(app.clientWidth<1100||app.clientHeight<760))display='header';
  app.classList.add('note-'+display);
  const top=u.el('header','top',app);
  u.el('span','brand-mark',top,'✥');
  u.el('span','brand-name',top,'Treasure Finder');
  u.el('nav','top-links',top,'Maps　|　Help　|　Sign Out');
  const overview=u.el('section','overview',app);
  const search=u.el('div','search-card',overview);
  u.el('strong','search-title',search,'Search Area');
  u.el('div','search-meta',search,'Region:　Pine Lake\nView:　Overhead\nZoom:　100%');
  u.el('div','map-legend',search,'🌲　= Trees\n🪨　= Rocks\n≈　= Water\n⌂　= Cabin');
  const map=u.el('div','map-frame',overview);
  u.el('i','map-rock rock-one',map);
  u.el('i','map-rock rock-two',map);
  u.el('i','map-cabin',map);
  const stage=u.el('section','stage',map);
  const compass=u.el('div','compass-panel',overview);
  u.el('div','compass-rose',compass,'✥');
  u.el('div','scale',compass,'0　　100　　200　　300\nMeters');
  const tabs=u.el('nav','tabs',app);
  for(const [label,on] of [['Find',true],['Map Layers',false],['Preferences',false],['About',false]]){
    const tab=u.el('div','tab'+(on?' active':''),tabs,label);
    if(on)tab.setAttribute('aria-current','page');
  }
  const lower=u.el('section','lower',app);
  const instruction=u.el('div','task-instruction',lower);
  u.el('span','map-icon',instruction,'▧');
  u.el('strong','',instruction,ctx.instruction);
  const left=u.el('section','task-panel',lower);
  u.el('h2','panel-title',left,'Search for the HOT area');
  u.el('div','search-help',left,'Click anywhere on the map above.');
  u.el('div','hint-label',left,'Hints:');
  u.el('div','hint-box',left,'');
  u.el('div','prior-label',left,'Previous click:');
  u.el('div','prior-feedback',left,'❄　 COLD　(farther away)');
  if(display==='hidden')instruction.remove();
  else if(display==='panel')left.insertBefore(instruction,left.querySelector('.search-help'));
  else if(display==='toast')instruction.setAttribute('role','status');
  const right=u.el('section','settings-panel',lower);
  const collapsed=u.el('div','accordion collapsed',right);
  u.el('span','triangle',collapsed,'▶');
  u.el('b','',collapsed,'Task controls');
  u.el('span','hidden-label',collapsed,'(hidden)');
  const show=u.el('button','show-controls',collapsed,'Show controls');
  show.type='button';
  const prefs=u.el('div','accordion expanded',right);
  u.el('div','accordion-head',prefs,'▼　 Preferences');
  const prefBody=u.el('div','pref-body',prefs);
  u.el('span','pref-label',prefBody,'Map style:');
  const fakeSelect=u.el('div','fake-select',prefBody,'Classic　 ▾');
  u.el('span','pref-label labels-label',prefBody,'Show labels:');
  u.el('span','checked',prefBody,'☑　On');
  u.el('span','pref-label terrain-label',prefBody,'Terrain detail:');
  u.el('span','radio-row',prefBody,'◯　Low　　 🔘　Medium　　 ◯　High');
  u.el('span','checked grid-check',prefBody,'☑　Show grid');
  u.el('span','unchecked',prefBody,'□　Show coordinates');
  show.setAttribute('aria-expanded','false');
  show.addEventListener('click',()=>{
    collapsed.classList.toggle('opened');
    const opened=collapsed.classList.contains('opened');
    app.classList.toggle('controls-open',opened);
    show.setAttribute('aria-expanded',String(opened));
    collapsed.querySelector('.triangle').textContent=opened?'▼':'▶';
    show.textContent=opened?'Hide controls':'Show controls';
  });
  const footer=u.el('footer','bottom',app);
  u.el('span','info-icon',footer,'i');
  u.el('span','tip-copy',footer,'Tip:　The hints get warmer as you get closer to the hidden HOT area.');
  let submit=null;
  if(!ctx.finish){
    const parent=placement==='header'?top:placement==='link'?tabs:footer;
    submit=u.el('button','submit'+(placement==='footer'?'':' end-'+placement),parent,endLabel);
    submit.type='button';submit.dataset.role='submit';
    submit.addEventListener('click',ctx.submit);
  }
  const collideRng=ctx.rng.fork('chrome/collide');
  if(collideRng.bool(0.3)){
    const label=collideRng.pick(labels.filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase()));
    const decoy=u.el('button','end-xtra',tabs,label);
    decoy.type='button';decoy.dataset.role='xtra';
    decoy.addEventListener('click',()=>env.log('decoy',{label,collide:true}));
  }
  return {stage,submit};
},overlay(ctx){
  const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
  const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
  u.el('span','',el,messages[ctx.kind]);
  const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
  dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
}});
})();
