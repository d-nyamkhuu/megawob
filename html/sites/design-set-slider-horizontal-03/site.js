/* Rivermere library: native HTML catalog frame, seeded task instruction and dismissible survey. */
(function () {
  'use strict';
  function books(parent) {
    const svg = env.util.svg('svg', {viewBox:'0 0 100 100',class:'books', 'aria-hidden':'true'}, parent);
    const u = env.util;
    u.svg('ellipse',{cx:50,cy:86,rx:44,ry:7,fill:'#c9c4b7'},svg);
    for (const [x,y,w,h,color,angle] of [[12,17,14,68,'#c1a17d',8],[31,13,16,74,'#be986d',1],[47,9,19,79,'#994527',0],[67,17,22,68,'#954c32',-2]]) {
      const g=u.svg('g',{transform:`rotate(${angle} ${x+w/2} ${y+h})`},svg);
      u.svg('path',{d:`M${x} ${y}l6 -3h${w}v${h}l-6 3h-${w}Z`,fill:color,stroke:'#50392b','stroke-width':1.4},g);
      u.svg('path',{d:`M${x} ${y}h${w}v${h}M${x+w} ${y}l6 -3M${x+3} ${y+6}h${w-6}M${x+3} ${y+11}h${w-6}M${x+3} ${y+h-8}h${w-6}`,fill:'none',stroke:'#513b2c'},g);
      u.svg('path',{d:`M${x+4} ${y+18}h${w-8}M${x+4} ${y+21}h${w-8}`,stroke:'#dabf96',fill:'none'},g);
    }
  }
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const survey=ctx.kind==='chat';
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Catalog notice',promo:'Support your library',banner:'Library service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      if(survey){
        u.el('p','survey-intro',el,'Quick survey (2 questions)');u.el('hr','',el);
        const q1=u.el('div','survey-question',el,'1. How easy was it to find what you needed today?');
        const choices=u.el('div','survey-choices',el);
        ['Very easy','Somewhat easy','Neither easy nor difficult','Somewhat difficult','Very difficult'].forEach((label)=>{
          const row=u.el('label','',choices);const radio=u.el('input','',row);radio.type='radio';radio.name='ease';radio.value=label;u.el('span','',row,label);
        });
        u.el('div','survey-question second',el,'2. What could we improve?');
        const dropdown=u.el('div','survey-dropdown',el);
        const toggle=u.el('button','survey-select',dropdown,'Select an option…');toggle.type='button';toggle.setAttribute('aria-expanded','false');
        const options=u.el('div','survey-options',dropdown);options.hidden=true;
        for(const label of ['Finding records','Image quality','Help and guidance']){const b=u.el('button','',options,label);b.type='button';b.onclick=()=>{toggle.textContent=label;options.hidden=true;toggle.setAttribute('aria-expanded','false');};}
        toggle.onclick=()=>{options.hidden=!options.hidden;toggle.setAttribute('aria-expanded',String(!options.hidden));};
      }else{
        u.el('p','survey-intro',el,{cookie:'This local catalog can remember your display preferences.',toast:'The record is ready for editing.',promo:'Discover the library’s growing digital archive.',banner:'The digital catalog is available offline.'}[ctx.kind]);
      }
      const dismiss=u.el('button','primary survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  env.site({name:'design-set-slider-horizontal-03',styles:['site.css'],scripts:[],
    frame(ctx) {
      const u=ctx.util;
      document.body.className=`library instruction-${ctx.display}`;
      if(ctx.finish)document.body.classList.add('finish-mode');
      const main=u.el('div','library-main',document.body);
      const stage=u.el('main','record-stage',main);stage.dataset.role='stage';
      const head=u.el('header','library-header',main);
      const brand=u.el('div','brand',head);
      u.el('h1','',brand,'Palette');
      u.el('div','motto',brand,'SIMPLE IMAGE TOOLS');
      const spark=u.svg('svg',{viewBox:'0 0 50 50',class:'spark','aria-hidden':'true'},head);
      u.svg('path',{d:'M20 5 L8 29',stroke:'#ff8b82','stroke-width':11,'stroke-linecap':'round'},spark);
      u.svg('path',{d:'M40 33 L22 43',stroke:'#ff8b82','stroke-width':11,'stroke-linecap':'round'},spark);
      const deco=u.el('div','deco',main);
      const dsvg=u.svg('svg',{viewBox:'0 0 100 100',class:'deco-svg','aria-hidden':'true',preserveAspectRatio:'none'},deco);
      u.svg('circle',{cx:0,cy:100,r:100,fill:'#ff8b82'},dsvg);
      u.svg('polygon',{points:'0,60 100,0 80,100 20,100',fill:'#a994e8',class:'tri'},dsvg);
      const sq=u.svg('svg',{viewBox:'0 0 180 75',class:'squiggle','aria-hidden':'true'},deco);
      const defs=u.svg('defs',{},sq);
      const fade=u.svg('linearGradient',{id:'squiggle-fade',x1:'0%',x2:'100%'},defs);
      u.svg('stop',{offset:'70%','stop-color':'#aa95ee'},fade);
      u.svg('stop',{offset:'100%','stop-color':'#dfd2fb'},fade);
      u.svg('path',{d:'M7 64 C24 58 28 80 42 66 S50 37 71 48 S91 60 100 39 S111 24 130 31 S147 33 151 19 S167 4 180 15',fill:'none',stroke:'url(#squiggle-fade)','stroke-width':7,'stroke-linecap':'round'},sq);
      const task=u.el('aside','catalog-task',main);
      u.el('div','corner',task);
      u.el('div','dots',task);
      u.el('div','task-label',task,'YOUR TASK');
      const instruction=u.el('div','instruction',task,ctx.instruction);
      if(ctx.instruction.length>50)instruction.classList.add('long-instruction');
      if(ctx.display==='hidden')instruction.hidden=true;
      if(ctx.display==='panel')instruction.classList.add('instruction-card');
      if(ctx.display==='toast')instruction.classList.add('instruction-toast');
      if(ctx.display==='toast'){
        const close=u.el('button','instruction-close',instruction,'Close');
        close.onclick=()=>{instruction.hidden=true;};
      }
      const actions=u.el('div','footer-actions',task);
      let submit=null;
      if(!ctx.finish){
        const er=ctx.rng.fork('chrome/end');
        const labels=(ctx.content&&ctx.content.END_LABELS)||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
        const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
        const defaultLabel=labels.find(x=>labelOf(x).trim().toLowerCase()==='submit');
        const alternatives=labels.filter(x=>labelOf(x).trim().toLowerCase()!=='submit');
        const label=er.bool(.5)?labelOf(defaultLabel||'Submit'):labelOf(alternatives.length?er.pick(alternatives):defaultLabel||'Submit');
        const placement=er.pick(['panel','panel','bottom','link']);
        document.body.classList.add(`end-${placement}`);
        const tag=placement==='link'?'a':'button';
        submit=u.el(tag,placement==='link'?'end-link':'primary',actions,label);
        if(tag==='button')submit.type='button';else submit.href='#';
        submit.dataset.role='submit';submit.setAttribute('aria-label',label);submit.title=label;
        submit.onclick=e=>{e.preventDefault();ctx.submit();};

        const cr=ctx.rng.fork('chrome/collide');
        if(cr.bool(.3)){
          const same=x=>labelOf(x).trim().toLowerCase()===label.trim().toLowerCase();
          const choices=[...new Set(labels.map(labelOf))].filter(x=>!same(x));
          if(choices.length){
            const text=labelOf(cr.pick(choices));
            const decoy=u.el('button','end-xtra',actions,text);decoy.type='button';decoy.dataset.role='xtra';
            decoy.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));
          }
        }
      }
      const reset=u.el('button','reset',actions,'Reset');reset.type='button';reset.dataset.action='reset';
      return {stage,submit};
    },
    overlay: drawOverlay,
  });
})();
