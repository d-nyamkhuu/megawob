/* Civic-service frame, seeded task instruction and dismissible episode notices. */
(function () {
  'use strict';
  function books(parent) {
    const svg = env.util.svg('svg', {viewBox:'0 0 100 100',class:'books', 'aria-hidden':'true'}, parent);
    const u = env.util;
    u.svg('ellipse',{cx:50,cy:86,rx:44,ry:7,fill:'#c9c4b7'},svg);
    for (const [x,y,w,h,color,angle] of [[12,17,14,68,'#c1a17d',8],[31,13,16,74,'#be986d',1],[47,9,19,79,'#994527',0],[67,17,22,68,'#954c32',-2]]) {
      const g=u.svg('g',{transform:`rotate(${angle} ${x+w/2} ${y+h})`},svg);
      u.svg('path',{d:`M${x} ${y}l6 -3h${w}v${h}l-6 3h-${w}Z`,fill:color,stroke:'#50392b','stroke-width':1.4},g);
      u.svg('path',{d:`M${x} ${y}h${w}v${h}M${x+w} ${y}l6 -3M${x+3} ${y+6}h${w-6}M${x+3} ${y+11}h${w-6}M${x+3} ${y+h-8}h${w-6}`,fill:'none',stroke:'#513b2c'},g);
      u.svg('path',{d:`M${x+4} ${y+18}h${w-8}M${x+4} ${y+21}h${w-8}`,stroke:'#dabf96',fill:'none'},g);
    }
  }
  function drawOverlay(ctx) {
      const u=ctx.util;
      const el=u.el('aside','survey-drawer overlay-'+ctx.kind,document.body);el.setAttribute('role','dialog');
      const survey=ctx.kind==='chat';
      const title={chat:'We value your feedback',cookie:'Your privacy matters',toast:'Display settings notice',promo:'Community services',banner:'City service notice'}[ctx.kind];
      u.el('h2','',el,title);
      const x=u.el('button','survey-x',el,'×');x.setAttribute('aria-label','Close notice');x.onclick=()=>ctx.dismiss('close');
      if(survey){
        u.el('p','survey-intro',el,'Quick survey (2 questions)');u.el('hr','',el);
        const q1=u.el('div','survey-question',el,'1. How easy was it to find what you needed today?');
        const choices=u.el('div','survey-choices',el);
        ['Very easy','Somewhat easy','Neither easy nor difficult','Somewhat difficult','Very difficult'].forEach((label)=>{
          const row=u.el('label','',choices);const radio=u.el('input','',row);radio.type='radio';radio.name='ease';radio.value=label;u.el('span','',row,label);
        });
        u.el('div','survey-question second',el,'2. What could we improve?');
        const dropdown=u.el('div','survey-dropdown',el);
        const toggle=u.el('button','survey-select',dropdown,'Select an option…');toggle.type='button';toggle.setAttribute('aria-expanded','false');
        const options=u.el('div','survey-options',dropdown);options.hidden=true;
        for(const label of ['Finding records','Image quality','Help and guidance']){const b=u.el('button','',options,label);b.type='button';b.onclick=()=>{toggle.textContent=label;options.hidden=true;toggle.setAttribute('aria-expanded','false');};}
        toggle.onclick=()=>{options.hidden=!options.hidden;toggle.setAttribute('aria-expanded',String(!options.hidden));};
      }else{
        u.el('p','survey-intro',el,{cookie:'This service can remember your display preferences.',toast:'The display settings are ready for editing.',promo:'Explore your city’s community services.',banner:'Display settings are available offline.'}[ctx.kind]);
      }
      const dismiss=u.el('button','primary survey-close',el,survey?'Close survey':ctx.kind==='cookie'?'Reject optional':'Dismiss');dismiss.type='button';dismiss.onclick=()=>ctx.dismiss('dismiss');
      return {el,dismiss,ttlSteps:ctx.kind==='toast'?5:0};
  }
  const palette = { bg:'#fff', panel:'#fff', fg:'#08163d', muted:'#4a5568', line:'#cfd6df' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The civic page has its own space for all four note displays.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('library', 'civic', 'instruction-' + _c.display);
      const head = u.el('header','civic-header',document.body);
      const logo = u.svg('svg',{viewBox:'0 0 60 56',class:'civic-logo','aria-hidden':'true'},head);
      u.svg('path',{d:'M30 2 L58 16 V22 H2 V16 Z',fill:'#fff'},logo);
      for (const x of [10,26,42]) u.svg('rect',{x,y:22,width:8,height:26,fill:'#fff'},logo);
      u.svg('rect',{x:2,y:48,width:56,height:6,fill:'#fff'},logo);
      const brand = u.el('div','civic-brand',head);
      u.el('div','civic-name',brand,'Riverton City');
      u.el('div','civic-sub',brand,'Community Services');
      const nav = u.el('nav','civic-nav',head);
      for (const t of ['My Account','Help','Sign Out']) u.el('span','',nav,t);
      const main = u.el('div','civic-main',document.body);
      Object.assign(_c, { header:head, main });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.main;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => {
      // A generic hint avoids the widget's target-specific hint rewrite.
      _c.hint = _c.util.el('p','civic-guidance',_c.main,
        'Adjust the setting using the slider on the right. The current value is shown below the slider.');
      _c.body = document.body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      if (_c.display === 'panel') _c.main.insertBefore(_c.main.querySelector('.ref-panel'), _c.hint);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main','record-stage',document.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.main.insertBefore(note, _c.hint);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = _c.util.el('div','civic-footer',document.body);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-vertical-02',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css','site.css'],
    design:{ THEMES:{'design-set-slider-vertical-02':palette}, LOW_THEME:palette,
      ACCENTS:['#1f6fb5'], LOW_ACCENTS:['#1f6fb5'], parts },
  });
})();
