/* Civic-service frame, seeded task instruction and dismissible episode notices. */
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
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Display settings notice',promo:'Community services',banner:'City service notice'}[ctx.kind];
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
        u.el('p','survey-intro',el,{cookie:'This service can remember your display preferences.',toast:'The display settings are ready for editing.',promo:'Explore your city’s community services.',banner:'Display settings are available offline.'}[ctx.kind]);
      }
      const dismiss=u.el('button','primary survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  function labelOf(value) { return (typeof value==='string'?value:value&&(value.label||value.text||value.name))||String(value); }
  env.site({name:'design-set-slider-vertical-02',styles:['site.css'],scripts:[],
    frame(ctx) {
      const u=ctx.util;
      document.body.className=`library civic instruction-${ctx.display}`;
      const head=u.el('header','civic-header',document.body);
      const logo=u.svg('svg',{viewBox:'0 0 60 56',class:'civic-logo','aria-hidden':'true'},head);
      u.svg('path',{d:'M30 2 L58 16 V22 H2 V16 Z',fill:'#fff'},logo);
      for(const x of [10,26,42])u.svg('rect',{x:x,y:22,width:8,height:26,fill:'#fff'},logo);
      u.svg('rect',{x:2,y:48,width:56,height:6,fill:'#fff'},logo);
      const brand=u.el('div','civic-brand',head);
      u.el('div','civic-name',brand,'Riverton City');
      u.el('div','civic-sub',brand,'Community Services');
      const nav=u.el('nav','civic-nav',head);
      for(const t of ['My Account','Help','Sign Out'])u.el('span','',nav,t);
      const endRng=ctx.rng.fork('chrome/end');
      const endLabels=ctx.content&&ctx.content.END_LABELS;
      const labels=Array.isArray(endLabels)&&endLabels.length?endLabels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
      const placement=ctx.finish?null:endRng.pick(['footer','footer','header','link']);
      const defaultLabel=labels.find(x=>labelOf(x).trim().toLowerCase()==='submit');
      const label=placement==='footer'&&defaultLabel?labelOf(defaultLabel):labelOf(endRng.pick(labels));
      const collideRng=ctx.rng.fork('chrome/collide');
      let collide=null;
      if(!ctx.finish&&collideRng.bool(0.3)){
        const options=labels.map(labelOf).filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
        if(options.length)collide=collideRng.pick(options);
      }
      const decoyBtn=(parent,text,isCollide)=>{
        const b=u.el('button','civic-xtra',parent,text);b.type='button';b.dataset.role='xtra';
        b.addEventListener('click',()=>env.log('decoy',isCollide?{label:text,collide:true}:{label:text}));
        return b;
      };
      const endBtn=(parent,cls)=>{
        const b=u.el('button',cls,parent,label);b.type='button';b.dataset.role='submit';
        b.setAttribute('aria-label',label);b.title=label;b.onclick=()=>ctx.submit();return b;
      };
      let headerSubmit=null;
      if(placement==='header'){
        const tools=u.el('div','civic-header-tools',head);
        if(collide)decoyBtn(tools,collide,true);
        headerSubmit=endBtn(tools,'civic-header-submit');
      }else if(collide){decoyBtn(nav,collide,true);}
      const main=u.el('div','civic-main',document.body);
      const instruction=u.el('h1','instruction',main,ctx.instruction);
      if(ctx.display==='hidden')instruction.hidden=true;
      if(ctx.display==='panel'||ctx.display==='toast'){
        instruction.classList.add(ctx.display==='panel'?'instruction-panel':'instruction-toast');
      }
      if(ctx.display==='toast'){
        const close=u.el('button','instruction-close',instruction,'×');
        close.setAttribute('aria-label','Close instruction');
        close.onclick=()=>{instruction.hidden=true;};
      }
      u.el('p','civic-hint',main,'Adjust the setting using the slider on the right. The current value is shown below the slider.');
      const stage=u.el('main','record-stage',document.body);stage.dataset.role='stage';
      const footer=u.el('footer','civic-footer',document.body);
      const actions=u.el('div','footer-actions',footer);
      let submit=null;
      if(!ctx.finish&&placement==='footer')submit=endBtn(actions,'primary');
      if(!ctx.finish&&placement==='link'){
        const link=u.el('a','civic-endlink',document.body,`${label} ›`);link.href='#';link.dataset.role='submit';
        link.setAttribute('aria-label',label);link.title=label;link.onclick=e=>{e.preventDefault();ctx.submit();};submit=link;
      }
      if(headerSubmit)submit=headerSubmit;
      return {stage,submit};
    },
    overlay: drawOverlay,
  });
})();
