(function () {
  'use strict';
  env.site({
    name: 'design-solve-puzzle-compute-03', template: 'site/base', styles: ['site.css'],
    design: { parts: {
    frame: (base, S) => function frame(ctx) {
      const u = ctx.util;
      document.body.className = 'lisa mode-' + ctx.display;
      const r = ctx.rng.fork('chrome/end');
      const labels = (ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply']).map(x => typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const place = r.bool(.55) ? 'toolbar' : r.pick(['footer','link','icon']);
      const label = r.bool(.55) ? 'Done' : r.pick(labels);
      document.body.classList.add('end-' + place);
      const app = u.el('main','app',document.body);
      const bar = u.el('header','titlebar',app);
      const glyph = u.svg('svg',{viewBox:'0 0 30 34',width:30,height:34,class:'title-glyph'},bar);
      u.svg('path',{d:'M4 2h15l7 7v23H4z M19 2v8h7',fill:'none',stroke:'currentColor','stroke-width':2},glyph);
      const title = u.el('div','caption',bar,'Workbook');
      if (ctx.display === 'header') u.el('span','header-note',title,' — '+ctx.instruction);
      if (ctx.display === 'panel') u.el('span','header-note panel-fallback',title,' — '+ctx.instruction);
      const wc = u.el('div','window-controls',bar);
      for (const symbol of ['−','□','×']) u.el('span','window-control',wc,symbol);
      const menu = u.el('nav','menu',app);
      for (const item of ['File','Edit','View','Insert','Format','Tools','Window','Help']) u.el('span','menu-item',menu,item);
      const toolbar = u.el('div','toolbar',app);
      const icons = [
        '<path d="M8 2h20l8 8v31H8z M28 2v9h8"/>','<path d="M3 13h13l4-4h19v25H3z M3 16h36l-4 21H7z"/>',
        '<path d="M9 4h24v10H9z M5 15h32v18H5z M10 26h22v14H10z M14 30h14"/>',
        '<path d="M12 3l18 36 M30 3L12 39"/><circle cx="10" cy="38" r="4"/><circle cx="32" cy="38" r="4"/>',
        '<path d="M6 3h22l7 7v29H6z M13 8h19v25H13z M28 3v8h7"/>',
        '<path d="M5 8h32v33H5z M12 4h18v6H12z M10 14h22v21H10z M14 19h14 M14 24h14 M14 29h14"/>',
        '<path d="M4 39L19 4h4l15 35 M10 28h22"/>','<path d="M4 7h34 M4 16h24 M4 25h34 M4 34h24"/>',
        '<path d="M3 4h37v35H3z M3 14h37 M3 24h37 M14 4v35 M27 4v35"/>'
      ];
      icons.forEach((html,i) => { const box=u.el('span','tool tool-'+i,toolbar); const svg=u.svg('svg',{viewBox:'0 0 44 44',width:42,height:42},box); u.svg('g',{fill:'none',stroke:'currentColor','stroke-width':2},svg).innerHTML=html; });
      const actions = u.el('div','toolbar-actions',toolbar);
      let submit = null;
      if (!ctx.finish && ['toolbar','icon'].includes(place)) submit = u.el('button','end-control'+(place==='icon'?' icon-control':''),actions,place==='icon'?'✓':label);
      const cr=ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(.3)) { const pool=[...new Set(labels.filter(x=>x.trim().toLowerCase()!==label.trim().toLowerCase()))]; if(pool.length){const text=cr.pick(pool),extra=u.el('button','extra-control',actions,text);extra.type='button';extra.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));} }
      const work=u.el('div','workspace',app), stage=u.el('section','stage',work), side=u.el('aside','help-pane',work);
      if (ctx.display==='panel') u.el('div','panel-note',side,ctx.instruction);
      u.el('div','help-heading',side,'Help'); u.el('div','tips-heading',side,'Tips');
      const list=u.el('ul','tips',side);
      const tips = ['Review the information in the workbook.','Use the controls to enter a response.','Use the keyboard in text boxes.'];
      for (const tip of tips) u.el('li','',list,tip);
      if (!ctx.finish && ['footer','link'].includes(place)) {const foot=u.el('footer','footer',app);submit=u.el(place==='link'?'a':'button','end-control'+(place==='link'?' text-control':''),foot,place==='link'?'Finish task':label);if(place==='link')submit.href='#';}
      if (ctx.display==='toast') {const note=u.el('div','instruction-toast',app);u.el('span','info-mark',note,'i');u.el('span','',note,ctx.instruction);const close=u.el('button','toast-close',note,'×');close.type='button';close.addEventListener('click',()=>note.remove());}
      if (submit) {if(submit.tagName==='BUTTON')submit.type='button';submit.setAttribute('aria-label',place==='icon'?'Finish':place==='link'?'Finish task':label);submit.title=place==='icon'?'Finish':label;submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});}
      return {stage,submit};
    },
    overlay: (base, S) => function overlay(ctx) {
      const u=ctx.util,el=u.el('div','overlay overlay-'+ctx.kind,document.body);
      const text={cookie:'This application stores preferences on your device.',toast:'Your workbook has been updated.',chat:'Need help with this workbook?',promo:'Explore more workbook exercises.',banner:'An updated workbook is available.'};
      u.el('span','overlay-text',el,text[ctx.kind]||'Notice');
      const dismiss=u.el('button','overlay-dismiss',el,ctx.kind==='cookie'?'Accept':'×');dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
    }
    } }
  });
})();
