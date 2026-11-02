(function(){
  'use strict';
  const palette={bg:'#151a20',panel:'#1d2833',fg:'#f5f7fa',muted:'#9bb0c4',line:'#3c566c'};
  const parts={
    'frame.layout':(base)=>(_c)=>{
      base(_c);
      document.body.dataset.simonbrief=_c.display;
    },
    'frame.placement':(base)=>(_c)=>{
      base(_c);
      _c.nav=false;_c.sidebar=false;
    },
    'frame.header':()=> (_c)=>{
      const u=_c.util;
      if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
      const selection=window.getSelection();if(selection)selection.removeAllRanges();
      const top=u.el('header','ds-top',document.body);
      const brand=u.el('span','ds-brand',top);
      u.el('i','ds-mark',brand);u.el('span','',brand,'Memory Pads');
      const controls=u.el('div','ds-window-controls',top);
      u.el('span','',controls,'−');u.el('span','',controls,'□');u.el('span','ds-close',controls,'×');
      const shell=u.el('div','ds-body',document.body);
      const content=u.el('div','ds-content',shell);
      Object.assign(_c,{header:top,content,windowControls:controls});
    },
    'frame.nav':()=>()=>{},
    'frame.instruction':(base)=>(_c)=>{
      const header=_c.header;
      _c.header=_c.content;
      base(_c);
      _c.header=header;
      const note=_c.content.querySelector('.ref-instruction');
      if(note){
        const box=_c.util.el('aside','ds-header-note',_c.content);
        note.classList.add('ds-instruction');box.appendChild(note);
      }
    },
    'frame.tools':(base)=>(_c)=>{
      base(_c);
      _c.header.insertBefore(_c.headerTools,_c.windowControls);
    },
    'frame.body':()=> (_c)=>{
      const u=_c.util;
      const main=u.el('div','ds-main',_c.content);
      const gameStage=u.el('main','ds-stage',main);
      const inspector=u.el('aside','ds-inspector',main);
      u.el('h2','ds-inspector-title',inspector,'Game');
      Object.assign(_c,{body:main,gameStage,inspector});
    },
    'frame.panel':(base)=>(_c)=>{
      const body=_c.body;_c.body=_c.inspector;base(_c);_c.body=body;
      const note=_c.inspector.querySelector('.ref-panel');
      if(note){
        note.classList.add('ds-panel-note');
        note.querySelector('.ref-panel-title').classList.add('ds-inspector-label');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
      const u=_c.util,inspector=_c.inspector;
      const readout=(title,value)=>{u.el('div','ds-inspector-label',inspector,title);u.el('div','ds-inspector-value',inspector,value);};
      readout('Level','1');readout('Sequence length','—');
      readout('Your turn',_c.display==='header'||_c.display==='panel'?'Not yet':'Watch');
      u.el('div','ds-rule',inspector);
      u.el('div','ds-inspector-label',inspector,'Progress');
      const progress=u.el('div','ds-progress',inspector);
      for(let i=0;i<3;i++)u.el('i',i===0?'active':'',progress);
      u.el('div','ds-inspector-spacer',inspector);
    },
    'frame.stage':()=> (_c)=>{_c.stage=_c.gameStage;},
    'frame.toast':(base)=>(_c)=>{
      base(_c);
      if(_c.display==='toast'){
        const note=document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note,_c.body);
      }
    },
    'frame.footer':(base)=>(_c)=>{
      base(_c);
      const foot=document.body.querySelector('.ref-foot');
      if(foot)_c.inspector.appendChild(foot);
    },
    'frame.floating':(base)=>(_c)=>{
      base(_c);
      const dock=document.body.querySelector('.ref-float-dock');
      if(dock)_c.inspector.appendChild(dock);
    },
    overlay:()=> (ctx)=>{
      const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  };
  env.site({
    name:'design-act-in-time-simon-02',template:'site/base',langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{THEMES:{'design-act-in-time-simon-02':palette},LOW_THEME:palette,ACCENTS:['#0078d7'],LOW_ACCENTS:['#0078d7'],parts}
  });
})();
