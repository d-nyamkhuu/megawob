(function(){'use strict';
const C={site:'design-choose-option-dropdown-04',kicker:'TASKS',heading:'Edit Task',meta:['Task #4187','Last updated Apr 22, 2015']};
const ICONS=[
  '<svg viewBox="0 0 28 32"><path d="M5 2h12l7 7v21H5z M17 2v7h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  '<svg viewBox="0 0 32 30"><path d="M3 3h26v18H14l-7 6v-6H3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  '<svg viewBox="0 0 28 32"><path d="M20 10v13a6 6 0 0 1-12 0V8a4 4 0 0 1 8 0v14a2 2 0 0 1-4 0V11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" transform="rotate(8 14 16)"/></svg>',
  '<svg viewBox="0 0 32 10"><circle cx="5" cy="5" r="2.6" fill="currentColor"/><circle cx="16" cy="5" r="2.6" fill="currentColor"/><circle cx="27" cy="5" r="2.6" fill="currentColor"/></svg>'];
const palette={bg:'#faf8f3',panel:'#fdfcf8',fg:'#1d3a44',muted:'#5d6b70',line:'#c9c6bb'};
const parts={
  'frame.layout':base=>_c=>{
    base(_c);
    // The original margin and document notification fit at every training size.
    _c.display=_c.ctx.display||'header';
  },
  'frame.placement':base=>_c=>{base(_c);_c.nav=false;_c.sidebar=false;_c.wantFooter=true;},
  'frame.header':()=>_c=>{
    if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
    const selection=window.getSelection();if(selection)selection.removeAllRanges();
    const u=_c.util;
    const page=u.el('div','rz-page',document.body);
    const margin=u.el('aside','rz-margin',page);
    if(_c.display==='header'||_c.display==='panel')u.el('div','rz-bar',margin);
    const doc=u.el('section','rz-doc',page);
    const head=u.el('header','rz-head',doc);
    const hl=u.el('div','rz-headl',head);
    u.el('div','rz-kicker',hl,C.kicker);
    u.el('h1','rz-h1',hl,C.heading);
    const hr=u.el('div','rz-meta',head);
    C.meta.forEach(t=>u.el('div','',hr,t));
    const tools=u.el('nav','rz-tools',page);
    ICONS.forEach((s,i)=>{const t=u.el('div','rz-tool t'+i,tools);t.innerHTML=s;});
    Object.assign(_c,{page,margin,doc,head,toolbar:hr,header:hr});
  },
  'frame.nav':()=>()=>{},
  'frame.instruction':base=>_c=>{
    const header=_c.header;_c.header=_c.margin;base(_c);_c.header=header;
  },
  'frame.tools':base=>_c=>{
    const header=_c.header;_c.header=_c.toolbar;base(_c);_c.header=header;
  },
  'frame.body':()=>_c=>{_c.body=_c.doc;},
  'frame.panel':base=>_c=>{
    const body=_c.body;_c.body=_c.margin;base(_c);_c.body=body;
  },
  'frame.stage':()=>_c=>{_c.stage=_c.util.el('main','ds-stage',_c.doc);},
  'frame.toast':base=>_c=>{
    base(_c);
    if(_c.display==='toast'){
      const note=document.body.querySelector('.ref-note');
      _c.doc.insertBefore(note,_c.stage);
    }
  },
  'frame.footer':base=>_c=>{
    base(_c);
    const foot=document.body.querySelector('.ref-foot');
    foot.classList.add('ds-footer');_c.doc.appendChild(foot);_c.foot=foot;
  },
  'frame.floating':base=>_c=>{
    base(_c);
    const dock=document.body.querySelector('.ref-float-dock');
    if(dock)_c.foot.appendChild(dock);
  },
  overlay:()=>ctx=>{const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
    const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
    u.el('div','',el,texts[ctx.kind]);
    const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
    dismiss.addEventListener('click',()=>ctx.dismiss('close'));
    return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};}
};
env.site({name:C.site,template:'site/base',langs:['en'],styles:['templates/site/css/base-hooks.css','site.css'],design:{THEMES:{[C.site]:palette},LOW_THEME:palette,ACCENTS:['#1f5a6e'],LOW_ACCENTS:['#1f5a6e'],parts}});
})();
