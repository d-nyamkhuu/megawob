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
  const END_FALLBACK=['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
  const labelOf=(value)=>(typeof value==='string'?value:value&&(value.label||value.text||value.name))||String(value);
  function endLabel(rng, content) {
    const labels=content&&Array.isArray(content.END_LABELS)&&content.END_LABELS.length?content.END_LABELS:END_FALLBACK;
    return labelOf(rng.pick(labels));
  }
  env.site({name:'design-set-slider-multi-10',styles:['fluent.css'],scripts:[],
    frame(ctx) {
      const u=ctx.util;
      document.body.className=`fluent instruction-${ctx.display}`;
      let display=ctx.display;
      if((display==='panel'||display==='toast')&&(window.innerWidth<1180||window.innerHeight<680))display='header';
      document.body.dataset.instruction=display;
      const title=u.el('header','fl-title',document.body);
      const ico=env.util.svg('svg',{viewBox:'0 0 24 24',class:'fl-icon','aria-hidden':'true'},title);
      const iconDefs=env.util.svg('defs',{},ico);
      const iconGradient=env.util.svg('linearGradient',{id:'vista-icon',x1:0,y1:0,x2:0,y2:1},iconDefs);
      env.util.svg('stop',{offset:0,'stop-color':'#8ac9ff'},iconGradient);
      env.util.svg('stop',{offset:1,'stop-color':'#236bd5'},iconGradient);
      env.util.svg('rect',{x:0,y:1,width:24,height:22,rx:5,fill:'url(#vista-icon)'},ico);
      env.util.svg('path',{d:'M2 17l6-9 4 6 3-9 7 12z',fill:'#fff'},ico);
      env.util.svg('path',{d:'M8 8l4 6h-6z',fill:'#dceeff'},ico);
      u.el('span','fl-appname',title,'VistaEdit');
      const endRng=ctx.rng.fork('chrome/end');
      const chosen=ctx.finish?null:endRng.pick(['default','default','default','default','footer','header','link','link']);
      const placement=chosen==='default'||chosen==='footer'?'footer':chosen;
      const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:END_FALLBACK;
      const standard=labels.find(x=>labelOf(x).trim().toLowerCase()==='submit')||'Submit';
      const label=!chosen?null:chosen==='default'?labelOf(standard):endLabel(endRng,ctx.content);
      const collideRng=ctx.rng.fork('chrome/collide');
      let collide=null;
      if(!ctx.finish&&collideRng.bool(.3)){
        const choices=[...new Set(labels.map(labelOf))].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
        if(choices.length)collide={label:collideRng.pick(choices),where:collideRng.pick(['header','footer'])};
      }
      const decoy=(parent,text)=>{const b=u.el('button','fl-xtra',parent,text);b.type='button';b.dataset.role='xtra';b.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));return b;};
      const endButton=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.addEventListener('click',()=>ctx.submit());return b;};
      if(collide&&collide.where==='header')decoy(title,collide.label);
      let submit=null;
      if(placement==='header')submit=endButton(title,'fl-end-header',label);
      const wc=u.el('div','fl-wc',title);
      const wsvg=(d)=>{const s=env.util.svg('svg',{viewBox:'0 0 12 12',class:'fl-wbtn','aria-hidden':'true'},wc);env.util.svg('path',{d,fill:'none',stroke:'#222','stroke-width':1},s);};
      wsvg('M1 6h10');wsvg('M1.5 1.5h9v9h-9z');wsvg('M1 1l10 10M11 1L1 11');
      const instruction=u.el('div','instruction fl-instruction',document.body);
      const instructionText=u.el('span','fl-instruction-text',instruction);
      const trailing=ctx.instruction.search(/(?:Drag the|Use the handles|Use handles|Click the)/);
      if(trailing>0){
        u.el('strong','',instructionText,ctx.instruction.slice(0,trailing));
        u.el('span','',instructionText,ctx.instruction.slice(trailing));
      }else instructionText.textContent=ctx.instruction;
      if(display==='hidden')instruction.hidden=true;
      if(display==='panel'||display==='toast'){
        instruction.classList.add(display==='panel'?'fl-instruction-panel':'fl-instruction-toast');
      }
      if(display==='toast'){
        const close=u.el('button','instruction-close',instruction,'Close');
        close.onclick=()=>{instruction.hidden=true;};
      }
      const stage=u.el('main','fl-stage',document.body);stage.dataset.role='stage';
      const photo=u.el('div','fl-photo',document.body);
      photo.setAttribute('aria-hidden','true');
      const footer=u.el('footer','fl-footer',document.body);
      const settings=u.el('div','fl-settings',footer);
      const gear=env.util.svg('svg',{viewBox:'0 0 24 24',class:'fl-gear','aria-hidden':'true'},settings);
      env.util.svg('circle',{cx:12,cy:12,r:3.2,fill:'none',stroke:'#222','stroke-width':1.6},gear);
      env.util.svg('path',{d:'M9 3l1-1h4l1 3 2 1 3-1 2 3-2 2v3l2 2-2 3-3-1-2 1-1 3h-4l-1-3-2-1-3 1-2-3 2-2v-3L2 8l2-3 3 1 2-1Z',stroke:'#27334c','stroke-width':1.6,'stroke-linejoin':'round',fill:'none'},gear);
      u.el('span','',settings,'Settings');
      const actions=u.el('div','fl-actions',footer);
      const reset=u.el('button','reset',actions,'Reset');reset.type='button';reset.dataset.action='reset';
      if(collide&&collide.where==='footer')decoy(actions,collide.label);
      if(placement==='footer')submit=endButton(actions,'primary',label);
      if(placement==='link'){
        submit=endButton(actions,'fl-end-link',label+' ›');
      }
      return {stage,submit};
    },
    overlay: drawOverlay,
  });
})();
