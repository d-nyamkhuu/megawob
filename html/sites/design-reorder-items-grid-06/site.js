// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-reorder-items-grid-06",
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {"layout": "stack", "theme": "collage", "title": "", "foot": "Reorder all tiles. The list will be read left to right, top to bottom.", "accent": "#ff7921", "bg": "#f6f4ef", "surface": "#fcfcfc", "font": "Arial, sans-serif"},
      parts: {
        'frame.2': (base, S) => function (_c) {
          const { C } = S;
          const { body, ctx, u } = _c;
          {body.className='design bauhaus'+(ctx.display==='toast'?' has-instruction-toast':'');
  const shell=u.el('div','bh-shell',body),left=u.el('div','bh-left',shell);
  const brand=u.el('div','bh-brand',left);u.el('span','bh-dot',brand);u.el('span','bh-sq',brand);u.el('span','bh-name',brand,'SortLab');
  const note=u.el('section','task-note',left);u.el('div','instruction',note,ctx.instruction);
  if(ctx.display==='hidden')note.hidden=true;else if(ctx.display==='toast'){note.classList.add('instruction-toast');const x=u.el('button','note-close',note,'×');x.onclick=()=>note.style.visibility='hidden';}else if(ctx.display==='panel')note.classList.add('instruction-panel');
  const stage=u.el('main','stage',left);stage.dataset.role='stage';
  const side=u.el('aside','bh-side',shell);u.el('h2','bh-h',side,'Your Order');
  u.el('div','bh-slots',side);
  u.el('div','bh-gap',side);let submit=null;
  const er=ctx.rng.fork('chrome/end');
  const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
  const endLabels=ctx.content.END_LABELS.map(labelOf);
  const placement=er.pick(['side-top','footer','header','footer']);
  const original=placement==='footer';
  const label=original?'Submit':er.pick(endLabels.filter(x=>x!=='Submit'));
  if(!ctx.finish){
   const parent=placement==='header'?brand:side;
   submit=u.el(placement==='side-top'?'a':'button','submit bh-end-'+placement,parent);u.el('span','submit-label',submit,label);
   if(submit.tagName==='BUTTON')submit.type='button';else submit.href='#';
   submit.dataset.role='submit';submit.title=label;submit.setAttribute('aria-label',label);submit.onclick=e=>{e.preventDefault();ctx.submit();};
   if(placement==='side-top')side.insertBefore(submit,side.querySelector('.bh-slots'));
  }
  const cr=ctx.rng.fork('chrome/collide');
  if(cr.bool(0.3)){
   const options=[...new Set(endLabels)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
   if(options.length){const text=cr.pick(options),decoy=u.el('button','bh-xtra',brand,text);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label:text,collide:true});}
  }
  const clear=u.el('button','clear',side,'Clear All');clear.type='button';clear.onclick=()=>{env.widgetDef.clear?.();};
  return{stage,submit};}
          body.className='design '+C.theme+' layout-'+C.layout+(ctx.display==='toast'?' has-instruction-toast':'');
        },
        'frame.3': () => () => {},
        'frame.22': () => () => {},
        'frame.27': (base, S) => function (_c) {
          const { C } = S;
          const { ctx, footer, u } = _c;
          if(!ctx.finish){const parent=C.layout==='three'&&_c.aside?_c.aside:footer;_c.submit=u.el('button','submit',parent);u.el('span','submit-label',_c.submit,'Submit');_c.submit.type='button';_c.submit.dataset.role='submit';_c.submit.onclick=()=>ctx.submit();}
        },
      },
    },
  });
})();
