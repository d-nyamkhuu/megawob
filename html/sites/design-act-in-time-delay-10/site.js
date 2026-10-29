(function(){
  'use strict';
  env.site({
    name:'design-act-in-time-delay-10',styles:['site.css'],scripts:[],
    frame(ctx){
      if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
      const selection=window.getSelection();if(selection)selection.removeAllRanges();
      const u=ctx.util;
      const menu=u.el('header','ds-top',document.body);
      u.el('span','ds-apple',menu,'●');
      ['File','Edit','Task','Options','Window','Help'].forEach(t=>u.el('span','',menu,t));
      u.el('span','ds-time',menu,'10:27 AM');
      const content=u.el('div','ds-content',document.body);
      const title=u.el('div','ds-titlebar',content);
      u.el('span','ds-boxmark',title,'−');
      u.el('strong','',title,'Timed Task');
      const rightMark=u.el('span','ds-boxmark',title,'−');
      const roomy=content.getBoundingClientRect().width>=1100;
      const mode=(ctx.display==='panel'&&!roomy)?'header':ctx.display==='hidden'?'hidden':ctx.display==='panel'?'panel':ctx.display==='toast'?'toast':'header';
      function briefing(parent,cls){const b=u.el('aside',cls,parent);u.el('div','ds-instruction',b,ctx.instruction);return b;}
      if(mode==='header')briefing(content,'ds-header-note');
      const main=u.el('div','ds-main',content);
      if(mode==='panel')main.classList.add('ds-panel-layout');
      if(mode==='panel')briefing(main,'ds-panel-note');
      const stage=u.el('main','ds-stage',main);
      if(mode==='toast'){const note=briefing(content,'ds-toast');content.insertBefore(note,main);}
      const foot=u.el('footer','ds-footer',content);
      let submit=null;
      if(!ctx.finish){
        const er=ctx.rng.fork('chrome/end');
        const labels=ctx.content&&Array.isArray(ctx.content.END_LABELS)&&ctx.content.END_LABELS.length?ctx.content.END_LABELS:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];
        const labelOf=x=>typeof x==='string'?x:(x&&(x.label||x.text||x.name))||String(x);
        const classic=er.bool(0.5);
        const label=classic?'Submit':labelOf(er.pick(labels));
        const placement=classic?'footer':er.pick(['titlebar','menubar']);
        const makeEnd=(parent,cls,text)=>{
          const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';
          b.setAttribute('aria-label',label);b.title=label;b.addEventListener('click',()=>ctx.submit());return b;
        };
        if(placement==='titlebar'){
          submit=makeEnd(title,'ds-submit ds-title-submit',label);
          title.insertBefore(submit,rightMark);
        }else if(placement==='menubar'){
          submit=makeEnd(menu,'ds-submit ds-menu-submit',label);
        }else submit=makeEnd(foot,'ds-submit',label);

        const cr=ctx.rng.fork('chrome/collide');
        if(cr.bool(0.3)){
          const normalized=x=>labelOf(x).trim().toLowerCase();
          const options=labels.filter(x=>normalized(x)!==normalized(label));
          if(options.length){
            const text=labelOf(cr.pick(options));
            const parent=title;
            const decoy=u.el('button','ds-xtra'+(parent===title?' ds-title-xtra':''),parent,text);
            decoy.type='button';decoy.dataset.role='xtra';
            decoy.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));
          }
        }
      }
      return{stage,submit};
    },
    overlay(ctx){
      const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));
      return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  });
})();
