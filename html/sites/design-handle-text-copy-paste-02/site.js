// Design on templates/site/ui-text-find-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-handle-text-copy-paste-02",
    styles: ['site.css'],
    template: 'site/handle-text-find-01',
    design: {
      cfg: {"title":"TextLab","theme":"devtool","layout":"workspace","tools":"Simple tools for everyday tasks","rail":""},
      parts: {
        'frame.7': (base, S) => function (_c) {
          const { cfg } = S;
          const { head, u } = _c;
          if(cfg.tools)u.el('div','tools',head,cfg.tools);
        },
        'frame.15': (base, S) => function (_c) {
          const { cfg } = S;
          const { u, work } = _c;
          if(cfg.rail){const rail=u.el('nav','rail',work);cfg.rail.split('|').forEach((s,i)=>u.el('div',i===0?'active':'',rail,s));}
        },
        'frame.22': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'frame.30': () => () => {},
        'frame.31': () => () => {},
        'frame.32': () => () => {},
        'frame.33': () => () => {},
        'frame.34': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.37': () => () => {},
        'frame.38': () => () => {},
        'frame.39': () => () => {},
        'frame.40': () => () => {},
        'frame.41': () => () => {},
        'frame.42': () => () => {},
        'frame.43': () => () => {},
        'frame.46': () => () => {},
        'frame.48': () => () => {},
        'frame.49': () => () => {},
        'frame.50': () => () => {},
        'frame.52': (base, S) => function (_c) {
          const { ctx, endR, foot, head, u } = _c;
          const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name);
          const endLabels=ctx.content.END_LABELS.map(labelOf);
          const original=endR.bool(0.5);
          const placement=original?'form':endR.pick(['header','link']);
          const endLabel=original?'Submit':endR.pick(endLabels);
          const headerActions=u.el('div','header-actions',head);
          _c.submit = null;
          if(!ctx.finish){
  _c.submit=u.el('button','submit end-'+placement,placement==='header'?headerActions:foot,endLabel);
  _c.submit.type='button';
  _c.submit.title=endLabel;
  _c.submit.setAttribute('aria-label',endLabel);
  _c.submit.addEventListener('click',ctx.submit);
}
          Object.assign(_c, { endLabel, endLabels, headerActions, labelOf, original, placement });
        },
        'frame.53': () => () => {},
        'frame.54': () => () => {},
        'frame.56': (base, S) => function (_c) {
          const { collideR, endLabel, endLabels, headerActions, shell, u } = _c;
          if(collideR.bool(0.3)){
  const pool=endLabels.filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase());
  if(pool.length){
    const label=collideR.pick(pool);
    const decoy=u.el('button','chrome-xtra',headerActions,label);
    decoy.type='button';decoy.dataset.role='xtra';
    decoy.addEventListener('click',()=>env.log('decoy',{label,collide:true}));
  }
}
          const shortcuts=u.el('aside','shortcuts',shell);
          shortcuts.setAttribute('aria-label','Keyboard shortcuts');
          for(const [keys,action] of [['Ctrl + C','Copy'],['Ctrl + V','Paste']]){
  const row=u.el('div','shortcut-row',shortcuts);
  u.el('kbd','',row,keys);u.el('span','',row,action);
}
          Object.assign(_c, { shortcuts });
        },
      },
    },
  });
})();
