(function(){'use strict';
const C={site:'design-type-text-single-01',title:'Library Membership Form',intro:'Please complete the form below. Fields marked with * are required.'};
const ICONS=[
'<svg viewBox="0 0 26 36" width="100%" height="100%" fill="none" stroke="#111" stroke-width="1.5"><path d="M1 2h15l9 9v23H1z"/><path d="M16 2v9h9"/></svg>',
'<svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="#111" stroke-width="2"><circle cx="13" cy="13" r="9"/><path d="M20 20l9 9"/></svg>',
'<svg viewBox="0 0 20 32" width="100%" height="100%"><text x="10" y="29" text-anchor="middle" font-family="Times New Roman,serif" font-size="38" fill="#111">?</text></svg>'];
const palette={bg:'#fff',panel:'#fff',fg:'#000',muted:'#333',line:'#000'};
const parts={
'frame.placement':(base)=>(_c)=>{base(_c);_c.nav=false;_c.sidebar=false;_c.wantFooter=true;},
'frame.header':()=>(_c)=>{
 if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
 const selection=window.getSelection();if(selection)selection.removeAllRanges();
 const u=_c.util;
 const page=u.el('div','ds-page ds-mode-'+_c.display,document.body);
 const brief=u.el('aside','ds-brief',page);
 const doc=u.el('div','ds-doc',page);
 u.el('h1','ds-title',doc,C.title);
 u.el('hr','ds-rule',doc);
 u.el('p','ds-intro',doc,C.intro);
 const tools=u.el('aside','ds-tools',page);
 ICONS.forEach((svg,i)=>{const t=u.el('div','ds-tool',tools);t.innerHTML=svg;if(i<2)u.el('hr','ds-trule',tools);});
 Object.assign(_c,{page,brief,doc,header:brief});
},
'frame.nav':()=>()=>{},
'frame.tools':(base)=>(_c)=>{
 // The form's action toolbar retains the original button position.
 const toolbar=_c.util.el('div','ds-footer',_c.doc);
 const header=_c.header;_c.header=toolbar;base(_c);_c.header=header;
 _c.toolbar=toolbar;
},
'frame.body':()=>(_c)=>{_c.body=_c.doc;},
'frame.panel':(base)=>(_c)=>{
 const body=_c.body;_c.body=_c.brief;base(_c);_c.body=body;
},
'frame.stage':()=>(_c)=>{
 _c.stage=_c.util.el('main','ds-stage',_c.doc);
 _c.doc.insertBefore(_c.stage,_c.toolbar);
 const rule=_c.util.el('hr','ds-rule ds-rule2',_c.doc);
 _c.doc.insertBefore(rule,_c.toolbar);
},
'frame.toast':(base)=>(_c)=>{
 base(_c);
 if(_c.display==='toast')_c.brief.appendChild(document.body.querySelector('.ref-note'));
},
'frame.footer':(base)=>(_c)=>{
 base(_c);
 const foot=document.body.querySelector('.ref-foot');
 _c.toolbar.appendChild(foot);
 const clear=_c.util.el('button','ds-clear',_c.toolbar,'Clear');clear.type='button';
 clear.addEventListener('click',()=>{const fields=_c.stage.querySelectorAll('[data-role="field"]');fields.forEach(field=>{if(!field.disabled){field.value='';field.dispatchEvent(new Event('input',{bubbles:true}));}});});
},
'frame.floating':(base)=>(_c)=>{
 base(_c);
 const dock=document.body.querySelector('.ref-float-dock');
 if(dock)_c.toolbar.appendChild(dock);
},
overlay:()=>(ctx)=>{const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
u.el('div','',el,texts[ctx.kind]);
const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
dismiss.addEventListener('click',()=>ctx.dismiss('close'));
return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};}
};
env.site({name:C.site,template:'site/base',langs:['en'],styles:['templates/site/css/base-hooks.css','site.css'],design:{THEMES:{'design-type-text-single-01':palette},LOW_THEME:palette,ACCENTS:['#000'],LOW_ACCENTS:['#000'],parts}});
})();
