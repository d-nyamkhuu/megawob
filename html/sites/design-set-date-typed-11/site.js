(function(){
  'use strict';
  const palette={bg:'#f1f0eb',panel:'#f1f0eb',fg:'#151515',muted:'#66717e',line:'#b9c4d0'};
  const parts={
    'frame.placement':(base)=>(_c)=>{
      base(_c);
      _c.nav=false;
      _c.sidebar=false;
    },
    'frame.header':()=>(_c)=>{
      if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
      const selection=window.getSelection();if(selection)selection.removeAllRanges();
      const u=_c.util;
      const top=u.el('header','ds-top',document.body);
      u.el('span','ds-brand',top,'Rivermere Medical Center  |  Patient Records');
      const windowControls=u.el('span','ds-window-controls',top,'−    □    ×');
      const shell=u.el('div','ds-body');
      const content=u.el('div','ds-content',shell);
      Object.assign(_c,{top,windowControls,shell,contentPane:content,header:content});
    },
    'frame.nav':()=>()=>{},
    'frame.instruction':(base)=>(_c)=>{
      base(_c);
    },
    'frame.tools':(base)=>(_c)=>{
      const header=_c.header;
      _c.header=_c.top;
      base(_c);
      _c.header=header;
      _c.top.insertBefore(_c.headerTools,_c.windowControls);
    },
    'frame.body':()=>(_c)=>{
      document.body.appendChild(_c.shell);
      _c.body=_c.util.el('div','ds-main',_c.contentPane);
    },
    'frame.panel':(base)=>(_c)=>{
      base(_c);
      _c.body.classList.remove('ref-panel-right');
      const title=_c.body.querySelector('.ref-panel-title');
      if(title)title.textContent='Your Task';
    },
    'frame.stage':()=>(_c)=>{
      _c.stage=_c.util.el('main','ds-stage',_c.body);
    },
    'frame.toast':(base)=>(_c)=>{
      base(_c);
      const note=document.body.querySelector('.ref-note');
      if(note)_c.contentPane.insertBefore(note,_c.body);
    },
    'frame.footer':(base)=>(_c)=>{
      base(_c);
      const foot=document.body.querySelector('.ref-foot');
      if(foot)_c.contentPane.appendChild(foot);
    },
    'frame.floating':(base)=>(_c)=>{
      base(_c);
      const dock=document.body.querySelector('.ref-float-dock');
      if(dock)_c.contentPane.appendChild(dock);
    },
    overlay:()=>(ctx)=>{
      const u=ctx.util;
      if(ctx.kind==='tour'){
        const el=u.el('section','ds-initial ds-initial-tour',document.body);el.dataset.role='overlay';
        const x=u.el('button','ds-tour-x',el,'×');x.type='button';x.setAttribute('aria-label','Close tour');
        u.el('h2','',el,'Welcome!');
        u.el('p','',el,'Take a quick tour to learn about scheduling appointments.');
        const start=u.el('button','ds-tour-start',el,'Start tour');start.type='button';
        const skip=u.el('button','ds-tour-skip',el,'Skip tour');skip.type='button';
        const dismiss=()=>{env.log('reference-obstruction-dismiss',{kind:'tour'});ctx.dismiss('close');};
        x.addEventListener('click',dismiss);start.addEventListener('click',dismiss);skip.addEventListener('click',dismiss);
        return{el,dismiss:skip,ttlSteps:0};
      }
      const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));
      return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  };
  env.site({
    name:'design-set-date-typed-11',
    template:'site/base',
    langs:['en'],
    initialOverlay:{kind:'tour'},
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{
      THEMES:{'design-set-date-typed-11':palette},
      LOW_THEME:palette,
      ACCENTS:['#222222'],
      LOW_ACCENTS:['#222222'],
      parts
    }
  });
})();
