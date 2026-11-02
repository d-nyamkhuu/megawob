// Design on templates/site/ui-text-find-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-handle-text-copy-paste-12",
    styles: ['site.css'],
    scripts: [],
    template: 'site/handle-text-find-01',
    design: {
      cfg: {"title": "Text Copy Task", "theme": "civic", "layout": "notebook", "tools": "Civic Services Portal", "rail": "Task|Notes|Resources|Help"},
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
        'frame.48': (base, S) => function (_c) {
          const { center, ctx, foot, u } = _c;
          const endRng=ctx.rng.fork('chrome/end');
          const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x));
          const endLabels=(ctx.content.END_LABELS||['Submit','Done','Finish']).map(labelOf);
          const original=endRng.bool(0.5);
          const placement=original?'footer':endRng.pick(['header','link']);
          const label=original?'Submit':endRng.pick(endLabels);
          foot.dataset.end=placement;
          _c.submit = null;
          if(!ctx.finish){
  const parent=placement==='header'?u.el('div','episode-end-tools',center):foot;
  _c.submit=u.el(placement==='link'?'a':'button','submit'+(placement==='link'?' end-link':''),parent,label);
  if(placement==='link')_c.submit.href='#';else _c.submit.type='button';
  _c.submit.dataset.role='submit';_c.submit.title=label;_c.submit.setAttribute('aria-label',label);
  _c.submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
}
          const collideRng=ctx.rng.fork('chrome/collide');
          if(collideRng.bool(0.3)){
  const choices=[...new Set(endLabels)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());
  if(choices.length){
    const text=collideRng.pick(choices);
    const decoy=u.el('button','episode-xtra',foot,text);
    decoy.type='button';decoy.dataset.role='xtra';
    decoy.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));
  }
}
          // Folded command strip: a toggle and a help panel drawn over the status band.
          const toggle = u.el('button', 'command-toggle', document.body, '▶  Expand tools');
          toggle.type = 'button';
          const panel = u.el('div', 'command-panel', document.body);
          panel.hidden = true;
          panel.innerHTML = '<b>Clipboard commands</b><span>Select text in the source, then press <kbd>Ctrl+C</kbd>.</span><span>Focus “Copied text”, then press <kbd>Ctrl+V</kbd>.</span>';
          toggle.addEventListener('click', () => {
            panel.hidden = !panel.hidden;
            toggle.textContent = panel.hidden ? '▶  Expand tools' : '▼  Hide tools';
          });
          Object.assign(_c, { collideRng, endLabels, endRng, label, labelOf, original, panel, placement, toggle });
        },
        'frame.49': () => () => {},
        'frame.50': () => () => {},
        'frame.51': () => () => {},
        'frame.52': () => () => {},
        'frame.53': () => () => {},
        'frame.54': () => () => {},
        'frame.55': () => () => {},
        'frame.56': () => () => {},
      },
    },
  });
})();
