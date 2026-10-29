(function(){
  'use strict';
  const C={site:'design-read-figure-addition-08'};
  env.site({name:C.site,styles:['site.css'],frame(ctx){
    document.body.className='lisa-stationery';
    const u=ctx.util,app=u.el('main','app',document.body);
    const menu=u.el('header','menu-bar',app);
    const apple=u.svg('svg',{class:'apple-mark',viewBox:'0 0 24 28',width:24,height:28},menu);
    u.svg('path',{d:'M17.8 14.6c0-3.1 2.5-4.6 2.6-4.7-1.4-2.1-3.6-2.4-4.4-2.5-1.9-.2-3.7 1.1-4.7 1.1-1 0-2.5-1.1-4.1-1-2.1 0-4.1 1.2-5.2 3.1-2.2 3.8-.6 9.4 1.6 12.5 1.1 1.5 2.3 3.2 4 3.1 1.6-.1 2.2-1 4.1-1s2.5 1 4.1 1c1.7 0 2.8-1.5 3.8-3.1 1.2-1.7 1.6-3.4 1.6-3.5-.1 0-3.4-1.3-3.4-5zM14.7 5.4c.8-1 1.4-2.3 1.3-3.7-1.2.1-2.7.8-3.6 1.8-.8.9-1.5 2.3-1.3 3.6 1.4.1 2.8-.7 3.6-1.7z',fill:'#111'},apple);
    u.el('nav','menu-items',menu,'File　 Edit　 Format　 Font　 Document　 Window　 Help');
    u.el('span','system-time',menu,'10:24 AM');
    u.el('span','disk-icon',menu,'▣');
    let display=ctx.display||'header';
    if((display==='panel'||display==='toast')&&(ctx.size&&ctx.size.width<1150))display='header';
    app.dataset.display=display;
    const note=u.el('aside','task-note',app);
    if(display!=='hidden'){
      const copy=u.el('div','task-instruction',note,ctx.instruction);
      if(display==='panel')u.el('div','note-rule',note,'Worksheet note');
      if(display==='toast')u.el('div','note-rule',note,'New worksheet');
    }
    const win=u.el('section','document-window',app);
    const titlebar=u.el('header','document-titlebar',win);
    u.el('span','window-glyph',titlebar,'▧');
    u.el('span','title-stripes',titlebar,'');
    u.el('b','document-title',titlebar,'Addition Worksheet');
    u.el('span','title-stripes right',titlebar,'');
    const paper=u.el('article','paper',win);
    const date=u.el('div','paper-date',paper,'April 12, 1984');
    u.el('h1','paper-heading',paper,'Mathematics Practice');
    u.el('p','paper-prompt',paper,'Count the blocks and find the total.');
    const stage=u.el('section','stage',paper);
    const bottom=u.el('footer','paper-footer',paper);
    u.el('span','',bottom,'A little practice goes a long way.');
    const tools=u.el('aside','tool-strip',app);
    ['➤','T','□','○','╳','▦','▨'].forEach((label,i)=>u.el('span','tool tool-'+i,tools,label));
    let submit=null;
    if(!ctx.finish){
      const er=ctx.rng.fork('chrome/end');
      const placement=er.pick(['left','left','left','left','left','title','paper']);
      const labels=ctx.content&&ctx.content.END_LABELS;
      let label='Submit';
      if(!er.bool(.5)&&Array.isArray(labels)&&labels.length){
        const options=labels.map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x))).filter(x=>x.toLowerCase()!=='submit');
        if(options.length)label=er.pick(options);
      }
      if(placement==='left'){
        submit=u.el('button','submit',app,label);
      }else if(placement==='title'){
        submit=u.el('button','submit submit-title',titlebar,label);
      }else{
        submit=u.el('button','submit submit-paper',paper,label);
      }
      submit.type='button';submit.setAttribute('aria-label',label);submit.title=label;submit.dataset.role='submit';submit.addEventListener('click',ctx.submit);
      const cr=ctx.rng.fork('chrome/collide');
      if(cr.bool(.3)){
        const pool=Array.isArray(labels)?labels.map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x))):['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
        const options=[...new Set(pool)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
        if(options.length){
          const decoy=u.el('button','pq-xtra',titlebar,cr.pick(options));decoy.type='button';decoy.dataset.role='xtra';
          decoy.addEventListener('click',()=>env.log('decoy',{label:decoy.textContent,collide:true}));
        }
      }
    }
    return {stage,submit};
  },overlay(ctx){
    const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
    const messages={cookie:'This application stores preferences on your device.',toast:'Your worksheet has been saved.',chat:'Need help with this worksheet?',promo:'Explore another practice worksheet.',banner:'An updated worksheet is available.'};
    u.el('span','',el,messages[ctx.kind]);
    const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
    dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
  }});
})();
