/* TaskLab: Swiss editorial strip on the shared site frame. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Notice',promo:'Support TaskLab',banner:'Service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      u.el('p','survey-intro',el,{chat:'Quick survey: how easy was this exercise?',cookie:'TaskLab can remember your display preferences.',toast:'Your progress was saved.',promo:'Discover more TaskLab exercises.',banner:'Exercises are available offline.'}[ctx.kind]);
      const dismiss=u.el('button','primary survey-close',el,ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  const palette = { bg:'#fff', panel:'#fff', fg:'#111', muted:'#444', line:'#dcdcdc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has dedicated note positions even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = `swiss instruction-${_c.display}`;
      const head = u.el('header','sw-header',document.body);
      const brand = u.el('div','sw-brand',head);
      u.el('h1','',brand,'TaskLab');u.el('i','',brand);
      const nav = u.el('nav','sw-nav',head);
      for (const [t,on] of [['Tasks',1],['Help',0],['Account',0]]) u.el('span',on?'on':'',nav,t);
      const prog = u.el('div','sw-progress',head);
      u.el('span','',prog,'Exercise 3 of 8');
      const bar = u.el('div','bar',prog);u.el('b','',bar);
      const toolbar = u.el('div','sw-head-tools',head);
      const intro = u.el('section','sw-intro',document.body);
      u.el('div','sw-num',intro,'03');
      const copy = u.el('div','sw-copy',intro);
      if (_c.display !== 'panel') u.el('div','sw-kicker',copy,'ADJUST VALUES');
      Object.assign(_c, { header:copy, toolbar, intro });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = document.body; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) title.textContent = 'ADJUST VALUES';
      const note = _c.header.querySelector('.ref-panel-text');
      if (note) note.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main','sw-stage',document.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction');
        _c.header.appendChild(note);
        note.querySelector('.ref-note-x').textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = u.el('footer','sw-footer',document.body);
      const reset = u.el('button','reset',footer,'Reset');
      reset.type = 'button';reset.dataset.action = 'reset';
      const right = u.el('div','sw-right',footer);
      const show = u.el('button','ghost',right,'Show target values');
      show.type = 'button';show.setAttribute('aria-disabled','true');
      const foot = document.body.querySelector('.ref-foot');
      right.appendChild(foot);
      _c.right = right;
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-range-10',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{
      THEMES:{'design-set-slider-range-10':palette},
      LOW_THEME:palette,
      ACCENTS:['#f33223'],
      LOW_ACCENTS:['#f33223'],
      parts,
    },
  });
})();
