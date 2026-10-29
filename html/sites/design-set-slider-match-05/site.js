// Fluent Photos workspace, with the shared episode controls and contract.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-match-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {parts: {
      frame: (base, S) => (ctx) => {
        const {util, rng, content} = ctx;
        const el = (t,c,p,text) => util.el(t,c,p,text);
        const W = document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--ui', Math.max(.78, W / 1536));
        document.documentElement.style.setProperty('--accent', '#0067c9');
        document.body.className = 'photos-app';
        let display = ctx.display || 'header';
        if (W < 1260 && (display === 'panel' || display === 'toast')) display = 'header';
        document.body.dataset.note = display;
        const shell = el('div','photos-window',document.body);
        const title = el('header','photos-title',shell);
        const logo = el('span','photos-logo',title);
        logo.innerHTML = '<svg viewBox="0 0 24 24"><defs><linearGradient id="p" x2="0" y2="1"><stop stop-color="#65c3ed"/><stop offset="1" stop-color="#0078bc"/></linearGradient></defs><rect width="24" height="24" rx="2" fill="url(#p)"/><circle cx="17" cy="6" r="2" fill="white"/><path d="M0 19 8 8 15 15 18 11 24 20v4H0" fill="#00649d"/><path d="m2 21 7-10 9 13H2" fill="#008bcb"/></svg>';
        el('span','photos-app-name',title,'Photos');
        const windowTools = el('div','window-tools',title);
        for (const [name, path] of [['Minimize','M5 12h14'],['Maximize','M6 6h12v12H6z'],['Close','m6 6 12 12M18 6 6 18']]) {
          const b=el('button','window-control',windowTools); b.title=name;b.setAttribute('aria-label',name);
          b.innerHTML='<svg viewBox="0 0 24 24"><path d="'+path+'"/></svg>';
        }
        const toolbar = el('nav','photos-toolbar',shell);
        const icons = [
          '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="m6 16 4-5 4 4 3-3 3 4M2 7v11m20-10v10"/><circle cx="14" cy="8" r="1.5"/>',
          '<path d="M5 5h10M4 9v11h15v-8M3 4h3v3H3zM18 18h3v3h-3z"/><path d="m9 15 2-5L20 2l3 3-9 9-5 1" stroke="#0067c9"/>',
          '<circle cx="12" cy="7" r="5"/><circle cx="7" cy="15" r="5"/><circle cx="17" cy="15" r="5"/>',
          '<path d="M2 5h20M2 12h20M2 19h20"/><circle cx="9" cy="5" r="2" fill="#faf9f7"/><circle cx="17" cy="12" r="2" fill="#faf9f7"/><circle cx="8" cy="19" r="2" fill="#faf9f7"/>',
          '<path d="M5 2v17h17M2 5h17v17M9 15l6-6"/>'
        ];
        ['Gallery','Edits','Filters','Adjust','Crop'].forEach((name,i)=>{
          const b=el('button','photos-tab'+(i===1?' selected':''),toolbar);
          b.innerHTML='<svg viewBox="0 0 24 24">'+icons[i]+'</svg><span>'+name+'</span>';
          b.addEventListener('click',()=>env.log('decoy',{label:name}));
        });
        const headerTools = el('div','photos-actions',toolbar);
        const note = (parent,cls) => {
          const n=el('aside','photos-note '+cls,parent);
          el('span','note-symbol',n,'ⓘ'); el('div','note-copy',n,ctx.instruction);
          return n;
        };
        if(display==='header') note(shell,'header-note');
        const body = el('div','photos-body',shell);
        const stage = el('main','photos-stage',body);
        if(display==='panel') note(body,'panel-note');
        if(display==='toast') note(toolbar,'toast-note');
        const footer=el('footer','photos-footer',shell);
        const tip=el('div','photos-tip',footer);
        const bulb=el('span','tip-bulb',tip);
        bulb.innerHTML='<svg viewBox="0 0 24 28"><path d="M7 22h10M9 25h6M8 20c0-4-4-5-4-10a8 8 0 0 1 16 0c0 5-4 6-4 10z"/></svg>';
        el('strong','tip-label',tip,'Tip');
        el('span','tip-copy',tip,'Presets show the exact brightness and contrast values for each look.');
        const footTools=el('div','photos-actions',footer);
        const r=rng.fork('chrome/end');
        const placement=r.pick(['footer','footer','footer','header','link','header']);
        const label=r.bool(.5)?'Continue':content.endLabel(r);
        const {collide}=S.frameCollide({rng,content,word:null},label);
        const extra=(parent,text,collision)=>{
          const b=el('button','photos-extra',parent,text);b.type='button';
          b.addEventListener('click',()=>env.log('decoy',collision?{label:text,collide:true}:{label:text}));
        };
        if(collide) extra(headerTools,collide.text,true);
        if(r.bool(.25)) extra(headerTools,r.pick(['Undo','Help']),false);
        let submit=null;
        if(!ctx.finish){
          const parent=placement==='header'?headerTools:footTools;
          submit=el(placement==='link'?'a':'button',placement==='link'?'photos-end-link':'photos-end',parent,label);
          submit.dataset.role='submit';submit.title=label;submit.setAttribute('aria-label',label);
          if(submit.tagName==='A') submit.href='#'; else submit.type='button';
          submit.addEventListener('click',e=>{e.preventDefault();ctx.submit();});
        }
        return {stage,submit};
      },
      overlay: (base) => (ctx) => {
        const result=base(ctx);
        result.el.classList.add('photos-overlay');
        result.dismiss.textContent='Dismiss';
        return result;
      }
    }},
  });
})();
