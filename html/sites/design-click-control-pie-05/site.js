(function(){'use strict';
const palette={bg:'#fdfcf9',panel:'#f0eeeb',fg:'#111',muted:'#595750',line:'#111'};
const parts={
  'frame.placement':base=>(_c)=>{
    base(_c);
    _c.nav=false;
    _c.sidebar=false;
  },
  'frame.header':()=> (_c)=>{
    const u=_c.util;
    document.body.classList.add('atlas');
    const shell=u.el('main','shell',document.body);
    const head=u.el('header','head',shell);
    u.el('div','brand',head,'Atlas');
    u.el('span','vbar',head);
    const nav=u.el('nav','nav',head);
    ['Documents','Maps','Notes'].forEach(t=>u.el('span','',nav,t));
    const util=u.el('div','util',head);
    ['Help','Account','Sign Out'].forEach((t,i)=>{if(i)u.el('i','',util,'|');u.el('span','',util,t);});
    const work=u.el('div','work',shell);
    u.el('div','pager',work,'1 / 5');
    const lab=u.el('div','kicker',work);
    u.el('span','',lab,'TASK');
    lab.hidden=_c.display==='toast'||_c.display==='hidden';
    if(_c.display==='panel')lab.classList.add('panel-kicker');
    Object.assign(_c,{shell,head,work,header:work});
  },
  'frame.nav':()=>()=>{},
  'frame.instruction':base=>(_c)=>{
    base(_c);
    const note=_c.work.querySelector('.ref-instruction');
    if(note)note.dataset.display=_c.display;
  },
  'frame.tools':base=>(_c)=>{
    const header=_c.header;
    _c.header=_c.head;
    base(_c);
    _c.header=header;
  },
  'frame.body':()=> (_c)=>{_c.body=_c.work;},
  'frame.panel':base=>(_c)=>{
    base(_c);
    const note=_c.work.querySelector('.ref-panel-text');
    if(note)note.dataset.display=_c.display;
  },
  'frame.stage':()=> (_c)=>{_c.stage=_c.util.el('div','stage',_c.work);},
  'frame.toast':base=>(_c)=>{
    base(_c);
    const note=document.body.querySelector('.ref-note');
    if(note){
      _c.work.appendChild(note);
      note.querySelector('.ref-note-text').dataset.display=_c.display;
    }
  },
  'frame.footer':base=>(_c)=>{
    base(_c);
    const foot=document.body.querySelector('.ref-foot');
    if(foot){
      _c.shell.appendChild(foot);
      foot.classList.toggle('atlas-link',_c.placement==='link');
    }
  },
  'frame.floating':base=>(_c)=>{
    base(_c);
    const dock=document.body.querySelector('.ref-float-dock');
    if(dock)_c.shell.appendChild(dock);
  },
  overlay:()=> (ctx)=>{
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
  name:'design-click-control-pie-05',
  template:'site/base',
  langs:['en'],
  styles:['templates/site/css/base-hooks.css','site.css'],
  design:{THEMES:{atlas:palette},LOW_THEME:palette,ACCENTS:['#ece9e5'],LOW_ACCENTS:['#ece9e5'],parts}
});
})();
