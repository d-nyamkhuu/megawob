(function(){'use strict';const C={title:'Rivers and Canals of the World',nav:['Home','Articles','Geography','Library','Help'],heading:'Waterways in History'};
env.site({name:"design-select-text-paragraph-12",styles:['site.css','acad.css'],scripts:[],frame(ctx){
 const u=ctx.util,body=document.body;body.className='design acad'+(ctx.display==='toast'?' has-instruction-toast':'');
 const endR=ctx.rng.fork('chrome/end'), collideR=ctx.rng.fork('chrome/collide');
 const endBank=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
 const labelOf=x=>(typeof x==='string'?x:x&&(x.label||x.text||x.name))||String(x);
 const canonical=endR.bool(.5), endLabel=canonical?'Submit':labelOf(endR.pick(endBank.filter(x=>labelOf(x).trim().toLowerCase()!=='submit').length?endBank.filter(x=>labelOf(x).trim().toLowerCase()!=='submit'):endBank));
 const placement=canonical?'footer':endR.pick(['top','link']);
 const collide=collideR.bool(.3)?(()=>{const opts=endBank.map(labelOf).filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase());return opts.length?collideR.pick(opts):null;})():null;
 const collideAt=collide?collideR.pick(['top','footer']):null;
 for(const [k,v] of Object.entries({panel:'#fff',fg:'#000',muted:'#555',line:'#888',accent:'#000080',bg:'#fff',font:'"Times New Roman",Times,serif'}))document.documentElement.style.setProperty('--'+k,v);
 const shell=u.el('div','shell',body);
 const doc=u.el('div','doc',shell);
 const h1=u.el('h1','doc-title',doc);u.el('a','',h1,C.title).href='#';
 u.el('hr','doc-rule',doc);
 const nav=u.el('nav','doc-nav',doc);
 C.nav.forEach((t,i)=>{if(i)u.el('span','sep',nav,'|');const a=u.el('a','',nav,t);a.href='#';a.onclick=e=>e.preventDefault();});
 h1.firstChild.onclick=e=>e.preventDefault();
 const display=ctx.display||'panel';
 const makeNote=(parent,cls)=>{const n=u.el('section','task-note '+cls,parent);u.el('div','instruction',n,ctx.instruction);return n;};
 if(display==='header')makeNote(doc,'instruction-header');
 if(display==='toast')makeNote(doc,'instruction-toast');
 u.el('h2','doc-head',doc,C.heading);
 const stage=u.el('main','stage',doc);stage.dataset.role='stage';
 const aside=u.el('aside','side',shell);
 u.el('h3','side-h',aside,'Document Tools');
 let submit=null;
 const endControl=(parent,cls,asLink)=>{const b=u.el(asLink?'a':'button','btn '+cls,parent,endLabel);if(asLink)b.href='#';else b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',endLabel);b.title=endLabel;b.onclick=e=>{e.preventDefault();ctx.submit();};submit=b;return b;};
 const decoy=(parent,label)=>{const b=u.el('button','btn xtra',parent,label);b.type='button';b.dataset.role='xtra';b.onclick=()=>env.log('decoy',{label,collide:true});return b;};
 if(placement==='top'||(collide&&collideAt==='top')){const row=u.el('div','top-command',aside);if(placement==='top'&&!ctx.finish)endControl(row,'submit',false);if(collide&&collideAt==='top')decoy(row,collide);}
 const box=u.el('div','tools-box',aside);
 const ico=u.svg('svg',{width:40,height:50,viewBox:'0 0 42 50',fill:'none',stroke:'#000','stroke-width':2,class:'tools-ico'},box);
 u.svg('path',{d:'M5 3H33L41 12V49H5Z',fill:'#cdd3d8',stroke:'none'},ico);
 u.svg('path',{d:'M1 1H31V11H40V49H1Z M31 1H33V3H35V5H37V7H39V9H40V11 M8 14H22M8 20H34M8 27H34M8 33H34M8 39H34',fill:'#f9fafb'},ico);
 const msg=u.el('p','tools-msg',box,'Tools are hidden to');u.el('br','',msg);msg.append(document.createTextNode('keep the workspace clear.'));
 const exp=u.el('button','btn expand',box,'Expand tools');exp.type='button';
 const tools=u.el('div','tools-open',box);tools.hidden=true;
 const clr=u.el('button','btn',tools,'Clear');clr.type='button';clr.onclick=()=>{env.widgetDef.clear?.();};
 exp.onclick=()=>{tools.hidden=false;exp.hidden=true;msg.textContent='Tools are available.';};
 u.el('hr','side-rule',aside);
 u.el('h3','side-h',aside,'Your Task');
 const note=u.el('section','task-note',aside);
 u.el('div','instruction',note,ctx.instruction);
 if(display==='hidden'||display==='header'||display==='toast')note.hidden=true;
 if(!ctx.finish)u.el('p','then',aside,'Then click '+endLabel+'.');
 if(display==='panel')note.hidden=false;
 if(!ctx.finish&&placement==='footer')endControl(aside,'submit',false);
 if(!ctx.finish&&placement==='link')endControl(aside,'submit text-link',true);
 if(!ctx.finish&&collide&&collideAt==='footer'){const holder=u.el('div','xtra-row',aside);decoy(holder,collide);}
 return{stage,submit};},
 overlay(ctx){const u=ctx.util,kind=ctx.kind;const el=u.el('section','obstruction obstruction-'+kind,document.body);el.dataset.role='overlay';const box=u.el('div','obstruction-box',el);
 const title={cookie:'Your privacy',toast:'Changes saved',chat:'Support',promo:'Workspace update',banner:'Service notice'}[kind];
 const text={cookie:'This application stores optional cookies.',toast:'Your changes have been saved.',chat:'Need a hand with this workspace?',promo:'Explore the latest workspace features.',banner:'You are viewing a shared workspace.'}[kind];
 u.el('h3','',box,title);u.el('p','',box,text);
 const dismiss=u.el('button','dismiss',box,kind==='cookie'?'Reject optional':'Close');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('close');
 if(kind==='cookie'){const a=u.el('button','dismiss',box,'Accept optional');a.type='button';a.onclick=()=>ctx.dismiss('accept');}
 return{el,dismiss,ttlSteps:kind==='toast'?5:0};}
});})();
