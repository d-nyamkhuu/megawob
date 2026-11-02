(function(){
  'use strict';
  const palette = { bg:'#f5f8fb', panel:'#fff', fg:'#142b4b', muted:'#385477', line:'#d7e1eb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      for (const mode of ['header','panel','toast','hidden']) document.body.classList.toggle('ds-display-'+mode, _c.display===mode);
    },
    'frame.placement': (base) => (_c) => { base(_c); _c.wantFooter=true; _c.nav=false; _c.sidebar=false; },
    'frame.header': () => (_c) => {
      if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
      const selection=window.getSelection(); if(selection)selection.removeAllRanges();
      const u=_c.util;
      const top=u.el('header','ds-top',document.body);
      u.el('span','ds-brand',top,'Shape Catcher');
      const controls=u.el('div','ds-window-meta',top);
      ['−','□','×'].forEach(t=>{const b=u.el('button','',controls,t);b.type='button';});
      _c.header=top;
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note=_c.header.querySelector('.ref-instruction');
      if(note)note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => {
      const u=_c.util;
      const content=u.el('div','ds-content',document.body);
      const main=u.el('div','ds-main',content);
      const brief=u.el('aside','ds-brief',main);
      Object.assign(_c,{contentBox:content,body:main,brief});
    },
    'frame.panel': (base) => (_c) => {
      const body=_c.body; _c.body=_c.brief; base(_c); _c.body=body;
      const u=_c.util, brief=_c.brief;
      u.el('div','ds-guidance',brief,'Shapes move around the board automatically. The workspace controls are below.');
      u.el('div','ds-time-label',brief,'Time remaining');
      u.el('div','ds-time-value',brief,'00:24');
      u.el('div','ds-time-meter',brief).innerHTML='<i></i>';
      u.el('div','ds-left-label',brief,'Shapes left');
      u.el('div','ds-left-value',brief,'5');
    },
    'frame.stage': () => (_c) => { _c.stage=_c.util.el('main','ds-stage',_c.body); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note=document.body.querySelector('.ref-note');
      if(note){note.classList.add('ds-note');note.querySelector('.ref-note-x').classList.add('ds-note-close');_c.header.appendChild(note);}
    },
    'frame.footer': (base) => (_c) => {
      const u=_c.util;
      const foot=u.el('footer','ds-footer',_c.contentBox);
      const pause=u.el('button','ds-tool ds-pause',foot,'Pause');pause.type='button';
      const speed=u.el('div','ds-tool-group ds-speed',foot);
      u.el('span','',speed,'Speed');u.el('i','ds-slider',speed).innerHTML='<b></b>';u.el('span','',speed,'Medium');
      const size=u.el('div','ds-tool-group ds-size',foot);
      u.el('span','',size,'Board size');
      ['▦','▦','▦'].forEach((t,i)=>{const b=u.el('button','ds-size-button'+(i===1?' active':''),size,t);b.type='button';});
      const show=u.el('label','ds-check',foot);u.el('span','ds-checkmark',show,'✓');u.el('span','',show,'Show non-purple shapes');
      base(_c);
      foot.appendChild(document.body.querySelector('.ref-foot'));
      _c.foot=foot;
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    }
  };
  env.site({
    name:'design-act-in-time-moving-04', template:'site/base', langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{THEMES:{site:palette},LOW_THEME:palette,ACCENTS:['#1678ee'],LOW_ACCENTS:['#1678ee'],parts}
  });
})();
