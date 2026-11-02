// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-reorder-items-grid-10",
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {"layout": "sheet", "theme": "bsadmin", "title": "Task Center", "foot": "", "accent": "#347fbd", "bg": "#f6f7f9", "surface": "#ffffff", "font": "\"Helvetica Neue\", Helvetica, Arial, sans-serif"},
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) => function (_c) {
          const { head, u } = _c;
          {const nav=u.el('nav','bs-nav',head);for(const [i,t] of ['Tasks','Reports','Users','Settings'].entries()){const a=u.el('span','bs-tab'+(i===0?' on':''),nav,t);}const r=u.el('div','bs-right',head);u.el('span','',r,'Help');u.el('span','bs-sep',r);u.el('span','',r,'Sign Out');}
        },
        'frame.22': () => () => {},
        'frame.27': (base, S) => function (_c) {
          const { ctx, footer, head, u } = _c;
          const endR=ctx.rng.fork('chrome/end'),pickedLabel=endR.bool(.5)?'Submit':endR.pick(ctx.content.END_LABELS),label=String(typeof pickedLabel==='string'?pickedLabel:(pickedLabel.label||pickedLabel.text||pickedLabel.name||pickedLabel));
          const placement=ctx.finish?null:endR.pick(['footer','footer','header','link']);
          const collideR=ctx.rng.fork('chrome/collide');
          _c.collide = null;
          if(collideR.bool(.3)){const pool=ctx.content.END_LABELS.map(x=>String(typeof x==='string'?x:(x.label||x.text||x.name)));const options=[...new Set(pool)].filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase());if(options.length)_c.collide=collideR.pick(options);}
          const makeEnd=(parent,cls,text,link)=>{const b=u.el(link?'a':'button',cls,parent,text);if(link)b.href='#';else b.type='button';b.dataset.role='submit';b.title=label;b.setAttribute('aria-label',label);b.onclick=e=>{e.preventDefault();ctx.submit();};return b;};
          const decoyBtn=(parent,text)=>{const b=u.el('button','bs-xtra',parent,text);b.type='button';b.dataset.role='xtra';b.onclick=()=>env.log('decoy',{label:text,collide:true});return b;};
          if(!ctx.finish&&placement==='header'){const tools=u.el('div','bs-end-tools');if(_c.collide)decoyBtn(tools,_c.collide);_c.submit=makeEnd(tools,'submit header-submit',label,false);head.insertBefore(tools,head.querySelector('.bs-right'));}
          if(!ctx.finish&&placement==='footer')_c.submit=makeEnd(footer,'submit',label,false);
          if(!ctx.finish&&placement==='link')_c.submit=makeEnd(footer,'end-link',label+' ›',true);
          if(_c.collide&&placement!=='header'){decoyBtn(footer,_c.collide);}
          Object.assign(_c, { collideR, decoyBtn, endR, label, makeEnd, pickedLabel, placement });
        },
        'frame.29': (base, S) => function (_c) {
          const { C } = S;
          const { footer, u } = _c;
          if(['aqua','collage','bsadmin'].includes(C.theme)){const reset=u.el('button','clear',footer,C.theme==='aqua'?'Reset Panel':'Reset');reset.onclick=()=>env.widgetDef.clear?.();footer.insertBefore(reset,_c.submit&&_c.submit.parentNode===footer?_c.submit:null);}
        },
      },
    },
  });
})();
