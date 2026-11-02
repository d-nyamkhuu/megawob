// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: "design-crop-image-default-10",
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {"layout": "magazine", "theme": "magazine", "title": "", "aside": "", "foot": "", "accent": "#c51e1e", "bg": "#f8f7f3", "surface": "#efefed", "font": "Georgia, 'Times New Roman', serif"},
      parts: {
        'frame.3': () => () => {},
        'frame.13': (base, S) => function (_c) {
          const { C } = S;
          const { shell, u } = _c;
          if(C.theme==='magazine'){
   const overview=u.el('section','overview',shell),copy=u.el('div','overview-copy',overview);
   u.el('h1','',copy,'Image Overview');
   u.el('p','',copy,'Below is the full image you will work with.\nUse the preview to understand the content\nand inspect the shapes.');
   const preview=u.el('div','overview-preview',overview),svg=u.svg('svg',{viewBox:'0 0 520 245',role:'img','aria-label':'Preview of a colorful image'},preview);
   u.svg('rect',{x:0,y:0,width:520,height:245,fill:'#e8e8e7'},svg);
   u.svg('circle',{cx:88,cy:78,r:34,fill:'#2674d2',stroke:'#111','stroke-width':2},svg);
   u.svg('polygon',{points:'205,105 240,40 275,105',fill:'#15943f',stroke:'#111','stroke-width':2},svg);
   u.svg('rect',{x:350,y:40,width:70,height:70,fill:'#913a9b',stroke:'#111','stroke-width':2},svg);
   u.svg('polygon',{points:'85,143 123,181 85,219 47,181',fill:'#d6242a',stroke:'#111','stroke-width':2},svg);
   u.svg('polygon',{points:'260,131 271,161 303,162 278,181 287,212 260,193 233,212 242,181 217,162 249,161',fill:'#f28b16',stroke:'#111','stroke-width':2},svg);
   u.svg('circle',{cx:430,cy:183,r:37,fill:'#ffda21',stroke:'#111','stroke-width':2},svg);
 }
          const content=u.el('div','content',shell),note=u.el('section','task-note',content);
          if(C.theme==='magazine')u.el('h2','section-heading',note,'Crop the Target');
          u.el('div','note-label',note,C.layout==='left'?'Task':'');
          Object.assign(_c, { content, note });
        },
        'frame.14': () => () => {},
        'frame.16': (base, S) => function (_c) {
          const { C } = S;
          const { note, u } = _c;
          if(C.theme==='magazine')u.el('p','brief-copy',note,'Use the handles on the crop box to resize it.\nDrag inside the box to move the selection.\nReview the image as you work.');
        },
        'frame.22': () => () => {},
        'frame.24': (base, S) => function (_c) {
          const { C } = S;
          const { ctx, shell, u } = _c;
          const er=ctx.rng.fork('chrome/end'),cr=ctx.rng.fork('chrome/collide');
          const labelOf=x=>typeof x==='string'?x:(x.label||x.text||x.name||String(x));
          const endWords=(ctx.content.END_LABELS||['Submit','Done','Finish']).map(labelOf);
          const original=er.bool(0.5),placement=original?'footer':er.pick(['overview-button','overview-link']);
          const endLabel=original?'Submit':er.pick(endWords);
          const footer=u.el('footer','footer',shell);
          Object.assign(_c, { cr, endLabel, endWords, er, footer, labelOf, original, placement });
        },
        'frame.27': (base, S) => function (_c) {
          const { C } = S;
          const { cr, ctx, endLabel, endWords, footer, placement, shell, u } = _c;
          if(C.theme==='magazine'){const reset=u.el('button','clear',footer,'Reset');reset.type='button';reset.onclick=()=>env.widgetDef.clear?.();}
          _c.overviewTools = null;
          const tools=()=>_c.overviewTools||(_c.overviewTools=u.el('div','overview-tools',shell.querySelector('.overview')));
          if(!ctx.finish){
   const parent=placement==='footer'?footer:tools();
   _c.submit=u.el(placement==='overview-link'?'a':'button','submit'+(placement==='overview-link'?' end-link':''),parent,endLabel);
   if(_c.submit.tagName==='BUTTON')_c.submit.type='button';else _c.submit.href='#';
   if(placement!=='footer')parent.classList.add(placement);
   _c.submit.dataset.role='submit';_c.submit.title=endLabel;_c.submit.setAttribute('aria-label',endLabel);
   _c.submit.onclick=e=>{e.preventDefault();ctx.submit();};
 }
          if(cr.bool(0.3)){
   const options=[...new Set(endWords)].filter(x=>x.trim().toLowerCase()!==endLabel.trim().toLowerCase());
   if(options.length){const label=cr.pick(options),decoy=u.el('button','end-xtra',tools(),label);decoy.type='button';decoy.dataset.role='xtra';decoy.onclick=()=>env.log('decoy',{label,collide:true});}
 }
          Object.assign(_c, { tools });
        },
        'overlay.14': (base, S) => function (_c) {
          const { box, ctx, dismiss, kind, o, u } = _c;
          dismiss.onclick=()=>ctx.dismiss(kind==='cookie'?'reject':'close');
          if(o==='privacy'||kind==='cookie'&&!o){const accept=u.el('button','dismiss',box,'Accept optional');accept.type='button';accept.onclick=()=>ctx.dismiss('accept');}
        },
        'overlay.15': () => () => {},
      },
    },
  });
})();
