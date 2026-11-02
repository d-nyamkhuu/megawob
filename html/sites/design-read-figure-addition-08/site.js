(function(){
  'use strict';
  const palette={bg:'#f5f2e8',panel:'#fbf9f1',fg:'#111111',muted:'#77756e',line:'#24231f'};
  const parts={
    'frame.placement':(base)=>(_c)=>{
      const rng=_c.rng;
      _c.rng=rng.fork('chrome/site/placement');
      base(_c);
      _c.rng=rng;
      _c.nav=false;
      _c.sidebar=false;
      _c.wantFooter=true;
    },
    'frame.header':()=>(_c)=>{
      const u=_c.util;
      document.body.classList.add('lisa-stationery');
      const app=u.el('main','app',document.body);
      app.dataset.display=_c.display;
      const menu=u.el('header','menu-bar',app);
      const apple=u.svg('svg',{class:'apple-mark',viewBox:'0 0 24 28',width:24,height:28},menu);
      u.svg('path',{d:'M17.8 14.6c0-3.1 2.5-4.6 2.6-4.7-1.4-2.1-3.6-2.4-4.4-2.5-1.9-.2-3.7 1.1-4.7 1.1-1 0-2.5-1.1-4.1-1-2.1 0-4.1 1.2-5.2 3.1-2.2 3.8-.6 9.4 1.6 12.5 1.1 1.5 2.3 3.2 4 3.1 1.6-.1 2.2-1 4.1-1s2.5 1 4.1 1c1.7 0 2.8-1.5 3.8-3.1 1.2-1.7 1.6-3.4 1.6-3.5-.1 0-3.4-1.3-3.4-5zM14.7 5.4c.8-1 1.4-2.3 1.3-3.7-1.2.1-2.7.8-3.6 1.8-.8.9-1.5 2.3-1.3 3.6 1.4.1 2.8-.7 3.6-1.7z',fill:'#111'},apple);
      u.el('nav','menu-items',menu,'File　 Edit　 Format　 Font　 Document　 Window　 Help');
      u.el('span','system-time',menu,'10:24 AM');
      u.el('span','disk-icon',menu,'▣');
      const noteHost=u.el('aside','task-note',app);
      const win=u.el('section','document-window',app);
      const titlebar=u.el('header','document-titlebar',win);
      u.el('span','window-glyph',titlebar,'▧');
      u.el('span','title-stripes',titlebar,'');
      u.el('b','document-title',titlebar,'Addition Worksheet');
      u.el('span','title-stripes right',titlebar,'');
      Object.assign(_c,{app,win,noteHost,header:titlebar});
    },
    'frame.nav':()=>()=>{},
    'frame.instruction':(base)=>(_c)=>{
      const header=_c.header;
      _c.header=_c.noteHost;
      base(_c);
      _c.header=header;
    },
    'frame.tools':(base)=>(_c)=>{base(_c);},
    'frame.body':()=>(_c)=>{
      const u=_c.util;
      const paper=u.el('article','paper',_c.win);
      u.el('div','paper-date',paper,'April 12, 1984');
      u.el('h1','paper-heading',paper,'Mathematics Practice');
      const bottom=u.el('footer','paper-footer',paper);
      const tools=u.el('aside','tool-strip',_c.app);
      ['➤','T','□','○','╳','▦','▨'].forEach((label,i)=>u.el('span','tool tool-'+i,tools,label));
      Object.assign(_c,{body:paper,paper,bottom});
    },
    'frame.panel':(base)=>(_c)=>{
      const body=_c.body;
      _c.body=_c.noteHost;
      base(_c);
      _c.body=body;
    },
    'frame.stage':()=>(_c)=>{
      _c.stage=_c.util.el('section','stage',_c.paper);
    },
    'frame.toast':(base)=>(_c)=>{
      base(_c);
      const note=document.body.querySelector('.ref-note');
      if(note)_c.noteHost.appendChild(note);
    },
    'frame.footer':(base)=>(_c)=>{
      base(_c);
      const foot=document.body.querySelector('.ref-foot');
      _c.bottom.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent='A little practice goes a long way.';
      if(_c.submit&&(_c.placement==='footer'||_c.placement==='link'))_c.submit.classList.add('lisa-paper-end');
      if(_c.submit&&_c.placement==='link')_c.submit.classList.add('lisa-paper-link');
    },
    'frame.floating':(base)=>(_c)=>{
      base(_c);
      const dock=document.body.querySelector('.ref-float-dock');
      if(dock)_c.app.appendChild(dock);
      if(_c.submit&&_c.placement==='floating')_c.submit.classList.add('lisa-floating-end');
    },
    overlay:()=>(ctx)=>{
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your worksheet has been saved.',chat:'Need help with this worksheet?',promo:'Explore another practice worksheet.',banner:'An updated worksheet is available.'};
      u.el('span','',el,messages[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
    }
  };
  env.site({
    name:'design-read-figure-addition-08',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{THEMES:{'design-read-figure-addition-08':palette},LOW_THEME:palette,ACCENTS:['#111111'],LOW_ACCENTS:['#111111'],parts}
  });
})();
