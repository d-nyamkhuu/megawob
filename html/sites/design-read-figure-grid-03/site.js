(function(){'use strict';
const palette={bg:'#f4f4ed',panel:'#f4f4ed',fg:'#080a0a',muted:'#666963',line:'#c8c9c3'};
const parts={
  'frame.layout':(base)=>(_c)=>{
    base(_c);
    // The dedicated task pane also fits panel and toast notes at small sizes.
    _c.display=_c.ctx.display||'header';
  },
  'frame.placement':(base)=>(_c)=>{
    base(_c);
    _c.wantFooter=true;
    _c.nav=false;
    _c.sidebar=false;
  },
  'frame.header':()=>(_c)=>{
    const u=_c.util;
    document.body.classList.add('modern-grid','instruction-'+_c.display);
    const app=u.el('main','app',document.body);
    const top=u.el('header','top',app);
    u.el('strong','brand',top,'Coordinate Practice');
    const toolbar=u.el('nav','toolbar',top);
    u.el('span','mode-label',toolbar,'Grid Mode');
    const select=u.el('button','mode-active',toolbar,'Select Point');select.type='button';
    const divider=u.el('span','tool-divider',toolbar,'|');
    const clear=u.el('button','clear-top',toolbar,'Clear');clear.type='button';
    clear.addEventListener('click',()=>document.querySelector('.reference-reset')?.click());
    const aside=u.el('section','task-pane');
    u.el('h1','task-heading',aside,_c.display==='hidden'?'Practice Guide':'Your Task');
    Object.assign(_c,{app,toolbar,divider,clear,aside,header:aside});
  },
  'frame.nav':()=>()=>{},
  'frame.instruction':(base)=>(_c)=>{
    base(_c);
    const note=_c.header.querySelector('.ref-instruction');
    if(note)note.classList.add('brief');
  },
  'frame.tools':(base)=>(_c)=>{
    const header=_c.header;
    _c.header=_c.toolbar;
    base(_c);
    _c.header=header;
    _c.toolbar.append(_c.divider,_c.clear);
  },
  'frame.body':()=>(_c)=>{
    const center=_c.util.el('div','center',_c.app);
    center.append(_c.aside);
    _c.body=center;
  },
  'frame.panel':(base)=>(_c)=>{
    const body=_c.body;
    _c.body=_c.aside;
    base(_c);
    _c.body=body;
    const panel=_c.aside.querySelector('.ref-panel');
    if(panel){
      panel.classList.add('task-note','note-panel');
      const title=panel.querySelector('.ref-panel-title');
      title.classList.add('note-caption');title.textContent='Task details';
      panel.querySelector('.ref-panel-text').classList.add('brief');
    }
  },
  'frame.stage':()=>(_c)=>{
    const u=_c.util;
    const stage=u.el('section','stage',_c.body);
    _c.body.prepend(stage);
    _c.stage=stage;
    const instructions=u.el('section','instructions',_c.aside);
    u.el('h2','',instructions,'Instructions');
    const list=u.el('ol','steps',instructions);
    ['Click the requested point on the grid.','Make sure you select the exact intersection of the grid lines.','You can clear your selection and try again.'].forEach(line=>u.el('li','',list,line));
  },
  'frame.toast':(base)=>(_c)=>{
    base(_c);
    const note=document.querySelector('.ref-note');
    if(note){
      note.classList.add('task-note','note-toast');
      const caption=_c.util.el('strong','note-caption',null,'Task notification');
      note.prepend(caption);
      note.querySelector('.ref-note-text').classList.add('brief');
      _c.aside.append(note);
    }
  },
  'frame.footer':(base)=>(_c)=>{
    base(_c);
    const foot=document.querySelector('.ref-foot');
    foot.classList.add('bottom');
    _c.app.append(foot);
    const title=foot.querySelector('.ref-foot-text');
    title.classList.add('foot-title');title.textContent='Cartesian Grid Trainer';
    const u=_c.util;
    u.el('span','status',foot,'Points: 0/1');
    u.el('span','foot-divider',foot,'|');
    u.el('span','retry',foot,'Try again anytime');
  },
  'frame.floating':(base)=>(_c)=>{
    base(_c);
    const dock=document.querySelector('.ref-float-dock');
    if(dock)_c.aside.append(dock);
    // Fit long instructions before task anchors are measured.
    const brief=_c.aside.querySelector('.brief');
    if(brief){
      const bottom=_c.aside.getBoundingClientRect().bottom-parseFloat(getComputedStyle(_c.aside).paddingBottom);
      let size=parseFloat(getComputedStyle(brief).fontSize);
      while(_c.aside.lastElementChild.getBoundingClientRect().bottom>bottom+1&&size>20){
        brief.style.fontSize=(--size)+'px';
      }
    }
  },
  overlay:()=>(ctx)=>{
    const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
    const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
    u.el('span','',el,messages[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
  }
};
env.site({
  name:'design-read-figure-grid-03',template:'site/base',langs:['en'],
  styles:['templates/site/css/base-hooks.css','site.css'],
  design:{THEMES:{'design-read-figure-grid-03':palette},LOW_THEME:palette,ACCENTS:['#b7ff3c'],LOW_ACCENTS:['#b7ff3c'],parts}
});
})();
