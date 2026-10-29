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
  env.site({name:'design-set-slider-horizontal-09',styles:['site.css'],scripts:[],
    frame(ctx) {
      const u=ctx.util;
      document.body.className=`library instruction-${ctx.display}`;
      const head=u.el('header','library-header',document.body);
      u.el('h1','',head,'Willow & Birch');
      u.el('div','bar',head);
      u.el('div','motto',head,'Photo Studio');
      u.el('div','established',head,'Simple tools. Brighter stories.');
      const main=u.el('div','library-main',document.body);
      const photo=u.el('section','photo-pane',main);
      const pic=u.el('div','photo',photo);
      const sv=env.util.svg('svg',{viewBox:'0 0 900 700',preserveAspectRatio:'none',class:'scene','aria-hidden':'true'},pic);
      const S=(t,a,p)=>env.util.svg(t,a,p||sv);
      const defs=S('defs',{});
      const g1=S('linearGradient',{id:'sky',x1:0,y1:0,x2:0,y2:1},defs);
      S('stop',{offset:0,'stop-color':'#bdbcbc'},g1);S('stop',{offset:.6,'stop-color':'#dfc3b0'},g1);S('stop',{offset:1,'stop-color':'#efc8a6'},g1);
      const g2=S('linearGradient',{id:'wat',x1:0,y1:0,x2:0,y2:1},defs);
      S('stop',{offset:0,'stop-color':'#b2a398'},g2);S('stop',{offset:.5,'stop-color':'#8a9594'},g2);S('stop',{offset:1,'stop-color':'#6f7c80'},g2);
      S('rect',{x:0,y:0,width:900,height:700,fill:'url(#sky)'});
      S('path',{d:'M0 330 L90 280 L170 300 L260 250 L350 235 L440 165 L520 190 L640 215 L760 180 L900 165 L900 360 L0 360Z',fill:'#8b8f95'});
      S('path',{d:'M0 330 L80 345 L180 330 L300 360 L900 360 L900 190 L800 235 L700 270 L560 330Z',fill:'#767f84'});
      S('path',{d:'M0 360 L900 360 L900 375 L0 375Z',fill:'#5f6b62'});
      S('rect',{x:0,y:365,width:900,height:335,fill:'url(#wat)'});
      S('path',{d:'M0 360 L0 300 Q100 285 200 310 L330 300 L330 360Z',fill:'#6f7a78',opacity:.8});
      S('path',{d:'M520 360 Q640 330 780 342 Q860 335 900 345 L900 372 L520 372Z',fill:'#4f6150'});
      S('rect',{x:0,y:372,width:900,height:12,fill:'#b8a79a',opacity:.25});
      for(let k=0;k<7;k++)S('rect',{x:40+k*120,y:430+k*37%160,width:260,height:2,fill:'#e8d3c3',opacity:.35});
      S('path',{d:'M60 405 Q200 385 360 392 Q560 385 680 408 Q500 418 300 414 Q150 420 60 405Z',fill:'#6a6b58'});
      for(const [x,y,h,c] of [[225,395,135,'#445640'],[300,395,175,'#3d5239'],[355,395,150,'#445640'],[400,395,90,'#59663a'],[440,395,140,'#3d5239'],[490,395,115,'#445640']]){
        S('path',{d:`M${x} ${y-h} L${x+28} ${y-h*.35} L${x+14} ${y-h*.35} L${x+34} ${y} L${x-34} ${y} L${x-14} ${y-h*.35} L${x-28} ${y-h*.35}Z`,fill:c});
        S('path',{d:`M${x-4} ${y+8} L${x+4} ${y+8} L${x+10} ${y+h*.9} L${x-10} ${y+h*.9}Z`,fill:c,opacity:.45});
      }
      const task=u.el('section','catalog-task',main);
      u.el('h2','',task,'Edit Image');
      const mode=ctx.display||'header';
      const instruction=u.el('div',`instruction instruction-${mode}`+(ctx.instruction.length<65?' instruction-short':''),task,ctx.instruction);
      if(mode==='hidden')instruction.hidden=true;
      const stage=u.el('main','record-stage',task);stage.dataset.role='stage';
      const actions=u.el('div','footer-actions'+(ctx.finish?' finish-mode':''),task);
      const reset=u.el('button','reset',actions,'Reset');reset.type='button';reset.dataset.action='reset';
      let submit=null;
      let collide=null;
      if(!ctx.finish){
        const endRng=ctx.rng.fork('chrome/end');
        const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
        const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
        const label=labelOf(endRng.pick(labels));
        const placement=endRng.pick(['footer','footer','header','link']);
        const end=(parent,cls,text)=>{
          const b=u.el(cls==='end-link'?'a':'button',cls,parent,text);
          if(b.tagName==='BUTTON')b.type='button';else b.href='#';
          b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;
          b.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
          return b;
        };
        if(placement==='header')submit=end(head,'header-submit',label);
        else if(placement==='link')submit=end(actions,'end-link',`${label} ›`);
        else submit=end(actions,'primary',label);
        const collideRng=ctx.rng.fork('chrome/collide');
        if(collideRng.bool(0.3)){
          const same=x=>labelOf(x).trim().toLowerCase()===label.trim().toLowerCase();
          const choices=[...new Set(labels.map(labelOf).filter(x=>!same(x)))];
          if(choices.length)collide={label:collideRng.pick(choices),where:collideRng.pick(['header','footer'])};
        }
      }
      const footer=u.el('footer','library-footer',document.body);
      const footerLeft=u.el('div','footer-left',footer,'Edit  /  Refine  /  Export');
      if(collide){
        const parent=collide.where==='header'?head:footerLeft;
        const d=u.el('button','pq-xtra',parent,collide.label);d.type='button';d.dataset.role='xtra';
        d.addEventListener('click',()=>env.log('decoy',{label:collide.label,collide:true}));
      }
      u.el('div','',footer,'Beauty lives in a calmer light.');
      return {stage,submit};
    },
    overlay: drawOverlay,
  });
})();
