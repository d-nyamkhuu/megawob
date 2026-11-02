(function(){
  'use strict';
  const palette={bg:'#f8f7ef',panel:'#fff',fg:'#090909',muted:'#555',line:'#080808'};
  const parts={
    'frame.placement':base=>(_c)=>{
      base(_c);
      _c.nav=false;
      _c.sidebar=false;
      _c.wantFooter=true;
    },
    'frame.header':()=> (_c)=>{
      const u=_c.util;
      document.body.className='neo instruction-'+_c.display+(_c.display==='toast'?' ref-has-note':'');
      if(_c.placement&&_c.placement!=='floating')document.body.classList.add('with-end-space');
      const app=u.el('main','app',document.body),top=u.el('header','top',app);
      u.el('div','brand',top,'Algebra Practice');
      const toolbar=u.el('div','toolbar',top);
      u.el('div','counter',top,'Problem 1 of 5');
      const center=u.el('div','center '+(_c.display==='panel'?'panel-mode':'')+(_c.display==='toast'?' toast-mode':''),app);
      Object.assign(_c,{app,top,toolbar,center,header:center});
    },
    'frame.nav':()=>()=>{},
    'frame.instruction':base=>(_c)=>{
      base(_c);
      const note=_c.header.querySelector('.ref-instruction');
      if(note)note.classList.add('brief');
      const spacer=_c.header.querySelector('.ref-spacer');
      if(spacer)spacer.remove();
    },
    'frame.tools':base=>(_c)=>{
      const h=_c.header;
      _c.header=_c.toolbar;
      base(_c);
      _c.header=h;
      if(_c.submit)_c.submit.classList.add('chrome-top-end');
    },
    'frame.body':()=> (_c)=>{_c.body=_c.center;},
    'frame.panel':base=>(_c)=>{
      base(_c);
      const panel=_c.body.querySelector('.ref-panel');
      if(panel)panel.classList.add('brief','panel-note');
    },
    'frame.stage':()=> (_c)=>{_c.stage=_c.util.el('section','stage',_c.body);},
    'frame.toast':base=>(_c)=>{
      base(_c);
      const note=document.body.querySelector('.ref-note');
      if(note){note.classList.add('brief','toast-note');_c.center.insertBefore(note,_c.stage);}
    },
    'frame.footer':base=>(_c)=>{
      const u=_c.util,footer=u.el('footer','bottom',_c.app),tools=u.el('section','tool-dock',footer);
      u.el('div','dock-title',tools,'Math Tools');
      const keys=u.el('div','tool-keys',tools);
      ['(',')','+','−','×','÷','x','y','²','√','| |'].forEach(k=>u.el('button','tool-key',keys,k));
      const actions=u.el('div','dock-actions',footer);
      u.el('button','tool-action',actions,'Clear');
      u.el('button','tool-action backspace',actions,'← Backspace');
      base(_c);
      const foot=document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.bottom=footer;
      _c.foot=foot;
      if(_c.submit&&(_c.placement==='footer'||_c.placement==='link'))_c.submit.classList.add('chrome-bottom-end');
    },
    'frame.floating':base=>(_c)=>{
      base(_c);
      const dock=document.body.querySelector('.ref-float-dock');
      if(dock)_c.bottom.appendChild(dock);
    },
    overlay:()=> (ctx)=>{
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);
      return {el,dismiss};
    }
  };
  env.site({
    name:'design-solve-puzzle-algebra-03',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{THEMES:{'design-solve-puzzle-algebra-03':palette},LOW_THEME:palette,ACCENTS:['#ffdf3d'],LOW_ACCENTS:['#ffdf3d'],parts}
  });
})();
