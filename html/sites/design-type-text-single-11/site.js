(function(){'use strict';
const C={site:'design-type-text-single-11',menu:['File','Edit','View','Tools','Options'],tabs:['Task','Notes','Plans','Reference','Log'],
  hint:'Type the exact text shown above into the field below.',
  note:'The entry is case-sensitive. Please match the text exactly.'};
const palette={bg:'#878898',panel:'#e3e0d8',fg:'#111111',muted:'#6e6c66',line:'#53545c'};
const parts={
  'frame.layout':(base)=>(_c)=>{
    base(_c);
    // The notebook has room for its inset note in every viewport.
    _c.display=_c.ctx.display||'header';
    document.body.classList.toggle('ref-has-note',_c.display==='toast');
  },
  'frame.placement':(base)=>(_c)=>{
    base(_c);
    _c.nav=false;_c.sidebar=false;_c.wantFooter=true;
  },
  'frame.header':()=> (_c)=>{
    if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
    const selection=window.getSelection();if(selection)selection.removeAllRanges();
    const u=_c.util;
    const bar=u.el('header','mt-bar',document.body);
    u.el('span','mt-ws',bar,'Workspace 1');
    const nav=u.el('nav','mt-menu',bar);
    C.menu.forEach(t=>{const s=u.el('span','',nav);u.el('u','',s,t);});
    u.el('span','mt-clock',bar,'Mon Apr 15  1991  10:24 AM');
    const gear=u.el('span','mt-gear',bar);gear.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 2h6l1 4 4 2v8l-4 2-1 4H9l-1-4-4-2V8l4-2zM8 8h8v8H8zM12 2v6m0 8v6M4 12h4m8 0h4"/></svg>';
    const desk=u.el('div','mt-desk',document.body);
    const win=u.el('div','mt-win',desk);
    const tb=u.el('div','mt-title',win);
    u.el('i','mt-box',tb);u.el('b','',tb,'Notebook - Task');u.el('i','mt-box mt-box-r',tb);
    const tabs=u.el('div','mt-tabs',desk);
    C.tabs.forEach((t,i)=>u.el('div','mt-tab'+(i===0?' on':''),tabs,t));
    const page=u.el('main','mt-page',desk);
    Object.assign(_c,{header:page,page,menu:nav});
  },
  'frame.nav':()=>()=>{},
  'frame.instruction':(base)=>(_c)=>{
    base(_c);
    const note=_c.page.querySelector('.ref-instruction');
    if(note)note.classList.add('mt-instruction','ds-instruction','mt-instruction-header');
    if(_c.display!=='hidden')_c.util.el('hr','mt-rule1',_c.page);
    _c.util.el('p','mt-hint',_c.page,C.hint);
  },
  'frame.tools':(base)=>(_c)=>{
    base(_c);
    _c.headerTools.classList.add('mt-page-tools');
    for(const b of _c.headerTools.querySelectorAll('.ref-xtra'))_c.menu.appendChild(b);
  },
  'frame.body':()=> (_c)=>{_c.body=_c.page;},
  'frame.panel':(base)=>(_c)=>{
    base(_c);
    const note=_c.page.querySelector('.ref-panel');
    if(note)note.classList.add('mt-instruction','mt-instruction-panel');
  },
  'frame.stage':()=> (_c)=>{
    const u=_c.util;
    _c.stage=u.el('div','mt-stage ds-stage',_c.page);
    u.el('hr','mt-rule2',_c.page);
    const note=u.el('div','mt-note',_c.page);
    u.el('b','',note,'Note:');note.append(' '+C.note);
  },
  'frame.toast':(base)=>(_c)=>{
    base(_c);
    const note=document.body.querySelector('.ref-note');
    if(note){
      note.classList.add('mt-instruction','mt-instruction-toast');
      _c.page.appendChild(note);
    }
  },
  'frame.footer':(base)=>(_c)=>{
    base(_c);
    const foot=document.body.querySelector('.ref-foot');
    if(foot){
      _c.page.appendChild(foot);
      for(const b of foot.querySelectorAll('.ref-xtra'))_c.menu.appendChild(b);
    }
  },
  'frame.floating':(base)=>(_c)=>{
    base(_c);
    const dock=document.body.querySelector('.ref-float-dock');
    if(dock)_c.page.appendChild(dock);
  },
  overlay:()=> (ctx)=>{
    const u=ctx.util;
    document.body.classList.add('mt-survey');
    const el=u.el('section','mt-drawer ds-overlay-'+ctx.kind,document.body);
    el.dataset.role='overlay';
    const tb=u.el('div','mt-title mt-dtitle',el);
    u.el('i','mt-box',tb);u.el('b','',tb,'User Survey');u.el('i','mt-box mt-box-r',tb);
    const body=u.el('div','mt-dbody',el);
    u.el('p','mt-dintro',body,'Help us improve this application. Please answer a few questions (optional).');
    u.el('hr','mt-drule',body);
    const q=(n,text,opts)=>{u.el('div','mt-q',body,n+'. '+text);opts.forEach(o=>{const r=u.el('div','mt-opt',body);u.el('i','mt-radio',r);r.append(o);});};
    q(1,'How often do you use this type of tool?',['Daily','Weekly','Monthly','Rarely']);
    q(2,'What is your primary role?',['Student','Researcher','Engineer','Manager','Other']);
    u.el('div','mt-q mt-q3',body,'3. Any additional comments?');
    const ta=u.el('div','mt-ta',body);
    const sb=u.el('div','mt-sb',ta);u.el('i','',sb,'▲');u.el('span','',sb);u.el('i','',sb,'▼');
    const dismiss=u.el('button','mt-close',el,'Close survey');
    dismiss.type='button';
    dismiss.addEventListener('click',()=>{document.body.classList.remove('mt-survey');ctx.dismiss('close');});
    return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
  }
};
env.site({name:C.site,template:'site/base',langs:['en'],
  styles:['templates/site/css/base-hooks.css','site.css'],
  design:{THEMES:{'design-type-text-single-11':palette},LOW_THEME:palette,
    ACCENTS:['#a2acd8'],LOW_ACCENTS:['#a2acd8'],parts}
});
})();
