(function(){
  'use strict';
  const palette={bg:'#c7c7c7',panel:'#c6c6c6',fg:'#080808',muted:'#333333',line:'#777777'};
  const parts={
    'frame.layout':(base)=>(_c)=>{
      base(_c);
      let mode=_c.ctx.display||'header';
      if(mode==='toast'&&(_c.W<1440||_c.H<700))mode='header';
      _c.display=mode;
      document.body.classList.toggle('ref-has-note',mode==='toast');
    },
    'frame.placement':(base)=>(_c)=>{
      base(_c);
      _c.wantFooter=true;
      _c.nav=false;
      _c.sidebar=false;
    },
    'frame.header':()=> (_c)=>{
      const u=_c.util;
      const title=u.el('header','os-title',document.body);
      u.el('span','os-app-icon',title,'▣');
      u.el('strong','',title,'Workplace Shell - Access Manager');
      const controls=u.el('div','os-window-controls',title);
      ['_','□','×'].forEach(x=>u.el('span','',controls,x));
      const menu=u.el('nav','os-menu',document.body);
      ['Folder','Edit','View','Selected','Help'].forEach(x=>u.el('span','',menu,x));
      const tabs=u.el('div','os-tabs',document.body);
      ['Welcome','Log In','System Info','Help'].forEach((x,i)=>{
        const t=u.el('div','os-tab'+(i===0?' selected':''),tabs,x);
        t.setAttribute('aria-current',i===0?'page':'false');
      });
      const shell=u.el('div','os-work',document.body);
      const area=u.el('main','os-surface',shell);
      Object.assign(_c,{menu,shell,area,header:area});
    },
    'frame.nav':()=>()=>{},
    'frame.instruction':(base)=>(_c)=>{
      base(_c);
      const note=_c.header.querySelector('.ref-instruction');
      if(note){
        note.classList.add('os-task-note');
        const text=_c.util.el('div','os-instruction');
        text.textContent=note.textContent;
        note.textContent='';
        _c.util.el('span','os-note-icon',note,'▤');
        note.appendChild(text);
      }
    },
    'frame.tools':(base)=>(_c)=>{
      const h=_c.header;
      _c.header=_c.menu;
      base(_c);
      _c.header=h;
    },
    'frame.body':()=> (_c)=>{_c.body=_c.area;},
    'frame.panel':(base)=>(_c)=>{
      base(_c);
      const note=_c.body.querySelector('.ref-panel');
      if(note){
        note.classList.add('os-task-panel');
        const title=note.querySelector('.ref-panel-title');
        title.classList.add('os-panel-title');
        title.textContent='Instructions';
        const icon=_c.util.el('span','os-note-icon',note,'▤');
        note.insertBefore(icon,title.nextSibling);
        note.querySelector('.ref-panel-text').classList.add('os-instruction');
      }
    },
    'frame.stage':()=> (_c)=>{
      const u=_c.util,area=_c.area;
      _c.stage=u.el('section','os-stage',area);
      const logo=u.el('div','os-logo',area);u.el('div','os-globe',logo,'◉');u.el('div','',logo,'Workplace');u.el('div','',logo,'Shell');
      const access=u.el('div','os-access',area);u.el('div','os-access-title',access,'Log in to access:');
      [['▱','Mail'],['▤','Documents'],['♧','Networks'],['▥','Applications']].forEach(([icon,label])=>{const row=u.el('div','os-access-row',access);u.el('span','',row,icon);u.el('span','',row,label);});
    },
    'frame.toast':(base)=>(_c)=>{
      base(_c);
      if(_c.display==='toast'){
        const note=document.body.querySelector('.ref-note');
        note.classList.add('os-task-toast');
        const icon=_c.util.el('span','os-note-icon',note,'▤');
        note.insertBefore(icon,note.firstChild);
        note.querySelector('.ref-note-text').classList.add('os-instruction');
        _c.area.appendChild(note);
      }
    },
    'frame.footer':(base)=>(_c)=>{
      const u=_c.util;
      const dock=u.el('footer','os-dock',document.body);
      const tools=u.el('div','os-tools',dock);
      const toolData=[['▤','Drive A:'],['▱','Drive C:'],['▣','Programs'],['▤','Templates'],['♜','Shredder'],['?','Help'],['⌕','Find'],['▱','Print'],['▣','Shut Down']];
      toolData.forEach(([icon,label],i)=>{const b=u.el('button','os-tool'+(i===8?' os-shutdown':''),tools);b.type='button';u.el('span','os-tool-icon',b,icon);u.el('span','os-tool-label',b,label);b.addEventListener('click',()=>env.log('decoy',{label}));});
      const clock=u.el('div','os-clock',dock);u.el('span','',clock,'10:24 AM');u.el('span','',clock,'Apr 12, 1994');
      base(_c);
      tools.appendChild(document.body.querySelector('.ref-foot'));
      Object.assign(_c,{dock,tools});
    },
    'frame.floating':(base)=>(_c)=>{
      base(_c);
      const dock=document.body.querySelector('.ref-float-dock');
      if(dock)_c.tools.appendChild(dock);
    },
    overlay:()=> (ctx)=>{
      const u=ctx.util;const el=u.el('section','os-overlay os-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      // A later cookie sheet must not cover the initial warning's recovery button.
      // Its own dismiss button sits outside the warning, so both remain reachable.
      if(ctx.initial)el.classList.add('os-overlay-initial');
      const texts={cookie:'This workplace stores preferences for your session.',toast:'System changes saved.',chat:'Workplace Shell Help Desk',promo:'Install the latest Workplace extensions.',banner:'System notice'};
      u.el('div','os-overlay-title',el,ctx.kind==='banner'?'Unsaved Changes':'Workplace Shell');
      u.el('div','os-overlay-copy',el,ctx.kind==='banner'?'Unsaved layout changes. If you continue, your layout changes will not be saved.':texts[ctx.kind]);
      const x=u.el('button','os-overlay-x',el,'×');x.type='button';x.setAttribute('aria-label','Close');x.addEventListener('click',()=>ctx.dismiss(ctx.kind==='cookie'?'reject':'close'));
      const dismiss=u.el('button','os-overlay-close',el,ctx.kind==='banner'?'Continue without saving':'Close');dismiss.type='button';dismiss.addEventListener('click',()=>ctx.dismiss(ctx.kind==='cookie'?'accept':'close'));
      return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  };
  env.site({
    name:'design-act-in-time-popup-12',
    template:'site/base',langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    initialOverlay:{kind:'banner'},
    design:{THEMES:{site:palette},LOW_THEME:palette,ACCENTS:['#0754bc'],LOW_ACCENTS:['#0754bc'],parts}
  });
})();
