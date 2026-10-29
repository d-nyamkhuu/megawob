(function(){
  'use strict';
  const C={site:'design-solve-puzzle-generate-11',title:'Number Task'};
  env.site({name:C.site,styles:['site.css'],initialOverlay:{kind:'banner'},
    frame(ctx){
      document.body.className='atari instruction-'+ctx.display;
      const u=ctx.util,desk=u.el('nav','deskbar',document.body);
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
      u.el('span','window-icon',top,'▤');u.el('span','window-title',top,C.title);
      const close=u.el('button','window-close',top,'×');close.type='button';
      const center=u.el('div','center',app),brief=u.el('div','brief',center,ctx.display==='hidden'?'':ctx.instruction);
      const stage=u.el('section','stage',center);if(ctx.display==='hidden')brief.hidden=true;
      const footer=u.el('footer','bottom',app),tools=u.el('div','tool-strip',footer);let toolbarSubmit;
      [['die','Generate','F2'],['check','Submit','F3'],['help','Help','F1'],['list','Clear','F4'],['door','Exit','F10']].forEach(([icon,label,key])=>{
        const item=u.el('div','tool-item '+icon,tools),svg=u.svg('svg',{viewBox:'0 0 64 64'},item);
        if(icon==='die'){u.svg('path',{d:'M32 4 58 18v29L32 60 6 46V18zM32 4v28m26-14L32 32 6 18m26 14v28'},svg);[[22,17],[42,21],[17,37],[39,43],[48,34]].forEach(([x,y])=>u.svg('circle',{cx:x,cy:y,r:2.6},svg));}
        else if(icon==='check'){u.svg('rect',{x:8,y:6,width:48,height:52},svg);u.svg('path',{d:'m17 32 10 11 22-25'},svg);}
        else if(icon==='help'){u.svg('rect',{x:8,y:6,width:48,height:52},svg);u.el('span','help-mark',item,'?');}
        else if(icon==='list'){u.svg('rect',{x:11,y:6,width:42,height:52},svg);[19,29,39,49].forEach(y=>u.svg('line',{x1:20,y1:y,x2:45,y2:y},svg));}
        else u.svg('path',{d:'M13 5h33l7 7v46H13zM20 10v42l27 5V15zM41 32h1'},svg);
        const title=u.el('b','',item,label);u.el('small','',item,key);if(icon==='check')toolbarSubmit={item,title};
      });
      let submit=null,placement='task',label='Submit';
      if(!ctx.finish){
        const er=ctx.rng.fork('chrome/end');
        if(er.bool(.5)){placement='task';label='Submit';}
        else{
          placement=er.pick(['header','toolbar']);const bank=ctx.content&&ctx.content.END_LABELS;
          const labels=Array.isArray(bank)&&bank.length?bank:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
          const picked=er.pick(labels);label=typeof picked==='string'?picked:(picked.label||picked.text||picked.name||'Submit');
          document.body.classList.add('end-'+placement);
          if(placement==='toolbar'){
            submit=u.el('button','submit footer-submit',footer,label);submit.type='button';submit.title=label;
            submit.setAttribute('aria-label',label);submit.addEventListener('click',ctx.submit);
          }else{
            submit=u.el('button','submit header-submit',top,label);submit.type='button';submit.title=label;submit.setAttribute('aria-label',label);submit.addEventListener('click',ctx.submit);
          }
        }
        if(placement==='task'){submit=u.el('button','submit',footer,label);submit.type='button';submit.addEventListener('click',ctx.submit);}
      }
      const cr=ctx.rng.fork('chrome/collide');
      if(!ctx.finish&&cr.bool(.3)){
        const bank=ctx.content&&ctx.content.END_LABELS,labels=Array.isArray(bank)&&bank.length?bank:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
        const same=x=>String(typeof x==='string'?x:x.label||x.text||x.name).trim().toLowerCase()===label.trim().toLowerCase();
        const choices=labels.filter(x=>!same(x));
        if(choices.length){const chosen=cr.pick(choices),text=typeof chosen==='string'?chosen:chosen.label||chosen.text||chosen.name;
          const decoy=u.el('button','pqs-xtra',desk,String(text));decoy.type='button';
          decoy.addEventListener('click',()=>env.log('decoy',{label:String(text),collide:true}));}
      }
      if(!ctx.finish&&!submit){submit=u.el('button','submit',footer,label);submit.type='button';submit.addEventListener('click',ctx.submit);}
      return {stage,submit};
    },
    overlay(ctx){
      const u=ctx.util,el=u.el('div','overlay tip-window',document.body),bar=u.el('div','tip-titlebar',el);
      u.el('span','window-icon',bar,'▤');u.el('b','',bar,'Tip of the day');
      const x=u.el('button','tip-x',bar,'×');x.type='button';x.addEventListener('click',ctx.dismiss);
      const body=u.el('div','tip-body',el),bulb=u.svg('svg',{viewBox:'0 0 100 100',class:'bulb'},body);
      u.svg('path',{d:'M50 19c-17 0-29 12-29 28 0 12 7 20 15 27 4 4 5 8 5 13h18c0-5 1-9 5-13 8-7 15-15 15-27 0-16-12-28-29-28zM42 87h16M43 94h14M46 99h8M50 4v8M20 14l8 8M7 42h12M80 22l8-8M81 42h12M13 66l9-7M78 59l9 7'},bulb);
      u.el('p','',body,'Small steps make\nbig progress!');const checkbox=u.el('label','tip-check',el),input=u.el('input','',checkbox);
      input.type='checkbox';u.el('span','',checkbox,'Do not show again');const close=u.el('button','tip-close',el,'Close');
      close.type='button';close.addEventListener('click',ctx.dismiss);return {el,dismiss:close};
    }
  });
})();
