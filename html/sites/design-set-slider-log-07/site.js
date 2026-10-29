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
  env.site({name:'design-set-slider-log-07',styles:['site.css'],scripts:[],
    frame(ctx) {
      const u=ctx.util;
      document.body.className=`library instruction-${ctx.display}`;
      const left=u.el('div','col-left',document.body);
      const brief=u.el('section','brief',left);
      u.el('div','eyebrow',brief,'INTERACTION TASK');
      const instruction=u.el('div','instruction',brief);
      const text=String(ctx.instruction||'');
      const m=text.match(/(-?\d[\d.,]*\s*\(within\s*[\d.]+%\))/);
      const nl=text.search(/\.\s+(?=[A-Z])/);
      const addText=(parent,s)=>{
        if(!m){parent.append(document.createTextNode(s));return;}
        const i=s.indexOf(m[1]);
        if(i<0){parent.append(document.createTextNode(s));return;}
        parent.append(document.createTextNode(s.slice(0,i)));
        u.el('span','hl',parent,m[1]);
        parent.append(document.createTextNode(s.slice(i+m[1].length)));
      };
      if(nl>0){addText(instruction,text.slice(0,nl+1));instruction.append(document.createElement('br'));addText(instruction,text.slice(nl+1).trim());}
      else addText(instruction,text);
      if(ctx.display==='hidden')instruction.hidden=true;
      if(ctx.display==='toast'){
        const close=u.el('button','instruction-close',instruction,'Close');
        close.onclick=()=>{instruction.hidden=true;};
      }
      const stage=u.el('main','record-stage',left);stage.dataset.role='stage';
      u.el('div','eyebrow control-eyebrow',stage,'CONTROL');
      u.el('div','eyebrow scale-note',stage,'LOGARITHMIC SCALE (×10 EACH STEP)');
      const side=u.el('aside','side',document.body);
      const cell=(cls,title)=>{const c=u.el('div','cell '+cls,side);u.el('div','eyebrow',c,title);return c;};
      const tc=cell('c-target','TARGET');
      const tm=text.match(/(-?\d[\d.,]*)\s*\(within\s*([\d.]+)%\)/);
      const target=u.el('div','big',tc,tm?tm[1]:'');target.dataset.role='target';
      const tolerance=u.el('div','sub',tc,tm?`(within ${tm[2]}%)`:'');tolerance.dataset.role='tolerance';
      const cc=cell('c-current','CURRENT VALUE');
      const cur=u.el('div','big',cc,'');cur.dataset.role='current';
      const actions=u.el('div','actions',side);
      const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
      const labels=ctx.content.END_LABELS.map(labelOf);
      const er=ctx.rng.fork('chrome/end');
      const placement=er.pick(['side','side','header','link']);
      const label=placement==='side'?(labels.find(x=>x==='Submit')||labels[0]):er.pick(labels);
      let submit=null;
      if(!ctx.finish){
        const parent=placement==='header'?brief:actions;
        submit=u.el('button',placement==='header'?'end-header':placement==='link'?'end-link':'primary',parent,label);
        submit.type='button';submit.dataset.role='submit';submit.title=label;
        submit.setAttribute('aria-label',label);submit.onclick=()=>ctx.submit();
        actions.classList.add('end-'+placement);
      }else actions.classList.add('finish-actions');
      const reset=u.el('button','reset',actions,'Reset');reset.type='button';reset.dataset.action='reset';
      reset.addEventListener('click',()=>env.log('decoy',{label:'Reset'}));
      const cr=ctx.rng.fork('chrome/collide');
      if(cr.bool(.3)){
        const options=[...new Set(labels)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
        if(options.length){
          const decoyLabel=cr.pick(options);
          const decoy=u.el('button','end-xtra',actions,decoyLabel);
          decoy.type='button';decoy.dataset.role='xtra';
          decoy.onclick=()=>env.log('decoy',{label:decoyLabel,collide:true});
        }
      }
      return {stage,submit};
    },
    overlay: drawOverlay,
  });
})();
