(function(){'use strict';
const palette={bg:'#c6c6c6',panel:'#c8c8c8',fg:'#111',muted:'#222',line:'#444'};
const parts={
  'frame.placement':(base)=>(_c)=>{
    base(_c);
    _c.wantFooter=true;
    _c.nav=false;
    _c.sidebar=false;
  },
  'frame.header':()=>(_c)=>{
    const u=_c.util;
    document.body.classList.add('ref');
    const win=u.el('main','win',document.body);
    win.dataset.instr=_c.display;
    const tb=u.el('header','tbar',win);
    u.el('i','l',tb);
    u.el('div','ttl',tb,'Project Materials');
    u.el('i','r',tb);
    Object.assign(_c,{win,tb,header:win});
  },
  'frame.nav':()=>()=>{},
  'frame.instruction':(base)=>(_c)=>{
    base(_c);
    const note=_c.win.querySelector('.ref-instruction');
    if(note)note.classList.add('instruction');
  },
  'frame.tools':(base)=>(_c)=>{
    const header=_c.header;
    _c.header=_c.tb;
    base(_c);
    _c.header=header;
  },
  'frame.body':()=>(_c)=>{_c.body=_c.win;},
  'frame.panel':(base)=>(_c)=>{
    base(_c);
    const panel=_c.win.querySelector('.ref-panel');
    if(panel)panel.classList.add('instruction','instruction-panel');
  },
  'frame.stage':()=>(_c)=>{
    _c.stage=_c.util.el('div','stage',_c.win);
  },
  'frame.toast':(base)=>(_c)=>{
    base(_c);
    if(_c.display==='toast'){
      const note=document.body.querySelector('.ref-note');
      note.classList.add('instruction','instruction-toast');
      _c.win.insertBefore(note,_c.stage);
    }
  },
  'frame.footer':(base)=>(_c)=>{
    base(_c);
    const foot=document.body.querySelector('.ref-foot');
    foot.classList.add('footer');
    _c.win.appendChild(foot);
    const help=foot.querySelector('.ref-foot-text');
    help.classList.add('help');
    help.textContent='?';
    _c.foot=foot;
  },
  'frame.floating':(base)=>(_c)=>{
    base(_c);
    const dock=document.body.querySelector('.ref-float-dock');
    if(dock)_c.foot.appendChild(dock);
  },
  overlay:()=>(ctx)=>{
    const el=ctx.util.el('section','perturb '+ctx.kind,document.body);
    ctx.util.el('strong','',el,{cookie:'Cookie preferences',toast:'Notification',chat:'Support',promo:'A special offer',banner:'Service notice'}[ctx.kind]);
    ctx.util.el('p','',el,{cookie:'Choose your preferences to continue.',toast:'Your workspace is ready.',chat:'How can we help?',promo:'Explore the latest tools.',banner:'A new update is available.'}[ctx.kind]);
    const dismiss=ctx.util.el('button','dismiss',el,ctx.kind==='cookie'?'Accept':'Close');
    dismiss.type='button';
    dismiss.addEventListener('click',ctx.dismiss);
    return{el,dismiss};
  }
};
env.site({
  name:'design-click-control-collapsible-05',
  template:'site/base',
  langs:['en'],
  styles:['templates/site/css/base-hooks.css','site.css'],
  design:{THEMES:{'design-click-control-collapsible-05':palette},LOW_THEME:palette,ACCENTS:['#111'],LOW_ACCENTS:['#111'],parts}
});
})();
