// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-invoice-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {"site": "design-fill-form-invoice-10", "brand": "People Manager", "title": "Add Contact", "instruction": "top", "rail": "1|2|3|4|5", "menu": "Home|Contacts|View|Tools|Help", "briefTitle": "Instructions"},
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
          const { content, ctx, natural } = _c;
          const narrow=content.clientWidth<1150;
          const mode=ctx.display==='hidden'?'hidden':ctx.display==='panel'&&!narrow?'left':ctx.display==='toast'&&!narrow?'toast':natural;
          content.dataset.display=mode;
          Object.assign(_c, { mode, narrow });
        },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.52': (base, S) => function (_c) {
          const { content, ctx, foot, main, u } = _c;
          const endRng=ctx.rng.fork('chrome/end');
          const labels=ctx.content.END_LABELS.map(x=>typeof x==='string'?x:x.label||x.text||x.name);
          const referenceEnd=endRng.bool(0.5);
          const placement=referenceEnd?'footer':endRng.pick(['header','link']);
          const label=referenceEnd?(labels.find(x=>x==='Submit')||'Submit'):endRng.pick(labels.filter(x=>x!=='Submit'));
          foot.dataset.end=ctx.finish?'finish':placement;
          _c.submit = null;
          if(!ctx.finish){
 let host=foot;
 if(placement==='header'){
  host=u.el('div','ds-endtools',content);
  content.insertBefore(host,main);
 }
 _c.submit=u.el('button','ds-submit'+(placement==='link'?' ds-endlink':''),host,label);
 _c.submit.type='button';_c.submit.dataset.role='submit';_c.submit.title=label;
 _c.submit.setAttribute('aria-label',label);
 _c.submit.addEventListener('click',()=>ctx.submit());
}
          const collideRng=ctx.rng.fork('chrome/collide');
          if(!ctx.finish&&collideRng.bool(0.3)){
 const options=labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
 const text=collideRng.pick(options);
 const decoy=u.el('button','ds-xtra',foot,text);decoy.type='button';decoy.dataset.role='xtra';
 decoy.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));
}
          const cancel=u.el('button','ds-cancel',foot,'Clear');
          Object.assign(_c, { cancel, collideRng, endRng, label, labels, placement, referenceEnd });
        },
        'frame.53': () => () => {},
      },
    },
  });
})();
