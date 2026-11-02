// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  env.site({
    name: 'design-use-slides-reorder-05',
    template: 'site/base',
    styles: ['site.css'],
    design: {parts:{
      'frame.placement': (base, S) => function(c) {
        base(c);
        c.einkNativeFooter=c.wantFooter;
        const r=c.ctx.rng.fork('eink/end');
        if (!c.ctx.finish) {
          c.placement=r.pick(['footer','footer','footer','header','link','icon']);
          if(r.bool(0.5)||c.placement==='footer') c.label='Finish';
          if(c.collide && c.collide.text===c.label) c.collide.text=c.content.collideLabel(r,c.label);
        }
        c.wantFooter=c.placement==='footer'||c.placement==='link';
      },
      'frame.header': (base, S) => function(c) {
        base(c);
        const title=c.util.el('div','e-windowtitle',c.header);
        c.util.el('span','e-windowicon',title,'▣');
        c.util.el('span','',title,'Strategy Review — Presentation');
        c.util.el('span','e-windowbuttons',title,'—　 □　 ×');
        c.header.prepend(title);
      },
      'frame.panel': (base,S) => function(c) {
        base(c);
        c.body.classList.remove('ref-panel-right');
        const heading=c.body.querySelector('.ref-panel-title');
        if(heading)heading.textContent='Task';
      },
      'frame.footer': (base,S) => function(c) {
        const wanted=c.wantFooter;
        c.wantFooter=c.einkNativeFooter;
        base(c);
        c.wantFooter=wanted;
        let foot=document.querySelector('.ref-foot');
        if(!wanted && foot){foot.remove();foot=null;}
        if(wanted && !foot) {
          foot=c.util.el('footer','ref-foot',document.body);
          c.util.el('span','ref-foot-text',foot);
          const tools=c.util.el('div','ref-tools',foot);
          if(c.decoys.length>1)c.decoyBtn(tools,c.decoys[1]);
          if(c.collide && c.collide.where==='footer')c.decoyBtn(tools,c.collide.text,true);
          c.submit=c.endBtn(tools,c.placement==='link'?'ref-endlink':'ref-submit',c.label);
        }
        const t=document.querySelector('.ref-foot-text');
        if(t)t.textContent='';
      },
      overlay: (base,S) => function(ctx) {
        const out=base(ctx);
        if(ctx.kind==='banner') {
          const menu=document.querySelector('.e-menu');
          const header=document.querySelector('.ref-task');
          out.el.style.top=(menu?menu.getBoundingClientRect().bottom:header.getBoundingClientRect().bottom)+'px';
          out.dismiss.textContent='×';
          out.dismiss.setAttribute('aria-label','Dismiss');
        }
        return out;
      }
    }},
  });
})();
