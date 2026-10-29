/* 1994 plain HTML form page: Scene Ledger table, task instruction, sliders, detached preview, native Submit. */
(function () {
  'use strict';
  const COLS = ['#', 'Item', 'Type', 'X', 'Y', 'Z', 'Visible'];
  const ROWS = [
    [1, 'Sun', 'Light', -12, 28, 50, 'Yes'],
    [2, 'Camera', 'Camera', 0, 12, -30, 'Yes'],
    [3, 'Tree', 'Model', 18, 0, 5, 'Yes'],
    [4, 'Rock', 'Model', -7, 0, 12, 'Yes'],
    [5, 'Cabin', 'Model', 25, 0, -10, 'Yes'],
    [6, 'Lake', 'Model', 0, -2, 0, 'Yes'],
    [7, 'Fence', 'Model', -20, 0, 18, 'No'],
    [8, 'Bench', 'Model', 11, 0, -6, 'Yes'],
  ];
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const survey=ctx.kind==='chat';
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Notice',promo:'Special offer',banner:'Service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      if(survey){
        u.el('p','survey-intro',el,'Quick survey (2 questions)');u.el('hr','',el);
        u.el('div','survey-question',el,'1. How easy was it to find what you needed today?');
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
        u.el('p','survey-intro',el,{cookie:'This page can remember your display preferences.',toast:'Your changes were noted.',promo:'Browse our other pages.',banner:'This page is best viewed at 800x600.'}[ctx.kind]);
      }
      const dismiss=u.el('button','survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  function preview(parent) {
    const u = env.util;
    const svg = u.svg('svg', {viewBox:'1251 582 385 279', class:'pv-svg', preserveAspectRatio:'none', 'aria-hidden':'true'}, parent);
    u.svg('image', {href:'sites/design-set-slider-multi-01/assets/scene-reference.webp', width:1672, height:941}, svg);
  }
  env.site({name:'design-set-slider-multi-01',styles:['site.css'],scripts:[],
    frame(ctx) {
      const u=ctx.util;
      const W=document.documentElement.clientWidth,H=document.documentElement.clientHeight;
      const display=(W<1280||H<720)&&['panel','toast'].includes(ctx.display)?'header':ctx.display;
      document.body.className=`plainform instruction-${display}`;
      u.el('h1','page-title',document.body,'Scene Ledger');
      const table=u.el('table','ledger',document.body);
      const head=u.el('tr','',u.el('thead','',table));
      COLS.forEach((c,i)=>u.el('th','c'+i,head,c));
      const tb=u.el('tbody','',table);
      ROWS.forEach((r)=>{
        const tr=u.el('tr','',tb);
        r.forEach((v,i)=>{const td=u.el('td','c'+i,tr,String(v));if((i===2&&v==='Camera')||(i===6&&v==='No'))td.style.fontWeight='bold';});
      });
      u.el('hr','rule',document.body);
      const instruction=u.el('div','instruction',document.body,ctx.instruction);
      if(display==='hidden')instruction.hidden=true;
      if(display==='toast'){
        const close=u.el('button','instruction-close',instruction,'Close');
        close.onclick=()=>{instruction.hidden=true;};
      }
      const stage=u.el('main','record-stage',document.body);stage.dataset.role='stage';
      // Long header notes borrow only the space above the sliders; the widget fits the remaining stage.
      if(display==='header'){
        const top=Math.max(stage.getBoundingClientRect().top,instruction.getBoundingClientRect().bottom+8);
        stage.style.top=top+'px';stage.style.height=Math.max(0,H*.91-top)+'px';
      }
      const pv=u.el('aside','preview',document.body);
      u.el('h2','',pv,'Preview');
      preview(pv);
      u.el('div','pv-cap',pv,'Camera view (live preview)');
      const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
      const labels=ctx.content.END_LABELS.map(labelOf);
      const er=ctx.rng.fork('chrome/end');
      const original=er.bool(.5);
      const placement=original?'reference':er.pick(['header','footer-right','link']);
      const label=original?'Submit':er.pick(labels.filter(x=>x!=='Submit'));
      let submit=null;
      if(!ctx.finish){
        submit=u.el(placement==='link'?'a':'button','submit-btn end-'+placement,document.body,label);
        if(placement==='link')submit.href='#';else submit.type='button';
        submit.dataset.role='submit';submit.title=label;submit.setAttribute('aria-label',label);
        submit.onclick=e=>{e.preventDefault();ctx.submit();};
      }
      const cr=ctx.rng.fork('chrome/collide');
      if(!ctx.finish&&cr.bool(.3)){
        const other=cr.pick(labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase()));
        const decoy=u.el('button','submit-btn end-xtra',document.body,other);
        decoy.type='button';decoy.dataset.role='xtra';
        decoy.onclick=()=>env.log('decoy',{label:other,collide:true});
      }
      const reset=u.el('button','reset',document.body,'Reset');reset.type='button';reset.dataset.action='reset';
      reset.onclick=()=>env.log('decoy',{label:'Reset'});
      return {stage,submit};
    },
    overlay: drawOverlay,
  });
})();
