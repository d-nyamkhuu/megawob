(function(){
  'use strict';
  const palette={bg:'#f9f9f9',panel:'#ffffff',fg:'#050505',muted:'#6b6f75',line:'#c8cacf'};
  const parts={
    'frame.layout':(base)=>(_c)=>{
      base(_c);
      // The dedicated right column accommodates every note display at all sizes.
      _c.display=_c.ctx.display||'header';
    },
    'frame.placement':(base)=>(_c)=>{
      base(_c);
      _c.nav=false;
      _c.sidebar=false;
      _c.wantFooter=true;
    },
    'frame.header':()=>(_c)=>{
      if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
      const selection=window.getSelection();if(selection)selection.removeAllRanges();
      const u=_c.util,top=u.el('header','ds-top',document.body);
      u.el('span','ds-brand',top,'Northridge');
      const usr=u.el('span','ds-user',top);u.el('span','ds-avatar',usr,'JS');u.el('span','',usr,'Jordan Smith');u.el('span','ds-chev',usr,'');
      const hd=u.el('div','ds-head',document.body);u.el('div','ds-eyebrow',hd,'ACCOUNT');u.el('div','ds-title',hd,'Change password');u.el('div','ds-rule',hd);u.el('div','ds-sub',hd,'Choose a strong password for your account.');
      const cancel=u.el('button','ds-cancel',document.body,'Cancel');cancel.type='button';
      _c.header=u.el('aside','ds-note-slot',document.body);
      _c.toolbar=u.el('div','ds-toolbar',document.body);
    },
    'frame.nav':()=>(_c)=>{
      const nav=_c.util.el('nav','ds-menu',document.body);
      'Home|Profile|Security|Settings|Help'.split('|').forEach(t=>_c.util.el('span',t==='Security'?'on':'',nav,t));
    },
    'frame.tools':(base)=>(_c)=>{
      const header=_c.header;_c.header=_c.toolbar;base(_c);_c.header=header;
    },
    'frame.body':()=>(_c)=>{
      _c.body=_c.util.el('div','ds-body',document.body);
      _c.content=_c.util.el('div','ds-content',_c.body);
      _c.main=_c.util.el('div','ds-main',_c.content);
    },
    'frame.panel':(base)=>(_c)=>{
      const body=_c.body;_c.body=_c.header;base(_c);_c.body=body;
      const title=_c.header.querySelector('.ref-panel-title');if(title)title.textContent='TASK';
    },
    'frame.stage':()=>(_c)=>{
      _c.stage=_c.util.el('main','ds-stage',_c.main);
    },
    'frame.toast':(base)=>(_c)=>{
      base(_c);
      const note=document.body.querySelector('.ref-note');if(note)_c.header.appendChild(note);
    },
    'frame.footer':(base)=>(_c)=>{
      const status=_c.util.el('footer','ds-footer',_c.content);
      base(_c);
      const foot=document.body.querySelector('.ref-foot');
      if(foot){status.appendChild(foot);foot.querySelector('.ref-foot-text').textContent='Ready';}
    },
    'frame.floating':(base)=>(_c)=>{base(_c);},
    overlay:()=>(ctx)=>{
      const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  };
  env.site({
    name:'design-type-text-password-07',template:'site/base',langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{THEMES:{'design-type-text-password-07':palette},LOW_THEME:palette,ACCENTS:['#ef3425'],LOW_ACCENTS:['#ef3425'],parts}
  });
})();
