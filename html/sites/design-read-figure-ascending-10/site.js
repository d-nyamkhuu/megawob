(function(){
  'use strict';
  const C={site:'design-read-figure-ascending-10',task:'read-figure',scenario:'ascending',style:'yosemite',title:'Number Sequence',menu:'ⓘ  Help',note:'',layout:'open-canvas',subtitle:'',aside:''};
  env.site({
    name:C.site,styles:['site.css'],
    frame(ctx){
      const display=(window.innerWidth<1260||window.innerHeight<700)?'header':ctx.display;
      document.body.className=C.style+' '+C.layout+' instruction-'+display;
      const u=ctx.util,app=u.el('main','app',document.body),top=u.el('header','top',app);
      u.el('span','',top,C.title);
      if(C.subtitle)u.el('small','',top,C.subtitle);
      if(C.menu)u.el('nav','menu',top,C.menu);
      const center=u.el('div','center',app);
      u.el('div','brief',center,display==='header'?ctx.instruction:'');
      const stage=u.el('section','stage',center);
      if(display==='panel')u.el('div','episode-panel',document.body,ctx.instruction);
      if(display==='toast')u.el('div','episode-toast',document.body,ctx.instruction);
      const footer=u.el('footer','bottom',app);
      let submit=null;
      const er=ctx.rng.fork('chrome/end'),cr=ctx.rng.fork('chrome/collide');
      const source=ctx.content&&ctx.content.END_LABELS;
      const labels=(Array.isArray(source)&&source.length?source:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"])
        .map(x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x)));
      const legacy=er.bool(.5);
      const placement=legacy?'footer':er.pick(['footer','footer','toolbar','toolbar','link']);
      const otherLabels=labels.filter(x=>x.trim().toLowerCase()!=='submit');
      const label=legacy?'Submit':er.pick(otherLabels.length?otherLabels:labels);
      const possible=labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
      const collide=possible.length&&cr.bool(.3)?cr.pick(possible):null;
      const decoy=(parent,text,isCollide)=>{
        if(!text)return;
        const b=u.el('button','chrome-xtra',parent,text);b.type='button';
        b.addEventListener('click',()=>env.log('decoy',isCollide?{label:text,collide:true}:{label:text}));
      };
      const end=(parent,cls)=>{
        const b=u.el('button','submit '+cls,parent,label);b.type='button';b.title=label;b.setAttribute('aria-label',label);
        b.addEventListener('click',ctx.submit);return b;
      };
      if(!ctx.finish){
        if(placement==='footer'){if(collide)decoy(footer,collide,true);submit=end(document.body,'footer-submit');}
        else if(placement==='toolbar'){if(collide)decoy(top,collide,true);submit=end(top,'toolbar-submit');}
        else{if(collide)decoy(footer,collide,true);submit=end(document.body,'link-submit');}
      }
      return {stage,submit};
    },
    overlay(ctx){
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
    }
  });
})();
