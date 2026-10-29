(function(){
  'use strict';
  const C={"site":"design-read-figure-greatest-02","task":"read-figure","scenario":"greatest","style":"gloss","title":"Skill Practice","menu":"Home    Practice    Progress    Resources    Help","note":"Task Overview","layout":"split","subtitle":"","aside":""};
  const END_FALLBACK=['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
  env.site({name:C.site,styles:['site.css'],frame(ctx){
    document.body.className=C.style+' '+C.layout+' instruction-'+ctx.display;
    const u=ctx.util,app=u.el('main','app',document.body),top=u.el('header','top',app);
    if(['mint','qt','dark','electron','motif','human','beos','gtk','eink'].includes(C.style)){
      const icon=u.svg('svg',{width:26,height:26,viewBox:'0 0 26 26',class:'title-icon'},top);
      u.svg('rect',{x:3,y:2,width:20,height:22,rx:C.style==='mint'?0:3,fill:C.style==='mint'?'none':C.style==='dark'?'#8266ce':C.style==='electron'?'#ee8520':'#d7e2e8',stroke:'currentColor','stroke-width':1.5},icon);
      u.svg('path',{d:'M7 7h12M7 11h12M7 15h12M7 19h9',fill:'none',stroke:'currentColor','stroke-width':1.5},icon);
    }
    u.el('span','',top,C.title);
    if(['qt','dark','electron','motif','human','gtk','eink'].includes(C.style)){
      const wc=u.el('div','native-window-controls',top);
      for(const kind of ['min','max','close']){const svg=u.svg('svg',{width:20,height:20,viewBox:'0 0 20 20'},wc);u.svg('path',{d:kind==='min'?'M3 12h14':kind==='max'?'M4 4h12v12H4z':'M4 4l12 12M16 4L4 16',fill:'none',stroke:'currentColor','stroke-width':1.5},svg);}
    }
    if(C.subtitle)u.el('small','',top,C.subtitle);
    if(C.menu)u.el('nav','menu',top,C.menu);
    const endRng=ctx.rng.fork('chrome/end');
    const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:END_FALLBACK;
    const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
    const keepOriginal=!ctx.finish&&endRng.bool(0.5);
    const alternatives=labels.map(labelOf).filter(x=>x.trim().toLowerCase()!=='submit');
    const label=ctx.finish?'Submit':keepOriginal?'Submit':labelOf(endRng.pick(alternatives.length?alternatives:labels));
    const placement=ctx.finish?null:keepOriginal?'footer':endRng.pick(['footer','header','link']);
    const center=u.el('div','center',app);
    const brief=u.el('div','brief',center);
    if(ctx.display==='header'||ctx.display==='toast')u.el('div','instruction-copy',brief,ctx.instruction);
    if(ctx.display==='panel'){
      u.el('div','instruction-copy',brief,ctx.instruction);
    }
    const stage=u.el('section','stage',center);
    const aside=u.el('aside','aside',document.body);u.el('b','',aside,C.note);u.el('p','aside-copy',aside,C.aside);
    if(ctx.display==='toast')brief.setAttribute('role','status');
    const footer=u.el('footer','bottom',app);
    let submit=null;
    const createSubmit=(parent,cls,text)=>{
      const b=u.el('button',cls,parent,text);b.type='button';b.addEventListener('click',ctx.submit);return b;
    };
    const collideRng=ctx.rng.fork('chrome/collide');
    let collide=null;
    if(!ctx.finish&&collideRng.bool(0.3)){
      const options=[...new Set(labels.map(labelOf))].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
      if(options.length)collide=labelOf(collideRng.pick(options));
    }
    const decoy=(parent,text)=>{const b=u.el('button','xtra-end',parent,text);b.type='button';b.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));};
    if(placement==='header'){
      const tools=u.el('div','top-tools',top);
      if(collide)decoy(tools,collide);
      submit=createSubmit(tools,'submit header-submit',label);
    }else if(placement==='link'){
      const tools=u.el('div','bottom-tools',footer);
      if(collide)decoy(tools,collide);
      submit=u.el('a','end-link',tools,label+' ›');submit.href='#';submit.setAttribute('aria-label',label);submit.title=label;
      submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
    }else if(placement==='footer'){
      if(collide)decoy(footer,collide);
      submit=createSubmit(footer,'submit',label);
    }
    return {stage,submit};
  },overlay(ctx){
    const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
    const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
    u.el('span','',el,messages[ctx.kind]);
    const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
  }});
})();
