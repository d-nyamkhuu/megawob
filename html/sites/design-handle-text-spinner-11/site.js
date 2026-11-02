(function(){
  'use strict';
  const palette={bg:'#fff',panel:'#fff',fg:'#101010',muted:'#687078',line:'#cfd2d4'};
  const parts={
    'frame.layout':(base)=>(_c)=>{
      base(_c);
      // All note modes use the original task area's dedicated note slot.
      _c.display=_c.ctx.display||'header';
    },
    'frame.placement':(base)=>(_c)=>{
      base(_c);
      _c.nav=false;
      _c.sidebar=false;
      _c.wantFooter=true;
    },
    'frame.header':()=>(_c)=>{
      const u=_c.util;
      document.body.classList.add('ref','swiss','split-level');
      const shell=u.el('main','shell',document.body);
      const overview=u.el('section','overview',shell);
      u.el('div','section-no',overview,'01');
      const details=u.el('div','overview-main',overview);
      const title=u.el('div','overview-title',details);
      u.el('h1','',title,'System Overview');
      u.el('span','date',title,'Apr 24, 2016　10:14');
      u.el('p','overview-sub',details,'Room A · Conference Setup');
      const grid=u.el('div','overview-grid',details);
      const facts=u.el('div','facts',grid);
      [['Device','Audio Controller'],['Location','Conference Room A'],['Status','Online'],['Mode','Presentation'],['Last Updated','Apr 24, 2016 10:14']].forEach((r,i)=>{
        u.el('span','fact-label',facts,r[0]);
        u.el('span','fact-value'+(i===2?' online':''),facts,r[1]);
      });
      const volume=u.el('div','master',grid);
      u.el('strong','',volume,'Master Volume');
      u.el('b','overview-value',volume,'20 %');
      const bar=u.el('div','meter',volume);u.el('i','',bar);
      u.el('div','meter-labels',volume,'0　　　　　　　　　　　　　　　100');
      const zones=u.el('div','zones',grid);
      u.el('strong','',zones,'Audio Zones');
      [['Room A','On'],['Room B','Off'],['Room C','Off'],['Lobby','Off']].forEach(r=>{u.el('span','',zones,r[0]);u.el('span','',zones,r[1]);});
      Object.assign(_c,{shell});
      const work=u.el('section','work',shell);
      u.el('div','section-no lower-no',work,'02');
      const center=u.el('div','center',work);
      const heading=u.el('div','task-heading',center);
      u.el('h2','',heading,'Configuration Task');
      u.el('p','',heading,'Adjust the audio setting as instructed.');
      const header=u.el('div','task-note',center);
      const toolbar=u.el('div','task-tools',center);
      Object.assign(_c,{work,center,header,toolbar});
    },
    'frame.nav':()=>()=>{},
    'frame.instruction':(base)=>(_c)=>{
      base(_c);
      const note=_c.header.querySelector('.ref-instruction');
      if(note){note.classList.add('instruction');note.dataset.display=_c.display;}
    },
    'frame.tools':(base)=>(_c)=>{
      const header=_c.header;
      _c.header=_c.toolbar;
      base(_c);
      _c.header=header;
    },
    'frame.body':()=>(_c)=>{_c.body=_c.center;},
    'frame.panel':(base)=>(_c)=>{
      const body=_c.body;
      _c.body=_c.header;
      base(_c);
      _c.body=body;
      const note=_c.header.querySelector('.ref-panel');
      if(note){note.classList.add('instruction');note.dataset.display='panel';}
    },
    'frame.stage':()=>(_c)=>{_c.stage=_c.util.el('div','stage',_c.center);},
    'frame.toast':(base)=>(_c)=>{
      base(_c);
      const note=document.body.querySelector('.ref-note');
      if(note){
        note.classList.add('instruction','instruction-toast');
        note.dataset.display='toast';
        _c.header.appendChild(note);
      }
    },
    'frame.footer':(base)=>(_c)=>{
      base(_c);
      const foot=document.body.querySelector('.ref-foot');
      if(foot)_c.center.appendChild(foot);
      _c.foot=foot;
    },
    'frame.floating':(base)=>(_c)=>{
      base(_c);
      const dock=document.body.querySelector('.ref-float-dock');
      if(dock&&_c.foot)_c.foot.appendChild(dock);
    },
    overlay:()=>(ctx)=>{
      const u=ctx.util;const el=u.el('section','perturb tip-window',document.body);
      const head=u.el('header','tip-head',el);u.el('strong','',head,'Tip of the day');
      const x=u.el('button','tip-x',head,'×');x.type='button';x.setAttribute('aria-label','Close');x.addEventListener('click',ctx.dismiss);
      const content=u.el('div','tip-content',el);u.el('span','bulb',content,'♧');
      u.el('p','',content,'You can also use your mouse wheel to adjust numeric values quickly.');
      const foot=u.el('footer','tip-foot',el);const label=u.el('label','dont-show',foot);
      const check=u.el('input','',label);check.type='checkbox';u.el('span','',label,'Do not show again');
      const close=u.el('button','dismiss',foot,'Close');close.type='button';close.addEventListener('click',ctx.dismiss);
      return{el,dismiss:close};
    }
  };
  env.site({
    name:'design-handle-text-spinner-11',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    initialOverlay:{kind:'promo'},
    design:{
      THEMES:{'design-handle-text-spinner-11':palette},
      LOW_THEME:palette,
      ACCENTS:['#ef2118'],
      LOW_ACCENTS:['#ef2118'],
      parts
    }
  });
})();
