(function(){
  'use strict';
  const C={site:'design-act-in-time-delay-08'};
  env.site({
    name:C.site,
    styles:['site.css'],
    scripts:[],
    frame(ctx){
      if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
      const selection=window.getSelection();if(selection)selection.removeAllRanges();
      const u=ctx.util;
      const header=u.el('header','rm-header',document.body);
      const brand=u.el('div','rm-brand',header);
      u.el('span','rm-leaf',brand,'◢');
      const word=u.el('div','',brand);u.el('b','',word,'Rivermere');u.el('small','',word,'Learning');
      const tools=u.el('div','rm-header-tools',header);
      u.el('div','rm-module',tools,'Module 3　|　Task 2 of 4');
      const rule=u.el('div','rm-rule',document.body);
      const layout=u.el('div','rm-layout',document.body);
      const stage=u.el('main','ds-stage rm-document',layout);
      const margin=u.el('aside','rm-margin',layout);
      const timed=u.el('div','rm-timed',margin);
      u.el('span','rm-clockicon',timed,'◷');
      const summary=u.el('div','rm-summary',timed);
      u.el('strong','',summary,'Timed Task');
      u.el('p','',summary,'The next button will be enabled when the task clock reaches 00:10.');
      const readout=u.el('div','rm-readout',timed,'00:00 / 00:10');
      const mode=ctx.display;
      if(mode!=='hidden'){
        const note=u.el(mode==='header'?'header':'section',mode==='toast'?'rm-instruction rm-notice':mode==='header'?'rm-instruction rm-header-instruction':'rm-instruction rm-panel-instruction',margin);
        if(mode==='panel')u.el('div','rm-kicker',note,'Task instructions');
        u.el('h1','',note,ctx.instruction);
      }
      const notes=u.el('section','rm-notes',margin);
      u.el('h2','',notes,'Notes');
      const ul=u.el('ul','',notes);
      ['The “Next” button is disabled until the task clock reaches 00:10.','It will then become enabled automatically.','You do not need to take any other action in this step.'].forEach(t=>u.el('li','',ul,t));
      const foot=u.el('footer','rm-actions',margin);
      u.el('div','rm-task-actions',foot);
      let submit=null;
      if(!ctx.finish){
        const er=ctx.rng.fork('chrome/end'), cr=ctx.rng.fork('chrome/collide'), dr=ctx.rng.fork('chrome/decoy');
        const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)?ctx.content.END_LABELS.map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x))):['Done','Finish','Continue','Save','OK','Confirm','Apply'];
        const sampledLabel=er.bool(0.5)?'Submit':er.pick(labels.filter(x=>x.toLowerCase()!=='submit').length?labels.filter(x=>x.toLowerCase()!=='submit'):['Done']), sampledStyle=er.pick(['button','button','button','button','button','button','link','icon']);
        const pr=ctx.rng.fork('chrome/end-placement');
        const placement=pr.pick(['footer','header','footer','link']);
        const label=placement==='footer'?'Submit':sampledLabel.toLowerCase()==='submit'?pr.pick(labels.filter(x=>x.toLowerCase()!=='submit')):sampledLabel;
        const host=placement==='header'?tools:placement==='link'?u.el('div','rm-complete-line',margin):u.el('div','rm-end-actions',foot);
        const icon=placement==='header'&&sampledStyle==='icon';
        submit=u.el(placement==='link'?'a':'button','ds-submit rm-submit rm-end-'+placement+(placement==='link'?' rm-submit-link':'')+(icon?' rm-submit-icon':''),host,icon?'✓':label);
        if(placement==='link')submit.href='#';else submit.type='button';
        submit.dataset.role='submit';submit.setAttribute('aria-label',label);submit.title=label;
        submit.addEventListener('click',e=>{e.preventDefault();ctx.submit()});
        if(dr.bool(0.3)){
          const decoys=ctx.content&&Array.isArray(ctx.content.DECOY_LABELS)?ctx.content.DECOY_LABELS.map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x))):['Help','Feedback','Preview','Save draft','Reset view','Share','Export','History'];
          const d=u.el('button','rm-xtra',tools,dr.pick(decoys));d.type='button';d.dataset.role='xtra';
          d.addEventListener('click',()=>env.log('decoy',{label:d.textContent}));
        }
        if(cr.bool(0.3)){
          const other=labels.filter(x=>x.toLowerCase()!==label.toLowerCase());
          const d=u.el('button','rm-pq',tools,cr.pick(other));d.type='button';d.dataset.role='xtra';
          d.addEventListener('click',()=>env.log('decoy',{label:d.textContent,collide:true}));
        }
      }
      return{stage,submit};
    },
    overlay(ctx){
      const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  });
})();
