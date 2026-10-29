(function () {
  'use strict';
  const C = {site:'design-read-figure-color-03',task:'read-figure',scenario:'color',style:'memphis',title:'Color Match',menu:'Help      Exit',note:'',layout:'utility',subtitle:'',aside:''};
  env.site({
    name:C.site,
    styles:['site.css','memphis.css'],
    frame(ctx) {
      const viewWidth=document.documentElement.clientWidth,viewHeight=document.documentElement.clientHeight;
      const display=((ctx.display==='panel'&&viewWidth<1180)||(ctx.display==='toast'&&viewHeight<700))?'header':ctx.display;
      document.body.className=C.style+' '+C.layout+' instruction-'+display;
      const u=ctx.util;
      const endRng=ctx.rng.fork('chrome/end');
      const collideRng=ctx.rng.fork('chrome/collide');
      const labels=ctx.content&&ctx.content.END_LABELS||['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
      const labelOf=x=>(typeof x==='string'?x:x&&(x.label||x.text||x.name))||String(x);
      const placement=ctx.finish?null:endRng.pick(['header','link','footer','footer','footer','header']);
      const sampledLabel=ctx.finish?null:labelOf(endRng.pick(labels));
      const label=placement==='footer'?'Submit':sampledLabel;
      let collide=null;
      if(!ctx.finish&&collideRng.bool(0.3)){
        const options=[...new Set(labels.map(labelOf))].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
        if(options.length)collide={label:collideRng.pick(options),where:collideRng.pick(['header','footer'])};
      }
      const app=u.el('main','app',document.body);
      const top=u.el('header','top',app);
      if(['mint','qt','dark','electron','motif','human','beos','gtk','eink'].includes(C.style)){
        const icon=u.svg('svg',{width:26,height:26,viewBox:'0 0 26 26',class:'title-icon'},top);
        u.svg('rect',{x:3,y:2,width:20,height:22,rx:C.style==='mint'?0:3,fill:C.style==='mint'?'none':C.style==='dark'?'#8266ce':C.style==='electron'?'#ee8520':'#d7e2e8',stroke:'currentColor','stroke-width':1.5},icon);
        u.svg('path',{d:'M7 7h12M7 11h12M7 15h12M7 19h9',fill:'none',stroke:'currentColor','stroke-width':1.5},icon);
      }
      u.el('span','',top,C.title);
      if(['qt','dark','electron','motif','human','gtk','eink'].includes(C.style)){
        const wc=u.el('div','native-window-controls',top);
        for(const kind of ['min','max','close']){
          const svg=u.svg('svg',{width:20,height:20,viewBox:'0 0 20 20'},wc);
          u.svg('path',{d:kind==='min'?'M3 12h14':kind==='max'?'M4 4h12v12H4z':'M4 4l12 12M16 4L4 16',fill:'none',stroke:'currentColor','stroke-width':1.5},svg);
        }
      }
      if(C.subtitle)u.el('small','',top,C.subtitle);
      if(C.menu)u.el('nav','menu',top,C.menu);
      const headerActions=u.el('div','header-actions',top);
      const decoyBtn=(parent,text,collides)=>{
        const b=u.el('button','xtra',parent,text);b.type='button';
        b.addEventListener('click',()=>env.log('decoy',collides?{label:text,collide:true}:{label:text}));
        return b;
      };
      const endBtn=(parent,cls,text)=>{
        const b=u.el(cls==='end-link'?'a':'button',cls,parent,text);
        if(b.tagName==='BUTTON')b.type='button';else b.href='#';
        b.setAttribute('aria-label',label);b.title=label;
        b.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
        return b;
      };
      const center=u.el('div','center',app);
      if(display==='header')u.el('div','brief instruction-header'+(ctx.instruction.length>30?' long-instruction':''),center,ctx.instruction);
      else if(display==='panel')u.el('aside','brief instruction-panel',center,ctx.instruction);
      else if(display==='toast')u.el('div','brief instruction-toast',center,ctx.instruction);
      const stage=u.el('section','stage',center);
      u.el('aside','aside',document.body);
      const footer=u.el('footer','bottom',app);
      if(ctx.finish)footer.classList.add('finished');
      let submit=null;
      if(placement==='header')submit=endBtn(headerActions,'submit submit-header',label);
      if(placement==='link')submit=endBtn(footer,'end-link',label+' ›');
      if(placement==='footer')submit=endBtn(footer,'submit',label);
      if(collide){
        const parent=collide.where==='header'?headerActions:footer;
        decoyBtn(parent,collide.label,true);
      }
      return {stage,submit};
    },
    overlay(ctx){
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);
      return {el,dismiss};
    }
  });
})();
