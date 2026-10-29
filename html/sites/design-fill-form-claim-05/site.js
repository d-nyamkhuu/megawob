// Design on the base site template.
(function () {
  'use strict';
  const icon = (name) => {
    const paths={document:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h4M9 11h6M9 14h6M9 17h5"/>',home:'<path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',shield:'<path d="m12 3 8 3v6c0 4-4 7-8 10-4-3-8-6-8-10V6z"/>',bank:'<path d="m3 9 9-6 9 6zM3 21h18M5 18V11M10 18V11M14 18V11M19 18V11M4 18h16"/>',plus:'<path d="M12 4v16M4 12h16"/>',folder:'<path d="M3 6h7l2 3h9v12H3zM3 9h18"/>'};
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.document)+'</svg>';
  };
  env.site({
    name: 'design-fill-form-claim-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {
      TITLES: ['Document to Form'],
      parts: {
        overlay: (base) => function (ctx) {
          const result=base(ctx);
          if(ctx.kind==='banner'){
            const header=document.querySelector('.ref-task');
            header.after(result.el);
            result.el.classList.add('claim-announcement');
            result.el.style.setProperty('--claim-banner-top',header.getBoundingClientRect().bottom+'px');
            const pane=document.querySelector('.ff-scan-fields');
            if(pane)pane.dispatchEvent(new Event('scroll'));
          }
          return result;
        },
        endLabel: (base) => (rng, content) => {
          const label = base(rng, content);
          return rng.fork('claim/end-label').bool(0.5) ? 'Confirm' : label;
        },
        frame: (base) => function (ctx) {
          const result = base(ctx);
          const u = ctx.util;
          document.body.classList.add('claim-native');
          const header = document.querySelector('.ref-task');
          const note = header.querySelector('.ref-instruction');
          const tools = Array.from(document.querySelectorAll('.ref-tools > .ref-xtra'));
          const finish = result.submit;
          header.replaceChildren();
          const bar = u.el('div', 'claim-titlebar', header);
          const lights = u.el('div', 'claim-lights', bar);
          ['close','minimize','zoom'].forEach(name => { const dot=u.el('span',name,lights);dot.setAttribute('aria-hidden','true'); });
          u.el('div', 'claim-app-title', bar, 'Document to Form');
          const nav = u.el('nav', 'claim-top-nav', bar);
          [['home','Documents'],['document','Form Fill'],['clock','History']].forEach(([symbol,label],index) => {
            const b=u.el('button',index===1?'selected':'',nav);
            u.el('span','claim-nav-icon',b).innerHTML=icon(symbol);u.el('span','',b,label);
            b.addEventListener('click',()=>env.log('decoy',{what:'nav',label}));
          });
          const search = u.el('div', 'claim-search', bar);
          u.el('span','',search,'⌕');
          const input=u.el('input','',search);input.placeholder='Search';input.setAttribute('aria-label','Search');
          const end=u.el('div','claim-end-tools',bar);
          tools.forEach(b=>end.appendChild(b));
          if(finish){finish.classList.remove('ref-float');end.appendChild(finish);}
          if(note) {const row=u.el('div','claim-header-note',header);row.appendChild(note);}
          document.querySelectorAll('.ref-foot,.ref-float-dock').forEach(n=>n.remove());
          const body=document.querySelector('.ref-body');
          body.classList.remove('ref-panel-right');
          const oldSide=body.querySelector('.ref-side');if(oldSide)oldSide.remove();
          const side=u.el('aside','claim-sidebar');
          body.prepend(side);
          [['document','All Documents'],['shield','Insurance'],['bank','Banking'],['plus','Medical'],['document','Utilities'],['folder','Other']].forEach(([symbol,label],index)=>{
            const b=u.el('button',index===0?'selected':'',side);u.el('span','claim-side-icon',b).innerHTML=icon(symbol);u.el('span','',b,label);
            b.addEventListener('click',()=>env.log('decoy',{what:'sidebar',label}));
          });
          const panel=body.querySelector('.ref-panel');
          if(panel) {panel.classList.add('claim-task-note');side.appendChild(panel);}
          const toast=document.querySelector('.ref-note');
          if(toast){toast.classList.add('claim-task-note','claim-note-toast');side.appendChild(toast);}
          result.stage.classList.add('claim-stage');
          return result;
        },
      },
    },
  });
})();
