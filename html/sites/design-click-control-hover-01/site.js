(function(){
  'use strict';
  const cfg={title:'Pointer Task - Mouse Trainer',theme:'qt',layout:'board'};
  env.site({
    name:'design-click-control-hover-01',styles:['site.css'],
    frame(ctx){
      const u=ctx.util;
      document.body.className='ref '+cfg.theme+' '+cfg.layout;
      const shell=u.el('main','shell',document.body);
      const head=u.el('header','head',shell);
      const title=u.el('div','title',head,cfg.title);
      const controls=u.el('span','window-controls',title);
      controls.innerHTML='<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menubar=u.el('div','native-menu',head);
      ['File','Edit','View','Tools','Help'].forEach(x=>u.el('span','',menubar,x));
      const toolbar=u.el('div','tools',head);
      const groups={Task:['New','Open','Save','Undo','Redo'],View:['Show Grid','Show Bounds','Show Instructions'],Options:['Settings','Reset'],Help:['Help','About']};
      const svg={
        New:'<path d="M5 2h17l6 6v23H5Z" fill="#f8fbff" stroke="#656a72"/><path d="M22 2v7h6" fill="#dfe4eb" stroke="#656a72"/>',
        Open:'<path d="M2 9h10l3 4h16v17H2Z" fill="#af8a38" stroke="#735620"/><path d="M3 12h29l-6 18H1Z" fill="#e8cf78" stroke="#806121"/>',
        Save:'<path d="M3 2h25l3 3v27H3Z" fill="#2269a6" stroke="#163d61"/><path d="M8 3h16v11H8Z" fill="#eff4f8"/><path d="M8 20h17v12H8Z" fill="#f4f6f7"/>',
        Undo:'<path d="m12 4-10 11 10 10v-7c10-1 16 2 17 11 6-16-4-20-17-19Z" fill="#a9adb1"/>',
        Redo:'<path d="m22 4 10 11-10 10v-7C12 17 6 20 5 29-1 13 9 9 22 10Z" fill="#a9adb1"/>',
        Settings:'<path d="m14 2 6 0 1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2Z" fill="#aaa7bc" stroke="#555563"/><circle cx="17" cy="17" r="7" fill="#d7d8e0"/>',
        Reset:'<path d="M2 3h30v23H2Z" fill="#e8ecf0" stroke="#5b636e"/><path d="M5 6h24v17H5Z" fill="#3987c2"/><path d="M14 26h6v4h7v3H7v-3h7Z" fill="#a0a8b1"/>',
        Help:'<circle cx="17" cy="17" r="15" fill="#1873bf" stroke="#164e8a"/><path d="M11 11c1-8 14-7 13 0-1 4-6 4-6 9M18 24v3" fill="none" stroke="#fff" stroke-width="3.6"/>',
        About:'<path d="M5 2h16l7 7v23H5Z" fill="#f5f8fb" stroke="#4e627e"/><path d="M21 2v8h7" fill="#d7e0ee"/><path d="M9 13h15M9 17h15M9 21h15M9 25h15" stroke="#317dc5" stroke-width="2"/>'
      };
      Object.entries(groups).forEach(([group,items])=>{
        const g=u.el('div','ribbon-group',toolbar);u.el('strong','ribbon-label',g,group);
        const row=u.el('div','ribbon-row',g);
        items.forEach(item=>{
          if(group==='View'){const l=u.el('label','ribbon-check',row);const c=u.el('input','',l);c.type='checkbox';c.checked=item!=='Show Grid';u.el('span','',l,item);return;}
          const b=u.el('div','ribbon-tool'+(['Undo','Redo'].includes(item)?' is-off':''),row);
          if(svg[item])b.innerHTML='<svg viewBox="0 0 34 34" stroke-width="1.2" stroke-linejoin="round">'+svg[item]+'</svg>';
          u.el('span','',b,({New:'New Task',Reset:'Reset Task',Help:'Help Topics'})[item]||item);
        });
      });
      const work=u.el('div','work',shell);
      const display=ctx.display||'header';
      const center=u.el('section','center',work);
      const noteParent=display==='panel'?work:display==='toast'?head:center;
      const note=u.el('div','instruction instruction-'+display,noteParent,ctx.instruction);
      note.dataset.display=display;note.hidden=display==='hidden';
      const stage=u.el('div','stage',center);
      const foot=u.el('footer','footer',shell);
      const ready=u.el('div','ready',foot);
      u.el('span','status-ready',ready,'Status:    Ready');
      u.el('span','status-help',ready,'Square moves within the dashed area.');
      let submit=null;
      if(!ctx.finish){
        const r=ctx.rng.fork('chrome/end');
        const placement=r.pick(['footer','footer','footer','menubar','link','icon']);
        const entries=ctx.content&&ctx.content.END_LABELS;
        const bank=Array.isArray(entries)&&entries.length?entries:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
        const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
        const label=placement==='footer'?'Submit':labelOf(r.pick(bank));
        const addEnd=(parent,cls,text)=>{
          const b=u.el(cls==='qt-end-link'?'a':'button',cls,parent,text);
          b.type='button';b.setAttribute('aria-label',label);b.title=label;
          b.addEventListener('click',e=>{e.preventDefault();ctx.submit();});return b;
        };
        if(placement==='menubar')submit=addEnd(menubar,'qt-end-toolbar',label);
        else if(placement==='link')submit=addEnd(foot,'qt-end-link',label+'  ›');
        else if(placement==='icon')submit=addEnd(foot,'submit qt-end-icon','✓');
        else submit=addEnd(foot,'submit',label);
        const cr=ctx.rng.fork('chrome/collide');
        if(cr.bool(.3)){
          const other=bank.filter(x=>labelOf(x).trim().toLowerCase()!==label.trim().toLowerCase());
          if(other.length){const d=u.el('button','qt-pqd-xtra',foot,labelOf(cr.pick(other)));d.type='button';d.addEventListener('click',()=>env.log('decoy',{label:d.textContent,collide:true}));}
        }
      }
      return{stage,submit};
    },
    overlay(ctx){
      const el=ctx.util.el('section','perturb '+ctx.kind,document.body);
      ctx.util.el('strong','',el,{cookie:'Cookie preferences',toast:'Notification',chat:'Support',promo:'A special offer',banner:'Service notice'}[ctx.kind]);
      ctx.util.el('p','',el,{cookie:'Choose your preferences to continue.',toast:'Your workspace is ready.',chat:'How can we help?',promo:'Explore the latest tools.',banner:'A new update is available.'}[ctx.kind]);
      const dismiss=ctx.util.el('button','dismiss',el,ctx.kind==='cookie'?'Accept':'Close');dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);return{el,dismiss};
    }
  });
})();
