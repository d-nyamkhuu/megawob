(function(){
'use strict';
const U=(ctx,tag,cls,parent,text)=>ctx.util.el(tag,cls,parent,text);
const icons=[
  '<rect x="3" y="5" width="22" height="19" fill="#fbf8e8" stroke="#252525"/><rect x="3" y="5" width="22" height="4" fill="#b9d2e8" stroke="#252525"/><path d="M8 3v5M20 3v5" stroke="#313131" stroke-width="2"/><path d="M8 13h3m3 0h3m3 0h2M8 17h3m3 0h3" stroke="#9ea7ae"/>',
  '<path d="M5 4L24 23M24 4L5 23" stroke="#111" stroke-width="5"/><path d="M5 4L24 23M24 4L5 23" stroke="#d21831" stroke-width="3"/>',
  '<rect x="3" y="5" width="22" height="19" fill="#fbf8e8" stroke="#252525"/><rect x="3" y="5" width="22" height="4" fill="#d3dce7" stroke="#252525"/><path d="M8 3v5M20 3v5" stroke="#333" stroke-width="2"/><circle cx="14" cy="16" r="5" fill="#fff" stroke="#14398b"/><path d="M14 12v4l3 2" fill="none" stroke="#c31731" stroke-width="1.5"/>',
  '<path d="M13 3L2 14l11 10v-6h13v-8H13z" fill="#475ed8" stroke="#10124c" stroke-width="1.5"/><path d="M12 5L4 14l8 7" fill="none" stroke="#a6b6ff"/>',
  '<path d="M15 3l11 11-11 10v-6H2v-8h13z" fill="#475ed8" stroke="#10124c" stroke-width="1.5"/><path d="M16 5l8 9-8 7" fill="none" stroke="#a6b6ff"/>',
  '<rect x="2" y="4" width="24" height="21" fill="#fbf8e8" stroke="#161a3e"/><rect x="2" y="4" width="24" height="5" fill="#535cb0" stroke="#161a3e"/><path d="M10 4v21M18 4v21M2 14h24M2 19h24" stroke="#343b96" stroke-width="1.2"/><path d="M7 2v6M21 2v6" stroke="#111" stroke-width="2"/>',
  '<rect x="2" y="4" width="24" height="21" fill="#fbf8e8" stroke="#161a3e"/><rect x="2" y="4" width="24" height="5" fill="#535cb0" stroke="#161a3e"/><path d="M8 4v21M14 4v21M20 4v21M2 14h24M2 19h24" stroke="#343b96" stroke-width="1.2"/><path d="M7 2v6M21 2v6" stroke="#111" stroke-width="2"/>',
  '<path d="M7 3h14v8H7z" fill="#fff" stroke="#222"/><path d="M3 10h22v11H3z" fill="#d5d5d5" stroke="#222"/><path d="M7 17h14v9H7z" fill="#fff" stroke="#222"/><path d="M10 20h8M10 23h8" stroke="#555"/><circle cx="21" cy="14" r="1" fill="#12419a"/>'
];
env.site({name:'design-use-desktop-tools-week-02',template:'site/base',design:{parts:{
frame:(_base,_S)=>function frame(ctx){
const u=(tag,cls,parent,text)=>U(ctx,tag,cls,parent,text);
const tokens={bg:'#f3f1e9',panel:'#faf9f3',fg:'#15162f',accent:'#600019',font:'Georgia,"Times New Roman",serif',line:'#9a9a9a',muted:'#44445a','button-fg':'#15162f'};
for(const [k,v] of Object.entries(tokens))document.documentElement.style.setProperty('--'+k,v);
const display=ctx.size&&ctx.size.w<1150&&['panel','toast'].includes(ctx.display)?'header':ctx.display;
document.body.className='library instruction-'+display+(ctx.finish?' finish':'');
const shell=u('div','site-shell',document.body),title=u('header','design-header',shell);
u('span','app-glyph',title,'▥');u('strong','design-brand',title,'Library Workspace');
const wc=u('span','window-controls',title);['_','□','×'].forEach(x=>u('span','',wc,x));
const nav=u('nav','design-nav',shell);
if(display==='header'){const n=u('div','task-note header-note',nav,ctx.instruction);n.dataset.role='instruction';}
else ['File','Edit','View','Calendar','Tools','Help'].forEach(label=>{const x=u('span','menu-item',nav,label);x.addEventListener('click',()=>env.log('decoy',{what:'menu',label}));});
const toolbar=u('div','design-toolbar',shell);
['New Event','Delete','Go To Today','Previous Week','Next Week','Day View','Week View','Print'].forEach((label,i)=>{const b=u('button','tool-item tool-'+i,toolbar);b.type='button';b.title=label;u('span','tool-icon',b).innerHTML='<svg viewBox="0 0 28 28" aria-hidden="true">'+icons[i]+'</svg>';u('span','tool-label',b,label);b.addEventListener('click',()=>env.log('decoy',{what:'tool',label}));});
const body=u('div','design-body',shell),stage=u('main','stage',body),help=u('aside','help-panel',body);
u('h1','help-title',help,'Calendar Help');
if(display==='panel'){const n=u('section','task-note panel-note',help);n.dataset.role='instruction';u('h2','',n,'Your Task');u('p','',n,ctx.instruction);}
const info=u('section','help-section',help);u('h2','',info,'Working with your schedule');u('p','',info,'Use the weekly calendar to view and manage your events. You can change the time of an event by dragging it to a new slot, or by resizing its top or bottom edge.');
const tips=u('section','help-section ruled',help);u('h2','',tips,'Tips');const list=u('ul','',tips);
['Point to an event and drag to move it to a different time.','Drag the top or bottom edge to make the event longer or shorter.','Use the toolbar to switch between day and week views.','Use the Previous Week and Next Week buttons to change the dates shown.','Time labels appear on the right side of the grid.'].forEach(t=>u('li','',list,t));
const legend=u('section','help-section ruled',help);u('h2','',legend,'Event colors');const lg=u('div','legend-grid',legend);
[['meetings','Meetings'],['planning','Planning'],['training','Training'],['review','Review'],['onboarding','Onboarding'],['other','Other']].forEach(([c,n])=>{const r=u('div','legend-item',lg);u('span','swatch '+c,r);u('span','',r,n);});
if(display==='toast'){const n=u('div','task-note toast-note',shell,ctx.instruction);n.dataset.role='instruction';}
const footer=u('footer','design-footer',shell);let submit=null;
if(!ctx.finish){
const er=ctx.rng.fork('chrome/end'),placement=er.pick(['footer','footer','footer','footer','header','link','icon','footer']);
const values=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:['Continue','OK','Accept','Done'];
const labelOf=x=>typeof x==='string'?x:x&&(x.label||x.text||x.name)||String(x),label=placement==='footer'?'Continue':labelOf(er.pick(values));
const cr=ctx.rng.fork('chrome/collide');let collide=null;if(cr.bool(.3)){const options=[...new Set(values.map(labelOf))].filter(x=>x.toLowerCase()!==label.toLowerCase());if(options.length)collide=cr.pick(options);}
const parent=['header','icon'].includes(placement)?toolbar:footer,tag=placement==='link'?'a':'button';
submit=u(tag,'end-control '+(parent===toolbar?'toolbar-end':placement==='link'?'footer-link':'footer-end'),parent,placement==='icon'?'✓':label);
if(tag==='a'){submit.href='#';submit.addEventListener('click',e=>e.preventDefault());}else submit.type='button';
if(placement==='icon'){submit.title='Next';submit.setAttribute('aria-label','Next');}
submit.addEventListener('click',()=>ctx.submit());
if(collide){const b=u('button','chrome-xtra',parent,collide);b.type='button';b.addEventListener('click',()=>env.log('decoy',{label:collide,collide:true}));}
if(ctx.rng.fork('chrome/filler').bool(.22)){const b=u('button','chrome-xtra',footer,"Let's go");b.type='button';b.addEventListener('click',()=>env.log('decoy',{label:"Let's go"}));}
}
return {stage,submit};
},
overlay:(_base,_S)=>function overlay(ctx){
const u=(tag,cls,parent,text)=>U(ctx,tag,cls,parent,text);
const t={cookie:['Privacy notice','This workspace uses cookies to remember your preferences.','Close'],toast:['Notice','Your workspace is ready.','Dismiss'],chat:['Library Help','How may we help you today?','Close'],promo:['Library news','Keep up with library announcements and events.','Close'],banner:['Announcement','The library calendar is available for all staff.','Dismiss']};
const [heading,copy,label]=t[ctx.kind]||t.toast,el=u('section','reference-overlay '+ctx.kind,document.body);el.setAttribute('role','dialog');el.setAttribute('aria-label',heading);u('h2','',el,heading);u('p','overlay-copy',el,copy);const actions=u('div','overlay-actions',el),dismiss=u('button','primary',actions,label);dismiss.type='button';dismiss.addEventListener('click',()=>ctx.dismiss());return {el,dismiss};
}
}}});
})();
