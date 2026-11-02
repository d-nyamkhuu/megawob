(function(){
  'use strict';
  const palette={bg:'#42b5f4',panel:'#fff',fg:'#133c7d',muted:'#536e9b',line:'#a9c8e5'};
  const parts={
    'frame.layout':base=>(_c)=>{
      base(_c);
      // The original has a dedicated task window in every note mode.
      _c.display=_c.ctx.display||'header';
    },
    'frame.placement':base=>(_c)=>{
      base(_c);
      _c.nav=false;_c.sidebar=false;_c.wantFooter=true;
    },
    'frame.header':()=> (_c)=>{
      const u=_c.util;
      document.body.classList.add('ref','clearlooks','split');
      const shell=u.el('main','shell',document.body);
      const head=u.el('header','head',shell);
      const title=u.el('div','title',head,'SkyDrive');
      const glyph=u.el('span','title-document',title);
      glyph.innerHTML='<svg viewBox="0 0 20 24"><path d="M2 1h11l5 5v16H2Z" fill="#f4f4ef" stroke="#59636c"/><path d="M13 1v6h5M5 9h9M5 12h8M5 15h9M5 18h6" fill="none" stroke="#849097"/></svg>';
      const controls=u.el('span','window-controls',title);
      controls.innerHTML='<i>−</i><i>□</i><i>×</i>';
      const menus=u.el('div','tools',head);
      ['Home','Files','Sharing','Account','Help'].forEach(label=>u.el('span','',menus,label));
      const note=u.el('div','instruction',shell);
      note.setAttribute('role',_c.display==='toast'?'status':'note');
      note.setAttribute('aria-label','Task');
      note.dataset.display=_c.display;
      note.hidden=_c.display==='hidden';
      if(_c.display==='toast')note.classList.add('instruction-toast');
      u.el('span','instruction-check',note,'✓');
      const taskControls=u.el('span','task-controls',note);
      taskControls.innerHTML='<i>−</i><i>×</i>';
      Object.assign(_c,{shell,head,header:note});
    },
    'frame.nav':()=>()=>{},
    'frame.instruction':base=>(_c)=>{
      base(_c);
      const text=_c.header.querySelector('.ref-instruction');
      if(text)text.classList.add('instruction-prompt');
    },
    'frame.tools':base=>(_c)=>{
      const header=_c.header;
      _c.header=_c.head;base(_c);_c.header=header;
      _c.headerTools.classList.add('top-tools');
    },
    'frame.body':()=> (_c)=>{
      const body=_c.util.el('div','work',_c.shell);
      const center=_c.util.el('section','center',body);
      Object.assign(_c,{body,center});
    },
    'frame.panel':base=>(_c)=>{
      const body=_c.body;
      _c.body=_c.header;base(_c);_c.body=body;
      const text=_c.header.querySelector('.ref-panel-text');
      if(text)text.classList.add('instruction-prompt');
    },
    'frame.stage':()=> (_c)=>{
      _c.stage=_c.util.el('div','stage',_c.center);
    },
    'frame.toast':base=>(_c)=>{
      base(_c);
      if(_c.display==='toast'){
        const note=document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').classList.add('instruction-prompt');
        _c.header.appendChild(note);
        _c.header.querySelector('.task-controls i:last-child').style.visibility='hidden';
        note.querySelector('.ref-note-x').addEventListener('click',()=>{_c.header.style.visibility='hidden';});
      }
    },
    'frame.footer':base=>(_c)=>{
      base(_c);
      const foot=document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);_c.foot=foot;
    },
    'frame.floating':base=>(_c)=>{
      base(_c);
      const dock=document.body.querySelector('.ref-float-dock');
      if(dock)_c.foot.appendChild(dock);
    },
    overlay:()=> (ctx)=>{
      const labels={cookie:'Cookie preferences',toast:'Notification',chat:'Support',promo:'A special offer',banner:'Service notice'};
      const el=ctx.util.el('section','perturb '+ctx.kind,document.body);
      ctx.util.el('strong','',el,labels[ctx.kind]);
      ctx.util.el('p','',el,'Your SkyDrive workspace is ready.');
      const dismiss=ctx.util.el('button','dismiss',el,ctx.kind==='cookie'?'Accept':'Close');
      dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);
      return{el,dismiss};
    }
  };
  env.site({
    name:'design-handle-text-sign-agreement-06',template:'site/base',langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{THEMES:{site:palette},LOW_THEME:palette,ACCENTS:['#32a934'],LOW_ACCENTS:['#32a934'],parts}
  });
})();
