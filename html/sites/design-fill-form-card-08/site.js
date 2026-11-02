// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-card-08',
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {"site": "design-fill-form-card-08", "brand": "People Manager", "title": "Add Contact", "instruction": "left", "rail": "", "menu": "Home|Contacts|View|Tools|Help", "briefTitle": "Instructions"},
      parts: {
        'frame.5': () => () => {},
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.12': () => () => {},
        'frame.13': () => () => {},
        'frame.14': () => () => {},
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'frame.30': () => () => {},
        'frame.33': () => () => {},
        'frame.34': () => () => {},
        'frame.40': (base, S) => function (_c) {
          const { ctx, natural, u } = _c;
          const requested=ctx.display||'header';
          const roomy=window.innerWidth>=1260&&window.innerHeight>=700;
          const mode=requested==='hidden'?'hidden':requested==='toast'&&roomy?'toast':requested==='panel'&&roomy?'panel':natural;
          function briefing(parent,cls){const b=u.el('aside',cls,parent);if(cls==='ds-brief'||cls==='ds-panel-note')u.el('h2','',b,cls==='ds-panel-note'?'Instructions':'Task');u.el('div','ds-instruction',b,ctx.instruction);return b;}
          Object.assign(_c, { briefing, mode, requested, roomy });
        },
        'frame.41': () => () => {},
        'frame.44': (base, S) => function (_c) {
          const { briefing, main, mode } = _c;
          if(mode==='panel'){main.classList.add('ds-with-panel');briefing(main,'ds-panel-note');}
          if(mode==='left'||mode==='right'){const b=briefing(main,'ds-brief');if(mode==='right')b.style.order='2';}
        },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.51': (base, S) => function (_c) {
          const { content, ctx, foot, main, u } = _c;
          const clr=u.el('button','ds-clear',foot,'Clear form');
          clr.type='button';
          const er=ctx.rng.fork('chrome/end');
          const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
          const endLabels=ctx.content.END_LABELS.map(labelOf);
          const referenceEnd=er.bool(.5);
          const placement=referenceEnd?'footer':er.pick(['toolbar','link']);
          const label=referenceEnd?'Submit':er.pick(endLabels.filter(x=>x!=='Submit'));
          _c.submit = null;
          if(!ctx.finish){
  let parent=foot;
  if(placement==='toolbar'){
    parent=u.el('div','ds-end-toolbar',content);
    content.insertBefore(parent,main);
    u.el('div','ds-toolbar-caption',parent,'Contact Profile');
    content.classList.add('ds-with-toolbar');
  }
  _c.submit=u.el(placement==='link'?'a':'button','ds-submit'+(placement==='link'?' ds-end-link':''),parent,label);
  if(placement==='link')_c.submit.href='#';else _c.submit.type='button';
  _c.submit.dataset.role='submit';
  _c.submit.title=label;
  _c.submit.setAttribute('aria-label',label);
  _c.submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
}
          Object.assign(_c, { clr, endLabels, er, label, labelOf, placement, referenceEnd });
        },
        'frame.52': () => () => {},
        'frame.55': (base, S) => function (_c) {
          const { cancel, ctx, endLabels, foot, label, stage, u } = _c;
          cancel.addEventListener('click',()=>env.log('decoy',{label:'Cancel'}));
          const cr=ctx.rng.fork('chrome/collide');
          if(cr.bool(.3)){
  const alternatives=[...new Set(endLabels)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
  if(alternatives.length){
    const text=cr.pick(alternatives);
    const decoy=u.el('button','ds-xtra',foot,text);
    decoy.type='button';
    decoy.dataset.role='xtra';
    decoy.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));
  }
}
          return{stage,submit: _c.submit};
          Object.assign(_c, { cr });
        },
      },
    },
  });
})();
