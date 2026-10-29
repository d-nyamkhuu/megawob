(function () {
  'use strict';
  const C = {"site":"design-read-figure-count-02","task":"read-figure","scenario":"count","style":"qt","title":"Shape Counter","menu":"File    Edit    View    Tools    Help","note":"Feedback","layout":"inspector","subtitle":"","aside":"Not answered yet."};
  const END_LABELS = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  const labelOf = x => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);

  env.site({name:C.site,styles:['site.css'],frame(ctx){
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
    const u = ctx.util, app = u.el('main','app',document.body), top = u.el('header','top',app);
    if (['mint','qt','dark','electron','motif','human','beos','gtk','eink'].includes(C.style)) {
      const icon = u.svg('svg',{width:26,height:26,viewBox:'0 0 26 26',class:'title-icon'},top);
      u.svg('rect',{x:3,y:2,width:20,height:22,rx:C.style==='mint'?0:3,fill:C.style==='mint'?'none':C.style==='dark'?'#8266ce':C.style==='electron'?'#ee8520':'#d7e2e8',stroke:'currentColor','stroke-width':1.5},icon);
      u.svg('path',{d:'M7 7h12M7 11h12M7 15h12M7 19h9',fill:'none',stroke:'currentColor','stroke-width':1.5},icon);
    }
    u.el('span','',top,C.title);
    if (['qt','dark','electron','motif','human','gtk','eink'].includes(C.style)) {
      const wc=u.el('div','native-window-controls',top);
      for (const kind of ['min','max','close']) { const svg=u.svg('svg',{width:20,height:20,viewBox:'0 0 20 20'},wc); u.svg('path',{d:kind==='min'?'M3 12h14':kind==='max'?'M4 4h12v12H4z':'M4 4l12 12M16 4L4 16',fill:'none',stroke:'currentColor','stroke-width':1.5},svg); }
    }
    if(C.subtitle)u.el('small','',top,C.subtitle);
    if(C.menu)u.el('nav','menu',top,C.menu);
    const center=u.el('div','center',app);
    let brief = null;
    if (ctx.display === 'header') brief=u.el('div','brief',center,ctx.instruction);
    const stage=u.el('section','stage',center);
    const aside=u.el('aside','aside',document.body);
    u.el('b','',aside,C.note); u.el('p','aside-copy',aside,C.aside);
    if (ctx.display === 'panel' || ctx.display === 'toast') {
      const note=u.el('div',ctx.display==='panel'?'brief qt-instruction-panel':'brief qt-instruction-toast',aside,ctx.instruction);
      if (ctx.display==='toast') note.setAttribute('role','status');
    }
    const footer=u.el('footer','bottom',app);
    const er=ctx.rng.fork('chrome/end');
    const content=ctx.content||{};
    const labels=Array.isArray(content.END_LABELS)&&content.END_LABELS.length?content.END_LABELS:END_LABELS;
    const alternateLabel=ctx.finish?'Submit':labelOf(er.pick(labels));
    const placement=ctx.finish?null:er.pick(['footer','footer','footer','header','link','icon']);
    const label=placement==='footer'?'Submit':alternateLabel;
    const cr=ctx.rng.fork('chrome/collide');
    let collision=null;
    if(!ctx.finish&&cr.bool(.3)){
      const candidates=[...new Set(labels.map(labelOf))].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
      if(candidates.length)collision=cr.pick(candidates);
    }
    const decoy=(parent,text,collide)=>{
      const b=u.el('button','qt-xtra',parent,text);b.type='button';
      b.addEventListener('click',()=>env.log('decoy',collide?{label:text,collide:true}:{label:text}));
    };
    const end=(parent,kind,text)=>{
      const tag=kind==='link'?'a':'button',b=u.el(tag,'submit qt-end '+(kind==='icon'?'qt-icon-end':''),parent,kind==='icon'?'✓':text);
      if(tag==='button')b.type='button';else b.href='#';
      b.setAttribute('aria-label',text);b.title=text;
      b.addEventListener('click',e=>{e.preventDefault();ctx.submit();});return b;
    };
    let submit=null;
    if(placement==='footer'){
      if(collision)decoy(footer,collision,true);
      submit=end(footer,'footer',label);
    } else if(placement==='header'){
      if(collision)decoy(top,collision,true);
      submit=end(top,'header',label);
    } else if(placement==='link'){
      if(collision)decoy(footer,collision,true);
      submit=end(footer,'link',label);
    } else if(placement==='icon'){
      if(collision)decoy(top,collision,true);
      submit=end(top,'icon',label);
    }
    return {stage,submit};
  },overlay(ctx){
    const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
    const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
    u.el('span','',el,messages[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
  }});
})();
