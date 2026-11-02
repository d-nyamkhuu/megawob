(function(){
  'use strict';
  const palette={bg:'#168c3e',panel:'#efefef',fg:'#090909',muted:'#555555',line:'#111111'};
  const parts={
    'frame.layout':(base)=>(_c)=>{
      base(_c);
      _c.display=_c.ctx.display||'header';
    },
    'frame.placement':(base)=>(_c)=>{
      base(_c);
      _c.wantFooter=true;
      _c.nav=false;
      _c.sidebar=false;
      document.body.classList.add('control-'+(_c.placement||'message'));
    },
    'frame.header':()=>(_c)=>{
      const u=_c.util;
      document.body.classList.add('atari','instruction-'+_c.display);
      const desk=u.el('nav','deskbar',document.body);
      ['Desk','File','Edit','Options'].forEach(x=>u.el('span','',desk,x));
      u.el('span','clock',desk,'Mon Apr 28 1986  10:15 AM');
      const icons=u.el('div','desktop-icons',document.body);
      [['disk','DISK A'],['folder','WORK'],['trash','TRASH']].forEach(([kind,label])=>{
        const item=u.el('div','desktop-icon '+kind,icons),svg=u.svg('svg',{viewBox:'0 0 64 64'},item);
        if(kind==='disk'){u.svg('rect',{x:7,y:6,width:50,height:52,rx:2},svg);u.svg('rect',{x:17,y:12,width:29,height:19},svg);u.svg('rect',{x:23,y:38,width:19,height:13},svg);u.svg('line',{x1:24,y1:43,x2:40,y2:43},svg);}
        else if(kind==='folder'){u.svg('path',{d:'M5 18h22l6 7h26v31H5z'},svg);u.svg('path',{d:'M5 25h54'},svg);}
        else{u.svg('path',{d:'M13 17h38l-4 41H17z'},svg);u.svg('path',{d:'M10 13h44M23 8h18l4 5H19zM25 24v26M33 24v26M41 24v26'},svg);}
        u.el('b','',item,label);
      });
      const app=u.el('main','app',document.body),top=u.el('header','top',app);
      u.el('span','window-icon',top,'▤');u.el('span','window-title',top,'Number Task');
      const close=u.el('button','window-close',top,'×');close.type='button';
      const center=u.el('div','center',app);
      const footer=u.el('footer','bottom',app),tools=u.el('div','tool-strip',footer);
      let slot;
      [['die','Generate','F2'],['check','','F3'],['help','Help','F1'],['list','Clear','F4'],['door','Exit','F10']].forEach(([icon,label,key])=>{
        const item=u.el('div','tool-item '+icon,tools),svg=u.svg('svg',{viewBox:'0 0 64 64'},item);
        if(icon==='die'){u.svg('path',{d:'M32 4 58 18v29L32 60 6 46V18zM32 4v28m26-14L32 32 6 18m26 14v28'},svg);[[22,17],[42,21],[17,37],[39,43],[48,34]].forEach(([x,y])=>u.svg('circle',{cx:x,cy:y,r:2.6},svg));}
        else if(icon==='check'){u.svg('rect',{x:8,y:6,width:48,height:52},svg);u.svg('path',{d:'m17 32 10 11 22-25'},svg);}
        else if(icon==='help'){u.svg('rect',{x:8,y:6,width:48,height:52},svg);u.el('span','help-mark',item,'?');}
        else if(icon==='list'){u.svg('rect',{x:11,y:6,width:42,height:52},svg);[19,29,39,49].forEach(y=>u.svg('line',{x1:20,y1:y,x2:45,y2:y},svg));}
        else u.svg('path',{d:'M13 5h33l7 7v46H13zM20 10v42l27 5V15zM41 32h1'},svg);
        if(icon==='check')slot=u.el('div','end-slot',item);
        else u.el('b','',item,label);
        u.el('small','',item,key);
      });
      Object.assign(_c,{app,top,center,footer,slot,header:center});
    },
    'frame.nav':()=>()=>{},
    'frame.instruction':(base)=>(_c)=>{
      base(_c);
      const note=_c.header.querySelector('.ref-instruction');
      if(note)note.classList.add('brief');
    },
    'frame.tools':(base)=>(_c)=>{
      const header=_c.header;
      _c.header=_c.top;
      base(_c);
      _c.header=header;
      if(_c.submit){
        _c.submit.classList.add('title-end');
        _c.headerTools.classList.add('has-end');
      }
    },
    'frame.body':()=>(_c)=>{_c.body=_c.center;},
    'frame.panel':(base)=>(_c)=>{
      base(_c);
      const panel=_c.body.querySelector('.ref-panel');
      if(panel)panel.classList.add('brief');
    },
    'frame.stage':()=>(_c)=>{_c.stage=_c.util.el('section','stage',_c.center);},
    'frame.toast':(base)=>(_c)=>{
      base(_c);
      const note=document.body.querySelector('.ref-note');
      if(note){note.classList.add('brief');_c.center.appendChild(note);}
    },
    'frame.footer':(base)=>(_c)=>{
      base(_c);
      const foot=document.body.querySelector('.ref-foot');
      _c.footer.appendChild(foot);
      const submit=foot.querySelector('[data-role="submit"]');
      if(submit){submit.classList.add('bar-end');_c.slot.appendChild(submit);}
      else _c.util.el('b','',_c.slot,'Submit');
    },
    'frame.floating':(base)=>(_c)=>{
      base(_c);
      const dock=document.body.querySelector('.ref-float-dock');
      if(dock){
        dock.querySelector('[data-role="submit"]').classList.add('dock-end');
        _c.slot.replaceChildren(dock);
      }
    },
    overlay:()=>(ctx)=>{
      const u=ctx.util,el=u.el('div','overlay tip-window',document.body),bar=u.el('div','tip-titlebar',el);
      u.el('span','window-icon',bar,'▤');u.el('b','',bar,'Tip of the day');
      const x=u.el('button','tip-x',bar,'×');x.type='button';x.addEventListener('click',ctx.dismiss);
      const body=u.el('div','tip-body',el),bulb=u.svg('svg',{viewBox:'0 0 100 100',class:'bulb'},body);
      u.svg('path',{d:'M50 19c-17 0-29 12-29 28 0 12 7 20 15 27 4 4 5 8 5 13h18c0-5 1-9 5-13 8-7 15-15 15-27 0-16-12-28-29-28zM42 87h16M43 94h14M46 99h8M50 4v8M20 14l8 8M7 42h12M80 22l8-8M81 42h12M13 66l9-7M78 59l9 7'},bulb);
      u.el('p','',body,'Small steps make\nbig progress!');const checkbox=u.el('label','tip-check',el),input=u.el('input','',checkbox);
      input.type='checkbox';u.el('span','',checkbox,'Do not show again');const close=u.el('button','tip-close',el,'Close');
      close.type='button';close.addEventListener('click',ctx.dismiss);return {el,dismiss:close};
    }
  };
  env.site({
    name:'design-solve-puzzle-generate-11',template:'site/base',langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],initialOverlay:{kind:'banner'},
    design:{THEMES:{site:palette},LOW_THEME:palette,ACCENTS:['#111111'],LOW_ACCENTS:['#111111'],parts}
  });
})();
