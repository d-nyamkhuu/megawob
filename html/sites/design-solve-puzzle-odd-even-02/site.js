(()=>{'use strict';
const C={site:'design-solve-puzzle-odd-even-02',task:'solve-puzzle',scenario:'odd-even',style:'eink',title:'Number Practice',menu:'Home    Practice    Settings    Help',note:'',layout:'rail',subtitle:'',aside:''};
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
  const center=u.el('div','center',app);
  const brief=u.el('div','brief',center,ctx.display==='hidden'?'':ctx.instruction);
  const stage=u.el('section','stage',center);
  const aside=u.el('aside','aside',document.body);u.el('b','',aside,C.note);u.el('p','aside-copy',aside,C.aside);
  const footer=u.el('footer','bottom',app);
  const endR=ctx.rng.fork('chrome/end'),collideR=ctx.rng.fork('chrome/collide');
  const labels=ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
  const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
  const endLabels=labels.map(labelOf),mainLabel=endLabels.find(x=>x.trim().toLowerCase()==='submit')||endLabels[0];
  const alternateLabels=endLabels.filter(x=>x!==mainLabel);
  const label=endR.bool(.5)?mainLabel:(alternateLabels.length?endR.pick(alternateLabels):mainLabel);
  const placement=ctx.finish?null:endR.pick(['footer','footer','footer','header','link','icon']);
  const collides=collideR.bool(.3),different=endLabels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
  const collide=collides&&different.length?collideR.pick(different):null;
  const tools=u.el('div','eink-tools',top);
  const decoy=(parent,text,isCollide)=>{const b=u.el('button','eink-xtra',parent,text);b.type='button';b.addEventListener('click',()=>env.log('decoy',isCollide?{label:text,collide:true}:{label:text}));return b;};
  if(collide)decoy(tools,collide,true);
  let submit=null;
  if(!ctx.finish){
    const end=(parent,cls,text)=>{const b=u.el(cls==='eink-endlink'?'a':'button',cls,parent,text);b.type='button';if(b.tagName==='A')b.href='#';b.setAttribute('aria-label',label);b.title=label;b.addEventListener('click',e=>{e.preventDefault();ctx.submit();});return b;};
    if(placement==='footer')submit=end(footer,'submit',label);
    else if(placement==='header')submit=end(tools,'eink-end',label);
    else if(placement==='icon')submit=end(tools,'eink-end eink-icon','✓');
    else submit=end(footer,'eink-endlink',label+' ›');
  }
  return {stage,submit};
},overlay(ctx){
  const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
  const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
  u.el('span','',el,messages[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
}});
})();
